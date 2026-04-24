# SMS 测试分支执行规范

最后更新：2026-04-24  
状态：Execution Rule  
目标：明确 SMS 功能的开发、联调、样本采集与验证，必须以分支形式进行，禁止直接在 `main` 上搭建或测试。

## 1. 核心规则

`SMS 功能开发与测试必须在专用 branch 上进行，不允许直接在 main branch 上搭建或联调。`

## 2. main branch 的约束

在 `main` 上允许：

- planning
- 文档整理
- 架构对齐
- implement plan 收敛

在 `main` 上不允许：

- 新增 SMS webhook 入口
- 新增 SMS 样本采集代码
- 接入 Telerivet 测试
- 进行 SMS 功能联调
- 以 `main` 对外提供测试 URL

## 3. SMS 测试 branch 的职责

SMS 专用测试分支负责：

- 新增最小 webhook 入口
- 接 Telerivet webhook
- 采集真实 SMS payload 样本
- 进行入口筛选测试
- 进行 handler 接入测试
- 做 SMS 功能相关验证

## 4. 分支工作原则

### 4.1 先建分支，再开发

任何 SMS 相关实现开始前，必须先确认并进入专用 branch。

### 4.2 branch 只服务 SMS

SMS 测试分支中，应尽量避免混入无关改动。

### 4.3 测试 URL 只指向 branch 对应环境

Telerivet 的 `Webhook URL` 只能指向：

- SMS 测试 branch 对应的测试环境
- 或该 branch 对应的预览部署地址

不能指向：

- `main` 的正式域名入口
- `main` 的正式生产路径

## 5. 当前建议的执行顺序

后续应严格按下面顺序推进：

1. 建立 SMS 专用测试 branch
2. 在 branch 中增加最小 webhook 样本采集入口
3. 部署 branch 对应测试环境
4. 将 Telerivet webhook 指向 branch 测试 URL
5. 获取真实 SMS 输入样本
6. 基于真实样本继续 handler 设计与联调

## 6. 当前一句话结论

`SMS 功能的实现与联调，从现在起必须严格在专用测试 branch 上进行；main branch 只保留规划与文档，不承担任何 SMS 测试入口。`
