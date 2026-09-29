import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserCheck,
  Scale,
  Dumbbell,
  Apple,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { apiService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FitnessProfile } from "../../types";

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<FitnessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService
      .getProfile()
      .then((res) => {
        if (res.data?.profile) setProfile(res.data.profile);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs text-muted">Retrieving fitness profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['JetBrains_Mono']">
            Fitness <span className="text-primary-light">Profile</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Biometrics and parameters informing your Google Gemini AI recommendations.
          </p>
        </div>

        <Link
          to="/assessment"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-primary transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          Edit & Recalibrate Assessment
        </Link>
      </div>

      {/* User Card */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-2xl font-bold text-white shadow-glow-primary">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-xs text-muted font-mono">{user?.email}</p>
          <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-mono">
            Active FitBuddy Member
          </div>
        </div>
      </div>

      {profile ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-light font-mono">
              Biometrics
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted">Age</span>
                <span className="font-bold text-white">{profile.age} years</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted">Gender</span>
                <span className="font-bold text-white capitalize">{profile.gender}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted">Height</span>
                <span className="font-bold text-white">{profile.height} cm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted">Weight</span>
                <span className="font-bold text-white">{profile.weight} kg</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent font-mono">
              Fitness Strategy
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted">Primary Goal</span>
                <span className="font-bold text-white">{profile.goal}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted">Experience</span>
                <span className="font-bold text-white">{profile.experience}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted">Equipment</span>
                <span className="font-bold text-white">{profile.equipment}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted">Schedule</span>
                <span className="font-bold text-white">
                  {profile.workoutDays} days / {profile.workoutDuration} mins
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary font-mono">
              Lifestyle & Nutrition
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted">Dietary Preference</span>
                <span className="font-bold text-white">{profile.diet}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted">Daily Activity</span>
                <span className="font-bold text-white capitalize">
                  {profile.activityLevel?.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted">Sleep Target</span>
                <span className="font-bold text-white">{profile.sleepHours} hrs / night</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Preferences & Health Notes
            </span>
            <div className="space-y-1.5 text-xs">
              <p className="text-muted">Injuries / Limitations:</p>
              <p className="text-gray-200 bg-surface-100 p-2 rounded-lg">
                {profile.preferences?.injuries || "None recorded"}
              </p>
              <p className="text-muted pt-1">Food Preferences:</p>
              <p className="text-gray-200 bg-surface-100 p-2 rounded-lg">
                {profile.preferences?.likedFoods?.join(", ") || "Balanced whole foods"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 glass-card rounded-2xl border border-white/10">
          <p className="text-xs text-muted">You haven't completed your profile assessment yet.</p>
          <Link
            to="/assessment"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-glow-primary"
          >
            Start Assessment Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
