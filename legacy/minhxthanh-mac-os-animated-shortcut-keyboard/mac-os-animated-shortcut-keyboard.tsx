import React, { useState, useEffect } from 'react';

const BrightnessLowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M12 5l0 .01"></path><path d="M17 7l0 .01"></path><path d="M19 12l0 .01"></path><path d="M17 17l0 .01"></path><path d="M12 19l0 .01"></path><path d="M7 17l0 .01"></path><path d="M5 12l0 .01"></path><path d="M7 7l0 .01"></path>
    </svg>
);

const BrightnessHighIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M12 5l0 -2"></path><path d="M17 7l1.4 -1.4"></path><path d="M19 12l2 0"></path><path d="M17 17l1.4 1.4"></path><path d="M12 19l0 2"></path><path d="M7 17l-1.4 1.4"></path><path d="M6 12l-2 0"></path><path d="M7 7l-1.4 -1.4"></path>
    </svg>
);

const MissionControlIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z"></path><path d="M3 10h18"></path><path d="M10 3v18"></path>
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path>
    </svg>
);

const MicrophoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z"></path><path d="M5 10a7 7 0 0 0 14 0"></path><path d="M8 21l8 0"></path><path d="M12 17l0 4"></path>
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"></path>
    </svg>
);

const RewindIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M21 5v14l-8 -7z"></path><path d="M10 5v14l-8 -7z"></path>
    </svg>
);

const PlayPauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M4 5v14l12 -7z"></path><path d="M20 5l0 14"></path>
    </svg>
);

const FastForwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M3 5v14l8 -7z"></path><path d="M14 5v14l8 -7z"></path>
    </svg>
);

const MuteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"></path><path d="M16 10l4 4m0 -4l-4 4"></path>
    </svg>
);

const VolumeDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M15 8a5 5 0 0 1 0 8"></path><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a .8 .8 0 0 1 -1.5 .5l-3.5 -4.5"></path>
    </svg>
);

const VolumeUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M15 8a5 5 0 0 1 0 8"></path><path d="M17.7 5a9 9 0 0 1 0 14"></path><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a .8 .8 0 0 1 1.5 .5v14a .8 .8 0 0 1 -1.5 .5l-3.5 -4.5"></path>
    </svg>
);

const PowerIcon = () => (
    <div className="h-4 w-4 rounded-full bg-gradient-to-b from-neutral-900 from-20% via-black via-50% to-neutral-900 to-95% p-px">
        <div className="h-full w-full rounded-full bg-black"></div>
    </div>
);

const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path><path d="M3.6 9h16.8"></path><path d="M3.6 15h16.8"></path><path d="M11.5 3a17 17 0 0 0 0 18"></path><path d="M12.5 3a17 17 0 0 1 0 18"></path>
    </svg>
);

const ControlIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]"><path d="M6 15l6 -6l6 6"></path></svg>
);

const OptionIcon = () => (
    <svg fill="none" version="1.1" id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-[6px] w-[6px]">
        <rect stroke="currentColor" strokeWidth="2" x="18" y="5" width="10" height="2"></rect><polygon stroke="currentColor" strokeWidth="2" points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25 "></polygon><rect id="_Transparent_Rectangle_" className="st0" width="32" height="32" stroke="none"></rect>
    </svg>
);

const CommandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M7 9a2 2 0 1 1 2 -2v10a2 2 0 1 1 -2 -2h10a2 2 0 1 1 -2 2v-10a2 2 0 1 1 2 2h-10"></path>
    </svg>
);

const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M11.293 7.293a1 1 0 0 1 1.32 -.083l.094 .083l6 6l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059l-.002 .059l-.005 .058l-.009 .06l-.01 .052l-.032 .108l-.027 .067l-.07 .132l-.065 .09l-.073 .081l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002h-12c-.852 0 -1.297 -.986 -.783 -1.623l.076 -.084l6 -6z" fill="currentColor" strokeWidth="0"></path>
    </svg>
);

const ArrowLeftIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M13.883 5.007l.058 -.005h.118l.058 .005l.06 .009l.052 .01l.108 .032l.067 .027l.132 .07l.09 .065l.081 .073l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059v12c0 .852 -.986 1.297 -1.623 .783l-.084 -.076l-6 -6a1 1 0 0 1 -.083 -1.32l.083 -.094l6 -6l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01z" fill="currentColor" strokeWidth="0"></path>
    </svg>
);

const ArrowDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l-.027 .067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z" fill="currentColor" strokeWidth="0"></path>
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[6px] w-[6px]">
        <path d="M9 6c0 -.852 .986 -1.297 1.623 -.783l.084 .076l6 6a1 1 0 0 1 .083 1.32l-.083 .094l-6 6l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002l-.059 -.002l-.058 -.005l-.06 -.009l-.052 -.01l-.108 -.032l-.067 -.027l-.132 -.07l-.09 -.065l-.081 -.073l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057l-.002 -12.059z" fill="currentColor" strokeWidth="0"></path>
    </svg>
);

//================================================================//
//  Key Component
//  A reusable component for rendering each keyboard key.
//================================================================//

const Key = ({ children, className = '', style = {}, isPressed = false, heightClass = 'h-6' }) => {
    // Shared style for the inset shadow effect on each key
    const keyInnerBoxShadow = { 
        boxShadow: 'rgb(13, 13, 15) 0px -0.5px 2px 0px inset, rgb(13, 13, 15) -0.5px 0px 2px 0px inset, 0px 0px 1px 0px rgba(255,255,255,0.1)' 
    };
    
    // Enhanced style for the glowing "pressed" keys with smoother breathing animation
    const pressedKeyStyle = isPressed ? {
        boxShadow: '0px 0px 4px 2px #3b82f6, 0 0 12px #3b82f6, 0 0 20px rgba(59, 130, 246, 0.4)',
        transform: 'translateY(-1px) scale(1.02)',
        animation: 'smoothBreathing 2.5s ease-in-out infinite',
        willChange: 'box-shadow, transform',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    } : {
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    return (
        <div 
            className="rounded-[4px] p-[0.5px] cursor-pointer bg-gradient-to-b from-zinc-600 to-zinc-800 shadow-md shadow-white/10 transition-all duration-200 ease-out hover:scale-[0.98] hover:shadow-none active:scale-[0.96]"
            style={{...style, ...pressedKeyStyle}}
        >
            <div 
                className={`flex ${heightClass} rounded-[3.5px] bg-gradient-to-b from-[#1A191D] to-[#0A090D] ${className}`}
                style={keyInnerBoxShadow}
            >
                <div className="flex w-full h-full flex-col items-center justify-center text-[5px] text-zinc-300 font-medium">
                    {children}
                </div>
            </div>
        </div>
    );
};

//================================================================//
//  Keyboard Component
//  Assembles all the keys into the final keyboard layout.
//================================================================//

const Keyboard = ({ pressedKeys }) => {
    const isKeyPressed = (keyId) => pressedKeys.includes(keyId);

    return (
        <div className="mx-auto h-fit w-fit rounded-xl bg-gradient-to-b from-zinc-800 to-black p-2 shadow-2xl shadow-blue-500/20 transition-all duration-500 ease-out" style={{ transform: 'scale(1.7) rotateX(12deg)', transformOrigin: 'top center' }}>
            {/* --- Row 1: Function Keys --- */}
            <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
                <Key className="w-10 items-end justify-start pb-[2px] pl-[4px]">
                   <span className="items-start">esc</span>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex flex-col items-center"><BrightnessLowIcon /><span className="mt-1">F1</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex flex-col items-center"><BrightnessHighIcon /><span className="mt-1">F2</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex flex-col items-center"><MissionControlIcon /><span className="mt-1">F3</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex flex-col items-center"><SearchIcon /><span className="mt-1">F4</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex flex-col items-center"><MicrophoneIcon /><span className="mt-1">F5</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex flex-col items-center"><MoonIcon /><span className="mt-1">F6</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex flex-col items-center"><RewindIcon /><span className="mt-1">F7</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex flex-col items-center"><PlayPauseIcon /><span className="mt-1">F8</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex flex-col items-center"><FastForwardIcon /><span className="mt-1">F9</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex flex-col items-center"><MuteIcon /><span className="mt-1">F10</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex flex-col items-center"><VolumeDownIcon /><span className="mt-1">F11</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex flex-col items-center"><VolumeUpIcon /><span className="mt-1">F12</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <PowerIcon />
                </Key>
            </div>

            {/* --- Row 2: Number Keys --- */}
            <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
                {['~`', '!1', '@2', '#3', '$4', '%5', '^6', '&7', '*8', '(9', ')0', '_-', '+=']
                    .map(k => (
                        <Key key={k} className="w-6 items-center justify-center">
                            <div className="text-center"><span className="block">{k[0]}</span><span className="block">{k.substring(1)}</span></div>
                        </Key>
                    ))
                }
                <Key className="w-10">
                    <div className="flex w-full h-full items-end justify-end pr-[4px] pb-[2px]">
                        <span>delete</span>
                    </div>
                </Key>
            </div>

            {/* --- Row 3: QWERTY Keys --- */}
            <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
                <Key className="w-10">
                     <div className="flex w-full h-full items-end justify-start pb-[2px] pl-[4px]">
                        <span>tab</span>
                    </div>
                </Key>
                {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(k => (
                    <Key key={k} className="w-6 items-center justify-center"><span className="text-[8px]">{k}</span></Key>
                ))}
                <Key className="w-6 items-center justify-center">
                    <div className="text-center"><span className="block">{'{'}</span><span className="block">{'['}</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="text-center"><span className="block">{'}'}</span><span className="block">{']'}</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="text-center"><span className="block">|</span><span className="block">\</span></div>
                </Key>
            </div>
            
            {/* --- Row 4: Home Row --- */}
            <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
                <Key className="w-[2.8rem]">
                    <div className="flex w-full h-full items-end justify-start pb-[2px] pl-[4px]">
                        <span>caps lock</span>
                    </div>
                </Key>
                {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(k => (
                    <Key key={k} className="w-6 items-center justify-center"><span className="text-[8px]">{k}</span></Key>
                ))}
                 <Key className="w-6 items-center justify-center">
                    <div className="text-center"><span className="block">:</span><span className="block">;</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="text-center"><span className="block">"</span><span className="block">'</span></div>
                </Key>
                <Key className="w-[2.85rem]">
                    <div className="flex w-full h-full items-end justify-end pr-[4px] pb-[2px]">
                        <span>enter</span>
                    </div>
                </Key>
            </div>

            {/* --- Row 5: Bottom Letter Row --- */}
            <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
                 <Key className="w-[3.65rem]">
                    <div className="flex w-full h-full items-end justify-start pb-[2px] pl-[4px]">
                        <span>shift</span>
                    </div>
                </Key>
                {['Z', 'X'].map(k => (
                    <Key key={k} className="w-6 items-center justify-center"><span className="text-[8px]">{k}</span></Key>
                ))}
                <Key className="w-6 items-center justify-center" isPressed={isKeyPressed('C')}>
                    <span className="text-[8px]">C</span>
                </Key>
                <Key className="w-6 items-center justify-center" isPressed={isKeyPressed('V')}>
                    <span className="text-[8px]">V</span>
                </Key>
                {['B', 'N', 'M'].map(k => (
                    <Key key={k} className="w-6 items-center justify-center"><span className="text-[8px]">{k}</span></Key>
                ))}
                <Key className="w-6 items-center justify-center">
                    <div className="text-center"><span className="block">&lt;</span><span className="block">,</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="text-center"><span className="block">&gt;</span><span className="block">.</span></div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="text-center"><span className="block">?</span><span className="block">/</span></div>
                </Key>
                <Key className="w-[3.65rem]">
                    <div className="flex w-full h-full items-end justify-end pr-[4px] pb-[2px]">
                        <span>shift</span>
                    </div>
                </Key>
            </div>
            
             {/* --- Row 6: Control Row --- */}
            <div className="flex w-full shrink-0 items-end gap-[2px]">
                <Key className="w-6 items-center justify-center">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-y-[2px] py-1">
                        <div className="w-full flex justify-end pr-1">
                            <span>fn</span>
                        </div>
                        <div className="w-full flex justify-start pl-1">
                            <GlobeIcon />
                        </div>
                    </div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-y-[2px] py-1">
                        <div className="w-full flex justify-end pr-1">
                            <ControlIcon />
                        </div>
                        <span>control</span>
                    </div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-y-[2px] py-1">
                        <div className="w-full flex justify-end pr-1">
                           <OptionIcon />
                        </div>
                        <span>option</span>
                    </div>
                </Key>
                <Key className="w-8 items-center justify-center" isPressed={isKeyPressed('CMD_LEFT')}>
                    <div className="flex h-full w-full flex-col items-center justify-center gap-y-[2px] py-1">
                        <div className="w-full flex justify-end pr-1">
                            <CommandIcon />
                        </div>
                        <span>command</span>
                    </div>
                </Key>
                
                <Key className="w-[8.2rem] items-center justify-center" />

                <Key className="w-8 items-center justify-center" isPressed={isKeyPressed('CMD_RIGHT')}>
                    <div className="flex h-full w-full flex-col items-center justify-center gap-y-[2px] py-1">
                        <div className="w-full flex justify-start pl-1">
                            <CommandIcon />
                        </div>
                        <span>command</span>
                    </div>
                </Key>
                <Key className="w-6 items-center justify-center">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-y-[2px] py-1">
                        <div className="w-full flex justify-start pl-1">
                            <OptionIcon />
                        </div>
                        <span>option</span>
                    </div>
                </Key>

                <div className="flex items-end gap-[2px]">
                    <Key className="w-6 items-center justify-center" heightClass="h-3">
                        <ArrowLeftIcon />
                    </Key>
                    <div className="flex flex-col gap-[2px]">
                        <Key className="w-6 items-center justify-center" heightClass="h-3">
                            <ArrowUpIcon />
                        </Key>
                        <Key className="w-6 items-center justify-center" heightClass="h-3">
                            <ArrowDownIcon />
                        </Key>
                    </div>
                    <Key className="w-6 items-center justify-center" heightClass="h-3">
                        <ArrowRightIcon />
                    </Key>
                </div>
            </div>
        </div>
    )
}


export default function MacOSKeyboard() {
    const [pressedKeys, setPressedKeys] = useState([]);
    const [currentState, setCurrentState] = useState('INITIAL');
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    useEffect(() => {
        let timeoutId;
        let intervalId;

        const startSequence = () => {
            // Phase 1: CMD key only for 300ms (preparing for copy)
            console.log('Phase 1: CMD-only phase for copy');
            setCurrentState('CMD_ONLY_FOR_C');
            setPressedKeys(['CMD_LEFT']);
            setTimeRemaining(300);
            setTotalDuration(300);

            intervalId = setInterval(() => {
                setTimeRemaining(prev => Math.max(0, prev - 10));
            }, 10);

            timeoutId = setTimeout(() => {
                clearInterval(intervalId);
                
                // Phase 2: CMD + C for 4.7 seconds
                console.log('Phase 2: CMD+C phase');
                setCurrentState('CMD_C');
                setPressedKeys(['CMD_LEFT', 'C']);
                setTimeRemaining(4700);
                setTotalDuration(4700);

                intervalId = setInterval(() => {
                    setTimeRemaining(prev => Math.max(0, prev - 100));
                }, 100);

                timeoutId = setTimeout(() => {
                    clearInterval(intervalId);
                    
                    // Phase 3: CMD only for 300ms (releasing C)
                    console.log('Phase 3: CMD-only phase (releasing C)');
                    setCurrentState('CMD_ONLY_AFTER_C');
                    setPressedKeys(['CMD_LEFT']);
                    setTimeRemaining(300);
                    setTotalDuration(300);

                    intervalId = setInterval(() => {
                        setTimeRemaining(prev => Math.max(0, prev - 10));
                    }, 10);

                    timeoutId = setTimeout(() => {
                        clearInterval(intervalId);
                        
                        // Phase 4: No keys pressed for remaining 2.7 seconds
                        console.log('Phase 4: Pause phase after CMD+C');
                        setCurrentState('PAUSE_AFTER_C');
                        setPressedKeys([]);
                        setTimeRemaining(2700);
                        setTotalDuration(2700);

                        intervalId = setInterval(() => {
                            setTimeRemaining(prev => Math.max(0, prev - 100));
                        }, 100);

                        timeoutId = setTimeout(() => {
                            clearInterval(intervalId);
                            
                            // Phase 5: CMD key only for 300ms (preparing for paste)
                            console.log('Phase 5: CMD-only phase for paste');
                            setCurrentState('CMD_ONLY_FOR_V');
                            setPressedKeys(['CMD_LEFT']);
                            setTimeRemaining(300);
                            setTotalDuration(300);

                            intervalId = setInterval(() => {
                                setTimeRemaining(prev => Math.max(0, prev - 10));
                            }, 10);

                            timeoutId = setTimeout(() => {
                                clearInterval(intervalId);
                                
                                // Phase 6: CMD + V for 4.7 seconds
                                console.log('Phase 6: CMD+V phase');
                                setCurrentState('CMD_V');
                                setPressedKeys(['CMD_LEFT', 'V']);
                                setTimeRemaining(4700);
                                setTotalDuration(4700);

                                intervalId = setInterval(() => {
                                    setTimeRemaining(prev => Math.max(0, prev - 100));
                                }, 100);

                                timeoutId = setTimeout(() => {
                                    clearInterval(intervalId);
                                    
                                    // Phase 7: CMD only for 300ms (releasing V)
                                    console.log('Phase 7: CMD-only phase (releasing V)');
                                    setCurrentState('CMD_ONLY_AFTER_V');
                                    setPressedKeys(['CMD_LEFT']);
                                    setTimeRemaining(300);
                                    setTotalDuration(300);

                                    intervalId = setInterval(() => {
                                        setTimeRemaining(prev => Math.max(0, prev - 10));
                                    }, 10);

                                    timeoutId = setTimeout(() => {
                                        clearInterval(intervalId);
                                        
                                        // Phase 8: No keys pressed for remaining 2.7 seconds
                                        console.log('Phase 8: Pause phase after CMD+V');
                                        setCurrentState('PAUSE_AFTER_V');
                                        setPressedKeys([]);
                                        setTimeRemaining(2700);
                                        setTotalDuration(2700);

                                        intervalId = setInterval(() => {
                                            setTimeRemaining(prev => Math.max(0, prev - 100));
                                        }, 100);

                                        timeoutId = setTimeout(() => {
                                            clearInterval(intervalId);
                                            // Restart the sequence
                                            console.log('Restarting sequence');
                                            setTimeRemaining(0);
                                            setTimeout(startSequence, 500);
                                        }, 2700);
                                    }, 300);
                                }, 4700);
                            }, 300);
                        }, 2700);
                    }, 300);
                }, 4700);
            }, 300);
        };

        // Start the sequence after a brief initial delay
        timeoutId = setTimeout(startSequence, 1000);

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, []);

    return (
        <>
            <style>{`
                @keyframes smoothBreathing {
                    0%, 100% {
                        box-shadow: 0 0 4px 2px #3b82f6, 0 0 12px #3b82f6, 0 0 20px rgba(59, 130, 246, 0.3);
                        transform: translateY(-1px) scale(1.02);
                    }
                    50% {
                        box-shadow: 0 0 8px 3px #3b82f6, 0 0 24px #3b82f6, 0 0 36px rgba(59, 130, 246, 0.6);
                        transform: translateY(-2px) scale(1.03);
                    }
                }
                
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black min-h-screen w-full p-10 perspective-1000 relative transition-all duration-1000">
                {/* Title */}
                <div className="mb-16 animate-fade-in-up">
                    <h1 className="text-5xl font-light text-white text-center tracking-wide">
                        As simple as{' '}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent font-extrabold">
                            copy and paste
                        </span>
                    </h1>
                </div>
                <Keyboard pressedKeys={pressedKeys} />
            </div>
        </>
    );
}