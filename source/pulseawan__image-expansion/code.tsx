import React, { useState, useRef, useEffect } from "react";

interface SlideItem {
  id: number;
  badge: string;
  title: string;
  buttonText: string;
  image: string;
}

export function ImageExpansionSlider() {
  const [activeTab, setActiveTab] = useState("What's new");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const tabs = ["What's new", "Use cases", "Academy"];

  const slides: SlideItem[] = [
    {
      id: 1,
      badge: "What's new",
      title: "Google Gemini Omni: Edit with your words",
      buttonText: "Try it now",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      badge: "What's new",
      title: "Unlimited: Nano Banana 2 Lite",
      buttonText: "Create images",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      badge: "What's new",
      title: "Seedance 2.0 Mini",
      buttonText: "Try it now",
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 4,
      badge: "What's new",
      title: "Canvas Outpaint: Expand Boundlessly",
      buttonText: "Try it now",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 5,
      badge: "Use cases",
      title: "Product Backdrops & Studio Lights",
      buttonText: "Explore cases",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 6,
      badge: "Academy",
      title: "Mastering Outpainting & Seam Blending",
      buttonText: "Watch tutorial",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    },
  ];

  // Filter slides based on active tab
  const filteredSlides = slides.filter(
    (slide) => slide.badge === activeTab || activeTab === "What's new"
  );

  const totalDots = filteredSlides.length;

  const handleNext = () => {
    if (currentIdx < totalDots - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setCurrentIdx(0); // Loop back
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    } else {
      setCurrentIdx(totalDots - 1); // Loop to end
    }
  };

  // Scroll to active index
  useEffect(() => {
    if (sliderRef.current) {
      const card = sliderRef.current.children[0] as HTMLElement;
      if (card) {
        const cardWidth = card.clientWidth + 24; // width + gap
        sliderRef.current.scrollTo({
          left: currentIdx * cardWidth,
          behavior: "smooth",
        });
      }
    }
  }, [currentIdx]);

  // Reset index when changing tabs
  useEffect(() => {
    setCurrentIdx(0);
  }, [activeTab]);

  return (
    <div className={`w-full p-6 md:p-10 rounded-2xl border shadow-2xl overflow-hidden font-sans select-none transition-all duration-300 ${isDarkMode ? "bg-[#0a0a0c] text-white border-zinc-900" : "bg-[#f4f4f5] text-zinc-900 border-zinc-200"}`}>
      {/* Header Tabs Navigation */}
      <div className="flex flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-300 ${
                activeTab === tab
                  ? isDarkMode ? "bg-[#18181b] text-white" : "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                  : isDarkMode ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-yellow-400"
                : "bg-white border-zinc-200 hover:bg-zinc-100 text-purple-600"
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </button>
          <button className={`flex items-center gap-1 text-xs md:text-sm font-semibold transition-colors duration-200 group ${isDarkMode ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black"}`}>
            Explore all
            <span className="transform group-hover:translate-x-0.5 transition-transform duration-200">
              &gt;
            </span>
          </button>
        </div>
      </div>

      {/* Slider Carousel Container */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-6"
        style={{ scrollbarWidth: "none" }}
      >
        {filteredSlides.map((slide, idx) => (
          <div
            key={slide.id}
            onClick={() => setSelectedImageIndex(idx)}
            className={`min-w-[100%] sm:min-w-[48%] lg:min-w-[31.8%] snap-start group relative aspect-[1.5/1] rounded-2xl overflow-hidden border transition-all duration-500 cursor-pointer ${
              isDarkMode ? "border-zinc-900 bg-zinc-950/40 hover:border-zinc-800" : "border-zinc-200 bg-white/50 hover:border-zinc-300"
            }`}
          >
            {/* Background Image with Zoom & Dark Vignette */}
            <div className="absolute inset-0 z-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Slide Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-zinc-200">
              <span className="text-purple-400">✦</span>
              {slide.badge}
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-4 leading-tight tracking-tight truncate max-w-[95%]" title={slide.title}>
                {slide.title}
              </h3>
              <button className="w-fit px-3.5 py-1.5 bg-white text-black font-bold text-[10px] tracking-tight rounded-[5px] transition-all duration-300 hover:bg-zinc-200 active:scale-95 shadow-md shadow-black/20">
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between mt-4">
        {/* Step Indicators */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalDots }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIdx === idx 
                  ? (isDarkMode ? "w-8 bg-white" : "w-8 bg-zinc-900") 
                  : (isDarkMode ? "w-2 bg-zinc-700 hover:bg-zinc-500" : "w-2 bg-zinc-300 hover:bg-zinc-400")
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Arrow Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md ${
              isDarkMode 
                ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white" 
                : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900"
            }`}
            aria-label="Previous slide"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md ${
              isDarkMode 
                ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white" 
                : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900"
            }`}
            aria-label="Next slide"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 w-10 h-10 bg-zinc-900/50 hover:bg-zinc-800 rounded-full flex items-center justify-center text-white border border-zinc-700 transition-all duration-200 z-50 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex(null);
            }}
          >
            ✕
          </button>

          {/* Left Arrow */}
          <button 
            className="absolute left-4 md:left-12 w-12 h-12 bg-zinc-900/80 hover:bg-zinc-800 rounded-full flex items-center justify-center text-white border border-zinc-700 transition-all duration-200 z-50 shadow-lg active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex(prev => prev !== null && prev > 0 ? prev - 1 : totalDots - 1);
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>

          {/* Image Container */}
          <div 
            className="relative max-w-full max-h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={filteredSlides[selectedImageIndex].image} 
              alt={filteredSlides[selectedImageIndex].title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-zinc-800"
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-white mb-2">{filteredSlides[selectedImageIndex].title}</h3>
              <p className="text-sm text-zinc-400">{selectedImageIndex + 1} of {totalDots}</p>
            </div>
          </div>

          {/* Right Arrow */}
          <button 
            className="absolute right-4 md:right-12 w-12 h-12 bg-zinc-900/80 hover:bg-zinc-800 rounded-full flex items-center justify-center text-white border border-zinc-700 transition-all duration-200 z-50 shadow-lg active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex(prev => prev !== null && prev < totalDots - 1 ? prev + 1 : 0);
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
