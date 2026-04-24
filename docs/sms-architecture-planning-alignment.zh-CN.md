# SMS 架构规划对齐草案

最后更新：2026-04-24  
状态：Planning Draft  
目的：整理当前关于 SMS 功能的项目现状判断、边界、设计方向与待决策点，方便继续批注与对齐。

## 1. 当前对齐结论

目前项目里的 SMS 不应被定义为“已建立功能”，更准确的状态是：

- 主线系统已完成：官网、booking form、AI chat、admin、Google Sheets、email、Guests/GuestEvents CRM
- SMS 方向已被纳入整体 booking 架构考虑
- 仓库里存在少量 SMS 预留和探索性内容
- 但 SMS 主链路尚未冻结，也尚未形成正式可用功能

换句话说：

`SMS 目前处于前期定义阶段，不是已完成能力。`

## 2. 现有项目里的 SMS 痕迹应如何理解

目前仓库中与 SMS 相关的内容，应该理解为“预埋和探索”，而不是“正式能力”。

### 2.1 已进入仓库的预留

- `_booking.js` 中已经出现：
  - `SmsThreads`
  - `SmsMessages`
  - `SMS_OUTBOUND_WEBHOOK_URL`
  - `SMS_OUTBOUND_AUTH_TOKEN`
  - `sendSmsMessage()` 之类的占位接口
- admin source 里已有 `SMS` 选项

这些说明：

- 团队已经把 SMS 视为 booking system 的未来组成部分
- 数据结构和网关方向有过前置思考

但这并不说明：

- 已完成短信网关选型
- 已完成 webhook 契约冻结
- 已完成正式的 SMS 会话服务
- 已完成可上线的人工接管流程

### 2.2 当前未提交内容的含义

当前工作区中与 SMS 相关的内容仍未提交，包括：

- `functions/api/sms/`
- `docs/project-status-sms-booking-next-step.zh-CN.md`

这意味着：

- SMS 仍处于开发探索态
- 当前讨论重点应放在规划和协议，而不是把现有未提交代码视为既定事实

## 3. 当前应采用的项目表述

建议用下面这句话作为当前 SMS 进度的标准表述：

`项目里已经存在 SMS 方向性的预留和探索性草稿，但尚未形成正式 SMS 功能。当前阶段的核心任务是冻结网关角色、webhook 协议、会话边界与实现路径。`

## 4. 已讨论并建议废除的选项

### 4.1 Tailscale

当前建议：

`Tailscale 不纳入正式 SMS 方案。`

原因：

- `Tailscale Serve` 只适合 tailnet 内部访问，不适合接收第三方公网 webhook
- `Tailscale Funnel` 更像开发联调工具，不适合作为短信主入口长期承载正式运营流量
- 把 Tailscale 保留在正式方案里，只会增加额外概念和后续切换成本

因此当前建议是：

- 开发期如确有需要，可作为临时调试工具单独考虑
- 正式方案里直接废除，不进入主设计

## 5. 当前已收敛的正式设计方向

建议采用这条最简洁的正式链路：

`Guest SMS -> Telerivet Android Route -> Telerivet inbound webhook -> Cloudflare SMS adapter -> Booking/SMS conversation service -> Google Sheets / CRM / booking core -> Telerivet REST API send -> Guest SMS`

另加一条状态链路：

`Telerivet status callback -> Cloudflare status endpoint -> message log / audit trail`

## 6. 这个方案为什么符合“简洁高效”

因为它只保留 3 个清晰角色：

### 6.1 Telerivet  （这里 要清楚 不是每条 sms 我们都处理， 只有 高意向的 booking sms 才送入 adapter， 是不是可以做 关键词 筛选）
  
职责：

- 安卓手机短信网关
- 真实短信收发
- 送达状态
- 手机与网页端同步

不负责：

- booking 业务规则
- 项目内部状态机
- CRM 主逻辑

### 6.2 Cloudflare SMS Adapter （同意）

职责：

- 接收 Telerivet webhook
- 验证 secret
- 做协议转换
- 调用内部 SMS 会话服务
- 把 outbound send 请求转发给 Telerivet REST API

不负责：

- 复杂 booking 规则
- 多轮会话业务本身
- CRM 业务决策

### 6.3 Booking / SMS Conversation Service （这里 不做 booking intent 识别， 但是要接入 我们网站的 核心AI处理大脑，还是我们定下的 booking rules， 主要是  回复和跟进 booking request）

职责：

- 识别 booking intent
- 逐步收集字段
- 判断 confirmed / manual_review / human_required
- 写入 booking 与 CRM
- 决定短信回复内容

## 7. 当前建议的系统分层

### 7.1 Gateway Layer

供应商：

- `Telerivet`

输入输出：

- 输入：真实手机收到的短信
- 输出：incoming webhook、send API、status callback

### 7.2 Adapter Layer

部署位置：

- `Cloudflare`

职责：

- 做供应商协议到内部协议的转换
- 保持薄、稳定、低复杂度

### 7.3 Conversation Layer

职责：

- 会话状态管理
- booking 规则判断
- 自动回复与人工接管分流

### 7.4 Persistence Layer （上个 阶段处理完的 booking request， 这里写入就必须符合cafe booking的 规范， 既然说到了CRM， 你就知道 要减少 冗余 客人信息，CRM 记录过的 客人信息 要在未来能 被重复利用， 并在 未来sms 回复中，不用问重复信息 ）

初期沿用：

- Google Sheets
- 现有 booking / CRM 数据体系

短信相关只保留最小必要结构。

## 8. 当前建议的最简数据模型

### 8.1 SmsThread （按照我上面的 批注， 做系统 简化， 记住 不是 非必要 我们就不多加功能）

建议只保留：

