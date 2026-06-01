# Project Current Overview And Doc Governance

最后更新：2026-06-01

## 文档目的

这份文档是当前项目治理主入口。

它只负责四件事：

- 固定当前项目真正的系统中心
- 固定当前还有效的功能模块入口
- 固定当前保留的文档集合
- 固定后续接手时应遵守的最小文档治理规则

如果未来重新接手这个项目，先看这份文档，不要先钻进旧 brief，也不要从历史子模块文档开始。

在仓库层面，最外层入口固定为：

- [README.md](../README.md)

也就是说：

- `README.md` = 仓库外层入口
- 本文档 = 项目治理主入口

## 当前项目中心

当前项目的主系统中心是：

- `Booking System`

它在 `Website` 项目集合里是最核心的业务系统，当前仍以后台 booking 管理系统为中心展开。

当前主系统核心代码包括：

- `functions/api/_booking.js`
- `functions/api/bookings.js`
- `functions/api/admin/bookings.js`
- `src/blocks/booking-form.html`
- `src/blocks/admin-bookings.html`

## 当前功能模块入口

当前 Website 项目按功能模块进入，不再按旧分支或旧 brief 进入。

当前有效模块为：

- `Website`
- `Booking System`
- `Search Optimization`
- `Content`
- `AI Chat`
- `SMS`

模块职责和 code 改动边界总表见：

- [project-module-code-boundary-map.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-module-code-boundary-map.zh-CN.md)

## 当前保留文档

当前 `docs/` 只保留三类：

### 1. 主入口

- [README.md](../README.md)
- [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)

### 2. 核心参考

- [postmortem-booking-rules-admin-upgrade.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-rules-admin-upgrade.zh-CN.md)
- [booking-crm-min-path.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/booking-crm-min-path.zh-CN.md)
- [postmortem-booking-email-crm.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-email-crm.zh-CN.md)
- [project-governance-branch-and-doc-map.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-governance-branch-and-doc-map.zh-CN.md)
- [project-module-code-boundary-map.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-module-code-boundary-map.zh-CN.md)

### 3. 模块直接入口

- [content-update-quick-entry.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/content-update-quick-entry.zh-CN.md)
- [search-optimization-entry.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/search-optimization-entry.zh-CN.md)

凡是不在上面这三类中的旧文档，不再作为当前治理入口保留。

根目录历史说明文档已经降级到：

- [Knowledge.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/Knowledge.md)
- [system_blueprint.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/system_blueprint.md)

它们只保留历史参考定位，不属于当前活跃入口集合。

## 当前最推荐的阅读顺序

如果目标是继续推进主系统，按下面顺序看：

1. [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)
2. [postmortem-booking-rules-admin-upgrade.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-rules-admin-upgrade.zh-CN.md)
3. [booking-crm-min-path.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/booking-crm-min-path.zh-CN.md)
4. [postmortem-booking-email-crm.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/postmortem-booking-email-crm.zh-CN.md)
5. [project-governance-branch-and-doc-map.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-governance-branch-and-doc-map.zh-CN.md)
6. [project-module-code-boundary-map.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-module-code-boundary-map.zh-CN.md)

如果只是更新 stories / posts / media，直接走：

- [content-update-quick-entry.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/content-update-quick-entry.zh-CN.md)

如果这次工作属于 SEO / GEO / AEO / schema / redirects，直接走：

- [search-optimization-entry.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/search-optimization-entry.zh-CN.md)

## 文档治理规则

### 1. 总入口唯一

后续任何人进入这个项目，先看 `README.md`，再看本文件。

### 2. 模块优先于历史分支

以后继续开发时，应先确认属于哪个功能模块，再去看模块对应的 code 边界，而不是先按历史分支找路。

### 3. 历史子模块不再保留独立入口家族

`AI Chat` 和 `SMS` 可以继续作为功能模块存在，但它们不再拥有独立的接手入口文档家族。

### 4. 已被替代的旧 planning 文档不再保留

只保留仍对当前系统有参考价值的 retrospective、最小运行路径文档和模块边界文档。

### 5. Content 保留一个小入口

`Content` 不是主系统中心，但保留一个很小、很直接的入口，避免每次内容更新都绕完整个大治理框架。

### 6. Search Optimization 保留一个直接入口

`Search Optimization` 不是 `Booking System` 的附属说明，应保留自己的直接入口，但仍受模块 code 边界约束。

## 当前最重要的一句话

`DL new website` 现在应被理解成一个以 `Booking System` 为业务中心、以功能模块治理为更新入口的 `Website` 主项目，而不是若干平行小项目的集合。
