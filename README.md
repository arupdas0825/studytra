<div align="center">
  <div style="background: white; width: 120px; height: 120px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
    <img src="public/studytra-logo.png" alt="Studytra Logo" width="100" />
  </div>
  
  # Studytra ✈️🎓
  ### The Premium Study Abroad Execution Platform

  <p align="center">
    Empowering students with precise guidance, hyper-accurate cost planning, and AI-driven insights to seamlessly transition to world-class universities in the <b>US, UK, Canada, Germany, and Australia</b>.
  </p>
</div>

---

## 📖 Overview

**Studytra** is not just an informational website; it is an intelligent, beautiful, and highly interactive execution platform designed to navigate the immense complexities of studying abroad. By prioritizing a **frictionless, Apple-style glassmorphism aesthetic** combined with raw, actionable data, Studytra elevates the traditional study abroad agency experience into the digital era.

From highly-polished 3D scrollytelling interfaces to an advanced **AI Chat Assistant**, Studytra handles everything a prospective international student needs: budgets, roadmaps, university deadlines, and document preparation.

---

## ✨ Core Features

### 🤖 1. Advanced AI Chat Assistant (Core Component)
The beating heart of Studytra is its contextual AI Assistant. 
- **Personalized Counseling:** Ask natural language questions about visa processes, university rankings, and scholarship opportunities.
- **Context-Aware:** The AI knows which country you are interested in and provides tailored, highly accurate responses (e.g., specific rules for the Canadian SDS or the German APS certificate).

### 🏷️ 2. Premium 3D Scrollytelling Experience
- A stunning **"Antigravity" Split-Layout** presentation for exploring top destinations.
- Features **4K parallax backgrounds** of elite universities (MIT, Oxford, TUM, UofT, Melbourne).
- Utilizes CSS-native **glassmorphism** (heavy blur, high refraction, dynamic shadows) for a luxurious user interface.

### 💰 3. Dynamic Cost Estimator & Budget Planner
- **Real-Time Savings Engine:** Compare personal budgets against hyper-accurate living costs and tuition fees for specific countries.
- **Visual Breakdowns:** Interactive charts displaying expected expenses (Housing, Food, Transport) with live currency exchange context.

### 🗺️ 4. 30-Day Arrival Roadmaps
- Country-specific, day-by-day checklists covering the crucial first month abroad.
- Features immediate access to actionable PDFs for setting up bank accounts, SIM cards, and local biometrics registration.

### ✈️ 5. Integrated Flight Checker
- A streamlined tool allowing students to instantly check flight availability, compare prices, and monitor booking windows tailored to university intake seasons (Fall, Spring, Winter).

### 📄 6. Specialized SOP, CV & Resume Formats
- Application requirements differ wildly by region. Studytra provides **country-specific document formats**:
  - **USA:** Strict 1-page academic resumes and deeply personal Statements of Purpose.
  - **Germany:** Highly structured Europass CVs and technical motivation letters.
  - **UK:** Standardized 2-page academic CVs and course-focused personal statements.
  - **Canada / Australia:** Formats optimized for dual academic/PR pathways.

---

## 🛠️ Technology Stack

Studytra is built on a modern, high-performance frontend ecosystem designed for extreme fluidity and visual fidelity:

* **Framework:** React.js (via Vite)
* **Styling & UI:** 
  * Vanilla CSS with advanced Custom Properties (Tokens)
  * Hardware-accelerated CSS animations (`transform`, `backdrop-filter`)
  * Custom 3D perspective physics for hover and scroll mechanics
* **Icons:** Lucide React
* **Routing:** React Router v6
* **Backend Integration / Auth:** Supabase (Ready)

---

## 📂 Project Structure

```text
studytra/
├── public/                 # Static assets, 4K background images, icons
├── src/
│   ├── components/         # Reusable UI elements (Navbar, Cards, Buttons)
│   │   ├── chat/           # AI Chat Assistant interfaces
│   │   ├── dashboard/      # Budget planner and analytical components
│   │   └── explore/        # Dynamic Scrollytelling sub-components
│   ├── constants/          # Static data (Country data, costs, university lists)
│   ├── pages/              # Main routing views (Homepage, ChatPage, RoadmapPage, BudgetPlanner)
│   ├── utils/              # Helper functions (Supabase client, API wrappers)
│   ├── App.jsx             # Core routing and application wrapper
│   └── index.css           # Global design system, glassmorphism tokens, and keyframes
└── package.json
```

---

## 🚀 Future Improvements

As Studytra evolves, the following enhancements are planned:

1. **Live Flight API Integration:** Connect the Flight Checker directly to global GDS platforms (like Amadeus or Skyscanner APIs) for real-time ticket purchasing.
2. **AI Document Grader:** Allow users to upload their SOPs and Resumes, utilizing the AI Assistant to score and suggest improvements based on historical university acceptance data.
3. **User Authentication & Dashboard:** Complete the Supabase integration to allow users to save their flight searches, budget plans, and chat histories to personal user accounts.
4. **Community Forums:** A secure, verified space for upcoming students to connect with alumni currently at their target universities.

---

<p align="center">
  <i>Designed with precision. Built for the ambitious global student.</i>
</p>
