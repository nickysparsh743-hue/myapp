'use client'

import { useState } from 'react'
import {
    Search, Filter, Upload, Download,
    FileText, FileImage, FileCode, FileArchive,
    Folder, Share2, MoreVertical, Eye,
    Trash2, Copy, Star, Lock, Globe,
    Calendar, User, HardDrive, Cloud
} from 'lucide-react'

export default function DocumentsPage() {
    const [files, setFiles] = useState([
        {
            id: 1,
            name: 'Project Proposal.pdf',
            type: 'pdf',
            size: '2.4 MB',
            uploaded: '2 days ago',
            uploadedBy: 'Sarah Chen',
            shared: true,
            starred: true,
            folder: 'Project Docs'
        },
        {
            id: 2,
            name: 'Wireframes.fig',
            type: 'design',
            size: '8.7 MB',
            uploaded: '1 week ago',
            uploadedBy: 'Mike Rodriguez',
            shared: true,
            starred: false,
            folder: 'Design Assets'
        },
        {
            id: 3,
            name: 'API Documentation.md',
            type: 'code',
            size: '145 KB',
            uploaded: '3 days ago',
            uploadedBy: 'Alex Johnson',
            shared: true,
            starred: true,
            folder: 'Technical'
        },
        {
            id: 4,
            name: 'Budget Report.xlsx',
            type: 'spreadsheet',
            size: '3.2 MB',
            uploaded: 'Yesterday',
            uploadedBy: 'Emma Davis',
            shared: false,
            starred: false,
            folder: 'Finance'
        },
        {
            id: 5,
            name: 'Meeting Recording.mp4',
            type: 'media',
            size: '45.2 MB',
            uploaded: '4 days ago',
            uploadedBy: 'John Smith',
            shared: true,
            starred: false,
            folder: 'Meetings'
        },
        {
            id: 6,
            name: 'Database Schema.sql',
            type: 'code',
            size: '890 KB',
            uploaded: '2 weeks ago',
            uploadedBy: 'Alex Johnson',
            shared: true,
            starred: true,
            folder: 'Technical'
        },
        {
            id: 7,
            name: 'Logo Assets.zip',
            type: 'archive',
            size: '12.5 MB',
            uploaded: '1 month ago',
            uploadedBy: 'Sarah Chen',
            shared: true,
            starred: false,
            folder: 'Design Assets'
        },
        {
            id: 8,
            name: 'Contract Agreement.docx',
            type: 'document',
            size: '1.8 MB',
            uploaded: '3 days ago',
            uploadedBy: 'Emma Davis',
            shared: false,
            starred: true,
            folder: 'Legal'
        }
    ])

    const [folders, setFolders] = useState([
        { id: 1, name: 'Project Docs', fileCount: 24, size: '45.2 MB' },
        { id: 2, name: 'Design Assets', fileCount: 18, size: '156.7 MB' },
        { id: 3, name: 'Technical', fileCount: 32, size: '23.4 MB' },
        { id: 4, name: 'Meetings', fileCount: 15, size: '210.5 MB' },
        { id: 5, name: 'Finance', fileCount: 8, size: '12.3 MB' },
        { id: 6, name: 'Legal', fileCount: 6, size: '8.9 MB' }
    ])

    const [filter, setFilter] = useState('all')
    const [view, setView] = useState('grid')

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf': return FileText
            case 'design': return FileImage
            case 'code': return FileCode
            case 'spreadsheet': return FileText
            case 'media': return FileImage
            case 'archive': return FileArchive
            default: return FileText
        }
    }

    const getFileColor = (type) => {
        switch (type) {
            case 'pdf': return 'text-red-400 bg-red-400/10'
            case 'design': return 'text-purple-400 bg-purple-400/10'
            case 'code': return 'text-blue-400 bg-blue-400/10'
            case 'spreadsheet': return 'text-green-400 bg-green-400/10'
            case 'media': return 'text-yellow-400 bg-yellow-400/10'
            case 'archive': return 'text-gray-400 bg-gray-400/10'
            default: return 'text-gray-400 bg-white/5'
        }
    }

    const handleFileUpload = (event) => {
        const files = event.target.files
        // Handle file upload logic here
        console.log('Files to upload:', files)
    }

    const handleShare = (fileId) => {
        // Handle file sharing logic
        console.log('Sharing file:', fileId)
    }

    const handleDownload = (fileId) => {
        // Handle file download logic
        console.log('Downloading file:', fileId)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Documents</h1>
                    <p className="text-gray-400">Manage and share project files</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* File Upload */}
                    <label className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center gap-2 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Upload
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                    </label>
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                        <Folder className="w-4 h-4" />
                        New Folder
                    </button>
                </div>
            </div>

            {/* Storage Overview */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold mb-2">Storage Overview</h2>
                        <p className="text-gray-400">4.2 GB of 10 GB used (42%)</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center gap-2">
                        <HardDrive className="w-4 h-4" />
                        Upgrade Storage
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full" style={{ width: '42%' }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-400/10">
                                    <FileText className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <p className="font-medium">Documents</p>
                                    <p className="text-sm text-gray-400">1.2 GB</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-400/10">
                                    <FileImage className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="font-medium">Images</p>
                                    <p className="text-sm text-gray-400">2.1 GB</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-400/10">
                                    <FileCode className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-medium">Code</p>
                                    <p className="text-sm text-gray-400">0.8 GB</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-yellow-400/10">
                                    <Cloud className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="font-medium">Other</p>
                                    <p className="text-sm text-gray-400">0.1 GB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Folders */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Folders</h2>
                    <button className="text-sm text-neon-green hover:underline">
                        View All
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {folders.map((folder) => (
                        <div key={folder.id} className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-neon-green/30 transition-colors cursor-pointer">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-neon-green/20 to-neon-blue/20 flex items-center justify-center mb-3">
                                    <Folder className="w-6 h-6 text-neon-green" />
                                </div>
                                <h3 className="font-medium mb-1">{folder.name}</h3>
                                <p className="text-sm text-gray-400">{folder.fileCount} files</p>
                                <p className="text-xs text-gray-500 mt-1">{folder.size}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Files */}
            <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold">Recent Files</h2>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search files..."
                                className="pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none text-sm"
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setView('grid')}
                                className={`p-2 rounded-lg transition-colors ${view === 'grid'
                                        ? 'bg-neon-green/10 border border-neon-green/30'
                                        : 'border border-white/10 hover:border-neon-green/30'
                                    }`}
                            >
                                <div className="grid grid-cols-2 gap-1 w-5 h-5">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="w-2 h-2 bg-current rounded" />
                                    ))}
                                </div>
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={`p-2 rounded-lg transition-colors ${view === 'list'
                                        ? 'bg-neon-green/10 border border-neon-green/30'
                                        : 'border border-white/10 hover:border-neon-green/30'
                                    }`}
                            >
                                <div className="space-y-1 w-5 h-5">
                                    <div className="w-full h-1 bg-current rounded" />
                                    <div className="w-full h-1 bg-current rounded" />
                                    <div className="w-full h-1 bg-current rounded" />
                                </div>
                            </button>
                        </div>

                        {/* Filter */}
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none text-sm"
                        >
                            <option value="all">All Files</option>
                            <option value="shared">Shared</option>
                            <option value="starred">Starred</option>
                            <option value="recent">Recent</option>
                        </select>
                    </div>
                </div>

                {/* Files Grid/List */}
                {view === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {files.map((file) => {
                            const FileIcon = getFileIcon(file.type)
                            return (
                                <div key={file.id} className="glass-effect rounded-2xl border border-white/10 p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${getFileColor(file.type)}`}>
                                            <FileIcon className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {file.starred && (
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            )}
                                            {file.shared ? (
                                                <Share2 className="w-4 h-4 text-neon-green" />
                                            ) : (
                                                <Lock className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="font-medium mb-2 truncate">{file.name}</h3>
                                    <p className="text-sm text-gray-400 mb-4">{file.size}</p>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-400">{file.uploadedBy}</span>
                                        </div>
                                        <span className="text-gray-400">{file.uploaded}</span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                        <button
                                            onClick={() => handleDownload(file.id)}
                                            className="flex-1 px-3 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors text-sm flex items-center justify-center gap-1"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                        <button
                                            onClick={() => handleShare(file.id)}
                                            className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            Share
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="glass-effect rounded-2xl border border-white/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left p-4 font-medium">Name</th>
                                        <th className="text-left p-4 font-medium">Type</th>
                                        <th className="text-left p-4 font-medium">Size</th>
                                        <th className="text-left p-4 font-medium">Uploaded</th>
                                        <th className="text-left p-4 font-medium">Shared</th>
                                        <th className="text-left p-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.map((file) => {
                                        const FileIcon = getFileIcon(file.type)
                                        return (
                                            <tr key={file.id} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${getFileColor(file.type)}`}>
                                                            <FileIcon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium">{file.name}</span>
                                                                {file.starred && (
                                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-400">{file.folder}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs ${getFileColor(file.type)}`}>
                                                        {file.type.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-400">{file.size}</td>
                                                <td className="p-4">
                                                    <div className="text-sm">
                                                        <p>{file.uploaded}</p>
                                                        <p className="text-gray-400">by {file.uploadedBy}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {file.shared ? (
                                                        <div className="flex items-center gap-1 text-neon-green">
                                                            <Globe className="w-4 h-4" />
                                                            <span className="text-sm">Shared</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-gray-400">
                                                            <Lock className="w-4 h-4" />
                                                            <span className="text-sm">Private</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleDownload(file.id)}
                                                            className="p-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors"
                                                            title="Download"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleShare(file.id)}
                                                            className="p-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors"
                                                            title="Share"
                                                        >
                                                            <Share2 className="w-4 h-4" />
                                                        </button>
                                                        <div className="relative group">
                                                            <button className="p-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                            <div className="absolute right-0 mt-2 w-48 glass-effect rounded-lg border border-white/10 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                                                                <div className="p-2">
                                                                    <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                                        <Eye className="w-4 h-4" />
                                                                        Preview
                                                                    </button>
                                                                    <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                                        <Copy className="w-4 h-4" />
                                                                        Copy Link
                                                                    </button>
                                                                    <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                                                                        <Star className="w-4 h-4" />
                                                                        {file.starred ? 'Unstar' : 'Star'}
                                                                    </button>
                                                                    <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors text-red-400 flex items-center gap-2">
                                                                        <Trash2 className="w-4 h-4" />
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Activity */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold mb-6">Recent File Activity</h2>
                <div className="space-y-4">
                    {[
                        {
                            user: 'Sarah Chen',
                            action: 'uploaded',
                            file: 'Project Proposal.pdf',
                            time: '2 hours ago'
                        },
                        {
                            user: 'Mike Rodriguez',
                            action: 'edited',
                            file: 'Wireframes.fig',
                            time: '4 hours ago'
                        },
                        {
                            user: 'Alex Johnson',
                            action: 'shared',
                            file: 'API Documentation.md',
                            time: 'Yesterday'
                        },
                        {
                            user: 'Emma Davis',
                            action: 'downloaded',
                            file: 'Budget Report.xlsx',
                            time: '2 days ago'
                        }
                    ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center">
                                    <User className="w-5 h-5 text-dark" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        <span className="text-neon-green">{activity.user}</span>{' '}
                                        {activity.action}{' '}
                                        <span className="text-white">{activity.file}</span>
                                    </p>
                                    <p className="text-sm text-gray-400">{activity.time}</p>
                                </div>
                            </div>
                            <button className="px-3 py-1 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors text-sm">
                                View
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}