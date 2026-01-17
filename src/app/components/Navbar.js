'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Code2, User, LogOut, LogIn, UserPlus, Settings, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState('login') // 'login', 'register', 'forgot-password'

    const { user, logout, isAuthenticated } = useAuth()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Terms', href: '/terms' },
        { label: 'Privacy', href: '/privacy' },
    ]

    const handleAuthClick = (mode = 'login') => {
        setAuthMode(mode)
        setAuthModalOpen(true)
        setIsOpen(false)
    }

    const handleLogout = () => {
        logout()
        setIsOpen(false)
    }

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-effect py-4' : 'py-6'
                }`}>
                <div className="container-custom px-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="relative">
                                <Code2 className="w-10 h-10 text-neon-green group-hover:text-neon-blue transition-colors duration-300" />
                                <div className="absolute inset-0 bg-neon-green/20 rounded-full blur-md group-hover:bg-neon-blue/20 transition-colors duration-300" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold gradient-text">Algo X</span>
                                <p className="text-xs text-gray-400">Digital Solutions</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="relative text-gray-300 hover:text-neon-green transition-colors duration-300 group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-green group-hover:w-full transition-all duration-300" />
                                </Link>
                            ))}

                            {/* Get Quote Button - Added at top */}
                            <Link
                                href="/contact"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity ml-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Get a Quote
                            </Link>

                            {/* Authentication Buttons */}
                            <div className="flex items-center gap-3">
                                {isAuthenticated ? (
                                    <div className="relative group">
                                        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center">
                                                <User className="w-4 h-4 text-dark" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                                                <p className="text-xs text-gray-400 capitalize">{user?.role || 'Member'}</p>
                                            </div>
                                        </button>

                                        <div className="absolute right-0 mt-2 w-64 glass-effect rounded-lg border border-white/10 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                            <div className="p-4 border-b border-white/10">
                                                <p className="font-medium">{user?.name}</p>
                                                <p className="text-sm text-gray-400">{user?.email}</p>
                                                <p className="text-xs text-neon-green mt-1 capitalize">{user?.role}</p>
                                            </div>
                                            <div className="p-2">
                                                {user?.role === 'admin' && (
                                                    <Link
                                                        href="/dashboard"
                                                        className="flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors"
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        <span>Dashboard</span>
                                                    </Link>
                                                )}
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors"
                                                >
                                                    <User className="w-4 h-4" />
                                                    <span>My Profile</span>
                                                </Link>
                                                <Link
                                                    href="/settings"
                                                    className="flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    <span>Settings</span>
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors w-full text-left text-red-400"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleAuthClick('login')}
                                            className="px-4 py-2 rounded-lg border border-neon-green text-neon-green hover:bg-neon-green/10 transition-colors flex items-center gap-2"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            Login
                                        </button>
                                        <button
                                            onClick={() => handleAuthClick('register')}
                                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Sign Up
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden text-gray-300 hover:text-neon-green transition-colors duration-300"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isOpen && (
                        <div className="md:hidden mt-6 pb-6 glass-effect rounded-2xl">
                            <div className="flex flex-col space-y-4 px-4 pt-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="py-3 px-4 rounded-lg hover:bg-white/5 hover:text-neon-green transition-all duration-300"
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                {/* Get Quote Button in Mobile Menu - At the top */}
                                <Link
                                    href="/contact"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Get a Quote
                                </Link>

                                {isAuthenticated ? (
                                    <>
                                        <div className="pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center">
                                                    <User className="w-5 h-5 text-dark" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user?.name}</p>
                                                    <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
                                                </div>
                                            </div>
                                            <Link
                                                href="/profile"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-2 py-3 px-4 rounded-lg hover:bg-white/5 transition-all duration-300"
                                            >
                                                <User className="w-4 h-4" />
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/settings"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-2 py-3 px-4 rounded-lg hover:bg-white/5 transition-all duration-300"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 py-3 px-4 rounded-lg hover:bg-white/5 transition-all duration-300 text-red-400 w-full text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="pt-4 border-t border-white/10">
                                        <button
                                            onClick={() => handleAuthClick('login')}
                                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-neon-green text-neon-green hover:bg-neon-green/10 transition-all duration-300 w-full mb-3"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            Login
                                        </button>
                                        <button
                                            onClick={() => handleAuthClick('register')}
                                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-all duration-300 w-full"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Sign Up
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Auth Modal */}
            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                mode={authMode}
                onModeChange={setAuthMode}
            />
        </>
    )
}

export default Navbar