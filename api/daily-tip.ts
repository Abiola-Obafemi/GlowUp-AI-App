import { GoogleGenAI } from "@google/genai";
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
        const personalizationPrompt = prefs ? `The user's name is ${prefs.name}, and their main goal is ${prefs.goal}. Give them a tip related to that.` : 'Give a general tip about confidence or style.';
        const geminiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate one short, actionable, and inspiring "glow up" tip for a teenager. Make it friendly and encouraging. ${personalizationPrompt} The tip should be no more than two sentences.`,
        });
        return response.status(200).json({ tip: geminiResponse.text });
    } catch (error: any) {
        console.error("Error in daily-tip API:", error);
        const fallbackTip = "Remember to drink water and be kind to yourself today! ✨";
        return response.status(200).json({ tip: fallbackTip });
    }
}
