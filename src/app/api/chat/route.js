// app/api/chat/route.js
import { getGeminiResponse, detectIntent, getActionFromIntent } from '@/lib/gemini';

export async function POST(req) {
    try {
        const { message } = await req.json();

        if (!message) {
            return Response.json({
                response: "Hi! How can I help you today?"
            });
        }

        // Get response (will use fallback if API key missing)
        const response = await getGeminiResponse(message);

        // Detect intent for UI
        const intent = detectIntent(message);
        const action = getActionFromIntent(intent);

        return Response.json({
            response,
            intent,
            action
        });

    } catch (error) {
        console.error('API Error:', error);
        return Response.json({
            response: "Hi! I'm Algo X Assistant. What would you like to know?"
        });
    }
}

export async function OPTIONS() {
    return new Response(null, { status: 204 });
}