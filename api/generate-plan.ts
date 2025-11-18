import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { UserPreferences } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { prefs } = request.body as { prefs: UserPreferences | null };
    const personalizationPrompt = prefs ? `The user's name is ${prefs.name}, age ${prefs.age}. Their main goal is ${prefs.goal}. Tailor the plan's mindset tips and challenges towards this goal.` : '';

    const daySchema = {
      type: Type.OBJECT,
      properties: {
        skincare: { type: Type.STRING, description: "A short, actionable skincare tip." },
        hygiene: { type: Type.STRING, description: "A short, actionable hygiene tip." },
        goals: { type: Type.STRING, description: "A hydration or sleep goal for the day." },
        mindset: { type: Type.STRING, description: "A positive mindset tip or affirmation." },
        challenge: { type: Type.STRING, description: "A small, fun challenge for the day." },
      },
      required: ["skincare", "hygiene", "goals", "mindset", "challenge"]
    };

    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a comprehensive, 7-day "glow up" plan for a teenager. The tone should be motivational, friendly, and supportive. ${personalizationPrompt} Structure the response as a JSON object. The root object should have keys for each day ("Day 1", "Day 2", etc.). Each day's value should be an object with these keys: "skincare", "hygiene", "goals" (hydration/sleep), "mindset", and "challenge". Provide a short, actionable tip for each.`,
      config: { 
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              "Day 1": daySchema, "Day 2": daySchema, "Day 3": daySchema, "Day 4": daySchema, "Day 5": daySchema, "Day 6": daySchema, "Day 7": daySchema,
            },
            required: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"]
          }
      },
    });
    const jsonString = geminiResponse.text;
    const plan = JSON.parse(jsonString);
    return response.status(200).json(plan);
  } catch (error: any) {
    console.error("Error in generate-plan API:", error);
    return response.status(500).json({ error: "Failed to generate your plan. Please check your connection." });
  }
}
