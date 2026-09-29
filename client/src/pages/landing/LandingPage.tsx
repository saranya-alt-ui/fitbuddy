import React from "react";
import { Link } from "react-router-dom";
import {
  Dumbbell,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Flame,
  Bot,
  Activity,
  ChevronRight,
  TrendingUp,
  Apple,
  Clock,
  HeartPulse,
} from "lucide-react";
import { Navbar } from "../../components/layout/Navbar";

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-white overflow-x-hidden">
      <Navbar />

      {/* =====================================================
          SECTION 1: HERO SECTION
          ===================================================== */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Glow ambient background lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-accent/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-100 border border-white/10 text-xs font-semibold text-primary-light mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-accent animate-spin" />
            <span>Powered by Google Gemini AI Models</span>
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto font-['JetBrains_Mono']">
            FIT<span className="text-primary-light">BUDDY</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-gradient-hero">
            "Your Personal AI Fitness Coach"
          </p>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl mx-auto font-normal leading-relaxed">
            Generate personalized workout, nutrition and recovery plans with the power of Google Gemini.
          </p>

          {/* Call to action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/assessment"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold text-base shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-5 h-5 text-accent" />
              <span>Create My AI Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface hover:bg-surface-50 border border-white/10 hover:border-white/20 text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              Explore Features
            </a>
          </div>

          {/* Animated Statistics */}
          <div className="mt-16 grid grid-cols-3 max-w-2xl mx-auto divide-x divide-white/10 glass-card rounded-2xl py-6 px-4">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold font-['JetBrains_Mono'] text-white">
                10K<span className="text-primary-light">+</span>
              </p>
              <p className="text-xs sm:text-sm text-muted mt-1 font-medium">AI Plans Generated</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold font-['JetBrains_Mono'] text-secondary">
                24/7
              </p>
              <p className="text-xs sm:text-sm text-muted mt-1 font-medium">AI Coach Support</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold font-['JetBrains_Mono'] text-accent">
                7 Days
              </p>
              <p className="text-xs sm:text-sm text-muted mt-1 font-medium">Smart Scheduling</p>
            </div>
          </div>

          {/* Futuristic AI Fitness Dashboard Preview Mockup */}
          <div className="mt-16 relative max-w-5xl mx-auto rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/10 shadow-2xl backdrop-blur-2xl">
            <div className="bg-[#0b0b0f] rounded-2xl p-4 sm:p-8 border border-white/5 text-left overflow-hidden">
              {/* Mockup Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs font-mono text-muted">FitBuddy AI Dashboard // Live Matrix</span>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-secondary/10 text-secondary border border-secondary/20">
                  Adaptive AI Active
                </span>
              </div>

              {/* Mockup Dashboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="glass-card p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-muted uppercase font-semibold">Today's Focus</p>
                  <p className="text-lg font-bold text-white mt-1">Upper Body Power</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted">
                    <span>45 Mins</span>
                    <span className="text-primary-light font-mono">5 Exercises</span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-muted uppercase font-semibold">Daily Calorie Target</p>
                  <p className="text-lg font-bold text-secondary mt-1">2,350 kcal</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted">
                    <span>Protein: 165g</span>
                    <span>Carbs: 240g</span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-muted uppercase font-semibold">AI Coach Insight</p>
                  <p className="text-xs text-white/90 mt-1 italic">
                    "Recovery status optimal. Progressive overload ready on Bench Press."
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-accent font-semibold">
                    <Bot className="w-3.5 h-3.5" /> Gemini 2.5 Coach
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 2: HOW FITBUDDY WORKS
          ===================================================== */}
      <section id="how-it-works" className="py-24 border-t border-white/5 bg-[#08080a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-light font-mono">
              Simple 3-Step Flow
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              How FitBuddy Works
            </p>
            <p className="mt-4 text-muted text-base">
              From your initial profile to your custom AI plan in under 60 seconds.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl border border-white/5 relative group hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary-light font-bold text-xl flex items-center justify-center mb-6 border border-primary/30">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Input Your Fitness Profile</h3>
              <p className="text-sm text-muted leading-relaxed">
                Enter your age, biometric stats, equipment availability, schedule, dietary preferences, and any physical limitations.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-white/5 relative group hover:border-accent/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent font-bold text-xl flex items-center justify-center mb-6 border border-accent/30">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Gemini AI Synthesis</h3>
              <p className="text-sm text-muted leading-relaxed">
                Google Gemini synthesizes progressive workout splits, macro-calculated nutrition, and active recovery protocols tailored directly to your goals.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-white/5 relative group hover:border-secondary/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary font-bold text-xl flex items-center justify-center mb-6 border border-secondary/30">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Execute & Adapt Daily</h3>
              <p className="text-sm text-muted leading-relaxed">
                Track exercise sets, check off completed workouts, log body composition, and converse with your 24/7 AI Coach for real-time adjustments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 3: AI FEATURES
          ===================================================== */}
      <section id="features" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent font-mono">
              Next-Gen Capabilities
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              Smarter Fitness Powered by AI
            </p>
            <p className="mt-4 text-muted text-base">
              Engineered with advanced prompt optimization, strict schema safety, and adaptive fitness science.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary-light mb-4">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Customized Workout Splits</h4>
              <p className="text-sm text-muted leading-relaxed">
                Adapts sets, reps, and tempo based on your exact equipment (No Equipment, Dumbbells, or Full Gym).
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-secondary/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary mb-4">
                <Apple className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Macro-Balanced Nutrition</h4>
              <p className="text-sm text-muted leading-relaxed">
                Caters to Vegetarian, Vegan, Eggetarian, Non-Veg, and Indian Diet preferences with estimated macros.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-accent/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Conversational AI Coach</h4>
              <p className="text-sm text-muted leading-relaxed">
                Ask about missed days, food swaps, exercise technique modifications, or plateau breakthroughs anytime.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary-light mb-4">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Recovery & Sleep Guidance</h4>
              <p className="text-sm text-muted leading-relaxed">
                Integrated active rest days, hydration milestones, and sleep hygiene recommendations for CNS recovery.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-secondary/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Progress Metric Tracking</h4>
              <p className="text-sm text-muted leading-relaxed">
                Visual charts monitor weight trajectory, waist circumference changes, and workout completion rates.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-accent/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Safety & Conservative Bounds</h4>
              <p className="text-sm text-muted leading-relaxed">
                Enforces medical safety disclaimers, warns against crash diets, and protects joints with modified movements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 4: WORKOUT GENERATOR SHOWCASE
          ===================================================== */}
      <section id="workouts" className="py-24 border-t border-white/5 bg-[#08080a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-light text-xs font-bold uppercase tracking-wider mb-4 border border-primary/30">
                <Dumbbell className="w-3.5 h-3.5" />
                Adaptive Workout Generator
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Workouts Custom Built for Your Schedule & Equipment
              </h3>
              <p className="mt-4 text-muted text-base leading-relaxed">
                Whether you have 30 minutes at home with zero equipment or 75 minutes in an Olympic weightlifting gym, FitBuddy structures high-efficiency exercise blocks with target sets, reps, rest periods, and execution instructions.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                  <span className="text-sm text-gray-200">Interactive completion checkoffs per set and session</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                  <span className="text-sm text-gray-200">Dynamic warm-ups and post-session cool-down stretches</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                  <span className="text-sm text-gray-200">Weekly split calibration matching your exact available days</span>
                </div>
              </div>
            </div>

            {/* Visual Workout Card */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-glow-primary/20">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase font-mono text-primary-light font-bold">Today's Session</span>
                  <h4 className="text-xl font-bold text-white">Upper Body Push & Core</h4>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 font-mono">45 Mins</span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="bg-surface-100 p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-white">Dumbbell Incline Press</p>
                    <p className="text-xs text-muted">3 Sets × 10-12 Reps • 60s Rest</p>
                  </div>
                  <span className="w-5 h-5 rounded-full border-2 border-secondary bg-secondary/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                  </span>
                </div>

                <div className="bg-surface-100 p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-white">Dumbbell Lateral Raises</p>
                    <p className="text-xs text-muted">3 Sets × 12-15 Reps • 45s Rest</p>
                  </div>
                  <span className="w-5 h-5 rounded-full border-2 border-white/20" />
                </div>

                <div className="bg-surface-100 p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-white">Hanging Knee Raises</p>
                    <p className="text-xs text-muted">3 Sets × 15 Reps • 45s Rest</p>
                  </div>
                  <span className="w-5 h-5 rounded-full border-2 border-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 5: NUTRITION GENERATOR SHOWCASE
          ===================================================== */}
      <section id="nutrition" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual Nutrition Cards */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 order-2 lg:order-1">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase font-mono text-secondary font-bold">Personalized Meal Blueprint</span>
                  <h4 className="text-xl font-bold text-white">Estimated Daily Macros</h4>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-secondary font-mono">2,150</span>
                  <span className="text-xs text-muted block">kcal target</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="bg-surface-100 p-2.5 rounded-xl border border-white/5">
                  <p className="text-[11px] text-muted">Protein</p>
                  <p className="text-sm font-bold text-primary-light">150g (30%)</p>
                </div>
                <div className="bg-surface-100 p-2.5 rounded-xl border border-white/5">
                  <p className="text-[11px] text-muted">Carbs</p>
                  <p className="text-sm font-bold text-accent">230g (45%)</p>
                </div>
                <div className="bg-surface-100 p-2.5 rounded-xl border border-white/5">
                  <p className="text-[11px] text-muted">Fats</p>
                  <p className="text-sm font-bold text-secondary">60g (25%)</p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="p-3 rounded-xl bg-surface-100 border border-white/5">
                  <div className="flex justify-between text-xs font-semibold text-white">
                    <span>Breakfast • 450 kcal</span>
                    <span className="text-muted">26g Protein</span>
                  </div>
                  <p className="text-xs text-muted mt-1">Oatmeal with chia seeds, whey/tofu, and fresh berries</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-100 border border-white/5">
                  <div className="flex justify-between text-xs font-semibold text-white">
                    <span>Lunch • 620 kcal</span>
                    <span className="text-muted">45g Protein</span>
                  </div>
                  <p className="text-xs text-muted mt-1">Brown rice bowl with grilled chicken or paneer, and broccoli</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-4 border border-secondary/30">
                <Apple className="w-3.5 h-3.5" />
                Intelligent Nutrition Engine
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                No Generic Diets. Nourishment Calibrated for Your Fuel Needs.
              </h3>
              <p className="mt-4 text-muted text-base leading-relaxed">
                Whether you follow an Indian vegetarian diet, plant-based vegan lifestyle, or high-protein omnivorous routine, FitBuddy outlines breakfast, lunch, snacks, and dinner with calculated macro breakdowns.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span className="text-sm text-gray-200">Respects cultural preferences and avoided allergies</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span className="text-sm text-gray-200">One-click AI meal regeneration for fresh recipe ideas</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span className="text-sm text-gray-200">Accurately labeled estimates without extreme calorie starvation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 6: PROGRESS TRACKING SHOWCASE
          ===================================================== */}
      <section className="py-24 border-t border-white/5 bg-[#08080a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-light font-mono">
              Data-Driven Results
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              Visual Progress Tracking Over Time
            </p>
            <p className="mt-4 text-muted text-base">
              Monitor your body composition trends with dynamic Recharts graphs. Track weight, waist circumference, and workout consistency.
            </p>
          </div>

          <div className="mt-12 max-w-4xl mx-auto glass-card p-6 sm:p-8 rounded-3xl border border-white/10 text-left">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="text-xs text-muted uppercase font-bold">Body Weight Trend (kg)</span>
                <p className="text-2xl font-bold font-mono text-white mt-1">78.2 kg <span className="text-secondary text-sm font-semibold">(-3.4 kg total)</span></p>
              </div>
              <span className="px-3 py-1 bg-surface-100 rounded-lg text-xs font-mono text-muted">Weekly Log</span>
            </div>

            {/* Visual Progress Bar representation */}
            <div className="mt-8 space-y-4">
              <div>
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>Starting Weight: 81.6 kg</span>
                  <span>Target Goal: 75.0 kg</span>
                </div>
                <div className="h-3 w-full bg-surface-100 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full w-[65%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 7: AI FITNESS CHAT
          ===================================================== */}
      <section id="chat" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-4 border border-accent/30">
                <Bot className="w-3.5 h-3.5" />
                Always-On AI Coach
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Ask Questions. Get Science-Backed Answers in Seconds.
              </h3>
              <p className="mt-4 text-muted text-base leading-relaxed">
                Missed a workout? Wondering what to substitute for eggs? Feeling tight in your lower back? FitBuddy AI is trained to provide intelligent, encouraging, and actionable advice tailored directly to your profile.
              </p>
              <div className="mt-6 space-y-2">
                <div className="p-3 rounded-xl bg-surface-100 border border-white/5 text-xs text-gray-300">
                  💬 "I missed yesterday's leg day, should I do two workouts today?"
                </div>
                <div className="p-3 rounded-xl bg-surface-100 border border-white/5 text-xs text-gray-300">
                  💬 "What is a good vegetarian protein alternative to paneer?"
                </div>
                <div className="p-3 rounded-xl bg-surface-100 border border-white/5 text-xs text-gray-300">
                  💬 "How do I warm up properly before doing heavy squats?"
                </div>
              </div>
            </div>

            {/* Floating Chat Demo Visual */}
            <div className="glass-card rounded-2xl border border-white/10 p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">FitBuddy AI Coach</p>
                  <p className="text-[10px] text-secondary font-mono">● Online & Ready</p>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3 rounded-xl rounded-tr-none bg-primary text-white ml-auto max-w-[85%]">
                  "I missed yesterday's workout. How should I adjust my week?"
                </div>
                <div className="p-3.5 rounded-xl rounded-tl-none bg-surface-100 border border-white/5 text-gray-200 mr-auto max-w-[85%] space-y-2">
                  <p className="font-semibold text-primary-light">No stress at all!</p>
                  <p>Never do two sessions in one day. Simply shift yesterday's workout to today and treat this week as a rolling schedule. Consistency over months matters far more than a single day.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 8: WHY FITBUDDY
          ===================================================== */}
      <section className="py-24 border-t border-white/5 bg-[#08080a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-light font-mono">
              The FitBuddy Advantage
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              Why FitBuddy vs. Traditional Fitness Apps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20">
              <h4 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                <span>❌</span> Generic Gym Apps & Static PDFs
              </h4>
              <ul className="space-y-3 text-sm text-muted">
                <li>• One-size-fits-all templates that ignore your equipment.</li>
                <li>• Rigid diets requiring rare, expensive ingredients.</li>
                <li>• Zero real-time support when you're sore or miss a workout.</li>
                <li>• Overpromising extreme 7-day weight-loss gimmicks.</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/30 shadow-glow-secondary/10">
              <h4 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                <span>⚡</span> FitBuddy AI Engine
              </h4>
              <ul className="space-y-3 text-sm text-gray-200">
                <li>• Customized to your available gear (bodyweight, dumbbells, or gym).</li>
                <li>• Dynamic nutrition for Vegetarian, Vegan, Indian, or custom diets.</li>
                <li>• 24/7 conversational coach answering questions in seconds.</li>
                <li>• Conservative, science-backed progressive overload methodology.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 9: CALL TO ACTION (CTA)
          ===================================================== */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none -z-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Build Your AI Fitness Blueprint?
          </h2>
          <p className="mt-4 text-muted text-base sm:text-lg max-w-2xl mx-auto">
            Join thousands generating intelligent, personalized fitness, nutrition, and recovery plans today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/assessment"
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold text-base shadow-glow-primary hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-accent" />
              <span>Create My AI Plan Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 10: FOOTER
          ===================================================== */}
      <footer className="border-t border-white/10 bg-[#050507] py-12 text-sm text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-primary-light" />
              </div>
              <span className="font-extrabold text-lg text-white font-['JetBrains_Mono']">
                FIT<span className="text-primary-light">BUDDY</span>
              </span>
            </div>

            <p className="text-xs text-center md:text-left text-muted max-w-xl">
              <span className="font-bold text-gray-400">Medical Disclaimer:</span> FitBuddy provides AI-assisted fitness and nutritional guidance for informational purposes only and is not a medical provider. Always consult a physician before beginning any new training or dietary program.
            </p>

            <div className="text-xs font-mono text-muted">
              © {new Date().getFullYear()} FitBuddy AI. Powered by Google Gemini.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
