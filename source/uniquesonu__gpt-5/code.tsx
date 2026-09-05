import React from "react";
import { Search, Mic } from "lucide-react"; // icons
// Install: npm install lucide-react

export default function GPT5IntroScreen() {
  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* Top Button */}
      <div className="absolute top-6 w-full flex justify-center">
        <button className="bg-indigo-800 hover:bg-indigo-700 text-white text-sm px-4 py-1 rounded-full shadow-md">
          Upgrade your plan
        </button>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-3xl font-semibold mb-2">Introducing GPT-5</h1>
        <p className="text-gray-300 max-w-md mb-8">
          ChatGPT now has our smartest, fastest, most useful model yet, with
          thinking built in — so you get the best answer, every time.
        </p>

        {/* Search bar */}
        <div className="flex items-center bg-gray-800/50 border border-gray-600 rounded-full px-4 py-2 w-full max-w-xl">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Ask anything"
            className="bg-transparent outline-none flex-1 text-white placeholder-gray-400"
          />
          <Mic className="text-gray-400 w-5 h-5 ml-2" />
        </div>
      </div>
    </div>
  );
}
