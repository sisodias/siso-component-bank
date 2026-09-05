import React, { useEffect, useRef } from 'react';

// The main HeroSection component
export const HeroSection = () => {
  const gridContainerRef = useRef(null);

  // useEffect hook to run the background generation script after the component mounts
  useEffect(() => {
    const container = gridContainerRef.current;
    if (!container) return;

    // Clear any existing bars to prevent duplication on re-renders
    container.innerHTML = '';

    const columns = Math.floor(window.innerWidth / 22);
    const rows = Math.floor(window.innerHeight / 10);
    
    for (let i = 0; i < columns * rows; i++) {
        const bar = document.createElement('div');
        bar.classList.add('grid-bar');
        
        // Stagger the animation delay for a wave effect
        const col = i % columns;
        const row = Math.floor(i / columns);
        bar.style.animationDelay = `${(col + row) * 0.1}s, ${(col + row) * 0.1 + 4}s`;
        container.appendChild(bar);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Effects */}
      <div ref={gridContainerRef} className="dynamic-grid-background"></div>

      {/* Header */}
      <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="url(#logo-gradient)"/>
              <defs>
                <linearGradient id="logo-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0077FF"/>
                  <stop offset="1" stopColor="#00A9FF"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xl font-bold text-white">Clandestine</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">Templates</a>
            <a href="#" className="hover:text-white transition-colors">Blog</a>
          </div>
          <div>
            <a href="#" className="text-sm font-medium px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors">Sign In</a>
          </div>
        </nav>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 container mx-auto px-4 py-24 sm:py-32 text-center">
        <div className="flex justify-center mb-8">
          <div className="hero-icon p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="#00A9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="#00A9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
          Skip the setup.<br/>Ship the product.
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400">
          You bring the idea — we'll run the stack. From signups to scale, StackPilot takes care of the boring stuff.
        </p>
        <div className="mt-10">
          <a href="#" className="inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-bold text-black bg-white rounded-lg shadow-lg hover:bg-slate-200 transition-colors">
            Launch Now
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </main>

      {/* Feature Cards */}
      <footer className="relative z-10 container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-left backdrop-blur-sm">
            <h3 className="font-bold text-white">Authentication</h3>
            <p className="text-sm text-slate-400 mt-2">Add user sign ups and logins.</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-left backdrop-blur-sm">
            <h3 className="font-bold text-white">Postgress Data base</h3>
            <p className="text-sm text-slate-400 mt-2">Every project is a full Postgres database, the world's most trusted relational database.</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-left backdrop-blur-sm">
            <h3 className="font-bold text-white">Edge functions</h3>
            <p className="text-sm text-slate-400 mt-2">Easily write custom code.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
