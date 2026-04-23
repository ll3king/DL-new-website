# Booking System 升级计划（审阅稿）

最后更新：2026-04-23
状态：讨论中，暂不实现

## 1. 目标

本轮先完成 booking system 的规则和后台交互设计对齐，不做代码实现。

本项目当前存在多个并行 booking 入口：

- Website booking form
- Website AI chat
- SMS booking
- Admin / staff manual entry

目标是：

- 自动入口共用一套 booking rules
- 人工录入优先级最高
- admin 后台具备基本完整的 booking 管理能力
- 自动渠道逐步对齐到 SMS 自动化确认链路

---

## 2. 已确认原则

### 2.1 人工优先

- 所有自动 booking rules 主要服务于：
  - Website form
  - AI chat
  - SMS
- Staff manual entry 优先级最高
- 人工录入允许突破自动规则
- 若人工录入突破规则，应保留 override reason （这里 可有可无， 建议不是必须 功能， 都越简单越好）

### 2.2 多入口共用统一规则

- Form / AI Chat / SMS 应共用一套 booking rules
- 不应由每个入口各自维护独立规则

### 2.3 自动渠道尽量不拒客

- 对不能自动确认的 booking，优先考虑：
  - Manual Review
  - 引导 walk-in
- 不希望系统出现明显“拒客”语气

### 2.4 关键回复不完全交给 AI 自由生成

- AI 适合负责：
  - 理解意图
  - 收集字段
  - 自然语言沟通
  - 语言镜像
- 关键 booking 场景应有固定回复模板或固定回复策略

### 2.5 联系方式与确认链路

- booking system 的主联系方式应转为 `mobile-first`
- `email` 为可选项，不应阻塞 booking request 的建立
- AI Chat 与 SMS 两条自动路径，后续都应对齐到 SMS 自动化回复链路
- 未来 booking confirmation / manual review follow-up 以 SMS 为主要发送渠道
- Website form 本轮先保留现有逻辑，后续再决定是否进一步并入 SMS confirmation 主链路

---

## 3. 已确认 booking rules

### 3.1 人数分界点

原先旧逻辑中有两个关键人数点：

- 6 人
- 10 人

现已确认简化系统规则，去掉 10 人分界点。

统一改为：

- `1-6`：自动确认
- `7+`：进入 `Manual_Review`

### 3.2 今天 booking

已确认方向：

- 今天的 booking 不直接拒绝
- 自动渠道今天 booking 进入 `Manual_Review`
- 需要明确告知客人：
  - 这是 same-day booking
  - 需要店员看到后确认
  - 如果客人在附近，欢迎直接来店

当前认可的英文语气方向：

`Thanks for your booking request for today. Same-day bookings are checked by our team manually, so confirmation may take a little time. If you're nearby, please come by anyway — we always keep space flowing for walk-ins and we'll do our best to look after you.`

待确认：

- 今天 booking 是否所有人数档都统一先进入 `Manual_Review` （对 ，今天的booking 处理所有人数都一样）
- 今天 booking 的内部 `review_reason` 是否需要单独区分 （不是 必要的功能 先不考虑）

---

## 4. 当前待确认项

以下内容还没有最终定稿。

### 4.1 人数规则的具体处理

现已更新为更简化的规则：

- `1-6`：自动确认
- `7+`：统一进入 `Manual_Review`
- `7+` 的回复策略：
  - 进入 manual review
  - 同时引导 walk-in
  - Email / 文案参考今天 booking 的处理语气

### 4.2 容量满额 / 容量紧张

待确认：

- Website form 遇到容量限制时：
  - 直接 `Manual_Review`  （不建议 换时间， 记住 16人 每小时 只是我们的AI 自动化booking 的限制， 店里可以接很多人， 建议直接walk in ， 我们有 预留walk in 的位置）
- AI Chat / SMS 遇到容量限制时：
  - 与 Website form 同样处理
  - 进入 `Manual_Review`
  - 同时建议 walk-in

