'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function ConfirmedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-dark p-4">
            <div className="glass-effect rounded-2xl p-8 max-w-md text-center border border-neon-green/30">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                </div>

                <h1 className="text-3xl font-bold mb-4 gradient-text">
                    Email Confirmed!
                </h1>

                <p className="text-gray-400 mb-8">
                    Your email has been successfully confirmed. You can now login to your account.
                </p>

                <Link
                    href="/account/login"
                    className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    )
}