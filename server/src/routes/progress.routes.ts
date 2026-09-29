import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { storage } from "../db/storage.js";
import { ProgressEntrySchema } from "../types/index.js";

const router = Router();

router.use(authMiddleware);

// Get progress history
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entries = await storage.getProgressEntriesByUserId(req.user!.id);
    return res.json({
      success: true,
      entries,
    });
  } catch (error) {
    next(error);
  }
});

// Add new progress entry
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = ProgressEntrySchema.parse(req.body);
    const entry = await storage.addProgressEntry(req.user!.id, validated);

    return res.status(201).json({
      success: true,
      message: "Progress metric recorded successfully!",
      entry,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
