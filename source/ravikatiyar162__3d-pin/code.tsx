import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Helper function to combine class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// PinPerspective Component: Renders the glowing pin and animated background circles
const PinPerspective = ({ title, href }) => {
  return (
    // This container holds all the perspective elements. It becomes visible on hover.
    <motion.div className="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center opacity-0 transition-opacity duration-500 group-hover/pin:opacity-100 z-10">
      <div className="inset-0 -mt-7 h-full w-full flex-none">
        {/* The title link that appears above the pin. Changed from <a> to <div> to prevent nesting error. */}
        <div className="absolute top-0 flex w-full justify-center">
          <div
            className="relative z-20 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 text-xs font-bold text-white ring-1 ring-white/10"
          >
            <span>{title}</span>
          </div>
        </div>

        {/* This div creates the 3D perspective effect for the elements inside */}
        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
        >
          <>
            {/* Three motion divs for the expanding circle animations */}
            {[0, 2, 4].map((delay) => (
              <motion.div
                key={delay}
                initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
                animate={{
                  opacity: [0, 1, 0.5, 0],
                  scale: 1,
                  z: 0,
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: delay,
                  ease: "linear",
                }}
                className="absolute left-1/2 top-1/2 h-40 w-40 md:h-[11.25rem] md:w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
              ></motion.div>
            ))}
          </>
        </div>

        {/* The glowing pin element at the center */}
        <>
          <motion.div className="absolute bottom-1/2 right-1/2 h-20 w-px translate-y-[14px] bg-gradient-to-b from-transparent to-cyan-500 blur-[2px] group-hover/pin:h-40" />
          <motion.div className="absolute bottom-1/2 right-1/2 h-20 w-px translate-y-[14px] bg-gradient-to-b from-transparent to-cyan-500 group-hover/pin:h-40" />
          <motion.div className="absolute bottom-1/2 right-1/2 z-20 h-[4px] w-[4px] translate-x-[1.5px] translate-y-[14px] rounded-full bg-cyan-600 blur-[3px]" />
          <motion.div className="absolute bottom-1/2 right-1/2 z-20 h-[2px] w-[2px] translate-x-[0.5px] translate-y-[14px] rounded-full bg-cyan-300" />
        </>
      </div>
    </motion.div>
  );
};

// PinContainer Component: The main container for the 3D pin effect
export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}) => {
  const [transform, setTransform] = useState("translate(-50%,-50%) rotateX(0deg)");

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateX(40deg) scale(0.9)");
  };
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
  };

  return (
    // The main link container with mouse enter/leave events to trigger the animation
    <a
      className={cn(
        "group/pin relative z-20 cursor-pointer",
        containerClassName
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      href={href || "/"}
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* This div creates the 3D perspective for the main content card */}
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        {/* The content card that animates on hover */}
        <div
          style={{
            transform: transform,
          }}
          className="absolute left-1/2 top-1/2 flex items-start justify-start overflow-hidden rounded-2xl border border-white/[0.1] bg-black p-4 shadow-[0_8px_16px_rgb(0_0_0/0.4)] transition-transform duration-700 ease-in-out group-hover/pin:border-white/[0.2]"
        >
          <div className={cn("relative z-20", className)}>{children}</div>
        </div>
      </div>
      {/* The perspective pin and title component */}
      <PinPerspective title={title} href={href} />
    </a>
  );
};


// Main App component to showcase the PinContainer
export default function App() {
  return (
    <>
      {/* Injecting keyframes and animation class directly for self-contained demo */}
      <style>
        {`
          @keyframes move-grid {
            from {
              background-position: 0 0;
            }
            to {
              background-position: 24px 24px;
            }
          }
          .animate-grid {
            animation: move-grid 2s linear infinite;
          }
        `}
      </style>
      <div className="bg-slate-950 min-h-screen w-full py-20 px-4 relative overflow-hidden">
        {/* Animated Grid Background with ~10% opacity */}
        <div className="absolute top-0 left-0 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#8080801A_1px,transparent_1px),linear-gradient(to_bottom,#8080801A_1px,transparent_1px)] bg-[size:24px_24px] animate-grid z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-4">
            Responsive 3D Pin
          </h1>
          <p className="text-center text-slate-400 max-w-2xl mx-auto mb-12 md:mb-20">
            Hover over the card to see the 3D pin animation.
          </p>
          
          {/* Container to center the single card */}
          <div className="h-[25rem] sm:h-[28rem] flex items-center justify-center">
            <PinContainer
              title="Google.com"
              href="https://google.com"
            >
              <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[18rem] h-[22rem] sm:w-[20rem] sm:h-[25rem]">
                <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                  Google
                </h3>
                <div className="text-base !m-0 !p-0 font-normal">
                  <span className="text-slate-500">
                    A search engine that needs no introduction. Explore the world's information.
                  </span>
                </div>
                 <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500">
                   <img 
                      src="https://placehold.co/600x400/000000/FFFFFF?text=Google" 
                      alt="Image for Google"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => e.target.src='https://placehold.co/600x400/DB2777/FFFFFF?text=Error'}
                   />
                 </div>
              </div>
            </PinContainer>
          </div>
        </div>
      </div>
    </>
  );
}
