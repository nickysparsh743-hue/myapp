'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Search, Filter, Send, Paperclip, Smile,
    MoreVertical, Phone, Video, Mail, Clock,
    Check, CheckCheck, Star, Pin, Archive,
    Trash2, Block, UserPlus, Info
} from 'lucide-react'

export default function MessagesPage() {
    const [conversations, setConversations] = useState([
        {
            id: 1,
            name: 'Sarah Chen',
            role: 'Lead Developer',
            avatar: '👩‍💻',
            lastMessage: 'Just uploaded the API documentation. Can you review?',
            time: '10:30 AM',
            unread: 3,
            online: true,
            pinned: true
        },
        {
            id: 2,
            name: 'Mike Rodriguez',
            role: 'Security Lead',
            avatar: '👨‍💼',
            lastMessage: 'Security audit completed successfully',
            time: 'Yesterday',
            unread: 0,
            online: false,
            pinned: true
        },
        {
            id: 3,
            name: 'Alex Johnson',
            role: 'AI Specialist',
            avatar: '👨‍🔬',
            lastMessage: 'The model is training well, 85% accuracy so far',
            time: '2 days ago',
            unread: 1,
            online: true,
            pinned: false
        },
        {
            id: 4,
            name: 'Emma Davis',
            role: 'UX Designer',
            avatar: '👩‍🎨',
            lastMessage: 'New wireframes are ready for feedback',
            time: '3 days ago',
            unread: 0,
            online: false,
            pinned: false
        },
        {
            id: 5,
            name: 'Project Team',
            role: 'Group Chat',
            avatar: '👥',
            lastMessage: 'John: Meeting moved to 3 PM tomorrow',
            time: '1 week ago',
            unread: 12,
            online: true,
            pinned: false
        }
    ])

    const [activeConversation, setActiveConversation] = useState(1)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef(null)

    // Mock messages for active conversation
    useEffect(() => {
        const mockMessages = [
            {
                id: 1,
                sender: 'Sarah Chen',
                avatar: '👩‍💻',
                text: 'Hi John! I just uploaded the API documentation for the e-commerce project.',
                time: '10:15 AM',
                isMe: false
            },
            {
                id: 2,
                sender: 'Me',
                avatar: '👤',
                text: 'Great! I\'ll review it right away. Any specific areas you want me to focus on?',
                time: '10:20 AM',
                isMe: true
            },
            {
                id: 3,
                sender: 'Sarah Chen',
                avatar: '👩‍💻',
                text: 'Mainly the authentication flow and error handling sections. Also, check the rate limiting implementation.',
                time: '10:25 AM',
                isMe: false
            },
            {
                id: 4,
                sender: 'Sarah Chen',
                avatar: '👩‍💻',
                text: 'I\'ve also attached the Postman collection for testing.',
                time: '10:30 AM',
                isMe: false,
                attachments: ['postman_collection.json']
            },
            {
                id: 5,
                sender: 'Me',
                avatar: '👤',
                text: 'Perfect! I\'ll go through everything and provide feedback by EOD.',
                time: '10:35 AM',
                isMe: true
            }
        ]
        setMessages(mockMessages)
    }, [activeConversation])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSendMessage = () => {
        if (!newMessage.trim()) return

        const message = {
            id: messages.length + 1,
            sender: 'Me',
            avatar: '👤',
            text: newMessage,
            time: 'Just now',
            isMe: true
        }

        setMessages([...messages, message])
        setNewMessage('')
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const activeConversationData = conversations.find(c => c.id === activeConversation)

    return (
        <div className="flex h-[calc(100vh-12rem)]">
            {/* Conversations List */}
            <div className="w-full md:w-1/3 lg:w-1/4 border-r border-white/10 pr-4">
                <div className="mb-6">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors text-sm">
                            All
                        </button>
                        <button className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors text-sm">
                            Unread
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-2 overflow-y-auto h-[calc(100%-8rem)]">
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            onClick={() => setActiveConversation(conversation.id)}
                            className={`p-4 rounded-lg cursor-pointer transition-colors ${activeConversation === conversation.id
                                    ? 'bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border border-neon-green/30'
                                    : 'hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center text-lg">
                                        {conversation.avatar}
                                    </div>
                                    {conversation.online && (
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-dark" />
                                    )}
                                    {conversation.pinned && (
                                        <div className="absolute -top-1 -right-1">
                                            <Pin className="w-4 h-4 text-yellow-400" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold truncate">{conversation.name}</h3>
                                        <span className="text-xs text-gray-400">{conversation.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 truncate mb-2">{conversation.role}</p>
                                    <p className="text-sm truncate">{conversation.lastMessage}</p>

                                    <div className="flex items-center justify-between mt-2">
                                        {conversation.unread > 0 ? (
                                            <span className="w-6 h-6 rounded-full bg-red-500 text-xs flex items-center justify-center">
                                                {conversation.unread}
                                            </span>
                                        ) : (
                                            <CheckCheck className="w-4 h-4 text-neon-green" />
                                        )}
                                        <div className="flex items-center gap-1">
                                            {conversation.pinned && (
                                                <Pin className="w-3 h-3 text-yellow-400" />
                                            )}
                                            {conversation.unread > 0 && (
                                                <div className="w-2 h-2 rounded-full bg-neon-green" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col pl-4">
                {/* Chat Header */}
                {activeConversationData && (
                    <div className="glass-effect rounded-lg p-4 mb-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center text-lg">
                                        {activeConversationData.avatar}
                                    </div>
                                    {activeConversationData.online && (
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-dark" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{activeConversationData.name}</h2>
                                    <p className="text-sm text-gray-400">{activeConversationData.role}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                                    <Video className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </button>
                                <div className="relative group">
                                    <button className="p-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 glass-effect rounded-lg border border-white/10 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                                        <div className="p-2">
                                            <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                <Star className="w-4 h-4" />
                                                Star Conversation
                                            </button>
                                            <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                <Archive className="w-4 h-4" />
                                                Mute Notifications
                                            </button>
                                            <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                <UserPlus className="w-4 h-4" />
                                                Add Participants
                                            </button>
                                            <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                View Profile
                                            </button>
                                            <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors text-red-400 flex items-center gap-2">
                                                <Trash2 className="w-4 h-4" />
                                                Delete Chat
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] rounded-2xl p-4 ${message.isMe
                                    ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark'
                                    : 'bg-white/5 border border-white/10'
                                }`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-lg">{message.avatar}</div>
                                    <div>
                                        <p className="font-semibold">{message.sender}</p>
                                        <p className="text-xs opacity-70">{message.time}</p>
                                    </div>
                                </div>

                                <p className="mb-3">{message.text}</p>

                                {message.attachments && (
                                    <div className="space-y-2 mb-3">
                                        {message.attachments.map((file, idx) => (
                                            <div key={idx} className="p-3 rounded-lg bg-white/10 border border-white/10">
                                                <div className="flex items-center gap-2">
                                                    <Paperclip className="w-4 h-4" />
                                                    <span className="text-sm">{file}</span>
                                                    <button className="ml-auto text-xs px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors">
                                                        Download
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-sm mt-2">
                                    {message.isMe && (
                                        <CheckCheck className="w-4 h-4 text-dark/70" />
                                    )}
                                    <div className="flex gap-2 ml-auto">
                                        <button className="hover:opacity-70 transition-opacity">Reply</button>
                                        <button className="hover:opacity-70 transition-opacity">Forward</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="glass-effect rounded-lg p-4 border border-white/10">
                    <div className="flex items-end gap-3">
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>

                        <div className="flex-1">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                rows="2"
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none resize-none"
                            />
                            <div className="flex items-center justify-between mt-2">
                                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                    <Smile className="w-5 h-5" />
                                </button>
                                <div className="text-sm text-gray-400">
                                    Press Enter to send, Shift+Enter for new line
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="p-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5 text-dark" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}