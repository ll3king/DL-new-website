# SMS 深入讨论对齐

最后更新：2026-04-24  
状态：Planning Draft  
范围：从 `4. Telerivet developer guide` 开始，不重复前面已对齐内容。

## 4. Telerivet developer guide 的真实含义

基于你提供的 Telerivet 页面和官方文档，已经可以确认：

- `Running Code on Your Own Servers` 是 Telerivet 官方支持的标准模式
- 这条模式下，官方明确要求通过 `REST API` 和 `Webhook API` 与我们自己的服务集成
- Webhook Service 页面要求填写我们自己的 `Webhook URL`
- `Webhook Secret` 会作为请求里的 `secret` POST 参数发送给我们的服务
- Webhook 请求体是 `application/x-www-form-urlencoded`，不是 JSON
- Webhook 需要在 10 秒内返回 `200`，否则会被视为失败并重试

这说明：

- Telerivet 天然支持“短信网关 + 我们自有服务”的集成模式
- 我们完全可以把短信业务逻辑跑在自己控制的服务里
- 后续不一定需要一层独立、显式、很重的 `adapter`

当前对齐结论：

`Telerivet 不是替代 adapter，而是已经提供了把短信事件直接送到我们自有服务的官方通路。后续真正要讨论的，是 adapter 是否还需要独立存在。`

## 5. adapter 是否独立存在

当前需要讨论的不是“要不要接 adapter”，而是：

`adapter 的职责是否可以直接并入现有 Cloudflare 服务。`

当前候选方向有两种：

### 方案 A：保留独立 adapter

职责：

- 验证 `secret`
- 解析 Telerivet webhook payload
- 做入口级过滤
- 再转给内部 booking 处理链

优点：

- 边界清楚
- 供应商协议与内部逻辑隔离更强

缺点：

- 多一层概念
- 第一版可能偏重

### 方案 B：不保留独立 adapter，直接并入 Cloudflare 服务

职责仍然存在，但不单独命名为独立层，而是直接写进现有 SMS 入口服务：

- 校验 `secret`
- 解析 `x-www-form-urlencoded`
- 做高意向 booking 筛选
- 进入 `SMS booking handler`

优点：

- 更简洁
- 更符合第一版“克制设计”

缺点：

- 入口服务的边界需要写得很清楚

当前倾向：

`优先考虑方案 B：不保留独立 adapter 概念，把最小入口协调职责直接并入 Cloudflare SMS 入口服务。`

## 6. Telerivet 是否有现成关键词筛选能力

基于官方文档，当前能确认：

- Telerivet 支持多个 incoming message services
- 支持按顺序处理多个 service
- 官方明确举例：可以有一个 service 处理某些关键词，也可以有一个 service 把消息转发到我们自己的服务器
- Telerivet 也支持 Cloud Script / Rules Engine，在其平台内写入一些自动化逻辑

但当前更重要的判断是：

`Telerivet 虽然具备关键词/脚本能力，但第一版不建议把高意向 booking 判断主要放在 Telerivet 平台内部。`

原因：

- 我们希望 booking 判断逻辑尽量掌握在自己系统内
- 后续要复用现有 AI booking 核心时，内部入口更容易统一
- 把筛选写死在 Telerivet 侧，会提高后续调整成本

当前建议：

- Telerivet 负责把短信送到我们的入口
- 高意向 booking 的最小判断，优先在我们自己的入口层做
- 不在 Telerivet 侧堆复杂规则

## 7. 高意向 booking sms 的入口判断

当前已经基本对齐：

- 不是所有短信都进入系统
- 应尽量在入口早期完成高意向 booking 判断

当前要深入讨论的是：

1. 什么样的短信算高意向 booking sms
2. 这种判断是纯关键词，还是“关键词 + 结构特征”
3. supplier / 杂讯 / 无关短信如何排除
4. 未进入系统的短信是否只保留在 `Telerivet inbox`

当前倾向：

- 不做纯 AI 泛判
- 先做克制的入口判断
- 只把明显 booking request 送进 `SMS booking handler`

## 8. SMS booking handler 与现有 AI 核心的关系

当前已经进一步对齐为：

- 第一版不是泛化 `conversation engine`
- 第一版是 `SMS booking handler`
- 该 handler 需要接入现有网站 AI chat 的 booking 核心
- 核心 booking rules 必须统一

当前要继续讨论的是：

1. 复用的是“booking rules”，还是“现有 AI booking 处理链”
2. 短信入口和网站 chat bot 的输入差异如何处理
3. 哪部分逻辑共用，哪部分逻辑必须保持短信专属

当前补充结论：

`SMS 第一版不是重新造一个 booking 大脑，而是把短信入口接到现有 booking AI 核心上。`

## 9. 最小落库范围

当前方向不变：

- 不单独发展重型短信数据层
- 尽量复用现有 booking / CRM
- 短信侧只保留最少必要信息

当前重点是：

1. 最少必须记录哪些短信上下文
2. 如何通过 `mobile number` 复用现有 guest / CRM
3. 哪些字段现在不要提前加

当前补充判断：

- 如果 CRM 里已存在同手机号 guest，应直接视作可复用老客资料
- 未来“减少重复追问”的优化，属于后续 AI 核心升级，不应在这一轮先做重

## 10. 当前建议的讨论顺序

后续建议按下面顺序继续，不并行扩散：

1. 是否保留独立 adapter，还是直接并入 Cloudflare 入口服务
2. 高意向 booking sms 如何在入口层判断
3. `SMS booking handler` 如何接入现有 AI booking 核心
4. 最小落库范围

## 11. 当前一句话对齐结论

`Telerivet 已明确支持把短信 webhook 和发送能力直接接入我们自己的服务，因此后续重点不再是“能不能接”，而是“是否还要保留独立 adapter 概念”。当前更倾向把最小入口协调职责直接并入 Cloudflare SMS 入口服务，并在入口层完成高意向 booking sms 的克制筛选，再把符合条件的请求交给现有 booking AI 核心处理。`

## 12. 参考

- Telerivet Webhook API: https://telerivet.com/api/webhook
- Telerivet Developer Platform: https://www.telerivet.com/api
- Telerivet Cloud Script API: https://telerivet.com/api/script
- Ordering Multiple Active Services: https://guide.telerivet.com/hc/en-us/articles/360038572152-Ordering-Multiple-Active-Services
