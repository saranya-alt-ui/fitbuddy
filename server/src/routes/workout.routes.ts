import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { storage } from "../db/storage.js";

const router = Router();

router.use(authMiddleware);

// Get all workout sessions for current user
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workouts = await storage.getWorkoutsByUserId(req.user!.id);
    return res.json({
      success: true,
      workouts,
    });
  } catch (error) {
    next(error);
  }
});

// Mark full workout session as complete or incomplete
router.post("/:id/complete", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const completed = req.body.completed !== undefined ? Boolean(req.body.completed) : true;

    await storage.completeWorkoutSession(sessionId, completed);

    return res.json({
      success: true,
      message: completed ? "Workout marked as completed! Outstanding work." : "Workout marked as incomplete.",
      completed,
    });
  } catch (error) {
    next(error);
  }
});

// Toggle individual exercise completion
router.post("/exercise/:id/toggle", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exerciseId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const completed = Boolean(req.body.completed);

    await storage.toggleExerciseCompleted(exerciseId, completed);

    return res.json({
      success: true,
      exerciseId,
      completed,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
