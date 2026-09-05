import { useState } from 'react';

export default function AIDashboard() {
  const [activeAnnotation, setActiveAnnotation] = useState(null);

  const annotations = [
    {
      id: 'accuracy',
      text: 'Improve accuracy and reduce errors',
      lineX1: '28%', lineY1: '25%',
      lineX2: '36%', lineY2: '25%',
      dotX: '36.5%', dotY: '25%',
    },
    {
      id: 'personalization',
      text: 'Personalizing the customer experience',
      lineX1: '28%', lineY1: '60%',
      lineX2: '38%', lineY2: '60%',
      dotX: '38.5%', dotY: '60%',
    },
    {
      id: 'automation',
      text: 'Automating routine tasks',
      lineX1: '72%', lineY1: '48%',
      lineX2: '61%', lineY2: '48%',
      dotX: '60.5%', dotY: '48%',
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b19] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Main Outer Container */}
      <div className="relative w-full max-w-[1100px] bg-white p-[10px] rounded-[3rem] shadow-[0_0_80px_rgba(29,78,216,0.15)] border border-blue-500/20 z-10 aspect-[1100/780] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="flex justify-between items-stretch h-[80px] w-full mb-[10px] select-none z-20">
          {/* Logo Tab */}
          <div className="relative bg-[#040815] rounded-[2rem] px-8 flex items-center justify-center border-b-[8px] border-r-[8px] border-white">
            <span className="text-white font-semibold text-xl tracking-wide font-sans">
              AI Panym
            </span>
            {/* Inverse border-radius corners for logo tab */}
            <div className="absolute bottom-[-8px] right-[-32px] w-[32px] h-[32px] bg-transparent rounded-tl-[2rem] shadow-[-12px_-12px_0_0_#fff] pointer-events-none"></div>
          </div>

          {/* Right Header Controls Group Tab */}
          <div className="relative bg-[#040815] rounded-[2rem] px-6 flex items-center gap-3 border-b-[8px] border-l-[8px] border-white">
            {/* Inverse border-radius corners for right controls tab */}
            <div className="absolute bottom-[-8px] left-[-32px] w-[32px] h-[32px] bg-transparent rounded-tr-[2rem] shadow-[12px_-12px_0_0_#fff] pointer-events-none"></div>
            
            {/* Shopping Bag Button */}
            <button className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 hover:scale-105 active:scale-95 transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>

            {/* Search Button */}
            <button className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 hover:scale-105 active:scale-95 transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Start Button */}
            <button className="h-12 px-6 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-2 text-slate-200 font-medium hover:text-white hover:border-slate-700 hover:scale-102 active:scale-98 transition-all duration-200">
              <svg className="w-4 h-4 text-slate-400 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Start</span>
            </button>
          </div>
        </div>

        {/* Main Display Grid */}
        <div className="flex-1 flex gap-[10px] min-h-0 relative select-none">
          
          {/* Main Visual Display (Left Panel) */}
          <div className="flex-1 bg-[#040815] rounded-[2.5rem] relative overflow-hidden flex flex-col justify-end p-8 md:p-12">
            
            {/* Visual Headset Background */}
            <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/vr_headset_glow.png')" }}>
              {/* Overlay shading to keep text readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040815] via-transparent to-[#040815]/20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#040815]/60 via-transparent to-[#040815]/60"></div>
            </div>

            {/* Title Text */}
            <div className="relative z-10 max-w-md space-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
                AI Assistant For<br />Your Business
              </h1>
            </div>

            {/* Interactive SVG Lines and Glow Dots */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {annotations.map((ann) => (
                <g key={ann.id} className={`transition-opacity duration-300 ${activeAnnotation && activeAnnotation !== ann.id ? 'opacity-30' : 'opacity-100'}`}>
                  {/* Glowing line shadow */}
                  <line
                    x1={ann.lineX1}
                    y1={ann.lineY1}
                    x2={ann.lineX2}
                    y2={ann.lineY2}
                    stroke="#00d2ff"
                    strokeWidth="3"
                    className="blur-[2px] opacity-40"
                  />
                  {/* Standard crisp line */}
                  <line
                    x1={ann.lineX1}
                    y1={ann.lineY1}
                    x2={ann.lineX2}
                    y2={ann.lineY2}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  {/* Glowing target dot */}
                  <circle
                    cx={ann.dotX}
                    cy={ann.dotY}
                    r="4"
                    fill="#00d2ff"
                  />
                  <circle
                    cx={ann.dotX}
                    cy={ann.dotY}
                    r="8"
                    fill="none"
                    stroke="#00d2ff"
                    strokeWidth="1.5"
                    className="animate-ping origin-center"
                    style={{ animationDuration: '3s' }}
                  />
                </g>
              ))}
            </svg>

            {/* Annotations Labels */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
              {/* Top-Left: Improve accuracy */}
              <div 
                className="absolute left-[5%] top-[20%] max-w-[200px] pointer-events-auto cursor-pointer group"
                onMouseEnter={() => setActiveAnnotation('accuracy')}
                onMouseLeave={() => setActiveAnnotation(null)}
              >
                <p className="text-sm font-light text-slate-300 group-hover:text-white group-hover:font-medium transition-all duration-200 leading-snug">
                  Improve accuracy and reduce errors
                </p>
              </div>

              {/* Bottom-Left: Personalizing customer experience */}
              <div 
                className="absolute left-[5%] top-[55%] max-w-[220px] pointer-events-auto cursor-pointer group"
                onMouseEnter={() => setActiveAnnotation('personalization')}
                onMouseLeave={() => setActiveAnnotation(null)}
              >
                <p className="text-sm font-light text-slate-300 group-hover:text-white group-hover:font-medium transition-all duration-200 leading-snug">
                  Personalizing the customer experience
                </p>
              </div>

              {/* Middle-Right: Automating routine tasks */}
              <div 
                className="absolute right-[31%] top-[43%] max-w-[180px] pointer-events-auto cursor-pointer group"
                onMouseEnter={() => setActiveAnnotation('automation')}
                onMouseLeave={() => setActiveAnnotation(null)}
              >
                <p className="text-sm font-light text-slate-300 group-hover:text-white group-hover:font-medium transition-all duration-200 leading-snug">
                  Automating routine tasks
                </p>
              </div>
            </div>
          </div>

          {/* Right Side Sidebar Grid */}
          <div className="w-[32%] flex flex-col gap-[10px] min-w-[240px] z-10">
            {/* Top-Right Panel (Shop Now) */}
            <div className="flex-1 bg-[#040815] rounded-[2.5rem] p-6 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Background spotlight */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <button className="px-8 py-3 rounded-full bg-white text-slate-950 font-semibold text-sm tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
                SHOP NOW
              </button>
            </div>

            {/* Bottom-Right Information Card & Navigation Controls */}
            <div className="relative bg-[#040815] rounded-[2.5rem] p-6 pt-8 pb-7 flex flex-col justify-between border-t-[8px] border-l-[8px] border-white">
              
              {/* Inverse border-radius corners for bottom-right panel */}
              <div className="absolute top-[-8px] left-[-32px] w-[32px] h-[32px] bg-transparent rounded-br-[2rem] shadow-[12px_12px_0_0_#fff] pointer-events-none"></div>

              {/* Left-Right Arrow Buttons Tab Cutout Container */}
              <div className="absolute top-[-8px] right-0 bg-[#040815] rounded-[2rem] border-b-[8px] border-l-[8px] border-white p-2.5 flex gap-2">
                {/* Inverse corners for the arrows tab */}
                <div className="absolute bottom-[-8px] left-[-32px] w-[32px] h-[32px] bg-transparent rounded-tr-[2rem] shadow-[12px_-12px_0_0_#fff] pointer-events-none"></div>
                <div className="absolute top-0 left-[-32px] w-[32px] h-[32px] bg-transparent rounded-tr-[2rem] shadow-[12px_-12px_0_0_#fff] pointer-events-none"></div>
                
                {/* Left Arrow Button */}
                <button className="w-10 h-10 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-900 active:scale-90 transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right Arrow Button */}
                <button className="w-10 h-10 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-900 active:scale-90 transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Content text */}
              <div className="space-y-4 pt-4 select-text">
                <span className="inline-block px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold">
                  Artificial intelligence
                </span>
                <p className="text-slate-300 text-sm leading-relaxed font-sans">
                  is your reliable assistant in task automation, data analysis, and decision-making.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
