import React, { useState, useEffect } from "react";
import { BrainCircuit, Sparkles, CheckCircle2 } from "lucide-react";

interface Props {
  onComplete?: () => void;
}

export const LoadingExperience: React.FC<Props> = () => {
  const stages = [
    "Analyzing your goals...",
    "Building your workout...",
    "Planning your nutrition...",
    "Optimizing your weekly schedule...",
    "Finalizing your FitBuddy plan...",
  ];

  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      {/* Central Pulsing Hologram AI Ring */}
      <div className="relative mb-8">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-primary via-accent to-secondary animate-pulse flex items-center justify-center shadow-glow-primary p-[2px]">
          <div className="w-full h-full bg-background rounded-3xl flex items-center justify-center">
            <BrainCircuit className="w-12 h-12 text-primary-light animate-bounce" />
          </div>
        </div>
        <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full -z-10 animate-pulse" />
      </div>

      <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['JetBrains_Mono']">
        FitBuddy AI is building your plan...
      </h3>
      <p className="text-sm text-muted mt-2 max-w-md">
        Synthesizing biometrics, progressive overload curves, and tailored macro distributions.
      </p>

      {/* Animated Stages Progress Tracker */}
      <div className="mt-8 w-full max-w-md glass-card p-5 rounded-2xl border border-white/10 space-y-3.5 text-left">
        {stages.map((stage, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;

          return (
            <div
              key={stage}
              className={`flex items-center gap-3 transition-all duration-300 ${
                isDone
                  ? "text-secondary font-medium"
                  : isCurrent
                  ? "text-white font-bold"
                  : "text-muted/40"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
              ) : isCurrent ? (
                <Sparkles className="w-4 h-4 text-accent animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-mono tracking-tight">{stage}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
