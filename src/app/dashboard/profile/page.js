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

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    company: 'Tech Solutions Inc.',
    role: 'Project Manager',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: 'January 15, 2023',
    website: 'https://johnsmith.dev',
    bio: 'Experienced project manager with 8+ years in tech industry. Specializing in AI/ML projects and digital transformation.',
    avatar: 'JS',
    status: 'active'
  })

  const [skills, setSkills] = useState([
    { id: 1, name: 'Project Management', level: 95 },
    { id: 2, name: 'Agile/Scrum', level: 90 },
    { id: 3, name: 'Team Leadership', level: 88 },
    { id: 4, name: 'Risk Management', level: 85 },
    { id: 5, name: 'Budget Planning', level: 82 }
  ])

  const [experience, setExperience] = useState([
    {
      id: 1,
      company: 'Tech Solutions Inc.',
      role: 'Project Manager',
      period: '2023 - Present',
      description: 'Leading AI/ML projects and digital transformation initiatives.'
    },
    {
      id: 2,
      company: 'Digital Innovations LLC',
      role: 'Senior Project Lead',
      period: '2020 - 2023',
      description: 'Managed mobile app development projects with teams of 10+ developers.'
    },
    {
      id: 3,
      company: 'WebCraft Studio',
      role: 'Project Coordinator',
      period: '2018 - 2020',
      description: 'Coordinated web development projects and client communications.'
    }
  ])

  const [education, setEducation] = useState([
    {
      id: 1,
      institution: 'Stanford University',
      degree: 'MBA, Business Administration',
      period: '2016 - 2018'
    },
    {
      id: 2,
      institution: 'MIT',
      degree: 'Bachelor of Computer Science',
      period: '2012 - 2016'
    }
  ])

  const [certifications, setCertifications] = useState([
    { id: 1, name: 'PMP Certification', issuer: 'PMI', year: '2022' },
    { id: 2, name: 'Agile Certified Practitioner', issuer: 'PMI', year: '2021' },
    { id: 3, name: 'Scrum Master Certification', issuer: 'Scrum.org', year: '2020' }
  ])

  const [stats, setStats] = useState({
    projectsCompleted: 24,
    activeProjects: 3,
    teamMembers: 8,
    satisfactionRate: 98
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({ ...user })
  const [newSkill, setNewSkill] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      // API call would go here
      // const response = await fetch('/api/dashboard/profile')
      // const data = await response.json()
      // setUser(data)
    }
    fetchUserData()
  }, [])

  const handleSave = () => {
    setUser(editedUser)
    setIsEditing(false)
    // Save to API
    // fetch('/api/dashboard/profile', {
    //   method: 'PUT',
    //   body: JSON.stringify(editedUser)
    // })
  }

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Handle file upload
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedUser(prev => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      const newSkillObj = {
        id: skills.length + 1,
        name: newSkill,
        level: 50
      }
      setSkills([...skills, newSkillObj])
      setNewSkill('')
    }
  }

  const removeSkill = (id) => {
    setSkills(skills.filter(skill => skill.id !== id))
  }

  const updateSkillLevel = (id, level) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, level } : skill
    ))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
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
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center text-3xl font-bold text-dark">
              {isEditing ? editedUser.avatar : user.avatar}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-2 rounded-full bg-dark border-2 border-neon-green cursor-pointer hover:bg-neon-green/20 transition-colors">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
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
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="text-3xl font-bold bg-transparent border-b border-white/10 focus:border-neon-green focus:outline-none"
                />
                <input
                  type="text"
                  value={editedUser.role}
                  onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                  className="text-xl text-neon-green bg-transparent border-b border-white/10 focus:border-neon-green focus:outline-none"
                />
                <textarea
                  value={editedUser.bio}
                  onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                  rows="3"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-neon-green focus:outline-none resize-none"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                <p className="text-xl text-neon-green mb-4">{user.role}</p>
                <p className="text-gray-300 mb-6 max-w-2xl">{user.bio}</p>
                <div className="flex flex-wrap gap-4">
                  <span className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-sm">
                    {user.status}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                    Member since {user.joinDate}
                  </span>
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
              className={`px-6 py-3 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab
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
                        value={editedUser.email}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        value={editedUser.phone}
                        onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <input
                        type="text"
                        value={editedUser.company}
                        onChange={(e) => setEditedUser({ ...editedUser, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <input
                        type="text"
                        value={editedUser.location}
                        onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Website</label>
                      <input
                        type="url"
                        value={editedUser.website}
                        onChange={(e) => setEditedUser({ ...editedUser, website: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <Building className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Company</p>
                        <p className="font-medium">{user.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="font-medium">{user.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <GlobeIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Website</p>
                        <p className="font-medium">{user.website}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Member Since</p>
                        <p className="font-medium">{user.joinDate}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Social Links */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-lg font-bold mb-4">Social Links</h4>
                <div className="flex gap-4">
                  <button className="p-3 rounded-lg bg-[#0077B5]/20 hover:bg-[#0077B5]/30 transition-colors">
                    <Linkedin className="w-5 h-5 text-[#0077B5]" />
                  </button>
                  <button className="p-3 rounded-lg bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 transition-colors">
                    <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                  </button>
                  <button className="p-3 rounded-lg bg-[#333]/20 hover:bg-[#333]/30 transition-colors">
                    <Github className="w-5 h-5" />
                  </button>
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
                {experience.map((exp) => (
                  <div key={exp.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-lg mb-1">{exp.role}</h4>
                        <p className="text-neon-green mb-2">{exp.company}</p>
                        <p className="text-sm text-gray-400 mb-3">{exp.period}</p>
                        <p className="text-gray-300">{exp.description}</p>
                      </div>
                      {isEditing && (
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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
                    <div className="h-full bg-neon-blue rounded-full" style={{ width: '75%' }} />
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
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '98%' }} />
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
                    onClick={() => addSkill()}
                    className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors text-sm"
                  >
                    Add Skill
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {skills.map((skill) => (
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
                ))}
                
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
                {certifications.map((cert) => (
                  <div key={cert.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold mb-1">{cert.name}</h4>
                        <p className="text-sm text-gray-400">{cert.issuer}</p>
                      </div>
                      <span className="text-sm text-gray-400">{cert.year}</span>
                    </div>
                  </div>
                ))}
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
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-8 pb-8 border-l border-white/10 last:pb-0">
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-neon-green transform -translate-x-1.5" />
                <div className="ml-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold mb-1">{exp.role}</h4>
                      <p className="text-neon-green text-lg mb-2">{exp.company}</p>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                        {exp.period}
                      </span>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-300 mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-sm">
                      Project Management
                    </span>
                    <span className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-sm">
                      Team Leadership
                    </span>
                    <span className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-sm">
                      Agile/Scrum
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-4 rounded-lg border-2 border-dashed border-white/20 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Experience
            </button>
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
                {skills.slice(0, 5).map((skill) => (
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
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-neon-green" />
                Soft Skills
              </h4>
              <div className="space-y-4">
                {[
                  { name: 'Communication', level: 92 },
                  { name: 'Leadership', level: 88 },
                  { name: 'Problem Solving', level: 90 },
                  { name: 'Time Management', level: 85 },
                  { name: 'Adaptability', level: 87 }
                ].map((skill, index) => (
                  <div key={index} className="space-y-2">
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
                {[
                  { label: 'Email Notifications', description: 'Receive email updates about projects' },
                  { label: 'Push Notifications', description: 'Get push notifications for urgent matters' },
                  { label: 'Project Updates', description: 'Updates on project progress and milestones' },
                  { label: 'Team Messages', description: 'Notifications for team communications' },
                  { label: 'Weekly Reports', description: 'Receive weekly project reports' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
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
                {[
                  { label: 'Profile Visibility', description: 'Who can see your profile', value: 'Public' },
                  { label: 'Activity Status', description: 'Show when you\'re online', value: 'Enabled' },
                  { label: 'Data Sharing', description: 'Share analytics data', value: 'Limited' },
                  { label: 'Contact Information', description: 'Who can see your contact info', value: 'Team Only' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                    <select className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none">
                      <option>Public</option>
                      <option>Private</option>
                      <option>Team Only</option>
                    </select>
                  </div>
                ))}
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
                  <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity">
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
                    <input type="checkbox" className="sr-only peer" />
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
                {[
                  { device: 'Chrome on Windows', location: 'San Francisco, US', lastActive: 'Current session' },
                  { device: 'Safari on iPhone', location: 'San Francisco, US', lastActive: '2 hours ago' },
                  { device: 'Firefox on Mac', location: 'New York, US', lastActive: '1 week ago' }
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/10">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{session.device}</p>
                        <p className="text-sm text-gray-400">{session.location} • {session.lastActive}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
                      Log Out
                    </button>
                  </div>
                ))}
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
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  )
}