import React from 'react';

const GitIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-auto text-gray-400">
        <path d="M18 6l-6 6-6-6" />
        <path d="M12 12v6" />
    </svg>
);

const NpmIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-auto text-gray-400">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M20 4H4v16h16V4zM7 7h2v10H7V7zm4 0h2v10h-2V7zm4 0h2v10h-2V7z"/>
    </svg>
);

const JQueryIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-auto text-gray-400">
        <path d="M20 6L9 17l-5-5"/>
    </svg>
);


// Main App Component
export default function Web3HeroSection() {
    // Data for partner logos for easy management
    const partners = [
        { name: "git", icon: <GitIcon /> },
        { name: "npm", icon: <NpmIcon /> },
        { name: "Lucidchart", text: "Lucidchart" },
        { name: "wrike", text: "wrike" },
        { name: "jQuery", icon: <JQueryIcon /> },
        { name: "openstack", text: "openstack" },
        { name: "servicenow", text: "servicenow" },
        { name: "Paysafe:", text: "Paysafe:" }
    ];

    // CSS keyframes for our custom animations
    const keyframes = `
        @keyframes scroll-grid {
            0% { background-position: 0 0; }
            100% { background-position: -100px -100px; }
        }
        @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
    `;

    return (
        <div className="bg-[#0D0D0D] min-h-screen font-sans text-white overflow-hidden">
            {/* We inject the keyframes into the document head for global use */}
            <style>{keyframes}</style>

            <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4">

                {/* Background Graphic Container */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                            maskImage: `linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%),
                                        linear-gradient(to right, black 0%, black 15%, transparent 25%, transparent 75%, black 85%, black 100%),
                                        linear-gradient(to right, black 0%, black 25%, transparent 35%, transparent 65%, black 75%, black 100%),
                                        linear-gradient(to bottom, black 0%, black 25%, transparent 40%, transparent 60%, black 75%, black 100%)`,
                            maskComposite: 'intersect',
                        }}
                    >
                        {/* Color Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-blue-600 opacity-90" />

                        {/* 3D Perspective Grid */}
                        <div className="absolute inset-0" style={{ perspective: '1000px' }}>
                            <div
                                className="w-full h-full"
                                style={{
                                    backgroundImage: `repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 1px, transparent 1px, transparent 50px),
                                                      repeating-linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 1px, transparent 1px, transparent 50px)`,
                                    transform: 'rotateX(60deg) translateY(20%)',
                                    transformOrigin: 'bottom',
                                    // Apply the scrolling animation here
                                    animation: 'scroll-grid 10s linear infinite',
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="relative z-10 text-center flex flex-col items-center mt-20 md:mt-0">
                    <div 
                        className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-full px-4 py-1 text-sm mb-4"
                        style={{ animation: 'fade-in 1s ease-out' }}
                    >
                        Announcing our web3 beta
                    </div>
                    <h1 
                        className="text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl leading-tight"
                        style={{ animation: 'fade-in-up 0.8s ease-out 0.2s backwards' }}
                    >
                        Create and connect your world on web3
                    </h1>
                    <p 
                        className="text-gray-300 mt-6 max-w-2xl text-lg md:text-xl"
                        style={{ animation: 'fade-in-up 0.8s ease-out 0.4s backwards' }}
                    >
                        The essential web3 toolkit for sharing and funding anything. From writing about your latest idea, to building for the next big DAO.
                    </p>
                    <button 
                        className="bg-white text-black font-semibold px-8 py-3 rounded-md mt-8 hover:bg-gray-200 transition-colors text-lg"
                        style={{ animation: 'fade-in-up 0.8s ease-out 0.6s backwards' }}
                    >
                        Try Molibra
                    </button>
                </main>

                {/* Footer Partners */}
                <footer 
                    className="absolute bottom-0 left-0 right-0 p-6 md:px-12 z-10"
                    style={{ animation: 'fade-in 1s ease-out 1s backwards' }}
                >
                    <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-gray-400">
                        {partners.map(partner => (
                            <div key={partner.name} className="flex items-center gap-2 font-mono text-sm">
                                {partner.icon ? partner.icon : <span>{partner.text}</span>}
                            </div>
                        ))}
                    </div>
                </footer>

            </div>
        </div>
    );
}