### 4.3 是否所有有效请求都落 booking 记录 （整个 功能先判断是否必要， 系统 越简单有效 越好）

现已确认：

- 对今天 booking
- 对 `7+`
- 对容量满额但客人仍提交的请求

以上都应在系统里创建 booking 记录。

统一处理思路是：

- 落 booking 记录
- 状态进入 `Manual_Review`
- 同时对客引导 walk-in

### 4.4 booking 状态枚举 （同样思考4.4 & 4.5 是否真的有必要加入这些）

待确认是否至少需要以下状态：

- `Confirmed`
- `Manual_Review`
- `Cancelled`
- `Completed`
- `No_Show`
- `Archived`

### 4.5 review_reason 枚举

待确认是否需要单独记录原因，例如：

- `Same_Day`
- `Group_7_10`
- `Group_Over_10`
- `Capacity_Limit`
- `Staff_Override`
- `Special_Request`

---

## 5. 自动入口最小字段对齐

### 5.1 Website form

- 本轮保留现有逻辑
- 不在这一轮重新设计 form 字段

### 5.2 AI Chat

booking 成单前最小必需字段：

- `name`
- `mobile`
- `group_size`
- `date`
- `time`

可选字段：

- `email`

说明：

- 由于 AI Chat 路径未来也要接入 SMS 自动确认，所以必须收集真实手机号
- `sender_id` 或网页匿名 id 不能替代真实联系方式

### 5.3 SMS

booking 成单前最小必需字段：

- `name`
- `group_size`
- `date`
- `time`

系统已有字段：

- `mobile`

可选字段：

- `email`

---

## 6. Admin 后台升级需求

### 5.1 列表查看

- 所有 booking 默认按 booking 日期 + 时间顺序排序查看
- 支持按日期查看
- 支持按状态筛选
- 支持按来源筛选
- 支持搜索 name / phone / email
 （要专门加入  当天 这个关键按键，直接查看当天 booking信息）
### 5.2 Calendar view

- Calendar view 中，每天 booking 可点击进入
- 点击后看到该日所有 booking 明细
- 当天 booking 需要按时间排序

### 5.3 人工输入入口

- 需要 staff manual entry 入口
- 方便员工手动输入 booking
- 人工录入优先级最高

### 5.4 单条 booking 管理

建议讨论是否需要：

- confirm
- edit
- cancel
- archive
- notes
（只保留 最必须的功能， 目前 检查 网站 是有自动清理 archive 的 逻辑， 所以 不需要 人工 archive。 notes我们未来再看。）
---

## 7. 项目规划对齐结论

### 7.1 booking system 总方向

本项目 booking system 的中期方向现已明确为：

- 多入口共用统一 booking policy
- 自动入口包括：
  - Website form
  - Website AI chat
  - SMS
- 人工入口为：
  - Admin manual entry
- 人工入口始终优先于自动规则
- 自动入口的主联系方式以 `mobile` 为核心
- `email` 为可选项
- 自动对客确认链路逐步统一到 SMS 自动化能力

### 7.2 统一 booking rules（当前已对齐版本）

- `1-6`：自动确认
- `7+`：进入 `Manual_Review`
- 今天 booking：无论人数，统一进入 `Manual_Review`
- 容量限制：进入 `Manual_Review`
- 对上述所有不能自动确认的情况：
  - 都落 booking 记录
  - 都引导 walk-in

### 7.3 Admin MVP 方向

后台第一版以“简洁、高效、够用”为原则，优先实现：

- booking 列表按日期 + 时间排序
- 日期筛选
- Today 快捷入口
- 状态筛选
- 来源筛选
- 搜索 `name / phone / email`
- Calendar view 点击某天查看当天 booking
- staff manual entry
- 单条 booking 操作：
  - confirm
  - edit
  - cancel

明确先不优先做：

- 人工 archive
- notes
- 复杂 review reason
- 复杂 override 字段
- 复杂标签体系

---

## 8. 本次版本建议更新范围

以下内容属于本次可以独立推进的功能范围。

