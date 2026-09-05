import React, { useState } from 'react';

// ProfileCard Component (Original UI preserved)
const ProfileCard = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-3xl p-10 max-w-2xl w-full mx-auto flex flex-col items-start gap-4 transition-all duration-300 shadow-lg dark:shadow-2xl dark:shadow-black/50" style={{
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      <img
        src="https://ik.imagekit.io/fpxbgsota/Frame%205.png?updatedAt=1753044070628"
        alt="Ravi Katiyar"
        className="w-30 h-30 rounded-full object-cover shadow-md mb-4"
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src= null; 
        }}
      />
      
      <div className="text-left w-full">
        <h1 className="text-5xl leading-tight mb-4 font-bold">
          Hey, I'm Ravi Katiyar. <br/> Dreamer & Designer
        </h1>
        <p className="text-lg leading-relaxed m-0 max-w-full" style={{
          color: 'var(--text-secondary)'
        }}>
          Crafting seamless experiences and bold visuals. High school student by day, creative thinker, and aspiring innovator by night.
        </p>
      </div>

      <div className="flex flex-wrap justify-start gap-3 mt-6 w-full">
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center gap-2 no-underline font-semibold text-base py-3.5 px-6 rounded-xl transition-all duration-300 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:scale-110 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transform-gpu cursor-pointer"
          style={{
            backgroundColor: 'var(--button-bg)',
            color: 'var(--button-text)'
          }}
        >
          Contact Us
        </a>
        <div className="flex justify-center items-center gap-2 font-semibold text-base py-3.5 px-6 rounded-xl" style={{
          backgroundColor: 'var(--status-bg)',
          color: 'var(--status-text)'
        }}>
          <span className="w-2 h-2 rounded-full" style={{
            backgroundColor: 'var(--status-dot)'
          }}></span>
          <span>Available for new project</span>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={`min-h-screen px-5 w-full py-10 flex justify-center items-center transition-colors duration-300 ${
      isDarkMode ? 'bg-black dark' : 'bg-gray-50'
    }`} style={{
      '--bg-primary': isDarkMode ? '#1c1c1e' : '#ffffff',
      '--text-primary': isDarkMode ? '#f2f2f7' : '#1c1c1e',
      '--text-secondary': isDarkMode ? '#8e8e93' : '#6c6c70',
      '--button-bg': isDarkMode ? '#f2f2f7' : '#1c1c1e',
      '--button-text': isDarkMode ? '#1c1c1e' : '#ffffff',
      '--status-bg': isDarkMode ? '#2c3b29' : '#e1f9dc',
      '--status-text': isDarkMode ? '#34c759' : '#178d00',
      '--status-dot': isDarkMode ? '#34c759' : '#178c00'
    }}>
      <button 
        onClick={toggleTheme} 
        className={`fixed top-5 right-5 py-2.5 px-4 rounded-xl border cursor-pointer font-medium z-50 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-600 text-gray-100' 
            : 'bg-white border-gray-300 text-gray-700'
        }`}
      >
        Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>
      
      <ProfileCard />
      
      <style jsx>{`
        @media (max-width: 600px) {
          .min-h-screen {
            padding: 0;
            align-items: stretch;
          }
          
          .rounded-3xl {
            border-radius: 0;
            width: 100%;
            min-height: 100vh;
            box-shadow: none;
            justify-content: center;
            padding: 2.5rem 1.25rem;
          }
          
          .w-30 {
            width: 6.25rem;
            height: 6.25rem;
          }
          
          .text-5xl {
            font-size: 2.25rem;
          }
          
          .text-lg {
            font-size: 1rem;
          }
        }
        
        .w-30 {
          width: 7.5rem;
          height: 7.5rem;
        }
      `}</style>
    </div>
  );
};

export default App;