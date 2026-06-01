# Booking Rules + Admin Upgrade Post Mortem

最后更新：2026-04-23  
范围：`feature/booking-rules-admin-upgrade` -> `main`

## 1. 背景

本轮工作的起点不是单纯修某个页面，而是重新对齐整个 booking system。

项目里当时同时存在多条 booking 入口：

- Website booking form
- Website AI chat
- Admin manual entry
- SMS booking（开发中）

业务上这些入口都属于同一个 booking system，但代码层面规则并不统一。

主要问题：

- booking rules 分散在不同入口中
- Website form 与 AI chat 的 booking 判断不一致
- Admin 后台能力不够，无法高效处理人工介入
- 文案层也没有完全同步到最新 booking 策略

## 2. 目标

本轮目标最终收敛为两部分：

1. 统一 booking rules
2. 升级 admin booking 后台

明确不纳入本轮：

- SMS 自动 confirmation 主链路
- Website form 字段重构
- notes / review_reason / override reason 等复杂字段体系

## 3. 关键业务决策

这次最重要的价值不在代码，而在规则收敛。

### 3.1 保留简单规则，删除低价值复杂度

原逻辑里存在 `6人` 和 `10人` 两个分界点：

- `1-6` 自动确认
- `7-10` walk-in recommended
- `>10` manual review

复盘后发现：

- `10人` 这层特殊分支在真实运营里几乎没有触发价值
- 会增加规则复杂度和解释成本

最终改为：

- `1-6`：自动确认
- `7+`：统一 `Manual_Review`

### 3.2 same-day booking 不拒客

对于今天的 booking：

- 不直接拒绝
- 统一进入 `Manual_Review`
- 同时引导 walk-in

这保证了：

- 不做错误承诺
- 不把客人挡在门外
- 把最后决定权留给店员

### 3.3 capacity rule 是自动化限制，不是门店真实上限

原先容易把 `16 pax/hour` 理解成门店硬上限。  
本轮明确：

- `16 pax/hour` 是自动确认限制
- 不是门店真实接待极限
- 一旦触发限制，处理策略应是：
  - 落 booking 记录
  - 进入 `Manual_Review`
  - 引导 walk-in

### 3.4 人工优先

Admin / staff manual entry 优先级最高：

- 人工录入默认直接 `Confirmed`
- 若录错，依靠 `edit` 修正
- 因此 `edit` 被确定为必需功能

### 3.5 联系方式转向 mobile-first

在后续 SMS 自动化方向明确后，系统联系方式策略也被重新定义：

- `mobile-first`
- `email-optional`

虽然本轮没有把 SMS confirmation 主链路做完，但这个方向已经成为后续基线。

## 4. 本轮实际实现

### 4.1 booking rules 统一

落地内容：

- Website form 使用统一 booking 判定
- AI chat booking 判定同步到同一套规则
- `7+` / same-day / capacity 都进入 `Manual_Review`
- 这些请求都落 booking 记录

### 4.2 Admin 后台升级

落地内容：

- 列表按 booking 日期 + 时间排序
- 增加 `Today` 快捷入口
- 增加日期 / 状态 / 来源 / 搜索筛选
- Calendar view 支持点击某天查看当天 booking
- 增加人工录入入口
- 增加 `edit`
- `cancel` 改为状态更新，不删除记录
- `approve` 保留

### 4.3 文案同步

落地内容：

- form 提交后的页面提示更新
- email 文案同步到最新 booking 策略
- manual cancel 自动发送取消邮件

## 5. 验证结果

本轮验证过的关键路径：

- Website form `1-6` booking
- Website form `7+` booking
- Admin 列表排序
- Admin Today 快捷入口
- Calendar 点日查看
- Staff manual entry
- Admin edit
- Admin cancel
- manual cancel 邮件通知

其中有一个重要教训：

- 一度误以为 cancel email 没有触发
- 实际原因是测试落在旧 preview deployment 上
- 切到最新部署后，cancel email 正常发送

## 6. 本轮做对的地方

### 6.1 先做规则对齐，再做代码

一开始没有急着动手改，而是先把：

- 项目真实结构
- 多入口关系
- booking rules
- admin MVP 范围

全部对齐清楚。

这一步减少了很多返工。

### 6.2 及时收缩范围

本轮中途明确把范围锁定在：

- `8.1 booking rules 统一`
- `8.2 admin 后台升级`

而把 SMS confirmation 主链路留到下一阶段。  
这个决定是正确的，否则会被前置依赖拖慢。

### 6.3 让系统更简洁，而不是更“完整”

这次多次出现一个正确倾向：

- 不为了理论完整保留低价值复杂度
- 只保留当前门店真正需要的功能

例如：

- 去掉 `10人` 分界点
- 不急着加 notes
- 不急着加 review_reason
- 不急着加 override reason
- 不做人工 archive

这使得本轮结果更贴近实际运营。

## 7. 本轮暴露的问题

### 7.1 规则实现曾经分散

这个问题是本轮的根源：

- form、chat、admin 的规则并不天然一致
- 同一个 booking system 被拆成了多个行为不一致的入口

虽然本轮已经做了收敛，但长期仍需要更明确的统一 rule layer。

### 7.2 文案和规则容易脱节

一开始的代码变更先同步了规则，但没有完全同步：

- form 页面提示
- email 文案

说明以后凡是改 booking policy，都应同步检查：

- 页面提示
- email
- chat reply
- SMS reply

### 7.3 部署验证存在版本误判风险

本轮出现过“功能已修但测试环境没更新”的判断偏差。  
以后验证线上/preview 问题时，必须先确认：

- 测的是哪个 deployment
- 对应哪个 commit

## 8. 后续建议

### 8.1 下一阶段优先项

建议优先继续推进：

- SMS 自动 confirmation 主链路
- AI chat / SMS 对客模板进一步统一
- 如有必要，再考虑把 Website form 也逐步对齐到 mobile-first 流程

### 8.2 暂不急着做的

以下内容目前不应优先：

- notes 系统
- review_reason 体系
- override reason 体系
- 更复杂 guest profile
- 更复杂运营标签

### 8.3 流程建议

以后类似改动，建议遵循：

1. 先写 planning doc
2. 先锁范围
3. 先改规则，再改 UI
4. 最后统一同步文案与通知
5. 测试前先确认 deployment 对应 commit

## 9. 一句话总结

本轮工作的本质，不是“加了几个按钮”，而是把一个多入口、规则分散的 booking system，收敛成了一套更简单、更可运营、也更适合继续演进的基础版本。
