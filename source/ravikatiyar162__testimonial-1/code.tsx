import React, { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for typing animation effect
 * @param text - The text to animate
 * @param speed - Typing speed in milliseconds (default: 50)
 * @returns Object with displayedText, isTyping, and reset function
 */
const useTypingAnimation = (text: string, speed: number = 50) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const resetAnimation = useCallback(() => {
    setDisplayedText('');
    setIsTyping(true);
  }, []);

  useEffect(() => {
    resetAnimation();
    
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed, resetAnimation]);

  return { displayedText, isTyping, resetAnimation };
};

/**
 * Custom hook for auto-cycling through items
 * @param itemsLength - Number of items to cycle through
 * @param delay - Delay between cycles in milliseconds
 * @param isTypingComplete - Whether typing animation is complete
 * @returns Object with currentIndex and manual control functions
 */
const useAutoCycle = (itemsLength: number, delay: number = 2000, isTypingComplete: boolean = true) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextItem = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % itemsLength);
  }, [itemsLength]);

  const goToItem = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, itemsLength - 1)));
  }, [itemsLength]);

  useEffect(() => {
    if (!isTypingComplete) return;

    const timer = setTimeout(nextItem, delay);
    return () => clearTimeout(timer);
  }, [currentIndex, delay, isTypingComplete, nextItem]);

  return { currentIndex, nextItem, goToItem };
};

interface Testimonial {
  name: string;
  title: string;
  avatar: string;
  text: string;
}

interface TestimonialCardProps {
  /** Array of testimonials to display */
  testimonials?: Testimonial[];
  /** Typing animation speed in milliseconds */
  typingSpeed?: number;
  /** Auto-cycle delay in milliseconds */
  cycleDelay?: number;
  /** Whether to auto-cycle through testimonials */
  autoPlay?: boolean;
  /** Custom CSS classes for the container */
  className?: string;
  /** Theme variant override */
  variant?: 'auto' | 'light' | 'dark';
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: "Victor",
    title: "Design Engineer, Co-Founder of IndieSpark",
    avatar: "https://i.pravatar.cc/200?img=3",
    text: "Sprrrint's interface is incredibly smooth and intuitive. Every component feels polished and the platform is evolving beautifully."
  },
  {
    name: "Sarah Chen",
    title: "Senior Product Manager at TechFlow",
    avatar: "https://i.pravatar.cc/200?img=5",
    text: "The attention to detail is remarkable. Everything works seamlessly together and the user experience feels truly polished."
  },
  {
    name: "Michael Rodriguez",
    title: "Creative Director at PixelCraft Studios",
    avatar: "https://i.pravatar.cc/200?img=7",
    text: "This tool stands out among countless design platforms. The workflow is smooth and it's become essential to our process."
  },
  {
    name: "Emma Thompson",
    title: "UX Researcher at InnovateLab",
    avatar: "https://i.pravatar.cc/200?img=9",
    text: "The user-centered approach is evident in every feature. Our team adopted it quickly with substantial productivity gains."
  }
];

/**
 * TestimonialCard Component
 * 
 * A responsive testimonial card with auto-theming, typing animation, and auto-cycling.
 * Follows modern React patterns and is optimized for component registries.
 * 
 * @example
 * ```jsx
 * <TestimonialCard 
 *   testimonials={myTestimonials}
 *   typingSpeed={30}
 *   autoPlay={true}
 * />
 * ```
 */
const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonials = DEFAULT_TESTIMONIALS,
  typingSpeed = 50,
  cycleDelay = 2000,
  autoPlay = true,
  className = '',
  variant = 'auto'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const currentTestimonial = testimonials[currentIndex] || testimonials[0];

  // Typing effect
  useEffect(() => {
    const currentText = currentTestimonial.text;
    setDisplayedText('');
    setIsTyping(true);
    
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < currentText.length) {
        setDisplayedText(currentText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [currentIndex, typingSpeed, currentTestimonial.text]);

  // Auto change testimonial after typing completes and specified delay
  useEffect(() => {
    if (!isTyping && autoPlay) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, cycleDelay);

      return () => clearTimeout(timer);
    }
  }, [isTyping, cycleDelay, autoPlay, testimonials.length]);

  // Theme classes based on variant
  const getThemeClasses = () => {
    switch (variant) {
      case 'light':
        return 'bg-gray-50';
      case 'dark':
        return 'bg-gray-900';
      default:
        return 'bg-gray-50 dark:bg-gray-900';
    }
  };

  const getCardThemeClasses = () => {
    switch (variant) {
      case 'light':
        return 'bg-white border-gray-200';
      case 'dark':
        return 'bg-gray-800 border-gray-700';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 w-full transition-colors duration-500 ${getThemeClasses()} ${className}`}>

      {/* Testimonial Card */}
      <div className={`max-w-lg w-full mx-auto transition-all duration-500 ${getCardThemeClasses()} rounded-3xl border shadow-2xl overflow-hidden`}>
        
        {/* Subtle Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6">
          
          {/* Header with Avatar */}
          <div className="flex items-center mb-6">
            <div className="relative">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-white shadow-lg">
                <img 
                  src={currentTestimonial.avatar} 
                  alt={`${currentTestimonial.name} avatar`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Name and Title */}
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-bold transition-colors duration-300 text-gray-900 dark:text-white">
                {currentTestimonial.name}
              </h3>
              <p className="text-sm transition-colors duration-300 text-gray-600 dark:text-gray-300">
                {currentTestimonial.title}
              </p>
            </div>
          </div>

          {/* Testimonial Text with Typing Effect */}
          <div className="relative">
            <blockquote className="text-sm leading-relaxed transition-colors duration-300 min-h-[80px] text-gray-700 dark:text-gray-200">
              <span className="text-2xl leading-none text-gray-300 dark:text-gray-600" aria-hidden="true">"</span>
              <span className="ml-1">
                {displayedText}
                {isTyping && (
                  <span 
                    className="inline-block w-0.5 h-4 ml-1 animate-pulse bg-blue-500 dark:bg-blue-400"
                    aria-hidden="true"
                  />
                )}
              </span>
            </blockquote>
          </div>

          {/* Animated Quote Marks */}
          <div className="absolute top-4 right-4 opacity-20" aria-hidden="true">
            <svg className="w-6 h-6 transition-colors duration-300 text-gray-300 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>
        </div>

        {/* Subtle Border */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none">
          <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-gray-200/30 via-gray-100/30 to-gray-200/30 dark:from-gray-700/10 dark:via-gray-600/10 dark:to-gray-700/10"></div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;