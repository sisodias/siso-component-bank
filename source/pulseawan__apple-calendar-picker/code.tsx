"use client";
import React, { useState, useEffect } from 'react';

// --- ICONS (Zero external packages needed, pure inline SVGs) ---
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const DropdownArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;

// --- MONTH NAMES ---
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// --- HELPERS ---
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

// --- MAIN EXPORTED CALENDAR COMPONENT ---
export const Component = ({ isOpen, onClose, onDateTimeSelect, initialDate }: any) => {
    const today = initialDate ? new Date(initialDate) : new Date(2022, 8, 7); // Default September 7, 2022
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState(today.getDate());
    
    // Dropdown toggle state
    const [showDropdown, setShowDropdown] = useState(false);

    // Time states
    const [hours, setHours] = useState("09");
    const [minutes, setMinutes] = useState("41");
    const [ampm, setAmpm] = useState("AM");

    // Theme state
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, [isOpen]);

    const toggleTheme = () => {
        const nextDark = !isDark;
        setIsDark(nextDark);
        if (nextDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    if (!isOpen) return null;

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleSelectDay = (day: number) => {
        setSelectedDay(day);
        triggerSelect(day, hours, minutes, ampm);
    };

    const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 2) val = val.slice(0, 2);
        const num = parseInt(val);
        if (num > 12) val = "12";
        setHours(val);
        triggerSelect(selectedDay, val, minutes, ampm);
    };

    const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 2) val = val.slice(0, 2);
        const num = parseInt(val);
        if (num > 59) val = "59";
        setMinutes(val);
        triggerSelect(selectedDay, hours, val, ampm);
    };

    const handleAmpmChange = (newAmpm: string) => {
        setAmpm(newAmpm);
        triggerSelect(selectedDay, hours, minutes, newAmpm);
    };

    const triggerSelect = (day: number, hh: string, mm: string, ampmVal: string) => {
        if (onDateTimeSelect) {
            const formattedDate = new Date(currentYear, currentMonth, day);
            onDateTimeSelect({
                date: formattedDate,
                time: `${hh.padStart(2, '0')}:${mm.padStart(2, '0')} ${ampmVal}`
            });
        }
    };

    // Render calendar grid days
    const renderDays = () => {
        const days = [];
        // Blank cells for alignment
        for (let i = 0; i < firstDayIndex; i++) {
            days.push(<div key={`empty-${i}`} className="w-9 h-9" />);
        }
        // Month days
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = day === selectedDay;
            days.push(
                <button
                    key={`day-${day}`}
                    onClick={() => handleSelectDay(day)}
                    className={`w-9 h-9 text-[15px] font-medium rounded-full flex items-center justify-center transition-all focus:outline-none relative ${
                        isSelected 
                            ? 'bg-[#FF3B30] text-white font-semibold shadow-md scale-105 z-10' 
                            : 'text-[#FF3B30] hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />
            
            {/* Modal Card wrapper */}
            <div className="pointer-events-auto relative w-[310px] bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 rounded-[24px] shadow-2xl overflow-hidden p-[18px] transition-colors duration-300 animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    {/* Month/Year selector dropdown button */}
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-1 text-[17px] font-semibold text-[#FF3B30] hover:opacity-75 transition-opacity focus:outline-none"
                    >
                        <span>{MONTH_NAMES[currentMonth]} {currentYear}</span>
                        <div className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : 'rotate-0'}`}>
                            <DropdownArrowIcon />
                        </div>
                    </button>

                    {/* Month Navigations & Theme Toggle */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} className="p-1.5 rounded-full text-[#FF3B30] hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none mr-2">
                            {isDark ? <SunIcon /> : <MoonIcon />}
                        </button>
                        
                        {/* Navigation Chevron buttons */}
                        <button onClick={prevMonth} className="p-1.5 text-[#FF3B30] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors focus:outline-none">
                            <ChevronLeftIcon />
                        </button>
                        <button onClick={nextMonth} className="p-1.5 text-[#FF3B30] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors focus:outline-none">
                            <ChevronRightIcon />
                        </button>
                    </div>
                </div>

                {/* Weekdays indicator headers */}
                <div className="grid grid-cols-7 gap-y-1 mb-2 text-center">
                    {WEEKDAYS.map((day) => (
                        <div key={day} className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid & Dropdown Container */}
                <div className="relative h-[216px] mb-4">
                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-y-1 justify-items-center absolute w-full z-10">
                        {renderDays()}
                    </div>

                    {/* Month/Year Selection Dropdown Overlay */}
                    {showDropdown && (
                        <div className="absolute inset-0 z-30 flex flex-col p-3 rounded-[18px] bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-md transition-all duration-200">
                            {/* Year Selector Header */}
                            <div className="flex items-center justify-between mb-3 border-b pb-2 border-black/5 dark:border-white/5">
                                <button onClick={() => setCurrentYear(y => y - 1)} className="p-1.5 text-[#FF3B30] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                                    <ChevronLeftIcon />
                                </button>
                                <span className="font-bold text-[16px] text-black dark:text-white">{currentYear}</span>
                                <button onClick={() => setCurrentYear(y => y + 1)} className="p-1.5 text-[#FF3B30] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                                    <ChevronRightIcon />
                                </button>
                            </div>

                            {/* Month Selection Grid */}
                            <div className="grid grid-cols-3 gap-1.5 flex-1 overflow-y-auto">
                                {MONTH_NAMES.map((m, idx) => {
                                    const isSelected = idx === currentMonth;
                                    return (
                                        <button
                                            key={m}
                                            onClick={() => {
                                                setCurrentMonth(idx);
                                                setShowDropdown(false);
                                            }}
                                            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                isSelected
                                                    ? 'bg-[#FF3B30] text-white shadow-sm'
                                                    : 'text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10'
                                            }`}
                                        >
                                            {m.slice(0, 3)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Time Settings Row */}
                <div className="border-t border-gray-100 dark:border-white/5 pt-4 flex items-center justify-between">
                    <span className="text-[17px] font-semibold text-black dark:text-white">Time</span>
                    
                    <div className="flex items-center gap-2">
                        {/* Time Inputs Wrapper */}
                        <div className="flex items-center bg-[#E3E3E8] dark:bg-[#2C2C2E] px-2 py-1 rounded-[8px] text-[17px] font-medium text-black dark:text-white transition-colors duration-300">
                            <input
                                type="text"
                                value={hours}
                                onChange={handleHourChange}
                                placeholder="00"
                                className="w-6 bg-transparent text-center focus:outline-none font-semibold"
                            />
                            <span className="opacity-70">:</span>
                            <input
                                type="text"
                                value={minutes}
                                onChange={handleMinuteChange}
                                placeholder="00"
                                className="w-6 bg-transparent text-center focus:outline-none font-semibold"
                            />
                        </div>

                        {/* AM/PM Segmented Control */}
                        <div className="flex bg-[#E3E3E8] dark:bg-[#2C2C2E] p-[2px] rounded-[8px] text-[13px] font-semibold text-black dark:text-white transition-colors duration-300">
                            <button
                                onClick={() => handleAmpmChange("AM")}
                                className={`px-2.5 py-1 rounded-[6px] transition-all focus:outline-none ${
                                    ampm === "AM" 
                                        ? 'bg-white dark:bg-[#505054] shadow-sm text-black dark:text-white' 
                                        : 'opacity-60 hover:opacity-100'
                                }`}
                            >
                                AM
                            </button>
                            <button
                                onClick={() => handleAmpmChange("PM")}
                                className={`px-2.5 py-1 rounded-[6px] transition-all focus:outline-none ${
                                    ampm === "PM" 
                                        ? 'bg-white dark:bg-[#505054] shadow-sm text-black dark:text-white' 
                                        : 'opacity-60 hover:opacity-100'
                                }`}
                            >
                                PM
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
