import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema.js";
import { config } from "../config/index.js";

// MySQL connection pool
export let pool: mysql.Pool | null = null;
export let db: any = null;
export let isDbConnected = false;

// Initialize MySQL pool and Drizzle
export async function initDb() {
  try {
    pool = mysql.createPool({
      uri: config.databaseUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Test connection with a quick ping
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    db = drizzle(pool, { schema, mode: "default" });
    isDbConnected = true;
    console.log("✅ MySQL Database connected successfully with Drizzle ORM.");
  } catch (error: any) {
    isDbConnected = false;
    console.warn("⚠️ MySQL not available at", config.databaseUrl);
    console.warn("ℹ️ Running with FitBuddy In-Memory Resilient Storage so features are 100% testable.");
  }
}

// In-Memory fallback store for resilient zero-fail local testing if MySQL is not started
export const memoryStore = {
  users: new Map<string, any>(),
  profiles: new Map<string, any>(),
  plans: new Map<string, any>(),
  workouts: new Map<string, any>(),
  exercises: new Map<string, any>(),
  meals: new Map<string, any>(),
  progress: new Map<string, any[]>(), // userId -> list of entries
  chat: new Map<string, any[]>(),     // userId -> list of messages
};
