import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  secondaryText?: string;
  buttonText?: string;
}

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionHeight = useRef<number>(0);
  
  const [activeSection, setActiveSection] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  
  const totalSections = 3;
  
  const columnsPerSection = 11;
  
  const totalProgressSteps = totalSections * columnsPerSection;
  
  const progressIncrement = 0.2;
  
  const features: FeatureItem[] = [
    {
      id: "01",
      title: "Solutions",
      description: "Tailored solutions designed and thought out to meet your security needs and perfectly adapt to your organization, regardless of its size."
    },
    {
      id: "02",
      title: "Centralized platform",
      description: "We created the Hub by NEVERHACK, a unique platform to facilitate your purchases, centralize your cyber tools, train your employees, or protect your data. One platform for all your solutions.",
      secondaryText: "Create your organization and invite your collaborators for free.",
      buttonText: "Discover the Hub"
    },
    {
      id: "03",
      title: "Expertises",
      description: "Our highly qualified and certified experts ensure the highest security standards to meet all your specific needs. Join our team for concrete and varied missions with high added value."
    }
  ];

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const animationRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  
  const springConfig = { damping: 25, stiffness: 120 };
  const mouseXSpring = useSpring(0.5, springConfig);
  const mouseYSpring = useSpring(0.5, springConfig);
  
  const colorSpringConfig = { damping: 12, stiffness: 20, mass: 3.5, restDelta: 0.01 };
  const primaryHue = useSpring(0, colorSpringConfig);
  const secondaryHue = useSpring(60, colorSpringConfig);
  
  useEffect(() => {
    primaryHue.set(activeSection * 120);
    secondaryHue.set(activeSection * 120 + 60);
  }, [activeSection, primaryHue, secondaryHue]);
  
  const gradientX = useTransform(mouseXSpring, [0, 1], ['0%', '100%']);
  const gradientY = useTransform(mouseYSpring, [0, 1], ['0%', '100%']);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      mouseXSpring.set(x);
      mouseYSpring.set(y);
      setMousePosition({ x, y });
    }
  }, [mouseXSpring, mouseYSpring]);
  
  useEffect(() => {
    const sectionInfluenceWeight = 0.3;
    
    const sectionX = 0.5 + (activeSection * 0.2 - 0.2);
    const sectionY = 0.5 + (activeSection * 0.15 - 0.15);
    
    const blendedX = mousePosition.x * (1 - sectionInfluenceWeight) + sectionX * sectionInfluenceWeight;
    const blendedY = mousePosition.y * (1 - sectionInfluenceWeight) + sectionY * sectionInfluenceWeight;
    
    mouseXSpring.set(blendedX);
    mouseYSpring.set(blendedY);
  }, [activeSection, mouseXSpring, mouseYSpring, mousePosition]);

  useEffect(() => {
    sectionHeight.current = window.innerHeight;
    
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    }
    
    const handleResize = () => {
      sectionHeight.current = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, [isLocked]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (hasScrolledToEnd && containerRef.current && e.deltaY < 0) {
      if (window.scrollY <= 10) {
        e.preventDefault();
        
        setHasScrolledToEnd(false);
        setIsLocked(true);
        document.body.style.overflow = 'hidden';
        
        setActiveSection(totalSections - 1);
        setProgressValue(totalSections);
        return;
      }
      return;
    }
    
    if (!containerRef.current || hasScrolledToEnd) return;
    
    e.preventDefault();
    
    const direction = e.deltaY > 0 ? 1 : -1;
    
    const newProgressValue = Math.max(
      0, 
      Math.min(
        totalSections, 
        progressValue + (direction * progressIncrement / columnsPerSection)
      )
    );
    
    setProgressValue(newProgressValue);
    
    const calculatedSection = Math.min(
      totalSections - 1, 
      Math.floor(newProgressValue)
    );
    
    if (calculatedSection !== activeSection) {
      setActiveSection(calculatedSection);
    }
    
    if (calculatedSection === totalSections - 1 && newProgressValue >= totalSections) {
      setHasScrolledToEnd(true);
      setIsLocked(false);
      document.body.style.overflow = '';
    }
    
    console.log('Progress:', newProgressValue, 'Section:', calculatedSection);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (hasScrolledToEnd && (e.key === 'ArrowUp' || e.key === 'PageUp')) {
      e.preventDefault();
      setActiveSection(totalSections - 1);
      return;
    }
    
    if (hasScrolledToEnd) return;
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      
      const newProgressValue = Math.min(
        totalSections,
        progressValue + (progressIncrement / columnsPerSection)
      );
      
      setProgressValue(newProgressValue);
      
      const calculatedSection = Math.min(
        totalSections - 1, 
        Math.floor(newProgressValue)
      );
      
      if (calculatedSection !== activeSection) {
        setActiveSection(calculatedSection);
      }
      
      if (calculatedSection === totalSections - 1 && newProgressValue >= totalSections) {
        setHasScrolledToEnd(true);
        setIsLocked(false);
        document.body.style.overflow = '';
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      
      const newProgressValue = Math.max(
        0,
        progressValue - (progressIncrement / columnsPerSection)
      );
      
      setProgressValue(newProgressValue);
      
      const calculatedSection = Math.floor(newProgressValue);
      
      if (calculatedSection !== activeSection) {
        setActiveSection(calculatedSection);
      }
    }
  };
  
  const updateProgressValue = (section: number) => {
    setProgressValue(section);
  };
  
  const renderProgressIndicator = (sectionIndex: number) => {
    const isActive = activeSection === sectionIndex;
    const dotCount = 44;
    const rows = 2;
    const dotsPerRow = Math.ceil(dotCount / rows);
    
    let sectionProgress = 0;
    if (sectionIndex < Math.floor(progressValue)) {
      sectionProgress = 1;
    } else if (sectionIndex === Math.floor(progressValue)) {
      sectionProgress = progressValue - Math.floor(progressValue);
    }
    
    const totalFilledDots = Math.round(dotCount * sectionProgress);
    
    return (
      <div key={`progress-indicator-${sectionIndex}`} className="flex items-center">
        <span className={`text-[22px] font-extralight mr-3 ${isActive ? 'text-white/90' : 'text-white/40'}`}>
          {features[sectionIndex].id}
        </span>
        <div className="flex flex-col gap-[3px]">
          {Array.from({ length: rows }).map((_, rowIndex) => {
            return (
              <div key={`row-${sectionIndex}-${rowIndex}`} className="flex gap-[3px]">
                {Array.from({ length: dotsPerRow }).map((_, dotIndex) => {
                  const dotNumber = rowIndex * dotsPerRow + dotIndex;
                  if (dotNumber >= dotCount) return null;
                  
                  const columnsToFill = Math.ceil(totalFilledDots / rows);
                  const isFilledDot = dotIndex < columnsToFill;
                  
                  return (
                    <div 
                      key={`dot-${sectionIndex}-${rowIndex}-${dotIndex}`}
                      className={`w-[3px] h-[3px] ${
                        isFilledDot ? 'bg-white/90' : 'bg-white/20'
                      }`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSectionClick = (sectionIndex: number) => {
    if (sectionIndex === 0 || progressValue >= sectionIndex) {
      setActiveSection(sectionIndex);
      setProgressValue(sectionIndex);
    }
  };

  useEffect(() => {
    if (!hasScrolledToEnd) return;

    const handlePageScroll = () => {
      if (window.scrollY < window.innerHeight) {
        document.body.style.overflow = '';
      }
    };

    window.addEventListener('scroll', handlePageScroll);
    return () => {
      window.removeEventListener('scroll', handlePageScroll);
    };
  }, [hasScrolledToEnd]);
  
  const reEngageWithFeatures = () => {
    if (hasScrolledToEnd) {
      setActiveSection(totalSections - 1);
      setProgressValue(totalSections);
      setHasScrolledToEnd(false);
      setIsLocked(true);
      document.body.style.overflow = 'hidden';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full">
      <div 
        className={`relative w-full bg-black ${isLocked ? 'overflow-hidden' : 'overflow-visible'}`} 
        style={{ height: "100vh" }}
      >
        <div 
          ref={containerRef}
          className="w-full h-screen focus:outline-none"
          tabIndex={0}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          onMouseMove={handleMouseMove}
        >
          <div ref={contentRef} className="h-screen flex flex-col">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-95" />
              
              <motion.div
                className="absolute w-[200%] h-[200%] opacity-70 pointer-events-none"
                style={{
                  left: gradientX,
                  top: gradientY,
                  x: "-50%",
                  y: "-50%",
                  background: useTransform(
                    primaryHue,
                    (hue) => `radial-gradient(circle at center, 
                      hsl(${hue}, 100%, 70%) 0%, 
                      hsl(${hue + 40}, 100%, 50%) 20%, 
                      transparent 70%)`
                  ),
                  filter: "blur(100px)",
                  mixBlendMode: "screen"
                }}
              />
              
              <motion.div
                className="absolute w-[150%] h-[150%] opacity-50 pointer-events-none"
                style={{
                  left: useTransform(mouseXSpring, [0, 1], ['10%', '90%']),
                  top: useTransform(mouseYSpring, [0, 1], ['10%', '90%']),
                  x: "-30%",
                  y: "-30%",
                  background: useTransform(
                    secondaryHue,
                    (hue) => `radial-gradient(circle at center, 
                      hsl(${hue}, 100%, 60%) 0%, 
                      transparent 60%)`
                  ),
                  filter: "blur(80px)",
                  mixBlendMode: "screen"
                }}
              />
              
              <motion.div
                className="absolute rounded-full w-[30%] h-[30%] pointer-events-none"
                style={{
                  left: gradientX,
                  top: gradientY,
                  x: "-50%",
                  y: "-50%",
                  background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, transparent 70%)',
                  filter: "blur(40px)",
                }}
              />
            </div>

            <div className="h-full w-full relative z-20 flex flex-col md:grid md:grid-cols-2 md:grid-rows-2">
              
              <div className="flex flex-col p-8 md:p-10 relative h-1/2 md:h-auto md:border-r md:border-b border-white/20">
                 {features.map((feature, index) => (
                    <div 
                      key={`content-mobile-desktop-${feature.id}`}
                      className={`absolute inset-0 flex flex-col p-8 md:p-10 transition-opacity duration-500 
                      ${ activeSection === index ? 'opacity-100' : 'opacity-0'}
                      ${ activeSection === index ? 'visible' : 'invisible'} 
                      `}
                      style={{ 
                        pointerEvents: activeSection === index ? 'auto' : 'none' 
                      }}
                    >
                      <div className="w-full flex justify-start md:justify-end md:items-end md:absolute md:bottom-10 md:right-10 md:p-0">
                         <h2 className="text-4xl md:text-6xl font-light text-white">
                          {feature.title}
                        </h2>
                      </div>

                      <div className="md:hidden flex flex-col mt-4">
                         <p className="text-lg text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                        {feature.secondaryText && (
                          <p className="text-sm text-white/50 mt-8 mb-4">
                            {feature.secondaryText}
                          </p>
                        )}
                        {feature.buttonText && (
                          <button className="px-6 py-3 mt-6 bg-white text-black text-sm font-medium rounded-md hover:bg-opacity-90 transition-all w-fit">
                            {feature.buttonText}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="md:border-b border-white/20 relative hidden md:block">
              </div>
              
              <div className="md:border-r border-white/20 relative hidden md:block">
              </div>
              
              <div className="p-8 relative hidden md:block">
                  {features.map((feature, index) => (
                    <div 
                      key={`description-desktop-${feature.id}`}
                      className={`absolute inset-0 p-10 flex flex-col transition-opacity duration-500 ${
                        activeSection === index ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ 
                        pointerEvents: activeSection === index ? 'auto' : 'none' 
                      }}
                    >
                      <p className="text-lg text-gray-300 max-w-md leading-relaxed">
                        {feature.description}
                      </p>
                      {feature.secondaryText && (
                        <p className="text-sm text-gray-400 mt-8 mb-4">
                          {feature.secondaryText}
                        </p>
                      )}
                      {feature.buttonText && (
                        <button className="px-6 py-3 mt-6 bg-white text-black text-sm font-medium rounded-md hover:bg-opacity-90 transition-all w-fit">
                          {feature.buttonText}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
            </div>

            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-8 md:gap-16 z-30">
              {features.map((_, index) => (
                <div 
                  key={`indicator-wrapper-${index}`}
                  onClick={() => handleSectionClick(index)}
                  className={`cursor-pointer ${index === 0 || progressValue >= index ? 'opacity-100' : 'opacity-50'}`}
                >
                  {renderProgressIndicator(index)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
        
      {hasScrolledToEnd && (
        <div className="bg-gradient-to-b from-black to-purple-900 min-h-screen w-full py-24 px-8">
            <h2 className="text-5xl md:text-7xl font-light mb-12 text-white">
              Thank you&lt;3<br></br><span className="text-white/50"> @Erik</span>
            </h2>
        </div>
      )}
    </div>
  );
}