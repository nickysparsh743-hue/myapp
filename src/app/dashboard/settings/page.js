'use client'

import { useState, useEffect } from 'react'
import {
    Save, Bell, Shield, User, Mail,
    Globe, CreditCard, Database, Palette,
    Smartphone, Lock, Eye, EyeOff, Key,
    Trash2, Download, Upload, Check,
    X, AlertTriangle, Info, Moon, Sun
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
    const { user, loading: authLoading } = useAuth()
    const supabase = createClient()
    const router = useRouter()

    const [activeTab, setActiveTab] = useState('profile')
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [showPassword, setShowPassword] = useState(false)

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        role: '',
        timezone: 'Africa/Nairobi',
        language: 'English',
        theme: 'dark',
        bio: ''
    })

    const [security, setSecurity] = useState({
        twoFactor: false,
        loginAlerts: true,
        sessionTimeout: 30,
        passwordLastChanged: null
    })

    const [notifications, setNotifications] = useState({
        email: {
            projectUpdates: true,
            messages: true,
            milestones: true,
            security: true,
            marketing: false
        },
        push: {
            projectUpdates: true,
            messages: false,
            milestones: true,
            security: true
        }
    })

    const [privacy, setPrivacy] = useState({
        showOnlineStatus: true,
        dataSharing: true,
        profileVisibility: 'public',
        activityTracking: true
    })

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/account/login')
        }
    }, [user, authLoading, router])

    // Fetch settings data
    useEffect(() => {
        const fetchSettings = async () => {
            if (!user) return

            try {
                setLoading(true)
                setError(null)

                // Fetch profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (profileError && profileError.code !== 'PGRST116') {
                    console.error('Error fetching profile:', profileError)
                }

                // Fetch notification preferences
                const { data: notifData, error: notifError } = await supabase
                    .from('notification_preferences')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()

                if (notifError && notifError.code !== 'PGRST116') {
                    console.error('Error fetching notifications:', notifError)
                }

                // Fetch privacy settings
                const { data: privacyData, error: privacyError } = await supabase
                    .from('privacy_settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()

                if (privacyError && privacyError.code !== 'PGRST116') {
                    console.error('Error fetching privacy:', privacyError)
                }

                // Update profile state
                setProfile({
                    name: profileData?.name || user.user_metadata?.name || user.email?.split('@')[0] || '',
                    email: user.email || '',
                    phone: profileData?.phone || '',
                    company: profileData?.company || '',
                    role: profileData?.role || user.user_metadata?.role || 'user',
                    timezone: profileData?.timezone || 'Africa/Nairobi',
                    language: profileData?.language || 'English',
                    theme: profileData?.theme || 'dark',
                    bio: profileData?.bio || ''
                })

                // Update security state
                setSecurity({
                    twoFactor: profileData?.two_factor_enabled || false,
                    loginAlerts: profileData?.login_alerts !== false,
                    sessionTimeout: profileData?.session_timeout || 30,
                    passwordLastChanged: user?.updated_at || new Date().toISOString().split('T')[0]
                })

                // Update notifications
                if (notifData) {
                    setNotifications({
                        email: notifData.email || notifications.email,
                        push: notifData.push || notifications.push
                    })
                }

                // Update privacy
                if (privacyData) {
                    setPrivacy(privacyData)
                }

            } catch (err) {
                console.error('Error fetching settings:', err)
                setError('Failed to load settings')
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [user, supabase])

    const handleSave = async () => {
        try {
            setSaving(true)
            setError(null)

            // Update profile
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    name: profile.name,
                    phone: profile.phone,
                    company: profile.company,
                    role: profile.role,
                    timezone: profile.timezone,
                    language: profile.language,
                    theme: profile.theme,
                    bio: profile.bio,
                    updated_at: new Date().toISOString()
                })

            if (profileError) throw profileError

            // Update notification preferences
            const { error: notifError } = await supabase
                .from('notification_preferences')
                .upsert({
                    user_id: user.id,
                    email: notifications.email,
                    push: notifications.push,
                    updated_at: new Date().toISOString()
                })

            if (notifError) throw notifError

            // Update privacy settings
            const { error: privacyError } = await supabase
                .from('privacy_settings')
                .upsert({
                    user_id: user.id,
                    ...privacy,
                    updated_at: new Date().toISOString()
                })

            if (privacyError) throw privacyError

            // Update security settings in profile
            const { error: securityError } = await supabase
                .from('profiles')
                .update({
                    two_factor_enabled: security.twoFactor,
                    login_alerts: security.loginAlerts,
                    session_timeout: security.sessionTimeout,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (securityError) throw securityError

            setSuccess('Settings saved successfully!')
            setTimeout(() => setSuccess(null), 3000)

        } catch (err) {
            console.error('Error saving settings:', err)
            setError('Failed to save settings. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handlePasswordChange = async () => {
        router.push('/account/change-password')
    }

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return
        }

        try {
            setLoading(true)
            
            // Call your delete account API
            const { error } = await supabase.auth.admin.deleteUser(user.id)
            
            if (error) throw error

            // Sign out
            await supabase.auth.signOut()
            router.push('/')
            
        } catch (err) {
            console.error('Error deleting account:', err)
            setError('Failed to delete account. Please contact support.')
        } finally {
            setLoading(false)
        }
    }

    const handleExportData = async () => {
        try {
            setLoading(true)
            
            // Fetch all user data
            const [projects, documents, activities] = await Promise.all([
                supabase.from('projects').select('*').eq('user_id', user.id),
                supabase.from('documents').select('*').eq('user_id', user.id),
                supabase.from('activities').select('*').eq('user_id', user.id)
            ])

            const exportData = {
                profile: profile,
                projects: projects.data,
                documents: documents.data,
                activities: activities.data,
                exported_at: new Date().toISOString()
            }

            // Create and download file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

        } catch (err) {
            console.error('Error exporting data:', err)
            setError('Failed to export data')
        } finally {
            setLoading(false)
        }
    }

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading settings...</p>
                </div>
            </div>
        )
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'privacy', label: 'Privacy', icon: Database }
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Settings</h1>
                    <p className="text-gray-400">Manage your account settings and preferences</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>{success}</span>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="lg:w-1/4">
                    <div className="glass-effect rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center">
                                    <User className="w-6 h-6 text-dark" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{profile.name || 'User'}</h3>
                                    <p className="text-sm text-gray-400">{profile.email}</p>
                                </div>
                            </div>
                        </div>

                        <nav className="p-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === tab.id
                                                ? 'bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border border-neon-green/30'
                                                : 'hover:bg-white/10'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{tab.label}</span>
                                    </button>
                                )
                            })}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:w-3/4 space-y-8">
                    {/* Profile Settings */}
                    {activeTab === 'profile' && (
                        <div className="glass-effect rounded-2xl p-8 border border-white/10">
                            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 opacity-50 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Company</label>
                                        <input
                                            type="text"
                                            value={profile.company}
                                            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                            placeholder="Your company"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Timezone</label>
                                        <select
                                            value={profile.timezone}
                                            onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                        >
                                            <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                                            <option value="UTC">UTC</option>
                                            <option value="America/New_York">America/New_York (EST)</option>
                                            <option value="Europe/London">Europe/London (GMT)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Language</label>
                                        <select
                                            value={profile.language}
                                            onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                        >
                                            <option value="English">English</option>
                                            <option value="Spanish">Spanish</option>
                                            <option value="French">French</option>
                                            <option value="Swahili">Swahili</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Bio</label>
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        placeholder="Tell us about yourself..."
                                        rows="4"
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div className="glass-effect rounded-2xl p-8 border border-white/10">
                            <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

                            <div className="space-y-8">
                                {/* Password */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Password</h3>
                                    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="font-medium">Password</p>
                                                <p className="text-sm text-gray-400">
                                                    Last changed: {security.passwordLastChanged || 'Never'}
                                                </p>
                                            </div>
                                            <button
                                                onClick={handlePasswordChange}
                                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity"
                                            >
                                                Change Password
                                            </button>
                                        </div>

                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value="••••••••"
                                                readOnly
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none pr-12"
                                            />
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Two-Factor Authentication */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Two-Factor Authentication</h3>
                                    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="font-medium">2FA Status</p>
                                                <p className="text-sm text-gray-400">
                                                    Add an extra layer of security to your account
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={security.twoFactor}
                                                    onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                                            </label>
                                        </div>

                                        {security.twoFactor && (
                                            <div className="p-4 rounded-lg bg-gradient-to-r from-neon-green/10 to-neon-blue/10 border border-neon-green/20">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Check className="w-5 h-5 text-neon-green" />
                                                    <p className="font-medium">2FA is enabled</p>
                                                </div>
                                                <p className="text-sm text-gray-300">
                                                    Use your authenticator app to generate verification codes
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Login Alerts */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Login Alerts</h3>
                                    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="font-medium">Email Notifications</p>
                                                <p className="text-sm text-gray-400">
                                                    Get notified of new logins to your account
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={security.loginAlerts}
                                                    onChange={(e) => setSecurity({ ...security, loginAlerts: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Session Management */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Session Management</h3>
                                    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                        <div className="mb-4">
                                            <p className="font-medium">Session Timeout</p>
                                            <p className="text-sm text-gray-400 mb-3">
                                                Automatically log out after period of inactivity
                                            </p>
                                            <div className="flex items-center gap-4">
                                                {[15, 30, 60, 120].map((minutes) => (
                                                    <label key={minutes} className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="timeout"
                                                            checked={security.sessionTimeout === minutes}
                                                            onChange={() => setSecurity({ ...security, sessionTimeout: minutes })}
                                                            className="w-4 h-4 text-neon-green bg-white/5 border-white/10"
                                                        />
                                                        <span>{minutes} minutes</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center gap-2">
                                                <X className="w-4 h-4" />
                                                Log Out All Sessions
                                            </button>
                                            <button
                                                onClick={handleExportData}
                                                className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center gap-2"
                                            >
                                                <Download className="w-4 h-4" />
                                                Export Login History
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Settings */}
                    {activeTab === 'notifications' && (
                        <div className="glass-effect rounded-2xl p-8 border border-white/10">
                            <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>

                            <div className="space-y-8">
                                {/* Email Notifications */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <Mail className="w-5 h-5" />
                                        Email Notifications
                                    </h3>
                                    <div className="space-y-4">
                                        {Object.entries(notifications.email).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                                <div>
                                                    <p className="font-medium">
                                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        Receive email notifications for {key.toLowerCase().replace(/([A-Z])/g, ' $1')}
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={value}
                                                        onChange={(e) => setNotifications({
                                                            ...notifications,
                                                            email: { ...notifications.email, [key]: e.target.checked }
                                                        })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Push Notifications */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <Bell className="w-5 h-5" />
                                        Push Notifications
                                    </h3>
                                    <div className="space-y-4">
                                        {Object.entries(notifications.push).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                                <div>
                                                    <p className="font-medium">
                                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        Receive push notifications for {key.toLowerCase().replace(/([A-Z])/g, ' $1')}
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={value}
                                                        onChange={(e) => setNotifications({
                                                            ...notifications,
                                                            push: { ...notifications.push, [key]: e.target.checked }
                                                        })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quiet Hours */}
                                <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                    <h4 className="font-bold mb-4">Quiet Hours</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm mb-2">Start Time</label>
                                            <input
                                                type="time"
                                                defaultValue="22:00"
                                                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm mb-2">End Time</label>
                                            <input
                                                type="time"
                                                defaultValue="08:00"
                                                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <div className="glass-effect rounded-2xl p-8 border border-white/10">
                            <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>

                            <div className="space-y-8">
                                {/* Data Export */}
                                <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold mb-2">Export Your Data</h3>
                                            <p className="text-gray-400">
                                                Download all your data including projects, documents, and messages
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleExportData}
                                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Export Data
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Your data will be downloaded as a JSON file.
                                    </p>
                                </div>

                                {/* Data Deletion */}
                                <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold mb-2">Delete Account</h3>
                                            <p className="text-gray-400">
                                                Permanently delete your account and all associated data
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete Account
                                        </button>
                                    </div>
                                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-red-400 mb-2">Warning: This action is irreversible</p>
                                                <p className="text-sm text-gray-300">
                                                    All your projects, files, messages, and account data will be permanently deleted.
                                                    This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Privacy Toggles */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold">Privacy Controls</h3>

                                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                        <div>
                                            <p className="font-medium">Show Online Status</p>
                                            <p className="text-sm text-gray-400">
                                                Allow team members to see when you're online
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={privacy.showOnlineStatus}
                                                onChange={(e) => setPrivacy({ ...privacy, showOnlineStatus: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                        <div>
                                            <p className="font-medium">Data Sharing</p>
                                            <p className="text-sm text-gray-400">
                                                Allow anonymized data to improve our services
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={privacy.dataSharing}
                                                onChange={(e) => setPrivacy({ ...privacy, dataSharing: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                        <div>
                                            <p className="font-medium">Activity Tracking</p>
                                            <p className="text-sm text-gray-400">
                                                Allow tracking of your activity for analytics
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={privacy.activityTracking}
                                                onChange={(e) => setPrivacy({ ...privacy, activityTracking: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}