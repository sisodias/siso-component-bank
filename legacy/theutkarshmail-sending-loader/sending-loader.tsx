import React from 'react';

interface TerminalLoaderProps {
  text?: string;
  className?: string;
}

export const Component: React.FC<TerminalLoaderProps> = ({ 
  text = "Sending...", 
  className = "" 
}) => {
  return (
    <div className={`terminal-loader relative bg-gray-900 border border-gray-600 font-mono text-base p-6 pt-4 w-48 shadow-lg rounded border-opacity-80 overflow-hidden ${className}`}>
      <div className="terminal-header absolute top-0 left-0 right-0 h-6 bg-gray-700 rounded-t px-2 flex items-center justify-between">
        <div className="terminal-title text-gray-200 text-sm leading-6">
          Status
        </div>
        <div className="terminal-controls flex gap-2">
          <div className="control close w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="control minimize w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
          <div className="control maximize w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="text text-green-400 inline-block whitespace-nowrap overflow-hidden mt-6">
        {text}
      </div>
    </div>
  );
};
