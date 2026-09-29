import { z } from "zod";

// ==========================================
// User & Auth Types
// ==========================================
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUserPayload {
  id: string;
  email: string;
  name: string;
}

// ==========================================
// Fitness Assessment & Profile Types
// ==========================================
export type FitnessGoal =
  | "Fat Loss"
  | "Muscle Gain"
  | "Strength"
  | "General Fitness"
  | "Endurance"
  | "Maintain Weight";

export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export type EquipmentOption =
  | "No Equipment"
  | "Bodyweight"
  | "Dumbbells"
  | "Resistance Bands"
  | "Home Gym"
  | "Full Gym";

export type DietType =
  | "Vegetarian"
  | "Non-Vegetarian"
  | "Vegan"
  | "Eggetarian"
  | "Indian Diet"
  | "Custom";

export interface FitnessProfile {
  id: string;
  userId: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number; // in cm
  weight: number; // in kg
  goal: FitnessGoal;
  experience: ExperienceLevel;
  equipment: EquipmentOption;
  workoutDays: number; // days per week
  workoutDuration: number; // minutes per session
  activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active";
  sleepHours: number;
  stressLevel: "low" | "moderate" | "high";
  diet: DietType;
  preferences: {
    likedFoods?: string[];
    avoidedFoods?: string[];
    injuries?: string;
    limitations?: string;
    workoutPreferences?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// AI Plan Structured Schema
// ==========================================
export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  instructions: string;
  completed?: boolean;
}

export interface WorkoutDay {
  day: string; // e.g., "Monday"
  focus: string; // e.g., "Upper Body Strength"
  duration: number; // minutes
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
}

export interface Meal {
  meal: string; // e.g., "Breakfast", "Lunch", "Snack", "Dinner"
  foods: string[];
  estimatedCalories: number;
  protein: number; // grams
  carbohydrates?: number; // grams
  fat?: number; // grams
}

export interface AIPlanContent {
  summary: string;
  goal: string;
  weeklySchedule: {
    day: string;
    activity: string; // e.g., "Upper Body", "Cardio & Core", "Active Recovery"
    isRestDay: boolean;
  }[];
  workouts: WorkoutDay[];
  nutrition: Meal[];
  recovery: string[];
  tips: string[];
}

export interface AIPlanRecord {
  id: string;
  userId: string;
  planType: string;
  content: AIPlanContent;
  isActive: boolean;
  isDemo?: boolean;
  createdAt: Date;
}

// ==========================================
// Workout Tracking Types
// ==========================================
export interface WorkoutSession {
  id: string;
  userId: string;
  planId: string;
  dayName: string;
  focus: string;
  duration: number;
  completed: boolean;
  completedAt?: Date | null;
  exercises: {
    id: string;
    name: string;
    sets: number;
    reps: string;
    rest: string;
    instructions: string;
    completed: boolean;
  }[];
}

// ==========================================
// Progress Entry Types
// ==========================================
export interface ProgressEntry {
  id: string;
  userId: string;
  weight: number;
  waist?: number | null;
  notes?: string | null;
  recordedAt: Date;
}

// ==========================================
// Chat Message Types
// ==========================================
export interface ChatMessage {
  id: string;
  userId: string;
  role: "user" | "assistant";
  message: string;
  createdAt: Date;
}

// ==========================================
// Zod Schemas for Validation
// ==========================================
export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const FitnessProfileSchema = z.object({
  age: z.number().int().min(14, "Minimum age is 14").max(100, "Maximum age is 100"),
  gender: z.enum(["male", "female", "other"]),
  height: z.number().min(80, "Height must be at least 80 cm").max(260, "Height must be under 260 cm"),
  weight: z.number().min(30, "Weight must be at least 30 kg").max(300, "Weight must be under 300 kg"),
  goal: z.enum(["Fat Loss", "Muscle Gain", "Strength", "General Fitness", "Endurance", "Maintain Weight"]),
  experience: z.enum(["Beginner", "Intermediate", "Advanced"]),
  equipment: z.enum(["No Equipment", "Bodyweight", "Dumbbells", "Resistance Bands", "Home Gym", "Full Gym"]),
  workoutDays: z.number().int().min(1).max(7),
  workoutDuration: z.number().int().min(15).max(180),
  activityLevel: z.enum(["sedentary", "lightly_active", "moderately_active", "very_active"]),
  sleepHours: z.number().min(3).max(16),
  stressLevel: z.enum(["low", "moderate", "high"]),
  diet: z.enum(["Vegetarian", "Non-Vegetarian", "Vegan", "Eggetarian", "Indian Diet", "Custom"]),
  preferences: z.object({
    likedFoods: z.array(z.string()).optional(),
    avoidedFoods: z.array(z.string()).optional(),
    injuries: z.string().optional(),
    limitations: z.string().optional(),
    workoutPreferences: z.string().optional(),
  }).optional().default({}),
});

export const ProgressEntrySchema = z.object({
  weight: z.number().min(30).max(300),
  waist: z.number().min(30).max(250).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export const ChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(1000),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ).optional().default([]),
});
