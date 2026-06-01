# Dandy Lane Cafe Website

最后更新：2026-06-01

## 主入口

这是当前仓库的唯一外层入口。

任何新的 agent、开发者或维护者进入这个项目时，先从这里开始，不要先读旧分支文档，也不要先从历史架构说明进入。

## 当前项目中心

当前 `DL new website` 应被理解为一个 `Website` 主项目。

它的业务中心是：

- `Booking System`

当前最重要的系统事实是：

- `Booking System` 仍是整个项目最核心的功能主线
- 当前开发与治理默认按“功能模块”进入
- 不再按旧 AI / SMS / 早期试验线作为项目入口理解

## 当前推荐阅读顺序

### 1. 项目总入口

- [docs/project-current-overview-and-doc-governance.zh-CN.md](docs/project-current-overview-and-doc-governance.zh-CN.md)

### 2. 功能模块与 code 边界

- [docs/project-module-code-boundary-map.zh-CN.md](docs/project-module-code-boundary-map.zh-CN.md)

### 3. 分支与历史关系

- [docs/project-governance-branch-and-doc-map.zh-CN.md](docs/project-governance-branch-and-doc-map.zh-CN.md)

### 4. 治理树状图

- [docs/project-governance-tree-map.zh-CN.md](docs/project-governance-tree-map.zh-CN.md)

### 5. `Booking System` 核心参考

- [docs/postmortem-booking-rules-admin-upgrade.zh-CN.md](docs/postmortem-booking-rules-admin-upgrade.zh-CN.md)
- [docs/booking-crm-min-path.zh-CN.md](docs/booking-crm-min-path.zh-CN.md)
- [docs/postmortem-booking-email-crm.zh-CN.md](docs/postmortem-booking-email-crm.zh-CN.md)

### 6. `Content` 小入口

如果只是更新 stories / posts / media，直接进入：

- [docs/content-update-quick-entry.zh-CN.md](docs/content-update-quick-entry.zh-CN.md)

### 7. `Search Optimization` 入口

如果这次工作属于 SEO / GEO / AEO / schema / redirects，直接进入：

- [docs/search-optimization-entry.zh-CN.md](docs/search-optimization-entry.zh-CN.md)

## 当前功能模块

当前 Website 项目集合按下面模块治理：

- `Website`
- `Booking System`
- `Search Optimization`
- `Content`
- `AI Chat`
- `SMS`

详细职责和允许改动的文件边界，统一看：

- [docs/project-module-code-boundary-map.zh-CN.md](docs/project-module-code-boundary-map.zh-CN.md)

## 根目录历史文档说明

下面两份文档不再是当前入口，并已降级到 `docs/`：

- `docs/Knowledge.md`
- `docs/system_blueprint.md`

它们现在只保留为历史参考，不代表当前有效项目结构，也不应作为新的接手入口。

## 一句话规则

先看 `README.md`，再看 `docs/project-current-overview-and-doc-governance.zh-CN.md`，再按功能模块进入具体文档和代码边界。
