import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { FloatingChat } from "../chat/FloatingChat";

export const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent animate-spin flex items-center justify-center shadow-glow-primary">
          <div className="w-6 h-6 rounded-md bg-background" />
        </div>
        <p className="mt-4 text-sm font-medium text-muted animate-pulse">
          Loading FitBuddy Workspace...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background text-white selection:bg-primary selection:text-white">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0 overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating AI Coach Chat */}
      <FloatingChat />
    </div>
  );
};
