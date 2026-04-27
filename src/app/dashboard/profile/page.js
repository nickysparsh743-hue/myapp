'use client'

import { useState, useEffect } from 'react'
import {
  User, Mail, Building, Phone, MapPin,
  Calendar, Globe, Shield, CreditCard,
  Bell, Lock, Download, Upload,
  Edit, Save, Camera, X, Check,
  Linkedin, Twitter, Github, Globe as GlobeIcon,
  Award, Briefcase, BookOpen, Star,
  FileText, Users, BarChart, Target, Plus,
  Clock, Moon, Sun, Languages, Map,
  TrendingUp, Activity, Zap, Cpu
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Data from various tables
  const [skills, setSkills] = useState([])
  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [certifications, setCertifications] = useState([])
  const [projects, setProjects] = useState([])
  const [activities, setActivities] = useState([])
  const [sessions, setSessions] = useState([])
  const [notificationPrefs, setNotificationPrefs] = useState(null)
  const [privacySettings, setPrivacySettings] = useState(null)

  // Stats
  const [stats, setStats] = useState({
    projectsCompleted: 0,
    activeProjects: 0,
    totalSkills: 0,
    yearsOfExperience: 0,
    loginCount: 0,
    lastActive: null
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/account/login')
    }
  }, [user, authLoading, router])

  // Fetch all user data
  useEffect(() => {
    const fetchAllUserData = async () => {
      if (!user) return

      try {
        setLoading(true)
        setError(null)

        // 1. Fetch profile from database
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError)
        }

        // 2. Fetch user's skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .eq('user_id', user.id)
          .order('level', { ascending: false })

        if (!skillsError && skillsData) {
          setSkills(skillsData)
        }

        // 3. Fetch user's experience
        const { data: experienceData, error: experienceError } = await supabase
          .from('experience')
          .select('*')
          .eq('user_id', user.id)
          .order('start_date', { ascending: false })

        if (!experienceError && experienceData) {
          setExperience(experienceData)
        }

        // 4. Fetch user's education
        const { data: educationData, error: educationError } = await supabase
          .from('education')
          .select('*')
          .eq('user_id', user.id)
          .order('end_date', { ascending: false })

        if (!educationError && educationData) {
          setEducation(educationData)
        }

        // 5. Fetch user's certifications
        const { data: certsData, error: certsError } = await supabase
          .from('certifications')
          .select('*')
          .eq('user_id', user.id)
          .order('year', { ascending: false })

        if (!certsError && certsData) {
          setCertifications(certsData)
        }

        // 6. Fetch user's projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!projectsError && projectsData) {
          setProjects(projectsData)
        }

        // 7. Fetch recent activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (!activitiesError && activitiesData) {
          setActivities(activitiesData)
        }

        // 8. Fetch user sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('last_active', { ascending: false })
          .limit(5)

        if (!sessionsError && sessionsData) {
          setSessions(sessionsData)
        }

        // 9. Fetch notification preferences
        const { data: notifData, error: notifError } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (!notifError && notifData) {
          setNotificationPrefs(notifData)
        }

        // 10. Fetch privacy settings
        const { data: privacyData, error: privacyError } = await supabase
          .from('privacy_settings')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (!privacyError && privacyData) {
          setPrivacySettings(privacyData)
        }

        // Calculate stats
        const active = projectsData?.filter(p => p.status === 'active').length || 0
        const completed = projectsData?.filter(p => p.status === 'completed').length || 0
        const totalExp = experienceData?.reduce((total, exp) => {
          if (exp.current) {
            const start = new Date(exp.start_date)
            const now = new Date()
            const years = now.getFullYear() - start.getFullYear()
            return total + years
          } else if (exp.end_date) {
            const start = new Date(exp.start_date)
            const end = new Date(exp.end_date)
            const years = end.getFullYear() - start.getFullYear()
            return total + years
          }
          return total
        }, 0) || 0

        setStats({
          projectsCompleted: completed,
          activeProjects: active,
          totalSkills: skillsData?.length || 0,
          yearsOfExperience: Math.round(totalExp),
          loginCount: profileData?.login_count || 0,
          lastActive: profileData?.last_active
        })

        // Combine auth user data with profile data
        const combinedProfile = {
          id: user.id,
          name: user.user_metadata?.name || profileData?.name || user.email?.split('@')[0] || 'User',
          email: user.email,
          role: user.user_metadata?.role || profileData?.role || 'User',
          company: profileData?.company || '',
          phone: profileData?.phone || '',
          location: profileData?.location || '',
          website: profileData?.website || '',
          bio: profileData?.bio || '',
          avatar: profileData?.avatar || user.email?.charAt(0).toUpperCase() || 'U',
          status: profileData?.status || 'active',
          title: profileData?.title || '',
          department: profileData?.department || '',
          years_of_experience: profileData?.years_of_experience || 0,
          social: profileData?.social || {
            linkedin: '',
            twitter: '',
            github: '',
            dribbble: '',
            behance: ''
          },
          contact_preferences: profileData?.contact_preferences || {
            team_messages: true,
            weekly_reports: true,
            project_updates: true,
            push_notifications: true,
            email_notifications: true
          },
          privacy_settings: profileData?.privacy_settings || {
            data_sharing: 'limited',
            activity_status: true,
            profile_visibility: 'public',
            contact_info_visibility: 'team_only'
          },
          theme: profileData?.theme || 'dark',
          language: profileData?.language || 'en',
          timezone: profileData?.timezone || 'UTC',
          email_verified: profileData?.email_verified || false,
          phone_verified: profileData?.phone_verified || false,
          two_factor_enabled: profileData?.two_factor_enabled || false,
          two_factor_method: profileData?.two_factor_method || '',
          last_login: profileData?.last_login,
          last_active: profileData?.last_active,
          login_count: profileData?.login_count || 0,
          joinDate: new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
            day: 'numeric'
          })
        }

        setProfile(combinedProfile)

      } catch (err) {
        console.error('Error in profile fetch:', err)
        setError('Failed to load profile data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchAllUserData()
  }, [user, supabase])

  // Get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case 'project_created': return <Briefcase className="w-4 h-4" />
      case 'skill_added': return <Zap className="w-4 h-4" />
      case 'login': return <Activity className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Profile not found</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold"
        >
          Go to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Header with Settings Link */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-gray-400">View your personal and professional information</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/settings"
            className="px-6 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Profile
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="glass-effect rounded-2xl p-8 border border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center text-4xl font-bold text-dark overflow-hidden">
              {typeof profile.avatar === 'string' && profile.avatar.startsWith('http') ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                profile.avatar
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-dark border-2 border-neon-green">
              {profile.status === 'active' ? (
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              ) : (
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <h2 className="text-3xl font-bold">{profile.name}</h2>
              {profile.email_verified && (
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Verified
                </span>
              )}
              {profile.two_factor_enabled && (
                <span className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-sm flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  2FA Enabled
                </span>
              )}
            </div>
            <p className="text-xl text-neon-green mb-2">{profile.title || profile.role}</p>
            <p className="text-gray-300 mb-4 max-w-2xl">{profile.bio || 'No bio added yet.'}</p>

            <div className="flex flex-wrap gap-4">
              <span className="px-3 py-1 rounded-full bg-white/10 text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Member since {profile.joinDate}
              </span>
              {profile.department && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-sm flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {profile.department}
                </span>
              )}
              {profile.location && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile.location}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-white/10 text-sm flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {profile.timezone}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-sm flex items-center gap-1">
                <Languages className="w-3 h-3" />
                {profile.language === 'en' ? 'English' : profile.language}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-neon-green/20">
              <Briefcase className="w-6 h-6 text-neon-green" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.projectsCompleted}</p>
              <p className="text-sm text-gray-400">Projects Completed</p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-neon-blue/20">
              <Activity className="w-6 h-6 text-neon-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.activeProjects}</p>
              <p className="text-sm text-gray-400">Active Projects</p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Zap className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalSkills}</p>
              <p className="text-sm text-gray-400">Skills</p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500/20">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.yearsOfExperience}+</p>
              <p className="text-sm text-gray-400">Years Experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-effect rounded-2xl p-4 border border-white/10">
        <div className="flex overflow-x-auto gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'experience', label: 'Experience', icon: Briefcase },
            { id: 'skills', label: 'Skills', icon: Zap },
            { id: 'projects', label: 'Projects', icon: Target },
            { id: 'activity', label: 'Activity', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold'
                  : 'hover:bg-white/10'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-neon-green" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="font-medium">{profile.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Company</p>
                    <p className="font-medium">{profile.company || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="font-medium">{profile.location || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <GlobeIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Website</p>
                    <p className="font-medium">
                      {profile.website ? (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-neon-green hover:underline">
                          {profile.website}
                        </a>
                      ) : 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="font-medium">{profile.joinDate}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-lg font-bold mb-4">Social Links</h4>
                <div className="flex gap-4">
                  {profile.social?.linkedin && (
                    <a
                      href={profile.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-[#0077B5]/20 hover:bg-[#0077B5]/30 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-[#0077B5]" />
                    </a>
                  )}
                  {profile.social?.twitter && (
                    <a
                      href={profile.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 transition-colors"
                    >
                      <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                    </a>
                  )}
                  {profile.social?.github && (
                    <a
                      href={profile.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-[#333]/20 hover:bg-[#333]/30 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Experience */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-neon-green" />
                  Recent Experience
                </h3>
                <Link href="/dashboard/profile?tab=experience" className="text-neon-green hover:underline text-sm">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {experience.slice(0, 2).map((exp) => (
                  <div key={exp.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-lg mb-1">{exp.role}</h4>
                        <p className="text-neon-green mb-2">{exp.company}</p>
                        <p className="text-sm text-gray-400 mb-2">
                          {new Date(exp.start_date).getFullYear()} - {exp.current ? 'Present' : new Date(exp.end_date).getFullYear()}
                        </p>
                        <p className="text-gray-300 line-clamp-2">{exp.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {experience.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No experience added yet</p>
                )}
              </div>
            </div>

            {/* Privacy & Preferences Summary */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-neon-green" />
                Privacy & Preferences
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-sm text-gray-400 mb-1">Profile Visibility</p>
                  <p className="font-medium capitalize">{profile.privacy_settings.profile_visibility}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-sm text-gray-400 mb-1">Activity Status</p>
                  <p className="font-medium">{profile.privacy_settings.activity_status ? 'Visible' : 'Hidden'}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-sm text-gray-400 mb-1">Data Sharing</p>
                  <p className="font-medium capitalize">{profile.privacy_settings.data_sharing}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-sm text-gray-400 mb-1">Two-Factor Auth</p>
                  <p className="font-medium">{profile.two_factor_enabled ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-gray-400">Login Count</span>
                  <span className="font-bold">{stats.loginCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-gray-400">Last Active</span>
                  <span className="font-bold">
                    {stats.lastActive ? new Date(stats.lastActive).toLocaleDateString() : 'Today'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-gray-400">Active Sessions</span>
                  <span className="font-bold">{sessions.filter(s => s.is_current).length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-gray-400">Certifications</span>
                  <span className="font-bold">{certifications.length}</span>
                </div>
              </div>
            </div>

            {/* Top Skills */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4">Top Skills</h3>
              <div className="space-y-3">
                {skills.slice(0, 5).map((skill) => (
                  <div key={skill.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{skill.name}</span>
                      <span className="text-xs text-neon-green">{skill.level}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
                {skills.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No skills added yet</p>
                )}
              </div>
            </div>

            {/* Recent Certifications */}
            {certifications.length > 0 && (
              <div className="glass-effect rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-4">Recent Certifications</h3>
                <div className="space-y-3">
                  {certifications.slice(0, 3).map((cert) => (
                    <div key={cert.id} className="p-3 rounded-lg bg-white/5">
                      <p className="font-medium mb-1">{cert.name}</p>
                      <p className="text-sm text-gray-400">{cert.issuer} • {cert.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Sessions */}
            {sessions.length > 0 && (
              <div className="glass-effect rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  {sessions.filter(s => s.is_current).map((session) => (
                    <div key={session.id} className="p-3 rounded-lg bg-white/5 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/10">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{session.device || 'Current Device'}</p>
                        <p className="text-xs text-gray-400">{session.location || 'Current Session'}</p>
                      </div>
                      <span className="text-xs text-neon-green">Active Now</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Experience Tab */}
      {activeTab === 'experience' && (
        <div className="glass-effect rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold mb-8">Professional Experience</h3>

          <div className="space-y-8">
            {experience.length > 0 ? (
              experience.map((exp) => (
                <div key={exp.id} className="relative pl-8 pb-8 border-l border-white/10 last:pb-0">
                  <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-neon-green transform -translate-x-1.5" />
                  <div className="ml-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold mb-1">{exp.role}</h4>
                        <p className="text-neon-green text-lg mb-2">{exp.company}</p>
                        <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                          {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
                          {exp.current ? ' Present' : ` ${new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 whitespace-pre-line">{exp.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No experience added yet</p>
            )}
          </div>
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="glass-effect rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold mb-8">Skills & Expertise</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-neon-green" />
                Technical Skills
              </h4>
              <div className="space-y-4">
                {skills.filter(s => s.type === 'technical').map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-neon-green">{skill.level}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
                {skills.filter(s => s.type === 'technical').length === 0 && (
                  <p className="text-gray-400">No technical skills added</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-neon-green" />
                Soft Skills
              </h4>
              <div className="space-y-4">
                {skills.filter(s => s.type === 'soft').map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-neon-green">{skill.level}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
                {skills.filter(s => s.type === 'soft').length === 0 && (
                  <p className="text-gray-400">No soft skills added</p>
                )}
              </div>
            </div>
          </div>

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-neon-green" />
                Certifications
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <Award className="w-8 h-8 text-neon-green mb-3" />
                    <h5 className="font-bold mb-1">{cert.name}</h5>
                    <p className="text-sm text-gray-400 mb-2">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">{cert.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="glass-effect rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold mb-8">Projects</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="p-6 rounded-lg bg-white/5 border border-white/10 hover:border-neon-green/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-lg">{project.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs ${project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                      }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-neon-green">{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Team Size</span>
                      <span>{project.team_size} members</span>
                    </div>
                    {project.deadline && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Deadline</span>
                        <span>{new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8 col-span-2">No projects yet</p>
            )}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="glass-effect rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold mb-8">Recent Activity</h3>

          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="p-2 rounded-lg bg-neon-green/20">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">{activity.content}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(activity.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Import Settings icon
import { Settings } from 'lucide-react'