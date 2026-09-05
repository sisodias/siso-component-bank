import React, { useState } from 'react';

const menuItems = ['Home', 'About', 'Services', 'Team', 'Portfolio', 'Contact'];

export default function NavMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="absolute bg-[#fafafa] inset-0 w-full">
      {/* Mobile menu toggle button - only visible on small screens */}
      <button 
        onClick={toggleMenu}
        className="md:hidden absolute top-6 right-6 z-20 p-2"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        <div className={`w-6 h-0.5 bg-[#262626] mb-1.5 transition-transform duration-300 ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></div>
        <div className={`w-6 h-0.5 bg-[#262626] mb-1.5 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
        <div className={`w-6 h-0.5 bg-[#262626] transition-transform duration-300 ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></div>
      </button>
      
      {/* Menu container - adapts to screen size */}
      <div className={`
        flex items-center justify-center w-full h-full
        md:block md:h-auto md:pt-8
        ${isMenuOpen ? 'block' : 'hidden md:block'}
      `}>
        <ul className={`
          flex flex-col items-center space-y-6
          md:flex-row md:space-y-0 md:space-x-4 md:justify-center
          lg:space-x-8
        `}>
          {menuItems.map((item) => (
            <li key={item} className="list-none">
              <a 
                href="#" 
                className="relative inline-block group"
                onClick={() => setIsMenuOpen(false)}
              >
                {/* Link text */}
                <span className="
                  relative z-10 block uppercase text-[#262626] 
                  font-sans font-semibold transition-colors duration-300 
                  group-hover:text-white
                  text-xl py-2 px-3
                  md:text-base md:py-2 md:px-3
                  lg:text-lg lg:py-2 lg:px-4
                ">
                  {item}
                </span>
                {/* Top & bottom border animation */}
                <span className="
                  absolute inset-0 border-t-2 border-b-2 border-[#262626]
                  transform scale-y-[2] opacity-0 
                  transition-all duration-300 origin-center
                  group-hover:scale-y-100 group-hover:opacity-100
                " />
                {/* Background fill animation */}
                <span className="
                  absolute top-[2px] left-0 w-full h-full bg-[#262626]
                  transform scale-0 opacity-0
                  transition-all duration-300 origin-top
                  group-hover:scale-100 group-hover:opacity-100
                " />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}