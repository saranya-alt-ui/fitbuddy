import { mysqlTable, varchar, text, int, decimal, timestamp, boolean, json } from "drizzle-orm/mysql-core";

// 1. Users Table
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// 2. Fitness Profiles Table
export const fitnessProfiles = mysqlTable("fitness_profiles", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  age: int("age").notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  height: decimal("height", { precision: 5, scale: 2 }).notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(),
  goal: varchar("goal", { length: 50 }).notNull(),
  experience: varchar("experience", { length: 30 }).notNull(),
  equipment: varchar("equipment", { length: 50 }).notNull(),
  workoutDays: int("workout_days").notNull(),
  workoutDuration: int("workout_duration").notNull(),
  diet: varchar("diet", { length: 50 }).notNull(),
  activityLevel: varchar("activity_level", { length: 50 }).notNull(),
  sleepHours: decimal("sleep_hours", { precision: 3, scale: 1 }).notNull(),
  stressLevel: varchar("stress_level", { length: 20 }).default("moderate").notNull(),
  preferences: json("preferences"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// 3. AI Plans Table
export const aiPlans = mysqlTable("ai_plans", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  planType: varchar("plan_type", { length: 50 }).default("comprehensive").notNull(),
  content: json("content").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Workout Sessions Table
export const workoutSessions = mysqlTable("workout_sessions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: varchar("plan_id", { length: 36 }).references(() => aiPlans.id, { onDelete: "cascade" }),
  dayName: varchar("day_name", { length: 20 }).notNull(),
  focus: varchar("focus", { length: 100 }).notNull(),
  duration: int("duration").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. Workout Exercises Table
export const workoutExercises = mysqlTable("workout_exercises", {
  id: varchar("id", { length: 36 }).primaryKey(),
  sessionId: varchar("session_id", { length: 36 }).notNull().references(() => workoutSessions.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 150 }).notNull(),
  sets: int("sets").notNull(),
  reps: varchar("reps", { length: 50 }).notNull(),
  rest: varchar("rest", { length: 50 }).notNull(),
  instructions: text("instructions"),
  completed: boolean("completed").default(false).notNull(),
});

// 6. Meal Plans Table
export const mealPlans = mysqlTable("meal_plans", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: varchar("plan_id", { length: 36 }).references(() => aiPlans.id, { onDelete: "cascade" }),
  mealType: varchar("meal_type", { length: 30 }).notNull(),
  foodItems: json("food_items").notNull(),
  calories: int("calories").notNull(),
  protein: int("protein").notNull(),
  carbs: int("carbs").default(0),
  fat: int("fat").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 7. Progress Entries Table
export const progressEntries = mysqlTable("progress_entries", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(),
  waist: decimal("waist", { precision: 5, scale: 2 }),
  notes: text("notes"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

// 8. Chat Messages Table
export const chatMessages = mysqlTable("chat_messages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull(), // 'user' or 'assistant'
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
