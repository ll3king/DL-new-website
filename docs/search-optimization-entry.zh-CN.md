# Search Optimization Entry

最后更新：2026-06-01

## 文档目的

这份文档是 `Search Optimization` 的直接入口。

它只服务一类工作：

- SEO / GEO / AEO / schema / redirects / search-facing structure 更新

它不负责：

- `Booking System`
- admin backend
- AI Chat
- SMS
- stories / posts / media 更新

如果这次工作不是 `Search Optimization`，请回到：

- [project-current-overview-and-doc-governance.zh-CN.md](./project-current-overview-and-doc-governance.zh-CN.md)

## 当前模块定位

`Search Optimization` 是 `Website` 项目中的一个独立功能模块。

它的职责是把原来分散的：

- SEO
- GEO
- AEO

收束成一个统一模块来治理。

当前最重要的范围包括：

- entity / NAP
- schema
- redirects
- robots / sitemap
- search-facing content structure
- crawling / discovery 辅助

## 允许改动的主要文件

- [data/site.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/site.yaml)
- [public/robots.txt](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/robots.txt)
- [public/sitemap.xml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/sitemap.xml)
- [public/_redirects](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/_redirects)
- [public/_headers](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/_headers)
- [src/blocks/location-nap.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/location-nap.html)
- [src/blocks/faq-list.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/faq-list.html)
- [src/blocks/identity-hero.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/identity-hero.html)
- [src/blocks/intent-match.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/intent-match.html)

## 关联可改文件

- [functions/api/janitor.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/janitor.js)

## 默认不要碰

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [functions/api/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/bookings.js)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)
- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)
- [functions/api/sms/telerivet-inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-inbound.js)
- [data/stories.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/stories.yaml)

## 标准动作

1. 先确认这次工作属于 `Search Optimization`
2. 只改 search-facing structure / schema / entity / redirects / discovery 辅助
3. 不顺手碰 booking、AI、SMS、Content
4. 修改后回看：
   - schema 是否仍自洽
   - redirects 是否仍清晰
   - robots / sitemap 是否仍正确

## 一句话规则

`Search Optimization` 是 `Website` 里的独立功能模块，不是 `Booking System` 的附属补丁，也不是 `Content` 更新的一部分。
