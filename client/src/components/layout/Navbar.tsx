import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Menu, X, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-glow-primary transition-transform group-hover:scale-105">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-white font-['JetBrains_Mono']">
                FIT<span className="text-primary-light">BUDDY</span>
              </span>
              <span className="bg-primary/20 text-primary-light text-[10px] font-bold px-1.5 py-0.5 rounded border border-primary/30 uppercase tracking-widest">
                AI
              </span>
            </div>
            <p className="text-[11px] text-muted -mt-1 font-medium tracking-wide">
              Your Personal AI Fitness Coach
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted hover:text-white">
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            AI Engine
          </a>
          <a href="#workouts" className="hover:text-white transition-colors">
            Workouts
          </a>
          <a href="#nutrition" className="hover:text-white transition-colors">
            Nutrition
          </a>
          <a href="#chat" className="hover:text-white transition-colors">
            AI Coach
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-surface hover:bg-surface-50 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:border-primary/50 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-primary-light" />
                Go to Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-xs text-muted hover:text-white px-2 py-1 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-muted hover:text-white px-4 py-2 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary animate-pulse-slow"></span>
                <span className="relative flex items-center gap-2 px-5 py-2.5 rounded-[11px] bg-background hover:bg-surface text-white text-sm font-semibold transition-all">
                  Create My AI Plan
                  <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-surface/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3 animate-in fade-in">
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-muted hover:text-white rounded-lg hover:bg-white/5"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-muted hover:text-white rounded-lg hover:bg-white/5"
          >
            AI Engine
          </a>
          <a
            href="#workouts"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-muted hover:text-white rounded-lg hover:bg-white/5"
          >
            Workouts
          </a>
          <a
            href="#nutrition"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-muted hover:text-white rounded-lg hover:bg-white/5"
          >
            Nutrition
          </a>
          <div className="pt-4 border-t border-white/10 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-semibold"
                >
                  <Sparkles className="w-4 h-4" /> Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm text-muted hover:text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 text-center text-sm font-medium text-muted hover:text-white"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 text-center bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl"
                >
                  Create My AI Plan
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
