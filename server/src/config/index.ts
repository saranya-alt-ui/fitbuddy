import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  databaseUrl: process.env.DATABASE_URL || "mysql://root:password@localhost:3306/fitbuddy",
  jwtSecret: process.env.JWT_SECRET || "fitbuddy_default_super_secret_jwt_key_2026",
  geminiApiKey: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  nodeEnv: process.env.NODE_ENV || "development",
  isDemoAiMode: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === "" || process.env.GEMINI_API_KEY === "your_gemini_api_key_here",
};
