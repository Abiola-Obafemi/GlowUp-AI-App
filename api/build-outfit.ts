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
        const { items, occasion, prefs } = request.body as { items: string[], occasion: string, prefs: UserPreferences | null };
        const personalizationPrompt = prefs ? `The user's name is ${prefs.name}, age ${prefs.age}, and their style vibe is ${prefs.styleVibe}. Create an outfit that fits this aesthetic.` : '';
        const geminiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `I'm a teen trying to build an outfit. My available items are: ${items.join(', ')}. The occasion is: ${occasion}. ${personalizationPrompt} Create a cool, stylish outfit combination using these items. Suggest specific, popular, and trendy clothing items and brands that a teen would recognize, for example, 'a Nike Tech fleece hoodie' or 'Air Jordan 1 sneakers'. Describe the full outfit, why it works, and suggest one accessory to complete the look. Be trendy and encouraging.`,
        });
        return response.status(200).json({ outfit: geminiResponse.text });
    } catch (error: any) {
        console.error("Error in build-outfit API:", error);
        return response.status(500).json({ error: "Couldn't create an outfit. The AI might be busy, try again!" });
    }
}
