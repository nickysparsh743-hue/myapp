'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard, FolderKanban, FileText, MessageSquare,
    Users, Settings, Bell, Search, Menu, X, LogOut,
    Upload, Download, Calendar, BarChart, Shield, HelpCircle
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [notifications, setNotifications] = useState(5)
    const [user, setUser] = useState(null)
    const pathname = usePathname()
    const router = useRouter()

    // Mock user data
    useEffect(() => {
        setUser({
            name: 'John Smith',
            email: 'john@example.com',
            company: 'Tech Solutions Inc.',
            avatar: '👤',
            role: 'Project Manager'
        })
    }, [])

    const navItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            active: pathname === '/dashboard'
        },
        {
            title: 'Projects',
            href: '/dashboard/projects',
            icon: FolderKanban,
            active: pathname.startsWith('/dashboard/projects')
        },
        {
            title: 'Documents',
            href: '/dashboard/documents',
            icon: FileText,
            active: pathname.startsWith('/dashboard/documents')
        },
        {
            title: 'Messages',
            href: '/dashboard/messages',
            icon: MessageSquare,
            active: pathname.startsWith('/dashboard/messages'),
            badge: 3
        },
        {
            title: 'Team',
            href: '/dashboard/team',
            icon: Users,
            active: pathname.startsWith('/dashboard/team')
        },
        {
            title: 'Calendar',
            href: '/dashboard/calendar',
            icon: Calendar,
            active: pathname.startsWith('/dashboard/calendar')
        },
        {
            title: 'Analytics',
            href: '/dashboard/analytics',
            icon: BarChart,
            active: pathname.startsWith('/dashboard/analytics')
        },
        {
            title: 'Settings',
            href: '/dashboard/settings',
            icon: Settings,
            active: pathname.startsWith('/dashboard/settings')
        }
    ]

    const projects = [
        { id: 1, name: 'E-commerce Platform', status: 'active', progress: 75 },
        { id: 2, name: 'Mobile Banking App', status: 'active', progress: 45 },
        { id: 3, name: 'AI Chatbot', status: 'review', progress: 90 },
        { id: 4, name: 'Data Dashboard', status: 'completed', progress: 100 }
    ]

    const handleLogout = () => {
        // Handle logout logic
        router.push('/')
    }

    return (
        <div className="min-h-screen bg-dark">
            {/* Top Navigation */}
            <nav className="fixed top-0 z-50 w-full glass-effect border-b border-white/10">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Logo and Menu */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors mr-4"
                            >
                                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                            <Link href="/dashboard" className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center">
                                    <span className="text-lg font-bold">AX</span>
                                </div>
                                <span className="text-xl font-bold gradient-text hidden md:block">Algo X Dashboard</span>
                            </Link>
                        </div>

                        {/* Center: Search */}
                        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search projects, messages, documents..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Right: User Actions */}
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
                                <Bell className="w-5 h-5" />
                                {notifications > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-xs flex items-center justify-center">
                                        {notifications}
                                    </span>
                                )}
                            </button>

                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                <HelpCircle className="w-5 h-5" />
                            </button>

                            {/* User Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center">
                                        <span className="text-sm font-bold">{user?.avatar || '👤'}</span>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium">{user?.name || 'Loading...'}</p>
                                        <p className="text-xs text-gray-400">{user?.role || 'User'}</p>
                                    </div>
                                </button>

                                <div className="absolute right-0 mt-2 w-64 glass-effect rounded-lg border border-white/10 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <div className="p-4 border-b border-white/10">
                                        <p className="font-medium">{user?.name}</p>
                                        <p className="text-sm text-gray-400">{user?.email}</p>
                                        <p className="text-xs text-neon-green mt-1">{user?.company}</p>
                                    </div>
                                    <div className="p-2">
                                        <Link
                                            href="/dashboard/profile"
                                            className="flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Profile Settings</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/billing"
                                            className="flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors"
                                        >
                                            <Shield className="w-4 h-4" />
                                            <span>Billing & Security</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar and Main Content */}
            <div className="flex pt-16">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-0'
                    } fixed lg:relative h-[calc(100vh-4rem)] glass-effect border-r border-white/10 transition-all duration-300 overflow-hidden lg:block z-40`}>
                    <div className="p-4 h-full overflow-y-auto">
                        {/* User Projects */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-400 mb-3">ACTIVE PROJECTS</h3>
                            <div className="space-y-2">
                                {projects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/dashboard/projects/${project.id}`}
                                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${project.status === 'active' ? 'bg-neon-green/10 border border-neon-green/20' :
                                                project.status === 'review' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                                                    'bg-green-500/10 border border-green-500/20'
                                            }`}
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{project.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${project.status === 'active' ? 'bg-neon-green' :
                                                                project.status === 'review' ? 'bg-yellow-500' :
                                                                    'bg-green-500'
                                                            }`}
                                                        style={{ width: `${project.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs">{project.progress}%</span>
                                            </div>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-neon-green' :
                                                project.status === 'review' ? 'bg-yellow-500' :
                                                    'bg-green-500'
                                            }`} />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Main Navigation */}
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${item.active
                                            ? 'bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border border-neon-green/30'
                                            : 'hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon className={`w-5 h-5 ${item.active ? 'text-neon-green' : 'text-gray-400'}`} />
                                        <span className={`${item.active ? 'font-semibold' : ''}`}>
                                            {item.title}
                                        </span>
                                    </div>
                                    {item.badge && (
                                        <span className="w-6 h-6 rounded-full bg-red-500 text-xs flex items-center justify-center">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Quick Actions */}
                        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
                            <h4 className="text-sm font-semibold mb-3">Quick Actions</h4>
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark text-sm font-semibold hover:opacity-90 transition-opacity">
                                    <Upload className="w-4 h-4" />
                                    Upload File
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 p-2 rounded-lg border border-neon-green text-neon-green text-sm font-semibold hover:bg-neon-green/10 transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                    New Message
                                </button>
                            </div>
                        </div>

                        {/* Storage Usage */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Storage</span>
                                <span className="text-sm font-medium">4.2/10 GB</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full" style={{ width: '42%' }} />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className={`flex-1 p-4 lg:p-8 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''
                    }`}>
                    {children}
                </main>
            </div>
        </div>
    )
}