import React, { useState, useRef, useEffect } from 'react';

export const FeatureCardWithVideo = ({
    title,
    description,
    videoSrc,
    videoPoster,
    isNew = false,
    placeholderIcon = null,
    gradientType = 'theme',
    className = '',
    onClick
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isHovering) {
                videoRef.current.play().catch(err => {
                    console.warn("Couldn't autoplay video:", err);
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isHovering]);

    const handleClick = () => {
        if (onClick) {
            if (typeof onClick === 'string') {
                window.open(onClick, '_blank');
            } else if (typeof onClick === 'function') {
                onClick();
            }
        }
    };

    const getThemeTitleClasses = () => {
        return "bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 bg-clip-text text-transparent";
    };

    const getCustomTitleStyle = () => ({
        backgroundImage: 'linear-gradient(130deg, #ffc400 0%, #a0ff00 33%, #00ffaa 66%, #00aaff 87%, #5500ff 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent'
    });

    const themeBadgeClasses = "bg-orange-500/15 text-orange-500 border border-orange-500/25";
    const customBadgeClasses = "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30";

    return (
        <div
            className={`relative w-full max-w-sm sm:w-80 h-44 overflow-hidden rounded-xl cursor-pointer group border border-white/10 bg-gradient-to-b from-gray-800 to-black outline outline-1 outline-transparent outline-offset-2 transition-all duration-300 ease-out hover:border-white/20 hover:bg-gray-800 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.03] hover:outline-orange-500/30 ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleClick}
        >
            <div className="absolute inset-0 p-4 z-10 space-y-2">
                {isNew && (
                    <span className={`absolute top-3 left-3 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${gradientType === 'theme' ? themeBadgeClasses : customBadgeClasses}`}>
                        New
                    </span>
                )}

                <h3
                    className={`text-xl font-bold ${isNew ? 'pt-8' : 'pt-1'} ${gradientType === 'theme' ? getThemeTitleClasses() : ''}`}
                    style={gradientType === 'custom' ? getCustomTitleStyle() : {}}
                >
                    {title}
                </h3>

                <p className="text-white/70 text-sm max-w-[75%]">
                    {description}
                </p>
            </div>

            <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-out ${
                videoSrc 
                    ? "right-3 translate-x-3 rotate-12 scale-75 opacity-40 group-hover:opacity-80 group-hover:scale-90 group-hover:rotate-1 group-hover:translate-x-1" 
                    : "scale-95 opacity-20 rotate-12 pr-4 group-hover:opacity-80 group-hover:scale-105 group-hover:rotate-0 group-hover:translate-x-1"
            }`}>
                {videoSrc ? (
                    <div className="w-24 h-40 rounded-lg overflow-hidden shadow-md bg-black">
                        <video
                            ref={videoRef}
                            src={videoSrc}
                            poster={videoPoster}
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-28 h-40 rounded-lg flex items-center justify-center transition-all duration-200 ease-out opacity-100 scale-75">
                        <span className="transition-colors duration-300 ease-out group-hover:text-orange-600">
                            {placeholderIcon || (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-28 h-full object-cover rounded-lg transition-all duration-500 ease-out text-slate-500 group-hover:text-orange-600" style={{ filter: 'brightness(0.7)' }}>
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                    <circle cx="9" cy="9" r="2"></circle>
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                </svg>
                            )}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};