# SMS Implement Plan - Inbound 到 Handler Input

最后更新：2026-04-24  
状态：Implementation Planning  
范围：只定义 `Telerivet inbound -> 高意图筛选 -> handler 前标准化输入` 这一段，不重复前面已对齐的设计原则。

## 1. 本阶段目标

本阶段只完成三件事：

1. 稳定接收 `Telerivet inbound webhook`
2. 完成英文高意图 booking 筛选
3. 产出进入 `SMS booking handler` 前的标准化输入

本阶段不做：

- 不进入完整 booking AI 处理
- 不定最终 CRM 落库结构
- 不扩展短信状态机
- 不做复杂自动回复

## 2. 本阶段链路

当前目标链路收敛为：

`Telerivet -> Cloudflare SMS inbound entry -> high-intent booking filter -> handler-ready input`

## 3. 入口层职责

`Cloudflare SMS inbound entry` 在本阶段只负责：

1. 接收 `application/x-www-form-urlencoded`
2. 校验 `TELERIVET_WEBHOOK_SECRET`
3. 校验 `event = incoming_message`
4. 提取最小必要字段
5. 把短信送入高意图筛选
6. 对通过筛选的短信生成 handler-ready input

## 4. 最小必要字段

基于真实 Telerivet 样本，本阶段只保留这些字段：

- `provider`
- `provider_message_id`
- `from_phone`
- `to_phone`
- `text`
- `received_at`
- `contact_id`
- `phone_id`
- `project_id`
- `service_id`
- `message_type`
- `direction`
- `status`
- `source`

字段来源约定：

- `provider_message_id <- id`
- `from_phone <- from_number_e164` 优先，否则 `from_number`
- `to_phone <- to_number`
- `text <- content`
- `received_at <- time_created`

## 5. 高意图 booking 筛选

本阶段直接复用已对齐的入口判断原则：

- 只做英文判断
- 采用 `关键词 + booking 结构特征 + 已有 booking 线程延续`
- 入口判断尽量早、尽量简、可解释

### 5.1 通过筛选的条件

满足任一类即可进入 handler：

1. 明确 booking 英文关键词
2. 明显 booking 结构特征
3. 已有 booking 线程中的补充短信

### 5.2 不通过筛选的类型

- supplier / 杂讯
- 普通问候
- 低意图咨询
- 无 booking 指向的自由聊天

## 6. handler-ready input

本阶段的核心交付物不是 booking 结果，而是：

`通过高意图筛选后，进入 SMS booking handler 的统一输入对象`

当前建议最小结构为：

```json
{
  "provider": "telerivet",
  "provider_message_id": "SM...",
  "from_phone": "+614...",
  "to_phone": "0498061067",
  "text": "Can I book a table for 2 tomorrow at 10am",
  "received_at": "1777029502",
  "contact_id": "CT...",
  "phone_id": "PN...",
  "project_id": "PJ...",
  "service_id": "SV...",
  "message_type": "sms",
  "direction": "incoming",
  "status": "processing",
  "source": "phone",
  "intent_gate": "booking_high_intent"
}
```

说明：

- `intent_gate` 是本阶段新增的入口判断结果
- 本阶段只需要标明“已通过高意图 booking 筛选”
- 不在这一层做 booking outcome 判断

## 7. 本阶段成功标准

完成下面这些，视为本阶段完成：

1. 入口能稳定接收真实 Telerivet inbound
2. 入口能稳定校验 `secret`
3. 入口能提取并标准化最小字段
4. 高意图 booking 筛选可运行
5. 能明确区分“进入 handler”和“挡在入口外”的短信
6. 形成稳定的 handler-ready input

## 8. 本阶段产出后的下一步

本阶段完成后，下一步才进入：

1. `SMS booking handler` 如何消费这份标准化输入
2. handler 如何接入现有 AI booking 核心
3. 进入既有 booking / CRM 主链路前还需要哪些最小上下文

## 9. 当前一句话结论

`本阶段 implement plan 的核心不是做 booking 结果，而是把 Telerivet inbound 稳定收进来，通过英文高意图筛选，产出一份足够轻且稳定的 handler-ready input，供下一阶段接入现有 booking AI 核心。`