- `phone`
- `guest_name`
- `guest_email`
- `intent`
- `state`
- `group_size`
- `booking_date`
- `booking_time`
- `last_booking_id`
- `handoff_reason`
- `last_message_at`

### 8.2 SmsMessage （同理， 简化）

建议只保留：

- `provider_message_id`
- `phone`
- `direction`
- `sender_type`
- `text`
- `status`
- `thread_state`
- `booking_id`
- `created_at`

原则：

- 第一版不加过多运营分析字段
- 先保证线程和审计清晰

## 9. 当前建议的最简会话状态机 （同理， 真的是最简洁 高效的设计吗， 确保我们的 核心功能简洁高效）

第一版建议只保留这些状态：

- `idle`
- `collect_name`
- `collect_date`
- `collect_time`
- `collect_group_size`
- `collect_email`
- `confirmed`
- `manual_review`
- `human_required`
- `closed`

不建议一开始做过多细分状态。

## 10. 当前建议的最简业务范围

第一版 SMS 只做最核心 booking create 路径。

### 10.1 支持内容  （同步对齐 我这里 的批注）

- 普通咨询后引导到 booking 所需字段
- 逐步收集：
  - name
  - date
  - time
  - group size
  - email
- 按统一 booking 规则判断：
  - same-day -> `manual_review`
  - `1-6` future booking -> `confirmed`
  - `7+` -> `manual_review`
  - capacity 超限 -> `manual_review`
- 自动确认时：
  - 写 booking
  - 发确认短信
  - 发确认邮件
- 人工审核时：
  - 写 booking
  - 发 pending review 短信
  - 发 pending review 邮件
- 复杂情况进入：
  - `human_required`

### 10.2 暂不纳入 （整理后续的真实需求，其余的要及时 删除，做好项目边界管理）

- 改期 （后期 要加的）
- 取消 （后期 要加的）
- 复杂自由对话 （否决， 不加入）
- 完整客服后台（否决， 不加入）
- 多供应商抽象（否决， 不加入）
- 本地常驻服务（否决， 不加入）
- Tailscale 正式接入（否决， 不加入）

## 11. 人工接管策略 （保持简洁高效， 所有的 人工干预入口 就在我们的后台booking 系统中， 对齐 现有项目， 如同 AI chat bot 一样，booking 无法定下来的，保持就好，你要知道， 有时候 人类的sms 可能 就没有然后了，  可以输出booking的， 按照booking 规则一样处理， 不添加 项目复杂度 ）

当前建议：

- `Telerivet inbox` 作为第一版人工查看和手动回复入口
- 项目内部仅负责：
  - 标记该线程是否进入 `human_required`
  - 记录 handoff reason
  - 保留消息与 booking 关联

当前不建议第一版就开发完整 SMS 客服后台。

## 12. 当前建议冻结的内部协议 （冻结太早了，我觉得 要 先测试 telerivet 的实际 webhool API 发送信息， 我们再真实的建立 适合的 adapter 接口等 ）

虽然现在不写代码，但建议先冻结内部 contract。

### 12.1 Inbound Contract

内部统一字段建议为：

- `provider`
- `provider_message_id`
- `phone`
- `text`
- `received_at`
- `channel`

### 12.2 Outbound Contract

内部统一字段建议为：

- `phone`
- `text`
- `thread_state`
- `booking_id`
- `metadata`

### 12.3 Status Contract

内部统一字段建议为：

- `provider_message_id`
- `phone`
- `status`
- `error`
- `updated_at`

原则：

- 内部 contract 统一
- 供应商差异放在 adapter 里处理


（后面的 我都感觉没有必要看， 太早讨论， 我们先对齐前面的 改动， 然后可能会重新设计后续）



## 13. 当前推荐的落地阶段

### Phase 1：网关打通

- Telerivet route 正常收发
- inbound webhook 到 Cloudflare
- outbound API 发送成功
- status callback 可接收

### Phase 2：会话 MVP

- 只支持 booking create
- 只支持逐字段补齐
- 只支持 `confirmed / manual_review / human_required`

### Phase 3：运营闭环

- 写 booking
- 写 SMS thread / message
- 邮件同步
- 人工接管标记

### Phase 4：后续增强

- 改期 / 取消
- 对客模板统一
- admin 查看 SMS 线程
- 更完整状态看板

## 14. 当前建议明确排除的复杂化方向

当前不建议：

- 把 Telerivet rules engine 当主业务层
- 引入本地中间件常驻
- 引入 Tailscale 作为正式入口
- 一开始做复杂客服后台
- 一开始做过重的多供应商平台抽象

原因：

- 这会显著抬高第一版 SMS 交付复杂度
- 不符合“先把真实短信 booking 通路做通”的目标

## 15. 当前一句话推荐方案

`正式 SMS 链路采用 Telerivet + Cloudflare adapter + 现有 booking core 的三段式设计，不使用 Tailscale，不引入本地常驻服务，不先做复杂后台。`

## 16. 待你批注的关键决策点

下面这些点建议你重点批注：

1. 是否确认 `Tailscale` 从正式方案中移除
2. 是否确认 `Telerivet` 仅作为网关，不承载业务逻辑
3. 是否确认第一版只做 `booking create`
4. 是否确认人工接管入口先使用 `Telerivet inbox`
5. 是否确认短信相关数据模型只保留最小字段集
6. 是否确认正式入口采用 `Cloudflare adapter`
7. 是否确认第一版不做复杂客服后台

## 17. 下一步讨论建议

在你批注完这份文档后，下一步建议只讨论这三件事：

1. `Cloudflare adapter` 的职责边界是否要再收缩
2. 第一版 `SMS conversation` 的字段收集顺序与状态机是否足够简
3. `manual_review` 与 `human_required` 的界限是否要进一步明确
