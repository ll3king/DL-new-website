# AI Brain Branch Retrospective

最后更新：2026-04-25  
范围：`feature/ai-brain-upgrade`

## 1. 这条分支的阶段目标

这条分支的目标，不是重做整个聊天系统，而是把现有 `/api/chat` 升级成一个更明确的 `booking-first AI brain`。

本阶段最终收敛后的目标是：

- 以 booking 处理为绝对主线
- 保持 `chat` 与 `sms` 可共用同一套 booking judgment / flow / outcome logic
- 保持 `sms bridge` 与 `AI brain` 职责解耦
- 在不重写主结构的前提下，修正会导致 booking state 失真的关键点

本阶段明确不作为主目标的：

- 重做 `chat` 普通咨询能力
- 重写整条 SMS webhook 链路
- 新建 SMS 专属 booking system
- 在渠道层堆复杂 slot 推断逻辑

## 2. 最终确认下来的职责边界

### 2.1 AI brain

`AI brain` 负责：

- booking intent judgment
- booking slot extraction
- booking slot merge
- missing fields judgment
- outcome judgment
- customer-facing booking reply

当前方向明确为：

- `LLM-first`
- 代码层只做最小校验、合并与结果约束

### 2.2 sms bridge

`sms bridge` 负责：

- webhook / 渠道适配
- thread / recent messages
- 最小 AI 输入组装
- 短信回复发送

它不应负责：

- 主导 booking slot 真相
- 扩复杂 slot 推断
- 改写 AI brain 的 booking rules

对 `AI brain` 来说，`sms bridge` 输入 contract 已视为固定上游。

## 3. 本阶段完成的核心内容

### 3.1 booking-first 主骨架已经成型

当前 `/api/chat` 已不是单纯网页闲聊接口，而是统一的 booking-first 入口。

已经完成：

- `chat` 进入 booking flow
- `sms` 接入同一套 booking brain
- 多轮 booking 对话推进
- 缺失字段逐步收集
- outcome 生成与对客回复

### 3.2 outcome 分层已经对齐

本阶段已经明确：

- `Manual_Review` 是系统 outcome
- `walk-in` 只是 customer-facing guidance

项目级规则已统一为：

- `1-6` future booking -> `Confirmed`
- `7+` -> `Manual_Review`
- same-day -> `Manual_Review`
- capacity 超限 -> `Manual_Review`

### 3.3 AI brain 已进入 LLM-first 方向

本阶段不是继续扩大 regex，而是已经让 Gemini 进入 booking slot extraction 主链路。

当前形态是：

- Gemini 负责主要的 slot extraction / intent extraction
- 代码层负责 normalize / merge / validate / outcome

这比最早的 `regex-first` 已经前进了一大步。

### 3.4 SMS 与 AI brain 的边界已经拉直

这条边界是本阶段反复校正后确认下来的结果：

- `sms bridge` 只提供最小上下文
- `AI brain` 自己消费这些输入并推进 booking
- 不再让 `sms bridge` 成为 booking state 真相来源

## 4. 本阶段最后集中修复的点

到分支末尾，修复范围已经被进一步缩小，只剩一个主问题：

`slot truth 准确性`

具体是防止：

- `group_size`
- `date`
- `time`

三者之间互相污染。

最典型案例：

- `tomorrow at 12`

正确理解应是：

- `date = tomorrow`
- `time = 12:00`
- `group_size = unknown`

而不是把 `12` 同时误写到 `group_size`。

本阶段最后一个关键修复提交：

- `07b67c0`
- `Tighten AI brain slot truth for time parsing`

这次修复做的事很克制：

- 让 `at 12` 这类表达先稳定落到 `time`
- 收紧 `group_size` 的写入语境
- 增加同轮防污染保护，避免同一数字同时落到 `time` 和 `group_size`
- 收紧 Gemini 的 extraction 指令，明确禁止把裸时间表达误当人数

## 5. 当前完成度判断

如果只按本阶段真实目标评估，而不再把非必要能力纳入范围：

`AI brain 当前完成度已经很高。`

更准确的判断是：

- 主体结构已完成
- booking 主线已完成
- outcome 分层已完成
- LLM-first 方向已完成接入
- 关键剩余问题已收缩到极少数 slot truth 场景

因此，这条分支不应再被视为“需要大改”的状态，而应视为：

`一个已经基本成型、只做了少量关键修正的 AI brain upgrade branch`

## 6. 这条分支明确不用再动的部分

本阶段确认后，不需要继续在这条分支上扩的内容：

- 不重写 `chat` 普通咨询能力
- 不重构 `sms bridge`
- 不扩新的 booking state 系统名词
- 不回头把 booking logic 再拆到渠道层
- 不为少量边界 case 重做整套 AI brain 架构

## 7. 已知但不属于本分支继续处理的事项

有一类问题已在测试中暴露，但不属于本分支继续处理：

- SMS webhook 请求已成功触发 AI reply，用户也收到了短信
- 但 Cloudflare worker 日志里出现过 `outcome = canceled`

这更像是：

- `telerivet-inbound.js` 后半段尾部链路的超时/阻塞问题

该问题应留给 SMS 功能 agent 继续处理，而不是继续在 `AI brain` 分支里混修。

## 8. 断点续接时应先记住的结论

后续如果重新打开这条分支，先从这几个结论出发：

1. 不要重开大范围重构  
   这条分支已经不是“方向不清”，而是“主体已完成，局部已修正”。

2. 优先判断问题是否真的属于 AI brain  
   如果问题出在 webhook、发送、线程写回、超时，优先交给 SMS agent。

3. AI brain 的主职责已经明确  
   booking reasoning 留在 AI brain，渠道层保持轻。

4. 如果还要继续修，优先只看 booking state 真相  
   先问自己是不是：
   - slot extraction 误判
   - slot merge 优先级错误
   - outcome 基于错误 slot 提前触发

5. 默认保持最小改动原则  
   当前阶段再动代码，应优先做小修，不做主结构回摆。

## 9. 一句话总结

这条 `feature/ai-brain-upgrade` 分支的结果，不是“重新发明了一个新系统”，而是把现有 AI 升级成了一个高完成度的 `booking-first AI brain`，并在不破坏主结构的前提下，把最关键的 booking slot truth 问题收稳到了可继续交付和衔接的状态。
