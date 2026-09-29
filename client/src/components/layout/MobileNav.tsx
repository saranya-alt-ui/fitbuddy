import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BrainCircuit, Dumbbell, UtensilsCrossed, Bot, LineChart } from "lucide-react";

export const MobileNav: React.FC = () => {
  const items = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Plan", path: "/plan", icon: BrainCircuit },
    { label: "Workout", path: "/workouts", icon: Dumbbell },
    { label: "Nutrition", path: "/nutrition", icon: UtensilsCrossed },
    { label: "Coach", path: "/coach", icon: Bot },
    { label: "Progress", path: "/progress", icon: LineChart },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2.5 rounded-xl text-[11px] font-medium transition-all ${
                isActive
                  ? "text-primary-light font-bold"
                  : "text-muted hover:text-white"
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
