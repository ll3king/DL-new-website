# SMS Implement Plan - Cloudflare SMS Entry

最后更新：2026-04-24  
状态：Implementation Planning  
目标：定义 `Cloudflare SMS entry` 的最小职责边界，确保 SMS 作为新入口并入现有 booking / CRM 主链路，而不是改造原系统。

## 1. 核心定位

`Cloudflare SMS entry` 不是新的业务系统，也不是新的 CRM 层。

它的唯一定位是：

`作为 Telerivet 与现有 booking / CRM 主链路之间的最小入口层。`

这意味着：

- 它只负责接入
- 它只负责入口校验和初步判断
- 它不负责重新定义 booking policy
- 它不负责重新定义 CRM 逻辑
- 它不负责创造新的人工处理体系

## 2. 必须遵守的项目原则

`Cloudflare SMS entry` 的设计必须严格服从下面两条项目原则：

### 2.1 简洁高效

- 第一版只做必要职责
- 不提前做复杂抽象
- 不增加额外中间层
- 不扩大到完整短信系统

### 2.2 功能解耦

- 网关职责留在 `Telerivet`
- booking / CRM 规则继续留在现有主链路
- `Cloudflare SMS entry` 只承担入口职责

## 3. 这层必须做的事

第一版 `Cloudflare SMS entry` 只做以下 5 件事：

1. 接收 `Telerivet webhook`
2. 校验 `Webhook Secret`
3. 解析短信请求内容
4. 判断是否为高意向 `booking sms`
5. 若符合条件，则把请求送入现有 booking / CRM 主链路，并标记 `source = SMS`

## 4. 这层不做的事

第一版明确不做：

- 不改 existing booking rules
- 不改 existing CRM 规则
- 不单独实现新的 guest 管理逻辑
- 不单独实现新的 booking policy
- 不单独发展新的人工接管系统
- 不单独实现复杂 conversation engine
- 不承担完整短信客服功能

## 5. 与现有系统的关系

当前已经确认：

- `Telerivet route` 在手机上已正常工作
- 现有 CRM / booking website 已有既定落地方案
- `SMS` 必须按原有规则并入 CRM，而不是借机修改或创新

因此 `Cloudflare SMS entry` 的关系应明确为：

- 上游：`Telerivet`
- 下游：现有 booking / CRM 主链路
- 自身：只做入口，不做规则中心

## 6. 入口判断原则

当前已对齐：

- 不是所有短信都进入系统
- 只把高意向 booking sms 纳入后续处理

因此 `Cloudflare SMS entry` 必须承担“入口筛选”职责。

当前方向：

- supplier / 杂讯 / 无关短信，不进入 booking 主链路
- 高意向 booking sms，才继续进入现有 booking 处理逻辑

这一层的判断应尽量：

- 早
- 简
- 可解释

## 7. 进入主链路后的处理原则

一旦短信被认定为高意向 booking sms，它就不应进入一套新的平行系统，而应：

- 进入现有 booking 主链路
- 复用现有 AI booking 核心
- 复用现有 booking rules
- 复用现有 CRM 落地路径
- 仅在 source 上体现为 `SMS`

换句话说：

`SMS 是一个入口，不是一套新的 booking system。`

## 8. 第一版的最小成功标准

`Cloudflare SMS entry` 第一版达到可用，至少要满足：

1. 能稳定接收 Telerivet webhook
2. 能正确校验 `secret`
3. 能正确解析短信与手机号
4. 能在入口层排除非 booking 短信
5. 能把高意向 booking sms 按既有规则送入现有主链路

## 9. 当前仍待继续讨论的问题

这份文档只冻结入口职责边界，以下内容仍需单独继续讨论：

1. 高意向 booking sms 的具体判断标准
2. 现有 AI booking 核心的复用接法
3. SMS 的最小落库范围

## 10. 当前一句话结论

`Cloudflare SMS entry 的第一版职责应严格收缩为：接收 Telerivet webhook、校验 secret、解析短信、完成高意向 booking 入口筛选，并将符合条件的请求按 source = SMS 并入现有 booking / CRM 主链路。`
