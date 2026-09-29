import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { aiRateLimiter, chatRateLimiter } from "../middleware/rateLimit.middleware.js";
import { storage } from "../db/storage.js";
import { geminiService } from "../services/gemini.service.js";
import { ChatRequestSchema, FitnessProfileSchema } from "../types/index.js";

const router = Router();

// Protect all AI routes with JWT
router.use(authMiddleware);

// Generate new AI fitness & nutrition plan
router.post("/generate-plan", aiRateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    let profile = await storage.getFitnessProfileByUserId(userId);

    // If profile sent in request body, save it first
    if (req.body && Object.keys(req.body).length > 0 && req.body.goal) {
      const validated = FitnessProfileSchema.parse(req.body);
      profile = await storage.saveFitnessProfile(userId, validated);
    }

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "Please complete your fitness assessment profile before generating a plan.",
      });
    }

    const { plan, isDemo } = await geminiService.generateFitnessPlan(profile);
    const planId = await storage.saveAiPlan(userId, plan, isDemo);

    return res.status(201).json({
      success: true,
      message: "AI Fitness Plan generated successfully!",
      planId,
      plan,
      isDemo,
    });
  } catch (error) {
    next(error);
  }
});

// Regenerate plan
router.post("/regenerate-plan", aiRateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const profile = await storage.getFitnessProfileByUserId(userId);

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "No fitness profile found. Please complete the assessment first.",
      });
    }

    const { plan, isDemo } = await geminiService.generateFitnessPlan(profile);
    const planId = await storage.saveAiPlan(userId, plan, isDemo);

    return res.json({
      success: true,
      message: "AI Fitness Plan regenerated successfully!",
      planId,
      plan,
      isDemo,
    });
  } catch (error) {
    next(error);
  }
});

// Get current active plan
router.get("/current-plan", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const activePlan = await storage.getActivePlanByUserId(userId);

    return res.json({
      success: true,
      plan: activePlan ? activePlan.content : null,
      planId: activePlan ? activePlan.id : null,
      isDemo: activePlan ? activePlan.isDemo : false,
      createdAt: activePlan ? activePlan.createdAt : null,
    });
  } catch (error) {
    next(error);
  }
});

// Conversational AI Fitness Chat
router.post("/chat", chatRateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const validated = ChatRequestSchema.parse(req.body);

    const profile = await storage.getFitnessProfileByUserId(userId);

    // Save user message in DB
    await storage.saveChatMessage(userId, "user", validated.message);

    // Call Gemini
    const { reply, isDemo } = await geminiService.chatWithCoach(
      validated.message,
      validated.history,
      profile
    );

    // Save AI response in DB
    await storage.saveChatMessage(userId, "assistant", reply);

    return res.json({
      success: true,
      reply,
      isDemo,
    });
  } catch (error) {
    next(error);
  }
});

// Get chat history
router.get("/chat-history", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const history = await storage.getChatHistoryByUserId(userId);
    return res.json({
      success: true,
      history,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
