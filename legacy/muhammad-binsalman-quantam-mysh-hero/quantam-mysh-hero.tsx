import React from 'react';

const HeroSection = () => {
  return (
    <div className="bg-black text-white w-full min-h-screen space-y-28 relative max-w-screen overflow-x-hidden font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 z-10">
        <div className="flex items-center">
          <span className="text-purple-600 text-2xl mr-1">•</span>
          <span className="text-xl font-semibold">Mysh</span><span className="text-purple-600 text-2xl ml-1">•</span>
        </div>
        <ul className="sm:flex space-x-8 text-sm bg-purple-500/10 py-1 rounded-full px-3 hidden">
          <li className="cursor-pointer hover:bg-purple-700 rounded-full p-2 px-3 font-thin">Home</li>
          <li className="cursor-pointer hover:bg-purple-700 rounded-full p-2 px-3 font-thin">About</li>
          <li className="cursor-pointer hover:bg-purple-700 rounded-full p-2 px-3 font-thin">Portfolio</li>
          <li className="cursor-pointer hover:bg-purple-700 rounded-full p-2 px-3 font-thin">Contact</li>
          <li className="cursor-pointer hover:bg-purple-700 rounded-full p-2 px-3 font-thin">FAQ</li>
        </ul>
        <button className="bg-purple-600 text-white px-5 py-2 rounded-md text-sm font-medium">Get In Touch</button>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center text-center px-10 z-10">
        <div className="flex items-center bg-purple-900/20 border border-purple-600/50 rounded-full pl-2 pr-4 py-1 text-purple-400 text-xs mb-8 tracking-wider font-light">
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full mr-2 text-xs font-light">2025</span>
          Next-Gen AI Studio
        </div>
        <h1 className="text-7xl font-bold leading-tight font-light">
          AI-Driven Success.
        </h1>
        <h1 className="text-7xl font-bold leading-tight mb-6 font-light ">
          Redefining the Future.
        </h1>
        <p className="text-sm max-w-lg mb-2 font-light">Creating latest solutions that redefine innovation.</p>
        <p className="text-sm max-w-lg mb-8 font-light">Stay ahead with AI-powered technology for the future.</p>
        <div className="flex space-x-4 mb-16">
          <button className="bg-white text-black px-5 py-2 cursor-pointer hover:bg-purple-200 rounded-md text-sm ">Connect With Us</button>
          <button className="bg-white/50  text-white px-5 py-2 cursor-pointer hover:bg-purple-600 rounded-md text-sm ">What is Mysh?</button>
        </div>

        {/* Infinite Moving Fading Carousel */}
        <div className="w-full max-w-xl mx-auto overflow-hidden relative h-10 mb-20 z-10">
          <div className="flex animate-marquee whitespace-nowrap text-gray-400 text-xl">
            <span className="mx-6">IPSUM</span>
            <span className="mx-6">∞</span>
            <span className="mx-6">MOOO</span>
            {/* Duplicated for seamless loop */}
            <span className="mx-6">IPSUM</span>
            <span className="mx-6">∞</span>
            <span className="mx-6">MOOO</span>
          </div>
          {/* Fading gradients */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-purple-900/10 to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-purple-900/10 to-transparent"></div>
        </div>
      </div>

      {/* Gradient Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-purple-900/50 via-purple-600/20 to-transparent rounded-t-full opacity-80 blur-3xl"></div>

    </div>
  );
};

export default HeroSection;