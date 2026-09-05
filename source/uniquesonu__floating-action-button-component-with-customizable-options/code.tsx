import { useState } from "react";

const FloatingActionButton = ({ 
  mainIcon = "+", 
  options = [
    { label: "A", onClick: () => console.log("Option A clicked") },
    { label: "B", onClick: () => console.log("Option B clicked") },
    { label: "C", onClick: () => console.log("Option C clicked") },
    { label: "D", onClick: () => console.log("Option D clicked") }
  ],
  size = "lg",
  position = "center"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFab = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    option.onClick();
    setIsOpen(false); // Close the FAB after clicking an option
  };

  // Size configurations
  const sizeConfig = {
    sm: { main: "w-12 h-12", option: "w-8 h-8", radius: 60, mainText: "text-lg", optionText: "text-xs" },
    md: { main: "w-16 h-16", option: "w-10 h-10", radius: 80, mainText: "text-xl", optionText: "text-sm" },
    lg: { main: "w-[70px] h-[70px]", option: "w-12 h-12", radius: 100, mainText: "text-2xl", optionText: "text-sm" }
  };

  const config = sizeConfig[size];

  // Position configurations
  const positionClasses = {
    center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    bottomRight: "bottom-8 right-8",
    bottomLeft: "bottom-8 left-8",
    topRight: "top-8 right-8",
    topLeft: "top-8 left-8"
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center font-sans">
      <div className={`fixed ${positionClasses[position]} ${config.main}`}>
        {/* Main FAB Button */}
        <button
          onClick={toggleFab}
          className={`
            ${config.main} rounded-full border-none cursor-pointer relative z-10
            bg-gradient-to-r from-pink-400 via-purple-500 to-green-400
            text-white ${config.mainText} font-semibold
            transition-all duration-300 ease-in-out
            hover:scale-110 shadow-lg hover:shadow-xl
            ${isOpen ? 'rotate-45' : 'rotate-0'}
            bg-[length:400%_400%] animate-pulse
            hover:animate-none hover:bg-[length:400%_400%]
          `}
          style={{
            backgroundImage: 'linear-gradient(45deg, #ff6ec4, #7873f5, #4ade80)',
            backgroundSize: '400% 400%',
            animation: isOpen ? 'none' : undefined
          }}
          onMouseEnter={(e) => {
            e.target.style.animation = 'gradientShift 4s ease infinite';
          }}
          onMouseLeave={(e) => {
            if (!isOpen) e.target.style.animation = '';
          }}
        >
          {mainIcon}
        </button>

        {/* Option Buttons */}
        <div className={`absolute top-0 left-0 ${config.main} pointer-events-none`}>
          {options.map((option, index) => {
            const angle = (index * 360 / options.length) * (Math.PI / 180);
            const radius = config.radius;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`
                  absolute ${config.option} rounded-full border-none
                  bg-gradient-to-r from-pink-400 to-green-400
                  text-white ${config.optionText} font-medium
                  transition-all duration-400 ease-in-out
                  hover:scale-125 shadow-md hover:shadow-lg
                  ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                style={{
                  transform: isOpen 
                    ? `translate(${x}px, ${y}px)` 
                    : 'translate(0px, 0px)',
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
</div>
  );
};

export default FloatingActionButton;