'use client'

import { AlertCircle, CheckCircle } from 'lucide-react'

const Message = ({ type, text }) => {
    if (!text) return null

    const isError = type === 'error'

    return (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${isError
                ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                : 'bg-green-500/10 border border-green-500/20 text-green-400'
            }`}>
            {isError ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm">{text}</span>
        </div>
    )
}

export default Message