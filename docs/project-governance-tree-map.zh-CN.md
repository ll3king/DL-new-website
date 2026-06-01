# Project Governance Tree Map

最后更新：2026-06-01

## 文档目的

这份文档用于把当前 `DL new website` 的治理结构用树状图固定下来。

它服务于两件事：

- 让新的 agent / 开发者 / 维护者能快速看懂项目结构
- 让后续任何功能更新都能先对齐项目层级，再进入模块边界

它不是新的主入口。

当前项目治理主入口仍然是：

- [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)

## 当前治理树状图

```text
DL new website
├─ README.md
│  └─ 仓库唯一外层入口
│
├─ docs/
│  ├─ project-current-overview-and-doc-governance.zh-CN.md
│  │  └─ 项目治理主入口
│  │
│  ├─ project-module-code-boundary-map.zh-CN.md
│  │  └─ 模块 -> code 改动边界总表
│  │
│  ├─ project-governance-branch-and-doc-map.zh-CN.md
│  │  └─ 历史分支与文档关系总表
│  │
│  ├─ project-governance-tree-map.zh-CN.md
│  │  └─ 当前治理树状图
│  │
│  ├─ postmortem-booking-rules-admin-upgrade.zh-CN.md
│  │  └─ Booking System 核心 retrospective
│  │
│  ├─ booking-crm-min-path.zh-CN.md
│  │  └─ Booking email + Sheets CRM 最小运行路径
│  │
│  ├─ postmortem-booking-email-crm.zh-CN.md
│  │  └─ Booking email + CRM retrospective
│  │
│  ├─ content-update-quick-entry.zh-CN.md
│  │  └─ Content 小入口
│  │
│  ├─ search-optimization-entry.zh-CN.md
│  │  └─ Search Optimization 直接入口
│  │
│  ├─ Knowledge.md
│  │  └─ 已降级为历史参考
│  │
│  └─ system_blueprint.md
│     └─ 已降级为历史参考
│
├─ Website
│  └─ website shell / structure
│
├─ Booking System
│  ├─ booking rules
│  ├─ admin bookings dashboard
│  ├─ booking form
│  ├─ booking email + CRM
│  └─ booking table governance
│
├─ Search Optimization
│  └─ SEO / GEO / AEO / schema / redirects / discovery
│
├─ Content
│  └─ stories / posts / media
│
├─ AI Chat
│  └─ website chat entry
│
└─ SMS
   └─ sms booking entry
```

## 当前结构理解

### 1. 根入口层

- `README.md` 是仓库唯一外层入口
- 新 agent 进入项目时，不应跳过 `README.md`

### 2. 治理层

`docs/` 里当前真正活跃的治理主干是：

- `project-current-overview-and-doc-governance`
- `project-module-code-boundary-map`
- `project-governance-branch-and-doc-map`
- `project-governance-tree-map`

这四份一起构成当前的治理骨架。

### 3. 主系统层

当前项目的业务中心是：

- `Booking System`

它是默认的主判断中心。

如果后续问题涉及：

- booking rules
- admin backend
- booking form
- booking email + CRM
- booking table governance

都应优先按 `Booking System` 主线理解。

### 4. 模块层

当前 `Website` 项目按模块治理：

- `Website`
- `Booking System`
- `Search Optimization`
- `Content`
- `AI Chat`
- `SMS`

其中：

- `Booking System` 是业务主中心
- `Search Optimization` 是独立功能模块
- `Content` 是小入口模块
- `AI Chat` / `SMS` 是功能模块，但不再是项目叙事中心

### 5. 历史层

下面两份文档只保留为历史参考：

- `docs/Knowledge.md`
- `docs/system_blueprint.md`

它们不再指导当前实现，不再指导当前入口，也不再代表当前结构。

## 当前治理规则

1. 先走 `README.md`，再走项目治理主入口。
2. 先判断属于哪个功能模块，再看模块 code 边界。
3. 历史分支关系只通过 `project-governance-branch-and-doc-map` 回查。
4. `AI Chat` / `SMS` 不再保留独立项目入口家族。
5. `Content` 和 `Search Optimization` 可以直接走小入口，但仍受模块边界约束。

## 一句话总结

当前 `DL new website` 的治理结构，已经从“多条平行历史叙事”收束成了“README 外层入口 + docs 治理骨架 + Booking System 主中心 + 模块直接入口”的单一主结构。
