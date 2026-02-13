// lib/gemini.js - CLEAN VERSION, NO HISTORY ISSUES
import { GoogleGenerativeAI } from '@google/generative-ai';

// Log API key status at module load
console.log('📦 Loading Gemini module...');
console.log('🔑 API Key present:', !!process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getGeminiResponse(message) {
    console.log('🤖 Gemini API called with message:', message.substring(0, 30) + '...');

    // If no API key, use fallback immediately
    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ No API key found!');
        return getFallbackResponse(message);
    }

    try {
        // Use the simplest model with NO history, NO system instruction
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash"  // Most compatible model
        });

        // Simple generation - NO chat, NO history
        const result = await model.generateContent(message);
        const response = await result.response.text();

        console.log('✅ Gemini success');
        return response;

    } catch (error) {
        console.error('❌ Gemini error:', error.message);
        return getFallbackResponse(message);
    }
}

// Rule-based fallback when API fails
function getFallbackResponse(message) {
    const msg = message.toLowerCase();

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return "👋 Hello! I'm Algo X Assistant. How can I help you today?";
    }

    if (msg.includes('service') || msg.includes('offer') || msg.includes('provide')) {
        return "We specialize in:\n\n• 🌐 Web Development\n• 🤖 AI/ML Solutions\n• 🔒 Cybersecurity\n• 📊 Data Analytics\n• 📱 Mobile Apps\n• 🎨 UI/UX Design\n\nWhich area interests you?";
    }

    if (msg.includes('price') || msg.includes('cost') || msg.includes('quote') || msg.includes('how much')) {
        return "Our pricing is project-based. For a custom quote, I can collect your details and our team will reach out within 24 hours. Would you like that?";
    }

    if (msg.includes('contact') || msg.includes('email') || msg.includes('phone') || msg.includes('reach')) {
        return "📧 nicholusmush@gmail.com\n📞 +254 703 576 876\n💬 WhatsApp: +254 703 576 876\n\nWe typically respond within 24 hours!";
    }

    if (msg.includes('location') || msg.includes('nairobi') || msg.includes('kenya')) {
        return "We're based in Nairobi, Kenya 🇰🇪, but serve clients worldwide! 🌍";
    }

    if (msg.includes('support') || msg.includes('help') || msg.includes('issue')) {
        return "I can help with technical support! Please describe the issue you're facing.";
    }

    if (msg.includes('portfolio') || msg.includes('work') || msg.includes('project')) {
        return "We've built AI chatbots, e-commerce platforms, school systems, and more. Check out our portfolio at algo-x.com/portfolio!";
    }

    if (msg.includes('timeline') || msg.includes('how long')) {
        return "Typical timelines:\n• Websites: 2-4 weeks\n• Mobile Apps: 4-12 weeks\n• AI Systems: 2-3 months\n\nWhat's your project type?";
    }

    if (msg.includes('payment') || msg.includes('pay') || msg.includes('mpesa')) {
        return "We accept bank transfers, MPESA (Kenya), PayPal, and credit cards. 50% deposit to start.";
    }

    return "I'm here to help! You can ask me about our services, pricing, portfolio, or anything else about Algo X.";
}

export function detectIntent(message) {
    const msg = message.toLowerCase();

    if (msg.includes('quote') || msg.includes('price') || msg.includes('cost'))
        return 'quote_request';
    if (msg.includes('service'))
        return 'service_inquiry';
    if (msg.includes('support') || msg.includes('help') || msg.includes('issue'))
        return 'support_request';
    if (msg.includes('call') || msg.includes('schedule') || msg.includes('meeting'))
        return 'booking';
    if (msg.includes('contact') || msg.includes('email') || msg.includes('phone'))
        return 'contact';

    return 'general';
}

export function getActionFromIntent(intent) {
    const actions = {
        'quote_request': { showForm: true, type: 'quote', formTitle: 'Get a Free Quote' },
        'support_request': { showForm: true, type: 'support', formTitle: 'Technical Support' },
        'booking': { showForm: true, type: 'call', formTitle: 'Schedule a Call' },
        'contact': { showForm: true, type: 'contact', formTitle: 'Contact Us' }
    };
    return actions[intent] || null;
}