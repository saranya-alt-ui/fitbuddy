import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("❌ Handled Exception:", err.message || err);

  // Zod Validation Errors
  if (err instanceof ZodError) {
    const issues = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation failed. Please verify your inputs.",
      errors: issues,
    });
  }

  // Rate Limiting Errors
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please wait a moment before trying again.",
    });
  }

  // Gemini API Errors
  if (err.isAiError) {
    return res.status(503).json({
      success: false,
      message: "FitBuddy AI is having trouble generating your plan right now. Please try again shortly.",
      detail: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // Default internal server error
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected error occurred. Please try again.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
