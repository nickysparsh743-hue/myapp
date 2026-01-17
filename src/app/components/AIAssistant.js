'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Bot, Send, X, Mic, MicOff, Paperclip, 
  Cpu, Zap, Brain, MessageSquare, Sparkles,
  Loader2, ThumbsUp, ThumbsDown, Copy, Download,
  Code, Globe, Shield, Database, Smartphone, FileText
} from 'lucide-react'

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mode, setMode] = useState('general')
  const [conversationHistory, setConversationHistory] = useState([])
  const messagesEndRef = useRef(null)

  // AI Capabilities
  const capabilities = [
    {
      id: 'code',
      name: 'Code Assistance',
      icon: Code,
      description: 'Code review, debugging, optimization'
    },
    {
      id: 'consult',
      name: 'Tech Consultation',
      icon: Cpu,
      description: 'Architecture, stack selection, best practices'
    },
    {
      id: 'business',
      name: 'Business Analysis',
      icon: Globe,
      description: 'Requirements, planning, strategy'
    },
    {
      id: 'security',
      name: 'Security Audit',
      icon: Shield,
      description: 'Vulnerability assessment, best practices'
    },
    {
      id: 'data',
      name: 'Data Insights',
      icon: Database,
      description: 'Analytics, visualization, ML advice'
    },
    {
      id: 'mobile',
      name: 'Mobile Dev',
      icon: Smartphone,
      description: 'App architecture, platform guidance'
    }
  ]

  // Initial messages
  const initialMessages = [
    {
      id: 1,
      text: "Hello! I'm Algo X AI Assistant, powered by advanced language models. I can help you with technical questions, project planning, code reviews, and digital strategy.",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 2,
      text: "How can I assist you today? I specialize in:\n\n• Web & Mobile Development\n• AI/ML Solutions\n• Cybersecurity\n• Data Analytics\n• Project Planning\n• Technical Consultation",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]

  // Quick prompts
  const quickPrompts = [
    "How much does a website cost?",
    "Explain AI vs ML differences",
    "Best practices for React performance",
    "Cybersecurity checklist for startups",
    "How to plan a 6-month project?"
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

  // Voice recognition (simulated)
  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false)
    } else {
      setIsListening(true)
      setTimeout(() => {
        setIsListening(false)
        setInput("I'd like to discuss a web development project for my business.")
      }, 2000)
    }
  }

  // Process AI response (simulated)
  const processAIResponse = async (userMessage) => {
    setIsProcessing(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    let response = ""
    
    // Contextual responses
    if (userMessage.toLowerCase().includes('cost') || userMessage.toLowerCase().includes('price')) {
      response = "Project costs vary based on complexity. For a standard website: $3,000-$8,000. For custom web apps: $8,000-$25,000. AI/ML projects: $15,000-$50,000+. Want a detailed estimate?"
    } else if (userMessage.toLowerCase().includes('ai') || userMessage.toLowerCase().includes('machine learning')) {
      response = "AI refers to systems performing human-like tasks. ML is a subset where systems learn from data. For your project:\n\n1. Define clear objectives\n2. Gather quality data\n3. Choose appropriate algorithms\n4. Plan for model training & deployment\n\nNeed specific ML architecture advice?"
    } else if (userMessage.toLowerCase().includes('react') || userMessage.toLowerCase().includes('frontend')) {
      response = "React performance tips:\n\n✅ Use React.memo for expensive components\n✅ Implement code splitting with React.lazy\n✅ Optimize re-renders with useMemo/useCallback\n✅ Virtualize long lists\n✅ Use production builds with optimizations\n\nWant code examples?"
    } else if (userMessage.toLowerCase().includes('security') || userMessage.toLowerCase().includes('cyber')) {
      response = "Startup security checklist:\n\n1. Implement HTTPS with SSL/TLS\n2. Use secure authentication (OAuth 2.0, JWT)\n3. Regular security audits\n4. Data encryption at rest & transit\n5. Input validation & sanitization\n6. Regular dependency updates\n7. Implement rate limiting\n\nNeed penetration testing?"
    } else if (userMessage.toLowerCase().includes('project') || userMessage.toLowerCase().includes('timeline')) {
      response = "6-month project plan:\n\nMonth 1-2: Discovery & Planning\n• Requirements gathering\n• Architecture design\n• Technology stack selection\n\nMonth 3-4: Development\n• Core feature development\n• Testing & iteration\n\nMonth 5: Integration & QA\n• System integration\n• Comprehensive testing\n\nMonth 6: Deployment & Launch\n• Production deployment\n• Documentation & training\n\nWant a customized project plan?"
    } else {
      response = "Thanks for your question! I've analyzed your query and here's my technical assessment:\n\nBased on industry best practices and Algo X's expertise, I recommend a phased approach with clear milestones. Would you like me to elaborate on any specific aspect or prepare a detailed technical proposal?"
    }
    
    const aiMessage = {
      id: messages.length + 2,
      text: response,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        "Provide code example",
        "Create project timeline",
        "Estimate budget",
        "Schedule consultation"
      ]
    }
    
    setMessages(prev => [...prev, aiMessage])
    setConversationHistory(prev => [...prev, { user: userMessage, ai: response }])
    setIsProcessing(false)
  }

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return
    
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    
    await processAIResponse(input)
  }

  const handleQuickPrompt = (prompt) => {
    setInput(prompt)
  }

  const handleSuggestion = (suggestion) => {
    const suggestionMessage = {
      id: messages.length + 1,
      text: suggestion,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages(prev => [...prev, suggestionMessage])
    processAIResponse(suggestion)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Show toast notification
  }

  const exportConversation = () => {
    const conversationText = messages.map(msg => 
      `${msg.sender === 'ai' ? 'AI Assistant' : 'You'} (${msg.timestamp}): ${msg.text}`
    ).join('\n\n')
    
    const blob = new Blob([conversationText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `algo-x-ai-conversation-${Date.now()}.txt`
    a.click()
  }

  return (
    <>
      {/* Floating Assistant Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-16 h-16 rounded-full bg-gradient-to-r from-neon-purple to-pink-500 flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 z-40 group animate-pulse hover:animate-none"
        aria-label="Open AI Assistant"
      >
        <Brain className="w-7 h-7 text-white" />
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-neon-green to-neon-blue animate-ping" />
        
        {/* Tooltip */}
        <div className="absolute left-20 bottom-0 bg-dark-gray border border-neon-purple/30 rounded-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          <p className="font-bold gradient-text">AI Assistant</p>
          <p className="text-gray-300">Get instant tech advice</p>
        </div>
      </button>

      {/* AI Assistant Panel - FIXED with proper modal and close button */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl h-[80vh] glass-effect rounded-3xl border border-neon-purple/30 shadow-2xl flex flex-col overflow-hidden">
            {/* Header - FIXED with close button */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-dark-gray to-dark flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-purple to-pink-500 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-neon-green to-neon-blue border-2 border-dark">
                    <Sparkles className="w-2.5 h-2.5 text-white mx-auto mt-0.5" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Algo X AI Assistant</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Zap className="w-4 h-4 text-neon-green" />
                    <span>Powered by GPT-4 & Custom ML Models</span>
                    <span className="px-2 py-0.5 rounded-full bg-neon-green/20 text-neon-green text-xs">
                      LIVE
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportConversation}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Export conversation"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Capabilities Grid */}
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-bold mb-3">What I can help with:</h3>
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
                {capabilities.map((cap) => {
                  const Icon = cap.icon
                  return (
                    <button
                      key={cap.id}
                      onClick={() => setMode(cap.id)}
                      className={`p-2 rounded-lg text-center transition-all duration-300 ${
                        mode === cap.id
                          ? 'bg-gradient-to-r from-neon-purple/20 to-pink-500/20 border border-neon-purple'
                          : 'border border-white/10 hover:border-neon-purple/30 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1 text-neon-purple" />
                      <p className="text-xs font-medium">{cap.name}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Conversation Area - FIXED with proper padding */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Messages - FIXED padding */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark'
                          : 'bg-gradient-to-r from-dark-gray to-dark border border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {msg.sender === 'ai' ? (
                          <>
                            <Brain className="w-4 h-4 text-neon-purple" />
                            <span className="font-bold text-neon-purple text-sm">AI Assistant</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-4 h-4" />
                            <span className="font-bold text-sm">You</span>
                          </>
                        )}
                        <span className="text-xs opacity-70 ml-auto">{msg.timestamp}</span>
                      </div>
                      
                      <p className="whitespace-pre-line text-sm mb-3">{msg.text}</p>
                      
                      {/* AI Message Actions */}
                      {msg.sender === 'ai' && (
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex gap-1">
                            <button
                              onClick={() => copyToClipboard(msg.text)}
                              className="p-1.5 rounded hover:bg-white/10 transition-colors"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              className="p-1.5 rounded hover:bg-white/10 transition-colors"
                              title="Helpful"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              className="p-1.5 rounded hover:bg-white/10 transition-colors"
                              title="Not helpful"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                          
                          {/* Suggestions */}
                          {msg.suggestions && (
                            <div className="flex gap-1">
                              {msg.suggestions.map((suggestion, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSuggestion(suggestion)}
                                  className="px-2 py-1 text-xs rounded-full border border-neon-purple/30 hover:border-neon-purple hover:bg-neon-purple/10 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Quick Prompts */}
                {messages.length <= 2 && (
                  <div className="mt-4">
                    <p className="text-gray-400 mb-2 text-sm">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickPrompt(prompt)}
                          className="px-3 py-1.5 rounded-full border border-white/10 hover:border-neon-purple hover:bg-neon-purple/10 transition-all duration-300 text-xs"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Processing Indicator */}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-neon-purple" />
                    <span>AI Assistant is analyzing your query...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 bg-dark-gray/50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleVoice}
                    className={`p-2 rounded-lg transition-colors ${
                      isListening
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'hover:bg-white/10 border border-white/10'
                    }`}
                    title={isListening ? 'Stop listening' : 'Voice input'}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={`Ask about ${mode === 'code' ? 'code' : mode === 'consult' ? 'technology' : mode === 'business' ? 'project planning' : 'anything'}...`}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-purple focus:outline-none text-sm pr-20"
                      disabled={isProcessing}
                    />
                    {isListening && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <div className="w-1 h-3 bg-red-400 animate-pulse" />
                        <div className="w-1 h-4 bg-red-400 animate-pulse delay-100" />
                        <div className="w-1 h-3 bg-red-400 animate-pulse delay-200" />
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isProcessing}
                    className="p-3 rounded-xl bg-gradient-to-r from-neon-purple to-pink-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                {/* Mode Indicator */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Cpu className="w-3 h-3" />
                    <span>Mode: </span>
                    <span className="text-neon-purple font-medium capitalize">
                      {mode === 'code' ? 'Code Assistance' :
                       mode === 'consult' ? 'Tech Consultation' :
                       mode === 'business' ? 'Business Analysis' :
                       mode === 'security' ? 'Security Audit' :
                       mode === 'data' ? 'Data Insights' : 'Mobile Development'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {conversationHistory.length} exchanges
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 text-center text-xs text-gray-500">
              <p>Powered by advanced AI models. Responses may not always be perfect. For critical decisions, consult with our human experts.</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AIAssistant