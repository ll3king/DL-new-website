# Project Governance Branch And Doc Map

最后更新：2026-05-30

## 文档目的

这份文档只做两件事：

- 给当前仓库的历史分支建立业务关系表
- 给当前 `docs/` 建立最小的治理索引

它不是新的项目总览。  
当前总入口仍然是：

- [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)

模块与代码边界总表见：

- [project-module-code-boundary-map.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-module-code-boundary-map.zh-CN.md)

本文件是当前唯一允许保留的历史分支关系入口。

## 一、历史分支关系表

### A. booking 主系统主线

#### `feature/booking-rules-admin-upgrade`

- 主题：统一 booking rules，升级 admin booking backend
- 当前地位：booking 主系统最核心的历史主线
- 已沉淀能力：
  - `1-6 / 7+ / same-day / capacity` 规则统一
  - admin 列表 / Today / Calendar / manual entry / edit / cancel / approve
- 对应核心文档：
  - [booking-system-plan.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/booking-system-plan.zh-CN.md)
  - [postmortem-booking-rules-admin-upgrade.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-rules-admin-upgrade.zh-CN.md)

#### `feature/email-confirmation-verification`

- 主题：booking confirmation email + Sheets CRM
- 当前地位：booking 主系统重要支线，已并入主线能力
- 已沉淀能力：
  - confirmation / pending_review / approval_confirmed 邮件
  - `Guests`
  - `GuestEvents`
- 对应核心文档：
  - [booking-crm-min-path.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/booking-crm-min-path.zh-CN.md)
  - [postmortem-booking-email-crm.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-email-crm.zh-CN.md)

### B. booking 历史子入口主线

#### `feature/ai-brain-upgrade`

- 主题：`/api/chat` 升级成 booking-first AI brain
- 当前地位：booking system 的历史子入口主线
- 当前不应作为项目中心使用
- 当前治理状态：
  - 保留分支历史
  - 不再保留独立入口文档家族
  - 如需回查，只从本文件进入

#### `feature/sms-booking-gateway`

- 主题：SMS booking 渠道接入与主链路打通
- 当前地位：booking system 的历史子入口主线
- 当前不应作为项目中心使用
- 当前治理状态：
  - 保留分支历史
  - 不再保留独立入口文档家族
  - 如需回查，只从本文件进入

### C. 其他分支

#### `content-*`

- 主题：内容更新
- 当前地位：不属于 booking 主系统治理主线

#### `ai-feature/aeo-geo-optimization`

- 主题：SEO / GEO 相关
- 当前地位：不属于 booking 主系统治理主线

#### `ai-feature/booking-redirection-manual-alert`

- 主题：早期 booking 引导 / 提醒相关试验
- 当前地位：前序试验来源，不再作为独立治理对象

其主要功能已被后续主系统吸收或替代：

- 已吸收：
  - admin dashboard calendar / 列结构演进
  - booking schema alignment 思路
  - manual review / capacity 处理思路

- 已替代：
  - `7-10 walk-in / >10 manual`
  - 旧 AI concierge 分层人数规则
  - 旧 booking redirection 叙事

当前治理要求：

- 只保留它对 `Booking System` 的历史来源说明
- 不再把它视为当前有效项目
- 后续文档中不再单独展开这条线

## 二、当前 docs 职责划分

### 1. 当前主入口

- [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)

作用：

- 说明当前项目中心是谁
- 说明当前有效能力和边界
- 说明接手顺序

### 2. booking 主系统核心文档

- [booking-system-plan.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/booking-system-plan.zh-CN.md)
  - 性质：历史 planning
  - 用途：看 booking system 当时怎么被定义和收敛

- [postmortem-booking-rules-admin-upgrade.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-rules-admin-upgrade.zh-CN.md)
  - 性质：核心 retrospective
  - 用途：看 booking 主系统骨架如何落地

- [booking-crm-min-path.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/booking-crm-min-path.zh-CN.md)
  - 性质：运行路径说明
  - 用途：看 booking email / CRM 的最小实现与依赖

- [postmortem-booking-email-crm.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-email-crm.zh-CN.md)
  - 性质：阶段 retrospective
  - 用途：看 email + CRM 是如何并入主系统的

- [project-module-code-boundary-map.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-module-code-boundary-map.zh-CN.md)
  - 性质：治理总表
  - 用途：看各功能模块允许改哪些文件

### 3. AI brain 历史文档

当前治理动作：

- 不再保留独立 AI 文档家族作为项目入口
- AI 历史只在本文件中保留最小分支摘要
- AI 相关独立 brief / retrospective / alignment 文档进入清理范围

### 4. SMS 历史文档

当前治理动作：

- 不再保留独立 SMS 文档家族作为项目入口
- SMS 历史只在本文件中保留最小分支摘要
- SMS 相关 planning / alignment / brief / checklist 文档进入清理范围

## 三、当前推荐读取路径

### 如果目标是继续推进 booking backend 主系统

按下面顺序：

1. [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)
2. [postmortem-booking-rules-admin-upgrade.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-rules-admin-upgrade.zh-CN.md)
3. [booking-crm-min-path.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/booking-crm-min-path.zh-CN.md)
4. [postmortem-booking-email-crm.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-email-crm.zh-CN.md)

### 如果目标是回查 AI 或 SMS 历史

在读完总览后，直接回到本文件查看分支摘要，不再进入独立文档家族。

## 四、后续文档治理规则

### 1. 不再把历史子入口写成项目主叙事

以后即使继续修 AI chat 或 SMS，也应写成：

- “booking system 某个子入口的修正”

而不是写成平行主项目。

### 2. 结论稳定后，优先回收到总览或 postmortem

brief 可以写，但不能长期成为唯一口径。

### 3. 新的主系统治理变化，优先更新两处

- [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)
- 本文档

这样以后接手时不用重新拼分支史。

### 4. 已被吸收的试验线，不再保留独立文档叙事

像 `ai-feature/booking-redirection-manual-alert` 这种已被后续主系统吸收的线：

- 只保留最小历史来源说明
- 不再保留独立入口文档
- 不再继续扩写旧规则叙事

## 一句话总结

当前仓库里，真正要被当作“主系统历史”的，是 booking backend 主线；AI、SMS 与早期 booking 试验线都只保留最小历史摘要，不再保留独立治理入口。
