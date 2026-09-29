import rateLimit from "express-rate-limit";

// Rate limiter for authentication routes (login / register)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
});

// Rate limiter for AI plan generation routes
export const aiRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 15, // 15 plan generations per 5 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "FitBuddy AI generation limit reached. Please wait a few minutes before generating another plan.",
  },
});

// Rate limiter for general chat
export const chatRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "You're chatting quite fast! Please pause for a moment.",
  },
});
