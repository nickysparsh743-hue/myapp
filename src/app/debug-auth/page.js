'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export default function DebugAll() {
    const [results, setResults] = useState({})
    const [loading, setLoading] = useState({})
    const [testEmail, setTestEmail] = useState('')
    const { user, session, isAuthenticated } = useAuth()
    const supabase = createClient()

    // Test 1: Check Environment Variables
    const testEnv = () => {
        setLoading(prev => ({ ...prev, env: true }))
        try {
            const envCheck = {
                supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
                supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
                siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            }
            setResults(prev => ({ ...prev, env: envCheck }))
        } catch (error) {
            setResults(prev => ({ ...prev, env: { error: error.message } }))
        } finally {
            setLoading(prev => ({ ...prev, env: false }))
        }
    }

    // Test 2: Check Supabase Connection
    const testConnection = async () => {
        setLoading(prev => ({ ...prev, connection: true }))
        try {
            const { data, error } = await supabase.auth.getSession()
            setResults(prev => ({
                ...prev,
                connection: {
                    success: !error,
                    error: error?.message,
                    hasSession: !!data?.session
                }
            }))
        } catch (error) {
            setResults(prev => ({ ...prev, connection: { error: error.message } }))
        } finally {
            setLoading(prev => ({ ...prev, connection: false }))
        }
    }

    // Test 3: Check Auth Context
    const testAuthContext = () => {
        setResults(prev => ({
            ...prev,
            authContext: {
                isAuthenticated,
                hasUser: !!user,
                userEmail: user?.email,
                hasSession: !!session,
                loading: loading.authContext
            }
        }))
    }

    // Test 4: Check Profiles Table
    const testProfiles = async () => {
        setLoading(prev => ({ ...prev, profiles: true }))
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('count')
                .limit(1)

            setResults(prev => ({
                ...prev,
                profiles: {
                    success: !error,
                    error: error?.message,
                    accessible: !error
                }
            }))
        } catch (error) {
            setResults(prev => ({ ...prev, profiles: { error: error.message } }))
        } finally {
            setLoading(prev => ({ ...prev, profiles: false }))
        }
    }

    // Test 5: Check Auth Users
    const testAuthUsers = async () => {
        setLoading(prev => ({ ...prev, authUsers: true }))
        try {
            // This will fail if not admin - that's okay
            const { data, error } = await supabase
                .from('users')
                .select('count')
                .limit(1)

            setResults(prev => ({
                ...prev,
                authUsers: {
                    note: 'This may fail if not admin - normal',
                    success: !error,
                    error: error?.message
                }
            }))
        } catch (error) {
            setResults(prev => ({ ...prev, authUsers: { error: error.message } }))
        } finally {
            setLoading(prev => ({ ...prev, authUsers: false }))
        }
    }

    // Test 6: Test Registration Flow (without actually registering)
    const testRegistrationFlow = () => {
        const redirectUrl = `${window.location.origin}/auth/callback`
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

        setResults(prev => ({
            ...prev,
            registrationFlow: {
                redirectTo: redirectUrl,
                siteUrl: siteUrl,
                callbackExists: 'Check manually: /auth/callback',
                notes: 'Make sure this matches your Supabase settings'
            }
        }))
    }

    // Test 7: Check Current User Profile
    const testCurrentProfile = async () => {
        if (!user) {
            setResults(prev => ({
                ...prev,
                currentProfile: { note: 'Not logged in' }
            }))
            return
        }

        setLoading(prev => ({ ...prev, currentProfile: true }))
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            setResults(prev => ({
                ...prev,
                currentProfile: {
                    success: !error,
                    error: error?.message,
                    profile: data || null
                }
            }))
        } catch (error) {
            setResults(prev => ({ ...prev, currentProfile: { error: error.message } }))
        } finally {
            setLoading(prev => ({ ...prev, currentProfile: false }))
        }
    }

    // Test 8: Manual Registration Test
    const testManualRegistration = async () => {
        if (!testEmail) {
            alert('Please enter a test email')
            return
        }

        setLoading(prev => ({ ...prev, manualReg: true }))
        try {
            console.log('🔵 Testing registration for:', testEmail)

            const { data, error } = await supabase.auth.signUp({
                email: testEmail,
                password: 'Test123!',
                options: {
                    data: {
                        name: 'Test User',
                        role: 'user'
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            })

            setResults(prev => ({
                ...prev,
                manualReg: {
                    success: !error,
                    error: error?.message,
                    user: data?.user ? {
                        id: data.user.id,
                        email: data.user.email,
                        needsConfirmation: !data.session
                    } : null,
                    session: !!data?.session
                }
            }))

            console.log('🔵 Registration result:', { data, error })
        } catch (error) {
            setResults(prev => ({ ...prev, manualReg: { error: error.message } }))
        } finally {
            setLoading(prev => ({ ...prev, manualReg: false }))
        }
    }

    // Run all tests
    const runAllTests = () => {
        testEnv()
        testConnection()
        testAuthContext()
        testProfiles()
        testAuthUsers()
        testRegistrationFlow()
        if (user) testCurrentProfile()
    }

    useEffect(() => {
        runAllTests()
    }, [user])

    return (
        <div className="min-h-screen bg-dark text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-2 gradient-text">🔍 One-Click Debug</h1>
                <p className="text-gray-400 mb-8">Run all tests at once to identify issues</p>

                {/* Control Panel */}
                <div className="glass-effect rounded-2xl p-6 mb-8">
                    <div className="flex gap-4 flex-wrap">
                        <button
                            onClick={runAllTests}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold"
                        >
                            🔄 Run All Tests
                        </button>

                        <div className="flex-1 flex gap-2">
                            <input
                                type="email"
                                placeholder="Test email for registration"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10"
                            />
                            <button
                                onClick={testManualRegistration}
                                disabled={loading.manualReg}
                                className="px-4 py-3 rounded-lg border border-neon-green text-neon-green hover:bg-neon-green/10"
                            >
                                {loading.manualReg ? 'Testing...' : 'Test Registration'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Environment Variables */}
                    <div className="glass-effect rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-neon-green rounded-full"></span>
                            Environment
                        </h3>
                        {results.env ? (
                            <div className="space-y-2 text-sm">
                                <p>URL: {results.env.supabaseUrl}</p>
                                <p>Key: {results.env.supabaseKey}</p>
                                <p>Site: {results.env.siteUrl}</p>
                            </div>
                        ) : (
                            <p className="text-gray-400">Waiting...</p>
                        )}
                    </div>

                    {/* Supabase Connection */}
                    <div className="glass-effect rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-neon-green rounded-full"></span>
                            Connection
                        </h3>
                        {results.connection ? (
                            <div>
                                <p className={results.connection.success ? 'text-green-400' : 'text-red-400'}>
                                    {results.connection.success ? '✅ Connected' : '❌ Failed'}
                                </p>
                                {results.connection.error && (
                                    <p className="text-red-400 text-sm mt-2">{results.connection.error}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-400">Waiting...</p>
                        )}
                    </div>

                    {/* Auth Context */}
                    <div className="glass-effect rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-neon-green rounded-full"></span>
                            Auth Context
                        </h3>
                        {results.authContext ? (
                            <div className="space-y-2 text-sm">
                                <p>Authenticated: {results.authContext.isAuthenticated ? '✅' : '❌'}</p>
                                <p>User: {results.authContext.userEmail || 'None'}</p>
                                <p>Session: {results.authContext.hasSession ? '✅' : '❌'}</p>
                            </div>
                        ) : (
                            <p className="text-gray-400">Waiting...</p>
                        )}
                    </div>

                    {/* Profiles Table */}
                    <div className="glass-effect rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-neon-green rounded-full"></span>
                            Profiles Table
                        </h3>
                        {results.profiles ? (
                            <div>
                                <p className={results.profiles.success ? 'text-green-400' : 'text-red-400'}>
                                    {results.profiles.success ? '✅ Accessible' : '❌ Not Accessible'}
                                </p>
                                {results.profiles.error && (
                                    <p className="text-red-400 text-sm mt-2">{results.profiles.error}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-400">Waiting...</p>
                        )}
                    </div>

                    {/* Current Profile */}
                    {results.currentProfile && (
                        <div className="glass-effect rounded-xl p-6 md:col-span-2">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-neon-green rounded-full"></span>
                                Your Profile
                            </h3>
                            {results.currentProfile.profile ? (
                                <pre className="bg-black/30 p-4 rounded-lg text-xs overflow-auto">
                                    {JSON.stringify(results.currentProfile.profile, null, 2)}
                                </pre>
                            ) : (
                                <p className="text-gray-400">No profile found</p>
                            )}
                        </div>
                    )}

                    {/* Registration Flow */}
                    <div className="glass-effect rounded-xl p-6 md:col-span-2">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-neon-green rounded-full"></span>
                            Registration Flow
                        </h3>
                        {results.registrationFlow && (
                            <div className="space-y-2 text-sm">
                                <p>Redirect URL: <span className="text-neon-green">{results.registrationFlow.redirectTo}</span></p>
                                <p>Site URL: {results.registrationFlow.siteUrl}</p>
                                <p className="text-yellow-400">⚠️ Make sure this matches your Supabase settings:</p>
                                <p className="text-xs text-gray-400">
                                    Go to Supabase Dashboard → Authentication → URL Configuration<br />
                                    Add {results.registrationFlow.redirectTo} to redirect URLs
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Manual Registration Result */}
                    {results.manualReg && (
                        <div className="glass-effect rounded-xl p-6 md:col-span-2">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-neon-green rounded-full"></span>
                                Registration Test Result
                            </h3>
                            <div className={`p-4 rounded-lg ${results.manualReg.success ? 'bg-green-500/10' : 'bg-red-500/10'
                                }`}>
                                <p className="font-bold mb-2">
                                    {results.manualReg.success ? '✅ Success' : '❌ Failed'}
                                </p>
                                {results.manualReg.error && (
                                    <p className="text-red-400 mb-2">{results.manualReg.error}</p>
                                )}
                                {results.manualReg.user && (
                                    <div className="text-sm space-y-1">
                                        <p>User ID: {results.manualReg.user.id}</p>
                                        <p>Email: {results.manualReg.user.email}</p>
                                        <p>Needs Confirmation: {results.manualReg.user.needsConfirmation ? '✅' : '❌'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Fixes */}
                <div className="mt-8 glass-effect rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">🚀 Quick Fixes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => window.open('https://app.supabase.com/project/_/auth/url-configuration', '_blank')}
                            className="p-3 rounded-lg border border-white/10 hover:border-neon-green/30 text-left"
                        >
                            <p className="font-bold mb-1">1. Check Redirect URLs</p>
                            <p className="text-xs text-gray-400">Add /auth/callback to Supabase</p>
                        </button>

                        <button
                            onClick={() => window.location.href = '/auth/callback'}
                            className="p-3 rounded-lg border border-white/10 hover:border-neon-green/30 text-left"
                        >
                            <p className="font-bold mb-1">2. Test Callback Page</p>
                            <p className="text-xs text-gray-400">Check if /auth/callback works</p>
                        </button>

                        <button
                            onClick={() => {
                                localStorage.clear()
                                sessionStorage.clear()
                                window.location.reload()
                            }}
                            className="p-3 rounded-lg border border-white/10 hover:border-neon-green/30 text-left"
                        >
                            <p className="font-bold mb-1">3. Clear Local Storage</p>
                            <p className="text-xs text-gray-400">Reset auth state</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}