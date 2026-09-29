# FITBUDDY – AI Fitness Plan Generator

> **Tagline:** *"Your Personal AI Fitness Coach"*  
> **Powered by:** Google Gemini Multimodal Models

---

## 🚀 Overview

**FitBuddy** is a commercial-grade, full-stack AI fitness platform designed to deliver hyper-personalized workout routines, science-backed nutrition guidance, weekly schedule optimization, recovery protocols, and 24/7 conversational coaching.

Built with a dark futuristic cyber-fitness visual identity, FitBuddy combines Google Gemini generative AI with real-time biometric tracking to empower athletes and beginners alike.

---

## 🌟 Key Features

1. **Futuristic 10-Section Landing Page:**
   - Hero section with live animated statistics (10K+ AI Plans, 24/7 AI Coach, 7 Days Smart Planning)
   - Interactive glassmorphic preview of the FitBuddy dashboard matrix
   - Complete breakdowns of how FitBuddy works, AI features, workout engine, nutrition calculator, progress tracking, and comparison matrices.

2. **8-Step Comprehensive Fitness Assessment:**
   - Personal biometrics (Age, Gender, Height, Weight)
   - Fitness goals (Fat Loss, Hypertrophy/Muscle Gain, Strength, Endurance, Maintenance)
   - Training experience (Beginner, Intermediate, Advanced)
   - Equipment availability (Bodyweight, Dumbbells, Resistance Bands, Home Gym, Commercial Gym)
   - Weekly availability (Days per week, Session minutes)
   - Lifestyle indicators (Activity level, Sleep, Stress)
   - Dietary preferences (Vegetarian, Non-Vegetarian, Vegan, Eggetarian, Indian Diet, Custom)
   - **Health Safety & Medical Warning System:** Prominently alerts users to consult licensed medical professionals when injuries, pregnancy, or high-risk limitations are specified.

3. **5-Stage Animated AI Synthesis Screen:**
   - Multi-stage progressive loader (*"Analyzing your goals..."*, *"Building your workout..."*, *"Planning your nutrition..."*, *"Optimizing your weekly schedule..."*, *"Finalizing your FitBuddy plan..."*).

4. **Dynamic AI Fitness & Nutrition Blueprint:**
   - Strict JSON validation ensuring consistent, type-safe plan structure.
   - Dynamic prompt engine enforcing conservative, progressive overload and sustainable nutrition without crash diets.
   - **Demo AI Mode:** Seamless fallback generator if `GEMINI_API_KEY` is not provided, allowing zero-friction exploration.

5. **Workout Command Center:**
   - Daily split navigation (Monday through Sunday tabs).
   - Exercise cards with target sets, reps, rest intervals, and technique guidance.
   - Interactive checkboxes to mark exercises and complete sessions, persisted in the database.

6. **Nutritional Guidance & Macro Calculator:**
   - Breakfast, Lunch, Snack, and Dinner whole-food recommendations.
   - Accurately labeled estimated calories, protein, carbohydrates, and fats.
   - Single-click **"Regenerate Meal Plan"** feature.

7. **24/7 Conversational AI Coach:**
   - Floating widget accessible across all pages + dedicated full-screen coach view.
   - Pre-populated quick-prompt chips for common scenarios (*"I missed yesterday's workout"*, *"Egg substitute ideas"*, etc.).
   - Conversational memory with real-time typing indicators.

8. **Progress Tracking with Recharts:**
   - Weigh-in logging with historical trend charts.
   - Waist circumference tracking and training notes.
   - Visual progress bar comparing current metrics to initial baselines.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, Axios, React Router v6 |
| **Backend** | Node.js, Express, TypeScript, Drizzle ORM, `mysql2`, `zod`, `dotenv` |
| **Security** | Helmet, CORS, Rate Limiting (`express-rate-limit`), JWT Bearer, `bcryptjs` (10 rounds) |
| **Generative AI** | Google Gemini (`@google/genai` / `@google/generative-ai`), Gemini 2.5 Flash / 1.5 Flash |
| **Database** | MySQL (with automated in-memory failover layer for zero-config local testing) |

---

## 🔒 Security Principles

- **Zero Client-Side Secret Exposure:** The Google Gemini API key exists **strictly** on the backend server. The React client communicates only with our Express REST API.
- **Password Protection:** Encrypted with `bcryptjs` using 10 salt rounds.
- **Request Validation:** Every payload is validated against strict Zod schemas.
- **Rate Limiting:** Protects authentication and Gemini AI generation routes from abuse.

---

## 📁 Project Directory Structure

