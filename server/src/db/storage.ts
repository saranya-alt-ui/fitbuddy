import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db, isDbConnected, memoryStore } from "./index.js";
import {
  users,
  fitnessProfiles,
  aiPlans,
  workoutSessions,
  workoutExercises,
  mealPlans,
  progressEntries,
  chatMessages,
} from "./schema.js";
import {
  User,
  FitnessProfile,
  AIPlanContent,
  WorkoutSession,
  ProgressEntry,
  ChatMessage,
} from "../types/index.js";

// Helper for UUID generation
function generateId(): string {
  return randomUUID();
}

export class StorageService {
  // ==========================================
  // User Management
  // ==========================================
  async findUserByEmail(email: string): Promise<User | null> {
    const cleanEmail = email.toLowerCase().trim();
    if (isDbConnected && db) {
      try {
        const rows = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
        if (rows.length > 0) {
          const row = rows[0];
          return {
            id: row.id,
            name: row.name,
            email: row.email,
            passwordHash: row.passwordHash,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
          };
        }
      } catch (err) {
        console.error("DB error in findUserByEmail, using fallback:", err);
      }
    }
    // Fallback in-memory
    for (const user of memoryStore.users.values()) {
      if (user.email.toLowerCase() === cleanEmail) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id: string): Promise<User | null> {
    if (isDbConnected && db) {
      try {
        const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
        if (rows.length > 0) {
          const row = rows[0];
          return {
            id: row.id,
            name: row.name,
            email: row.email,
            passwordHash: row.passwordHash,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
          };
        }
      } catch (err) {
        console.error("DB error in findUserById, using fallback:", err);
      }
    }
    return memoryStore.users.get(id) || null;
  }

  async createUser(data: { name: string; email: string; passwordHash: string }): Promise<User> {
    const id = generateId();
    const newUser: User = {
      id,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash: data.passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isDbConnected && db) {
      try {
        await db.insert(users).values({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          passwordHash: newUser.passwordHash,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        });
      } catch (err) {
        console.error("DB error in createUser, saving in memory:", err);
      }
    }

    memoryStore.users.set(newUser.id, newUser);
    return newUser;
  }

  // ==========================================
  // Fitness Profile
  // ==========================================
  async saveFitnessProfile(userId: string, profileData: any): Promise<FitnessProfile> {
    const existing = await this.getFitnessProfileByUserId(userId);
    const id = existing ? existing.id : generateId();

    const profile: FitnessProfile = {
      id,
      userId,
      age: profileData.age,
      gender: profileData.gender,
      height: profileData.height,
      weight: profileData.weight,
      goal: profileData.goal,
      experience: profileData.experience,
      equipment: profileData.equipment,
      workoutDays: profileData.workoutDays,
      workoutDuration: profileData.workoutDuration,
      diet: profileData.diet,
      activityLevel: profileData.activityLevel,
      sleepHours: profileData.sleepHours,
      stressLevel: profileData.stressLevel || "moderate",
      preferences: profileData.preferences || {},
      createdAt: existing ? existing.createdAt : new Date(),
      updatedAt: new Date(),
    };

    if (isDbConnected && db) {
      try {
        if (existing) {
          await db
            .update(fitnessProfiles)
            .set({
              age: profile.age,
              gender: profile.gender,
              height: profile.height.toString() as any,
              weight: profile.weight.toString() as any,
              goal: profile.goal,
              experience: profile.experience,
              equipment: profile.equipment,
              workoutDays: profile.workoutDays,
              workoutDuration: profile.workoutDuration,
              diet: profile.diet,
              activityLevel: profile.activityLevel,
              sleepHours: profile.sleepHours.toString() as any,
              stressLevel: profile.stressLevel,
              preferences: profile.preferences,
              updatedAt: profile.updatedAt,
            })
            .where(eq(fitnessProfiles.userId, userId));
        } else {
          await db.insert(fitnessProfiles).values({
            id: profile.id,
            userId: profile.userId,
            age: profile.age,
            gender: profile.gender,
            height: profile.height.toString() as any,
            weight: profile.weight.toString() as any,
            goal: profile.goal,
            experience: profile.experience,
            equipment: profile.equipment,
            workoutDays: profile.workoutDays,
            workoutDuration: profile.workoutDuration,
            diet: profile.diet,
            activityLevel: profile.activityLevel,
            sleepHours: profile.sleepHours.toString() as any,
            stressLevel: profile.stressLevel,
            preferences: profile.preferences,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
          });
        }
      } catch (err) {
        console.error("DB error in saveFitnessProfile:", err);
      }
    }

    memoryStore.profiles.set(userId, profile);
    return profile;
  }

  async getFitnessProfileByUserId(userId: string): Promise<FitnessProfile | null> {
    if (isDbConnected && db) {
      try {
        const rows = await db
          .select()
          .from(fitnessProfiles)
          .where(eq(fitnessProfiles.userId, userId))
          .limit(1);
        if (rows.length > 0) {
          const row = rows[0];
          return {
            id: row.id,
            userId: row.userId,
            age: row.age,
            gender: row.gender as any,
            height: Number(row.height),
            weight: Number(row.weight),
            goal: row.goal as any,
            experience: row.experience as any,
            equipment: row.equipment as any,
            workoutDays: row.workoutDays,
            workoutDuration: row.workoutDuration,
            diet: row.diet as any,
            activityLevel: row.activityLevel as any,
            sleepHours: Number(row.sleepHours),
            stressLevel: row.stressLevel as any,
            preferences: (row.preferences as any) || {},
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
          };
        }
      } catch (err) {
        console.error("DB error in getFitnessProfileByUserId:", err);
      }
    }
    return memoryStore.profiles.get(userId) || null;
  }

  // ==========================================
  // AI Plan Storage
  // ==========================================
  async saveAiPlan(userId: string, content: AIPlanContent, isDemo = false): Promise<string> {
    const planId = generateId();

    if (isDbConnected && db) {
      try {
        // Set existing active plans to false
        await db
          .update(aiPlans)
          .set({ isActive: false })
          .where(eq(aiPlans.userId, userId));

        // Insert new active plan
        await db.insert(aiPlans).values({
          id: planId,
          userId,
          planType: "comprehensive",
          content: content as any,
          isActive: true,
          createdAt: new Date(),
        });
      } catch (err) {
        console.error("DB error in saveAiPlan:", err);
      }
    }

    // Save in memory
    memoryStore.plans.set(planId, {
      id: planId,
      userId,
      content,
      isActive: true,
      isDemo,
      createdAt: new Date(),
    });

    // Also populate workout sessions and meal plans from the generated content
    await this.syncWorkoutSessionsFromPlan(userId, planId, content.workouts);
    await this.syncMealPlansFromPlan(userId, planId, content.nutrition);

    return planId;
  }

  async getActivePlanByUserId(userId: string): Promise<any | null> {
    if (isDbConnected && db) {
      try {
        const rows = await db
          .select()
          .from(aiPlans)
          .where(eq(aiPlans.userId, userId))
          .orderBy(desc(aiPlans.createdAt))
          .limit(1);

        if (rows.length > 0) {
          return {
            id: rows[0].id,
            userId: rows[0].userId,
            content: rows[0].content,
            isActive: rows[0].isActive,
            createdAt: rows[0].createdAt,
          };
        }
      } catch (err) {
        console.error("DB error in getActivePlanByUserId:", err);
      }
    }

    // Memory fallback
    for (const plan of memoryStore.plans.values()) {
      if (plan.userId === userId && plan.isActive) {
        return plan;
      }
    }
    return null;
  }

  // ==========================================
  // Workout Sessions & Completion Tracking
  // ==========================================
  private async syncWorkoutSessionsFromPlan(userId: string, planId: string, workouts: any[]) {
    if (!workouts || workouts.length === 0) return;

    for (const w of workouts) {
      const sessionId = generateId();
      const sessionObj: WorkoutSession = {
        id: sessionId,
        userId,
        planId,
        dayName: w.day,
        focus: w.focus,
        duration: w.duration || 45,
        completed: false,
        completedAt: null,
        exercises: (w.exercises || []).map((ex: any) => ({
          id: generateId(),
          name: ex.name,
          sets: ex.sets || 3,
          reps: ex.reps || "10-12",
          rest: ex.rest || "60s",
          instructions: ex.instructions || "",
          completed: false,
        })),
      };

      if (isDbConnected && db) {
        try {
          await db.insert(workoutSessions).values({
            id: sessionObj.id,
            userId,
            planId,
            dayName: sessionObj.dayName,
            focus: sessionObj.focus,
            duration: sessionObj.duration,
            completed: false,
            createdAt: new Date(),
          });

          for (const ex of sessionObj.exercises) {
            await db.insert(workoutExercises).values({
              id: ex.id,
              sessionId: sessionObj.id,
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.rest,
              instructions: ex.instructions,
              completed: false,
            });
          }
        } catch (err) {
          console.error("DB error syncing workout session:", err);
        }
      }

      memoryStore.workouts.set(sessionId, sessionObj);
    }
  }

  async getWorkoutsByUserId(userId: string): Promise<WorkoutSession[]> {
    if (isDbConnected && db) {
      try {
        const sessions = await db
          .select()
          .from(workoutSessions)
          .where(eq(workoutSessions.userId, userId))
          .orderBy(desc(workoutSessions.createdAt));

        const result: WorkoutSession[] = [];
        for (const s of sessions) {
          const exercises = await db
            .select()
            .from(workoutExercises)
            .where(eq(workoutExercises.sessionId, s.id));

          result.push({
            id: s.id,
            userId: s.userId,
            planId: s.planId || "",
            dayName: s.dayName,
            focus: s.focus,
            duration: s.duration,
            completed: s.completed,
            completedAt: s.completedAt,
            exercises: exercises.map((e: any) => ({
              id: e.id,
              name: e.name,
              sets: e.sets,
              reps: e.reps,
              rest: e.rest,
              instructions: e.instructions || "",
              completed: e.completed,
            })),
          });
        }
        if (result.length > 0) return result;
      } catch (err) {
        console.error("DB error in getWorkoutsByUserId:", err);
      }
    }

    const list: WorkoutSession[] = [];
    for (const s of memoryStore.workouts.values()) {
      if (s.userId === userId) {
        list.push(s);
      }
    }
    return list;
  }

  async toggleExerciseCompleted(exerciseId: string, completed: boolean): Promise<boolean> {
    if (isDbConnected && db) {
      try {
        await db
          .update(workoutExercises)
          .set({ completed })
          .where(eq(workoutExercises.id, exerciseId));
      } catch (err) {
        console.error("DB error in toggleExerciseCompleted:", err);
      }
    }

    // Memory update
    for (const session of memoryStore.workouts.values()) {
      const ex = session.exercises.find((e: any) => e.id === exerciseId);
      if (ex) {
        ex.completed = completed;
        // Check if all exercises in this session are completed
        const allCompleted = session.exercises.every((e: any) => e.completed);
        session.completed = allCompleted;
        session.completedAt = allCompleted ? new Date() : null;
        return true;
      }
    }
    return true;
  }

  async completeWorkoutSession(sessionId: string, completed: boolean): Promise<boolean> {
    const completedAt = completed ? new Date() : null;

    if (isDbConnected && db) {
      try {
        await db
          .update(workoutSessions)
          .set({ completed, completedAt })
          .where(eq(workoutSessions.id, sessionId));
      } catch (err) {
        console.error("DB error in completeWorkoutSession:", err);
      }
    }

    const session = memoryStore.workouts.get(sessionId);
    if (session) {
      session.completed = completed;
      session.completedAt = completedAt;
      session.exercises.forEach((e: any) => (e.completed = completed));
    }
    return true;
  }

  // ==========================================
  // Meal Plans
  // ==========================================
  private async syncMealPlansFromPlan(userId: string, planId: string, nutrition: any[]) {
    if (!nutrition || nutrition.length === 0) return;

    for (const m of nutrition) {
      const mealId = generateId();
      const mealData = {
        id: mealId,
        userId,
        planId,
        mealType: m.meal,
        foodItems: m.foods || [],
        calories: m.estimatedCalories || 0,
        protein: m.protein || 0,
        carbs: m.carbohydrates || 0,
        fat: m.fat || 0,
        createdAt: new Date(),
      };

      if (isDbConnected && db) {
        try {
          await db.insert(mealPlans).values({
            id: mealData.id,
            userId,
            planId,
            mealType: mealData.mealType,
            foodItems: mealData.foodItems as any,
            calories: mealData.calories,
            protein: mealData.protein,
            carbs: mealData.carbs,
            fat: mealData.fat,
            createdAt: new Date(),
          });
        } catch (err) {
          console.error("DB error syncing meal plan:", err);
        }
      }

      memoryStore.meals.set(mealId, mealData);
    }
  }

  async getMealPlansByUserId(userId: string): Promise<any[]> {
    if (isDbConnected && db) {
      try {
        const rows = await db
          .select()
          .from(mealPlans)
          .where(eq(mealPlans.userId, userId))
          .orderBy(desc(mealPlans.createdAt));
        if (rows.length > 0) return rows;
      } catch (err) {
        console.error("DB error in getMealPlansByUserId:", err);
      }
    }

    const list: any[] = [];
    for (const m of memoryStore.meals.values()) {
      if (m.userId === userId) list.push(m);
    }
    return list;
  }

  // ==========================================
  // Progress Entries
  // ==========================================
  async addProgressEntry(userId: string, data: { weight: number; waist?: number | null; notes?: string | null }): Promise<ProgressEntry> {
    const entry: ProgressEntry = {
      id: generateId(),
      userId,
      weight: data.weight,
      waist: data.waist || null,
      notes: data.notes || null,
      recordedAt: new Date(),
    };

    if (isDbConnected && db) {
      try {
        await db.insert(progressEntries).values({
          id: entry.id,
          userId,
          weight: entry.weight.toString() as any,
          waist: entry.waist ? (entry.waist.toString() as any) : null,
          notes: entry.notes,
          recordedAt: entry.recordedAt,
        });
      } catch (err) {
        console.error("DB error in addProgressEntry:", err);
      }
    }

    const userEntries = memoryStore.progress.get(userId) || [];
    userEntries.unshift(entry);
    memoryStore.progress.set(userId, userEntries);

    return entry;
  }

  async getProgressEntriesByUserId(userId: string): Promise<ProgressEntry[]> {
    if (isDbConnected && db) {
      try {
        const rows = await db
          .select()
          .from(progressEntries)
          .where(eq(progressEntries.userId, userId))
          .orderBy(desc(progressEntries.recordedAt));
        if (rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            userId: r.userId,
            weight: Number(r.weight),
            waist: r.waist ? Number(r.waist) : null,
            notes: r.notes,
            recordedAt: r.recordedAt,
          }));
        }
      } catch (err) {
        console.error("DB error in getProgressEntriesByUserId:", err);
      }
    }

    return memoryStore.progress.get(userId) || [];
  }

  // ==========================================
  // Chat History
  // ==========================================
  async saveChatMessage(userId: string, role: "user" | "assistant", message: string): Promise<ChatMessage> {
    const chatMsg: ChatMessage = {
      id: generateId(),
      userId,
      role,
      message,
      createdAt: new Date(),
    };

    if (isDbConnected && db) {
      try {
        await db.insert(chatMessages).values({
          id: chatMsg.id,
          userId,
          role,
          message,
          createdAt: chatMsg.createdAt,
        });
      } catch (err) {
        console.error("DB error in saveChatMessage:", err);
      }
    }

    const history = memoryStore.chat.get(userId) || [];
    history.push(chatMsg);
    // Keep last 50 messages
    if (history.length > 50) history.shift();
    memoryStore.chat.set(userId, history);

    return chatMsg;
  }

  async getChatHistoryByUserId(userId: string): Promise<ChatMessage[]> {
    if (isDbConnected && db) {
      try {
        const rows = await db
          .select()
          .from(chatMessages)
          .where(eq(chatMessages.userId, userId))
          .orderBy(chatMessages.createdAt);
        if (rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            userId: r.userId,
            role: r.role as any,
            message: r.message,
            createdAt: r.createdAt,
          }));
        }
      } catch (err) {
        console.error("DB error in getChatHistoryByUserId:", err);
      }
    }

    return memoryStore.chat.get(userId) || [];
  }
}

export const storage = new StorageService();
