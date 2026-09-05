import React from "react";

export const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 via-white to-gray-300 dark:from-gray-800 dark:via-gray-900 dark:to-black transition-all">
      <div className="bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 text-center max-w-md w-full">
        <div className="text-7xl mb-4">👻</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404 - Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2 text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-full transition-all duration-300"
        >
          🔙 Return Home
        </a>
      </div>
    </div>
  );
};
