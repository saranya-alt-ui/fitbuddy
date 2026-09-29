import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BrainCircuit,
  Dumbbell,
  UtensilsCrossed,
  LineChart,
  Bot,
  UserCheck,
  Settings,
  LogOut,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Sidebar: React.FC = () => {
  const { user, logout, isDemoAiMode } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "AI Plan", path: "/plan", icon: BrainCircuit, badge: "Gemini" },
    { label: "Workout", path: "/workouts", icon: Dumbbell },
    { label: "Nutrition", path: "/nutrition", icon: UtensilsCrossed },
    { label: "Progress", path: "/progress", icon: LineChart },
    { label: "AI Coach", path: "/coach", icon: Bot, highlight: true },
    { label: "Profile", path: "/profile", icon: UserCheck },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-surface/90 border-r border-white/5 h-screen sticky top-0 backdrop-blur-xl z-40 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-glow-primary">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white font-['JetBrains_Mono']">
                FIT<span className="text-primary-light">BUDDY</span>
              </span>
              <span className="bg-primary/20 text-primary-light text-[9px] font-bold px-1.5 py-0.5 rounded border border-primary/30 uppercase">
                AI
              </span>
            </div>
            <p className="text-[10px] text-muted -mt-0.5">Your Personal AI Coach</p>
          </div>
        </NavLink>
      </div>

      {/* Demo AI Mode banner */}
      {isDemoAiMode && (
        <div className="mx-4 mt-4 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <div>
            <span className="font-bold">Demo AI Mode</span>
            <p className="text-[10px] text-amber-300/80 leading-tight">Key optional in .env</p>
          </div>
        </div>
      )}

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/20 text-white border border-primary/40 shadow-glow-primary/30"
                    : "text-muted hover:text-white hover:bg-white/5"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary/30 text-primary-light border border-primary/40">
                  {item.badge}
                </span>
              )}
              {item.highlight && (
                <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#22C55E]" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User profile & Logout */}
      <div className="p-4 border-t border-white/5 bg-background/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-sm text-white shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate">{user?.name || "Fitness User"}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-2 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
