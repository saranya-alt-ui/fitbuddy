import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { storage } from "../db/storage.js";
import { FitnessProfileSchema } from "../types/index.js";

const router = Router();

// Protect all profile routes
router.use(authMiddleware);

// Get user fitness profile
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await storage.getFitnessProfileByUserId(req.user!.id);
    return res.json({
      success: true,
      profile: profile || null,
    });
  } catch (error) {
    next(error);
  }
});

// Create or update fitness profile
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = FitnessProfileSchema.parse(req.body);
    const saved = await storage.saveFitnessProfile(req.user!.id, validated);

    return res.status(201).json({
      success: true,
      message: "Fitness profile updated successfully.",
      profile: saved,
    });
  } catch (error) {
    next(error);
  }
});

// PUT alias
router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = FitnessProfileSchema.parse(req.body);
    const saved = await storage.saveFitnessProfile(req.user!.id, validated);

    return res.json({
      success: true,
      message: "Fitness profile updated successfully.",
      profile: saved,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
