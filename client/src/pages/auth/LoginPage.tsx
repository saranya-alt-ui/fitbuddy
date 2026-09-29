import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Dumbbell, Mail, Lock, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/api";
import { ForgotPasswordModal } from "../../components/auth/ForgotPasswordModal";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please verify your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("alex.demo@fitbuddy.ai");
    setPassword("Password123!");
    setError(null);
    setLoading(true);

    try {
      // First try to login demo user, or register if not existing
      try {
        await login({ email: "alex.demo@fitbuddy.ai", password: "Password123!" });
        navigate("/dashboard");
      } catch (loginErr) {
        // If demo user doesn't exist yet, we can register then login
        await apiService.register({
          name: "Alex Vance",
          email: "alex.demo@fitbuddy.ai",
          password: "Password123!",
          confirmPassword: "Password123!",
        });
        await login({ email: "alex.demo@fitbuddy.ai", password: "Password123!" });
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not log in demo user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow ambient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-glow-primary group-hover:scale-105 transition-transform">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
        </Link>
        <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight font-['JetBrains_Mono']">
          Sign In to <span className="text-primary-light">FitBuddy</span>
        </h2>
        <p className="mt-2 text-sm text-muted">
          Your personal AI fitness coach is waiting for you.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="glass-card py-8 px-6 sm:px-10 rounded-2xl border border-white/10 shadow-2xl space-y-6">
          {searchParams.get("expired") && (
            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Your session expired. Please sign in again.</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-surface-100 border border-white/10 focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-primary-light hover:text-white transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-100 border border-white/10 focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold text-sm shadow-glow-primary hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In to FitBuddy"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-surface-100 hover:bg-white/5 border border-white/10 text-muted hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>One-Click Demo Login</span>
            </button>
          </div>

          <p className="text-center text-xs text-muted">
            Don't have an account yet?{" "}
            <Link to="/register" className="font-semibold text-primary-light hover:text-white transition-colors">
              Create an AI plan
            </Link>
          </p>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};
