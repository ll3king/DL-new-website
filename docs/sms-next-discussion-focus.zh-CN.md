# SMS 后续讨论焦点

最后更新：2026-04-24  
状态：Planning Draft  
说明：本文件不重复前面已对齐内容，只保留后续要继续深入讨论的焦点。

## 4. Telerivet developer guide 与 adapter 的关系

当前需要先澄清一个关键问题：

`Telerivet developer guide` 中提到 `running code on your own servers`，这是否意味着我们可以把 `Telerivet` 和 `adapter` 的功能合并。

当前判断：

- `Telerivet` 可以把 webhook 发到我们自己的服务
- 这说明我们可以在自己控制的服务端处理短信事件
- 但这不等于 `Telerivet` 本身替代了 `adapter`

更准确的理解应是：

- `Telerivet` = 短信网关
- `我们的服务` = 接收 Telerivet webhook，并做后续处理

后续要重点讨论：

1. 我们是否还需要单独定义一层 `adapter`
2. 还是把 `adapter` 的职责直接吸收到现有 Cloudflare 服务中
3. 如果吸收，最小职责边界是什么

（我理解你的 意思， 我上传了一些图片关于 telerivet webhook 和 developer guide，请上网学习研究，给出实际的可落地方案 ）
## 5. 高意向 booking sms 的源头判断
（意向判断的越早越好， 这也是我为什么 提出 telerivet developer server 方案的，这样我们可以更可控的 筛选关键词啊等 一些简单动作来判断意向， 目前 webhook api 我没有看到 关键词 筛选的功能， 帮我上网 论证分析）
这一点已经基本对齐：

- 不是所有短信都进入系统
- 要尽量在源头判断是否为高意向 booking sms

后续要继续讨论的是：

1. 什么样的短信算高意向 booking sms
2. 这个判断发生在什么位置
3. 非 booking / supplier / 杂讯短信如何排除
4. 未进入系统的短信是否只保留在 Telerivet inbox

## 6. SMS booking handler 与现有 AI 核心的关系
（到这一步，其实就是接入到 现有的 项目 AI 大脑， 是可以 确定的）
当前方向已收敛为：

- 第一版不是泛化 conversation engine
- 第一版是 `SMS booking handler`
- 该 handler 需要复用现有网站 AI chat 的 booking 核心逻辑

后续要继续讨论的是：
 
1. 复用的范围到底多大 （我们全网站 只有一个 核心 AI 大脑， 所以就是同一个，理解这点。 sms 源头的 信息 本身就和website 上 chat bot 天然不同， 他是通过webhook 发来的， 结构也好， 还有 phone number， AI 大脑 只进行 简单的 区分。 但 不管怎么说， AI 大脑是独立分支，天然 项目 与 sms 功能解耦。 后续我们可以对 AI 大脑进行升级优化）
2. 是复用 booking rules，还是直接复用 AI booking 处理链
3. 哪些能力必须共用，哪些能力必须隔离

## 7. 最小落库范围

当前方向是：

- 不额外发展独立重型短信数据层
- 尽量复用现有 booking / CRM
- 短信侧只保留最少必要信息

后续要继续讨论的是：

1. 最少必须记录哪些短信上下文
2. 哪些客人信息必须复用现有 CRM （crm 中 录入的 guest信息中， mobile number查到 相同号码就是老客人）
3. 哪些字段现在不要提前加

## 8. 当前建议的下一步讨论顺序

（忽略你下面的， 对齐我的批注， 回答我的问题）

建议按下面顺序继续，而不是并行展开：

1. `Telerivet` 与 `adapter` 是否需要独立存在
2. 高意向 booking sms 如何在源头判断
3. `SMS booking handler` 如何复用现有 AI booking 核心
4. 最小落库范围
