import React, { useState, useEffect } from 'react';

// --- Helper Components ---

// Animated Grid Background
const GridBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
            className="absolute inset-[-10%] animate-grid-pan"
            style={{
                backgroundImage: 'linear-gradient(to right, #80808012 1px, transparent 1px), linear-gradient(to bottom, #80808012 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 60%, transparent 100%)',
            }}
        ></div>
        <style>
        {`
            @keyframes grid-pan {
                0% { transform: translate(0, 0); }
                100% { transform: translate(24px, 24px); }
            }
            .animate-grid-pan {
                animation: grid-pan 10s linear infinite;
            }
        `}
        </style>
    </div>
);


// Theme Toggle Switch
const ThemeToggle = ({ darkMode, setDarkMode }) => (
  <button
    onClick={() => setDarkMode(!darkMode)}
    className="absolute top-6 right-6 z-20 p-2 rounded-full text-gray-500 dark:text-gray-400 bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/70 dark:hover:bg-gray-600/70 transition-all duration-300"
    aria-label="Toggle theme"
  >
    {darkMode ? (
       // Sun Icon
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    ) : (
      // Moon Icon
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    )}
  </button>
);

// Icon for the file type, now with a universal folded corner
const FileIcon = ({ type }) => {
  const typeStyles = {
    PDF: { bg: 'bg-red-500', text: '.PDF' },
    XLS: { bg: 'bg-green-500', text: '.XLS' },
    DOCX: { bg: 'bg-blue-500', text: '.DOC' },
  };

  const style = typeStyles[type] || { bg: 'bg-gray-500', text: 'FILE' };

  return (
    <div className={`relative flex-shrink-0 w-14 h-14 ${style.bg} rounded-lg flex items-center justify-center mr-4 overflow-hidden`}>
      {/* This creates the folded corner effect for all icons */}
      <div
        className="absolute top-0 right-0 w-4 h-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
        style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
      ></div>
      <span className="text-white font-bold text-sm">{style.text}</span>
    </div>
  );
};


// Progress bar for downloading items
const ProgressBar = ({ progress }) => (
  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1.5">
    <div
      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

// Action buttons (Download/Cancel)
const ActionButton = ({ status, onCancel }) => {
  if (status === 'downloading') {
    return (
      <button onClick={onCancel} className="text-slate-500 dark:text-slate-400 font-semibold text-sm hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200">
        Cancel
      </button>
    );
  }
  return (
    <button className="text-blue-600 dark:text-blue-500 font-semibold text-sm hover:text-blue-800 dark:hover:text-blue-400 transition-colors duration-200">
      Download
    </button>
  );
};

// --- Main File Item Component (Now fully responsive) ---
const FileItem = ({ file, onCancel }) => {
  const { name, type, subtype, size, status, progress } = file;
  const displaySize = size < 1 ? `${(size * 1000).toFixed(0)} KB` : `${size} MB`;

  return (
    <div className="flex flex-wrap items-center py-3">
      {/* Container for Icon and Name/Progress */}
      <div className="flex items-center flex-grow min-w-0">
        <FileIcon type={type} />
        <div className="flex-grow min-w-0">
          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{name}</p>
          {status === 'downloading' ? (
            <ProgressBar progress={progress} />
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">{subtype}</p>
          )}
        </div>
      </div>
      
      {/* Container for Size and Button, wraps on mobile */}
      <div className="flex items-center justify-end w-full sm:w-auto mt-2 sm:mt-0 pl-[72px] sm:pl-0">
        <div className="flex-shrink-0 w-20 text-right text-sm font-medium text-slate-500 dark:text-slate-400">
          {displaySize}
        </div>
        <div className="flex-shrink-0 w-24 text-right">
          <ActionButton status={status} onCancel={() => onCancel(file.id)} />
        </div>
      </div>
    </div>
  );
};

// --- App Component ---
export default function App() {
  // Respect user's system preference for dark mode
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const initialFiles = [
    { id: 1, name: 'ReactJS-for-beginner.pdf', type: 'PDF', size: 4.5, status: 'downloading', progress: 0, originalSubtype: 'Portable Document Format', subtype: 'Downloading...' },
    { id: 2, name: 'Database-MySQL.xls', type: 'XLS', size: 25.7, status: 'complete', progress: 100, subtype: 'Microsoft Excel' },
    { id: 3, name: 'Summary-of-php.docx', type: 'DOCX', size: 0.35, status: 'complete', progress: 100, subtype: 'Microsoft Word' },
  ];
  const [files, setFiles] = useState(initialFiles);

  // Effect for download simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setFiles(currentFiles =>
        currentFiles.map(file => {
          if (file.status === 'downloading' && file.progress < 100) {
            const increment = Math.random() * 8;
            const newProgress = Math.min(file.progress + increment, 100);
            if (newProgress >= 100) {
              return { ...file, progress: 100, status: 'complete', subtype: file.originalSubtype };
            }
            return { ...file, progress: newProgress };
          }
          return file;
        })
      );
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Effect to update the class on the root <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleCancel = (fileId) => {
    setFiles(currentFiles =>
      currentFiles.map(file =>
        file.id === fileId ? { ...file, status: 'complete', progress: 100, subtype: 'Cancelled' } : file
      )
    );
  };

  return (
    <div className="relative bg-slate-50 dark:bg-slate-900 min-h-screen w-full flex items-center justify-center font-sans transition-colors duration-300 py-8">
      <GridBackground />
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="relative w-full max-w-lg mx-4 sm:mx-auto bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 px-2 sm:px-0">Your Downloads</h1>
        <div>
          {files.map(file => (
            <FileItem key={file.id} file={file} onCancel={handleCancel} />
          ))}
        </div>
      </div>
    </div>
  );
}
