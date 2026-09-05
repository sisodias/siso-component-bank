import React from 'react';
import { ArrowRight, Sparkles, Lightbulb, Rocket, Repeat, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: <Lightbulb className="w-7 h-7" />, color: 'from-yellow-400 to-orange-400',
    title: 'Idea Validation',
    desc: 'Workshops & prototyping to shape your vision.'
  },
  {
    icon: <Rocket className="w-7 h-7" />, color: 'from-blue-500 to-purple-500',
    title: 'MVP Development',
    desc: 'Rapid, reliable product builds—web, mobile, AI.'
  },
  {
    icon: <Repeat className="w-7 h-7" />, color: 'from-green-500 to-blue-400',
    title: 'Launch & Iterate',
    desc: 'Go live, get feedback, and improve fast.'
  },
  {
    icon: <BarChart3 className="w-7 h-7" />, color: 'from-pink-500 to-purple-500',
    title: 'Scale with AI & Data',
    desc: 'Unlock growth with advanced tech.'
  },
];

const floatingPositions = [
  'top-20 left-1/4 animate-float-slow',
  'top-20 right-1/4 animate-float-medium',
  'bottom-20 left-1/4 animate-float-medium-reverse',
  'bottom-20 right-1/4 animate-float-slow-reverse',
];

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      </div>

      {/* Floating cards at corners (desktop only) */}
      <div className="absolute inset-0 z-20 pointer-events-none md:block hidden">
        {steps.map((step, idx) => (
          <div
            key={step.title}
            className={`${floatingPositions[idx]} absolute w-56 max-w-[80vw] p-4 bg-white/90 border border-black/10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex-col items-start gap-3 backdrop-blur-lg cursor-pointer group pointer-events-auto`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${step.color} text-white shadow-lg mb-2 group-hover:scale-105 transition-transform duration-300`}>{step.icon}</div>
            <h3 className="font-semibold text-base mb-1 tracking-tight">{step.title}</h3>
            <p className="text-gray-600 text-sm leading-snug">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Main content container */}
      <div className="relative z-30 w-full flex flex-col items-center">
        {/* Centered main content */}
        <div className="flex flex-col items-center justify-center text-center max-w-5xl px-4 py-12 md:py-0 w-full">
          <div className="inline-flex items-center px-5 py-2.5 mb-6 bg-gradient-to-r from-black/5 to-black/10 backdrop-blur-sm text-black text-base font-medium rounded-full border border-black/10 hover:border-black/20 transition-all duration-300 group">
            <Sparkles className="w-5 h-5 mr-2.5 group-hover:animate-pulse" />
            Startup MVPs, Built to Launch
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 text-gray-950">
            From Idea to MVP—<span className="block mt-3 bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent animate-gradient">We Build Startups That Launch</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed mb-8">
            We partner with founders to turn bold ideas into real products. Our team rapidly develops MVPs, web & mobile apps, and AI-powered solutions—so you can launch, learn, and grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 pt-2 w-full justify-center">
            <button className="group px-8 py-3 bg-black text-white text-base font-normal tracking-wide uppercase hover:bg-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              <span className="flex items-center">
                Get Started
                <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="group px-8 py-3 bg-transparent text-black text-base font-normal tracking-wide uppercase border border-black hover:bg-black hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              <span>See Our Work</span>
            </button>
          </div>
        </div>

        {/* Mobile: show cards as direct stack after content */}
        <div className="w-full flex flex-col space-y-4 px-4 pb-12 md:hidden z-20">
          {steps.map((step) => (
            <div key={step.title} className="w-full p-4 bg-white/90 border border-black/10 rounded-2xl shadow-lg flex flex-row items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${step.color} text-white shadow mb-1 flex-shrink-0`}>{step.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-0.5 tracking-tight">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-snug">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animations for floating cards */}
      <style>{`
        @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
        @keyframes float-medium { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(14px); } }
        @keyframes float-slow-reverse { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(18px); } }
        @keyframes float-medium-reverse { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        .animate-float-slow { animation: float-slow 5s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
        .animate-float-slow-reverse { animation: float-slow-reverse 5s ease-in-out infinite; }
        .animate-float-medium-reverse { animation: float-medium-reverse 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Hero;