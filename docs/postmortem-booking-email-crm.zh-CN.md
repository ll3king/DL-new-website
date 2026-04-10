# Booking Email + Sheets CRM Post Mortem

日期：2026-04-10  
分支：`feature/email-confirmation-verification`  
PR：`#1`

## 1. 背景与目标

本轮工作的目标是把 Dandy Lane Cafe 网站中的 booking 流程，从“只写入预约表”提升到“可发确认邮件 + 可追踪邮件状态 + 可沉淀轻量 CRM”。

明确目标：

- 预约创建后自动发送邮件
- 大桌与普通桌走不同邮件路径
- admin approve 后补发确认邮件
- 在 Google Sheets 中记录邮件发送状态
- 在 Google Sheets 中维护基础 CRM 数据
- 所有改动不直接落在 `main`

## 2. 本次实现范围

实现文件：

- `functions/api/bookings.js`
- `functions/api/admin/bookings.js`
- `functions/api/_booking.js`
- `docs/booking-crm-min-path.zh-CN.md`

实现内容：

- `POST /api/bookings`
  - booking 写入 `Sheet1`
  - `group_size <= 6` 发送 `confirmed`
  - `group_size > 6` 发送 `pending_review`
  - 回写 `Sheet1!J:M`
  - upsert `Guests`
  - append `GuestEvents.booking_created`
- `GET /api/admin/bookings`
  - 返回 booking 基础字段
  - 返回 `email_sent_at / email_type / email_status / email_error`
- `PATCH /api/admin/bookings`
  - `approve` 时发送 `approval_confirmed`
  - 更新 `Sheet1!J:M`
  - 更新 `Guests`
  - append `GuestEvents.booking_confirmed`
- 配置层
  - admin 默认密码 fallback 已移除
  - 支持 `ALLOWED_ORIGIN`
  - 邮件通过 Resend 发送

## 3. 最终功能状态

目前已完成并验证：

- booking 普通桌确认邮件
- booking 大桌待审核邮件
- admin approve 后确认邮件
- `Sheet1` 邮件追踪列写入
- `Guests` upsert
- `GuestEvents` append
- Resend 后台可见送达记录
- preview 环境变量已完成配置

当前系统已经具备以下业务能力：

- 客人提交预约后，系统自动决定邮件类型
- 店方在 admin 批准后，系统自动补发确认邮件
- 邮件发送状态不会只停留在 API 日志，而是会落到 Sheet 中
- 基于 email 的基础 CRM 已形成，可查看客人累计预约与事件轨迹

## 4. 验证结果

代码验证：

- `npm run build` 成功
- 关键实现 grep 已命中：
  - `api.resend.com/emails`
  - `email_status`
  - `approval_confirmed`
  - `Guests!A:J`
  - `GuestEvents!A:F`

预览环境黑盒验证：

- `POST /api/bookings` 小桌
  - 返回 `booking_status=Confirmed`
  - 返回 `email_status=sent`
  - 返回 `email_type=confirmed`
- `POST /api/bookings` 大桌
  - 返回 `booking_status=Manual_Review`
  - 返回 `email_status=sent`
  - 返回 `email_type=pending_review`
- admin 未授权访问
  - 返回 `401`
- admin approve
  - 可执行
  - approve 后邮件追踪与 CRM 事件被更新

人工验证：

- Resend 面板出现 `Delivered`
- `Sheet1!J:M` 有值
- `Guests` 表出现对应 email 记录
- `GuestEvents` 表出现 `booking_created` 与 `booking_confirmed`

## 5. 项目进度判断

本阶段目标完成度判断：

- Booking Email：已完成
- Email Tracking：已完成
- Sheets CRM：已完成
- Admin 审批联动：已完成
- 文档：已完成

整体进度判断：

- 本轮需求完成度约为 `95%`

剩余 5% 主要不是功能缺失，而是上线后治理项：

- 正式环境域名的 `ALLOWED_ORIGIN` 收紧
- 密钥轮换与权限治理
- 邮件投递质量持续观察

## 6. 做对了什么

- 没有把逻辑散落在多个函数中，而是抽出 `_booking.js` 统一处理 Sheets 和 Resend
- 邮件状态被写回表格，排障成本明显降低
- CRM 只用 Google Sheets，不引入额外数据库，复杂度可控
- approve 不重复累加 `Guests.booking_count`，避免数据污染
- 从一开始就在分支上完成，不污染 `main`

## 7. 暴露出的问题

- 预览环境的 `Access-Control-Allow-Origin` 仍是 `*`
  - 说明当前 `ALLOWED_ORIGIN` 还没有被收紧到正式域名，或预览环境没有单独覆盖
- 运行手册文档在部分终端中出现中文编码显示问题
  - 文件内容本身可用，但后续建议统一 UTF-8 with BOM 或确认查看工具编码
- 截图中暴露了敏感配置
  - 包括 `ADMIN_PASSWORD`、`RESEND_API_KEY`、`SPREADSHEET_ID`
  - 这些值不应继续沿用

## 8. 风险与建议

短期建议：

- 立即轮换：
  - `ADMIN_PASSWORD`
  - `RESEND_API_KEY`
- 检查 `ALLOWED_ORIGIN`
  - 正式环境建议改为正式站点域名
- 在 Resend 后台继续观察：
  - delivered
  - bounced
  - spam placement

中期建议：

- 增加 staff notification email
  - 新 booking 时发给店内邮箱
  - approve 时发给店内邮箱
- 增加 booking id / external reference
  - 便于 admin 操作与事件追踪
- 增加 basic audit log
  - 记录是谁 approve / archive

长期建议：

- 如果 booking 量上升，再考虑从 Sheets 迁移到数据库
- 如果需要营销和复购，可以在 `Guests` 基础上继续做标签和回访状态

## 9. 当前结论

本轮“booking confirmation email + 轻量 CRM（Google Sheets）”目标已经达成。  
系统现在不是演示级，而是已经具备可实际使用的业务闭环：

- 客人能收到邮件
- 店方能审批
- 表格里能追踪邮件与客户
- CRM 数据已可累计

当前更适合进入“上线治理和运营优化”阶段，而不是继续做基础功能补洞。
