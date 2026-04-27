'use client'

import { useState } from 'react'
import { AlertTriangle, Loader } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeleteAccountModal({ isOpen, onClose, userId }) {
    const [confirmed, setConfirmed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const supabase = createClient()
    const router = useRouter()

    const handleDeleteAccount = async () => {
        if (!confirmed || !userId) {
            setError('Please confirm account deletion')
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Call the delete account API endpoint
            const response = await fetch('/api/auth/delete-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete account')
            }

            // Sign out the user
            await supabase.auth.signOut()

            // Redirect to home page
            router.push('/')
        } catch (err) {
            setError(err.message || 'Failed to delete account')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setConfirmed(false)
        setError(null)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg border border-red-500/20 max-w-md w-full mx-4 p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <h2 className="text-xl font-bold text-white">Delete Account</h2>
                </div>

                {/* Warning message */}
                <p className="text-gray-400 mb-4">
                    This action cannot be undone. All your data will be permanently deleted from our servers.
                </p>

                {/* Error message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Confirmation checkbox */}
                <div className="mb-6 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={confirmed}
                            onChange={(e) => setConfirmed(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-600"
                            disabled={loading}
                        />
                        <span className="text-sm text-gray-300">
                            I understand that this is permanent and cannot be reversed
                        </span>
                    </label>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={!confirmed || loading}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader className="w-4 h-4 animate-spin" />}
                        {loading ? 'Deleting...' : 'Delete Account'}
                    </button>
                </div>
            </div>
        </div>
    )
}
