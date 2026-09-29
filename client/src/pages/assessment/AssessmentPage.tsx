import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Dumbbell,
  Heart,
  Scale,
  Calendar,
  Flame,
  Utensils,
  AlertTriangle,
  Check,
} from "lucide-react";
import { apiService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FitnessGoal, ExperienceLevel, EquipmentOption, DietType, FitnessProfile } from "../../types";
import { LoadingExperience } from "../../components/assessment/LoadingExperience";

export const AssessmentPage: React.FC = () => {
  const { user, setHasProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(75);

  const [goal, setGoal] = useState<FitnessGoal>("Fat Loss");
  const [experience, setExperience] = useState<ExperienceLevel>("Beginner");
  const [equipment, setEquipment] = useState<EquipmentOption>("Dumbbells");

  const [workoutDays, setWorkoutDays] = useState<number>(4);
  const [workoutDuration, setWorkoutDuration] = useState<number>(45);

  const [activityLevel, setActivityLevel] = useState<"sedentary" | "lightly_active" | "moderately_active" | "very_active">("moderately_active");
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [stressLevel, setStressLevel] = useState<"low" | "moderate" | "high">("moderate");

  const [diet, setDiet] = useState<DietType>("Vegetarian");

  const [likedFoods, setLikedFoods] = useState<string>("Oats, Greek yogurt, Berries, Rice");
  const [avoidedFoods, setAvoidedFoods] = useState<string>("");
  const [injuries, setInjuries] = useState<string>("");
  const [limitations, setLimitations] = useState<string>("");
  const [workoutPreferences, setWorkoutPreferences] = useState<string>("Strength & hypertrophy focus");

  // Check if high-risk condition is entered
  const isHighRisk =
    injuries.trim().length > 3 ||
    limitations.trim().length > 3 ||
    injuries.toLowerCase().includes("knee") ||
    injuries.toLowerCase().includes("back") ||
    injuries.toLowerCase().includes("shoulder") ||
    limitations.toLowerCase().includes("pregnant") ||
    limitations.toLowerCase().includes("heart");

  const handleNext = () => {
    setError(null);
    if (step < 8) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setIsGenerating(true);
    setError(null);

    const profileData: Partial<FitnessProfile> = {
      age: Number(age),
      gender,
      height: Number(height),
      weight: Number(weight),
      goal,
      experience,
      equipment,
      workoutDays: Number(workoutDays),
      workoutDuration: Number(workoutDuration),
      activityLevel,
      sleepHours: Number(sleepHours),
      stressLevel,
      diet,
      preferences: {
        likedFoods: likedFoods.split(",").map((s) => s.trim()).filter(Boolean),
        avoidedFoods: avoidedFoods.split(",").map((s) => s.trim()).filter(Boolean),
        injuries: injuries.trim(),
        limitations: limitations.trim(),
        workoutPreferences: workoutPreferences.trim(),
      },
    };

    try {
      // Save profile and generate plan
      await apiService.saveProfile(profileData);
      setHasProfile(true);
      await apiService.generatePlan(profileData);

      // Smooth delay to appreciate 5-stage animation
      setTimeout(() => {
        navigate("/dashboard");
      }, 3500);
    } catch (err: any) {
      setIsGenerating(false);
      setError(
        err.response?.data?.message || "Failed to generate AI plan. Please check inputs and try again."
      );
    }
  };

  if (isGenerating) {
    return <LoadingExperience />;
  }

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-white py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full">
        {/* Top Header & Step Tracker */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-mono text-primary-light mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>AI Assessment • Step {step} of 8</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['JetBrains_Mono']">
            {step === 1 && "Personal Biometrics"}
            {step === 2 && "Primary Fitness Goal"}
            {step === 3 && "Training Experience"}
            {step === 4 && "Available Equipment"}
            {step === 5 && "Schedule & Availability"}
            {step === 6 && "Lifestyle & Recovery"}
            {step === 7 && "Nutrition & Diet"}
            {step === 8 && "Preferences & Health Safety"}
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            FitBuddy uses these parameters to calibrate your personalized Gemini plan.
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-surface-100 h-2 rounded-full mt-6 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-primary via-accent to-secondary h-full transition-all duration-300"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Wizard Card Body */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative">
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan"
                  className="w-full bg-surface-100 border border-white/10 focus:border-primary rounded-xl px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-surface-100 border border-white/10 focus:border-primary rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-surface-100 border border-white/10 focus:border-primary rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="250"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-surface-100 border border-white/10 focus:border-primary rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="250"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-surface-100 border border-white/10 focus:border-primary rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Fitness Goal */}
          {step === 2 && (
            <div className="space-y-3 animate-in fade-in">
              {(
                [
                  { id: "Fat Loss", title: "Fat Loss", desc: "Burn visceral body fat while preserving lean muscle mass." },
                  { id: "Muscle Gain", title: "Muscle Gain (Hypertrophy)", desc: "Build muscular size, thickness, and symmetry." },
                  { id: "Strength", title: "Maximal Strength", desc: "Increase neurological power output on compound lifts." },
                  { id: "General Fitness", title: "General Fitness & Health", desc: "Boost stamina, functional mobility, and daily vitality." },
                  { id: "Endurance", title: "Cardiovascular Endurance", desc: "Enhance VO2 max, aerobic capacity, and stamina." },
                  { id: "Maintain Weight", title: "Maintain Weight & Tone", desc: "Sustain current physique with balanced physical activity." },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGoal(item.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    goal === item.id
                      ? "bg-primary/20 border-primary shadow-glow-primary/40 text-white"
                      : "bg-surface-100 border-white/5 text-muted hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div>
                    <p className="font-bold text-sm text-white">{item.title}</p>
                    <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                  </div>
                  {goal === item.id && <Check className="w-5 h-5 text-primary-light shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {/* STEP 3: Experience */}
          {step === 3 && (
            <div className="space-y-3 animate-in fade-in">
              {(
                [
                  { id: "Beginner", title: "Beginner (0 - 1 Year)", desc: "Learning proper mechanics, building foundational mobility." },
                  { id: "Intermediate", title: "Intermediate (1 - 3 Years)", desc: "Consistent training history, familiar with progressive overload." },
                  { id: "Advanced", title: "Advanced (3+ Years)", desc: "Experienced lifter, understands periodization and advanced splits." },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setExperience(item.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    experience === item.id
                      ? "bg-accent/20 border-accent shadow-glow-accent/40 text-white"
                      : "bg-surface-100 border-white/5 text-muted hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div>
                    <p className="font-bold text-sm text-white">{item.title}</p>
                    <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                  </div>
                  {experience === item.id && <Check className="w-5 h-5 text-accent shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {/* STEP 4: Equipment */}
          {step === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
              {(
                [
                  { id: "No Equipment", title: "No Equipment", desc: "Pure calisthenics" },
                  { id: "Bodyweight", title: "Bodyweight Only", desc: "Pull-up bar & bodyweight" },
                  { id: "Dumbbells", title: "Dumbbells", desc: "Adjustable or fixed pairs" },
                  { id: "Resistance Bands", title: "Resistance Bands", desc: "Loop & tube bands" },
                  { id: "Home Gym", title: "Home Gym", desc: "Bench, dumbbells & rack" },
                  { id: "Full Gym", title: "Commercial Gym", desc: "Barbells, cables & machines" },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEquipment(item.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    equipment === item.id
                      ? "bg-secondary/20 border-secondary shadow-glow-secondary/30 text-white"
                      : "bg-surface-100 border-white/5 text-muted hover:border-white/20 hover:text-white"
                  }`}
                >
                  <p className="font-bold text-sm text-white">{item.title}</p>
                  <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          )}

          {/* STEP 5: Availability */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider">
                    Workout Days Per Week
                  </label>
                  <span className="text-sm font-bold text-primary-light font-mono">
                    {workoutDays} Days / Week
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={workoutDays}
                  onChange={(e) => setWorkoutDays(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[11px] text-muted mt-1">
                  <span>2 days (Minimum)</span>
                  <span>4 days (Recommended)</span>
                  <span>6 days (High Volume)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider">
                    Session Duration
                  </label>
                  <span className="text-sm font-bold text-accent font-mono">
                    {workoutDuration} Minutes
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="5"
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <div className="flex justify-between text-[11px] text-muted mt-1">
                  <span>20m (Express)</span>
                  <span>45m (Optimal)</span>
                  <span>90m (Long)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Lifestyle */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Daily Physical Activity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "sedentary", label: "Sedentary (Desk Job)" },
                    { id: "lightly_active", label: "Light (5k steps)" },
                    { id: "moderately_active", label: "Moderate (8k-10k steps)" },
                    { id: "very_active", label: "High (Active job/12k+)" },
                  ].map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setActivityLevel(act.id as any)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                        activityLevel === act.id
                          ? "bg-primary/20 border-primary text-white"
                          : "bg-surface-100 border-white/5 text-muted hover:text-white"
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    Sleep (Hours / Night)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="4"
                    max="12"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full bg-surface-100 border border-white/10 focus:border-primary rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    Daily Stress Level
                  </label>
                  <select
                    value={stressLevel}
                    onChange={(e) => setStressLevel(e.target.value as any)}
                    className="w-full bg-surface-100 border border-white/10 focus:border-primary rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="low">Low (Relaxed)</option>
                    <option value="moderate">Moderate (Normal)</option>
                    <option value="high">High (Elevated cortisol)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Diet */}
          {step === 7 && (
            <div className="space-y-3 animate-in fade-in">
              {(
                [
                  { id: "Vegetarian", title: "Vegetarian", desc: "Plant-based with dairy (curd, paneer, milk)." },
                  { id: "Non-Vegetarian", title: "Non-Vegetarian", desc: "Omnivorous (poultry, meat, fish, eggs, dairy)." },
                  { id: "Vegan", title: "Vegan", desc: "100% Plant-based (no meat, dairy, eggs, or honey)." },
                  { id: "Eggetarian", title: "Eggetarian", desc: "Vegetarian diet with eggs included." },
                  { id: "Indian Diet", title: "Indian Diet", desc: "Dal, roti, sabzi, curd, paneer / chicken recipes." },
                  { id: "Custom", title: "Custom / Flexible", desc: "Custom macronutrient ratios & preferred whole foods." },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDiet(item.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    diet === item.id
                      ? "bg-secondary/20 border-secondary shadow-glow-secondary/30 text-white"
                      : "bg-surface-100 border-white/5 text-muted hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div>
                    <p className="font-bold text-sm text-white">{item.title}</p>
                    <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                  </div>
                  {diet === item.id && <Check className="w-5 h-5 text-secondary shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {/* STEP 8: Preferences & Health Safety */}
          {step === 8 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Foods You Enjoy
                </label>
                <input
                  type="text"
                  value={likedFoods}
                  onChange={(e) => setLikedFoods(e.target.value)}
                  placeholder="e.g. Oatmeal, Chicken, Lentils, Apples"
                  className="w-full bg-surface-100 border border-white/10 focus:border-primary rounded-xl px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Foods You Avoid or Allergies
                </label>
                <input
                  type="text"
                  value={avoidedFoods}
                  onChange={(e) => setAvoidedFoods(e.target.value)}
                  placeholder="e.g. Shellfish, Peanuts, Lactose (or None)"
                  className="w-full bg-surface-100 border border-white/10 focus:border-primary rounded-xl px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Injuries, Medical Conditions or Limitations
                </label>
                <textarea
                  rows={2}
                  value={injuries}
                  onChange={(e) => setInjuries(e.target.value)}
                  placeholder="e.g. Mild lower back sensitivity, recovering left knee sprain (or None)"
                  className="w-full bg-surface-100 border border-white/10 focus:border-primary rounded-xl px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none resize-none"
                />
              </div>

              {/* MEDICAL DISCLAIMER NOTICE */}
              {isHighRisk && (
                <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex gap-3 animate-in fade-in">
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-200">Physician Consultation Recommended</span>
                    <p className="mt-0.5 text-amber-300/90 leading-relaxed">
                      You mentioned an injury or physical condition. FitBuddy AI will tailor low-impact modifications, but you should always consult a licensed doctor or physical therapist before starting high-intensity resistance training.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons footer */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-muted hover:text-white text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white text-sm font-bold shadow-glow-primary transition-all flex items-center gap-2"
            >
              {step === 8 ? (
                <>
                  <Sparkles className="w-4 h-4 text-accent" />
                  Generate AI Fitness Plan
                </>
              ) : (
                <>
                  Next Step <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
