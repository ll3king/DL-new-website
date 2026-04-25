# Telerivet -> Handler 最小落地 Checklist

最后更新：2026-04-24  
状态：Execution Prep  
目标：先打通 `Telerivet -> 我们入口` 的最小链路，并采集真实 SMS 输入样本，为后续 handler 设计提供真实依据。

## 1. 本轮目标

本轮只做两件事：

1. 让 `Telerivet webhook` 成功到达我们的入口
2. 收集真实 inbound SMS payload 样本

本轮不做：

- 不接完整 booking / CRM 主链路
- 不定最终 contract
- 不扩展数据模型
- 不做复杂自动回复

## 2. 最小链路

当前只需要打通：

`Telerivet route -> Telerivet Webhook Service -> 我们的 Cloudflare SMS 入口 -> 原样记录 inbound payload`

## 3. 启动前确认

开始前确认下面这些已经具备：

- `Telerivet route` 在手机上正常工作
- `Webhook Service` 已创建
- `Webhook Secret` 已生成
- 我们准备好了一个可公网访问的 Cloudflare 入口 URL

## 4. 本轮入口的最小职责

第一版入口只做：

1. 接收 Telerivet webhook
2. 校验 `secret`
3. 解析 `application/x-www-form-urlencoded`
4. 原样保存关键字段和原始 payload
5. 返回成功响应，确保 Telerivet 不重试

## 5. 本轮需要拿到的真实样本

本轮至少采集 5 类短信样本：

1. 明确 booking request
- 例如：`Can I book a table for 2 tomorrow at 10am`

2. 只有 booking 结构信息
- 例如：`Friday 1pm for 4`

3. 普通低意向短信
- 例如：`Hi`

4. 非 booking 短信
- 例如 supplier / 推销 / 验证码

5. 延续中的补充短信
- 例如前一条已进入 booking flow，后一条只补 `4 people` 或邮箱

## 6. 每条样本要记录什么

每条真实样本至少记录：

- 原始 request body
- 解析后的字段名和值
- `secret` 的传递方式
- `message id`
- `phone number`
- `timestamp`
- 原始短信文本
- 样本类型标记

## 7. 本轮完成标准

满足下面条件，就算本轮完成：

1. `Telerivet webhook` 能稳定打到我们的入口
2. `secret` 校验方式已确认
3. `payload` 真实结构已确认
4. 已采集至少 5 类真实样本
5. 样本足够支持下一轮定义 handler 最小输入

## 8. 下一轮基于样本再做的事

本轮完成后，下一轮再做：

1. 定义 handler 最小输入格式
2. 定义高意向 booking 的入口判断规则
3. 再接现有 AI booking 核心

## 9. 当前一句话结论

`本轮不追求完整 SMS 功能，只追求把 Telerivet webhook 打到我们的入口，并收集真实短信 payload 样本，后续设计全部建立在真实输入之上。`
