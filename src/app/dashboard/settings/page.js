'use client'

import { useState } from 'react'
import {
    Save, Bell, Shield, User, Mail,
    Globe, CreditCard, Database, Palette,
    Smartphone, Lock, Eye, EyeOff, Key,
    Trash2, Download, Upload, Check,
    X, AlertTriangle, Info, Moon, Sun
} from 'lucide-react'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')
    const [saving, setSaving] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [profile, setProfile] = useState({
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+254 700 000 000',
        company: 'Tech Solutions Inc.',
        role: 'Project Manager',
        timezone: 'Africa/Nairobi',
        language: 'English',
        theme: 'dark'
    })

    const [security, setSecurity] = useState({
        twoFactor: true,
        loginAlerts: true,
        sessionTimeout: 30,
        passwordLastChanged: '2024-10-15'
    })

    const [notifications, setNotifications] = useState({
        email: {
            projectUpdates: true,
            messages: true,
            milestones: true,
            security: true
        },
        push: {
            projectUpdates: true,
            messages: false,
            milestones: true,
            security: true
        }
    })

    const handleSave = async () => {
        setSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSaving(false)
        // Show success message
    }

    const handlePasswordChange = () => {
        const current = prompt('Enter current password:')
        const newPass = prompt('Enter new password:')
        const confirm = prompt('Confirm new password:')

        if (newPass === confirm) {
            // Handle password change
            console.log('Password changed')
        } else {
            alert('Passwords do not match')
        }
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'data', label: 'Data & Privacy', icon: Database }
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
                                    <h3 className="font-bold">{profile.name}</h3>
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
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Company</label>
                                        <input
                                            type="text"
                                            value={profile.company}
                                            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none"
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
                                                    Last changed: {security.passwordLastChanged}
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
                                            <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center gap-2">
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
                                                        {key.split(/(?=[A-Z])/).join(' ')}
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
                                                        {key.split(/(?=[A-Z])/).join(' ')}
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

                                {/* Notification Settings */}
                                <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                    <h4 className="font-bold mb-4">Advanced Settings</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Quiet Hours</p>
                                                <p className="text-sm text-gray-400">
                                                    Disable non-urgent notifications during specific hours
                                                </p>
                                            </div>
                                            <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                                                Configure
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Notification Sounds</p>
                                                <p className="text-sm text-gray-400">
                                                    Play sound for important notifications
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    defaultChecked
                                                />
                                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Billing Settings */}
                    {activeTab === 'billing' && (
                        <div className="glass-effect rounded-2xl p-8 border border-white/10">
                            <h2 className="text-2xl font-bold mb-6">Billing & Subscription</h2>

                            <div className="space-y-8">
                                {/* Current Plan */}
                                <div className="p-6 rounded-lg bg-gradient-to-r from-neon-green/10 to-neon-blue/10 border border-neon-green/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold">Professional Plan</h3>
                                            <p className="text-gray-300">$299/month • Billed annually</p>
                                        </div>
                                        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold">
                                            Active
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Projects</p>
                                            <p className="font-bold">Unlimited</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Storage</p>
                                            <p className="font-bold">100 GB</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Team Members</p>
                                            <p className="font-bold">Up to 10</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Support</p>
                                            <p className="font-bold">24/7 Priority</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Payment Method</h3>
                                    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                                    <CreditCard className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Visa ending in 4242</p>
                                                    <p className="text-sm text-gray-400">Expires 12/2025</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                                                Update
                                            </button>
                                        </div>
                                        <button className="w-full py-3 rounded-lg border-2 border-dashed border-white/20 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                                            Add New Payment Method
                                        </button>
                                    </div>
                                </div>

                                {/* Billing History */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Billing History</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/10">
                                                    <th className="text-left p-4 font-medium">Date</th>
                                                    <th className="text-left p-4 font-medium">Description</th>
                                                    <th className="text-left p-4 font-medium">Amount</th>
                                                    <th className="text-left p-4 font-medium">Status</th>
                                                    <th className="text-left p-4 font-medium">Invoice</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    { date: 'Nov 15, 2024', desc: 'Professional Plan', amount: '$299.00', status: 'Paid' },
                                                    { date: 'Oct 15, 2024', desc: 'Professional Plan', amount: '$299.00', status: 'Paid' },
                                                    { date: 'Sep 15, 2024', desc: 'Professional Plan', amount: '$299.00', status: 'Paid' },
                                                    { date: 'Aug 15, 2024', desc: 'Professional Plan + Storage', amount: '$349.00', status: 'Paid' }
                                                ].map((invoice, idx) => (
                                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                                                        <td className="p-4">{invoice.date}</td>
                                                        <td className="p-4">{invoice.desc}</td>
                                                        <td className="p-4">{invoice.amount}</td>
                                                        <td className="p-4">
                                                            <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                                                                {invoice.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <button className="text-neon-green hover:underline">
                                                                Download
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance Settings */}
                    {activeTab === 'appearance' && (
                        <div className="glass-effect rounded-2xl p-8 border border-white/10">
                            <h2 className="text-2xl font-bold mb-6">Appearance Settings</h2>

                            <div className="space-y-8">
                                {/* Theme */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Theme</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button
                                            onClick={() => setProfile({ ...profile, theme: 'dark' })}
                                            className={`p-6 rounded-lg border-2 transition-all ${profile.theme === 'dark'
                                                    ? 'border-neon-green bg-gradient-to-r from-neon-green/20 to-neon-blue/20'
                                                    : 'border-white/10 hover:border-neon-green/30 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <Moon className="w-8 h-8 mb-3" />
                                                <span className="font-medium">Dark</span>
                                                <span className="text-sm text-gray-400">Default</span>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setProfile({ ...profile, theme: 'light' })}
                                            className={`p-6 rounded-lg border-2 transition-all ${profile.theme === 'light'
                                                    ? 'border-neon-green bg-gradient-to-r from-neon-green/20 to-neon-blue/20'
                                                    : 'border-white/10 hover:border-neon-green/30 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <Sun className="w-8 h-8 mb-3" />
                                                <span className="font-medium">Light</span>
                                                <span className="text-sm text-gray-400">Coming soon</span>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setProfile({ ...profile, theme: 'auto' })}
                                            className={`p-6 rounded-lg border-2 transition-all ${profile.theme === 'auto'
                                                    ? 'border-neon-green bg-gradient-to-r from-neon-green/20 to-neon-blue/20'
                                                    : 'border-white/10 hover:border-neon-green/30 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="relative w-8 h-8 mb-3">
                                                    <Sun className="w-6 h-6 absolute left-0" />
                                                    <Moon className="w-6 h-6 absolute right-0" />
                                                </div>
                                                <span className="font-medium">Auto</span>
                                                <span className="text-sm text-gray-400">System setting</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* UI Density */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4">UI Density</h3>
                                    <div className="flex gap-4">
                                        {['Compact', 'Comfortable', 'Spacious'].map((density) => (
                                            <button
                                                key={density}
                                                className={`flex-1 py-4 rounded-lg border transition-colors ${profile.uiDensity === density.toLowerCase()
                                                        ? 'border-neon-green bg-gradient-to-r from-neon-green/20 to-neon-blue/20'
                                                        : 'border-white/10 hover:border-neon-green/30 hover:bg-white/5'
                                                    }`}
                                            >
                                                {density}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Accent Color */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Accent Color</h3>
                                    <div className="grid grid-cols-5 gap-3">
                                        {[
                                            { name: 'Neon Green', value: '#00ff9d' },
                                            { name: 'Neon Blue', value: '#0088ff' },
                                            { name: 'Purple', value: '#9d00ff' },
                                            { name: 'Orange', value: '#ff8800' },
                                            { name: 'Pink', value: '#ff0088' }
                                        ].map((color) => (
                                            <button
                                                key={color.value}
                                                className="flex flex-col items-center gap-2"
                                            >
                                                <div
                                                    className="w-12 h-12 rounded-full border-2 border-white/20"
                                                    style={{ backgroundColor: color.value }}
                                                />
                                                <span className="text-sm">{color.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data & Privacy Settings */}
                    {activeTab === 'data' && (
                        <div className="glass-effect rounded-2xl p-8 border border-white/10">
                            <h2 className="text-2xl font-bold mb-6">Data & Privacy</h2>

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
                                        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                                            <Download className="w-4 h-4" />
                                            Export Data
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        The export may take some time to prepare. You'll receive an email when it's ready.
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
                                        <button className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2">
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

                                {/* Privacy Settings */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold">Privacy Settings</h3>

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
                                                defaultChecked
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
                                                defaultChecked
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Cookie Preferences */}
                                <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                    <h3 className="text-lg font-bold mb-4">Cookie Preferences</h3>
                                    <p className="text-gray-400 mb-4">
                                        Manage your cookie settings for this dashboard
                                    </p>
                                    <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                                        Manage Cookies
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}