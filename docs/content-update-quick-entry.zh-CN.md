# Content Update Quick Entry

Last updated: 2026-06-21

## Purpose

This file is the narrow entrypoint for `Content`.
It only covers one kind of work:

- update story / post / media

It does not own:

- booking system
- admin backend
- AI chat
- SMS
- `AEO / GEO / AI Search Optimization` core governance

If the task is not a content update, return to:

- [project-current-overview-and-doc-governance.zh-CN.md](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/docs/project-current-overview-and-doc-governance.zh-CN.md)

## Main Editable Files

- [data/stories.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/stories.yaml)
- [src/blocks/story-list.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-list.html)
- [src/blocks/story-detail.html](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/blocks/story-detail.html)
- [src/assets/media](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/src/assets/media)

## Default No-Touch Area

- [functions/api/_booking.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/_booking.js)
- [functions/api/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/bookings.js)
- [functions/api/admin/bookings.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/admin/bookings.js)
- [functions/api/chat.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/chat.js)
- [functions/api/sms/inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/inbound.js)
- [functions/api/sms/telerivet-inbound.js](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/functions/api/sms/telerivet-inbound.js)
- [data/site.yaml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/data/site.yaml)
- [public/robots.txt](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/robots.txt)
- [public/sitemap.xml](C:/Users/61413/Desktop/ai%20jobs/DL%20new%20website/public/sitemap.xml)

## Standard Actions

1. Confirm the task belongs only to `Content`.
2. Change only stories / story presentation / media.
3. Do not opportunistically touch booking, AI, SMS, or `AEO / GEO / AI Search Optimization`.
4. After the update, check story list and story detail surfaces.

## One-Line Rule

`Content` is a narrow window, not a project-wide entrypoint.
