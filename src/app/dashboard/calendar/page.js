'use client'

import { useState, useEffect } from 'react'
import {
    ChevronLeft, ChevronRight, Plus, Filter,
    Calendar as CalendarIcon, Clock, Users,
    MapPin, Bell, Repeat, Video, MessageSquare,
    CheckCircle, XCircle, MoreVertical, Edit,
    Trash2, Share2, Download, Upload
} from 'lucide-react'

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState('month') // month, week, day
    const [events, setEvents] = useState([])
    const [selectedEvent, setSelectedEvent] = useState(null)

    // Mock events data
    useEffect(() => {
        const mockEvents = [
            {
                id: 1,
                title: 'Project Kickoff Meeting',
                description: 'Initial meeting with the client to discuss project requirements',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15, 10, 0),
                duration: 90, // minutes
                type: 'meeting',
                participants: ['Sarah Chen', 'Mike Rodriguez', 'Client'],
                location: 'Conference Room A / Zoom',
                recurring: false,
                status: 'confirmed'
            },
            {
                id: 2,
                title: 'Code Review Session',
                description: 'Weekly code review for the e-commerce platform',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 16, 14, 0),
                duration: 120,
                type: 'review',
                participants: ['Alex Johnson', 'David Wilson'],
                location: 'Team Room / Google Meet',
                recurring: true,
                status: 'scheduled'
            },
            {
                id: 3,
                title: 'Client Demo',
                description: 'Demo of new features for the mobile banking app',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18, 11, 0),
                duration: 60,
                type: 'demo',
                participants: ['Emma Davis', 'Client Stakeholders'],
                location: 'Client Office',
                recurring: false,
                status: 'pending'
            },
            {
                id: 4,
                title: 'Security Audit Review',
                description: 'Review findings from the security audit',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 9, 30),
                duration: 90,
                type: 'review',
                participants: ['Mike Rodriguez', 'Security Team'],
                location: 'Security Lab',
                recurring: false,
                status: 'confirmed'
            },
            {
                id: 5,
                title: 'Sprint Planning',
                description: 'Planning for next development sprint',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22, 13, 0),
                duration: 120,
                type: 'planning',
                participants: ['Entire Team'],
                location: 'Main Conference Room',
                recurring: true,
                status: 'scheduled'
            }
        ]
        setEvents(mockEvents)
    }, [currentDate])

    const getEventColor = (type) => {
        switch (type) {
            case 'meeting': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            case 'review': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            case 'demo': return 'bg-green-500/20 text-green-400 border-green-500/30'
            case 'planning': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return CheckCircle
            case 'scheduled': return Clock
            case 'pending': return Clock
            default: return XCircle
        }
    }

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        })
    }

    const getDaysInMonth = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()

        return { firstDay, lastDay, daysInMonth }
    }

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const today = () => {
        setCurrentDate(new Date())
    }

    const { firstDay, lastDay, daysInMonth } = getDaysInMonth(currentDate)
    const startDay = firstDay.getDay()

    // Generate calendar days
    const days = []
    for (let i = 0; i < startDay; i++) {
        days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
    }

    // Get events for a specific day
    const getEventsForDay = (day) => {
        if (!day) return []
        return events.filter(event =>
            event.date.getDate() === day.getDate() &&
            event.date.getMonth() === day.getMonth() &&
            event.date.getFullYear() === day.getFullYear()
        )
    }

    const handleEventClick = (event) => {
        setSelectedEvent(event)
    }

    const handleCreateEvent = () => {
        // Open event creation modal
        console.log('Create new event')
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Calendar</h1>
                    <p className="text-gray-400">Schedule and manage your meetings and events</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={handleCreateEvent}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Event
                    </button>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="glass-effect rounded-2xl p-6 border border-white/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={prevMonth}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h2>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={today}
                            className="px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors"
                        >
                            Today
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex rounded-lg border border-white/10 overflow-hidden">
                            <button
                                onClick={() => setView('month')}
                                className={`px-4 py-2 transition-colors ${view === 'month'
                                        ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold'
                                        : 'hover:bg-white/10'
                                    }`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setView('week')}
                                className={`px-4 py-2 transition-colors ${view === 'week'
                                        ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold'
                                        : 'hover:bg-white/10'
                                    }`}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setView('day')}
                                className={`px-4 py-2 transition-colors ${view === 'day'
                                        ? 'bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold'
                                        : 'hover:bg-white/10'
                                    }`}
                            >
                                Day
                            </button>
                        </div>

                        <button className="p-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Month View */}
                {view === 'month' && (
                    <div className="overflow-x-auto">
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="p-3 text-center text-sm font-medium text-gray-400">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day, index) => {
                                const dayEvents = getEventsForDay(day)
                                const isToday = day && day.toDateString() === new Date().toDateString()

                                return (
                                    <div
                                        key={index}
                                        className={`min-h-[120px] p-2 border rounded-lg transition-colors ${day
                                                ? isToday
                                                    ? 'border-neon-green bg-neon-green/10'
                                                    : 'border-white/10 hover:border-neon-green/30 hover:bg-white/5'
                                                : 'border-transparent'
                                            }`}
                                    >
                                        {day && (
                                            <>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`font-medium ${isToday ? 'text-neon-green' : 'text-white'
                                                        }`}>
                                                        {day.getDate()}
                                                    </span>
                                                    {dayEvents.length > 0 && (
                                                        <span className="w-2 h-2 rounded-full bg-neon-green" />
                                                    )}
                                                </div>

                                                <div className="space-y-1">
                                                    {dayEvents.slice(0, 2).map((event) => (
                                                        <div
                                                            key={event.id}
                                                            onClick={() => handleEventClick(event)}
                                                            className={`p-2 rounded text-xs cursor-pointer border ${getEventColor(event.type)}`}
                                                        >
                                                            <div className="font-medium truncate">{event.title}</div>
                                                            <div className="text-xs opacity-80">{formatTime(event.date)}</div>
                                                        </div>
                                                    ))}
                                                    {dayEvents.length > 2 && (
                                                        <div className="text-xs text-gray-400 text-center">
                                                            +{dayEvents.length - 2} more
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Week View */}
                {view === 'week' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-8 gap-1">
                            <div className="p-3"></div>
                            {Array.from({ length: 7 }).map((_, i) => {
                                const date = new Date(currentDate)
                                date.setDate(currentDate.getDate() - currentDate.getDay() + i)
                                return (
                                    <div key={i} className="p-3 text-center">
                                        <div className="text-sm text-gray-400">
                                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </div>
                                        <div className={`text-lg font-bold ${date.toDateString() === new Date().toDateString()
                                                ? 'text-neon-green'
                                                : 'text-white'
                                            }`}>
                                            {date.getDate()}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="h-96 overflow-y-auto">
                            {Array.from({ length: 12 }).map((_, hour) => (
                                <div key={hour} className="grid grid-cols-8 gap-1 border-b border-white/10">
                                    <div className="p-3 text-sm text-gray-400">
                                        {`${hour + 8}:00`}
                                    </div>
                                    {Array.from({ length: 7 }).map((_, day) => (
                                        <div key={day} className="p-3 min-h-[60px] border-r border-white/10 last:border-r-0">
                                            {/* Events would go here */}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Upcoming Events */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="glass-effect rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Upcoming Events</h2>
                            <button className="text-sm text-neon-green hover:underline">
                                View All
                            </button>
                        </div>

                        <div className="space-y-4">
                            {events
                                .sort((a, b) => a.date - b.date)
                                .slice(0, 5)
                                .map((event) => {
                                    const StatusIcon = getStatusIcon(event.status)
                                    return (
                                        <div
                                            key={event.id}
                                            className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-neon-green/30 transition-colors cursor-pointer"
                                            onClick={() => handleEventClick(event)}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                                                        <CalendarIcon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold">{event.title}</h3>
                                                        <p className="text-sm text-gray-400">{event.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <StatusIcon className={`w-5 h-5 ${event.status === 'confirmed' ? 'text-green-400' :
                                                            event.status === 'scheduled' ? 'text-blue-400' :
                                                                'text-yellow-400'
                                                        }`} />
                                                    <button className="p-1 rounded hover:bg-white/10">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span>{formatDate(event.date)} • {formatTime(event.date)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-gray-400" />
                                                    <span>{event.participants.length} participants</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <span className="truncate">{event.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {event.recurring && <Repeat className="w-4 h-4 text-gray-400" />}
                                                    <span>{event.duration} minutes</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                </div>

                {/* Event Details / Quick Actions */}
                <div className="space-y-6">
                    {/* Selected Event Details */}
                    {selectedEvent ? (
                        <div className="glass-effect rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold">Event Details</h3>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-lg mb-2">{selectedEvent.title}</h4>
                                    <p className="text-gray-400">{selectedEvent.description}</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">{formatDate(selectedEvent.date)}</p>
                                            <p className="text-sm text-gray-400">{formatTime(selectedEvent.date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <span>{selectedEvent.duration} minutes</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                        <span>{selectedEvent.location}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">Participants</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {selectedEvent.participants.map((participant, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 rounded-full bg-white/5 text-xs border border-white/10"
                                                    >
                                                        {participant}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-white/10">
                                    <button className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:border-neon-green hover:bg-neon-green/10 transition-colors flex items-center justify-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                        <Video className="w-4 h-4" />
                                        Join
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-effect rounded-2xl p-6 border border-white/10">
                            <h3 className="text-lg font-bold mb-6">No Event Selected</h3>
                            <p className="text-gray-400 mb-6">
                                Click on an event to view details and manage
                            </p>
                            <button
                                onClick={handleCreateEvent}
                                className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-dark font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Create New Event
                            </button>
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="glass-effect rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-bold mb-4">This Month</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Meetings</span>
                                <span className="font-bold">{events.filter(e => e.type === 'meeting').length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Reviews</span>
                                <span className="font-bold">{events.filter(e => e.type === 'review').length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Demos</span>
                                <span className="font-bold">{events.filter(e => e.type === 'demo').length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Total Hours</span>
                                <span className="font-bold">
                                    {events.reduce((sum, event) => sum + event.duration, 0) / 60} hrs
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}