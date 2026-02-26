# Dandy Lane Cafe - AI-First Web Sanctuary

A hyper-lightweight, high-performance static website for Dandy Lane Cafe, Hobart. Built with an AI-first architecture (Harness Engineering) for maximum citability and search visibility.

## 🚀 Architecture: Harness Engineering

This project follows a 4-layer data-driven architecture:
- **L0 (Data)**: `data/site.yaml` - Single source of truth.
- **L1 (Modules)**: Reusable Nunjucks components.
- **L2 (Layouts)**: Base page structures.
- **L3 (Pages)**: Statically generated HTML with automated JSON-LD Schema.

## 🤖 AI Concierge

Real-time AI Chatbot powered by **Gemini 2.5 / 3** via Cloudflare Pages Functions. 
- **Knowledge Base**: Fed directly from `site.yaml`.
- **Edge Runtime**: High-speed responses with zero server maintenance.

## 🛠 Tech Stack

- **Generation**: Node.js + Nunjucks
- **Styling**: Vanilla CSS (Modern, Responsive)
- **Deployment**: GitHub -> Cloudflare Pages (CI/CD)
- **AI**: Cloudflare Functions + @google/genai

## 📈 AEO (AI Engine Optimization)

Automatically generates structured data for:
- [x] Restaurant / LocalBusiness
- [x] FAQPage
- [x] BreadcrumbList
- [x] MenuItems

---

**Crafted with precision for Dandy Lane Cafe.**
