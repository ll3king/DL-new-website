# Search Optimization Entry

最后更新：2026-06-15

## 文档目的

这份文档是 `Search Optimization` 的直接入口。

它只服务这类工作：

- SEO
- GEO
- AEO
- schema
- redirects
- robots / sitemap
- search-facing structure

它不负责：

- `Booking System`
- admin backend
- `AI Chat`
- `SMS`
- 与搜索优化无关的一般内容改版

如果这次工作不属于 `Search Optimization`，请回到：

- [project-current-overview-and-doc-governance.zh-CN.md](./project-current-overview-and-doc-governance.zh-CN.md)

## 当前模块定位

`Search Optimization` 是 `Website` 项目中的独立功能模块。

它把原来分散的：

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
- [scripts/generate.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/scripts/generate.js)

## 关联可改文件

- [functions/api/janitor.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/janitor.js)

## 默认不要碰

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [functions/api/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/bookings.js)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)
- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)
- [functions/api/sms/telerivet-inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-inbound.js)

## 跨 Content 的例外

默认情况下，`Search Optimization` 不直接修改 `stories / posts / media`。

但如果是已经明确批准的：

- AEO / GEO 决策锚点迁移
- Answer Summary 增强
- stories 排序重构
- search-facing 内部链接补强

则允许最小范围触达：

- [data/stories.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/stories.yaml)
- [src/blocks/story-list.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-list.html)
- [src/blocks/story-detail.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-detail.html)

前提是：

- 不新增页面
- 不创建独立内容项目分叉
- 不把 `Content` 改造成与本次 Search Optimization 无关的一般内容改版

## 标准动作

1. 先确认这次工作属于 `Search Optimization`
2. 只改 search-facing structure / schema / entity / redirects / discovery 辅助
3. 不顺手碰 booking、AI、SMS
4. 如果明确批准跨 `Content`，只在被批准的 stories 范围内做最小增强
5. 修改后回看：
   - schema 是否仍自洽
   - redirects 是否仍清晰
   - robots / sitemap 是否仍正确

## External Proof Consistency Snapshot

详细外部一致性记录请看：

- [aeo/external-proof-consistency-report.md](./aeo/external-proof-consistency-report.md)

| Source | Current public claim | Matches official site? | Risk | Recommended action |
|---|---|---|---|---|
| Tripadvisor | Correct Dandy Lane Cafe listing exists and supports breakfast / lunch / brunch, Cafe / Australian, 4.6/5, and 231 reviews. | Yes for current proof target. | Low | Keep the corrected Dandy Lane listing URL everywhere visible proof is rendered. Do not reintroduce the wrong Tripadvisor entity. |
| Discover Tasmania | Product anchors are good: Wine-Infused Benedicts, Potato Parmesan Rosti, Scotch steak sandwich. Listing language still leans on laptop-friendly atmosphere / remote work. | Partially. | Medium | Request update to product-led brunch wording. |
| Hobart & Beyond | Product anchors are good, but listing language still leans on laptop-friendly atmosphere / remote work. | Partially. | Medium | Request update to product-led brunch wording. |
| Hello Hobart | Sunday is listed as closed, while the official site and Tripadvisor show Sunday 9:00 AM - 2:00 PM. | No. | Medium | Request opening-hours update. |

## 一句话规则

`Search Optimization` 是 `Website` 里的独立功能模块，不是 `Booking System` 的附属补丁，也不是 `Content` 更新的一部分。只有在明确批准的 AEO/GEO 升级里，它才可以最小范围跨到 stories。 
