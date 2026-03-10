# Studytra - Study Abroad Execution Platform

![Studytra](https://img.shields.io/badge/Status-In%20Development-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

Welcome to **Studytra**, an ultra-premium, interactive platform designed to guide students through their study abroad journeys. It transforms dense, overwhelming overseas education requirements into an immersive, step-by-step 3D visual experience.

---

## 🚀 Project Overview

Studytra is not just an informational website; it is an "execution platform." It assists prospective international students by providing targeted roadmaps, accurate cost estimations, and university tracking. The platform emphasizes a modern, high-end "Apple Glass" aesthetic, featuring 3D scrollytelling, deep parallax effects, and hyper-realistic university imagery.

---

## ✨ Features Implemented Currently

The following core features have been built into the React application:

1. **Interactive 3D Scrollytelling (`Countries.jsx`)**
   - Discards boring tabular data for a "gravity-defying" 3D scroll experience.
   - Alternating split-pane layouts featuring 4K university campus photography (MIT, Oxford, TUM, UofT, Melbourne) paired with frosted glass information cards.
   - Smooth CSS-based parallax physics layered over subtle gradient backgrounds.
   - Dynamic progress indicators that sync with the user's scroll depth.

2. **30-Day Arrival Roadmaps (`RoadmapPage.jsx`)**
   - A dedicated suite of tactical checklists for the critical first 30 days post-arrival in a new country.
   - Features country-specific actions (e.g., Bank Account Setup, Local Visa Registration, SIM Cards).
   - Provides PDF view and download functionalities.

3. **Interactive Budget Planner (`BudgetPlanner.jsx`)**
   - A robust cost estimator allowing students to set budgets and calculate savings.
   - Includes a professional live-updating Currency Exchange ticker.

4. **AI-Assisted Chat Experience (`ChatPage.jsx`)**
   - A comprehensive, conversational interface allowing students to get personalized guidance on their study abroad queries.
   - Context-aware UI that adapts based on the country the user has selected from the home page.

5. **Premium "Apple-Style" UI/UX**
   - High refractive index glassmorphism components (`.glass-panel`).
   - 3D tactile buttons that compress on click.
   - Perfectly tuned typography (`Plus Jakarta Sans` & `DM Sans`).

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Styling:** Custom Vanilla CSS (Advanced Glassmorphism & Parallax Animations)
- **Icons:** Lucide React
- **Backend / DB (Planned/Partial):** Supabase

---

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── Countries.jsx    # The core 3D scrollytelling engine
│   ├── Hero.jsx         # Landing page Hero section
│   ├── Navbar.jsx       # Global navigation with dropdowns
│   ├── ToggleExplore.jsx# Animated CTA triggers
│   └── ...              # Other modular sections (Stats, Reviews, etc.)
├── pages/               # Top-level route components
│   ├── Homepage.jsx     # Main landing view
│   ├── ChatPage.jsx     # AI Agent chat interface
│   ├── BudgetPlanner.jsx# Cost and savings calculator
│   ├── RoadmapPage.jsx  # Stage-by-stage arrival roadmaps
│   └── Dashboard.jsx    # (In Progress) User profile dashboard
├── constants/           # Static data dictionaries (e.g., countries.js)
├── utils/               # Helper functions (e.g., supabase.js)
├── App.jsx              # Main React Router configuration
└── index.css            # Global design tokens and 3D animation keyframes
```

---

## ⚙️ Getting Started

Follow these steps to run the Studytra platform locally.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd studytra
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View the App:**
   Open your browser and navigate to `http://localhost:5173`.

---

## 🔮 Future Improvements

As development continues, the following features are planned:
- **Supabase Integration:** Link the `ChatPage` and `Dashboard` to Supabase for persistent user profiles and chat history.
- **Dynamic PDF Generation:** Currently, the Roadmap PDFs trigger a placeholder alert. This will be connected to a real PDF generation library (like `jspdf` or `@react-pdf/renderer`).
- **Student Dashboard:** Complete the `/dashboard` route to let users track applications, visualize admission chances, and save favorite universities.
- **Loan Integrations:** Build out the Loan Guide to compare providers like SBI, HDFC Credila, etc.

---

### Author / Maintainer
Developed with ❤️ by the Studytra Team.
