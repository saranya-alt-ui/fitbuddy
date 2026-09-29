import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LandingPage } from "./pages/landing/LandingPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { AssessmentPage } from "./pages/assessment/AssessmentPage";
import { ProtectedLayout } from "./components/layout/ProtectedLayout";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { AIPlanPage } from "./pages/plan/AIPlanPage";
import { WorkoutPage } from "./pages/workout/WorkoutPage";
import { NutritionPage } from "./pages/nutrition/NutritionPage";
import { ProgressPage } from "./pages/progress/ProgressPage";
import { AICoachPage } from "./pages/chat/AICoachPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { SettingsPage } from "./pages/settings/SettingsPage";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />

          {/* Protected Dashboard Workspace Routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/plan" element={<AIPlanPage />} />
            <Route path="/workouts" element={<WorkoutPage />} />
            <Route path="/nutrition" element={<NutritionPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/coach" element={<AICoachPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
