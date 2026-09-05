'use client';
import { useState } from 'react';

export const HeroGradientSearch = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="">
      <header className="py-4 bg-black sm:py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="shrink-0">
              <a href="#" className="flex">
                <img className="w-auto h-9" src="https://landingfoliocom.imgix.net/store/collection/dusk/images/logo.svg" alt="Brand" />
              </a>
            </div>

            <div className="flex md:hidden">
              <button type="button" className="text-white" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
                {expanded ? (
                  <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            <nav className="hidden ml-10 mr-auto space-x-10 lg:ml-20 lg:space-x-12 md:flex md:items-center md:justify-start">
              {['Products', 'Features', 'Pricing', 'Support'].map((text) => (
                <a key={text} href="#" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white">{text}</a>
              ))}
            </nav>

            <div className="relative hidden md:inline-flex md:items-center">
              <div className="absolute rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-200"></div>
              <a href="#" className="relative inline-flex items-center justify-center px-6 py-2 text-base font-normal text-white bg-black border border-transparent rounded-full">Begin Free Trial</a>
            </div>
          </div>

          {expanded && (
            <nav className="flex flex-col pt-8 pb-4 space-y-6 md:hidden">
              {['Products', 'Features', 'Pricing', 'Support'].map((text) => (
                <a key={text} href="#" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white">{text}</a>
              ))}
              <div className="relative inline-flex items-center justify-center group">
                <div className="absolute rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-200"></div>
                <a href="#" className="relative inline-flex items-center justify-center w-full px-6 py-2 text-base font-normal text-white bg-black border border-transparent rounded-full">Begin Free Trial</a>
              </div>
            </nav>
          )}
        </div>
      </header>

      <section className="relative py-12 overflow-hidden bg-black sm:pb-16 lg:pb-20 xl:pb-24">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-y-12 lg:grid-cols-2 gap-x-16">
            <div>
              <h1 className="text-4xl font-normal text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                Match Developers to Real Opportunities
              </h1>
              <p className="mt-4 text-lg font-normal text-gray-400 sm:mt-8">
                Search, connect, and find top tech roles. Optimized for startups and teams hiring globally.
              </p>

              <form className="relative mt-8 rounded-full sm:mt-12">
                <div className="relative">
                  <div className="absolute rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500"></div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-6">
                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="Try Java Developer, React Dev etc."
                      className="block w-full py-4 pr-6 text-white placeholder-gray-500 bg-black border border-transparent rounded-full pl-14 sm:py-5 focus:border-transparent focus:ring-0"
                    />
                  </div>
                </div>
                <div className="sm:absolute flex sm:right-1.5 sm:inset-y-1.5 mt-4 sm:mt-0">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center w-full px-5 py-5 text-sm font-semibold tracking-widest text-black uppercase bg-white rounded-full sm:w-auto sm:py-3 hover:opacity-90"
                  >
                    Discover Talent
                  </button>
                </div>
              </form>

              <div className="mt-8 sm:mt-12">
                <p className="text-lg font-normal text-white">Trusted by over 50,000 users</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0">
                <svg className="blur-3xl opacity-70" style={{ filter: 'blur(64px)' }} width="444" height="536" viewBox="0 0 444 536" fill="none">
                  <path d="M225.9 112.7C344 64.6 389.3 -70.4 437.4 47.5C485.4 165.6 253.2 481.3 135.2 529.4C17.1 577.4 57.9 339.6 9.9 221.5C-38.1 103.5 107.8 160.7 225.9 112.7Z"
                    fill="url(#c)" />
                  <defs>
                    <linearGradient id="c" x1="82.7" y1="550.7" x2="-39.9" y2="118.9" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="absolute inset-0">
                <img className="object-cover w-full h-full opacity-50" src="https://landingfoliocom.imgix.net/store/collection/dusk/images/noise.png" alt="" />
              </div>
              <img className="relative w-full max-w-md mx-auto" src="https://landingfoliocom.imgix.net/store/collection/dusk/images/hero/2/illustration.png" alt="Illustration" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
