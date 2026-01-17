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
    const messagesEndRef = useRef(null)

    // Initial bot messages
    const initialMessages = [
        {
            id: 1,
            text: "👋 Hello! I'm Algo X AI Assistant. How can I help you today?",
            sender: 'bot',
            time: 'Just now',
            type: 'text'
        },
        {
            id: 2,
            text: "I can help you with:",
            sender: 'bot',
            time: 'Just now',
            type: 'text'
        },
        {
            id: 3,
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
        let response = ''

        switch (action) {
            case 'quote':
                response = "Great! Let me help you get a project quote. Could you share what type of project you need?"
                setShowLeadForm(true)
                break
            case 'services':
                response = "We offer:\n• Web Development\n• AI/ML Solutions\n• Cybersecurity\n• Data Analytics\n• Mobile Apps\n• Graphics & Writing\nWhich service interests you?"
                break
            case 'sales':
                response = "Perfect! A sales representative will contact you shortly. Could you share your name and email?"
                setShowLeadForm(true)
                break
            case 'support':
                response = "For technical support, please share your project details and the issue you're facing."
                break
            default:
                response = "How can I assist you with that?"
        }

        sendMessage(response, 'bot')
    }

    const sendMessage = (text, sender = 'user') => {
        if (sender === 'user' && !text.trim()) return

        const newMessage = {
            id: messages.length + 1,
            text: text.trim(),
            sender: sender,
            time: 'Just now',
            type: 'text'
        }

        setMessages(prev => [...prev, newMessage])

        if (sender === 'user') {
            setInput('')
            simulateBotResponse(text)
        }
    }

    const simulateBotResponse = (userMessage) => {
        setIsTyping(true)

        setTimeout(() => {
            let response = ''

            if (userMessage.toLowerCase().includes('price') || userMessage.toLowerCase().includes('cost')) {
                response = "Our pricing varies based on project scope. For a custom quote, could you share:\n• Project type\n• Timeline\n• Budget range?\nOr use our pricing calculator!"
            } else if (userMessage.toLowerCase().includes('contact') || userMessage.toLowerCase().includes('call')) {
                response = "We'd love to connect! Our sales team is available Mon-Fri, 9AM-6PM EAT. Would you like to schedule a call?"
                setShowLeadForm(true)
            } else if (userMessage.toLowerCase().includes('portfolio')) {
                response = "Check out our portfolio at algo-x.com/portfolio. We have projects in AI, web development, cybersecurity, and more!"
            } else if (userMessage.toLowerCase().includes('service') || userMessage.toLowerCase().includes('offer')) {
                response = "We specialize in:\n\n🤖 **AI/ML**: Chatbots, predictive models\n🌐 **Web Dev**: Next.js, React apps\n🔒 **Cybersecurity**: Audits, protection\n📊 **Data Analytics**: Dashboards, insights\n📱 **Mobile Apps**: iOS & Android\n🎨 **Design & Content**: UI/UX, writing\n\nWhich area interests you?"
            } else {
                response = "Thanks for your message! Our team will review this and get back to you shortly. Would you like me to collect some details for faster service?"
                setShowLeadForm(true)
            }

            sendMessage(response, 'bot')
            setIsTyping(false)
        }, 1500)
    }

    const handleSend = () => {
        if (!input.trim()) return
        sendMessage(input, 'user')
    }

    const handleLeadSubmit = (e) => {
        e.preventDefault()

        // Here you would typically send to your backend
        console.log('Lead captured:', userInfo)

        // Send confirmation
        sendMessage(`Thanks ${userInfo.name || 'there'}! We've received your information and will contact you at ${userInfo.email || userInfo.phone || 'your provided contact'} within 24 hours.`, 'bot')

        // Close form and reset
        setShowLeadForm(false)
        setUserInfo({ name: '', email: '', phone: '' })
    }

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
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">!</span>
                </div>

                {/* Tooltip */}
                <div className="absolute right-20 bottom-0 bg-dark-gray border border-neon-green/30 rounded-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    <p className="font-bold gradient-text">Need help?</p>
                    <p className="text-gray-300">Chat with us!</p>
                </div>
            </button>

            {/* Chat Window - FIXED with proper padding and close button */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md h-[80vh] glass-effect rounded-3xl border border-neon-green/30 shadow-2xl flex flex-col overflow-hidden">
                        {/* Header - FIXED with close button */}
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
                                        Online • Replies instantly
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

                        {/* Messages Container - FIXED padding */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
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
                                                {msg.sender === 'bot' ? 'Algo X Assistant' : 'You'}
                                            </span>
                                            <span className="text-xs opacity-60">{msg.time}</span>
                                        </div>
                                        <p className="whitespace-pre-line text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Quick Replies */}
                            {messages.length === initialMessages.length && (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-400 mb-3">Quick options:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {quickReplies.map((reply, idx) => (
                                            <button
                                                key={idx}
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
                                <div className="bg-gradient-to-r from-dark-gray to-dark rounded-2xl p-4 border border-neon-green/30 mt-4">
                                    <h4 className="font-bold mb-3 flex items-center gap-2 text-sm">
                                        <Download className="w-4 h-4 text-neon-green" />
                                        Get a Custom Quote
                                    </h4>
                                    <form onSubmit={handleLeadSubmit} className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={userInfo.name}
                                            onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none text-sm"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={userInfo.email}
                                            onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none text-sm"
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
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-neon-green animate-bounce" />
                                        <div className="w-2 h-2 rounded-full bg-neon-green animate-bounce delay-100" />
                                        <div className="w-2 h-2 rounded-full bg-neon-green animate-bounce delay-200" />
                                    </div>
                                    Algo X Assistant is typing...
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-dark-gray/50">
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none text-sm"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="p-3 rounded-xl bg-gradient-to-r from-neon-green to-neon-blue hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5 text-dark" />
                                </button>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex justify-center gap-4 mt-3">
                                <button
                                    onClick={() => window.open('tel:+254700000000', '_blank')}
                                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-neon-green transition-colors"
                                >
                                    <Phone className="w-3 h-3" />
                                    Call
                                </button>
                                <button
                                    onClick={() => window.open('mailto:contact@algo-x.com', '_blank')}
                                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-neon-green transition-colors"
                                >
                                    <Mail className="w-3 h-3" />
                                    Email
                                </button>
                                <button
                                    onClick={() => window.open('/contact', '_blank')}
                                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-neon-green transition-colors"
                                >
                                    <MessageCircle className="w-3 h-3" />
                                    Contact Form
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