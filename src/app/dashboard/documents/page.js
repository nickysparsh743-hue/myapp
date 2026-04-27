'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
    Search, Filter, Upload, Download,
    FileText, FileImage, FileCode, FileArchive,
    Folder, Share2, MoreVertical, Eye,
    Trash2, Copy, Star, Lock, Globe,
    Calendar, User, HardDrive, Cloud, FolderPlus, X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useDocuments, useProjects } from '@/lib/hooks/useDashboard'
import { createClient } from '@/lib/supabase/client'

export default function DocumentsPage() {
    const { user } = useAuth()
    const { documents: dbDocuments, loading } = useDocuments(user?.id)
    const { projects } = useProjects(user?.id)
    const fileInputRef = useRef(null)
    const router = useRouter()
    const supabase = createClient()

    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [starred, setStarred] = useState(new Set())
    const [view, setView] = useState('grid')
    const [selectedProject, setSelectedProject] = useState('all')
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState(null)
    const [showNewFolder, setShowNewFolder] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')
    const [folders, setFolders] = useState([
        { id: 1, name: 'Project Docs', fileCount: 0, size: '0 B' },
        { id: 2, name: 'Design Assets', fileCount: 0, size: '0 B' },
        { id: 3, name: 'Technical', fileCount: 0, size: '0 B' }
    ])

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Recently'
        const date = new Date(dateString)
        const now = new Date()
        const diff = now - date
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        
        if (days === 0) return 'Today'
        if (days === 1) return 'Yesterday'
        if (days < 7) return `${days} days ago`
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`
        return `${Math.floor(days / 30)} months ago`
    }

    // Get file type from name
    const getFileTypeFromName = (filename) => {
        if (!filename) return 'document'
        const ext = filename.split('.').pop().toLowerCase()
        
        if (['pdf'].includes(ext)) return 'pdf'
        if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return 'design'
        if (['js', 'ts', 'sql', 'py', 'html', 'css'].includes(ext)) return 'code'
        if (['xlsx', 'xls', 'csv'].includes(ext)) return 'spreadsheet'
        if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) return 'media'
        if (['zip', 'rar', '7z'].includes(ext)) return 'archive'
        
        return 'document'
    }

    // Handle file upload
    const handleFileUpload = async (event) => {
        const files = event.target.files
        if (!files || files.length === 0 || !user) return

        setUploading(true)
        setUploadError(null)

        // Allowed MIME types
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/svg+xml',
            'text/plain',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/zip',
            'video/mp4',
            'video/avi',
            'video/quicktime'
        ]

        try {
            for (const file of files) {
                // Validate file type
                if (!allowedTypes.includes(file.type)) {
                    console.warn(`File type ${file.type} not allowed for ${file.name}`)
                    setUploadError(`File type ${file.type} is not supported. Allowed types: PDF, Images, Documents, Spreadsheets, Archives, Videos`)
                    continue
                }

                // Upload file to Supabase Storage
                const fileName = `${user.id}/${Date.now()}-${file.name}`
                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(fileName, file)

                if (uploadError) throw uploadError

                // Save document metadata to database
                const { error: dbError } = await supabase
                    .from('documents')
                    .insert([
                        {
                            user_id: user.id,
                            file_name: file.name,
                            file_size: file.size,
                            file_type: file.type,
                            storage_path: fileName,
                            project_id: selectedProject !== 'all' ? selectedProject : null,
                            is_shared: false,
                            description: ''
                        }
                    ])

                if (dbError) throw dbError
            }

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }

            // Refresh page to show new documents
            router.refresh()
        } catch (error) {
            console.error('Upload error:', error)
            setUploadError(error.message || 'Failed to upload file')
        } finally {
            setUploading(false)
        }
    }

    // Handle create folder
    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            const newFolder = {
                id: folders.length + 1,
                name: newFolderName,
                fileCount: 0,
                size: '0 B'
            }
            setFolders([...folders, newFolder])
            setNewFolderName('')
            setShowNewFolder(false)
        }
    }

    // Handle delete document
    const handleDeleteDocument = async (docId, storagePath) => {
        if (!confirm('Are you sure you want to delete this document?')) return

        try {
            // Delete from storage
            if (storagePath) {
                await supabase.storage
                    .from('documents')
                    .remove([storagePath])
            }

            // Delete from database
            await supabase
                .from('documents')
                .delete()
                .eq('id', docId)

            router.refresh()
        } catch (error) {
            console.error('Delete error:', error)
            setUploadError('Failed to delete document')
        }
    }

    // Handle share document
    const handleShareDocument = async (docId) => {
        try {
            const isShared = dbDocuments.find(d => d.id === docId)?.is_shared
            await supabase
                .from('documents')
                .update({ is_shared: !isShared })
                .eq('id', docId)

            router.refresh()
        } catch (error) {
            console.error('Share error:', error)
        }
    }

    // Filter and search documents
    const filteredDocuments = (dbDocuments || [])
        .filter(doc => {
            if (selectedProject !== 'all' && doc.project_id !== selectedProject) return false
            if (filter === 'shared') return doc.is_shared
            if (filter === 'starred') return starred.has(doc.id)
            return true
        })
        .filter(doc => 
            doc.file_name?.toLowerCase().includes(search.toLowerCase()) ||
            doc.description?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    // Recent files (last 5)
    const recentFiles = (dbDocuments || [])
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)

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
                    <label className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50">
                        <Upload className="w-4 h-4" />
                        {uploading ? 'Uploading...' : 'Upload'}
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                    </label>
                    <button 
                        onClick={() => setShowNewFolder(true)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <FolderPlus className="w-4 h-4" />
                        New Folder
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {uploadError && (
                <div className="glass-effect rounded-2xl p-4 border border-red-400/30 bg-red-400/10 flex items-center justify-between">
                    <span className="text-red-400">{uploadError}</span>
                    <button onClick={() => setUploadError(null)}>
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* New Folder Modal */}
            {showNewFolder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-2xl">
                    <div className="glass-effect rounded-2xl p-6 border border-white/10 w-96">
                        <h3 className="text-xl font-bold mb-4">Create New Folder</h3>
                        <input
                            type="text"
                            placeholder="Folder name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none mb-4"
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setShowNewFolder(false)}
                                className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateFolder}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Storage Overview */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold mb-2">Storage Overview</h2>
                        <p className="text-gray-400">{formatFileSize((dbDocuments || []).reduce((sum, doc) => sum + (doc.file_size || 0), 0))} used</p>
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
                    <h2 className="text-xl font-bold">My Folders</h2>
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

            {/* Recent Files */}
            {recentFiles.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold mb-6">Recent Files</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recentFiles.map((file) => {
                            const fileType = getFileTypeFromName(file.file_name)
                            const FileIcon = getFileIcon(fileType)
                            const isStarred = starred.has(file.id)
                            return (
                                <div key={file.id} className="glass-effect rounded-2xl border border-white/10 p-6 hover:border-neon-green/30 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${getFileColor(fileType)}`}>
                                            <FileIcon className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => {
                                                    const newStarred = new Set(starred)
                                                    isStarred ? newStarred.delete(file.id) : newStarred.add(file.id)
                                                    setStarred(newStarred)
                                                }}
                                                className="p-1 hover:bg-white/10 rounded transition-colors"
                                            >
                                                <Star className={`w-4 h-4 ${isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                                            </button>
                                            {file.is_shared ? (
                                                <Share2 className="w-4 h-4 text-neon-green" />
                                            ) : (
                                                <Lock className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="font-medium mb-2 truncate">{file.file_name}</h3>
                                    <p className="text-sm text-gray-400 mb-4">{formatFileSize(file.file_size)}</p>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-400">{formatDate(file.created_at)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                        <button className="flex-1 px-3 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors text-sm flex items-center justify-center gap-1">
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                        <button 
                                            onClick={() => handleShareDocument(file.id)}
                                            className="px-3 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* All Files */}
            <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold">All Files</h2>

                    <div className="flex items-center gap-4 flex-wrap">
                        {/* Project Filter */}
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-green focus:outline-none text-sm"
                        >
                            <option value="all">All Projects</option>
                            {(projects || []).map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
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
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading documents...</p>
                        </div>
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No documents found</p>
                        </div>
                    </div>
                ) : view === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredDocuments.map((file) => {
                            const fileType = getFileTypeFromName(file.file_name)
                            const FileIcon = getFileIcon(fileType)
                            const isStarred = starred.has(file.id)
                            return (
                                <div key={file.id} className="glass-effect rounded-2xl border border-white/10 p-6 hover:border-neon-green/30 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${getFileColor(fileType)}`}>
                                            <FileIcon className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => {
                                                    const newStarred = new Set(starred)
                                                    isStarred ? newStarred.delete(file.id) : newStarred.add(file.id)
                                                    setStarred(newStarred)
                                                }}
                                                className="p-1 hover:bg-white/10 rounded transition-colors"
                                            >
                                                <Star className={`w-4 h-4 ${isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                                            </button>
                                            {file.is_shared ? (
                                                <Share2 className="w-4 h-4 text-neon-green" />
                                            ) : (
                                                <Lock className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="font-medium mb-2 truncate">{file.file_name}</h3>
                                    <p className="text-sm text-gray-400 mb-4">{formatFileSize(file.file_size)}</p>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-400">{formatDate(file.created_at)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                        <button className="flex-1 px-3 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors text-sm flex items-center justify-center gap-1">
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                        <button 
                                            onClick={() => handleShareDocument(file.id)}
                                            className="px-3 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors"
                                            title={file.is_shared ? 'Unshare' : 'Share'}
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDocument(file.id, file.storage_path)}
                                            className="px-3 py-2 rounded-lg border border-white/10 hover:border-red-400 hover:bg-red-400/10 transition-colors text-red-400"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredDocuments.map((file) => {
                            const fileType = getFileTypeFromName(file.file_name)
                            const FileIcon = getFileIcon(fileType)
                            const isStarred = starred.has(file.id)
                            return (
                                <div key={file.id} className="glass-effect rounded-xl border border-white/10 p-4 flex items-center justify-between hover:border-neon-green/30 transition-colors">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`p-2 rounded-lg ${getFileColor(fileType)}`}>
                                            <FileIcon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{file.file_name}</p>
                                            <p className="text-sm text-gray-400">{formatFileSize(file.file_size)}</p>
                                        </div>
                                        <span className="text-sm text-gray-400">{formatDate(file.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                const newStarred = new Set(starred)
                                                isStarred ? newStarred.delete(file.id) : newStarred.add(file.id)
                                                setStarred(newStarred)
                                            }}
                                            className="p-2 hover:bg-white/10 rounded transition-colors"
                                        >
                                            <Star className={`w-4 h-4 ${isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                                        </button>
                                        <button className="p-2 hover:bg-white/10 rounded transition-colors">
                                            <Download className="w-4 h-4 text-gray-400" />
                                        </button>
                                        <button 
                                            onClick={() => handleShareDocument(file.id)}
                                            className="p-2 hover:bg-white/10 rounded transition-colors"
                                        >
                                            <Share2 className="w-4 h-4 text-gray-400" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDocument(file.id, file.storage_path)}
                                            className="p-2 hover:bg-white/10 rounded transition-colors text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}