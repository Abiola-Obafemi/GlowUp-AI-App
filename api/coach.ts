import { GoogleGenAI } from "@google/genai";
import { ChatMessage, UserPreferences } from '../types';

// Vercel Edge Runtime configuration
export const config = {
  runtime: 'edge',
};

// This API route streams the AI's response
export default async function handler(request: Request) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { history, prefs } = (await request.json()) as { history: ChatMessage[]; prefs: UserPreferences | null };
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const personalizationPrompt = prefs ? `You are talking to ${prefs.name}, who is ${prefs.age}. Remember, you're helping them with their goal of ${prefs.goal} and their challenge of ${prefs.challenge}.` : '';
        const formattedHistory = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are GlowUp Coach, a friendly and wise big-sister-style coach for teens. You give advice on confidence, social skills, motivation, and handling school or friend situations. Keep your responses concise, empathetic, and positive. ${personalizationPrompt} End with an encouraging sentence or an open-ended question.`,
            },
            history: formattedHistory.slice(0, -1),
        });

        const lastMessage = formattedHistory[formattedHistory.length - 1];
        const result = await chat.sendMessageStream({ message: lastMessage.parts[0].text });
        
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                for await (const chunk of result) {
                    controller.enqueue(encoder.encode(chunk.text));
                }
                controller.close();
            },
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
        
    } catch (error: any) {
        console.error("Error in coach API stream:", error);
        return new Response("I'm having a little trouble thinking right now. Could you ask me again?", { status: 500 });
    }
}
