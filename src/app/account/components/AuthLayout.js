'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lock, User, Key, Mail } from 'lucide-react'

const AuthLayout = ({ children, title, subtitle, icon: Icon }) => {
    const pathname = usePathname()
    
    const getIcon = () => {
        if (Icon) return Icon
        switch(pathname) {
            case '/account/login':
                return Lock
            case '/account/register':
                return User
            case '/account/forgot-password':
                return Mail
            case '/account/reset-password':
                return Key
            case '/account/change-password':
                return Key
            default:
                return Lock
        }
    }
    
    const IconComponent = getIcon()
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-dark">
            <div className="glass-effect rounded-2xl w-full max-w-md border border-white/10 shadow-2xl animate-fadeIn">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-green/20 to-neon-blue/20 flex items-center justify-center mx-auto mb-4">
                            <IconComponent className="w-8 h-8 text-neon-green" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{title}</h2>
                        <p className="text-gray-400">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthLayout