'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Code2, User, LogOut, LogIn, UserPlus, Settings, MessageSquare, ChevronDown, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)

    const router = useRouter()
    const { user, logout, isAuthenticated } = useAuth()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.profile-dropdown')) {
                setProfileDropdownOpen(false)
            }
            if (!e.target.closest('.account-dropdown')) {
                setAccountDropdownOpen(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
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

    const handleLogout = async () => {
        try {
            await logout()
            setProfileDropdownOpen(false)
            setAccountDropdownOpen(false)
            setIsOpen(false)
            router.push('/')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const handleNavigation = (href) => {
        setIsOpen(false)
        setProfileDropdownOpen(false)
        setAccountDropdownOpen(false)
        router.push(href)
    }

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-effect py-4' : 'py-6'
            }`}>
            <div className="container-custom px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 group"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="relative">
                            <Code2 className="w-10 h-10 text-neon-green group-hover:text-neon-blue transition-all duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-neon-green/20 rounded-full blur-md group-hover:bg-neon-blue/30 group-hover:scale-150 transition-all duration-300" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform inline-block">Algo X</span>
                            <p className="text-xs text-gray-400">Digital Solutions</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="relative text-gray-300 hover:text-neon-green transition-all duration-300 group px-2 py-1"
                            >
                                <span className="relative z-10 group-hover:scale-105 inline-block transition-transform">
                                    {item.label}
                                </span>
                                <span className="absolute inset-0 bg-neon-green/0 group-hover:bg-neon-green/10 rounded-lg transition-all duration-300 -z-0" />
                                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-neon-green group-hover:w-1/2 group-hover:left-0 transition-all duration-300" />
                                <span className="absolute -top-1 right-1/2 w-0 h-0.5 bg-neon-blue group-hover:w-1/2 group-hover:right-0 transition-all duration-300" />
                            </Link>
                        ))}

                        {/* Get Quote Button - Shouting and Boxed */}
                        <Link
                            href="/contact"
                            className="relative group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] transition-all duration-300 hover:scale-110 animate-pulse hover:animate-none border-2 border-white/20"
                        >
                            <span className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span className="relative">GET A QUOTE</span>
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full" />
                        </Link>

                        {/* Authentication - Hidden inside toggle */}
                        <div className="relative account-dropdown">
                            <button
                                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300 group"
                            >
                                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                                <span className="text-gray-300 group-hover:text-neon-green">Account</span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-300 ${accountDropdownOpen ? 'rotate-180 text-neon-green' : ''
                                    }`} />
                            </button>

                            {/* Account Dropdown */}
                            {accountDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 glass-effect rounded-lg border border-white/10 shadow-lg animate-fadeIn overflow-hidden">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="p-3 bg-gradient-to-r from-neon-green/10 to-neon-blue/10 border-b border-white/10">
                                                <p className="text-sm font-medium truncate">{user?.user_metadata?.name || 'User'}</p>
                                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setAccountDropdownOpen(false)
                                                    setProfileDropdownOpen(true)
                                                }}
                                                className="flex items-center gap-2 w-full p-3 hover:bg-white/10 transition-all duration-300 text-left group"
                                            >
                                                <User className="w-4 h-4 text-gray-400 group-hover:text-neon-green" />
                                                <span className="text-sm group-hover:text-neon-green">Profile</span>
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 w-full p-3 hover:bg-white/10 transition-all duration-300 text-left group border-t border-white/10"
                                            >
                                                <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                                                <span className="text-sm text-red-400 group-hover:text-red-300">Logout</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/account/login"
                                                onClick={() => setAccountDropdownOpen(false)}
                                                className="flex items-center gap-2 w-full p-3 hover:bg-white/10 transition-all duration-300 text-left group"
                                            >
                                                <LogIn className="w-4 h-4 text-gray-400 group-hover:text-neon-green" />
                                                <span className="text-sm group-hover:text-neon-green">Login</span>
                                            </Link>
                                            <Link
                                                href="/account/register"
                                                onClick={() => setAccountDropdownOpen(false)}
                                                className="flex items-center gap-2 w-full p-3 hover:bg-white/10 transition-all duration-300 text-left group border-t border-white/10"
                                            >
                                                <UserPlus className="w-4 h-4 text-gray-400 group-hover:text-neon-green" />
                                                <span className="text-sm group-hover:text-neon-green">Sign Up</span>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown (for authenticated users) */}
                        {isAuthenticated && profileDropdownOpen && (
                            <div className="absolute right-0 top-16 mt-2 w-64 glass-effect rounded-lg border border-white/10 shadow-lg animate-fadeIn profile-dropdown">
                                <div className="p-4 border-b border-white/10">
                                    <p className="font-medium">{user?.user_metadata?.name || 'User'}</p>
                                    <p className="text-sm text-gray-400 truncate">{user?.email}</p>
                                    <p className="text-xs text-neon-green mt-1 capitalize">
                                        {user?.user_metadata?.role || 'Member'}
                                    </p>
                                </div>
                                <div className="p-2">
                                    {/* Change Password Link */}
                                    <Link
                                        href="/account/change-password"
                                        onClick={() => {
                                            setProfileDropdownOpen(false)
                                            setAccountDropdownOpen(false)
                                        }}
                                        className="flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-all duration-300 group"
                                    >
                                        <Settings className="w-4 h-4 text-gray-400 group-hover:text-neon-green" />
                                        <span className="group-hover:text-neon-green">Change Password</span>
                                    </Link>

                                    {/* Dashboard for admin */}
                                    {user?.user_metadata?.role === 'admin' && (
                                        <Link
                                            href="/dashboard"
                                            onClick={() => {
                                                setProfileDropdownOpen(false)
                                                setAccountDropdownOpen(false)
                                            }}
                                            className="flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-all duration-300 group"
                                        >
                                            <Settings className="w-4 h-4 text-gray-400 group-hover:text-neon-green" />
                                            <span className="group-hover:text-neon-green">Dashboard</span>
                                        </Link>
                                    )}

                                    {/* Profile Settings */}
                                    <Link
                                        href="/profile"
                                        onClick={() => {
                                            setProfileDropdownOpen(false)
                                            setAccountDropdownOpen(false)
                                        }}
                                        className="flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-all duration-300 group"
                                    >
                                        <User className="w-4 h-4 text-gray-400 group-hover:text-neon-green" />
                                        <span className="group-hover:text-neon-green">Profile Settings</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-300 hover:text-neon-green transition-all duration-300 hover:scale-110"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden mt-6 pb-6 glass-effect rounded-2xl animate-slideDown">
                        <div className="flex flex-col space-y-2 px-4 pt-4">
                            {/* Navigation Links */}
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="relative py-3 px-4 rounded-lg hover:bg-white/5 hover:text-neon-green transition-all duration-300 group overflow-hidden"
                                >
                                    <span className="relative z-10">{item.label}</span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-neon-green/0 to-neon-blue/0 group-hover:from-neon-green/10 group-hover:to-neon-blue/10 transition-all duration-300" />
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-green group-hover:w-full transition-all duration-300" />
                                </Link>
                            ))}

                            {/* Get Quote Button in Mobile - Shouting */}
                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="relative group flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] transition-all duration-300 mt-4 border-2 border-white/20"
                            >
                                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                <span className="text-lg">GET A QUOTE NOW!</span>
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full" />
                            </Link>

                            {/* Mobile Authentication - Hidden in toggle */}
                            <div className="pt-4 border-t border-white/10">
                                <button
                                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                                    className="flex items-center justify-between w-full py-3 px-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                                >
                                    <span className="font-medium">Account</span>
                                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${accountDropdownOpen ? 'rotate-180 text-neon-green' : ''
                                        }`} />
                                </button>

                                {accountDropdownOpen && (
                                    <div className="mt-2 space-y-2 pl-4">
                                        {isAuthenticated ? (
                                            <>
                                                <div className="p-3 bg-gradient-to-r from-neon-green/10 to-neon-blue/10 rounded-lg">
                                                    <p className="font-medium">{user?.user_metadata?.name || 'User'}</p>
                                                    <p className="text-sm text-gray-400 truncate">{user?.email}</p>
                                                </div>
                                                <Link
                                                    href="/account/change-password"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-white/5 transition-all duration-300"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    Change Password
                                                </Link>
                                                <Link
                                                    href="/profile"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-white/5 transition-all duration-300"
                                                >
                                                    <User className="w-4 h-4" />
                                                    Profile Settings
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-white/5 transition-all duration-300 text-red-400 w-full text-left"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href="/account/login"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-white/5 transition-all duration-300"
                                                >
                                                    <LogIn className="w-4 h-4" />
                                                    Login
                                                </Link>
                                                <Link
                                                    href="/account/register"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-white/5 transition-all duration-300"
                                                >
                                                    <UserPlus className="w-4 h-4" />
                                                    Sign Up
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar