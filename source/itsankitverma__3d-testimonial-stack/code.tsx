import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles, Shuffle } from 'lucide-react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "CEO, TechVision",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop",
      rating: 5,
      text: "This product has revolutionized our workflow. The seamless integration and intuitive design have boosted our team's productivity by 40%. Absolutely phenomenal!",
      color: "from-violet-500 via-purple-500 to-fuchsia-500"
    },
    {
      id: 2,
      name: "James Anderson",
      role: "Product Director, InnovateCo",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
      rating: 5,
      text: "After trying numerous solutions, this stands head and shoulders above the rest. The customer support is exceptional, and the features are exactly what we needed.",
      color: "from-cyan-500 via-blue-500 to-indigo-500"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Creative Lead, DesignStudio",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop",
      rating: 5,
      text: "Beautiful aesthetics combined with powerful functionality. It's rare to find a product that excels in both design and performance. Our clients love it!",
      color: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    {
      id: 4,
      name: "Michael Chen",
      role: "Founder, StartupHub",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop",
      rating: 5,
      text: "The ROI we've seen has been incredible. Implementation was smooth, and the results exceeded our expectations. This is a game-changer for our industry.",
      color: "from-orange-500 via-amber-500 to-yellow-500"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "VP of Operations, GlobalTech",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
      rating: 5,
      text: "Outstanding quality and reliability. Our team adapted quickly, and we've seen measurable improvements across all key metrics. Highly recommended!",
      color: "from-pink-500 via-rose-500 to-red-500"
    }
  ];

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  const randomSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * testimonials.length);
      } while (randomIndex === currentIndex && testimonials.length > 1);
      setCurrentIndex(randomIndex);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 700);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  useEffect(() => {
    const autoplay = setInterval(nextSlide, 6000);
    return () => clearInterval(autoplay);
  }, [currentIndex]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative overflow-hidden w-full">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/50 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/50 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="max-w-full sm:max-w-[35rem] w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <h2 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              CLIENT TESTIMONIALS
            </h2>
            <Sparkles className="w-6 h-6 text-pink-400" />
          </div>
          <p className="text-gray-400 text-lg tracking-wider">
            EXPERIENCE THE FUTURE OF EXCELLENCE
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          style={{ perspective: '2000px' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Holographic effect layers */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-l from-blue-500/10 via-violet-500/10 to-fuchsia-500/10 rounded-3xl blur-xl" />
          </div>

          {/* Main Card */}
          <div
            className={`relative transition-all duration-700 h-[550px] max-h-[550px] ${
              isAnimating ? 'opacity-0 scale-90 rotate-y-180' : 'opacity-100 scale-100'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) translateZ(50px)`
            }}
          >
            {/* Glowing border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-sm opacity-75" />
            
            <div className="relative bg-black rounded-3xl overflow-hidden border border-white/20 shadow-2xl h-full max-h-full flex flex-col">
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />

              {/* Background Image */}
              <div className="relative h-48 flex-shrink-0 overflow-hidden">
                <img
                  src={currentTestimonial.image}
                  alt="Background"
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.4) saturate(1.2)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
                <div className={`absolute inset-0 bg-gradient-to-br ${currentTestimonial.color} opacity-30 mix-blend-overlay`} />
                
                {/* Floating particles */}
                <div className="absolute inset-0">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full opacity-40"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>

                {/* Quote Icon */}
                <div className="absolute top-8 right-8">
                  <Quote className={`w-20 h-20 text-transparent bg-gradient-to-br ${currentTestimonial.color} bg-clip-text opacity-40`} />
                </div>
              </div>

              {/* Content */}
              <div className="relative p-8 md:p-10 flex-1 flex flex-col overflow-y-auto min-h-0">
                {/* Avatar & Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative group">
                    {/* Glowing ring */}
                    <div className={`absolute -inset-2 bg-gradient-to-r ${currentTestimonial.color} rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity`} />
                    <img
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      className="relative w-20 h-20 rounded-full object-cover ring-2 ring-white/30 shadow-2xl"
                    />
                  </div>
                  <div>
                    <h3 className={`text-transparent bg-clip-text bg-gradient-to-r ${currentTestimonial.color} font-black text-2xl mb-1 tracking-tight`}>
                      {currentTestimonial.name}
                    </h3>
                    <p className="text-gray-400 text-xs tracking-widest uppercase">
                      {currentTestimonial.role}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-2 mb-6">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 fill-yellow-400 text-yellow-400 drop-shadow-lg`}
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.8))'
                      }}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-6 font-light flex-1">
                  "{currentTestimonial.text}"
                </p>

                {/* Navigation Dots */}
                <div className="flex items-center justify-center gap-3 mt-auto">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isAnimating) {
                          setIsAnimating(true);
                          setCurrentIndex(index);
                        }
                      }}
                      className="group relative"
                    >
                      {index === currentIndex && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${currentTestimonial.color} rounded-full blur-md`} />
                      )}
                      <div
                        className={`relative h-2.5 rounded-full transition-all duration-500 ${
                          index === currentIndex
                            ? `w-10 bg-gradient-to-r ${currentTestimonial.color} shadow-lg`
                            : 'w-2.5 bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-20 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-black hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed text-white p-4 rounded-full border border-white/30 transition-all duration-300 hover:scale-110 shadow-2xl">
              <ChevronLeft className="w-7 h-7" />
            </div>
          </button>
          
          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-20 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-black hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed text-white p-4 rounded-full border border-white/30 transition-all duration-300 hover:scale-110 shadow-2xl">
              <ChevronRight className="w-7 h-7" />
            </div>
          </button>

          {/* Random Button */}
          <button
            onClick={randomSlide}
            disabled={isAnimating}
            className="absolute -right-4 -top-4 md:-right-6 md:-top-6 group z-20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-black hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed text-white p-3 rounded-full border border-white/30 transition-all duration-300 hover:scale-110 shadow-2xl">
              <Shuffle className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
            <div
              className={`h-full bg-gradient-to-r ${currentTestimonial.color} transition-all duration-500 shadow-lg`}
              style={{ 
                width: `${((currentIndex + 1) / testimonials.length) * 100}%`,
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)'
              }}
            />
          </div>
          <p className="text-center text-gray-500 text-sm mt-3 tracking-widest uppercase">
            {currentIndex + 1} / {testimonials.length}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          to {
            transform: translateX(200%);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}