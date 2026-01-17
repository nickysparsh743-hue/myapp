'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Save, Upload, Calendar, Users, 
  DollarSign, Target, CheckCircle, Clock,
  FileText, Link, Globe, Shield, Zap
} from 'lucide-react'

export default function NewProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [project, setProject] = useState({
    name: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    budget: '',
    priority: 'medium',
    teamMembers: [],
    milestones: [
      { id: 1, name: 'Project Kickoff', dueDate: '', completed: false },
      { id: 2, name: 'Design Approval', dueDate: '', completed: false },
      { id: 3, name: 'Development Phase 1', dueDate: '', completed: false },
      { id: 4, name: 'Testing & QA', dueDate: '', completed: false },
      { id: 5, name: 'Deployment', dueDate: '', completed: false }
    ],
    requirements: '',
    attachments: []
  })

  const categories = [
    'Web Development',
    'Mobile App',
    'AI/ML Solution',
    'Cybersecurity',
    'Data Analytics',
    'Graphics & Design',
    'Writing & Content',
    'Other'
  ]

  const teamOptions = [
    { id: 1, name: 'Sarah Chen', role: 'Lead Developer' },
    { id: 2, name: 'Mike Rodriguez', role: 'Security Lead' },
    { id: 3, name: 'Alex Johnson', role: 'AI Specialist' },
    { id: 4, name: 'Emma Davis', role: 'UX Designer' },
    { id: 5, name: 'David Wilson', role: 'Project Manager' }
  ]

  const handleInputChange = (field, value) => {
    setProject(prev => ({ ...prev, [field]: value }))
  }

  const handleMilestoneChange = (id, field, value) => {
    setProject(prev => ({
      ...prev,
      milestones: prev.milestones.map(milestone =>
        milestone.id === id ? { ...milestone, [field]: value } : milestone
      )
    }))
  }

  const handleTeamToggle = (memberId) => {
    setProject(prev => {
      const isSelected = prev.teamMembers.includes(memberId)
      return {
        ...prev,
        teamMembers: isSelected
          ? prev.teamMembers.filter(id => id !== memberId)
          : [...prev.teamMembers, memberId]
      }
    })
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    setProject(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type
      }))]
    }))
  }

  const removeAttachment = (id) => {
    setProject(prev => ({
      ...prev,
      attachments: prev.attachments.filter(file => file.id !== id)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle project creation logic
    console.log('Creating project:', project)
    router.push('/dashboard/projects')
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Projects
        </button>
        <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
        <p className="text-gray-400">Fill in the details to start a new project</p>
      </div>

      {/* Progress Steps */}
      <div className="glass-effect rounded-2xl p-6 border border-white/10 mb-8">
        <div className="flex items-center justify-between mb-8">
          {[
            { number: 1, label: 'Basic Info' },
            { number: 2, label: 'Team & Budget' },
            { number: 3, label: 'Milestones' },
            { number: 4, label: 'Review' }
          ].map((s) => (
            <div key={s.number} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                step >= s.number
                  ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark'
                  : 'bg-white/10 text-gray-400'
              }`}>
                {step > s.number ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="text-lg font-bold">{s.number}</span>
                )}
              </div>
              <span className={`text-sm ${
                step >= s.number ? 'font-medium' : 'text-gray-400'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all duration-300"
            style={{ width: `${(step - 1) * 33.33}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="glass-effect rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Project Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Project Name *</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter project name"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={project.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the project goals and objectives"
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={project.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={project.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={project.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Team & Budget */}
        {step === 2 && (
          <div className="glass-effect rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Team & Budget</h2>
            
            <div className="space-y-8">
              {/* Team Selection */}
              <div>
                <label className="block text-sm font-medium mb-4">Select Team Members</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamOptions.map((member) => {
                    const isSelected = project.teamMembers.includes(member.id)
                    return (
                      <div
                        key={member.id}
                        onClick={() => handleTeamToggle(member.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-neon-green bg-gradient-to-r from-neon-green/20 to-neon-blue/20'
                            : 'border-white/10 hover:border-neon-green/30 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center">
                              <Users className="w-5 h-5 text-dark" />
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-400">{member.role}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                            isSelected
                              ? 'bg-neon-green border-neon-green'
                              : 'border-white/20'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-dark" />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Budget & Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Estimate</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={project.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="Enter budget amount"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Leave empty for custom quote</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority Level</label>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high', 'critical'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleInputChange('priority', level)}
                        className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                          project.priority === level
                            ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Requirements */}
              <div>
                <label className="block text-sm font-medium mb-2">Additional Requirements</label>
                <textarea
                  value={project.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Any specific requirements, constraints, or notes..."
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Milestones */}
        {step === 3 && (
          <div className="glass-effect rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Project Milestones</h2>
            
            <div className="space-y-6">
              {project.milestones.map((milestone) => (
                <div key={milestone.id} className="p-6 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-neon-green/20 to-neon-blue/20">
                      <Target className="w-6 h-6 text-neon-green" />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={milestone.name}
                        onChange={(e) => handleMilestoneChange(milestone.id, 'name', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none text-lg font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={milestone.completed}
                          onChange={(e) => handleMilestoneChange(milestone.id, 'completed', e.target.checked)}
                          className="w-5 h-5 rounded border-white/20 bg-white/5"
                        />
                        <span className="text-sm">Completed</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Due Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={milestone.dueDate}
                          onChange={(e) => handleMilestoneChange(milestone.id, 'dueDate', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Approval Required</label>
                      <select className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none">
                        <option>Client Approval</option>
                        <option>Internal Review</option>
                        <option>No Approval Needed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newId = Math.max(...project.milestones.map(m => m.id)) + 1
                  handleInputChange('milestones', [
                    ...project.milestones,
                    { id: newId, name: 'New Milestone', dueDate: '', completed: false }
                  ])
                }}
                className="w-full py-4 rounded-lg border-2 border-dashed border-white/20 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Another Milestone
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <div className="glass-effect rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Review & Submit</h2>
            
            <div className="space-y-8">
              {/* Project Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-neon-green" />
                    Project Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Project Name</p>
                      <p className="font-medium">{project.name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Category</p>
                      <p className="font-medium">{project.category || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Timeline</p>
                      <p className="font-medium">
                        {project.startDate || 'Not specified'} - {project.endDate || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-neon-green" />
                    Team & Budget
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Team Members</p>
                      <p className="font-medium">{project.teamMembers.length} selected</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Budget</p>
                      <p className="font-medium">{project.budget || 'Custom quote'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Priority</p>
                      <p className="font-medium capitalize">{project.priority}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones Summary */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-neon-green" />
                  Milestones
                </h3>
                <div className="space-y-3">
                  {project.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-green/20 to-neon-blue/20 flex items-center justify-center">
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{milestone.name}</p>
                          <p className="text-sm text-gray-400">
                            Due: {milestone.dueDate || 'Not set'}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${
                        milestone.completed
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {milestone.completed ? 'Approved' : 'Pending'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Attachments */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-neon-green" />
                  Attachments
                </h3>
                <div className="space-y-3">
                  {project.attachments.length > 0 ? (
                    project.attachments.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(file.id)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No files attached</p>
                  )}
                  
                  <label className="block cursor-pointer">
                    <div className="p-4 rounded-lg border-2 border-dashed border-white/20 hover:border-neon-green hover:bg-neon-green/10 transition-colors text-center">
                      <Upload className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm">Click to add more files</span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Final Actions */}
              <div className="pt-8 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors"
                  >
                    Back
                  </button>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => router.push('/dashboard/projects')}
                      className="px-6 py-3 rounded-lg border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Create Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons (for steps 1-3) */}
        {step < 4 && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg border border-white/10 transition-colors ${
                step === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:border-neon-green hover:bg-neon-green/10'
              }`}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity"
            >
              {step === 3 ? 'Review & Submit' : 'Continue'}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}