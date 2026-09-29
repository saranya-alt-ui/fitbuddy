import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  Sparkles,
  Calendar,
  Dumbbell,
  UtensilsCrossed,
  HeartPulse,
  Lightbulb,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { apiService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { AIPlanContent } from "../../types";

export const AIPlanPage: React.FC = () => {
  const { isDemoAiMode } = useAuth();
  const [plan, setPlan] = useState<AIPlanContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await apiService.getCurrentPlan();
      if (res.data?.plan) {
        setPlan(res.data.plan);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setMsg(null);
    try {
      const res = await apiService.regeneratePlan();
      if (res.data?.plan) {
        setPlan(res.data.plan);
        setMsg("Your AI Plan has been refreshed with new progressive targets!");
      }
    } catch (e: any) {
      setMsg("Failed to regenerate plan. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs text-muted">Retrieving your FitBuddy AI blueprint...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-16 max-w-md mx-auto glass-card p-8 rounded-2xl border border-white/10">
        <BrainCircuit className="w-12 h-12 text-primary-light mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">No Active AI Plan Found</h2>
        <p className="text-xs text-muted mt-2">
          Complete the quick 8-step fitness assessment so FitBuddy AI can tailor your blueprint.
        </p>
        <Link
          to="/assessment"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-primary transition-all"
        >
          <Sparkles className="w-4 h-4 text-accent" /> Start Assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['JetBrains_Mono']">
              Your AI <span className="text-primary-light">Fitness Blueprint</span>
            </h1>
            {isDemoAiMode && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Demo AI Mode
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Synthesized by Google Gemini based on your personal biometrics and goals.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white text-xs font-bold shadow-glow-primary transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
          {isRegenerating ? "Synthesizing with Gemini..." : "Regenerate Blueprint"}
        </button>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <span className="text-xs uppercase font-mono text-primary-light font-bold">Executive Strategy</span>
          <p className="text-sm text-gray-200 mt-2 leading-relaxed">{plan.summary}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <span className="text-xs uppercase font-mono text-accent font-bold">Calibrated Target</span>
          <p className="text-sm text-white font-bold mt-2">{plan.goal}</p>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-primary-light" />
          <h2 className="text-lg font-bold text-white">7-Day Smart Schedule</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {plan.weeklySchedule.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                item.isRestDay
                  ? "bg-surface/50 border-white/5 text-muted"
                  : "bg-surface-100 border-primary/30 text-white shadow-glow-primary/10"
              }`}
            >
              <p className="text-xs font-bold font-mono text-primary-light">{item.day}</p>
              <p className="text-xs font-semibold mt-1 truncate">{item.activity}</p>
              <span
                className={`inline-block mt-2 text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  item.isRestDay ? "bg-white/5 text-muted" : "bg-primary/20 text-primary-light"
                }`}
              >
                {item.isRestDay ? "Rest" : "Training"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Workouts Preview Link */}
      <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary-light mb-1">
            <Dumbbell className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Training Sessions Ready</h3>
          </div>
          <p className="text-xs text-muted">
            {plan.workouts.length} dedicated workout splits configured with sets, reps, and instructions.
          </p>
        </div>
        <Link
          to="/workouts"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-primary transition-all shrink-0"
        >
          Open Workout Hub <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Nutrition Blueprint Preview Link */}
      <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-secondary mb-1">
            <UtensilsCrossed className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Calibrated Nutrition Plan</h3>
          </div>
          <p className="text-xs text-muted">
            Complete daily meal breakdowns with protein, carbs, fats, and whole food options.
          </p>
        </div>
        <Link
          to="/nutrition"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/40 text-xs font-bold transition-all shrink-0"
        >
          View Meal Plan <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recovery & Health Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 mb-3 text-accent">
            <HeartPulse className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recovery Protocols</h3>
          </div>
          <ul className="space-y-2 text-xs text-gray-300">
            {plan.recovery.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 mb-3 text-secondary">
            <Lightbulb className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">FitBuddy Pro Tips</h3>
          </div>
          <ul className="space-y-2 text-xs text-gray-300">
            {plan.tips.map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-secondary">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
