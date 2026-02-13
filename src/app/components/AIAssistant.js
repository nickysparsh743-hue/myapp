'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Bot, Send, X, Loader2,
  Cpu, Zap, Brain, MessageSquare, Sparkles,
  ThumbsUp, ThumbsDown, Copy, Download, Code,
  Globe, Shield, Database, Smartphone,
  GitBranch, CheckCircle2,
  MoreVertical, History, BookOpen, Users,
  ChevronDown, Maximize2, Minimize2
} from 'lucide-react'

const TechAdviser = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [mode, setMode] = useState('general')
  const [copiedId, setCopiedId] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef(null)

  // AI Capabilities
  const capabilities = [
    {
      id: 'code',
      name: 'Code Review',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      description: 'Review, debug, optimize'
    },
    {
      id: 'consult',
      name: 'Architecture',
      icon: GitBranch,
      color: 'from-purple-500 to-pink-500',
      description: 'System design, stack selection'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      description: 'Audits, best practices'
    },
    {
      id: 'data',
      name: 'Data & AI',
      icon: Database,
      color: 'from-green-500 to-emerald-500',
      description: 'Analytics, ML, optimization'
    },
    {
      id: 'mobile',
      name: 'Mobile',
      icon: Smartphone,
      color: 'from-indigo-500 to-purple-500',
      description: 'iOS, Android, cross-platform'
    },
    {
      id: 'general',
      name: 'General',
      icon: Brain,
      color: 'from-gray-500 to-gray-600',
      description: 'Any tech question'
    }
  ]

  // Quick actions for left sidebar
  const quickActions = [
    { id: 'new', icon: MessageSquare, label: 'New Chat' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'docs', icon: BookOpen, label: 'Docs' },
    { id: 'expert', icon: Users, label: 'Live Expert' }
  ]

  // Initial messages
  const initialMessages = [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: "👋 Hi! I'm Algo X Tech Adviser. I specialize in software architecture, code reviews, security audits, and technical strategy.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'welcome-2',
      role: 'assistant',
      content: "What technical challenge are you facing today? I can help with:\n\n• **Code reviews & debugging**\n• **System architecture design**\n• **Technology stack selection**\n• **Performance optimization**\n• **Security assessments**\n• **Development best practices**",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
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

  // ✅ FIXED: Real API call with proper history filtering
  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    try {
      // ✅ FIXED: Exclude welcome messages from history
      const history = messages
        .filter(msg => msg.id !== 'welcome-1' && msg.id !== 'welcome-2')
        .slice(-6)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await fetch('/api/tech-adviser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          mode,
          history
        })
      });

      const data = await response.json();

      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.response || "I'm here to help with your technical questions.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Chat error:', error);

      const errorMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);

    } finally {
      setIsProcessing(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = async (text, id) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const exportConversation = () => {
    const text = messages.map(msg =>
      `[${msg.timestamp}] ${msg.role === 'assistant' ? '🤖 Tech Adviser' : '👤 You'}:\n${msg.content}\n`
    ).join('\n---\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tech-adviser-${Date.now()}.txt`
    a.click()
  }

  const resetChat = () => {
    setMessages(initialMessages)
    setMode('general')
  }

  const currentCapability = capabilities.find(c => c.id === mode) || capabilities[5]

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-gradient-to-r from-neon-purple to-pink-500 flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 z-40 group hover:scale-110"
      >
        <Brain className="w-6 h-6 text-white" />
        <div className="absolute -top-1 -right-1 w-3 h-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green"></span>
          </span>
        </div>
      </button>

      {/* Tech Adviser Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full transition-all duration-300 ${isExpanded ? 'max-w-6xl h-[90vh]' : 'max-w-5xl h-[80vh]'
            } glass-effect rounded-3xl border border-neon-purple/30 shadow-2xl flex flex-col overflow-hidden`}>

            {/* Header */}
            <div className="p-3 border-b border-white/10 bg-gradient-to-r from-dark-gray to-dark flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-purple to-pink-500 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    Algo X Tech Adviser
                    <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                      Gemini 2.0
                    </span>
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Globe className="w-3 h-3" />
                    <span>Architecture • Code • Security</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                {/* Mode Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentCapability.color}`} />
                    <span className="text-xs font-medium">{currentCapability.name}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  <div className="absolute right-0 top-full mt-1 w-48 bg-dark-gray border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2 space-y-1">
                      {capabilities.map((cap) => {
                        const Icon = cap.icon
                        return (
                          <button
                            key={cap.id}
                            onClick={() => setMode(cap.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${mode === cap.id
                                ? `bg-gradient-to-r ${cap.color} bg-opacity-20`
                                : 'hover:bg-white/5'
                              }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{cap.name}</span>
                            {mode === cap.id && (
                              <CheckCircle2 className="w-3 h-3 ml-auto text-neon-green" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Settings Dropdown */}
                <div className="relative group">
                  <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  <div className="absolute right-0 top-full mt-1 w-48 bg-dark-gray border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2 space-y-1">
                      <button
                        onClick={exportConversation}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Chat</span>
                      </button>
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-xs"
                      >
                        {isExpanded ? (
                          <>
                            <Minimize2 className="w-3.5 h-3.5" />
                            <span>Compact View</span>
                          </>
                        ) : (
                          <>
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Expand View</span>
                          </>
                        )}
                      </button>
                      <div className="border-t border-white/10 my-1" />
                      <button
                        onClick={resetChat}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-xs text-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>New Chat</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Content - 3 Column Layout */}
            <div className="flex-1 flex min-h-0">

              {/* Left Sidebar - Quick Actions (15%) */}
              <div className="w-[15%] bg-dark-gray/30 border-r border-white/10 p-2 flex flex-col items-center gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={action.id}
                      onClick={() => {
                        if (action.id === 'new') resetChat()
                        if (action.id === 'expert') window.open('mailto:nicholusmush@gmail.com')
                      }}
                      className="w-full flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                      title={action.label}
                    >
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-neon-purple transition-colors" />
                      <span className="text-[10px] text-gray-500 group-hover:text-gray-300">
                        {action.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Center - Chat Area (70%) */}
              <div className="w-[70%] flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={msg.id || index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[90%] rounded-2xl p-4 ${msg.role === 'user'
                            ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark'
                            : 'bg-dark-gray/50 border border-white/10'
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {msg.role === 'assistant' ? (
                            <>
                              <div className="p-1 rounded-lg bg-gradient-to-r from-neon-purple to-pink-500">
                                <Cpu className="w-3 h-3 text-white" />
                              </div>
                              <span className="font-bold text-xs text-neon-purple">Tech Adviser</span>
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-3 h-3" />
                              <span className="font-bold text-xs">You</span>
                            </>
                          )}
                          <span className="text-[10px] opacity-70 ml-auto">{msg.timestamp}</span>
                        </div>

                        <div className="whitespace-pre-line text-sm leading-relaxed">
                          {msg.content}
                        </div>

                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
                            <button
                              onClick={() => copyToClipboard(msg.content, msg.id)}
                              className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/10 transition-colors text-[10px]"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <CheckCircle2 className="w-2.5 h-2.5 text-neon-green" />
                                  <span className="text-neon-green">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-2.5 h-2.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                            <button className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/10 transition-colors text-[10px]">
                              <ThumbsUp className="w-2.5 h-2.5" />
                              <span>Helpful</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-dark-gray/50 border border-white/10 rounded-2xl p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-3 h-3 animate-spin text-neon-purple" />
                          <span className="text-xs text-gray-400">Analyzing with Gemini AI...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-white/10 bg-dark-gray/30">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Ask about ${currentCapability.name.toLowerCase()}...`}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-purple focus:outline-none text-xs"
                        disabled={isProcessing}
                      />
                    </div>

                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isProcessing}
                      className="p-2 rounded-lg bg-gradient-to-r from-neon-purple to-pink-500 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Context Panel (15%) */}
              <div className="w-[15%] bg-dark-gray/30 border-l border-white/10 p-3">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Current Mode
                    </h4>
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${currentCapability.color} bg-opacity-10`}>
                      <div className="flex items-center gap-2">
                        <currentCapability.icon className="w-4 h-4" />
                        <div>
                          <p className="text-xs font-medium">{currentCapability.name}</p>
                          <p className="text-[10px] text-gray-400">{currentCapability.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Session
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-400">Messages</span>
                        <span className="font-medium">{messages.length}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-400">Model</span>
                        <span className="font-medium">Gemini 2.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={() => window.open('mailto:nicholusmush@gmail.com')}
                      className="w-full py-1.5 px-2 rounded-lg bg-neon-purple/20 hover:bg-neon-purple/30 transition-colors text-[10px] font-medium text-neon-purple"
                    >
                      Get Expert Help
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TechAdviser