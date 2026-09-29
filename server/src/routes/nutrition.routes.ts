import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { storage } from "../db/storage.js";
import { geminiService } from "../services/gemini.service.js";

const router = Router();

router.use(authMiddleware);

// Get meal plans
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const meals = await storage.getMealPlansByUserId(req.user!.id);
    const activePlan = await storage.getActivePlanByUserId(req.user!.id);

    return res.json({
      success: true,
      meals: meals.length > 0 ? meals : (activePlan?.content?.nutrition || []),
      isDemo: activePlan?.isDemo || false,
    });
  } catch (error) {
    next(error);
  }
});

// Regenerate meal plan
router.post("/regenerate", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await storage.getFitnessProfileByUserId(req.user!.id);
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "Fitness profile not found. Please complete assessment first.",
      });
    }

    const { plan, isDemo } = await geminiService.generateFitnessPlan(profile);
    const planId = await storage.saveAiPlan(req.user!.id, plan, isDemo);

    return res.json({
      success: true,
      message: "Meal plan refreshed successfully!",
      meals: plan.nutrition,
      isDemo,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
