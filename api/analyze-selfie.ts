import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { UserPreferences, AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64, prefs } = request.body as { imageBase64: string; prefs: UserPreferences | null };
    if (!imageBase64) {
      return response.status(400).json({ error: 'Missing image data' });
    }

    const personalizationPrompt = prefs ? `The user's name is ${prefs.name}, they are ${prefs.age} years old. Their main goal is ${prefs.goal}, their style vibe is ${prefs.styleVibe}, and they're challenged by ${prefs.challenge}. Tailor the advice to this specific user.` : '';
  
    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64,
            },
          },
          {
            text: `Analyze this selfie of a teen. Provide constructive, positive, and encouraging feedback. Focus on style and grooming. Be friendly and act as a helpful AI assistant. ${personalizationPrompt} Structure your response as a JSON object with these exact keys: "outfitFeedback", "groomingSuggestions", "hairstyleIdeas", "aestheticIdeas". Each value should be a string with 2-3 detailed suggestions.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            outfitFeedback: { type: Type.STRING, description: "Feedback on the user's current outfit." },
            groomingSuggestions: { type: Type.STRING, description: "Tips for grooming and personal care." },
            hairstyleIdeas: { type: Type.STRING, description: "Suggestions for hairstyles that might suit them." },
            aestheticIdeas: { type: Type.STRING, description: "Ideas for style aesthetics they could explore." },
          },
          required: ["outfitFeedback", "groomingSuggestions", "hairstyleIdeas", "aestheticIdeas"]
        },
      },
    });

    const jsonString = geminiResponse.text;
    const result = JSON.parse(jsonString) as AnalysisResult;
    
    return response.status(200).json(result);

  } catch (error: any) {
    console.error("Error in analyze-selfie API:", error);
    return response.status(500).json({ error: "Failed to get feedback from AI. Please try again." });
  }
}
