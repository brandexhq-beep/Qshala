# QShala — India's Curiosity Company Web Platform

<div align="center">
  <img src="public/og-image.jpg" alt="QShala — India's Curiosity Company Social Banner" width="760" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
  
  <br /><br />

  <img src="public/assets/qt/QT sherlock.svg" alt="QT Sherlock Mascot" width="140" />
  
  # 🐾 Meet QT & The QShala Curiosity Platform

  > **Mission**: Replacing Rote Learning with Curiosity, Socratic Storytelling, Questions, and Wonder.

  [![Astro Version](https://img.shields.io/badge/Astro-v5.18-ff5e00?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
  [![React Version](https://img.shields.io/badge/React-v19.2-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-v5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.3-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## 🌟 Key Architecture & Stack

- **Framework**: [Astro 5](https://astro.build) (Static Site Generation / SSG with 45 prerendered pages).
- **Client Islands**: [React 19](https://react.dev) with Framer Motion and Lucide Icons.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) integrated directly via `@tailwindcss/vite`.
- **E-Commerce**: Headless [Shopify Storefront GraphQL API](https://shopify.dev/docs/api/storefront) (`2025-01`).
- **Headless CMS**: [Sanity Studio v6](https://sanity.io) (`qshala-studio`) for Events, Blogs, and Case Studies.
- **Testing**: Built-in native Node.js Test Runner (`node --test`) covering cart state, lead serialization, and Shopify mapping.
- **Lead Capture & Ingestion**: Dual-pipeline support (local optimistic state + asynchronous dispatch to `/api/leads` and external webhooks).

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.0.0` or higher (`v22` LTS recommended)
- **Package Manager**: `npm`

### 2. Installation
```bash
git clone https://github.com/walnut-knowledge/qshala-website.git
cd qshala-website
npm install
```

### 3. Environment Configuration
Copy the provided `.env.example` to `.env`:
```bash
cp .env.example .env
```

Supply your project credentials:
```ini
# Sanity CMS
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2024-03-01
SANITY_API_TOKEN=your_private_sanity_token

# Shopify Headless Storefront (Curiosity Store)
PUBLIC_SHOPIFY_STORE_DOMAIN=shop.qshala.com
PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token

# Optional Remote Inbound Lead Webhook (Slack, Make, Formspree, CRM)
PUBLIC_LEADS_WEBHOOK_URL=https://your-webhook-endpoint.com/api/leads
```

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches the local Astro development server at `http://localhost:4321`. |
| `npm run build` | Runs prebuild WebP image converter, Astro typecheck (`astro check`), and static SSG build. |
| `npm test` | Executes native Node.js unit tests (`node --test tests/**/*.test.mjs`). |
| `npm run preview` | Previews the production static build locally. |
| `npm run convert:webp`| Automatically converts `.png` and `.jpg` in `public/assets/` to `.webp` via Sharp. |
| `npm run sanity:dev` | Runs Sanity Studio locally at `http://localhost:3333`. |
| `npm run sanity:deploy`| Deploys Sanity Studio schema to your hosted Sanity account. |
| `npm run sanity:seed` | Seeds Sanity dataset with initial events and case studies. |

---

## 🛍️ Curiosity Store & E-Commerce Integration

The Curiosity Store integrates directly with Shopify via the Storefront API (`2025-01`):
- **Live Catalog**: Queries active products, variant prices, and multiple gallery images (`src/lib/shopify/client.ts`).
- **Global Cart Store**: Synchronizes cart quantity and line items across the navigation bar, store catalog, and product drawers using native custom events (`src/lib/shopify/cartStore.ts`).
- **Headless Checkout**: Generates direct Shopify checkout URLs using the `cartCreate` GraphQL mutation.

---

## 📬 Lead Capture & Inbound Inquiries

Inbound leads from `ContactForm.tsx`, `MultiStepBooking.tsx`, and `NewsletterSubscription.tsx`:
1. Optimistically update local browser state for immediate visual feedback.
2. Automatically dispatch an asynchronous JSON payload to `/api/leads` (Vercel serverless function) or `PUBLIC_LEADS_WEBHOOK_URL`.
3. Provide one-click fallback to the verified WhatsApp Business line (`+91 89716 76100`) with pre-filled message text.

---

## 🧪 Testing & Quality Assurance

Run the automated test suite:
```bash
npm test
```

Tests run with zero external dependencies and cover:
- Cart quantity increments, decrements, and line item calculations.
- Inbound lead serialization and WhatsApp URL formatting.
- Shopify GraphQL node normalization and variant resolution.

---

## 🚢 Deployment (Vercel / Netlify / Cloudflare Pages)

The project compiles to pure static HTML/JS/CSS in the `dist/` directory with zero runtime SSR dependencies.

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: `>=20`
