import { migrate } from "drizzle-orm/mysql2/migrator";
import { db, pool, initDb } from "./index.js";

async function runMigrations() {
  console.log("⏳ Initializing database connection for migrations...");
  await initDb();

  if (!db || !pool) {
    console.warn("⚠️ MySQL database not currently reachable. Skipping physical schema migration.");
    process.exit(0);
  }

  try {
    console.log("⏳ Running Drizzle migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Drizzle migrations executed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    if (pool) await pool.end();
    process.exit(0);
  }
}

runMigrations();
