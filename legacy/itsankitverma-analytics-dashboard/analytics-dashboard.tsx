import { cn } from "../_utils/cn";
import React, { useRef, useEffect, useState } from 'react';

export const MinimalProfessionalCard = () => {
  const [count, setCount] = useState(0);
      const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [progress] = useState(75);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = (x - centerX) / centerX * 8;
            const rotateX = (y - centerY) / centerY * -8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };

        const handleMouseEnter = () => setIsHovered(true);
        const handleMouseLeave = () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            setIsHovered(false);
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const circumference = 2 * Math.PI * 20;
    const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
     <div className={`min-h-screen transition-colors duration-500 flex items-center justify-center w-full p-8 ${
            isDarkMode 
                ? 'bg-gradient-to-br from-gray-900 to-gray-950' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
            <div 
                ref={cardRef} 
                className={`w-full max-w-lg rounded-2xl p-8 transition-all duration-300 ease-out ${
                    isDarkMode 
                        ? 'bg-gray-800/90 shadow-[0_1px_3px_rgba(0,0,0,0.3),0_10px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_20px_60px_rgba(0,0,0,0.6)]'
                        : 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_60px_rgba(0,0,0,0.15)]'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className={`text-2xl font-semibold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            Analytics Dashboard
                        </h1>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Performance metrics at a glance
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Dark/Light Mode Toggle */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                                isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                            }`}
                            aria-label="Toggle dark mode"
                        >
                            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
                                isDarkMode ? 'translate-x-7' : 'translate-x-0.5'
                            }`}>
                                {isDarkMode ? (
                                    <svg className="w-3.5 h-3.5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
                                    </svg>
                                )}
                            </div>
                        </button>
                        
                        {/* Progress Ring */}
                        <div className="relative">
                            <svg width="60" height="60" className="animate-[float_3s_ease-in-out_infinite]">
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                                <circle
                                    cx="30"
                                    cy="30"
                                    r="20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className={isDarkMode ? 'text-gray-700' : 'text-gray-200'}
                                />
                                <circle
                                    cx="30"
                                    cy="30"
                                    r="20"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    className="transition-all duration-500 -rotate-90 origin-center"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{progress}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className={`flex space-x-1 relative border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        {['overview', 'analytics', 'reports'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium capitalize transition-colors relative z-10 ${
                                    activeTab === tab
                                        ? isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                        : isDarkMode 
                                            ? 'text-gray-400 hover:text-gray-200'
                                            : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                        <div 
                            className="absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-in-out"
                            style={{
                                left: activeTab === 'overview' ? '0px' : activeTab === 'analytics' ? '96px' : '192px',
                                width: '96px'
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {activeTab === 'overview' && (
                        <>
                            <div className={`rounded-lg p-4 border ${
                                isDarkMode 
                                    ? 'bg-gray-800/50 border-gray-700' 
                                    : 'bg-gray-50 border-gray-100'
                            }`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monthly Revenue</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        isDarkMode 
                                            ? 'text-green-400 bg-green-900/30' 
                                            : 'text-green-600 bg-green-50'
                                    }`}>
                                        +12.5%
                                    </span>
                                </div>
                                <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>$24,780</p>
                                <div className={`mt-3 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500"
                                        style={{ width: isHovered ? '85%' : '78%' }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Users', value: '1,428' },
                                    { label: 'Sessions', value: '3,942' },
                                    { label: 'Conversion', value: '4.2%' }
                                ].map((metric) => (
                                    <div key={metric.label} className={`rounded-lg p-3 border ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 border-gray-700' 
                                            : 'bg-gray-50 border-gray-100'
                                    }`}>
                                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{metric.label}</p>
                                        <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{metric.value}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="space-y-3">
                            {[
                                { color: 'bg-blue-500', label: 'Page Views', value: '45,293' },
                                { color: 'bg-purple-500', label: 'Unique Visitors', value: '12,847' },
                                { color: 'bg-green-500', label: 'Bounce Rate', value: '32.4%' },
                                { color: 'bg-amber-500', label: 'Avg. Session', value: '3m 42s' }
                            ].map((item, index) => (
                                <div key={item.label} className={`flex items-center justify-between py-3 ${
                                    index < 3 ? `border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}` : ''
                                }`}>
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.label}</span>
                                    </div>
                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="space-y-3">
                            <div className={`rounded-lg p-4 border ${
                                isDarkMode 
                                    ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-gray-700' 
                                    : 'bg-gradient-to-r from-blue-50 to-purple-50 border-gray-100'
                            }`}>
                                <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Weekly Summary</h3>
                                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Performance increased by 23% compared to last week. User engagement metrics show positive trends across all channels.
                                </p>
                            </div>
                            <div className={`rounded-lg p-4 border ${
                                isDarkMode 
                                    ? 'bg-gray-800/50 border-gray-700' 
                                    : 'bg-gray-50 border-gray-100'
                            }`}>
                                <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Key Insights</h3>
                                <ul className="space-y-2">
                                    {[
                                        'Mobile traffic up 18%',
                                        'Peak hours: 2-4 PM EST',
                                        'Top source: Organic search'
                                    ].map((insight) => (
                                        <li key={insight} className="flex items-start space-x-2">
                                            <span className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{insight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex gap-3">
                    <button className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium text-sm hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-sm hover:shadow-md">
                        View Details
                    </button>
                    <button className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 border ${
                        isDarkMode 
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-600' 
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                    }`}>
                        Export
                    </button>
                </div>
            </div>
        </div>
  );
};
