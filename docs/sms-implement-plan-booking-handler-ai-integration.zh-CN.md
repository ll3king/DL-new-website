# SMS Implement Plan - Booking Handler 与现有 AI Booking 核心集成

最后更新：2026-04-24  
状态：Implementation Planning  
目标：定义 `SMS booking handler` 如何接入现有网站 AI chat 的 booking 核心，确保 SMS 只是新入口，而不是新建一套平行 booking 逻辑。

## 1. 核心定位

`SMS booking handler` 的目标不是创造新的 booking 大脑，而是：

`把通过入口筛选后的高意向 booking sms，按短信渠道特征接入现有 AI booking 核心与既有 booking rules。`

这意味着：

- 第一版不新建独立 booking 逻辑
- 第一版不新建独立 booking policy
- 第一版不新建独立 CRM 处理逻辑
- 第一版只解决“短信如何进入既有 booking 核心”

## 2. 当前已确认前提

目前已经确认：

- `Telerivet route` 已正常工作
- `Cloudflare SMS entry` 只做入口职责
- 高意向 booking sms 才进入后续处理
- `SMS` 必须按原有 booking / CRM 规则并入系统
- 现有网站 AI chat 已有 booking 核心能力

因此当前方向应明确为：

`SMS booking handler` 不是替代现有 AI booking 核心，而是调用和复用它。`

## 3. 集成原则

### 3.1 规则统一

SMS 必须复用现有 booking rules，例如：

- same-day -> `manual_review`
- `1-6` future booking -> `confirmed`
- `7+` -> `manual_review`
- capacity 超限 -> `manual_review`

这部分不允许短信入口自行改写。

### 3.2 核心能力统一

凡是已经在网站 AI chat 中存在且有效的 booking 核心能力，应优先复用，例如：

- booking 字段收集逻辑
- booking request 的结构化理解
- booking rules 的执行路径
- confirmed / manual_review / human_required 的输出逻辑

### 3.3 渠道差异局部处理

短信入口与网站 chat bot 的差异，应只在短信入口局部处理，而不应复制出一套新的 booking 核心。

短信天然差异包括：

- webhook 输入结构不同
- 携带手机号
- 文本通常更短
- 会话连续性依赖手机号和线程上下文

这些差异应由：

- `Cloudflare SMS entry`
- `SMS booking handler`

在进入现有 AI booking 核心之前完成适配。

## 4. 当前建议的职责分工

### 4.1 Cloudflare SMS entry

只负责：

- 接收 Telerivet webhook
- 校验 `secret`
- 解析短信与手机号
- 做高意向 booking 入口筛选
- 把通过筛选的请求送给 `SMS booking handler`

### 4.2 SMS booking handler

负责：

- 管理短信 booking 会话上下文
- 组织短信渠道所需输入
- 调用现有 AI booking 核心
- 接收 booking 结果
- 生成短信渠道下需要的回复动作

### 4.3 现有 AI booking 核心

继续负责：

- booking request 的核心判断
- booking rules 执行
- 生成 structured booking outcome

## 5. 当前建议的集成方式

当前倾向：

`SMS booking handler` 不直接自己做 booking 结论，而是把短信内容和必要上下文整理后，交给现有 AI booking 核心处理。`

这意味着第一版更合理的形态是：

1. 短信入口筛出高意向 booking sms
2. `SMS booking handler` 补齐短信渠道上下文
3. 调用现有 AI booking 核心
4. 获得 booking 结果
5. 按结果继续走现有 booking / CRM 主链路

## 6. 当前不建议的做法

第一版不建议：

### 6.1 不建议复制一套短信专属 booking rules

原因：

- 会导致规则漂移
- 后续很难维护
- 不符合“按原规则并入 CRM”

### 6.2 不建议复制一套短信专属 AI booking 脑

原因：

- 与现有网站 AI chat 核心重复
- 增加后续升级与复盘成本

### 6.3 不建议让入口层承担 booking 核心判断

原因：

- 入口层职责应保持最小
- 否则会破坏解耦

## 7. 当前建议的最小集成目标

第一版只需要达到下面目标：

1. 高意向 booking sms 能进入 `SMS booking handler`
2. handler 能把短信内容整理成现有 AI booking 核心可处理的输入
3. handler 能接收 booking outcome
4. outcome 能继续并入现有 booking / CRM 主链路
5. 最终回复符合短信渠道特点

## 8. 当前仍待继续讨论的问题

本文件只冻结“复用现有 AI booking 核心”的方向，以下内容仍需继续讨论：

1. handler 传给现有 AI booking 核心的最小输入是什么
2. 现有 AI booking 核心是否已经足够抽象，可直接被短信入口调用
3. 短信线程上下文的最小保存范围是什么

## 9. 当前一句话结论

`SMS booking handler 的第一版职责应收敛为：管理短信渠道上下文，并将高意向 booking sms 整理后接入现有 AI booking 核心，再按既有 booking rules 和 CRM 主链路继续处理，而不是复制出一套新的短信 booking 逻辑。`
