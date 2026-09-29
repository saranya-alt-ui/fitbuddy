import React, { useState, useEffect } from "react";
import {
  Settings,
  Shield,
  Cpu,
  Database,
  Key,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { apiService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export const SettingsPage: React.FC = () => {
  const { user, logout, isDemoAiMode } = useAuth();
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
    apiService
      .getHealth()
      .then((res) => setHealthData(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-white/5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['JetBrains_Mono']">
          System & Account <span className="text-primary-light">Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Review application architecture status, Gemini AI engine mode, and account credentials.
        </p>
      </div>

      {/* Account Info */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary-light" />
          <span>Account Credentials</span>
        </h3>
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-muted block font-semibold uppercase mb-1">User Name</label>
            <input
              disabled
              value={user?.name || ""}
              className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs opacity-80"
            />
          </div>
          <div>
            <label className="text-muted block font-semibold uppercase mb-1">Registered Email</label>
            <input
              disabled
              value={user?.email || ""}
              className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs opacity-80 font-mono"
            />
          </div>
        </div>
      </div>

      {/* AI & Infrastructure Diagnostic Status */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-accent" />
          <span>AI Engine & Backend Architecture</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-surface-100 border border-white/5 space-y-1">
            <span className="text-muted block uppercase text-[10px]">AI Integration Mode</span>
            <div className="flex items-center gap-2 font-bold text-white">
              <span
                className={`w-2 h-2 rounded-full ${
                  isDemoAiMode ? "bg-amber-400" : "bg-secondary"
                }`}
              />
              <span>{isDemoAiMode ? "Demo AI Mode" : "Google Gemini Live"}</span>
            </div>
            <p className="text-[10px] text-muted font-sans mt-1">
              {isDemoAiMode
                ? "Provide GEMINI_API_KEY in backend .env to switch to live Google models."
                : "Connected to Gemini 2.5 API via backend environment."}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-100 border border-white/5 space-y-1">
            <span className="text-muted block uppercase text-[10px]">Active Model</span>
            <div className="flex items-center gap-2 font-bold text-white">
              <span>{healthData?.geminiModel || "gemini-2.5-flash"}</span>
            </div>
            <p className="text-[10px] text-muted font-sans mt-1">
              Google DeepMind Multimodal Generative AI
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-100 border border-white/5 space-y-1">
            <span className="text-muted block uppercase text-[10px]">Database Architecture</span>
            <div className="flex items-center gap-2 font-bold text-white">
              <Database className="w-3.5 h-3.5 text-secondary" />
              <span>{healthData?.database || "MySQL / Drizzle ORM"}</span>
            </div>
            <p className="text-[10px] text-muted font-sans mt-1">
              Type-safe ORM with automated failover resilience.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-100 border border-white/5 space-y-1">
            <span className="text-muted block uppercase text-[10px]">Security Protocol</span>
            <div className="flex items-center gap-2 font-bold text-white">
              <Key className="w-3.5 h-3.5 text-primary-light" />
              <span>JWT Bearer + Bcrypt (10 Salt)</span>
            </div>
            <p className="text-[10px] text-muted font-sans mt-1">
              Zero API secret exposure to frontend.
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone / Logout */}
      <div className="glass-card p-6 rounded-2xl border border-red-500/20 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">Sign Out of FitBuddy</h4>
          <p className="text-xs text-muted">Disconnect active JWT session from this device.</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
};
