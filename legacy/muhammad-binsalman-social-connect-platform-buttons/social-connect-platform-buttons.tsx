import React, { useState } from 'react';

const SocialConnectButtons = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    discord: 'disconnected',
    slack: 'disconnected',
    reddit: 'disconnected'
  });

  const handleConnect = (platform) => {
    if (connectionStatus[platform] !== 'disconnected') return;
    
    setConnectionStatus(prev => ({...prev, [platform]: 'connecting'}));
    
    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus(prev => ({...prev, [platform]: 'connected'}));
    }, 2000);
  };

  const getButtonClass = (platform) => {
    const baseClass = "group relative p-4 rounded-2xl backdrop-blur-xl border-2 bg-gradient-to-br shadow-2xl hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-out overflow-hidden w-full ";
    
    const statusClass = connectionStatus[platform] === 'connected' 
      ? 'from-green-900/40 to-green-900/20 border-green-500/60 hover:border-green-400/60 cursor-default ' 
      : connectionStatus[platform] === 'connecting' 
        ? 'opacity-80 cursor-not-allowed ' 
        : '';
    
    const platformClass = {
      discord: 'from-indigo-900/40 via-black-900/60 to-black/80 border-indigo-500/30 hover:border-indigo-400/60 hover:shadow-indigo-500/30 ',
      slack: 'from-purple-900/40 via-black-900/60 to-black/80 border-purple-500/30 hover:border-purple-400/60 hover:shadow-purple-500/30 ',
      reddit: 'from-orange-900/40 via-black-900/60 to-black/80 border-orange-500/30 hover:border-orange-400/60 hover:shadow-orange-500/30 '
    }[platform];
    
    return baseClass + statusClass + platformClass;
  };

  const getStatusText = (platform) => {
    if (connectionStatus[platform] === 'connecting') return 'Connecting...';
    if (connectionStatus[platform] === 'connected') return 'Connected!';
    return `Join ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
  };

  const getSubText = (platform) => {
    if (connectionStatus[platform] === 'connecting') return 'Please wait a moment';
    if (connectionStatus[platform] === 'connected') return 'Successfully joined community';
    return 'Join our community';
  };

  const getIconColor = (platform) => {
    if (connectionStatus[platform] === 'connected') return 'text-green-400 group-hover:text-green-300';
    return {
      discord: 'text-indigo-400 group-hover:text-indigo-300',
      slack: 'text-purple-400 group-hover:text-purple-300',
      reddit: 'text-orange-400 group-hover:text-orange-300'
    }[platform];
  };

  const getIconBg = (platform) => {
    if (connectionStatus[platform] === 'connected') return 'from-green-500/30 to-green-600/10 group-hover:from-green-400/40 group-hover:to-green-500/20';
    return {
      discord: 'from-indigo-500/30 to-indigo-600/10 group-hover:from-indigo-400/40 group-hover:to-indigo-500/20',
      slack: 'from-purple-500/30 to-purple-600/10 group-hover:from-purple-400/40 group-hover:to-purple-500/20',
      reddit: 'from-orange-500/30 to-orange-600/10 group-hover:from-orange-400/40 group-hover:to-orange-500/20'
    }[platform];
  };

  const getTextColor = (platform) => {
    if (connectionStatus[platform] === 'connected') return 'text-green-400 group-hover:text-green-300';
    return {
      discord: 'text-indigo-400 group-hover:text-indigo-300',
      slack: 'text-purple-400 group-hover:text-purple-300',
      reddit: 'text-orange-400 group-hover:text-orange-300'
    }[platform];
  };

  const getSubTextColor = (platform) => {
    if (connectionStatus[platform] === 'connected') return 'text-green-300/60 group-hover:text-green-200/80';
    return {
      discord: 'text-indigo-300/60 group-hover:text-indigo-200/80',
      slack: 'text-purple-300/60 group-hover:text-purple-200/80',
      reddit: 'text-orange-300/60 group-hover:text-orange-200/80'
    }[platform];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br w-full from-neutral-900 to-black flex flex-col items-center justify-center p-12 font-sans">

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mx-auto justify-center">
        {/* Discord Button */}
        <div className="flex-1 max-w-sm">
          <button
            onClick={() => handleConnect('discord')}
            disabled={connectionStatus.discord !== 'disconnected'}
            className={getButtonClass('discord')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-indigo-400/20 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {connectionStatus.discord === 'connected' && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 via-green-400/20 to-green-500/10 opacity-100 transition-opacity duration-500"></div>
            )}

            <div className="relative z-10 flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br backdrop-blur-sm transition-all duration-300 ${getIconBg('discord')}`}>
                {connectionStatus.discord === 'connecting' ? (
                  <div className="w-7 h-7 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : connectionStatus.discord === 'connected' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className={`w-7 h-7 fill-current transition-all duration-300 group-hover:scale-110 drop-shadow-lg ${getIconColor('discord')}`}
                  >
                    <path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    className={`w-7 h-7 fill-current transition-all duration-300 group-hover:scale-110 drop-shadow-lg ${getIconColor('discord')}`}
                  >
                    <path
                      d="M524.531 69.836a1.5 1.5 0 0 0-.764-.7A485.065 485.065 0 0 0 404.081 32.03a1.816 1.816 0 0 0-1.923.91 337.461 337.461 0 0 0-14.9 30.6 447.848 447.848 0 0 0-134.426 0 309.541 309.541 0 0 0-15.135-30.6 1.89 1.89 0 0 0-1.924-.91 483.689 483.689 0 0 0-119.688 37.107 1.712 1.712 0 0 0-.788.676C39.068 183.651 18.186 294.69 28.43 404.354a2.016 2.016 0 0 0 .765 1.375 487.666 487.666 0 0 0 146.825 74.189 1.9 1.9 0 0 0 2.063-.676A348.2 348.2 0 0 0 208.12 430.4a1.86 1.86 0 0 0-1.019-2.588 321.173 321.173 0 0 1-45.868-21.853 1.885 1.885 0 0 1-.185-3.126 251.047 251.047 0 0 0 9.109-7.137 1.819 1.819 0 0 1 1.9-.256c96.229 43.917 200.41 43.917 295.5 0a1.812 1.812 0 0 1 1.924.233 234.533 234.533 0 0 0 9.132 7.16 1.884 1.884 0 0 1-.162 3.126 301.407 301.407 0 0 1-45.89 21.83 1.875 1.875 0 0 0-1 2.611 391.055 391.055 0 0 0 30.014 48.815 1.864 1.864 0 0 0 2.063.7A486.048 486.048 0 0 0 610.7 405.729a1.882 1.882 0 0 0 .765-1.352c12.264-126.783-20.532-236.912-86.934-334.541zM222.491 337.58c-28.972 0-52.844-26.587-52.844-59.239s23.409-59.241 52.844-59.241c29.665 0 53.306 26.82 52.843 59.239 0 32.654-23.41 59.241-52.843 59.241zm195.38 0c-28.971 0-52.843-26.587-52.843-59.239s23.409-59.241 52.843-59.241c29.667 0 53.307 26.820 52.844 59.239 0 32.654-23.177 59.241-52.844 59.241z"
                    ></path>
                  </svg>
                )}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-bold text-lg transition-colors duration-300 drop-shadow-sm ${getTextColor('discord')}`}>
                  {getStatusText('discord')}
                </p>
                <p className={`text-sm transition-colors duration-300 ${getSubTextColor('discord')}`}>
                  {getSubText('discord')}
                </p>
              </div>
              <div className={`transition-all duration-300 ${
                connectionStatus.discord !== 'disconnected' ? 'opacity-0' : 'opacity-40 group-hover:opacity-100 group-hover:translate-x-1'
              }`}>
                <svg
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                  className={`w-5 h-5 ${connectionStatus.discord === 'connected' ? 'text-green-400' : 'text-indigo-400'}`}
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Slack Button */}
        <div className="flex-1 max-w-sm">
          <button
            onClick={() => handleConnect('slack')}
            disabled={connectionStatus.slack !== 'disconnected'}
            className={getButtonClass('slack')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-purple-400/20 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {connectionStatus.slack === 'connected' && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 via-green-400/20 to-green-500/10 opacity-100 transition-opacity duration-500"></div>
            )}

            <div className="relative z-10 flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br backdrop-blur-sm transition-all duration-300 ${getIconBg('slack')}`}>
                {connectionStatus.slack === 'connecting' ? (
                  <div className="w-7 h-7 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : connectionStatus.slack === 'connected' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className={`w-7 h-7 fill-current transition-all duration-300 group-hover:scale-110 drop-shadow-lg ${getIconColor('slack')}`}
                  >
                    <path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 122.8 122.8"
                    className={`w-7 h-7 fill-current transition-all duration-300 group-hover:scale-110 drop-shadow-lg ${getIconColor('slack')}`}
                  >
                    <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"/>
                    <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"/>
                    <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"/>
                    <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"/>
                  </svg>
                )}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-bold text-lg transition-colors duration-300 drop-shadow-sm ${getTextColor('slack')}`}>
                  {getStatusText('slack')}
                </p>
                <p className={`text-sm transition-colors duration-300 ${getSubTextColor('slack')}`}>
                  {getSubText('slack')}
                </p>
              </div>
              <div className={`transition-all duration-300 ${
                connectionStatus.slack !== 'disconnected' ? 'opacity-0' : 'opacity-40 group-hover:opacity-100 group-hover:translate-x-1'
              }`}>
                <svg
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                  className={`w-5 h-5 ${connectionStatus.slack === 'connected' ? 'text-green-400' : 'text-purple-400'}`}
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Reddit Button */}
        <div className="flex-1 max-w-sm">
          <button
            onClick={() => handleConnect('reddit')}
            disabled={connectionStatus.reddit !== 'disconnected'}
            className={getButtonClass('reddit')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 via-orange-400/20 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {connectionStatus.reddit === 'connected' && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 via-green-400/20 to-green-500/10 opacity-100 transition-opacity duration-500"></div>
            )}

            <div className="relative z-10 flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br backdrop-blur-sm transition-all duration-300 ${getIconBg('reddit')}`}>
                {connectionStatus.reddit === 'connecting' ? (
                  <div className="w-7 h-7 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : connectionStatus.reddit === 'connected' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className={`w-7 h-7 fill-current transition-all duration-300 group-hover:scale-110 drop-shadow-lg ${getIconColor('reddit')}`}
                  >
                    <path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    className={`w-7 h-7 fill-current transition-all duration-300 group-hover:scale-110 drop-shadow-lg ${getIconColor('reddit')}`}
                  >
                    <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm5.918 12.712c-.072.143-.507 1.062-1.538 1.662-1.03.6-2.398.908-3.38.908-.983 0-2.35-.308-3.38-.908-1.03-.6-1.466-1.52-1.538-1.662a.5.5 0 0 1 .847-.53c.006.01.434.624 1.63 1.132 1.195.508 2.747.768 3.44.768.694 0 2.245-.26 3.44-.768 1.196-.508 1.624-1.122 1.63-1.132a.5.5 0 0 1 .847.53zm-9.168-4.45a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm6.5 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/>
                  </svg>
                )}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-bold text-lg transition-colors duration-300 drop-shadow-sm ${getTextColor('reddit')}`}>
                  {getStatusText('reddit')}
                </p>
                <p className={`text-sm transition-colors duration-300 ${getSubTextColor('reddit')}`}>
                  {getSubText('reddit')}
                </p>
              </div>
              <div className={`transition-all duration-300 ${
                connectionStatus.reddit !== 'disconnected' ? 'opacity-0' : 'opacity-40 group-hover:opacity-100 group-hover:translate-x-1'
              }`}>
                <svg
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                  className={`w-5 h-5 ${connectionStatus.reddit === 'connected' ? 'text-green-400' : 'text-orange-400'}`}
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Status indicators */}
      <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
        {['discord', 'slack', 'reddit'].map(platform => (
          <div key={platform} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus[platform] === 'connected' ? 'bg-green-500 animate-pulse' : 
              connectionStatus[platform] === 'connecting' ? 'bg-yellow-500' : 'bg-gray-500'
            }`}></div>
            <span className="capitalize">{platform}: {connectionStatus[platform]}</span>
          </div>
        ))}
      </div>

      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-indigo-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          ></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export {SocialConnectButtons};