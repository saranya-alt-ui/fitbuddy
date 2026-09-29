import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/index.js";
import { initDb, isDbConnected } from "./db/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

// Import route modules
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import nutritionRoutes from "./routes/nutrition.routes.js";
import progressRoutes from "./routes/progress.routes.js";

const app = express();

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Vite client scripts in local development
  })
);

app.use(
  cors({
    origin: [config.clientUrl, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Health Check / System Status
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    name: "FitBuddy AI Platform API",
    version: "1.0.0",
    database: isDbConnected ? "mysql-connected" : "resilient-in-memory-fallback",
    aiMode: config.isDemoAiMode ? "demo-mode" : "google-gemini-live",
    geminiModel: config.geminiModel,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/progress", progressRoutes);

// 404 Handler for unknown API endpoints
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start server
async function startServer() {
  await initDb();

  app.listen(config.port, () => {
    console.log("==================================================");
    console.log(`🚀 FitBuddy API Server running on port ${config.port}`);
    console.log(`📡 URL: http://localhost:${config.port}`);
    console.log(`🛡️ AI Mode: ${config.isDemoAiMode ? "Demo AI Mode (No Key Set)" : "Google Gemini Live"}`);
    console.log("==================================================");
  });
}

startServer();

export default app;
