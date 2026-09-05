import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, Repeat, Plus, ChevronDown, Sun, Moon, Zap, Check } from 'lucide-react';

export default function MeetingScheduler() {
  const [isDark, setIsDark] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('1 hour');
  const [timezone, setTimezone] = useState('Indian Standard Time (IST)');
  const [fromTimezone, setFromTimezone] = useState('Indian Standard Time (IST)');
  const [toTimezone, setToTimezone] = useState('Indian Standard Time (IST)');
  const [allDay, setAllDay] = useState(true);
  const [participants, setParticipants] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
      confirmed: false 
    },
    { 
      id: 2, 
      name: 'Ravi Katiyar', 
      email: 'ravikatiyar162@gmail.com', 
      avatar: 'https://ik.imagekit.io/fpxbgsota/Frame%205.png?updatedAt=1753044070628',
      confirmed: true 
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike@example.com', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
      confirmed: false 
    }
  ]);
  const [selectedDays, setSelectedDays] = useState(['S-6']); // Fixed: using unique IDs
  const [isVisible, setIsVisible] = useState(true);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const [showFromTimezoneDropdown, setShowFromTimezoneDropdown] = useState(false);
  const [showToTimezoneDropdown, setShowToTimezoneDropdown] = useState(false);
  const [newParticipantEmail, setNewParticipantEmail] = useState('');

  const freeSlots = [
    { id: 1, date: '19 January 2024', startTime: '9:00 PM', endTime: '10:00 PM', isAvailable: true },
    { id: 2, date: '20 January 2024', startTime: '9:00 PM', endTime: '10:00 PM', isAvailable: true }
  ];

  // Fixed: Each day has unique identifier
  const days = [
    { short: 'M', full: 'Monday', id: 'M-0' },
    { short: 'T', full: 'Tuesday', id: 'T-1' },
    { short: 'W', full: 'Wednesday', id: 'W-2' },
    { short: 'T', full: 'Thursday', id: 'T-3' },
    { short: 'F', full: 'Friday', id: 'F-4' },
    { short: 'S', full: 'Saturday', id: 'S-5' },
    { short: 'S', full: 'Sunday', id: 'S-6' }
  ];

  const durations = ['30 minutes', '1 hour', '1.5 hours', '2 hours', '3 hours', 'Custom'];
  const timezones = [
    'Indian Standard Time (IST)',
    'Coordinated Universal Time (UTC)',
    'Eastern Standard Time (EST)',
    'Pacific Standard Time (PST)',
    'Central European Time (CET)'
  ];

  const toggleDay = (dayId) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const removeParticipant = (id) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const addParticipant = () => {
    if (newParticipantEmail.trim()) {
      const avatars = [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face&auto=format&q=80'
      ];
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      
      const newParticipant = {
        id: Date.now(),
        name: newParticipantEmail.split('@')[0].charAt(0).toUpperCase() + newParticipantEmail.split('@')[0].slice(1),
        email: newParticipantEmail,
        avatar: randomAvatar,
        confirmed: false
      };
      setParticipants(prev => [...prev, newParticipant]);
      setNewParticipantEmail('');
    }
  };

  const toggleParticipantConfirmation = (id) => {
    setParticipants(prev => 
      prev.map(p => p.id === id ? { ...p, confirmed: !p.confirmed } : p)
    );
  };

  const selectSlot = (slotId) => {
    setSelectedSlot(slotId);
    const slot = freeSlots.find(s => s.id === slotId);
    if (slot) {
      setMeetingDate(slot.date);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSave = () => {
    const meetingData = {
      title: meetingTitle,
      date: meetingDate,
      location,
      duration,
      timezone,
      participants,
      selectedDays,
      allDay,
      selectedSlot
    };
    console.log('Meeting saved:', meetingData);
    alert('Meeting scheduled successfully!');
  };

  if (!isVisible) return null;

  const DropdownButton = ({ value, options, isOpen, setIsOpen, onSelect, placeholder }) => (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
          isDark 
            ? 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20' 
            : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
        }`}
      >
        <span className="text-sm truncate">{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl z-50 max-h-48 overflow-y-auto animate-in slide-in-from-top-2 ${
          isDark ? 'bg-gray-800/90 backdrop-blur-xl border-white/20' : 'bg-white border-gray-200'
        }`}>
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-opacity-50 transition-colors duration-200 ${
                value === option 
                  ? isDark ? 'bg-blue-500/30 text-blue-200' : 'bg-blue-50 text-blue-600'
                  : isDark ? 'hover:bg-white/10 text-gray-200' : 'hover:bg-gray-50 text-gray-900'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen w-full p-4 transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900/90 to-purple-900/90' 
        : 'bg-gradient-to-br from-gray-50 to-blue-50/30'
    }`}>
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-3 rounded-full transition-all duration-300 shadow-lg hover:scale-110 ${
            isDark 
              ? 'bg-white/10 backdrop-blur-md text-yellow-400 hover:bg-white/20 border border-white/20' 
              : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className={`rounded-2xl shadow-2xl p-6 transform transition-all duration-500 animate-in slide-in-from-bottom-4 ${
          isDark 
            ? 'bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl' 
            : 'bg-white text-gray-900 shadow-xl'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Add new event</h1>
            <button
              onClick={handleClose}
              className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Meeting Title Input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Meeting heading..."
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className={`w-full text-lg p-4 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:scale-[1.01] ${
                isDark 
                  ? 'bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-gray-300' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Smart Suggestions */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                Smart suggestions <span className="text-purple-400 font-semibold">(Premium)</span>
              </span>
            </div>
            <div className="flex gap-2">
              <DropdownButton
                value={duration}
                options={durations}
                isOpen={showDurationDropdown}
                setIsOpen={setShowDurationDropdown}
                onSelect={setDuration}
                placeholder="Duration"
              />
              <DropdownButton
                value={timezone}
                options={timezones}
                isOpen={showTimezoneDropdown}
                setIsOpen={setShowTimezoneDropdown}
                onSelect={setTimezone}
                placeholder="Timezone"
              />
            </div>
          </div>

          {/* Free Slots */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {freeSlots.map((slot, index) => (
              <div
                key={slot.id}
                onClick={() => selectSlot(slot.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 animate-in slide-in-from-left-4 ${
                  selectedSlot === slot.id
                    ? isDark 
                      ? 'border-blue-400 bg-blue-500/20 backdrop-blur-md shadow-lg shadow-blue-500/25'
                      : 'border-blue-500 bg-blue-50 shadow-lg'
                    : isDark
                    ? 'border-white/20 bg-white/5 backdrop-blur-md hover:border-white/30 hover:bg-white/10'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-lg">Free slot {slot.id}</span>
                  <div className={`p-2 rounded-full transition-all duration-200 ${
                    selectedSlot === slot.id 
                      ? 'bg-blue-500 text-white' 
                      : isDark 
                      ? 'text-blue-400 hover:bg-blue-500/20' 
                      : 'text-blue-500 hover:bg-blue-100'
                  }`}>
                    {selectedSlot === slot.id ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{slot.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className="text-sm">
                    <span className="text-green-500 font-semibold">{slot.startTime}</span>
                    <span className={`mx-2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>→</span>
                    <span className="text-red-500 font-semibold">{slot.endTime}</span>
                  </span>
                </div>
                {slot.isAvailable && (
                  <div className="mt-3 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-500 font-medium">Available</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Date & Time Section */}
          <div className={`p-5 rounded-xl mb-6 ${
            isDark ? 'bg-white/5 backdrop-blur-md border border-white/10' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-lg">Date & Time</span>
              </div>
              <DropdownButton
                value={timezone}
                options={timezones}
                isOpen={showTimezoneDropdown}
                setIsOpen={setShowTimezoneDropdown}
                onSelect={setTimezone}
                placeholder="Timezone"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Meeting date</label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className={`w-full p-4 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:scale-[1.01] ${
                  isDark 
                    ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">From</label>
                <DropdownButton
                  value={fromTimezone}
                  options={timezones}
                  isOpen={showFromTimezoneDropdown}
                  setIsOpen={setShowFromTimezoneDropdown}
                  onSelect={setFromTimezone}
                  placeholder="Select timezone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">To</label>
                <DropdownButton
                  value={toTimezone}
                  options={timezones}
                  isOpen={showToTimezoneDropdown}
                  setIsOpen={setShowToTimezoneDropdown}
                  onSelect={setToTimezone}
                  placeholder="Select timezone"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Location</span>
            </div>
            <input
              type="text"
              placeholder="Choose location or add video call link"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full p-4 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:scale-[1.01] ${
                isDark 
                  ? 'bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-gray-300' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Participants */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Participants</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {participants.length}
              </span>
            </div>
            
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Enter email address"
                value={newParticipantEmail}
                onChange={(e) => setNewParticipantEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                className={`flex-1 p-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-gray-300' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button
                onClick={addParticipant}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {participants.map((participant, index) => (
                <div
                  key={participant.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 animate-in slide-in-from-left-2 hover:scale-105 ${
                    participant.confirmed
                      ? isDark 
                        ? 'bg-green-500/20 backdrop-blur-md border-green-400/30' 
                        : 'bg-green-50 border-green-200'
                      : isDark 
                      ? 'bg-white/5 backdrop-blur-md border-white/20' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <img 
                    src={participant.avatar} 
                    alt={participant.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${participant.name}&background=6366f1&color=fff`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{participant.name}</div>
                    <div className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {participant.email}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleParticipantConfirmation(participant.id)}
                    className={`p-1 rounded-full transition-all duration-200 hover:scale-110 ${
                      participant.confirmed ? 'text-green-500' : isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-400 hover:text-green-500'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeParticipant(participant.id)}
                    className={`transition-colors duration-200 hover:scale-110 ${
                      isDark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Repeating */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Repeat className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">Repeating</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>All day</span>
                <button
                  onClick={() => setAllDay(!allDay)}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
                    allDay 
                      ? 'bg-blue-500 shadow-lg' 
                      : isDark ? 'bg-white/20' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
                    allDay ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className={`text-sm min-w-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Repeat on</span>
              <div className="flex gap-2 flex-wrap">
                {days.map((day, index) => (
                  <button
                    key={day.id} // Fixed: using unique ID
                    onClick={() => toggleDay(day.id)} // Fixed: using unique ID
                    title={day.full}
                    className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-110 ${
                      selectedDays.includes(day.id)
                        ? 'bg-red-500 text-white shadow-lg transform scale-110'
                        : isDark
                        ? 'bg-white/10 backdrop-blur-md text-gray-300 hover:bg-white/20 border border-white/20'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleClose}
              className={`flex-1 py-4 px-6 rounded-xl text-center font-semibold transition-all duration-300 hover:scale-105 ${
                isDark 
                  ? 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!meetingTitle.trim()}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                meetingTitle.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : isDark 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              Save Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}