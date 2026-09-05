import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';

const ModernCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slideRef = useRef(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef();

  const slideData = [
    {
      title: "Mystic Mountains",
      subtitle: "Journey Through Peaks",
      button: "Explore Now",
      src: "https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gradient: "from-purple-900/80 via-blue-900/40 to-transparent"
    },
    {
      title: "Urban Dreams",
      subtitle: "City Life Reimagined",
      button: "Discover More",
      src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gradient: "from-orange-900/80 via-red-900/40 to-transparent"
    },
    {
      title: "Neon Nights",
      subtitle: "Electric Adventures",
      button: "Experience",
      src: "https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gradient: "from-cyan-900/80 via-teal-900/40 to-transparent"
    },
    {
      title: "Desert Whispers",
      subtitle: "Endless Horizons",
      button: "Begin Journey",
      src: "https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gradient: "from-amber-900/80 via-orange-900/40 to-transparent"
    },
  ];

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--mouse-x", `${x}px`);
      slideRef.current.style.setProperty("--mouse-y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event) => {
    if (!slideRef.current) return;
    const rect = slideRef.current.getBoundingClientRect();
    xRef.current = (event.clientX - rect.left - rect.width / 2) * 0.1;
    yRef.current = (event.clientY - rect.top - rect.height / 2) * 0.1;
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const goToPrevious = () => {
    setCurrent(current === 0 ? slideData.length - 1 : current - 1);
  };

  const goToNext = () => {
    setCurrent(current === slideData.length - 1 ? 0 : current + 1);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        goToNext();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [current, isHovered]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4 w-full">
      <div className="relative w-full max-w-6xl mx-auto">
        {/* Main Carousel Container */}
        <div 
          className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl bg-black"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            handleMouseLeave();
          }}
          onMouseMove={handleMouseMove}
          ref={slideRef}
        >
          {/* Background Images */}
          <div className="absolute inset-0">
            {slideData.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                style={{
                  transform: index === current 
                    ? `translate3d(calc(var(--mouse-x, 0px)), calc(var(--mouse-y, 0px)), 0) scale(1.05)` 
                    : 'scale(1.1)'
                }}
              >
                <img
                  src={slide.src}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
              </div>
            ))}
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-between">
            {/* Left Content */}
            <div className="flex-1 p-12 lg:p-16">
              <div className="max-w-xl">
                {slideData.map((slide, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-700 ease-out ${
                      index === current 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-8'
                    }`}
                  >
                    {index === current && (
                      <>
                        <div className="mb-4">
                          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 border border-white/20">
                            Featured Experience
                          </span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                          {slide.title}
                        </h1>
                        <p className="text-xl lg:text-2xl text-white/80 mb-8 font-light">
                          {slide.subtitle}
                        </p>
                        <div className="flex items-center gap-4">
                          <button className="group relative px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                            <span className="flex items-center gap-2">
                              <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              {slide.button}
                            </span>
                          </button>
                          <button className="px-8 py-4 border-2 border-white/30 text-white rounded-2xl font-semibold text-lg backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                            Learn More
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Progress Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-3">
              {slideData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="group relative"
                >
                  <div className={`w-12 h-2 rounded-full transition-all duration-500 ${
                    index === current 
                      ? 'bg-white shadow-lg' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`} />
                  {index === current && (
                    <div className="absolute inset-0 w-12 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Slide Counter */}
          <div className="absolute top-8 right-8">
            <div className="px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-white font-medium">
                {String(current + 1).padStart(2, '0')} / {String(slideData.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex justify-center mt-8 gap-4">
          {slideData.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`group relative w-20 h-12 rounded-lg overflow-hidden transition-all duration-300 ${
                index === current 
                  ? 'ring-2 ring-white scale-110' 
                  : 'hover:scale-105 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={slide.src}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all ${
                index === current ? 'bg-black/20' : ''
              }`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernCarousel;