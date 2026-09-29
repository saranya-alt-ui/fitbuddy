export interface User {
  id: string;
  name: string;
  email: string;
}

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
  id?: string;
  userId?: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number;
  weight: number;
  goal: FitnessGoal;
  experience: ExperienceLevel;
  equipment: EquipmentOption;
  workoutDays: number;
  workoutDuration: number;
  activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active";
  sleepHours: number;
  stressLevel: "low" | "moderate" | "high";
  diet: DietType;
  preferences?: {
    likedFoods?: string[];
    avoidedFoods?: string[];
    injuries?: string;
    limitations?: string;
    workoutPreferences?: string;
  };
}

export interface Exercise {
  id?: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  instructions: string;
  completed?: boolean;
}

export interface WorkoutDay {
  id?: string;
  day: string;
  focus: string;
  duration: number;
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
  completed?: boolean;
}

export interface Meal {
  meal: string;
  foods: string[];
  estimatedCalories: number;
  protein: number;
  carbohydrates?: number;
  fat?: number;
}

export interface AIPlanContent {
  summary: string;
  goal: string;
  weeklySchedule: {
    day: string;
    activity: string;
    isRestDay: boolean;
  }[];
  workouts: WorkoutDay[];
  nutrition: Meal[];
  recovery: string[];
  tips: string[];
}

export interface WorkoutSession {
  id: string;
  userId: string;
  planId: string;
  dayName: string;
  focus: string;
  duration: number;
  completed: boolean;
  completedAt?: string | null;
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

export interface ProgressEntry {
  id: string;
  userId: string;
  weight: number;
  waist?: number | null;
  notes?: string | null;
  recordedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  message: string;
  createdAt: string;
}
