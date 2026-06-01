# Project Governance Branch And Doc Map

最后更新：2026-06-01

## 文档目的

这份文档只做两件事：

- 给当前仓库的历史分支建立业务关系表
- 给当前 `docs/` 建立最小治理索引

它不是主入口。

当前唯一主入口仍然是：

- [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)

模块与 code 边界总表见：

- [project-module-code-boundary-map.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-module-code-boundary-map.zh-CN.md)

## 一、历史分支关系表

### A. Booking System 主线

#### `feature/booking-rules-admin-upgrade`

- 主题：统一 booking rules，升级 admin booking backend
- 当前地位：`Booking System` 的核心主线来源
- 已沉淀能力：
  - `1-6 / 7+ / same-day / capacity` 规则统一
  - admin 列表 / Today / Calendar / manual entry / edit / cancel / approve
- 对应核心文档：
  - [postmortem-booking-rules-admin-upgrade.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-rules-admin-upgrade.zh-CN.md)

#### `feature/email-confirmation-verification`

- 主题：booking confirmation email + Sheets CRM
- 当前地位：`Booking System` 的重要支线，已并入主线能力
- 已沉淀能力：
  - confirmation / pending_review / approval_confirmed 邮件
  - `Guests`
  - `GuestEvents`
- 对应核心文档：
  - [booking-crm-min-path.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/booking-crm-min-path.zh-CN.md)
  - [postmortem-booking-email-crm.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-email-crm.zh-CN.md)

### B. Booking 历史子入口主线

#### `feature/ai-brain-upgrade`

- 主题：`/api/chat` 升级为 booking-first AI chat 路径
- 当前地位：`Booking System` 的历史子入口主线
- 当前治理状态：
  - 保留分支历史
  - 不再保留独立 AI 文档家族
  - 如需回查，只从本文件进入

#### `feature/sms-booking-gateway`

- 主题：SMS booking 渠道接入与主链路打通
- 当前地位：`Booking System` 的历史子入口主线
- 当前治理状态：
  - 保留分支历史
  - 不再保留独立 SMS 文档家族
  - 如需回查，只从本文件进入

### C. 其他分支

#### `content-*`

- 主题：内容更新
- 当前地位：属于 `Content` 小模块，不属于 `Booking System` 主线

#### `ai-feature/aeo-geo-optimization`

- 主题：SEO / GEO / AEO 相关
- 当前地位：应收束到 `Search Optimization`

#### `ai-feature/booking-redirection-manual-alert`

- 主题：早期 booking 引导 / 提醒相关试验
- 当前地位：前序试验来源，不再作为独立治理对象

它的主要内容已经被后续主系统吸收或替代：

- 已吸收：
  - admin dashboard calendar / 列结构演进思路
  - booking schema alignment 思路
  - manual review / capacity 处理思路

- 已替代：
  - `7-10 walk-in / >10 manual`
  - 旧 AI concierge 分层人数规则
  - 旧 booking redirection 叙事

当前治理要求：

- 只保留它对 `Booking System` 的历史来源说明
- 不再把它视为当前有效项目
- 不再单独扩写这条线

## 二、当前 docs 索引

### 1. 主入口

- [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)

### 2. 核心参考

- [postmortem-booking-rules-admin-upgrade.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-rules-admin-upgrade.zh-CN.md)
- [booking-crm-min-path.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/booking-crm-min-path.zh-CN.md)
- [postmortem-booking-email-crm.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-email-crm.zh-CN.md)
- [project-module-code-boundary-map.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-module-code-boundary-map.zh-CN.md)

### 3. Content 小入口

- [content-update-quick-entry.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/content-update-quick-entry.zh-CN.md)

## 三、当前 docs 保留规则

当前 `docs/` 只保留：

- 一个主入口
- 一组核心参考
- 一个 `Content` 小入口

不再保留：

- 独立 AI 文档家族
- 独立 SMS 文档家族
- 已被后续实现替代的旧 planning 文档

## 四、当前推荐读取路径

### 如果目标是继续推进 `Booking System`

按下面顺序：

1. [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)
2. [postmortem-booking-rules-admin-upgrade.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-rules-admin-upgrade.zh-CN.md)
3. [booking-crm-min-path.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/booking-crm-min-path.zh-CN.md)
4. [postmortem-booking-email-crm.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-email-crm.zh-CN.md)
5. [project-module-code-boundary-map.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-module-code-boundary-map.zh-CN.md)

### 如果目标只是更新 `Content`

直接进入：

- [content-update-quick-entry.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/content-update-quick-entry.zh-CN.md)

### 如果目标是回查 AI / SMS / 早期试验历史

先读完总入口，再回到本文件查看最小分支摘要。

## 一句话总结

当前仓库里，真正要被当作主系统历史的，是 `Booking System` 主线；AI、SMS 与早期 booking 试验线只保留最小历史摘要，不再保留独立治理入口。
