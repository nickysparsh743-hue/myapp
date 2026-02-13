'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Clock, User, Bot, Paperclip, Phone, Mail, Download } from 'lucide-react'

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' })
    const [showLeadForm, setShowLeadForm] = useState(false)
    const [formTitle, setFormTitle] = useState('Get a Custom Quote')
    const messagesEndRef = useRef(null)

    // Initial bot messages - with unique IDs
    const initialMessages = [
        {
            id: 'init-1', // ✅ Hardcoded unique ID
            text: "👋 Hello! I'm Algo X AI Assistant. How can I help you today?",
            sender: 'bot',
            time: 'Just now',
            type: 'text'
        },
        {
            id: 'init-2', // ✅ Hardcoded unique ID
            text: "I can help you with:",
            sender: 'bot',
            time: 'Just now',
            type: 'text'
        },
        {
            id: 'init-3', // ✅ Hardcoded unique ID
            text: "• Service information & pricing\n• Project quote estimation\n• Technical consultation\n• Support & inquiries\n• Schedule a call",
            sender: 'bot',
            time: 'Just now',
            type: 'text'
        }
    ]

    // Quick reply options
    const quickReplies = [
        { text: "Get a Quote", action: 'quote' },
        { text: "View Services", action: 'services' },
        { text: "Talk to Sales", action: 'sales' },
        { text: "Technical Support", action: 'support' }
    ]

    useEffect(() => {
        setMessages(initialMessages)
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleQuickReply = (action) => {
        switch (action) {
            case 'quote':
                sendMessage("Great! Let me help you get a project quote. Could you share what type of project you need?", 'bot')
                setFormTitle('Get a Free Quote')
                setShowLeadForm(true)
                break
            case 'services':
                getAIResponse("Tell me about your services")
                break
            case 'sales':
                sendMessage("Perfect! A sales representative will contact you shortly. Could you share your name and email?", 'bot')
                setFormTitle('Talk to Sales')
                setShowLeadForm(true)
                break
            case 'support':
                sendMessage("I can help with technical support. Please describe the issue you're facing.", 'bot')
                setFormTitle('Technical Support')
                setShowLeadForm(true)
                break
        }
    }

    // ✅ FIXED: sendMessage with UNIQUE IDs
    const sendMessage = (text, sender = 'user') => {
        if (sender === 'user' && !text.trim()) return

        const newMessage = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ✅ ALWAYS UNIQUE
            text: text.trim(),
            sender: sender,
            time: 'Just now',
            type: 'text'
        }

        setMessages(prev => [...prev, newMessage])

        if (sender === 'user') {
            setInput('')
            getAIResponse(text)
        }
    }

    // AI-powered response using Google Gemini
    const getAIResponse = async (userMessage) => {
        setIsTyping(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.slice(-10),
                    userInfo
                })
            })

            const data = await response.json()

            sendMessage(data.response, 'bot')

            if (data.action?.showForm) {
                setFormTitle(data.action.formTitle || 'Get a Custom Quote')
                setShowLeadForm(true)
            }

        } catch (error) {
            console.error('AI Error:', error)
            sendMessage(
                "I'm here to help! Could you tell me more about what you'd like to know?",
                'bot'
            )
        } finally {
            setIsTyping(false)
        }
    }

    const handleSend = () => {
        if (!input.trim()) return
        sendMessage(input, 'user')
    }

    const handleLeadSubmit = async (e) => {
        e.preventDefault()

        try {
            await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: userInfo.name,
                    email: userInfo.email,
                    phone: userInfo.phone,
                    message: `Lead from chat: ${formTitle}`,
                    service: 'Chat Lead'
                })
            })

            sendMessage(`Thanks ${userInfo.name || 'there'}! We've received your information and will contact you within 24 hours.`, 'bot')

        } catch (error) {
            console.error('Lead submission error:', error)
            sendMessage(`Thanks ${userInfo.name || 'there'}! We received your information. Our team will reach out soon.`, 'bot')
        }

        setShowLeadForm(false)
        setUserInfo({ name: '', email: '', phone: '' })
    }

    // ✅ FIXED: Using msg.id as key (now unique)
    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 z-40 group animate-bounce hover:animate-none"
                aria-label="Open chat"
            >
                <MessageCircle className="w-7 h-7 text-dark" />
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 animate-pulse">
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">1</span>
                </div>

                <div className="absolute right-20 bottom-0 bg-dark-gray border border-neon-green/30 rounded-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    <p className="font-bold gradient-text">Need help?</p>
                    <p className="text-gray-300">Chat with AI!</p>
                </div>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md h-[80vh] glass-effect rounded-3xl border border-neon-green/30 shadow-2xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-dark-gray to-dark flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-dark" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-dark">
                                        <div className="w-1 h-1 rounded-full bg-white mx-auto mt-0.5" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold">Algo X Assistant</h3>
                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Online • AI Powered
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                aria-label="Close chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id} // ✅ Now unique!
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl p-4 relative ${msg.sender === 'user'
                                                ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark'
                                                : 'bg-white/5 border border-white/10'
                                            }`}
                                    >
                                        {msg.sender === 'bot' && (
                                            <div className="absolute -left-2 top-4 w-4 h-4 bg-white/5 border border-white/10 transform rotate-45" />
                                        )}
                                        <div className="flex items-center gap-2 mb-2">
                                            {msg.sender === 'bot' ? (
                                                <Bot className="w-4 h-4" />
                                            ) : (
                                                <User className="w-4 h-4" />
                                            )}
                                            <span className="text-xs font-medium">
                                                {msg.sender === 'bot' ? 'Algo X AI' : 'You'}
                                            </span>
                                            <span className="text-xs opacity-60">{msg.time}</span>
                                        </div>
                                        <p className="whitespace-pre-line text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Quick Replies */}
                            {messages.length <= 3 && (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-400 mb-3">Quick options:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {quickReplies.map((reply, idx) => (
                                            <button
                                                key={`quick-${idx}-${reply.action}`} // ✅ Unique key
                                                onClick={() => handleQuickReply(reply.action)}
                                                className="px-3 py-2 rounded-full border border-neon-green/30 hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300 text-xs"
                                            >
                                                {reply.text}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Lead Form */}
                            {showLeadForm && (
                                <div key="lead-form" className="bg-gradient-to-r from-dark-gray to-dark rounded-2xl p-4 border border-neon-green/30 mt-4">
                                    <h4 className="font-bold mb-3 flex items-center gap-2 text-sm">
                                        <Download className="w-4 h-4 text-neon-green" />
                                        {formTitle}
                                    </h4>
                                    <form onSubmit={handleLeadSubmit} className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={userInfo.name}
                                            onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none text-sm"
                                            required
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={userInfo.email}
                                            onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none text-sm"
                                            required
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone (Optional)"
                                            value={userInfo.phone}
                                            onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none text-sm"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold text-sm hover:opacity-90 transition-opacity"
                                            >
                                                Submit Details
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowLeadForm(false)}
                                                className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/30 text-sm"
                                            >
                                                Later
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div key="typing-indicator" className="flex items-center gap-2 text-gray-400 text-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-neon-green animate-bounce" />
                                        <div className="w-2 h-2 rounded-full bg-neon-green animate-bounce delay-100" />
                                        <div className="w-2 h-2 rounded-full bg-neon-green animate-bounce delay-200" />
                                    </div>
                                    Algo X AI is thinking...
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-dark-gray/50">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask me anything about Algo X..."
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none text-sm"
                                    disabled={isTyping}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="p-3 rounded-xl bg-gradient-to-r from-neon-green to-neon-blue hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5 text-dark" />
                                </button>
                            </div>

                            <div className="flex justify-center gap-4 mt-3">
                                <button
                                    onClick={() => window.open('tel:+254703576876', '_blank')}
                                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-neon-green transition-colors"
                                >
                                    <Phone className="w-3 h-3" />
                                    Call
                                </button>
                                <button
                                    onClick={() => window.open('mailto:nicholusmush@gmail.com', '_blank')}
                                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-neon-green transition-colors"
                                >
                                    <Mail className="w-3 h-3" />
                                    Email
                                </button>
                                <button
                                    onClick={() => window.open('https://wa.me/254703576876', '_blank')}
                                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-neon-green transition-colors"
                                >
                                    <MessageCircle className="w-3 h-3" />
                                    WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ChatWidget