# Project Governance Branch And Doc Map

最后更新：2026-05-30

## 文档目的

这份文档只做两件事：

- 给当前仓库的历史分支建立业务关系表
- 给当前 `docs/` 建立最小的治理索引

它不是新的项目总览。  
当前总入口仍然是：

- [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)

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
- 对应核心文档：
  - [ai-brain-branch-retrospective.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/ai-brain-branch-retrospective.zh-CN.md)
  - [ai-chat-brain-alignment.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/ai-chat-brain-alignment.zh-CN.md)
  - [postmortem-ai-brain-main-merge.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-ai-brain-main-merge.zh-CN.md)

#### `feature/sms-booking-gateway`

- 主题：SMS booking 渠道接入与主链路打通
- 当前地位：booking system 的历史子入口主线
- 当前不应作为项目中心使用
- 对应核心文档：
  - [sms-project-retrospective-and-main-merge-readiness.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/sms-project-retrospective-and-main-merge-readiness.zh-CN.md)
  - 其余 `sms-*` 文档

### C. 其他分支

#### `content-*`

- 主题：内容更新
- 当前地位：不属于 booking 主系统治理主线

#### `ai-feature/aeo-geo-optimization`

- 主题：SEO / GEO 相关
- 当前地位：不属于 booking 主系统治理主线

#### `ai-feature/booking-redirection-manual-alert`

- 主题：早期 booking 引导 / 提醒相关试验
- 当前地位：可保留历史，但不属于当前 booking backend 主线

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

### 3. AI brain 历史文档

- [ai-brain-branch-retrospective.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/ai-brain-branch-retrospective.zh-CN.md)
- [ai-chat-brain-alignment.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/ai-chat-brain-alignment.zh-CN.md)
- [postmortem-ai-brain-main-merge.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-ai-brain-main-merge.zh-CN.md)
- [ai-brain-fix-brief.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/ai-brain-fix-brief.zh-CN.md)

治理定位：

- 这些文档保留历史价值
- 但后续不是项目总入口
- 只在需要回查 AI 子入口历史时再打开

### 4. SMS 历史文档

- [sms-project-retrospective-and-main-merge-readiness.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/sms-project-retrospective-and-main-merge-readiness.zh-CN.md)
- 其他 `sms-*` 文档

治理定位：

- 这些文档主要服务历史追溯
- 它们数量多，且包含大量阶段性 brief
- 后续默认不要从这些文档开始理解项目

## 三、当前推荐读取路径

### 如果目标是继续推进 booking backend 主系统

按下面顺序：

1. [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)
2. [postmortem-booking-rules-admin-upgrade.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-rules-admin-upgrade.zh-CN.md)
3. [booking-crm-min-path.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/booking-crm-min-path.zh-CN.md)
4. [postmortem-booking-email-crm.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-email-crm.zh-CN.md)

### 如果目标是回查 AI 或 SMS 历史

在读完总览后，再按需进入：

- AI：`ai-*` / `postmortem-ai-brain-main-merge`
- SMS：`sms-*`

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

## 一句话总结

当前仓库里，真正要被当作“主系统历史”的，是 booking backend 主线；AI 与 SMS 都保留历史价值，但都不再是项目叙事中心。
