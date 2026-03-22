<div align="center">

<img src="public/studytra-logo.png" alt="Studytra" width="88" style="border-radius:16px;" />

# Studytra

**AI-Powered Study Abroad Execution Platform**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Anthropic](https://img.shields.io/badge/Claude_AI-Sonnet_4-D97706?style=flat-square)](https://anthropic.com)
[![License](https://img.shields.io/badge/License-MIT-0EA5A0?style=flat-square)](LICENSE)

<p align="center">
  <b>Plan · Decide · Track · Execute</b><br/>
  Structured guidance for Indian students targeting Germany, USA, Canada, UK & Australia —<br/>
  from IELTS prep to landing at the airport. No consultant needed.
</p>

[Live Demo](#) · [Report Bug](issues) · [Request Feature](issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Feature Modules](#feature-modules)
- [AI System Design](#ai-system-design)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Routing Map](#routing-map)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## Overview

Studytra is a **client-side React SPA** that replaces the traditional study-abroad consultancy model with a self-serve, AI-assisted execution system. It covers the full student journey across five countries — Germany, USA, Canada, UK, and Australia — providing country-specific timelines, visa documentation, cost planning, loan comparison, and flight guidance in one unified interface.

The platform is intentionally designed as a **no-login static MVP** — zero backend friction, instant value delivery. Monetization is handled through affiliate integrations (Skyscanner, bank loan referrals, OSHC providers) embedded naturally within the tool surface.

---

## Architecture

```
Browser (React SPA)
│
├── React Router v6         — client-side routing, no SSR
├── Context API             — global country selection + decision lock state
├── Component Modules       — feature-isolated, lazy-loadable sections
│
├── Anthropic API           — direct browser → Claude Sonnet (dev/MVP only)
│   └── System Prompt Layer — Stu persona + 5-country knowledge base injected per request
│
└── Static Assets (public/) — PDFs, images, country data JSON
```

> **Security note:** The Anthropic API key is accessed via `VITE_ANTHROPIC_API_KEY` and sent with `anthropic-dangerous-direct-browser-access: true`. This is acceptable for the MVP. Production deployment must proxy requests through a backend route (Node.js / Edge Function) to prevent key exposure.

---

## Feature Modules

### 🤖 AI Assistant — "Stu"
A Claude-powered conversational assistant with a deeply structured system prompt containing verified 2026 data for all five countries. Not a generic chatbot — Stu is persona-engineered to behave as a senior who has personally completed the Germany APS, US F-1 visa, Canada GIC, UK CAS, and Australia CoE process.

**Architecture decisions:**
- Full conversation history sent on every API call (stateless Claude sessions)
- Student context (country, intake, stage, IELTS score) injected into the system prompt dynamically via `contextBuilder.js`
- Onboarding flow collects profile in 4 steps before chat begins — reduces vague questions, improves response quality
- Suggested prompt chips filtered per country to reduce cold-start friction

### 📋 Student Execution Guides
Downloadable PDF roadmaps (generated with ReportLab Python) for each country. Each PDF covers pre-departure requirements, post-arrival critical path (30-day), cost snapshots, and verified 2026 visa fees.

### 💰 Cost Planner
City-level monthly cost breakdown with live INR conversion. Inputs: country, city, rent, food, transport, insurance, tuition. Output: monthly total, yearly total, INR equivalent, loan gap analysis.

### 🏦 Loan Guidance
Comparison engine for 6 Indian education loan providers with verified 2025–26 data:

| Lender | Type | Rate Range | Max (Unsecured) |
|--------|------|-----------|-----------------|
| SBI Global Ed-Vantage | Public Bank | 9.15–11.15% | ₹50L |
| Credila | NBFC | 9.75–13.0% | ₹75L |
| ICICI Bank | Private Bank | 10.25–12.75% | ₹1 Cr |
| Avanse | NBFC | 10.25–16.5% | ₹1.25 Cr |
| Axis Bank | Private Bank | 11.0–14.0% | ₹1 Cr |
| Bank of Baroda Baroda Scholar | Public Bank | 8.25–9.85% | ₹50L |

Includes a live EMI calculator (compound interest, slider-based) and direct affiliate deep-links to each lender's loan application page.

### 🛂 Visa Guide
Per-country, per-step visa breakdown with fees, required documents, and processing timelines. Germany: APS → Uni-Assist → Blocked Account → National D Visa. USA: I-20 → SEVIS → DS-160 → F-1 Interview. Canada: PAL → GIC → Study Permit. UK: CAS → IHS → eVisa. Australia: CoE → OSHC → GS Test → Subclass 500.

### 📅 Timeline
Vertical roadmap with deadline-aware step statuses. Steps auto-populate from `constants/timeline.js` based on selected country and target intake month.

### 🔒 Decision Lock
Structured commitment form (country, degree, university, intake, target city). On submission, activates the progress tracker and populates the Overview dashboard. Stored in `localStorage` for persistence across sessions.

### ✈️ Flight Checker
Travel summary card with suggested arrival window relative to course start date. Affiliate search buttons for Skyscanner, Google Flights, and direct airline websites. Pre-departure checklist with 20+ actionable items.

---

## AI System Design

```
SYSTEM_PROMPT.js
│
├── Persona Definition        — Stu, senior who studied abroad
├── Personality Rules         — warm, direct, no vague answers, always give next action
├── Student Context Block     — dynamically injected: country, degree, intake, stage, IELTS
│
├── Knowledge Base (5 countries)
│   ├── Germany               — APS, Uni-Assist, Blocked Account (€11,904), §16b 140 days
│   ├── USA                   — I-20, SEVIS $350, F-1 non-immigrant intent, OPT/STEM OPT
│   ├── Canada                — PAL, GIC CAD$22,895, SDS discontinued, PGWP CIP codes
│   ├── UK                    — CAS, IHS £776/yr, eVisa share codes, Graduate Route alert
│   └── Australia             — GS Test, OSHC, AUD$29,710 proof, Subclass 485 age limit
│
├── Financial Guidance        — Indian bank loan comparison, Section 80E, EMI logic
├── Language Test Guide       — IELTS / TOEFL / PTE / Duolingo acceptance matrix
└── Response Rules            — format, forbidden phrases, always-end-with-next-action
```

**API call structure:**
```js
POST https://api.anthropic.com/v1/messages
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 1500,
  system: SYSTEM_PROMPT + "\n" + studentContextBlock,
  messages: fullConversationHistory   // all prior turns included
}
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 18 + Vite 5 | SPA, HMR, fast builds |
| Routing | React Router v6 | Client-side navigation |
| State | Context API + useState | Global country/decision state |
| Styling | Vanilla CSS + CSS Custom Properties | Design tokens, glassmorphism, animations |
| Icons | Lucide React | Consistent icon system |
| AI | Anthropic Claude Sonnet 4 | AI Assistant (Stu) |
| PDF Generation | Python ReportLab | Country roadmap PDFs |
| Auth (planned) | Supabase | User accounts, saved plans |
| Deployment | Vercel / Netlify | Static SPA hosting |

---

## Project Structure

```
studytra/
│
├── public/
│   ├── pdfs/                              # Generated country roadmap PDFs
│   │   ├── Studytra_GERMANY_Roadmap_2026.pdf
│   │   ├── Studytra_USA_Roadmap_2026.pdf
│   │   ├── Studytra_CANADA_Roadmap_2026.pdf
│   │   ├── Studytra_UK_Roadmap_2026.pdf
│   │   └── Studytra_AUSTRALIA_Roadmap_2026.pdf
│   └── studytra-logo.png
│
├── src/
│   ├── ai/
│   │   ├── SYSTEM_PROMPT.js               # Master AI persona + 5-country knowledge base
│   │   ├── knowledgeBase/                 # Per-country structured data objects
│   │   │   ├── germany.js
│   │   │   ├── usa.js
│   │   │   ├── canada.js
│   │   │   ├── uk.js
│   │   │   └── australia.js
│   │   └── prompts/
│   │       ├── suggestedPrompts.js        # Country-wise quick question chips
│   │       └── contextBuilder.js          # Student profile → prompt injection
│   │
│   ├── api/
│   │   └── claudeAPI.js                   # Anthropic API calls + error handling
│   │
│   ├── components/
│   │   ├── Navbar.jsx                     # Fixed nav with Tools dropdown
│   │   ├── chat/                          # AI Assistant UI components
│   │   │   ├── AIAssistantPage.jsx        # Full chat layout (sidebar + chat panel)
│   │   │   ├── OnboardingFlow.jsx         # 4-step profile collection
│   │   │   └── MessageBubble.jsx
│   │   ├── dashboard/
│   │   │   ├── Overview.jsx
│   │   │   ├── Timeline.jsx
│   │   │   ├── DecisionLock.jsx
│   │   │   ├── VisaGuide.jsx
│   │   │   ├── CostPlanner.jsx
│   │   │   ├── LoanGuidance.jsx           # 6-bank comparison + EMI calculator
│   │   │   ├── FlightChecker.jsx
│   │   │   └── Sidebar.jsx
│   │   └── tools/
│   │       └── CountryRoadmapsSection.jsx # 5-country PDF download cards
│   │
│   ├── constants/
│   │   ├── countries.js                   # Country config (currency, rates, intakes)
│   │   ├── timeline.js                    # Per-country roadmap steps
│   │   ├── visaSteps.js                   # Visa docs, fees, processing times
│   │   ├── costData.js                    # Monthly living costs per city
│   │   └── loanData.js                    # Bank loan parameters
│   │
│   ├── pages/
│   │   ├── Homepage.jsx
│   │   ├── ChatPage.jsx
│   │   ├── BudgetPlanner.jsx
│   │   ├── Dashboard.jsx
│   │   └── RoadmapPage.jsx
│   │
│   ├── App.jsx                            # Route definitions
│   └── index.css                          # Global tokens, glassmorphism, keyframes
│
├── scripts/
│   └── generate_pdfs.py                   # ReportLab PDF generator (run locally)
│
├── .env                                   # VITE_ANTHROPIC_API_KEY=
├── .env.example
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key ([get one here](https://console.anthropic.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/studytra.git
cd studytra

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Anthropic API key to .env

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### PDF Generation (optional)

The country roadmap PDFs are pre-generated and committed to `public/pdfs/`. To regenerate:

```bash
pip install reportlab
python scripts/generate_pdfs.py
```

---

## Environment Variables

```env
# .env
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
```

> ⚠️ Never commit `.env` to version control. The `VITE_` prefix exposes this to the browser bundle — move to a backend proxy before production.

---

## Routing Map

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Homepage` | Hero, country preview, cost calculator |
| `/chat` | `ChatPage` | Stu AI Assistant with onboarding |
| `/dashboard` | `Dashboard` | Full dashboard with sidebar modules |
| `/budget` | `BudgetPlanner` | Cost estimator + savings engine |
| `/roadmap` | `RoadmapPage` | Visual timeline roadmap |
| `/tools/execution-guides` | `CountryRoadmapsSection` | PDF download cards |
| `/loans` | `LoanGuidance` | Bank comparison + EMI calculator |

---

## Roadmap

**v1.1 — Auth & Persistence**
- [ ] Supabase integration — user accounts, saved decisions, chat history
- [ ] Decision Lock synced to cloud, not just `localStorage`

**v1.2 — AI Upgrades**
- [ ] RAG system — real-time context from official embassy pages via retrieval
- [ ] Document Gap Finder — student uploads docs, AI identifies what's missing
- [ ] SOP grader — AI scores draft SOP against top-admit examples

**v1.3 — Live Data**
- [ ] Skyscanner API integration for real-time flight prices
- [ ] Exchange rate API (live EUR/USD/CAD/GBP/AUD → INR)
- [ ] IRCC/UKVI processing time tracker

**v2.0 — B2B**
- [ ] White-label version for abroad consultancies
- [ ] Admin dashboard for counselors to manage student pipelines
- [ ] Webhook integration with university application portals

---

## Contributing

```bash
# Create a feature branch
git checkout -b feat/your-feature-name

# Commit with conventional commits
git commit -m "feat: add scholarship finder module"
git commit -m "fix: correct IELTS band requirement for TU Munich"
git commit -m "docs: update loan data for SBI 2026 rates"

# Push and open a PR
git push origin feat/your-feature-name
```

**Commit types:** `feat` · `fix` · `docs` · `style` · `refactor` · `chore`

---

<div align="center">

**Built for the ambitious Indian student. No consultant needed.**

*Studytra — Plan. Decide. Track. Execute.*

</div>
