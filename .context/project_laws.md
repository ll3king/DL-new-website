# 项目宪法 (The Dandy Lane Constitution)
**Version:** 1.0.0
**Status:** ENFORCED
**Project:** Dandy Lane Cafe (Static AI-First Architecture)

## 第一条：刚性分层法 (Rigid Layering)
项目必须严格遵守以下五层结构，严禁越级或逆向调用：

- **L0 (Definitions/Data)**: 唯一信任源。
  - 目录：`data/`, `shared/types/`
  - 内容：`site.yaml`, `menu.yaml`, `constants`, `interfaces`。
- **L1 (Persistence/Storage)**: 原始文件处理。
  - 目录：`src/persistence/` (若涉及复杂读写)
- **L2 (Bridge/Blocks)**: 桥接层与模块。
  - 目录：`src/blocks/`
  - 内容：Composable Blocks逻辑。处理数据到视图的片段转换。
- **L3 (Logic/Assembly)**: 核心渲染逻辑。
  - 目录：`scripts/`, `src/layouts/`
  - 内容：静态站点生成逻辑 (SSG)。处理页面组装。
- **L4 (Views/Output)**: 表现层。
  - 目录：`public/`, `src/pages/` (定义)
  - 内容：最终生成的 HTML/CSS。

## 第二条：单向依赖法 (Unidirectional Dependency)
- 依赖流规范：`L4 -> L3 -> L2 -> L0`。
- 严禁逆向调用（例如：`data` 逻辑不能感知 `blocks` 的样式）。

## 第三条：契约先行法 (Contract-First)
- 任何 UI 或 逻辑变更前，必须首先在 L0 (`data/*.yaml`) 更新数据实体定义。
- 未在数据中定义的实体，严禁在页面中进行硬编码。

## 第四条：AI 优先 (AI-First)
- 所有内容输出必须包含 JSON-LD 结构化数据映射。
- 优先保证机器可读。
