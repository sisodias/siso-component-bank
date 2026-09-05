import React from 'react';

// SVG Icons as React Components for better modularity
const PreviousIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14.032V5.968a1 1 0 00-1.555-.832L4.12 9.168a1 1 0 000 1.664l4.325 3zM12.89 9.168a1 1 0 000 1.664l4.325 3A1 1 0 0019 14.032V5.968a1 1 0 00-1.785-.832l-4.325 3z"></path></svg>
);

const PlayIcon = () => (
    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.032v3.936a1 1 0 001.555.832l3.333-1.968a1 1 0 000-1.664l-3.333-1.968z" clipRule="evenodd"></path></svg>
);

const NextIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 5.168A1 1 0 0010 5.968v8.064a1 1 0 001.555.832l4.325-3.032a1 1 0 000-1.664l-4.325-3zM7.11 9.168a1 1 0 00-1.785.832v3.936a1 1 0 001.785.832l4.325-3.032a1 1 0 000-1.664l-4.325-3z"></path></svg>
);

// The main NeumorphicMusicPlayer component
export const NeumorphicMusicPlayer = () => {
    return (
        <div className="neumorphic-bg  flex items-center justify-center min-h-screen p-4">
            <div className="neumorphic-card w-full max-w-sm p-8 space-y-8">
                {/* Album Art */}
                <div className="aspect-square rounded-3xl overflow-hidden shadow-lg">
                    <img src="https://placehold.co/400x400/6366f1/e0e5ec?text=FOXYxLORD" alt="Album Art" className="w-full h-full object-cover" />
                </div>

                {/* Song Info */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Starlight Echo</h1>
                    <p className="text-md text-gray-500 mt-1">Orion's Belt</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="neumorphic-inset h-2 w-full">
                        <div className="bg-indigo-500 h-2 rounded-lg" style={{ width: '45%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-gray-500">
                        <span>1:23</span>
                        <span>3:45</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-6">
                    <button className="neumorphic-button w-16 h-16 flex items-center justify-center text-gray-600" aria-label="Previous song">
                        <PreviousIcon />
                    </button>
                    <button className="neumorphic-button w-20 h-20 flex items-center justify-center text-indigo-500" aria-label="Play or pause">
                        <PlayIcon />
                    </button>
                    <button className="neumorphic-button w-16 h-16 flex items-center justify-center text-gray-600" aria-label="Next song">
                        <NextIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};
