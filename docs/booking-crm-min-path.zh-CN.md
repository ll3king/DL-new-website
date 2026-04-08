# Booking Confirmation Email + Google Sheets CRM 最小落地路径

本文档对应当前仓库中的 `functions/api/bookings.js`、`functions/api/admin/bookings.js` 与 `functions/api/_booking.js` 实现。

## 1. 环境变量

必填：

- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `SPREADSHEET_ID`
- `ADMIN_PASSWORD`
- `ALLOWED_ORIGIN`
- `RESEND_API_KEY`
- `BOOKING_FROM_EMAIL`

可选：

- `BOOKING_REPLY_TO`

说明：

- `ADMIN_PASSWORD` 不再有默认值；未配置时管理端接口直接返回 500。
- `ALLOWED_ORIGIN` 用于 admin 与 booking API 的 CORS 返回头；未配置时 fallback 为 `*`。

## 2. Google Sheets 结构

函数会在首次写入时自动确保以下工作表存在，并补齐表头：

### `Sheet1`

- A `name`
- B `email`
- C `mobile`
- D `group_size`
- E `date`
- F `time`
- G `created_at`
- H `status`
- I `source`
- J `email_sent_at`
- K `email_type`
- L `email_status`
- M `email_error`

### `Guests`

范围固定为 `Guests!A:J`：

- A `email_normalized`
- B `email`
- C `name`
- D `mobile`
- E `first_booking_at`
- F `last_booking_at`
- G `booking_count`
- H `last_group_size`
- I `last_booking_date`
- J `last_status`

### `GuestEvents`

范围固定为 `GuestEvents!A:F`：

- A `event_at`
- B `event_type`
- C `email_normalized`
- D `booking_row`
- E `booking_status`
- F `details`

## 3. `/api/bookings` 行为

1. 校验 `name/email/date/time`
2. 追加写入 `Sheet1!A:M`
3. 根据人数发送 Resend 邮件
   - `group_size <= 6` -> `confirmed`
   - `group_size > 6` -> `pending_review`
4. 回写 `Sheet1!J:M`
   - `email_sent_at`
   - `email_type`
   - `email_status`
   - `email_error`
5. Upsert `Guests`
   - 按 email 小写去空格后的值去重
6. Append `GuestEvents`
   - `event_type = booking_created`

注意：

- 即使发信失败，booking 仍会保留，`email_status` 会写成 `failed`，错误消息写入 `email_error`。

## 4. `/api/admin/bookings` 行为

### GET

- 必须携带 `Authorization: Bearer <ADMIN_PASSWORD>`
- 返回 `Sheet1!A2:M200` 映射后的 booking 列表
- 响应包含邮件追踪字段：
  - `email_sent_at`
  - `email_type`
  - `email_status`
  - `email_error`

### PATCH

支持：

- `action = approve`
- `action = archive`

其中 `approve` 会执行：

1. 将 `Sheet1` 对应行的状态更新为 `Confirmed`
2. 发送 `approval_confirmed` 邮件
3. 回写 `Sheet1!J:M`
4. 更新 `Guests`
   - 不重复增加 `booking_count`
   - 更新最后状态为 `Confirmed`
5. 追加 `GuestEvents`
   - `event_type = booking_confirmed`

## 5. Resend 邮件约定

- 发信地址来自 `BOOKING_FROM_EMAIL`
- `BOOKING_REPLY_TO` 存在时写入 `reply_to`
- 当前邮件类型：
  - `confirmed`
  - `pending_review`
  - `approval_confirmed`

## 6. 最小验证路径

### 创建 booking

```bash
curl -i -X POST "$BASE_URL/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test Guest",
    "email":"guest@example.com",
    "mobile":"0400000000",
    "group_size":"4",
    "date":"2026-04-20",
    "time":"18:00"
  }'
```

预期：

- `Sheet1` 新增一行
- `Sheet1!J:M` 有邮件追踪值
- `Guests` 有对应 email 的 upsert 记录
- `GuestEvents` 新增 `booking_created`
- 收件箱收到确认邮件

### 审批 booking

```bash
curl -i -X PATCH "$BASE_URL/api/admin/bookings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -d '{
    "id":"2",
    "action":"approve"
  }'
```

预期：

- `Sheet1!H{id}` 变为 `Confirmed`
- `Sheet1!J:M` 被更新，`email_type=approval_confirmed`
- `Guests` 的 `last_status` 变为 `Confirmed`
- `GuestEvents` 新增 `booking_confirmed`
- 收件箱收到审批确认邮件

## 7. 无法做全自动集成测试时的建议

如果本地或预览环境没有真实的 `GOOGLE_SERVICE_ACCOUNT_JSON` / `SPREADSHEET_ID` / `RESEND_API_KEY`：

- 先执行 `npm run build` 和代码 grep，确认实现已落地
- 再把上述环境变量补齐到 Cloudflare Pages / 本地运行环境
- 按本文档中的两条 `curl` 路径做最小联调验证
