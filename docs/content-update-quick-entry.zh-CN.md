# Content Update Quick Entry

最后更新：2026-06-01

## 文档目的

这份文档是 `Content` 的小入口。

它只服务一种工作：

- 更新 story / post / media

它不负责：

- booking system
- admin backend
- AI chat
- SMS
- search optimization 主体规则

如果这次工作不是内容更新，请回到：

- [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)

## 允许改动的主要文件

- [data/stories.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/stories.yaml)
- [src/blocks/story-list.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-list.html)
- [src/blocks/story-detail.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-detail.html)
- [src/assets/media](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/assets/media)

## 默认不要碰

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [functions/api/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/bookings.js)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)
- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)
- [functions/api/sms/telerivet-inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-inbound.js)
- [data/site.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/site.yaml)
- [public/robots.txt](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/robots.txt)
- [public/sitemap.xml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/sitemap.xml)

## 标准动作

1. 确认这次只属于 `Content`
2. 只改 stories / story 呈现 / media
3. 不顺手碰 booking、AI、SMS、SEO
4. 更新完成后，回看 story list 和 story detail 是否都正确

## 一句话规则

`Content` 是一个小窗口，不是一个大项目入口。
