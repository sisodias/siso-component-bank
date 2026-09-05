import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";

interface FloatingConsultButtonProps {
  // Button appearance
  buttonSize?: number; // Diameter in pixels (default: 160 for lg, 128 for mobile)
  imageSize?: number; // Center image diameter in pixels (default: 96 for lg, 80 for mobile)
  imageSrc?: string;
  imageAlt?: string;
  
  // Revolving text
  revolvingText?: string;
  revolvingSpeed?: number; // Duration in seconds for one rotation (default: 10)
  
  // Popup content
  popupHeading?: string;
  popupDescription?: string;
  popupBadgeText?: string;
  ctaButtonText?: string;
  ctaButtonAction?: () => void;
  
  // Positioning
  position?: {
    bottom?: string;
    right?: string;
    left?: string;
    top?: string;
  };
}

export const FloatingConsultButton = ({
  buttonSize,
  imageSize,
  imageSrc = "/consultant-avatar.jpg",
  imageAlt = "Consultant",
  revolvingText = "FREE 30 MINUTES - CONSULT - ",
  revolvingSpeed = 10,
  popupHeading = "30-minutes call",
  popupDescription = "This will be a brief, free call with one of Bricks Studio's design and development producers to discuss your project and determine if we're a good fit.",
  popupBadgeText = "Free",
  ctaButtonText = "Book a call",
  ctaButtonAction = () => console.log("CTA clicked"),
  position = { bottom: "2rem", right: "2rem" },
}: FloatingConsultButtonProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Responsive sizes with defaults
  const lgButtonSize = buttonSize || 160;
  const smButtonSize = buttonSize ? buttonSize * 0.8 : 128;
  const lgImageSize = imageSize || 96;
  const smImageSize = imageSize ? imageSize * 0.833 : 80;

  return (
    <>
      {/* Backdrop with Blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-48 right-8 z-50 bg-white rounded-3xl shadow-2xl p-8 lg:p-10 max-w-md w-[calc(100vw-4rem)]"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 -right-2 text-white hover:text-gray-300 transition-colors"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="10" y1="10" x2="30" y2="30" />
                <line x1="30" y1="10" x2="10" y2="30" />
              </svg>
            </button>

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <h3 className="text-4xl lg:text-5xl font-bold text-black leading-tight">
                  {popupHeading}
                </h3>
                <span className="text-black px-4 py-2 border-2 border-black rounded-full text-sm font-medium">
                  {popupBadgeText}
                </span>
              </div>

              {/* Description */}
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                {popupDescription}
              </p>

              {/* CTA Button */}
              <Button 
                className="w-full bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-full font-medium text-base"
                onClick={ctaButtonAction}
              >
                {ctaButtonText}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div 
        className="fixed z-50"
        style={position}
      >
        <motion.div
          className="relative cursor-pointer group"
          style={{
            width: `${smButtonSize}px`,
            height: `${smButtonSize}px`,
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Rotating Text */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: revolvingSpeed,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
            >
              <defs>
                <path
                  id="circlePath"
                  d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                />
              </defs>
              <text className="text-[20.4px] fill-gray-600 font-medium uppercase tracking-wider">
                <textPath href="#circlePath" startOffset="0%">
                  {revolvingText}
                </textPath>
              </text>
            </svg>
          </motion.div>

          {/* Center Image/Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="rounded-full overflow-hidden bg-gray-900 shadow-lg group-hover:shadow-xl transition-shadow"
              style={{
                width: `${smImageSize}px`,
                height: `${smImageSize}px`,
              }}
            >
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-red-500 to-orange-500"></div>';
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
        
        {/* Responsive sizing for larger screens */}
        <style>{`
          @media (min-width: 1024px) {
            .relative.cursor-pointer.group {
              width: ${lgButtonSize}px !important;
              height: ${lgButtonSize}px !important;
            }
            .relative.cursor-pointer.group .rounded-full.overflow-hidden {
              width: ${lgImageSize}px !important;
              height: ${lgImageSize}px !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};