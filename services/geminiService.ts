import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, AnalysisResult, UserPreferences } from "../types";

// In a production/Vercel environment, process.env is not available directly in the client-side code.
// The API key must be provided by the secure environment when the function is called.
// We remove the upfront check that causes the app to crash.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });


export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export const analyzeSelfie = async (imageBase64: string, prefs: UserPreferences | null): Promise<AnalysisResult> => {
  const personalizationPrompt = prefs ? `The user's name is ${prefs.name}, they are ${prefs.age} years old. Their main goal is ${prefs.goal}, their style vibe is ${prefs.styleVibe}, and they're challenged by ${prefs.challenge}. Tailor the advice to this specific user.` : '';
  
  try {
    const response = await ai.models.generateContent({
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

    const jsonString = response.text;
    return JSON.parse(jsonString) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing selfie:", error);
    throw new Error("Failed to get feedback from AI. Please try again.");
  }
};

export const generateGlowUpPlan = async (prefs: UserPreferences | null): Promise<any> => {
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a comprehensive, 7-day "glow up" plan for a teenager. The tone should be motivational, friendly, and supportive. ${personalizationPrompt} Structure the response as a JSON object. The root object should have keys for each day ("Day 1", "Day 2", etc.). Each day's value should be an object with these keys: "skincare", "hygiene", "goals" (hydration/sleep), "mindset", and "challenge". Provide a short, actionable tip for each.`,
      config: { 
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              "Day 1": daySchema,
              "Day 2": daySchema,
              "Day 3": daySchema,
              "Day 4": daySchema,
              "Day 5": daySchema,
              "Day 6": daySchema,
              "Day 7": daySchema,
            },
            required: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"]
          }
      },
    });
    const jsonString = response.text;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating glow-up plan:", error);
    throw new Error("Failed to generate your plan. Please check your connection.");
  }
};

export const buildOutfit = async (items: string[], occasion: string, prefs: UserPreferences | null): Promise<string> => {
    const personalizationPrompt = prefs ? `The user's name is ${prefs.name}, age ${prefs.age}, and their style vibe is ${prefs.styleVibe}. Create an outfit that fits this aesthetic.` : '';
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `I'm a teen trying to build an outfit. My available items are: ${items.join(', ')}. The occasion is: ${occasion}. ${personalizationPrompt} Create a cool, stylish outfit combination using these items. Suggest specific, popular, and trendy clothing items and brands that a teen would recognize, for example, 'a Nike Tech fleece hoodie' or 'Air Jordan 1 sneakers'. Describe the full outfit, why it works, and suggest one accessory to complete the look. Be trendy and encouraging.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error building outfit:", error);
        throw new Error("Couldn't create an outfit. The AI might be busy, try again!");
    }
};


export const getCoachResponseStream = async (history: ChatMessage[], prefs: UserPreferences | null) => {
  const personalizationPrompt = prefs ? `You are talking to ${prefs.name}, who is ${prefs.age}. Remember, you're helping them with their goal of ${prefs.goal} and their challenge of ${prefs.challenge}.` : '';
  const formattedHistory = history.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  try {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are GlowUp Coach, a friendly and wise big-sister-style coach for teens. You give advice on confidence, social skills, motivation, and handling school or friend situations. Keep your responses concise, empathetic, and positive. ${personalizationPrompt} End with an encouraging sentence or an open-ended question.`,
        },
        history: formattedHistory.slice(0, -1),
    });
    const lastMessage = formattedHistory[formattedHistory.length - 1];
    
    return await chat.sendMessageStream({ message: lastMessage.parts[0].text });

  } catch (error) {
    console.error("Error getting coach response:", error);
    throw new Error("I'm having a little trouble thinking right now. Could you ask me again?");
  }
};

export const getDailyTip = async (prefs: UserPreferences | null): Promise<string> => {
    const personalizationPrompt = prefs ? `The user's name is ${prefs.name}, and their main goal is ${prefs.goal}. Give them a tip related to that.` : 'Give a general tip about confidence or style.';
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate one short, actionable, and inspiring "glow up" tip for a teenager. Make it friendly and encouraging. ${personalizationPrompt} The tip should be no more than two sentences.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching daily tip:", error);
        return "Remember to drink water and be kind to yourself today! ✨";
    }
};