```text
D:/saranya.t/
├── client/                     # React 18 + Vite + TypeScript Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── assessment/     # 5-stage animated loading screen
│   │   │   ├── auth/           # ForgotPassword modal
│   │   │   ├── chat/           # FloatingChat widget
│   │   │   └── layout/         # Navbar, Sidebar, MobileNav, ProtectedLayout
│   │   ├── context/            # AuthContext (JWT & session state)
│   │   ├── pages/
│   │   │   ├── assessment/     # 8-step fitness onboarding wizard
│   │   │   ├── auth/           # Login & Register views
│   │   │   ├── chat/           # Dedicated AI Coach chat interface
│   │   │   ├── dashboard/      # Main dashboard with KPI & Recharts
│   │   │   ├── landing/        # 10-section futuristic landing page
│   │   │   ├── nutrition/      # Meal planner & estimated macros
│   │   │   ├── plan/           # Full AI blueprint overview
│   │   │   ├── profile/        # User biometrics & preferences
│   │   │   ├── progress/       # Body composition trend tracking
│   │   │   └── settings/       # Architecture & diagnostic status
│   │   ├── services/           # api.ts (Centralized Axios client)
│   │   ├── types/              # Frontend TypeScript definitions
│   │   ├── App.tsx             # Root React Router setup
│   │   ├── index.css           # Tailwind directives & glow utilities
│   │   ├── main.tsx            # DOM root
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/             # Environment validation
│   │   ├── db/
│   │   │   ├── index.ts        # Database connection & memory fallback
│   │   │   ├── migrate.ts      # Drizzle migration script
│   │   │   ├── schema.ts       # Drizzle MySQL schema definition
│   │   │   └── storage.ts      # Unified storage repository
│   │   ├── middleware/         # Auth, Error handling, Rate limiting
│   │   ├── routes/             # Auth, Profile, AI, Workouts, Nutrition, Progress
│   │   ├── services/
│   │   │   ├── demo.service.ts # High-quality fallback generator
│   │   │   ├── gemini.service.ts # Google GenAI integration & retry engine
│   │   │   └── prompt.templates.ts # Safe, conservative prompt blueprints
│   │   ├── types/              # Backend interfaces & Zod schemas
│   │   └── app.ts              # Express application runner
│   ├── drizzle.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                    # Local runtime environment
│   └── .env.example            # Environment template
│
├── .gitignore
├── .env.example
├── package.json                # Root orchestrator scripts
└── README.md                   # Full documentation
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in `server/` (or copy from `server/.env.example`):

```bash
# Server Port
PORT=5000

# Client Application URL (for CORS)
CLIENT_URL=http://localhost:5173

# MySQL Database Connection String
DATABASE_URL=mysql://root:password@localhost:3306/fitbuddy

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini API Key
# (Leave empty to automatically run in Demo AI Mode)
GEMINI_API_KEY=your_gemini_api_key_here

# Gemini Model
GEMINI_MODEL=gemini-2.5-flash
```

---

## 🚀 Installation & Running Locally

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v24.14.0)
- **npm**: v9.0.0 or higher
- **MySQL** *(optional)*: If MySQL is not running locally, FitBuddy automatically falls back to an in-memory storage layer so you can test all features without database setup friction.

### 2. Install Dependencies
From the project root:
```bash
npm run install:all
```
*Or install individually:*
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Run Development Servers
To run both backend and frontend concurrently:
```bash
npm run dev
```
- **Frontend URL:** [http://localhost:5173](http://localhost:5173)
- **Backend API URL:** [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 4. Build for Production
```bash
npm run build
```

---

## 🗄️ Database Setup (MySQL & Drizzle ORM)

When you're ready to connect your production MySQL database:
1. Ensure MySQL is running and create the database:
   ```sql
   CREATE DATABASE fitbuddy;
   ```
2. Update `DATABASE_URL` in `server/.env`:
   ```bash
   DATABASE_URL=mysql://user:password@localhost:3306/fitbuddy
   ```
3. Generate Drizzle migrations:
   ```bash
   npm run db:generate
   ```
4. Apply migrations:
   ```bash
   npm run db:migrate
   ```
5. View database tables via Drizzle Studio:
   ```bash
   npm run db:studio
   ```

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and obtain JWT
- `POST /api/auth/logout` — Invalidate session
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Fitness Profile
- `GET /api/profile` — Fetch user assessment data
- `POST /api/profile` — Create or update user assessment profile

### AI Engine (Gemini)
- `POST /api/ai/generate-plan` — Generate new structured AI fitness & nutrition blueprint
- `POST /api/ai/regenerate-plan` — Regenerate active plan with new targets
- `GET /api/ai/current-plan` — Retrieve active plan
- `POST /api/ai/chat` — Conversational advice with 24/7 FitBuddy AI Coach
- `GET /api/ai/chat-history` — Retrieve chat history

### Workouts
- `GET /api/workouts` — Get weekly workout sessions and exercises
- `POST /api/workouts/:id/complete` — Toggle full workout session completion
- `POST /api/workouts/exercise/:id/toggle` — Toggle single exercise checkbox

### Nutrition
- `GET /api/nutrition` — Get structured meal plan and estimated macros
- `POST /api/nutrition/regenerate` — Refresh meals with AI

### Progress
- `GET /api/progress` — Fetch weigh-in history
- `POST /api/progress` — Record new weight, waist measurement, and notes

---

## 🧪 Demo Mode & Testing

FitBuddy is equipped with **One-Click Demo Access**:
1. Open the login page at `/login`.
2. Click **"One-Click Demo Login"** to automatically sign in with test credentials (`alex.demo@fitbuddy.ai`).
3. If no `GEMINI_API_KEY` is present, the app flags **"Demo AI Mode"** and uses realistic, profile-aware fallback algorithms so all screens, workouts, meals, and charts work out of the box!

---

## ⚖️ License
MIT License. © FitBuddy Team.
