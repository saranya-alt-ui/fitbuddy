import axios from "axios";
import { FitnessProfile, AIPlanContent, ProgressEntry } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fitbuddy_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle session expirations
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.expired) {
      localStorage.removeItem("fitbuddy_token");
      localStorage.removeItem("fitbuddy_user");
      window.location.href = "/login?expired=true";
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),

  // Profile
  getProfile: () => api.get("/profile"),
  saveProfile: (profile: Partial<FitnessProfile>) => api.post("/profile", profile),

  // AI Plans & Coach
  generatePlan: (profile?: Partial<FitnessProfile>) => api.post("/ai/generate-plan", profile || {}),
  regeneratePlan: () => api.post("/ai/regenerate-plan"),
  getCurrentPlan: () => api.get("/ai/current-plan"),
  chat: (message: string, history: any[] = []) => api.post("/ai/chat", { message, history }),
  getChatHistory: () => api.get("/ai/chat-history"),

  // Workouts
  getWorkouts: () => api.get("/workouts"),
  completeWorkout: (id: string, completed: boolean) => api.post(`/workouts/${id}/complete`, { completed }),
  toggleExercise: (exerciseId: string, completed: boolean) =>
    api.post(`/workouts/exercise/${exerciseId}/toggle`, { completed }),

  // Nutrition
  getNutrition: () => api.get("/nutrition"),
  regenerateNutrition: () => api.post("/nutrition/regenerate"),

  // Progress
  getProgress: () => api.get("/progress"),
  addProgress: (data: { weight: number; waist?: number | null; notes?: string | null }) =>
    api.post("/progress", data),

  // System
  getHealth: () => api.get("/health"),
};
