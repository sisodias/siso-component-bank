import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

// --- HELPER FUNCTIONS ---
const MAX_MINUTES = 24 * 60; // 1440

function parseTimeToMinutes(timeStr: string): number {
  const parts = timeStr.split(':');
  let h = parseInt(parts[0]) || 0;
  let m = parseInt(parts[1]) || 0;
  if (h > 23) h = 23;
  if (m > 59) m = 59;
  return h * 60 + m;
}

function formatMinutesToTime(totalMins: number): string {
  let m = Math.floor(totalMins);
  while (m < 0) m += MAX_MINUTES;
  m = m % MAX_MINUTES;

  const hours = Math.floor(m / 60).toString().padStart(2, '0');
  const minutes = (m % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatTo12Hour(timeStr: string): string {
  if (!timeStr || timeStr.length < 5) return '--:--';
  const parts = timeStr.split(':');
  let h = parseInt(parts[0], 10);
  const m = parts[1];

  if (isNaN(h) || !m) return '--:--';

  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; 
  
  const formattedHour = h.toString().padStart(2, '0');
  return `${formattedHour}:${m} ${ampm}`;
}

// --- TIME SCRUBBER COMPONENT ---
export function TimeScrubber({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  
  const [time, setTime] = useState('21:29');
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [lockedAxis, setLockedAxis] = useState<'x' | 'y' | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const fakeCursorRef = useRef<HTMLDivElement>(null);

  const dragRef = useRef({
    isMouseDown: false, isScrubbing: false, startX: 0, startY: 0, cursorX: 0, cursorY: 0,
    clickedStep: 0, lockedAxis: null as 'x' | 'y' | null, initialValue: '', virtualValue: 0
  });

  const DRAG_THRESHOLD = 5;
  const BASE_SENSITIVITY = 0.2;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const state = dragRef.current;
      if (!state.isMouseDown) return;

      if (!state.isScrubbing) {
        const dx = Math.abs(e.clientX - state.startX);
        const dy = Math.abs(e.clientY - state.startY);
        
        if (dx + dy > DRAG_THRESHOLD) {
          state.lockedAxis = dx > dy ? 'x' : 'y';
          state.isScrubbing = true;
          
          state.cursorX = state.lockedAxis === 'x' ? e.clientX : state.startX;
          state.cursorY = state.lockedAxis === 'y' ? e.clientY : state.startY;

          if (fakeCursorRef.current) {
            fakeCursorRef.current.style.left = `${state.cursorX}px`;
            fakeCursorRef.current.style.top = `${state.cursorY}px`;
          }
          
          setLockedAxis(state.lockedAxis);
          setIsScrubbing(true);

          try {
            const lockPromise = handleRef.current?.requestPointerLock();
            if (lockPromise !== undefined) lockPromise.catch(() => {});
          } catch (err) {}
        }
        return; 
      }

      if (state.isScrubbing) {
        let delta = 0;
        let currentSensitivity = BASE_SENSITIVITY;
        if (e.shiftKey) currentSensitivity *= 5; 
        if (e.altKey) currentSensitivity *= 0.2; 

        if (state.lockedAxis === 'x') {
          state.cursorX += e.movementX;
          if (state.cursorX > window.innerWidth) state.cursorX = 0;
          if (state.cursorX < 0) state.cursorX = window.innerWidth;
          delta = e.movementX * currentSensitivity;
        } else {
          state.cursorY += e.movementY;
          if (state.cursorY > window.innerHeight) state.cursorY = 0;
          if (state.cursorY < 0) state.cursorY = window.innerHeight;
          delta = -e.movementY * currentSensitivity; 
        }
        
        if (fakeCursorRef.current) {
          fakeCursorRef.current.style.left = `${state.cursorX}px`;
          fakeCursorRef.current.style.top = `${state.cursorY}px`;
        }
        
        let vValue = state.virtualValue + delta;
        while (vValue >= MAX_MINUTES) vValue -= MAX_MINUTES;
        while (vValue < 0) vValue += MAX_MINUTES;
        
        state.virtualValue = vValue;
        setTime(formatMinutesToTime(vValue));
      }
    };

    const handleMouseUp = () => {
      const state = dragRef.current;
      if (state.isMouseDown) {
        if (state.isScrubbing) {
          try { document.exitPointerLock(); } catch (err) {}
        } else {
          setTime(formatMinutesToTime(parseTimeToMinutes(state.initialValue) + state.clickedStep));
        }
        
        state.isMouseDown = false;
        state.isScrubbing = false;
        state.lockedAxis = null;
        setIsScrubbing(false);
        setLockedAxis(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const state = dragRef.current;
      if (e.key === 'Escape' && state.isMouseDown) {
        setTime(state.initialValue);
        try { document.exitPointerLock(); } catch (err) {}
        state.isMouseDown = false;
        state.isScrubbing = false;
        state.lockedAxis = null;
        setIsScrubbing(false);
        setLockedAxis(null);
      }
    };

    const handlePointerLockChange = () => {
      const state = dragRef.current;
      if (!document.pointerLockElement && state.isScrubbing) {
        setTime(state.initialValue);
        state.isScrubbing = false;
        state.isMouseDown = false;
        state.lockedAxis = null;
        setIsScrubbing(false);
        setLockedAxis(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  const onHandleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; 
    const state = dragRef.current;
    state.isMouseDown = true;
    state.initialValue = time;
    state.virtualValue = parseTimeToMinutes(time);
    state.startX = e.clientX;
    state.startY = e.clientY;
    state.clickedStep = (e.clientY - e.currentTarget.getBoundingClientRect().top) < e.currentTarget.getBoundingClientRect().height / 2 ? 1 : -1;
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, '').substring(0, 4);
    let hours = digits.substring(0, 2);
    let minutes = digits.substring(2, 4);

    if (hours.length === 2 && parseInt(hours, 10) > 23) hours = '23';
    if (minutes.length === 2 && parseInt(minutes, 10) > 59) minutes = '59';
    else if (minutes.length === 1 && parseInt(minutes, 10) > 5) minutes = '5'; 

    setTime(digits.length > 2 ? `${hours}:${minutes}` : hours);
  };

  const onInputBlur = () => {
    let digits = time.replace(/\D/g, '');
    if (digits.length === 0) return setTime("00:00");

    if (digits.length === 1) digits = `0${digits}00`;
    else if (digits.length === 2) digits = `${digits}00`;
    else if (digits.length === 3) digits = `${digits}0`;

    let h = Math.min(parseInt(digits.substring(0, 2), 10), 23);
    let m = Math.min(parseInt(digits.substring(2, 4), 10), 59);
    
    setTime(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  };

  const containerClasses = isDark 
    ? `bg-zinc-900 border-zinc-700 ${isScrubbing ? 'bg-zinc-800 border-zinc-600' : 'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'}`
    : `bg-white border-zinc-300 ${isScrubbing ? 'bg-zinc-100 border-zinc-400' : 'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'}`;

  return (
    <div className={cn("flex flex-col items-center w-64")}>
      <div ref={fakeCursorRef} style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999, display: isScrubbing ? 'block' : 'none', transform: 'translate(-50%, -50%)', width: '24px', height: '24px', color: 'white', mixBlendMode: 'difference' }}>
        {lockedAxis === 'x' && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 8 22 12 18 16"></polyline><polyline points="6 8 2 12 6 16"></polyline><line x1="2" y1="12" x2="22" y2="12"></line></svg>}
        {lockedAxis === 'y' && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 18 12 22 16 18"></polyline><polyline points="8 6 12 2 16 6"></polyline><line x1="12" y1="2" x2="12" y2="22"></line></svg>}
      </div>

      <div className={cn("flex items-stretch rounded-md overflow-hidden border transition-colors w-full h-14 shadow-inner", containerClasses)}>
        <input ref={inputRef} type="text" className={cn("flex-1 bg-transparent px-4 text-2xl outline-none font-mono text-center tracking-widest min-w-0", isDark ? 'text-white' : 'text-zinc-900')} value={time} onChange={onInputChange} onBlur={onInputBlur} maxLength={5} />
        
        <div ref={handleRef} onMouseDown={onHandleMouseDown} className="shrink-0 flex flex-col items-center justify-center w-12 cursor-pointer select-none">
          <div className={cn("flex-1 flex items-center justify-center w-full transition-colors", isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900')}>
            <svg className="w-4 h-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><polygon points="12 8 6 16 18 16"></polygon></svg>
          </div>
          <div className={cn("flex-1 flex items-center justify-center w-full transition-colors", isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900')}>
            <svg className="w-4 h-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><polygon points="12 16 6 8 18 8"></polygon></svg>
          </div>
        </div>
      </div>
      <div className={cn("mt-3 text-sm font-medium tracking-wide", isDark ? 'text-zinc-400' : 'text-zinc-500')}>{formatTo12Hour(time)}</div>
    </div>
  );
}

// --- NUMBER SCRUBBER COMPONENT ---
export function NumberScrubber({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  const [value, setValue] = useState('100');
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [lockedAxis, setLockedAxis] = useState<'x' | 'y' | null>(null);

  const handleRef = useRef<HTMLDivElement>(null);
  const fakeCursorRef = useRef<HTMLDivElement>(null);

  const dragRef = useRef({
    isMouseDown: false, isScrubbing: false, startX: 0, startY: 0, cursorX: 0, cursorY: 0,
    clickedStep: 0, lockedAxis: null as 'x' | 'y' | null, initialValue: '', virtualValue: 0
  });

  const DRAG_THRESHOLD = 5;
  const BASE_SENSITIVITY = 0.5;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const state = dragRef.current;
      if (!state.isMouseDown) return;

      if (!state.isScrubbing) {
        const dx = Math.abs(e.clientX - state.startX);
        const dy = Math.abs(e.clientY - state.startY);
        
        if (dx + dy > DRAG_THRESHOLD) {
          state.lockedAxis = dx > dy ? 'x' : 'y';
          state.isScrubbing = true;
          state.cursorX = state.lockedAxis === 'x' ? e.clientX : state.startX;
          state.cursorY = state.lockedAxis === 'y' ? e.clientY : state.startY;

          if (fakeCursorRef.current) {
            fakeCursorRef.current.style.left = `${state.cursorX}px`;
            fakeCursorRef.current.style.top = `${state.cursorY}px`;
          }
          
          setLockedAxis(state.lockedAxis);
          setIsScrubbing(true);

          try {
            const lockPromise = handleRef.current?.requestPointerLock();
            if (lockPromise !== undefined) lockPromise.catch(() => {});
          } catch (err) {}
        }
        return; 
      }

      if (state.isScrubbing) {
        let delta = 0;
        let currentSensitivity = BASE_SENSITIVITY;
        if (e.shiftKey) currentSensitivity *= 5; 
        if (e.altKey) currentSensitivity *= 0.1; 

        if (state.lockedAxis === 'x') {
          state.cursorX += e.movementX;
          if (state.cursorX > window.innerWidth) state.cursorX = 0;
          if (state.cursorX < 0) state.cursorX = window.innerWidth;
          delta = e.movementX * currentSensitivity;
        } else {
          state.cursorY += e.movementY;
          if (state.cursorY > window.innerHeight) state.cursorY = 0;
          if (state.cursorY < 0) state.cursorY = window.innerHeight;
          delta = -e.movementY * currentSensitivity; 
        }
        
        if (fakeCursorRef.current) {
          fakeCursorRef.current.style.left = `${state.cursorX}px`;
          fakeCursorRef.current.style.top = `${state.cursorY}px`;
        }
        
        state.virtualValue += delta;
        setValue(Math.round(state.virtualValue).toString());
      }
    };

    const handleMouseUp = () => {
      const state = dragRef.current;
      if (state.isMouseDown) {
        if (state.isScrubbing) {
          try { document.exitPointerLock(); } catch (err) {}
        } else {
          setValue((parseInt(state.initialValue || '0', 10) + state.clickedStep).toString());
        }
        
        state.isMouseDown = false;
        state.isScrubbing = false;
        state.lockedAxis = null;
        setIsScrubbing(false);
        setLockedAxis(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const state = dragRef.current;
      if (e.key === 'Escape' && state.isMouseDown) {
        setValue(state.initialValue);
        try { document.exitPointerLock(); } catch (err) {}
        state.isMouseDown = false;
        state.isScrubbing = false;
        state.lockedAxis = null;
        setIsScrubbing(false);
        setLockedAxis(null);
      }
    };

    const handlePointerLockChange = () => {
      const state = dragRef.current;
      if (!document.pointerLockElement && state.isScrubbing) {
        setValue(state.initialValue);
        state.isScrubbing = false;
        state.isMouseDown = false;
        state.lockedAxis = null;
        setIsScrubbing(false);
        setLockedAxis(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  const onHandleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; 
    const state = dragRef.current;
    state.isMouseDown = true;
    state.initialValue = value;
    state.virtualValue = parseInt(value, 10) || 0;
    state.startX = e.clientX;
    state.startY = e.clientY;
    state.clickedStep = (e.clientY - e.currentTarget.getBoundingClientRect().top) < e.currentTarget.getBoundingClientRect().height / 2 ? 1 : -1;
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/(?!^)-/g, '').replace(/[^\d-]/g, '');
    setValue(val);
  };

  const onInputBlur = () => {
    if (value === '' || value === '-') {
      setValue('0');
    } else {
      setValue(parseInt(value, 10).toString());
    }
  };

  const containerClasses = isDark 
    ? `bg-zinc-900 border-zinc-700 ${isScrubbing ? 'bg-zinc-800 border-zinc-600' : 'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'}`
    : `bg-white border-zinc-300 ${isScrubbing ? 'bg-zinc-100 border-zinc-400' : 'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'}`;

  return (
    <div className={cn("flex flex-col items-center w-64")}>
      <div ref={fakeCursorRef} style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999, display: isScrubbing ? 'block' : 'none', transform: 'translate(-50%, -50%)', width: '24px', height: '24px', color: 'white', mixBlendMode: 'difference' }}>
        {lockedAxis === 'x' && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 8 22 12 18 16"></polyline><polyline points="6 8 2 12 6 16"></polyline><line x1="2" y1="12" x2="22" y2="12"></line></svg>}
        {lockedAxis === 'y' && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 18 12 22 16 18"></polyline><polyline points="8 6 12 2 16 6"></polyline><line x1="12" y1="2" x2="12" y2="22"></line></svg>}
      </div>

      <div className={cn("flex items-stretch rounded-md overflow-hidden border transition-colors w-full h-14 shadow-inner", containerClasses)}>
        <input type="text" className={cn("flex-1 bg-transparent px-4 text-2xl outline-none font-mono text-center tracking-widest min-w-0", isDark ? 'text-white' : 'text-zinc-900')} value={value} onChange={onInputChange} onBlur={onInputBlur} />
        
        <div ref={handleRef} onMouseDown={onHandleMouseDown} className="shrink-0 flex flex-col items-center justify-center w-12 cursor-pointer select-none">
          <div className={cn("flex-1 flex items-center justify-center w-full transition-colors", isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900')}>
            <svg className="w-4 h-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><polygon points="12 8 6 16 18 16"></polygon></svg>
          </div>
          <div className={cn("flex-1 flex items-center justify-center w-full transition-colors", isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900')}>
            <svg className="w-4 h-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><polygon points="12 16 6 8 18 8"></polygon></svg>
          </div>
        </div>
      </div>
    </div>
  );
}