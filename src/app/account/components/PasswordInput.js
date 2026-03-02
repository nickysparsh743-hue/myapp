'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

const PasswordInput = ({ 
    name, 
    value, 
    onChange, 
    placeholder,
    label,
    showToggle = true,
    required = false
}) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div>
            {label && <label className="block text-sm font-medium mb-2">{label}</label>}
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none transition-colors"
                />
                {showToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-neon-green transition-colors"
                        tabIndex="-1"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

export default PasswordInput