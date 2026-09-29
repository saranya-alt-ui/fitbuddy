import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import { config } from "../config/index.js";
import { FitnessProfile, AIPlanContent } from "../types/index.js";
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildChatSystemPrompt,
} from "./prompt.templates.js";
import { generateDemoPlan, generateDemoChatResponse } from "./demo.service.js";

// Helper to strip markdown code blocks and clean JSON
function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  // Strip ```json and ```
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

// Validate structure of parsed JSON
function validatePlanStructure(obj: any): obj is AIPlanContent {
  if (!obj || typeof obj !== "object") return false;
  if (typeof obj.summary !== "string") return false;
  if (typeof obj.goal !== "string") return false;
  if (!Array.isArray(obj.weeklySchedule)) return false;
  if (!Array.isArray(obj.workouts)) return false;
  if (!Array.isArray(obj.nutrition)) return false;
  if (!Array.isArray(obj.recovery)) return false;
  if (!Array.isArray(obj.tips)) return false;
  return true;
}

export class GeminiService {
  private genAiOfficial: GoogleGenAI | null = null;
  private genAiLegacy: GoogleGenerativeAI | null = null;

  constructor() {
    if (config.geminiApiKey) {
      try {
        this.genAiOfficial = new GoogleGenAI({ apiKey: config.geminiApiKey });
      } catch (e) {
        console.warn("Could not initialize @google/genai, falling back to @google/generative-ai:", e);
      }
      try {
        this.genAiLegacy = new GoogleGenerativeAI(config.geminiApiKey);
      } catch (e) {
        console.warn("Could not initialize @google/generative-ai:", e);
      }
    }
  }

  /**
   * Generates a personalized fitness plan using Gemini or Demo mode
   */
  async generateFitnessPlan(profile: FitnessProfile): Promise<{ plan: AIPlanContent; isDemo: boolean }> {
    // If no API key configured or explicitly in Demo Mode, return high quality tailored demo plan
    if (config.isDemoAiMode || (!this.genAiOfficial && !this.genAiLegacy)) {
      console.log("ℹ️ FitBuddy generating plan in Demo AI Mode.");
      return { plan: generateDemoPlan(profile), isDemo: true };
    }

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(profile);

    // Call Gemini with retry logic
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        let rawText = "";

        // Try @google/genai first
        if (this.genAiOfficial) {
          try {
            const response = await this.genAiOfficial.models.generateContent({
              model: config.geminiModel,
              contents: `${systemPrompt}\n\n${userPrompt}`,
              config: {
                responseMimeType: "application/json",
                temperature: 0.3,
              },
            });
            rawText = response.text || "";
          } catch (officialErr) {
            console.warn("Official GenAI SDK attempt failed, trying fallback client:", officialErr);
            if (this.genAiLegacy) {
              const model = this.genAiLegacy.getGenerativeModel({
                model: config.geminiModel,
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.3,
                },
              });
              const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
              rawText = result.response.text();
            } else {
              throw officialErr;
            }
          }
        } else if (this.genAiLegacy) {
          const model = this.genAiLegacy.getGenerativeModel({
            model: config.geminiModel,
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.3,
            },
          });
          const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
          rawText = result.response.text();
        }

        if (!rawText) {
          throw new Error("Empty response received from Gemini API");
        }

        const cleaned = cleanJsonString(rawText);
        const parsed = JSON.parse(cleaned);

        if (!validatePlanStructure(parsed)) {
          throw new Error("Parsed JSON did not match expected FitBuddy plan schema.");
        }

        return { plan: parsed, isDemo: false };
      } catch (error: any) {
        console.error(`Attempt ${attempts} failed for plan generation:`, error.message);
        if (attempts >= maxAttempts) {
          console.warn("⚠️ Gemini generation failed after retries. Falling back to Demo AI generator for resilience.");
          return { plan: generateDemoPlan(profile), isDemo: true };
        }
      }
    }

    return { plan: generateDemoPlan(profile), isDemo: true };
  }

  /**
   * Generates a conversational fitness coach reply
   */
  async chatWithCoach(
    message: string,
    history: { role: "user" | "assistant"; content: string }[],
    profile?: FitnessProfile | null
  ): Promise<{ reply: string; isDemo: boolean }> {
    if (config.isDemoAiMode || (!this.genAiOfficial && !this.genAiLegacy)) {
      return { reply: generateDemoChatResponse(message), isDemo: true };
    }

    const systemPrompt = buildChatSystemPrompt(profile);

    try {
      let reply = "";
      if (this.genAiOfficial) {
        try {
          const response = await this.genAiOfficial.models.generateContent({
            model: config.geminiModel,
            contents: `${systemPrompt}\n\nUser Question: ${message}`,
            config: {
              temperature: 0.7,
            },
          });
          reply = response.text || "";
        } catch (officialErr) {
          if (this.genAiLegacy) {
            const model = this.genAiLegacy.getGenerativeModel({
              model: config.geminiModel,
              systemInstruction: systemPrompt,
            });
            const result = await model.generateContent(message);
            reply = result.response.text();
          } else {
            throw officialErr;
          }
        }
      } else if (this.genAiLegacy) {
        const model = this.genAiLegacy.getGenerativeModel({
          model: config.geminiModel,
          systemInstruction: systemPrompt,
        });
        const result = await model.generateContent(message);
        reply = result.response.text();
      }

      if (!reply) {
        return { reply: generateDemoChatResponse(message), isDemo: true };
      }

      return { reply, isDemo: false };
    } catch (err: any) {
      console.error("Gemini chat error, returning fallback demo reply:", err.message);
      return { reply: generateDemoChatResponse(message), isDemo: true };
    }
  }
}

export const geminiService = new GeminiService();
