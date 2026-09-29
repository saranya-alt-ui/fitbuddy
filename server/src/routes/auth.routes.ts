import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { storage } from "../db/storage.js";
import { RegisterSchema, LoginSchema } from "../types/index.js";
import { authRateLimiter } from "../middleware/rateLimit.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Register new user
router.post("/register", authRateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = RegisterSchema.parse(req.body);

    const existingUser = await storage.findUserByEmail(validated.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists. Please log in.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    const user = await storage.createUser({
      name: validated.name,
      email: validated.email,
      passwordHash,
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully! Welcome to FitBuddy.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login existing user
router.post("/login", authRateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = LoginSchema.parse(req.body);

    const user = await storage.findUserByEmail(validated.email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please verify your credentials.",
      });
    }

    const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please verify your credentials.",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Welcome back!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Logout endpoint
router.post("/logout", (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

// Get current user profile
router.get("/me", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await storage.findUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const profile = await storage.getFitnessProfileByUserId(user.id);

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      hasProfile: !!profile,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
