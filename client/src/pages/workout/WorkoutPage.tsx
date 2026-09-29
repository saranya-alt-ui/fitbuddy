import React, { useState, useEffect } from "react";
import {
  Dumbbell,
  Clock,
  Flame,
  CheckCircle2,
  Circle,
  Play,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Info,
} from "lucide-react";
import { apiService } from "../../services/api";
import { WorkoutSession, AIPlanContent } from "../../types";

export const WorkoutPage: React.FC = () => {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [activePlan, setActivePlan] = useState<AIPlanContent | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const [workoutsRes, planRes] = await Promise.allSettled([
        apiService.getWorkouts(),
        apiService.getCurrentPlan(),
      ]);

      if (workoutsRes.status === "fulfilled" && workoutsRes.value.data?.workouts?.length > 0) {
        setSessions(workoutsRes.value.data.workouts);
      }
      if (planRes.status === "fulfilled" && planRes.value.data?.plan) {
        setActivePlan(planRes.value.data.plan);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExercise = async (sessionId: string, exerciseId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // Optimistic UI update
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const updatedExercises = s.exercises.map((e) =>
          e.id === exerciseId ? { ...e, completed: newStatus } : e
        );
        const allDone = updatedExercises.every((e) => e.completed);
        return {
          ...s,
          exercises: updatedExercises,
          completed: allDone,
        };
      })
    );

    try {
      await apiService.toggleExercise(exerciseId, newStatus);
    } catch (err) {
      console.error("Failed to toggle exercise:", err);
    }
  };

  const handleToggleFullSession = async (sessionId: string, currentCompleted: boolean) => {
    const newStatus = !currentCompleted;

    // Optimistic UI update
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          completed: newStatus,
          exercises: s.exercises.map((e) => ({ ...e, completed: newStatus })),
        };
      })
    );

    try {
      await apiService.completeWorkout(sessionId, newStatus);
    } catch (err) {
      console.error("Failed to complete workout:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs text-muted">Loading workout routine...</p>
      </div>
    );
  }

  // If no database sessions yet, fallback to workouts in active plan
  const currentSession = sessions[activeTab] || null;
  const currentPlanWorkout = activePlan?.workouts?.[activeTab] || null;

  const displayTitle = currentSession?.focus || currentPlanWorkout?.focus || "Full Body Foundation";
  const displayDuration = currentSession?.duration || currentPlanWorkout?.duration || 45;
  const isCompleted = currentSession?.completed || false;
  const exercises =
    currentSession?.exercises ||
    (currentPlanWorkout?.exercises || []).map((e, idx) => ({
      id: `plan-ex-${idx}`,
      name: e.name,
      sets: e.sets,
      reps: e.reps,
      rest: e.rest,
      instructions: e.instructions,
      completed: false,
    }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['JetBrains_Mono']">
            Workout <span className="text-primary-light">Command Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Track exercises, rest intervals, and check off completed sets in real-time.
          </p>
        </div>

        {currentSession && (
          <button
            onClick={() => handleToggleFullSession(currentSession.id, isCompleted)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isCompleted
                ? "bg-secondary text-black shadow-glow-secondary"
                : "bg-surface hover:bg-surface-50 border border-white/10 text-white"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? "Completed Workout ✓" : "Mark Full Workout Complete"}
          </button>
        )}
      </div>

      {/* Day Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {(sessions.length > 0 ? sessions : (activePlan?.workouts || [])).map((s, idx) => {
          const dayLabel = (s as any).dayName || (s as any).day || `Day ${idx + 1}`;
          const isDone = (s as any).completed;
          const isActive = activeTab === idx;

          return (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono tracking-tight shrink-0 transition-all flex items-center gap-2 border ${
                isActive
                  ? "bg-primary text-white border-primary shadow-glow-primary"
                  : "bg-surface-100 hover:bg-surface-200 border-white/5 text-muted hover:text-white"
              }`}
            >
              <span>{dayLabel}</span>
              {isDone && <Check className="w-3.5 h-3.5 text-secondary" />}
            </button>
          );
        })}
      </div>

      {/* Selected Workout Header Card */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-mono text-primary-light font-bold">Session Focus</span>
            <h2 className="text-2xl font-extrabold text-white mt-0.5">{displayTitle}</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100 text-muted border border-white/5">
              <Clock className="w-4 h-4 text-accent" />
              <span>{displayDuration} Minutes</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100 text-muted border border-white/5">
              <Dumbbell className="w-4 h-4 text-primary-light" />
              <span>{exercises.length} Exercises</span>
            </div>
          </div>
        </div>

        {/* Warm-Up Section */}
        {currentPlanWorkout?.warmup && currentPlanWorkout.warmup.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/5">
            <span className="text-xs font-bold uppercase text-amber-400 font-mono tracking-wider flex items-center gap-1.5 mb-2">
              <Flame className="w-3.5 h-3.5" /> 5-Minute Dynamic Warm-Up
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {currentPlanWorkout.warmup.map((w, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-surface-100 text-xs text-gray-300 border border-white/5">
                  • {w}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>Target Exercises</span>
        </h3>

        <div className="space-y-3">
          {exercises.map((ex, index) => {
            const isExCompleted = ex.completed || false;

            return (
              <div
                key={ex.id || index}
                className={`glass-card p-5 rounded-2xl border transition-all ${
                  isExCompleted
                    ? "border-secondary/40 bg-secondary/5"
                    : "border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Info */}
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-surface-100 border border-white/10 font-mono text-xs font-bold flex items-center justify-center text-muted shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <h4
                        className={`text-base font-bold ${
                          isExCompleted ? "line-through text-muted" : "text-white"
                        }`}
                      >
                        {ex.name}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono">
                        <span className="px-2 py-0.5 rounded bg-primary/20 text-primary-light border border-primary/30 font-bold">
                          {ex.sets} Sets
                        </span>
                        <span className="px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/30 font-bold">
                          {ex.reps} Reps
                        </span>
                        <span className="text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Rest: {ex.rest}
                        </span>
                      </div>

                      {ex.instructions && (
                        <p className="text-xs text-muted mt-2 leading-relaxed max-w-2xl flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-primary-light shrink-0 mt-0.5" />
                          <span>{ex.instructions}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Completion Toggle Button */}
                  {currentSession && (
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleExercise(currentSession.id, ex.id, isExCompleted)
                      }
                      className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                        isExCompleted
                          ? "bg-secondary text-black border-secondary shadow-glow-secondary/40"
                          : "bg-surface-100 hover:bg-surface-200 border-white/10 text-muted hover:text-white"
                      }`}
                      title={isExCompleted ? "Mark incomplete" : "Mark completed"}
                    >
                      {isExCompleted ? (
                        <Check className="w-5 h-5 font-bold" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cool-Down Section */}
      {currentPlanWorkout?.cooldown && currentPlanWorkout.cooldown.length > 0 && (
        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <span className="text-xs font-bold uppercase text-accent font-mono tracking-wider flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Post-Session Cool-Down Stretches
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentPlanWorkout.cooldown.map((c, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-surface-100 text-xs text-gray-300 border border-white/5">
                • {c}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
