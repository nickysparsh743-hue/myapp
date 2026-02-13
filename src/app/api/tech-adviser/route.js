import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_2);

export async function POST(req) {
    try {
        const { message, mode = 'general', history = [] } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        // System prompt for tech expertise
        const systemPrompt = `You are Algo X Tech Adviser, a senior software architect and technical consultant.

EXPERTISE AREAS:
${getExpertisePrompt(mode)}

RESPONSE RULES:
1. Give PRACTICAL, ACTIONABLE advice with specific examples
2. Use code snippets when relevant (format with \`\`\`language)
3. Compare 2-3 approaches with pros/cons
4. Include performance, security, and scalability considerations
5. Keep responses under 500 tokens
6. Use bullet points and clear sections
7. If you don't know something, say so clearly

Be professional, thorough, and honest about tradeoffs.`;

        // ✅ FIXED: Format history correctly - Gemini requires first message to be from 'user'
        const formattedHistory = [];

        // Filter and format valid messages
        const validHistory = history
            .filter(msg => msg.role === 'user' || msg.role === 'assistant')
            .slice(-6);

        // Format each message with correct role
        validHistory.forEach(msg => {
            formattedHistory.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        });

        // ✅ CRITICAL: Remove first message if it's from 'model'
        if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory.shift();
        }

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 800,
                topP: 0.85,
                topK: 40
            }
        });

        const fullPrompt = `${systemPrompt}\n\nUser question: ${message}`;
        const result = await chat.sendMessage(fullPrompt);
        const response = await result.response.text();

        return Response.json({
            success: true,
            response,
            mode
        });

    } catch (error) {
        console.error('Tech Adviser Error:', error);

        let fallbackResponse = "I'm here to help with your technical questions. Could you please rephrase that?";

        if (error.message?.includes('quota') || error.message?.includes('429')) {
            fallbackResponse = "I'm currently experiencing high demand. Please try again in a moment or contact our team directly.";
        }

        if (error.message?.includes('API key')) {
            fallbackResponse = "I'm having trouble with my AI service. Our human experts are available at nicholusmush@gmail.com";
        }

        return Response.json({
            success: false,
            response: fallbackResponse
        });
    }
}

function getExpertisePrompt(mode) {
    const expertise = {
        code: `- Code review best practices
- Performance optimization techniques
- Design patterns and refactoring
- Testing strategies (unit, integration, e2e)
- Debugging approaches
- Code quality metrics
- Technical debt management`,

        consult: `- System architecture design
- Technology stack selection
- Microservices vs monolith
- API design (REST, GraphQL, gRPC)
- Database selection and modeling
- Cloud architecture (AWS, GCP, Azure)
- Scalability strategies`,

        security: `- Authentication & authorization
- OWASP Top 10 vulnerabilities
- Secure coding practices
- Penetration testing
- Compliance (GDPR, HIPAA, PCI)
- Security headers & best practices
- Dependency vulnerability scanning`,

        data: `- Data modeling and schema design
- Query optimization
- ETL pipelines
- Real-time analytics
- Machine learning workflows
- Data warehousing
- Big data technologies`,

        mobile: `- Native vs cross-platform
- App architecture (MVC, MVVM, Clean)
- Offline-first design
- Push notifications
- App store optimization
- Mobile performance
- Device compatibility`,

        default: `- Technical problem solving
- Best practices and patterns
- Technology recommendations
- Project planning
- Career advice
- Team leadership
- Technical documentation`
    };

    return expertise[mode] || expertise.default;
}

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Allow': 'POST, OPTIONS',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}