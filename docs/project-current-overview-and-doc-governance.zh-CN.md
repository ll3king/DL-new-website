# Project Current Overview And Doc Governance

最后更新：2026-05-30

## 文档目的

这份文档是当前项目的总入口。

它只负责四件事：

- 固定当前项目真正的系统中心
- 固定当前已验证通过的主线能力
- 固定历史分支与子项目的正确从属关系
- 固定后续接手时应遵守的最小文档治理规则

如果后面重新接手这个项目，先看这份文档，不要先钻进旧 brief。

## 当前项目中心

当前项目的唯一主体，应理解为：

- `booking system backend`

它的核心不是 SMS，不是 AI chat，也不是单个前台入口，而是后台 booking 管理系统本身。

当前主系统中心包括：

- `functions/api/_booking.js`
- `functions/api/bookings.js`
- `functions/api/admin/bookings.js`
- `src/blocks/booking-form.html`
- `src/blocks/admin-bookings.html`

这五个点共同构成当前 booking system 的主要运行骨架。

## 当前项目边界

### 主系统负责

- booking 规则执行
- booking 主表写入与治理
- admin 后台列表、筛选、手工创建、编辑、取消、审批
- booking confirmation email 与基础 CRM 落表
- booking truth 的最终保存与状态流转

### 子入口负责

- Website booking form：前台客户提交入口
- Admin manual entry：后台 staff 手工录入入口
- AI chat：历史上接入 booking 的一个交互入口
- SMS：历史上接入 booking 的一个渠道入口

### 当前重要原则

- 子入口不是系统中心
- 子入口不能反过来主导 booking truth
- 后续任何优化，优先回到 booking backend 主体判断

## 当前有效结论

### 1. booking backend 主体已成立

当前已经稳定存在并可继续演进的核心能力：

- website booking form 可写入 booking 主表
- admin booking backend 可查看、筛选、Today 快捷查看、Calendar 按天查看
- admin 支持手工创建 booking
- admin 支持编辑 booking
- admin 支持取消 booking，且保留记录而不是硬删除
- admin 支持 approve
- booking confirmation / pending review / approval confirmed 邮件链路已落地
- `Guests` / `GuestEvents` 轻量 CRM 已落地

### 2. booking system 的规则主线已明确

当前稳定规则口径：

- `1-6`：可自动确认
- `7+`：进入 `Manual_Review`
- same-day：进入 `Manual_Review`
- capacity 超限：进入 `Manual_Review`

并且：

- `Manual_Review` 是系统状态
- `walk-in` 只是对客引导，不是系统状态替代品

### 3. booking 主表治理能力已进入主线

当前 `main` 已包含：

- admin 手工创建的提交锁与保存中反馈
- booking row append 后的轻量异步 dedupe cleanup

当前 dedupe 设计口径是：

- 不再依赖写入前同步硬拦截
- 以 booking 主表最终落表数据为准
- 出现完全重复 booking 时，保留旧 row，清理新 row

这条能力属于 booking 主表治理能力，而不是某个单入口的局部补丁。

### 4. SMS 和 AI brain 现在是历史子线，不是当前设计中心

截至目前：

- `SMS` 主链路已经跑通并在 production 验证过
- `AI brain` 的 booking-first 路径已经并入 `main`

但后续项目治理上，二者都不应再作为主系统中心理解。

正确关系是：

- 它们是已经接入过 booking system 的历史子入口
- 不是后续项目设计的主轴

## 历史分支关系

当前与主系统最相关的历史分支：

- `feature/booking-rules-admin-upgrade`
  - 作用：奠定 booking rules 统一与 admin backend 升级主骨架
  - 这是当前主系统最重要的历史分支

- `feature/email-confirmation-verification`
  - 作用：落地 booking email + Sheets CRM
  - 已成为 booking backend 主链路的一部分

- `feature/ai-brain-upgrade`
  - 作用：把 `/api/chat` 升级成 booking-first AI brain
  - 现在应视为 booking system 的历史子入口分支

- `feature/sms-booking-gateway`
  - 作用：打通 SMS booking 渠道
  - 现在应视为 booking system 的历史子入口分支

其他内容分支：

- `content-*`
- `ai-feature/aeo-geo-optimization`
- `ai-feature/booking-redirection-manual-alert`

不属于当前 booking backend 主治理主线。

## 当前最推荐的阅读顺序

如果未来要重新接手这个项目，建议按下面顺序看：

1. 本文档  
   [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)

2. booking 主系统复盘  
   [postmortem-booking-rules-admin-upgrade.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-rules-admin-upgrade.zh-CN.md)

3. booking email / CRM 主线  
   [booking-crm-min-path.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/booking-crm-min-path.zh-CN.md)  
   [postmortem-booking-email-crm.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-email-crm.zh-CN.md)

4. 分支与文档总表  
   [project-governance-branch-and-doc-map.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-governance-branch-and-doc-map.zh-CN.md)

5. 模块与代码边界总表  
   [project-module-code-boundary-map.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-module-code-boundary-map.zh-CN.md)

6. 如确实需要追溯历史子入口，再看：
   - [sms-project-retrospective-and-main-merge-readiness.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/sms-project-retrospective-and-main-merge-readiness.zh-CN.md)
   - [ai-brain-branch-retrospective.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/ai-brain-branch-retrospective.zh-CN.md)
   - [postmortem-ai-brain-main-merge.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-ai-brain-main-merge.zh-CN.md)

## 文档治理规则

这次不做大规模目录重构，只固定最小有效规则。

### 1. 当前状态以总览为准

以后如果项目中心、主线能力、接手顺序发生变化，优先更新本总览。

不要让“当前真实口径”只散落在历史 brief 或 chat 里。

### 2. 文档职责必须分开

- `current overview`
  - 只保留当前有效口径

- `plan`
  - 记录某一阶段准备怎么做

- `postmortem / retrospective`
  - 记录某一阶段最终做成了什么、踩了什么坑

- `brief`
  - 记录某一轮具体问题收敛
  - 只适合作为临时工作材料

### 3. 后续新增文档优先挂回主系统

以后只要文档内容实际上属于：

- booking rules
- admin backend
- booking table governance
- email / CRM
- 主表状态流转

就应优先回收到 booking 主系统脉络里，不要默认新开平行项目叙事。

### 4. SMS / AI 文档保留历史，但不再主导项目叙事

相关文档继续保留，原因是：

- 它们记录了真实历史工作
- 某些入口问题仍可能需要回查

但后续项目治理不应再从它们展开，而应从 booking backend 主体展开。

### 5. 每个功能模块必须有 code 改动边界

以后不能只知道模块做什么，还必须知道：

- 这个模块允许改哪些文件
- 这个模块默认不该碰哪些文件

当前统一总表见：

- [project-module-code-boundary-map.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-module-code-boundary-map.zh-CN.md)

## 当前最重要的一句话

`DL new website` 现在不应再被理解成几个平行小项目，而应被理解成一个以 booking backend/admin system 为中心、其他入口围绕其运转的主系统。
