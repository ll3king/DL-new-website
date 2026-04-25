# SMS Implement Plan - High Intent Booking Filter

最后更新：2026-04-24  
状态：Implementation Planning  
目标：定义“高意向 booking sms”的入口判断标准，用于 `Cloudflare SMS entry` 在源头筛选短信，避免所有短信都进入现有 booking / CRM 主链路。

## 1. 核心定位

这套判断标准的目的不是做复杂自然语言理解，而是：

`在入口尽早、尽简洁地筛出值得进入 booking 主链路的短信。`

因此它必须满足：

- 简洁
- 可解释
- 可维护
- 不依赖过度复杂推理

## 2. 当前原则

已经对齐的前提是：

- 不是所有短信都进入系统
- 只有高意向 booking sms 才进入后续处理
- supplier / 杂讯 / 无关短信应尽量挡在入口外
- 入口判断应该尽可能早完成
- 第一版只做英文判断，不考虑中文

## 3. 第一版判断目标

第一版入口判断只解决一个问题：

`这条短信是否足够像一个 booking request，值得送入现有 booking 主链路。`

它不负责：

- 生成完整 booking 结论
- 执行 booking rules
- 处理复杂自由对话
- 替代现有 AI booking 核心

## 4. 判断方式

第一版建议采用：

`关键词 + booking 结构特征`

而不是：

- 纯关键词
- 纯 AI 自由判断

原因：

- 纯关键词太粗糙，误判率高
- 纯 AI 判断太重，不符合第一版“简洁高效”

## 5. 高意向 booking sms 的判定标准

第一版建议使用“至少满足下面条件之一”的方式进入系统：

### 5.1 明确 booking 意图词

第一版只考虑英文 booking 相关表达，例如：

- `book`
- `booking`
- `reserve`
- `reservation`
- `table`
- `for 2`
- `for 4`
- `book a table`
- `can I book`
- `I'd like to reserve`

### 5.2 明显 booking 结构特征

即使没有明确 booking 关键词，但短信同时包含多个 booking 必备信息，例如：

- 日期
- 时间
- 人数

例如：

- `tomorrow 10am for 3`
- `25/04 12:30 4 people`
- `Friday 1pm table for 2`

如果一条短信明显像是在提交 booking 基础信息，也应进入系统。

### 5.3 明确延续中的 booking 对话

如果这条短信来自一个已进入 booking flow 的会话线程，则后续补充信息应继续进入系统，例如：

- 只发一个日期
- 只发一个人数
- 只补邮箱

这类短信单独看可能不完整，但对已开启的 booking 线程来说仍应视为高意向 booking sms。

## 6. 第一版不进入系统的短信

下面这些类型，第一版原则上不自动进入 booking 主链路：

### 6.1 supplier / 运营类短信

例如：

- 送货通知
- 原料供应商联系
- 广告推销
- 银行或平台验证码

### 6.2 普通问候或低意向咨询

例如：

- `Hi`
- `Hello`
- `Are you open`
- `What time do you close`

这类短信不应直接进入 booking 主链路。

### 6.3 无明确 booking 指向的自由聊天

例如：

- 没有日期时间人数
- 没有 booking intent
- 没有延续中的 booking 上下文

## 7. 入口判断的实际原则

第一版判断应遵守：

### 7.1 宁可保守，不要过宽

第一版应优先减少误入 booking 主链路的噪音短信。

### 7.2 已进入 booking flow 的线程，优先延续

一旦线程已被认定为 booking 会话，后续短消息应优先继续进入该流程。

### 7.3 supplier / 杂讯优先排除

实际手机环境中有大量非顾客短信，因此排除噪音是入口设计的核心价值之一。

## 8. 未进入系统的短信如何处理

当前建议：

- 不进入 booking 主链路
- 不进入现有 CRM / booking 处理
- 继续保留在 `Telerivet inbox`
- 如有需要，交给人工查看 （不考虑人工 提示， 这里是思考过度）

第一版不建议：

- 对所有低意向短信自动回复
- 为低意向短信建立系统级流程

## 9. 与现有 booking / CRM 主链路的关系

只有当短信满足高意向 booking 条件时，才应：

- 进入现有 booking 主链路
- 复用现有 AI booking 核心
- 复用现有 booking rules
- 按既有 CRM 路径落地

因此：

`高意向 booking filter 是系统入口闸门，而不是新的 booking 判断层。`

## 10. 第一版最小成功标准

这层判断逻辑达到可用，至少应满足：

1. 能挡住大部分 supplier / 杂讯短信
2. 能放行明显 booking request
3. 能放行已进入 booking flow 的后续补充短信
4. 不改变现有 booking / CRM 规则
5. 第一版规则集仅围绕英文短信构建

## 11. 当前仍待继续讨论的问题

本文件只定义入口判断原则，以下内容仍需单独继续讨论：

1. `SMS booking handler` 与现有 AI booking 核心的接法
2. 最小落库范围

## 12. 当前一句话结论

`高意向 booking sms 的第一版判断应采用“英文关键词 + booking 结构特征 + 已有 booking 线程延续”三类标准，在入口层尽早筛出值得进入现有 booking / CRM 主链路的短信，并尽量把 supplier / 杂讯 / 低意向咨询挡在系统外。`
