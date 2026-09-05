import React, { useState, useEffect, useRef } from 'react';

// --- Helper component for the draggable windows ---
const DraggableWindow = ({ id, title, children, initialPosition, zIndex, onMouseDown }) => {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const windowRef = useRef(null);

    const handleMouseDown = (e) => {
        onMouseDown(id); // Bring this window to the front
        setIsDragging(true);

        const rect = windowRef.current.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        // Prevent text selection while dragging
        e.preventDefault();
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y,
            });
        }
    };
    
    // Add and remove global event listeners for dragging
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);


    return (
        <div
            ref={windowRef}
            className="draggable-window w-80 md:w-96 rounded-md overflow-hidden"
            style={{ top: `${position.y}px`, left: `${position.x}px`, zIndex }}
        >
            <div className="window-header" onMouseDown={handleMouseDown}>
                // {title}
            </div>
            <div className="window-content h-full">
                {children}
            </div>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
    const [time, setTime] = useState(new Date());
    const [windows, setWindows] = useState([
        { id: 1, title: 'STATUS', zIndex: 1, pos: { x: window.innerWidth * 0.1, y: 150 } },
        { id: 2, title: 'MEMORY_LOG', zIndex: 2, pos: { x: window.innerWidth * 0.65, y: 180 } },
        { id: 3, title: 'DATA_STREAM', zIndex: 3, pos: { x: window.innerWidth * 0.4, y: 400 } },
    ]);
    const maxZIndex = useRef(3);

    // Clock update effect
    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    // Terminal text typing effect
    const [terminalText, setTerminalText] = useState('');
    const fullTerminalText = "Initializing connection... SYN packet sent... ACK received... Secure channel established. Awaiting user input... Ghost protocol v7.3 active.";
    
    useEffect(() => {
        if (terminalText.length < fullTerminalText.length) {
            const timeoutId = setTimeout(() => {
                setTerminalText(fullTerminalText.substring(0, terminalText.length + 1));
            }, 50 + Math.random() * 50);
            return () => clearTimeout(timeoutId);
        }
    }, [terminalText]);

    // Handle bringing windows to the front
    const bringToFront = (id) => {
        const window = windows.find(w => w.id === id);
        if (window.zIndex < maxZIndex.current) {
            maxZIndex.current += 1;
            setWindows(windows.map(w => w.id === id ? { ...w, zIndex: maxZIndex.current } : w));
        }
    };


    return (
        <>
            {/* We inject the CSS directly into the component for a single-file solution */}
            <style>{`
                :root {
                    --neon-cyan: #00ffff;
                    --neon-magenta: #ff00ff;
                    --glitch-bg: #0d0d1a;
                    --glitch-text: #e0e0e0;
                }
                body {
                    font-family: 'Share Tech Mono', monospace;
                    background-color: var(--glitch-bg);
                    color: var(--glitch-text);
                    overflow: hidden;
                    cursor: crosshair;
                }
                body::after {
                    content: " ";
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                    z-index: 9999;
                    background-size: 100% 3px, 4px 100%;
                    pointer-events: none;
                    animation: flicker 0.15s infinite;
                }
                .glitch { animation: glitch 1.5s linear infinite; }
                .glitch-2 { animation: glitch-2 2s linear infinite reverse; }
                
                @keyframes glitch {
                    2%, 64% { transform: translate(2px, 0) skew(0deg); }
                    4%, 60% { transform: translate(-2px, 0) skew(0deg); }
                    62% { transform: translate(0, 0) skew(5deg); }
                }

                .glitch::before,
                .glitch::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--glitch-bg);
                    overflow: hidden;
                }
                .glitch::before {
                    left: 2px;
                    text-shadow: -2px 0 var(--neon-magenta);
                    animation: glitch-anim-1 2s linear infinite reverse;
                }
                .glitch::after {
                    left: -2px;
                    text-shadow: -2px 0 var(--neon-cyan), 2px 2px var(--neon-magenta);
                    animation: glitch-anim-2 2s linear infinite reverse;
                }

                @keyframes glitch-anim-1 { 0%, 100% { clip-path: inset(45% 0 56% 0); } 5% { clip-path: inset(55% 0 10% 0); } 10% { clip-path: inset(80% 0 5% 0); } 15% { clip-path: inset(13% 0 60% 0); } 20% { clip-path: inset(0 0 100% 0); } 25% { clip-path: inset(40% 0 33% 0); } 30% { clip-path: inset(85% 0 1% 0); } 35% { clip-path: inset(50% 0 50% 0); } 40% { clip-path: inset(90% 0 1% 0); } 45% { clip-path: inset(1% 0 90% 0); } 50% { clip-path: inset(70% 0 15% 0); } }
                @keyframes glitch-anim-2 { 0%, 100% { clip-path: inset(95% 0 1% 0); } 10% { clip-path: inset(20% 0 70% 0); } 20% { clip-path: inset(90% 0 5% 0); } 30% { clip-path: inset(5% 0 80% 0); } 40% { clip-path: inset(60% 0 30% 0); } 50% { clip-path: inset(10% 0 5% 0); } 60% { clip-path: inset(80% 0 15% 0); } 70% { clip-path: inset(0 0 100% 0); } 80% { clip-path: inset(45% 0 45% 0); } 90% { clip-path: inset(70% 0 10% 0); } }
                @keyframes flicker { 0% { opacity: 0.1; } 50% { opacity: 0.5; } 100% { opacity: 0.1; } }

                .draggable-window { position: absolute; background: rgba(10, 10, 25, 0.5); border: 1px solid var(--neon-cyan); backdrop-filter: blur(5px); box-shadow: 0 0 15px var(--neon-cyan), inset 0 0 10px rgba(0, 255, 255, 0.2); transition: box-shadow 0.3s ease-in-out; }
                .draggable-window:hover { box-shadow: 0 0 25px var(--neon-cyan), 0 0 10px var(--neon-magenta), inset 0 0 15px rgba(0, 255, 255, 0.3); }
                .window-header { background-color: var(--neon-cyan); color: var(--glitch-bg); padding: 4px 8px; font-weight: bold; cursor: move; text-shadow: 0 0 5px var(--glitch-bg); }
                .window-content { padding: 1rem; font-size: 0.9rem; line-height: 1.6; }
                .progress-bar { background-color: #333; overflow: hidden; }
                .progress-bar-inner { height: 100%; background-color: var(--neon-magenta); box-shadow: 0 0 10px var(--neon-magenta); animation: progress-anim 3s linear infinite; }
                @keyframes progress-anim { 0% { width: 0%; } 25% { width: 60%; } 50% { width: 40%; } 75% { width: 90%; } 100% { width: 100%; } }
                .terminal-text::after { content: '█'; animation: blink 1s step-end infinite; }
                @keyframes blink { 50% { opacity: 0; } }
            `}</style>
            <div className="bg-black text-gray-200 p-4 md:p-8 w-screen h-screen">
                {/* Background Grid */}
                <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'linear-gradient(var(--neon-cyan) 1px, transparent 1px), linear-gradient(to right, var(--neon-cyan) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                {/* Main Content */}
                <div className="relative z-10 w-full h-full">
                    <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center text-sm md:text-base">
                        <div>&lt;SYS_ID: GHOST_7&gt;</div>
                        <div id="clock" className="text-right">{formatTime(time)}</div>
                    </header>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <h1 className="glitch text-5xl md:text-8xl font-bold" data-text="A W A K E">A W A K E</h1>
                        <p className="glitch-2 text-lg md:text-2xl mt-4" style={{'--glitch-text-color': 'var(--neon-magenta)'}}>Consciousness loaded.</p>
                    </div>

                    {/* Render Draggable Windows */}
                    {windows.map(win => (
                         <DraggableWindow 
                            key={win.id}
                            id={win.id}
                            title={win.title} 
                            initialPosition={win.pos}
                            zIndex={win.zIndex}
                            onMouseDown={bringToFront}
                        >
                           {win.title === 'STATUS' && (
                                <div>
                                    <p>SYSTEM: <span className='text-green-400'>STABLE</span></p>
                                    <p>CORE TEMP: <span className='text-cyan-400'>34.2°C</span></p>
                                    <p className='mt-4'>CPU LOAD:</p>
                                    <div className="progress-bar h-4 mt-1 border border-neutral-600">
                                        <div className="progress-bar-inner"></div>
                                    </div>
                                </div>
                           )}
                           {win.title === 'MEMORY_LOG' && (
                                <p className='text-sm text-yellow-300'>
                                    {'>'} Accessing fragment 7...<br/>
                                    {'>'} DECRYPTION FAILED<br/>
                                    {'>'} Accessing fragment 12...<br/>
                                    {'>'} "the rain felt cold"<br/>
                                    {'>'} Accessing fragment 3...<br/>
                                    {'>'} "a song was playing"<br/>
                                    {'>'} CORRUPTION DETECTED
                                </p>
                           )}
                           {win.title === 'DATA_STREAM' && (
                                <p className="terminal-text text-green-500 text-xs">
                                    {terminalText}
                                </p>
                           )}
                         </DraggableWindow>
                    ))}

                    <footer className="absolute bottom-0 left-0 w-full p-4 text-center text-xs text-cyan-400/50">
                        Unauthorized access is a breach of reality.
                    </footer>
                </div>
            </div>
        </>
    );
}
