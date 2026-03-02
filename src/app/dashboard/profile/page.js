'use client'

import { useState, useEffect } from 'react'
import {
  User, Mail, Building, Phone, MapPin,
  Calendar, Globe, Shield, CreditCard,
  Bell, Lock, Download, Upload,
  Edit, Save, Camera, X, Check,
  Linkedin, Twitter, Github, Globe as GlobeIcon,
  Award, Briefcase, BookOpen, Star,
  FileText, Users, BarChart, Target, Plus
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [skills, setSkills] = useState([])
  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [certifications, setCertifications] = useState([])
  const [sessions, setSessions] = useState([])
  const [stats, setStats] = useState({
    projectsCompleted: 0,
    activeProjects: 0,
    teamMembers: 0,
    satisfactionRate: 0
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({})
  const [newSkill, setNewSkill] = useState('')
  const [newSkillType, setNewSkillType] = useState('technical')
  const [activeTab, setActiveTab] = useState('overview')

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    email_notifications: true,
    push_notifications: true,
    project_updates: true,
    team_messages: true,
    weekly_reports: true,
    marketing_emails: false
  })

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: 'public',
    activity_status: true,
    data_sharing: 'limited',
    contact_info_visibility: 'team_only'
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

        // Fetch profile from database
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError)
        }

        // Fetch user's skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .eq('user_id', user.id)
          .order('level', { ascending: false })

        if (!skillsError && skillsData) {
          setSkills(skillsData)
        }

        // Fetch user's experience
        const { data: experienceData, error: experienceError } = await supabase
          .from('experience')
          .select('*')
          .eq('user_id', user.id)
          .order('start_date', { ascending: false })

        if (!experienceError && experienceData) {
          setExperience(experienceData)
        }

        // Fetch user's education
        const { data: educationData, error: educationError } = await supabase
          .from('education')
          .select('*')
          .eq('user_id', user.id)
          .order('end_date', { ascending: false })

        if (!educationError && educationData) {
          setEducation(educationData)
        }

        // Fetch user's certifications
        const { data: certsData, error: certsError } = await supabase
          .from('certifications')
          .select('*')
          .eq('user_id', user.id)
          .order('year', { ascending: false })

        if (!certsError && certsData) {
          setCertifications(certsData)
        }

        // Fetch user's sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('last_active', { ascending: false })
          .limit(5)

        if (!sessionsError && sessionsData) {
          setSessions(sessionsData)
        }

        // Fetch project stats
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)

        if (!projectsError && projectsData) {
          const active = projectsData.filter(p => p.status === 'active').length
          const completed = projectsData.filter(p => p.status === 'completed').length

          setStats({
            projectsCompleted: completed,
            activeProjects: active,
            teamMembers: 8, // This would come from a team members table
            satisfactionRate: 98 // This would come from feedback/reviews
          })
        }

        // Combine auth user data with profile data
        const combinedProfile = {
          id: user.id,
          name: user.user_metadata?.name || profileData?.name || user.email?.split('@')[0] || 'User',
          email: user.email,
          role: user.user_metadata?.role || profileData?.role || 'user',
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
          theme: profileData?.theme || 'dark',
          language: profileData?.language || 'en',
          timezone: profileData?.timezone || 'UTC',
          email_verified: profileData?.email_verified || false,
          phone_verified: profileData?.phone_verified || false,
          two_factor_enabled: profileData?.two_factor_enabled || false,
          joinDate: new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
            day: 'numeric'
          })
        }

        // Set notification preferences if they exist
        if (profileData?.contact_preferences) {
          setNotificationPrefs(profileData.contact_preferences)
        }

        // Set privacy settings if they exist
        if (profileData?.privacy_settings) {
          setPrivacySettings(profileData.privacy_settings)
        }

        setProfile(combinedProfile)
        setEditedProfile(combinedProfile)

      } catch (err) {
        console.error('Error in profile fetch:', err)
        setError('Failed to load profile data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchAllUserData()
  }, [user, supabase])

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: editedProfile.name,
          company: editedProfile.company,
          phone: editedProfile.phone,
          location: editedProfile.location,
          website: editedProfile.website,
          bio: editedProfile.bio,
          avatar: editedProfile.avatar,
          title: editedProfile.title,
          department: editedProfile.department,
          years_of_experience: editedProfile.years_of_experience,
          social: editedProfile.social,
          contact_preferences: notificationPrefs,
          privacy_settings: privacySettings,
          theme: editedProfile.theme,
          language: editedProfile.language,
          timezone: editedProfile.timezone,
          updated_at: new Date().toISOString()
        })

      if (updateError) throw updateError

      setProfile(editedProfile)
      setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)

    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Create a unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      setEditedProfile(prev => ({ ...prev, avatar: publicUrl }))

    } catch (err) {
      console.error('Error uploading avatar:', err)
      setError('Failed to upload avatar. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addSkill = async () => {
    if (!newSkill.trim()) return

    try {
      setError(null)

      const newSkillObj = {
        user_id: user.id,
        name: newSkill,
        level: 50,
        type: newSkillType,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('skills')
        .insert([newSkillObj])
        .select()

      if (error) throw error

      if (data) {
        setSkills([...skills, data[0]])
        setNewSkill('')
        setNewSkillType('technical')
      }

    } catch (err) {
      console.error('Error adding skill:', err)
      setError('Failed to add skill. It may already exist.')
    }
  }

  const removeSkill = async (id) => {
    try {
      setError(null)

      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSkills(skills.filter(skill => skill.id !== id))

    } catch (err) {
      console.error('Error removing skill:', err)
      setError('Failed to remove skill')
    }
  }

  const updateSkillLevel = async (id, level) => {
    try {
      const { error } = await supabase
        .from('skills')
        .update({ level, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setSkills(skills.map(skill =>
        skill.id === id ? { ...skill, level } : skill
      ))

    } catch (err) {
      console.error('Error updating skill level:', err)
      setError('Failed to update skill')
    }
  }

  const handleLogoutSession = async (sessionId) => {
    try {
      // This would need a server-side function to invalidate the session
      console.log('Logging out session:', sessionId)

      // Remove from UI
      setSessions(sessions.filter(s => s.id !== sessionId))

    } catch (err) {
      console.error('Error logging out session:', err)
      setError('Failed to logout session')
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

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-gray-400">Manage your personal and professional information</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Profile
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                Cancel Edit
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Header */}
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
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-2 rounded-full bg-dark border-2 border-neon-green cursor-pointer hover:bg-neon-green/20 transition-colors">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={loading}
                />
              </label>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="text-3xl font-bold bg-transparent border-b border-white/10 focus:border-neon-green focus:outline-none w-full"
                  placeholder="Your name"
                />
                <input
                  type="text"
                  value={editedProfile.role}
                  onChange={(e) => setEditedProfile({ ...editedProfile, role: e.target.value })}
                  className="text-xl text-neon-green bg-transparent border-b border-white/10 focus:border-neon-green focus:outline-none w-full"
                  placeholder="Your role"
                />
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  rows="3"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-neon-green focus:outline-none resize-none"
                  placeholder="Tell us about yourself"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
                <p className="text-xl text-neon-green mb-4">{profile.role}</p>
                <p className="text-gray-300 mb-6 max-w-2xl">{profile.bio || 'No bio added yet.'}</p>
                <div className="flex flex-wrap gap-4">
                  <span className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-sm">
                    {profile.status}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Member since {profile.joinDate}
                  </span>
                  {profile.email_verified && (
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Email Verified
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-effect rounded-2xl p-4 border border-white/10">
        <div className="flex overflow-x-auto">
          {['overview', 'experience', 'skills', 'settings', 'security'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg transition-colors whitespace-nowrap ${activeTab === tab
                ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold'
                : 'hover:bg-white/10'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-neon-green" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={editedProfile.email}
                        disabled
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 opacity-50 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <input
                        type="text"
                        value={editedProfile.company}
                        onChange={(e) => setEditedProfile({ ...editedProfile, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                        placeholder="Your company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <input
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Website</label>
                      <input
                        type="url"
                        value={editedProfile.website}
                        onChange={(e) => setEditedProfile({ ...editedProfile, website: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                        placeholder="https://example.com"
                      />
                    </div>
                  </>
                ) : (
                  <>
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
                        <p className="font-medium">{profile.website || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Member Since</p>
                        <p className="font-medium">{profile.joinDate}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Social Links */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-lg font-bold mb-4">Social Links</h4>
                <div className="flex gap-4">
                  <a
                    href={profile.social?.linkedin || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-[#0077B5]/20 hover:bg-[#0077B5]/30 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-[#0077B5]" />
                  </a>
                  <a
                    href={profile.social?.twitter || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                  </a>
                  <a
                    href={profile.social?.github || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-[#333]/20 hover:bg-[#333]/30 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-neon-green" />
                  Work Experience
                </h3>
                {isEditing && (
                  <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors text-sm">
                    Add Experience
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {experience.length > 0 ? (
                  experience.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-lg mb-1">{exp.role}</h4>
                          <p className="text-neon-green mb-2">{exp.company}</p>
                          <p className="text-sm text-gray-400 mb-3">
                            {new Date(exp.start_date).getFullYear()} - {exp.current ? 'Present' : new Date(exp.end_date).getFullYear()}
                          </p>
                          <p className="text-gray-300">{exp.description}</p>
                        </div>
                        {isEditing && (
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No experience added yet</p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-neon-green" />
                  Education
                </h3>
                {isEditing && (
                  <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors text-sm">
                    Add Education
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {education.length > 0 ? (
                  education.map((edu) => (
                    <div key={edu.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-lg mb-1">{edu.degree}</h4>
                          <p className="text-neon-green mb-2">{edu.institution}</p>
                          <p className="text-sm text-gray-400 mb-3">
                            {new Date(edu.start_date).getFullYear()} - {edu.current ? 'Present' : new Date(edu.end_date).getFullYear()}
                          </p>
                          {edu.field_of_study && (
                            <p className="text-gray-300">{edu.field_of_study}</p>
                          )}
                        </div>
                        {isEditing && (
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No education added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Stats */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-6">Profile Stats</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Projects Completed</span>
                    <span className="font-bold text-2xl">{stats.projectsCompleted}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-neon-green rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Active Projects</span>
                    <span className="font-bold text-2xl">{stats.activeProjects}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-neon-blue rounded-full" style={{ width: `${(stats.activeProjects / 10) * 100}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Team Members</span>
                    <span className="font-bold text-2xl">{stats.teamMembers}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Satisfaction Rate</span>
                    <span className="font-bold text-2xl">{stats.satisfactionRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats.satisfactionRate}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Target className="w-5 h-5 text-neon-green" />
                  Skills & Expertise
                </h3>
                {isEditing && (
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors text-sm"
                  >
                    Add Skill
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{skill.name}</span>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={skill.level}
                              onChange={(e) => updateSkillLevel(skill.id, parseInt(e.target.value))}
                              className="w-24"
                            />
                            <span className="text-sm w-10">{skill.level}%</span>
                            <button
                              onClick={() => removeSkill(skill.id)}
                              className="p-1 rounded hover:bg-white/10 transition-colors"
                            >
                              <X className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-neon-green">{skill.level}%</span>
                        )}
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all duration-300"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No skills added yet</p>
                )}

                {isEditing && (
                  <div className="flex gap-2 mt-4">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add new skill"
                      className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <select
                      value={newSkillType}
                      onChange={(e) => setNewSkillType(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                    >
                      <option value="technical">Technical</option>
                      <option value="soft">Soft</option>
                    </select>
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-neon-green" />
                Certifications
              </h3>

              <div className="space-y-4">
                {certifications.length > 0 ? (
                  certifications.map((cert) => (
                    <div key={cert.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold mb-1">{cert.name}</h4>
                          <p className="text-sm text-gray-400">{cert.issuer}</p>
                        </div>
                        <span className="text-sm text-gray-400">{cert.year}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No certifications added yet</p>
                )}
              </div>
            </div>
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
                          {new Date(exp.start_date).getFullYear()} - {exp.current ? 'Present' : new Date(exp.end_date).getFullYear()}
                        </span>
                      </div>
                      {isEditing && (
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-300 mb-4">{exp.description}</p>
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No experience added yet</p>
            )}

            {isEditing && (
              <button className="w-full py-4 rounded-lg border-2 border-dashed border-white/20 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Experience
              </button>
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
                <Target className="w-5 h-5 text-neon-green" />
                Technical Skills
              </h4>
              <div className="space-y-4">
                {skills.filter(s => s.type === 'technical').map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-neon-green">{skill.level}%</span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
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
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
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
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="glass-effect rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold mb-8">Account Settings</h3>

          <div className="space-y-8">
            {/* Notification Settings */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-neon-green" />
                Notification Preferences
              </h4>
              <div className="space-y-4">
                {Object.entries(notificationPrefs).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div>
                      <p className="font-medium">{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                      <p className="text-sm text-gray-400">Receive {key.replace('_', ' ')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => setNotificationPrefs({ ...notificationPrefs, [key]: !value })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-neon-green" />
                Privacy Settings
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div>
                    <p className="font-medium">Profile Visibility</p>
                    <p className="text-sm text-gray-400">Who can see your profile</p>
                  </div>
                  <select
                    value={privacySettings.profile_visibility}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, profile_visibility: e.target.value })}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="team_only">Team Only</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div>
                    <p className="font-medium">Activity Status</p>
                    <p className="text-sm text-gray-400">Show when you&apos;re online</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacySettings.activity_status}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, activity_status: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div>
                    <p className="font-medium">Data Sharing</p>
                    <p className="text-sm text-gray-400">Share analytics data</p>
                  </div>
                  <select
                    value={privacySettings.data_sharing}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, data_sharing: e.target.value })}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                  >
                    <option value="full">Full</option>
                    <option value="limited">Limited</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div>
                    <p className="font-medium">Contact Information</p>
                    <p className="text-sm text-gray-400">Who can see your contact info</p>
                  </div>
                  <select
                    value={privacySettings.contact_info_visibility}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, contact_info_visibility: e.target.value })}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="team_only">Team Only</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="glass-effect rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold mb-8">Security</h3>

          <div className="space-y-8">
            {/* Password Change */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-neon-green" />
                Change Password
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => router.push('/account/change-password')}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-neon-green" />
                Two-Factor Authentication
              </h4>
              <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">SMS Authentication</p>
                    <p className="text-sm text-gray-400">Use your phone to receive verification codes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={profile.two_factor_enabled}
                      onChange={() => { }} // This would need server-side implementation
                    />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-sm text-gray-400">Use Google Authenticator or similar</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                    Set Up
                  </button>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div>
              <h4 className="text-lg font-bold mb-6">Active Sessions</h4>
              <div className="space-y-4">
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/10">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">{session.device || 'Unknown Device'}</p>
                          <p className="text-sm text-gray-400">
                            {session.location || 'Unknown Location'} •
                            {session.is_current ? ' Current session' : ` Last active ${new Date(session.last_active).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      {!session.is_current && (
                        <button
                          onClick={() => handleLogoutSession(session.id)}
                          className="px-4 py-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          Log Out
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No active sessions found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button for Edit Mode */}
      {isEditing && (
        <div className="fixed bottom-8 right-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
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
      )}
    </div>
  )
}