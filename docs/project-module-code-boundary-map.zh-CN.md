# Project Module Code Boundary Map

最后更新：2026-06-01

## 文档目的

这份文档用于固定：

- 当前 `Website` 主项目下的一级模块
- 每个模块下的具体功能模块
- 每个功能模块允许改动的代码边界
- 每个功能模块默认不应触碰的代码区域

这份文档不负责解释历史决策。  
历史来源和分支关系请看：

- [project-governance-branch-and-doc-map.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-governance-branch-and-doc-map.zh-CN.md)

当前项目总入口请看：

- [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)

## 使用规则

以后任何功能更新，先找对应模块，再只在该模块允许的代码边界内工作。

如果某次需求必须跨边界改动，必须先明确：

- 为什么必须跨边界
- 影响的是哪个主系统关系
- 是一次联动修复，还是模块边界需要正式调整

## 一、Website

### 1. website shell / structure

职责：

- 全站页面壳层
- 全站共享样式与脚本
- 首页 / FAQ / Menu / Location 等页面结构

主要可改文件：

- [public/index.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/index.html)
- [public/menu.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/menu.html)
- [public/location.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/location.html)
- [public/faq.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/faq.html)
- [src/assets/css/style.css](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/assets/css/style.css)
- [src/assets/js/main.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/assets/js/main.js)
- [src/blocks/menu-grid.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/menu-grid.html)
- [src/blocks/social-proof-reviews.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/social-proof-reviews.html)
- [src/blocks/signature-trio.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/signature-trio.html)
- [src/blocks/identity-hero.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/identity-hero.html)

默认不该碰：

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [functions/api/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/bookings.js)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)
- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)
- [functions/api/sms/telerivet-inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-inbound.js)

## 二、Booking System

### 1. booking rules

职责：

- booking 状态规则
- 人数 / same-day / capacity 等规则判断
- `Confirmed / Manual_Review / Cancelled` 等核心状态约束

主要可改文件：

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [functions/api/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/bookings.js)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)

关联可改文件：

- [src/blocks/booking-form.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/booking-form.html)
- [src/blocks/admin-bookings.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/admin-bookings.html)

默认不该碰：

- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)
- [functions/api/sms/telerivet-inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-inbound.js)
- [data/stories.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/stories.yaml)

### 2. admin bookings dashboard

职责：

- booking 列表
- `Today`
- `Calendar`
- search / filter
- manual entry
- edit / cancel / approve

主要可改文件：

- [src/blocks/admin-bookings.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/admin-bookings.html)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)
- [public/admin.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/admin.html)

关联可改文件：

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [src/assets/js/main.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/assets/js/main.js)
- [src/assets/css/style.css](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/assets/css/style.css)

默认不该碰：

- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)
- [functions/api/sms/telerivet-inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-inbound.js)
- [data/stories.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/stories.yaml)

### 3. booking form

职责：

- 前台 booking 提交入口
- 表单字段
- 提交体验

主要可改文件：

- [src/blocks/booking-form.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/booking-form.html)
- [functions/api/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/bookings.js)
- [public/booking.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/booking.html)

关联可改文件：

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [src/assets/js/main.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/assets/js/main.js)
- [src/assets/css/style.css](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/assets/css/style.css)

默认不该碰：

- [src/blocks/admin-bookings.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/admin-bookings.html)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)
- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)
- [functions/api/sms/telerivet-inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-inbound.js)

### 4. booking email + CRM

职责：

- confirmation / pending_review / approval_confirmed 邮件
- `Guests`
- `GuestEvents`
- 邮件状态追踪

主要可改文件：

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [functions/api/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/bookings.js)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)

默认不该碰：

- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)
- [functions/api/sms/telerivet-inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-inbound.js)
- [data/stories.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/stories.yaml)

### 5. booking table governance

职责：

- booking 主表一致性治理
- append row 后 cleanup
- dedupe
- archival / janitor 相关治理

主要可改文件：

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [functions/api/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/bookings.js)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)
- [functions/api/janitor.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/janitor.js)

默认不该碰：

- [src/blocks/story-list.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-list.html)
- [src/blocks/story-detail.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-detail.html)
- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)
- [functions/api/sms/telerivet-inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-inbound.js)

## 三、AI Chat

### 1. AI chat bot

职责：

- 网站 chat 入口
- booking-first chat 流程
- `general / create / lookup / cancel`

主要可改文件：

- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [src/blocks/chatbot-widget.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/chatbot-widget.html)

关联可改文件：

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)

默认不该碰：

- [src/blocks/admin-bookings.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/admin-bookings.html)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)
- [functions/api/sms/telerivet-inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-inbound.js)
- [data/stories.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/stories.yaml)

## 四、SMS

### 1. SMS booking

职责：

- SMS inbound / outbound
- thread
- gateway
- booking bridge

主要可改文件：

- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)
- [functions/api/sms/telerivet-inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-inbound.js)
- [functions/api/sms/telerivet-sample.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-sample.js)

关联可改文件：

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)

默认不该碰：

- [src/blocks/admin-bookings.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/admin-bookings.html)
- [src/blocks/booking-form.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/booking-form.html)
- [data/stories.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/stories.yaml)

## 五、Search Optimization

### 1. schema / SEO / GEO / AEO

职责：

- search-facing 结构优化
- entity / NAP
- schema
- redirects
- crawling / discovery 辅助

主要可改文件：

- [data/site.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/site.yaml)
- [public/robots.txt](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/robots.txt)
- [public/sitemap.xml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/sitemap.xml)
- [public/_redirects](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/_redirects)
- [public/_headers](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/_headers)
- [src/blocks/location-nap.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/location-nap.html)
- [src/blocks/faq-list.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/faq-list.html)
- [src/blocks/identity-hero.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/identity-hero.html)
- [src/blocks/intent-match.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/intent-match.html)

关联可改文件：

- [functions/api/janitor.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/janitor.js)

默认不该碰：

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [functions/api/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/bookings.js)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)
- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)

## 六、Content

### 1. stories / posts

职责：

- stories 更新
- story 封面 / 配图更新
- story list / detail 呈现

主要可改文件：

- [data/stories.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/stories.yaml)
- [src/blocks/story-list.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-list.html)
- [src/blocks/story-detail.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-detail.html)
- [src/assets/media](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/assets/media)

关联生成结果：

- [public/stories.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/stories.html)
- [public/stories-the-pulse-of-the-lane.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/stories-the-pulse-of-the-lane.html)
- 其他 `public/stories-*.html`

默认不该碰：

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [functions/api/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/bookings.js)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)
- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)
- [functions/api/sms/telerivet-inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-inbound.js)

## 七、当前最重要的治理规则

以后每次更新某个功能模块，先做三件事：

1. 先确认这次属于哪个模块
2. 先看这个模块允许改哪些文件
3. 如果要跨边界，先说明为什么

如果这三步没做，就不应直接开始改代码。