### 8.1 booking rules 统一

- 去掉 10 人分界点
- 人数规则统一为 `1-6` / `7+`
- 今天 booking 统一 `Manual_Review`
- 容量限制统一 `Manual_Review + walk-in 引导`
- `7+` 与容量限制的请求都落 booking 记录

### 8.2 Admin 后台升级

- 列表默认按 booking 日期 + 时间排序
- 增加 Today 快捷入口
- Calendar 点击某天看当天 booking 明细
- 增加人工录入入口
- 增加 `edit`
- `cancel` 改为状态更新，不删除记录

### 8.3 自动入口字段与确认链路对齐

- AI Chat 按 `name / mobile / group_size / date / time` 成单
- SMS 按 `name / group_size / date / time` 成单，手机号沿用短信来源
- `email` 调整为可选
- 为后续 SMS 自动 confirmation 链路预留统一方向

### 8.4 本次不纳入范围

- 重新设计 Website form 字段
- 复杂 notes 系统
- review_reason 体系
- override reason 体系
- 人工 archive 功能
- 更复杂的运营标签/画像能力

---

## 9. 本次分支实施计划

### 9.1 本次分支范围

本次新分支只实现：

- `8.1 booking rules 统一`
- `8.2 Admin 后台升级`

明确不在本次分支内实现：

- `8.3 自动入口字段与确认链路对齐`
- SMS 自动 confirmation 能力本身
- Website form 字段重构

### 9.2 实施拆分

#### A. booking rules 统一

目标：

- 去掉 10 人分界点
- 统一为 `1-6` 自动确认、`7+` 进入 `Manual_Review`
- 今天 booking 统一 `Manual_Review`
- 容量限制统一 `Manual_Review + walk-in 引导`
- `7+` 与容量限制请求都落 booking 记录

建议实施点：

- 对齐 Website booking form 后端规则
- 对齐 Website AI chat 的 booking 判定规则
- 统一关键回复模板 / 回复策略
- 确保 admin 看到的状态与自动规则结果一致

#### B. Admin 后台升级

目标：

- booking 列表默认按 booking 日期 + 时间排序
- 增加 Today 快捷入口
- Calendar 点击某天查看当天 booking 明细
- 增加人工录入入口
- 增加 `edit`
- `cancel` 改为状态更新，不删除记录

建议实施点：

- 调整 admin 列表默认排序与筛选方式
- 在 admin 视图中加入 Today 快捷入口
- 为 calendar day click 增加当日 booking 明细展示
- 增加 staff manual entry 表单
- 增加 booking 编辑能力
- 增加 cancel 状态更新能力

### 9.3 实施顺序

建议顺序：

1. 先改 booking rules
2. 再改 admin 列表与 calendar
3. 再加 manual entry
4. 最后加 edit / cancel

### 9.4 验收标准

本次分支完成时，至少应满足：

- Website form 与 AI chat 对 `1-6` / `7+` / same-day / capacity limit 的处理一致
- `7+` 与容量限制请求都会落 booking 记录
- admin 列表按 booking 日期 + 时间排序
- admin 可一键查看 Today booking
- calendar 可点击查看当天 booking
- admin 可手动新增 booking
- admin 可编辑 booking
- admin 可取消 booking，且记录保留

---

## 10. 建议补充的数据字段（参考 我在 4.4 说的， 是否真实必须添加？ 系统设计保持最简洁 高效）

当前建议新增或明确这些字段：

- `status`
- `review_reason`
- `notes`
- `source`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`
- `staff_override_reason`

此部分暂未定稿。

---

## 11. 你可直接批注的区域

请直接在下面补充你的意见、修改点、不同意的地方。

### 8.1 我确认同意的内容

- 

### 8.2 我不同意 / 要修改的内容
我的 批注 都是 在 （）里面， 下次 不要 在文件最下面放这个 批注区， 我会 在（） 里面 在 每个 部分 写出来
- 


### 8.5 其他备注
确保系统简洁高效
- 
