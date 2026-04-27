'use client'

import { useState, useEffect } from 'react'
import {
    Save, Bell, Shield, User, Mail,
    Globe, CreditCard, Database, Palette,
    Smartphone, Lock, Eye, EyeOff, Key,
    Trash2, Download, Upload, Check,
    X, AlertTriangle, Info, Moon, Sun,
    BookOpen, Award, Briefcase, Plus
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import DeleteAccountModal from '@/components/DeleteAccountModal' // We'll create this

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
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // Profile state - matching database schema
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        role: '',
        title: '',
        department: '',
        years_of_experience: 0,
        location: '',
        website: '',
        bio: '',
        avatar: '',
        timezone: 'UTC',
        language: 'en',
        theme: 'dark',
        status: 'active',
        specialization: '',
        team_preference: [],
        social: {
            github: '',
            behance: '',
            twitter: '',
            dribbble: '',
            linkedin: ''
        }
    })

    const specializations = [
        'Web Development',
        'Mobile Apps',
        'AI & ML Solutions',
        'Data Analytics',
        'Cybersecurity',
        'Bots & Automation',
        'Graphics & UI/UX',
        'Writing Services',
        'Database Services'
    ]
    const [contactPrefs, setContactPrefs] = useState({
        team_messages: true,
        weekly_reports: true,
        project_updates: true,
        push_notifications: true,
        email_notifications: true
    })

    // Privacy settings - matching profiles.privacy_settings JSONB
    const [privacySettings, setPrivacySettings] = useState({
        data_sharing: 'limited',
        activity_status: true,
        profile_visibility: 'public',
        contact_info_visibility: 'team_only'
    })

    // Security state
    const [security, setSecurity] = useState({
        twoFactorEnabled: false,
        twoFactorMethod: 'app',
        loginAlerts: true,
        sessionTimeout: 30,
        passwordLastChanged: null
    })

    // Notification preferences - matching notification_preferences table
    const [notifications, setNotifications] = useState({
        email: {
            project_updates: true,
            messages: true,
            milestones: true,
            security: true,
            marketing: false
        },
        push: {
            project_updates: true,
            messages: false,
            milestones: true,
            security: true
        }
    })

    // Privacy controls - matching privacy_settings table
    const [privacy, setPrivacy] = useState({
        show_online_status: true,
        data_sharing: true,
        profile_visibility: 'public',
        activity_tracking: true
    })

    // Sessions state
    const [sessions, setSessions] = useState([])

    // Education state
    const [education, setEducation] = useState([])
    const [newEducation, setNewEducation] = useState({
        institution: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        current: false,
        grade: '',
        achievements: [],
        description: ''
    })

    // Skills state
    const [skills, setSkills] = useState([])
    const [newSkill, setNewSkill] = useState({
        name: '',
        level: 50,
        type: 'technical',
        category: ''
    })

    // Certifications state
    const [certifications, setCertifications] = useState([])
    const [newCertification, setNewCertification] = useState({
        name: '',
        issuer: '',
        year: new Date().getFullYear(),
        credential_id: '',
        credential_url: '',
        does_not_expire: false
    })

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/account/login')
        }
    }, [user, authLoading, router])

    // Fetch all settings data
    useEffect(() => {
        const fetchSettings = async () => {
            if (!user) return

            try {
                setLoading(true)
                setError(null)

                // Fetch profile with all fields
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

                // Fetch user sessions
                const { data: sessionsData, error: sessionsError } = await supabase
                    .from('user_sessions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('last_active', { ascending: false })
                    .limit(10)

                if (!sessionsError && sessionsData) {
                    setSessions(sessionsData)
                }

                // Update profile state with all fields from database
                setProfile({
                    name: profileData?.name || user.user_metadata?.name || user.email?.split('@')[0] || '',
                    email: user.email || '',
                    phone: profileData?.phone || '',
                    company: profileData?.company || '',
                    role: profileData?.role || user.user_metadata?.role || 'User',
                    title: profileData?.title || '',
                    department: profileData?.department || '',
                    years_of_experience: profileData?.years_of_experience || 0,
                    location: profileData?.location || '',
                    website: profileData?.website || '',
                    bio: profileData?.bio || '',
                    avatar: profileData?.avatar || '👤',
                    timezone: profileData?.timezone || 'UTC',
                    language: profileData?.language || 'en',
                    theme: profileData?.theme || 'dark',
                    status: profileData?.status || 'active',
                    specialization: profileData?.specialization || '',
                    team_preference: profileData?.team_preference || [],
                    social: profileData?.social || {
                        github: '',
                        behance: '',
                        twitter: '',
                        dribbble: '',
                        linkedin: ''
                    }
                })

                // Update contact preferences
                if (profileData?.contact_preferences) {
                    setContactPrefs(profileData.contact_preferences)
                }

                // Update privacy settings from profiles JSONB
                if (profileData?.privacy_settings) {
                    setPrivacySettings(profileData.privacy_settings)
                }

                // Update security
                setSecurity({
                    twoFactorEnabled: profileData?.two_factor_enabled || false,
                    twoFactorMethod: profileData?.two_factor_method || 'app',
                    loginAlerts: profileData?.login_alerts !== false,
                    sessionTimeout: profileData?.session_timeout || 30,
                    passwordLastChanged: user?.updated_at || null
                })

                // Update notifications from notification_preferences table
                if (notifData) {
                    setNotifications({
                        email: notifData.email || notifications.email,
                        push: notifData.push || notifications.push
                    })
                }

                // Update privacy from privacy_settings table
                if (privacyData) {
                    setPrivacy({
                        show_online_status: privacyData.show_online_status ?? true,
                        data_sharing: privacyData.data_sharing ?? true,
                        profile_visibility: privacyData.profile_visibility || 'public',
                        activity_tracking: privacyData.activity_tracking ?? true
                    })
                }

                // Fetch education
                const { data: educationData, error: educationError } = await supabase
                    .from('education')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (!educationError && educationData) {
                    setEducation(educationData)
                }

                // Fetch skills
                const { data: skillsData, error: skillsError } = await supabase
                    .from('skills')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (!skillsError && skillsData) {
                    setSkills(skillsData)
                }

                // Fetch certifications
                const { data: certificationsData, error: certificationsError } = await supabase
                    .from('certifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (!certificationsError && certificationsData) {
                    setCertifications(certificationsData)
                }

            } catch (err) {
                console.error('Error fetching settings:', err)
                setError('Failed to load settings. Please refresh the page.')
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

            // Start a transaction-like sequence of operations
            const updates = []

            // 1. Update main profile with all fields
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    name: profile.name,
                    phone: profile.phone,
                    company: profile.company,
                    role: profile.role,
                    title: profile.title,
                    department: profile.department,
                    years_of_experience: profile.years_of_experience,
                    location: profile.location,
                    website: profile.website,
                    bio: profile.bio,
                    avatar: profile.avatar,
                    timezone: profile.timezone,
                    language: profile.language,
                    theme: profile.theme,
                    status: profile.status,
                    specialization: profile.specialization,
                    team_preference: profile.team_preference,
                    social: profile.social,
                    contact_preferences: contactPrefs,
                    privacy_settings: privacySettings,
                    two_factor_enabled: security.twoFactorEnabled,
                    two_factor_method: security.twoFactorMethod,
                    updated_at: new Date().toISOString()
                })

            if (profileError) throw profileError

            // 2. Update notification preferences table
            const { error: notifError } = await supabase
                .from('notification_preferences')
                .upsert({
                    user_id: user.id,
                    email: notifications.email,
                    push: notifications.push,
                    updated_at: new Date().toISOString()
                })

            if (notifError) throw notifError

            // 3. Update privacy settings table
            const { error: privacyError } = await supabase
                .from('privacy_settings')
                .upsert({
                    user_id: user.id,
                    show_online_status: privacy.show_online_status,
                    data_sharing: privacy.data_sharing,
                    profile_visibility: privacy.profile_visibility,
                    activity_tracking: privacy.activity_tracking,
                    updated_at: new Date().toISOString()
                })

            if (privacyError) throw privacyError

            setSuccess('Settings saved successfully!')
            setTimeout(() => setSuccess(null), 3000)

            // Refresh user session to get updated metadata
            await supabase.auth.refreshSession()

        } catch (err) {
            console.error('Error saving settings:', {
                message: err?.message,
                code: err?.code,
                status: err?.status,
                details: err?.details,
                hint: err?.hint,
                fullError: err
            })
            setError(err?.message || 'Failed to save settings. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handlePasswordChange = async () => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${window.location.origin}/account/update-password`,
            })

            if (error) throw error

            setSuccess('Password reset email sent! Check your inbox.')
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error sending reset email:', err)
            setError('Failed to send password reset email.')
        }
    }

    const handleLogoutAllSessions = async () => {
        try {
            const { error } = await supabase.auth.signOut({ scope: 'others' })

            if (error) throw error

            // Update sessions list
            setSessions(sessions.filter(s => s.is_current))

            setSuccess('All other sessions logged out successfully!')
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error logging out sessions:', err)
            setError('Failed to logout other sessions.')
        }
    }

    const handleLogoutSession = async (sessionId) => {
        try {
            // This requires a custom RPC function or Edge Function
            const { error } = await supabase.rpc('terminate_session', {
                session_id: sessionId
            })

            if (error) throw error

            setSessions(sessions.filter(s => s.id !== sessionId))
            setSuccess('Session terminated successfully!')
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error terminating session:', err)
            setError('Failed to terminate session.')
        }
    }

    const handleExportData = async () => {
        try {
            setLoading(true)

            // Fetch all user data
            const [
                { data: projects },
                { data: documents },
                { data: activities },
                { data: skills },
                { data: experience },
                { data: education },
                { data: certifications }
            ] = await Promise.all([
                supabase.from('projects').select('*').eq('user_id', user.id),
                supabase.from('documents').select('*').eq('user_id', user.id),
                supabase.from('activities').select('*').eq('user_id', user.id),
                supabase.from('skills').select('*').eq('user_id', user.id),
                supabase.from('experience').select('*').eq('user_id', user.id),
                supabase.from('education').select('*').eq('user_id', user.id),
                supabase.from('certifications').select('*').eq('user_id', user.id)
            ])

            const exportData = {
                profile: profile,
                contact_preferences: contactPrefs,
                privacy_settings: privacySettings,
                notifications: notifications,
                sessions: sessions,
                projects: projects || [],
                documents: documents || [],
                activities: activities || [],
                skills: skills || [],
                experience: experience || [],
                education: education || [],
                certifications: certifications || [],
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

            setSuccess('Data exported successfully!')
            setTimeout(() => setSuccess(null), 3000)

        } catch (err) {
            console.error('Error exporting data:', err)
            setError('Failed to export data')
        } finally {
            setLoading(false)
        }
    }

    // Education handlers
    const handleAddEducation = async () => {
        try {
            if (!newEducation.institution || !newEducation.degree) {
                setError('Institution and degree are required')
                return
            }

            const { data, error } = await supabase
                .from('education')
                .insert([{
                    user_id: user.id,
                    ...newEducation
                }])
                .select()

            if (error) throw error

            setEducation([data[0], ...education])
            setNewEducation({
                institution: '',
                degree: '',
                field_of_study: '',
                start_date: '',
                end_date: '',
                current: false,
                grade: '',
                achievements: [],
                description: ''
            })
            setSuccess('Education added successfully!')
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error adding education:', err)
            setError(err?.message || 'Failed to add education')
        }
    }

    const handleDeleteEducation = async (id) => {
        try {
            const { error } = await supabase
                .from('education')
                .delete()
                .eq('id', id)

            if (error) throw error

            setEducation(education.filter(e => e.id !== id))
            setSuccess('Education deleted successfully!')
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error deleting education:', err)
            setError(err?.message || 'Failed to delete education')
        }
    }

    // Skills handlers
    const handleAddSkill = async () => {
        try {
            if (!newSkill.name) {
                setError('Skill name is required')
                return
            }

            const { data, error } = await supabase
                .from('skills')
                .insert([{
                    user_id: user.id,
                    ...newSkill
                }])
                .select()

            if (error) throw error

            setSkills([data[0], ...skills])
            setNewSkill({
                name: '',
                level: 50,
                type: 'technical',
                category: ''
            })
            setSuccess('Skill added successfully!')
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error adding skill:', err)
            setError(err?.message || 'Failed to add skill')
        }
    }

    const handleDeleteSkill = async (id) => {
        try {
            const { error } = await supabase
                .from('skills')
                .delete()
                .eq('id', id)

            if (error) throw error

            setSkills(skills.filter(s => s.id !== id))
            setSuccess('Skill deleted successfully!')
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error deleting skill:', err)
            setError(err?.message || 'Failed to delete skill')
        }
    }

    // Certifications handlers
    const handleAddCertification = async () => {
        try {
            if (!newCertification.name || !newCertification.issuer) {
                setError('Certification name and issuer are required')
                return
            }

            const { data, error } = await supabase
                .from('certifications')
                .insert([{
                    user_id: user.id,
                    ...newCertification
                }])
                .select()

            if (error) throw error

            setCertifications([data[0], ...certifications])
            setNewCertification({
                name: '',
                issuer: '',
                year: new Date().getFullYear(),
                credential_id: '',
                credential_url: '',
                does_not_expire: false
            })
            setSuccess('Certification added successfully!')
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error adding certification:', err)
            setError(err?.message || 'Failed to add certification')
        }
    }

    const handleDeleteCertification = async (id) => {
        try {
            const { error } = await supabase
                .from('certifications')
                .delete()
                .eq('id', id)

            if (error) throw error

            setCertifications(certifications.filter(c => c.id !== id))
            setSuccess('Certification deleted successfully!')
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Error deleting certification:', err)
            setError(err?.message || 'Failed to delete certification')
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
        { id: 'education', label: 'Education', icon: BookOpen },
        { id: 'skills', label: 'Skills', icon: Briefcase },
        { id: 'certifications', label: 'Certifications', icon: Award },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Database },
        { id: 'appearance', label: 'Appearance', icon: Palette }
    ]

    return (
        <>
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
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center text-xl font-bold text-dark">
                                        {profile.avatar === '👤' ? '👤' : profile.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-bold truncate">{profile.name || 'User'}</h3>
                                        <p className="text-sm text-gray-400 truncate">{profile.email}</p>
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
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Job Title</label>
                                            <input
                                                type="text"
                                                value={profile.title}
                                                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                                placeholder="e.g., Software Engineer"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Department</label>
                                            <input
                                                type="text"
                                                value={profile.department}
                                                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                                placeholder="e.g., Engineering"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={profile.location}
                                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                                placeholder="City, Country"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Website</label>
                                            <input
                                                type="url"
                                                value={profile.website}
                                                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                                placeholder="https://example.com"
                                            />
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Timezone</label>
                                            <select
                                                value={profile.timezone}
                                                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                            >
                                                <option value="UTC">UTC</option>
                                                <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
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
                                                <option value="en">English</option>
                                                <option value="es">Spanish</option>
                                                <option value="fr">French</option>
                                                <option value="sw">Swahili</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Professional Specialization */}
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">Professional Specialization</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Primary Specialization</label>
                                                <select
                                                    value={profile.specialization}
                                                    onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                                >
                                                    <option value="">Select a specialization</option>
                                                    {specializations.map(spec => (
                                                        <option key={spec} value={spec}>{spec}</option>
                                                    ))}
                                                </select>
                                                <p className="text-xs text-gray-500 mt-2">This helps us match you with relevant teams</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Team Preferences</label>
                                                <div className="space-y-2 max-h-48 overflow-y-auto bg-white/5 rounded-lg p-3 border border-white/10">
                                                    {specializations.map(spec => (
                                                        <label key={spec} className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                                                            <input
                                                                type="checkbox"
                                                                checked={profile.team_preference?.includes(spec) || false}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setProfile({
                                                                            ...profile,
                                                                            team_preference: [...(profile.team_preference || []), spec]
                                                                        })
                                                                    } else {
                                                                        setProfile({
                                                                            ...profile,
                                                                            team_preference: (profile.team_preference || []).filter(s => s !== spec)
                                                                        })
                                                                    }
                                                                }}
                                                                className="w-4 h-4 rounded"
                                                            />
                                                            <span className="text-sm">{spec}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">Select teams you&lsquo;re interested in joining</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">Social Links</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">LinkedIn</label>
                                                <input
                                                    type="url"
                                                    value={profile.social.linkedin}
                                                    onChange={(e) => setProfile({
                                                        ...profile,
                                                        social: { ...profile.social, linkedin: e.target.value }
                                                    })}
                                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                                    placeholder="https://linkedin.com/in/username"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">GitHub</label>
                                                <input
                                                    type="url"
                                                    value={profile.social.github}
                                                    onChange={(e) => setProfile({
                                                        ...profile,
                                                        social: { ...profile.social, github: e.target.value }
                                                    })}
                                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                                    placeholder="https://github.com/username"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Twitter</label>
                                                <input
                                                    type="url"
                                                    value={profile.social.twitter}
                                                    onChange={(e) => setProfile({
                                                        ...profile,
                                                        social: { ...profile.social, twitter: e.target.value }
                                                    })}
                                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                                    placeholder="https://twitter.com/username"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Dribbble</label>
                                                <input
                                                    type="url"
                                                    value={profile.social.dribbble}
                                                    onChange={(e) => setProfile({
                                                        ...profile,
                                                        social: { ...profile.social, dribbble: e.target.value }
                                                    })}
                                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                                    placeholder="https://dribbble.com/username"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Preferences */}
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">Contact Preferences</h3>
                                        <div className="space-y-3">
                                            {Object.entries(contactPrefs).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                                    <span className="text-sm">
                                                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                    </span>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={value}
                                                            onChange={(e) => setContactPrefs({ ...contactPrefs, [key]: e.target.checked })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Education Settings */}
                        {activeTab === 'education' && (
                            <div className="glass-effect rounded-2xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold mb-6">Education</h2>

                                {/* Add Education Form */}
                                <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                                    <h3 className="text-lg font-bold mb-4">Add Education</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Institution"
                                            value={newEducation.institution}
                                            onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Degree"
                                            value={newEducation.degree}
                                            onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Field of Study"
                                            value={newEducation.field_of_study}
                                            onChange={(e) => setNewEducation({...newEducation, field_of_study: e.target.value})}
                                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Grade"
                                            value={newEducation.grade}
                                            onChange={(e) => setNewEducation({...newEducation, grade: e.target.value})}
                                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                        />
                                        <input
                                            type="date"
                                            value={newEducation.start_date}
                                            onChange={(e) => setNewEducation({...newEducation, start_date: e.target.value})}
                                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                        />
                                        <input
                                            type="date"
                                            value={newEducation.end_date}
                                            onChange={(e) => setNewEducation({...newEducation, end_date: e.target.value})}
                                            disabled={newEducation.current}
                                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green disabled:opacity-50"
                                        />
                                        <div className="md:col-span-2">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={newEducation.current}
                                                    onChange={(e) => setNewEducation({...newEducation, current: e.target.checked})}
                                                    className="w-4 h-4 rounded"
                                                />
                                                <span>Currently studying here</span>
                                            </label>
                                        </div>
                                        <div className="md:col-span-2">
                                            <textarea
                                                placeholder="Description"
                                                value={newEducation.description}
                                                onChange={(e) => setNewEducation({...newEducation, description: e.target.value})}
                                                className="w-full bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAddEducation}
                                        className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add Education
                                    </button>
                                </div>

                                {/* Education List */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg">Your Education</h3>
                                    {education.length === 0 ? (
                                        <p className="text-gray-400">No education records yet</p>
                                    ) : (
                                        education.map((edu) => (
                                            <div key={edu.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-bold">{edu.degree} in {edu.field_of_study || 'N/A'}</h4>
                                                        <p className="text-gray-400">{edu.institution}</p>
                                                        {edu.grade && <p className="text-sm text-gray-500">Grade: {edu.grade}</p>}
                                                        {edu.start_date && (
                                                            <p className="text-sm text-gray-500">
                                                                {edu.start_date} {edu.end_date && `- ${edu.end_date}`} {edu.current && '(Current)'}
                                                            </p>
                                                        )}
                                                        {edu.description && <p className="text-gray-400 text-sm mt-2">{edu.description}</p>}
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteEducation(edu.id)}
                                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Skills Settings */}
                        {activeTab === 'skills' && (
                            <div className="glass-effect rounded-2xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold mb-6">Skills</h2>

                                {/* Add Skill Form */}
                                <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                                    <h3 className="text-lg font-bold mb-4">Add Skill</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Skill Name (e.g., React, Python)"
                                            value={newSkill.name}
                                            onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                        />
                                        <select
                                            value={newSkill.type}
                                            onChange={(e) => setNewSkill({...newSkill, type: e.target.value})}
                                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-green"
                                        >
                                            <option value="technical">Technical</option>
                                            <option value="soft">Soft Skill</option>
                                            <option value="language">Language</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="Category (optional)"
                                            value={newSkill.category}
                                            onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                        />
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Proficiency Level: {newSkill.level}%</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={newSkill.level}
                                                onChange={(e) => setNewSkill({...newSkill, level: parseInt(e.target.value)})}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAddSkill}
                                        className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add Skill
                                    </button>
                                </div>

                                {/* Skills List */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {skills.length === 0 ? (
                                        <p className="text-gray-400 col-span-full">No skills added yet</p>
                                    ) : (
                                        skills.map((skill) => (
                                            <div key={skill.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold">{skill.name}</h4>
                                                        <p className="text-xs text-gray-500">{skill.type}{skill.category ? ` • ${skill.category}` : ''}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteSkill(skill.id)}
                                                        className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="w-full bg-dark-darker rounded-full h-2">
                                                    <div className="bg-gradient-to-r from-neon-green to-neon-blue h-2 rounded-full" style={{width: `${skill.level}%`}}></div>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">{skill.level}% proficient</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Certifications Settings */}
                        {activeTab === 'certifications' && (
                            <div className="glass-effect rounded-2xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold mb-6">Certifications</h2>

                                {/* Add Certification Form */}
                                <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                                    <h3 className="text-lg font-bold mb-4">Add Certification</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Certification Name"
                                            value={newCertification.name}
                                            onChange={(e) => setNewCertification({...newCertification, name: e.target.value})}
                                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Issuer (e.g., Google, AWS)"
                                            value={newCertification.issuer}
                                            onChange={(e) => setNewCertification({...newCertification, issuer: e.target.value})}
                                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Year"
                                            value={newCertification.year}
                                            onChange={(e) => setNewCertification({...newCertification, year: parseInt(e.target.value)})}
                                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Credential ID"
                                            value={newCertification.credential_id}
                                            onChange={(e) => setNewCertification({...newCertification, credential_id: e.target.value})}
                                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                        />
                                        <input
                                            type="url"
                                            placeholder="Credential URL"
                                            value={newCertification.credential_url}
                                            onChange={(e) => setNewCertification({...newCertification, credential_url: e.target.value})}
                                            className="bg-dark-darker border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
                                        />
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newCertification.does_not_expire}
                                                onChange={(e) => setNewCertification({...newCertification, does_not_expire: e.target.checked})}
                                                className="w-4 h-4 rounded"
                                            />
                                            <span>Does not expire</span>
                                        </label>
                                    </div>
                                    <button
                                        onClick={handleAddCertification}
                                        className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add Certification
                                    </button>
                                </div>

                                {/* Certifications List */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg">Your Certifications</h3>
                                    {certifications.length === 0 ? (
                                        <p className="text-gray-400">No certifications added yet</p>
                                    ) : (
                                        certifications.map((cert) => (
                                            <div key={cert.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-bold">{cert.name}</h4>
                                                        <p className="text-gray-400">{cert.issuer}</p>
                                                        <p className="text-sm text-gray-500">Year: {cert.year} {cert.does_not_expire && '(Does not expire)'}</p>
                                                        {cert.credential_id && <p className="text-xs text-gray-600">ID: {cert.credential_id}</p>}
                                                        {cert.credential_url && (
                                                            <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-xs text-neon-green hover:underline">
                                                                View Credential
                                                            </a>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteCertification(cert.id)}
                                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
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
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">Change Password</p>
                                                    <p className="text-sm text-gray-400">
                                                        Last changed: {security.passwordLastChanged
                                                            ? new Date(security.passwordLastChanged).toLocaleDateString()
                                                            : 'Never'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handlePasswordChange}
                                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity"
                                                >
                                                    Change Password
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
                                                        checked={security.twoFactorEnabled}
                                                        onChange={(e) => setSecurity({ ...security, twoFactorEnabled: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                                                </label>
                                            </div>

                                            {security.twoFactorEnabled && (
                                                <div className="mt-4 p-4 rounded-lg bg-neon-green/10 border border-neon-green/20">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Check className="w-5 h-5 text-neon-green" />
                                                        <p className="font-medium">2FA is enabled</p>
                                                    </div>
                                                    <p className="text-sm text-gray-300">
                                                        Using: {security.twoFactorMethod === 'app' ? 'Authenticator App' : 'SMS'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Session Management */}
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">Session Management</h3>
                                        <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                            <div className="mb-6">
                                                <p className="font-medium mb-3">Session Timeout</p>
                                                <div className="flex flex-wrap gap-4">
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
                                                <button
                                                    onClick={handleLogoutAllSessions}
                                                    className="px-4 py-2 rounded-lg border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center gap-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Log Out All Other Sessions
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active Sessions */}
                                    {sessions.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-bold mb-4">Active Sessions</h3>
                                            <div className="space-y-3">
                                                {sessions.map((session) => (
                                                    <div key={session.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-white/10">
                                                                <Smartphone className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{session.device || 'Unknown Device'}</p>
                                                                <p className="text-sm text-gray-400">
                                                                    {session.location || 'Unknown Location'} •
                                                                    Last active: {new Date(session.last_active).toLocaleDateString()}
                                                                    {session.is_current && ' (Current)'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {!session.is_current && (
                                                            <button
                                                                onClick={() => handleLogoutSession(session.id)}
                                                                className="px-3 py-1 rounded-lg border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 text-sm transition-colors"
                                                            >
                                                                Terminate
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
                                        <div className="space-y-3">
                                            {Object.entries(notifications.email).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                                    <div>
                                                        <p className="font-medium">
                                                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                                                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
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
                                        <div className="space-y-3">
                                            {Object.entries(notifications.push).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                                    <div>
                                                        <p className="font-medium">
                                                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                                                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                                                    </label>
                                                </div>
                                            ))}
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
                                    {/* Privacy Controls */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold">Privacy Controls</h3>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                                <div>
                                                    <p className="font-medium">Show Online Status</p>
                                                    <p className="text-sm text-gray-400">
                                                        Allow others to see when you&apos;re online
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={privacy.show_online_status}
                                                        onChange={(e) => setPrivacy({ ...privacy, show_online_status: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
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
                                                        checked={privacy.data_sharing}
                                                        onChange={(e) => setPrivacy({ ...privacy, data_sharing: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                                <div>
                                                    <p className="font-medium">Profile Visibility</p>
                                                    <p className="text-sm text-gray-400">
                                                        Control who can see your profile
                                                    </p>
                                                </div>
                                                <select
                                                    value={privacy.profile_visibility}
                                                    onChange={(e) => setPrivacy({ ...privacy, profile_visibility: e.target.value })}
                                                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                                >
                                                    <option value="public">Public</option>
                                                    <option value="private">Private</option>
                                                    <option value="team_only">Team Only</option>
                                                </select>
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
                                                        checked={privacy.activity_tracking}
                                                        onChange={(e) => setPrivacy({ ...privacy, activity_tracking: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data Export */}
                                    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold mb-2">Export Your Data</h3>
                                                <p className="text-gray-400 mb-4">
                                                    Download all your data including projects, documents, and messages
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleExportData}
                                                disabled={loading}
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

                                    {/* Account Deletion */}
                                    <div className="p-6 rounded-lg bg-red-500/5 border border-red-500/20">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold mb-2 text-red-400">Delete Account</h3>
                                                <p className="text-gray-400 mb-4">
                                                    Permanently delete your account and all associated data
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setShowDeleteModal(true)}
                                                className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete Account
                                            </button>
                                        </div>
                                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
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
                                </div>
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeTab === 'appearance' && (
                            <div className="glass-effect rounded-2xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold mb-6">Appearance</h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-3">Theme</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['dark', 'light', 'system'].map((theme) => (
                                                <button
                                                    key={theme}
                                                    onClick={() => setProfile({ ...profile, theme })}
                                                    className={`p-4 rounded-lg border-2 transition-all ${profile.theme === theme
                                                        ? 'border-neon-green bg-neon-green/10'
                                                        : 'border-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className="flex flex-col items-center gap-2">
                                                        {theme === 'dark' && <Moon className="w-6 h-6" />}
                                                        {theme === 'light' && <Sun className="w-6 h-6" />}
                                                        {theme === 'system' && <Smartphone className="w-6 h-6" />}
                                                        <span className="text-sm capitalize">{theme}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                userId={user?.id}
            />
        </>
    )
}