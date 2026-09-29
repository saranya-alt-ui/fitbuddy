import React, { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  Sparkles,
  RefreshCw,
  Flame,
  Apple,
  Clock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { apiService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Meal } from "../../types";

export const NutritionPage: React.FC = () => {
  const { isDemoAiMode } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchNutrition();
  }, []);

  const fetchNutrition = async () => {
    setLoading(true);
    try {
      const res = await apiService.getNutrition();
      if (res.data?.meals) {
        setMeals(res.data.meals);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setSuccessMsg(null);
    try {
      const res = await apiService.regenerateNutrition();
      if (res.data?.meals) {
        setMeals(res.data.meals);
        setSuccessMsg("Meal plan regenerated with fresh recipes and calibrated macros!");
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs text-muted">Retrieving nutritional fuel targets...</p>
      </div>
    );
  }

  // Calculate daily totals
  const totalCalories = meals.reduce((acc, m) => acc + (m.estimatedCalories || 0), 0);
  const totalProtein = meals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const totalCarbs = meals.reduce((acc, m) => acc + (m.carbohydrates || 0), 0);
  const totalFat = meals.reduce((acc, m) => acc + (m.fat || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['JetBrains_Mono']">
              Nutrition & <span className="text-secondary">Fuel Protocol</span>
            </h1>
            {isDemoAiMode && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Demo AI Mode
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Personalized whole-food meal guidance matching your dietary preferences.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-secondary to-accent text-black font-bold text-xs shadow-glow-secondary transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
          {isRegenerating ? "Generating New Meals..." : "Regenerate Meal Plan"}
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Prominent Nutritional Values Disclaimer */}
      <div className="p-4 rounded-xl bg-surface-100 border border-white/10 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div className="text-xs text-muted leading-relaxed">
          <span className="font-bold text-white uppercase tracking-wider">Nutritional Disclaimer: </span>
          All caloric and macronutrient values shown below are <span className="text-accent font-semibold underline">calculated scientific estimates</span>. Portion sizes and individual biological absorption rates can vary. Adjust portion sizes according to your body's satiety and physical feedback.
        </div>
      </div>

      {/* Daily Macro Blueprint Card */}
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
          <div>
            <span className="text-xs uppercase font-mono text-secondary font-bold">Estimated Daily Intake</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Total Macronutrient Distribution</h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-2xl font-extrabold font-mono text-secondary">
              ~{totalCalories || 2150}
            </span>
            <span className="text-xs text-muted block">estimated kcal / day</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-5">
          <div className="bg-surface-100 p-4 rounded-xl border border-white/5 text-center">
            <p className="text-xs text-muted font-medium uppercase tracking-wider">Protein Target</p>
            <p className="text-xl sm:text-2xl font-bold font-mono text-primary-light mt-1">
              {totalProtein || 150}g
            </p>
            <span className="text-[10px] text-muted font-mono">Muscle Repair</span>
          </div>

          <div className="bg-surface-100 p-4 rounded-xl border border-white/5 text-center">
            <p className="text-xs text-muted font-medium uppercase tracking-wider">Carbohydrates</p>
            <p className="text-xl sm:text-2xl font-bold font-mono text-accent mt-1">
              {totalCarbs || 230}g
            </p>
            <span className="text-[10px] text-muted font-mono">Glycogen & Fuel</span>
          </div>

          <div className="bg-surface-100 p-4 rounded-xl border border-white/5 text-center">
            <p className="text-xs text-muted font-medium uppercase tracking-wider">Essential Fats</p>
            <p className="text-xl sm:text-2xl font-bold font-mono text-secondary mt-1">
              {totalFat || 60}g
            </p>
            <span className="text-[10px] text-muted font-mono">Hormone Balance</span>
          </div>
        </div>
      </div>

      {/* Structured Meals Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider">
          Daily Meal Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meals.map((meal, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Meal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-surface-100 border border-white/10 text-xs font-mono font-bold flex items-center justify-center text-secondary">
                      {idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-white">{meal.meal}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                    ~{meal.estimatedCalories} kcal
                  </span>
                </div>

                {/* Food Items */}
                <div className="mt-3.5 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Recommended Whole Foods:
                  </p>
                  <ul className="space-y-1.5 text-xs text-gray-200">
                    {(meal.foods || []).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-secondary shrink-0">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Estimated Macros Badge Bar */}
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-muted">Estimated Macros:</span>
                <div className="flex items-center gap-3">
                  <span className="text-primary-light font-bold">P: {meal.protein}g</span>
                  <span className="text-accent font-bold">C: {meal.carbohydrates || 0}g</span>
                  <span className="text-secondary font-bold">F: {meal.fat || 0}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
