<div align="center">

<img src="public/studytra-logo.png" alt="Studytra" width="88" />

# Studytra

**AI-Powered Study Abroad Execution Platform**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Gemini](https://img.shields.io/badge/Gemini_2.0_Flash-AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://studytra.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-0EA5A0?style=flat-square)](LICENSE)

<p align="center">
  <b>Plan · Decide · Track · Execute</b><br/>
  Structured AI guidance for Indian students targeting Germany, USA, Canada, UK & Australia —<br/>
  from IELTS prep to landing at the airport. No consultant needed.
</p>

**[Live Demo](https://studytra.vercel.app)** · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

<img width="1785" height="856" alt="image" src="https://github.com/user-attachments/assets/dc0c92e0-d3b8-4055-a96a-bb46648b4044" />
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<img width="1569" height="824" alt="image" src="https://github.com/user-attachments/assets/42993f4c-80b5-4990-8303-d723372a988b" />
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<img width="1701" height="856" alt="image" src="https://github.com/user-attachments/assets/d6e02255-9d09-4703-a868-9f546f8ab889" />
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<img width="1668" height="846" alt="image" src="https://github.com/user-attachments/assets/a9ff3591-9e3c-4b5e-96fe-08d6398d015d" />
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<img width="1116" height="850" alt="image" src="https://github.com/user-attachments/assets/a2fc562d-5e21-4a97-9a21-3f45c7e98388" />





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
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## Overview

Studytra is a **production-deployed React SPA** that replaces the traditional study-abroad consultancy model with a self-serve, AI-assisted execution system. It covers the full student journey across five countries — Germany, USA, Canada, UK, and Australia — providing country-specific timelines, visa documentation, cost planning, loan comparison, and flight guidance in one unified interface.

The AI layer is powered by **Google Gemini 2.0 Flash** via a secure Vercel serverless proxy — the API key never touches the browser. Supabase handles authentication and persistent data storage.

---

## Architecture

```
Browser (React SPA)
│
├── React Router v6              — client-side routing, SPA with vercel.json rewrites
├── Context API + useState       — global country selection, decision lock, chat state
├── Component Modules            — feature-isolated sections per dashboard module
│
├── /api/gemini.js               — Vercel Serverless Function (API key never exposed)
│   └── Gemini 2.0 Flash         — AI assistant powered by Google Generative AI
│
├── Supabase                     — Auth (Google OAuth + Email) + Postgres DB
│   ├── auth.users               — user identity
│   ├── chat_sessions + messages — persistent AI chat history
│   ├── decision_lock            — user's locked study plan
│   └── cost_plans               — saved budget configurations
│
└── public/pdfs/                 — pre-generated country roadmap PDFs (ReportLab)
```

> **Security:** Gemini API key is stored as a Vercel environment variable (`GEMINI_API_KEY`). All AI requests are proxied through `/api/gemini` — the key is never included in the browser bundle. `VITE_` prefix is only used for Supabase public keys (anon key by design).

---

## Feature Modules

### 🤖 AI Assistant
Powered by Gemini 2.0 Flash via a secure serverless proxy. The assistant is persona-engineered as "Studytra AI" — a knowledgeable guide for Indian students navigating the full study abroad process across 5 countries.

**Implementation details:**
- Full conversation history sent on every API call (Gemini is stateless)
- Student profile (name, age, target country, degree, course) stored in `sessionStorage` and injected into every request via `studytraKnowledge.js`
- System prompt pair injected at conversation start with full knowledge base
- Last 10 messages sent to stay within token limits
- `PLAN_LOCKED` structured output format for extracting plan data from AI responses
- Quota exceeded error handled gracefully with user-facing message

### 📋 Student Execution Guides
Downloadable PDF roadmaps generated with Python ReportLab. Each PDF covers pre-departure requirements, post-arrival critical path, cost snapshots, and verified 2026 visa fees.

Countries: 🇩🇪 Germany · 🇺🇸 USA · 🇨🇦 Canada · 🇬🇧 UK · 🇦🇺 Australia

### 💰 Cost Planner & Budget Estimator
City-level monthly cost breakdown with INR conversion. Inputs: country, city, rent, food, transport, insurance, tuition. Output: monthly total, yearly total, INR equivalent.

### 🏦 Loan Guidance
Comparison engine for 6 Indian education loan providers with verified 2025–26 data:

| Lender | Type | Rate Range | Max Unsecured |
|--------|------|-----------|---------------|
| SBI Global Ed-Vantage | Public Bank | 9.15–11.15% | ₹50L |
| Credila | NBFC | 9.75–13.0% | ₹75L |
| ICICI Bank | Private Bank | 10.25–12.75% | ₹1 Cr |
| Avanse | NBFC | 10.25–16.5% | ₹1.25 Cr |
| Axis Bank | Private Bank | 11.0–14.0% | ₹1 Cr |
| Bank of Baroda Scholar | Public Bank | 8.25–9.85% | ₹50L |

Includes a live EMI calculator with sliders and direct apply links to official bank pages.

### 🛂 Visa Guide
Per-country, per-step visa breakdown with fees, required documents, and processing timelines.

### 📅 Timeline & Decision Lock
Vertical roadmap with deadline-aware steps. Decision Lock commits the student to a specific plan and activates the progress tracker.

### ✈️ Flight Checker
Travel summary card with suggested arrival window. Affiliate search buttons for Skyscanner, Google Flights, and direct airline websites.

### 📄 CV Formats
Academic and detailed CV templates for Germany (Europass), UK, Canada, and Australia. Includes key requirements, formatting notes, and downloadable examples.

### 📄 Resume Formats
ATS-certified, concise 1-page Resume templates specifically formulated for USA, Canada, UK, and Australia. Built to pass Applicant Tracking Systems.

### ✍️ Statement of Purpose (SOP) Guide
Country-specific SOP formats, word limits, structure, and what admission committees actually want to read. Includes copy-pasteable starter templates and universal tips.

---

## AI System Design

```
src/utils/studytraKnowledge.js
│
├── Platform Identity         — Studytra AI persona and behavior rules
├── Student Profile Injection — name, age, target country, degree, course (sessionStorage)
├── Knowledge Base            — Germany, USA, Canada, UK, Australia study abroad data
│   ├── Visa processes        — APS, I-20/SEVIS, GIC/PAL, CAS/IHS, CoE/OSHC
│   ├── Costs & timelines     — per-country verified 2026 data
│   └── Post-study pathways   — OPT/STEM OPT, PGWP, Graduate Route, Subclass 485
└── PLAN_LOCKED format        — structured JSON extraction from AI responses

src/utils/gemini.js  →  /api/gemini (Vercel Function)  →  Gemini 2.0 Flash API
```

**Proxy call structure:**
```js
// Browser calls the proxy — never Gemini directly
POST /api/gemini
{
  contents: [...systemPair, ...recentMessages],  // last 10 messages
  generationConfig: { temperature: 0.65, maxOutputTokens: 1800 },
  safetySettings: [...]
}
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 18 + Vite 5 | SPA, HMR, fast production builds |
| Routing | React Router v6 | Client-side navigation |
| State | Context API + useState + sessionStorage | Global + persistent state |
| Styling | Vanilla CSS + Custom Properties | Design tokens, glassmorphism |
| Icons | Lucide React | Consistent icon system |
| AI | Google Gemini 2.0 Flash | AI Assistant core |
| AI Proxy | Vercel Serverless Function | Secure API key handling |
| Auth & DB | Supabase | Google OAuth, email auth, Postgres |
| PDF Generation | Python ReportLab | Country roadmap PDFs (local script) |
| Deployment | Vercel | SPA hosting with serverless functions |

---

## Project Structure

```
studytra/
│
├── api/
│   └── gemini.js                          # Vercel serverless proxy — key server-side only
│
├── public/
│   ├── pdfs/
│   │   ├── Studytra_GERMANY_Roadmap_2026.pdf
│   │   ├── Studytra_USA_Roadmap_2026.pdf
│   │   ├── Studytra_CANADA_Roadmap_2026.pdf
│   │   ├── Studytra_UK_Roadmap_2026.pdf
│   │   └── Studytra_AUSTRALIA_Roadmap_2026.pdf
│   ├── images/
│   └── studytra-logo.png
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                     # Fixed nav with Tools dropdown
│   │   ├── Hero.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Features.jsx
│   │   ├── Countries.jsx
│   │   ├── StatsSection.jsx
│   │   ├── CurrencyExchange.jsx
│   │   ├── StudentSpotlight.jsx
│   │   ├── Reviews.jsx
│   │   ├── Footer.jsx
│   │   ├── OnboardingForm.jsx
│   │   ├── ToggleExplore.jsx
│   │   ├── TopLoader.jsx
│   │   ├── chat/
│   │   │   ├── ChatSidebar.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── dashboard/
│   │   │   ├── Overview.jsx
│   │   │   ├── Timeline.jsx
│   │   │   ├── DecisionLock.jsx
│   │   │   ├── VisaGuide.jsx
│   │   │   ├── CostPlanner.jsx
│   │   │   ├── LoanGuidance.jsx
│   │   │   ├── FlightChecker.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── explore/
│   │   └── tools/
│   │       ├── CountryRoadmapsSection.jsx
│   │       └── CVTemplateView.jsx
│   │
│   ├── constants/
│   │   └── countries.js
│   │
│   ├── hooks/
│   │   └── useChat.js
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ChatPage.jsx
│   │   ├── BudgetPlanner.jsx
│   │   ├── Dashboard.jsx
│   │   ├── RoadmapPage.jsx
│   │   ├── CVFormatPage.jsx
│   │   └── SOPGuidePage.jsx
│   │
│   ├── utils/
│   │   ├── gemini.js                      # Gemini calls via /api/gemini proxy
│   │   ├── studytraKnowledge.js           # Full AI knowledge base + system prompt
│   │   └── supabase.js                    # Supabase client
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── vercel.json                            # SPA routing rewrites
├── vite.config.js
├── .env                                   # Local env vars (never committed)
├── .env.example
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))
- Supabase project ([create here](https://supabase.com))

### Installation

```bash
# Clone the repo
git clone https://github.com/arupdas0825/studytra.git
cd studytra

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your keys in .env

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### PDF Generation (optional)

PDFs are pre-built and committed to `public/pdfs/`. To regenerate:

```bash
pip install reportlab
python scripts/generate_pdfs.py
```

---

## Environment Variables

```env
# .env — never commit this file

# Gemini AI — NO VITE_ prefix, server-side only via /api/gemini
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Supabase — VITE_ prefix required, public by design (RLS enforced)
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Variable | Used in | Browser exposed? |
|----------|---------|-----------------|
| `GEMINI_API_KEY` | `api/gemini.js` (server) | ❌ Never |
| `VITE_SUPABASE_URL` | `src/utils/supabase.js` | ✅ Safe (public URL) |
| `VITE_SUPABASE_ANON_KEY` | `src/utils/supabase.js` | ✅ Safe (RLS enforced) |

---

## Routing Map

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Hero, countries, features, reviews |
| `/chat` | `ChatPage` | Gemini AI assistant with onboarding |
| `/dashboard` | `Dashboard` | Full dashboard with sidebar modules |
| `/budget` | `BudgetPlanner` | Cost estimator + savings engine |
| `/roadmap` | `RoadmapPage` | Visual timeline roadmap |
| `/tools/execution-guides` | `CountryRoadmapsSection` | PDF download cards |
| `/loans` | `LoanGuidance` | Bank comparison + EMI calculator |
| `/tools/cv-formats` | `CVFormatPage` | Academic CV templates (Germany, UK, etc.) |
| `/tools/resume-formats`| `ResumeFormatPage` | ATS-optimized Resume templates (USA, etc.) |
| `/tools/sop-guide` | `SOPGuidePage` | SOP guide and starter templates |

---

## Deployment

Live at **[studytra.vercel.app](https://studytra.vercel.app)**

### vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
Required for React Router — prevents 404 on direct URL access or refresh.

### Vercel Environment Variables
Set these in Vercel Dashboard → Settings → Environment Variables:
```
GEMINI_API_KEY         → Production + Preview + Development
VITE_SUPABASE_URL      → Production + Preview + Development
VITE_SUPABASE_ANON_KEY → Production + Preview + Development
```

### Deploy
```bash
npm run build   # verify local build passes first
git push        # Vercel auto-deploys on push to main
```

---

## Roadmap

**v1.1 — Supabase Persistence**
- [ ] Chat history saved per user session to Supabase
- [ ] Decision Lock synced to cloud (not just localStorage)
- [ ] Cost plans saved and loadable across devices

**v1.2 — AI Upgrades**
- [ ] Document Gap Finder — upload docs, AI identifies what's missing
- [ ] SOP grader — AI scores draft SOP with improvement suggestions
- [ ] Scholarship finder — country + field → curated scholarship list

**v1.3 — Live Data**
- [ ] Exchange rate API — live EUR/USD/CAD/GBP/AUD → INR
- [ ] IRCC/UKVI processing time tracker
- [ ] University application deadline alerts

**v2.0 — B2B**
- [ ] White-label version for abroad consultancies
- [ ] Counselor admin dashboard with student pipeline management
- [ ] University portal webhook integrations

---

## Contributing

```bash
git checkout -b feat/your-feature-name

git commit -m "feat: add scholarship finder module"
git commit -m "fix: correct blocked account amount for Germany 2026"
git commit -m "docs: update SBI loan rate"
git commit -m "chore: upgrade Gemini model version"

git push origin feat/your-feature-name
```

**Commit types:** `feat` · `fix` · `docs` · `style` · `refactor` · `chore`

---

<div align="center">

**Built for the ambitious Indian student. No consultant needed.**

*Studytra — Plan. Decide. Track. Execute.*

[studytra.vercel.app](https://studytra.vercel.app)

</div>
