import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    text: "This product completely transformed our workflow. The attention to detail and user experience is absolutely phenomenal. I can't imagine working without it now.",
    author: "Sarah Johnson",
    role: "Creative Director, Design Studio",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b212?w=400&h=400&fit=crop&crop=face"
  },
  {
    text: "Outstanding service and incredible results. The team went above and beyond our expectations. This is exactly what we were looking for.",
    author: "Michael Chen",
    role: "CEO, Tech Innovations",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  },
  {
    text: "The level of professionalism and quality delivered exceeded all our expectations. Truly remarkable work that speaks for itself.",
    author: "Emma Rodriguez",
    role: "Marketing Manager, Global Corp",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
  },
  {
    text: "Simply amazing! The innovative approach and flawless execution made this project a huge success. Highly recommended for anyone seeking excellence.",
    author: "David Kim",
    role: "Product Manager, StartupCo",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  }
];

const animatedTestimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayInterval = useRef(null);

  const totalSlides = testimonials.length;

  useEffect(() => {
    // Setup text animation
    const textElements = document.querySelectorAll('.testimonial-text');
    textElements.forEach((element, index) => {
      const text = testimonials[index].text;
      element.innerHTML = '';
      [...text].forEach((char, charIndex) => {
        const span = document.createElement('span');
        span.className = 'char inline-block opacity-0 translate-y-5 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]';
        span.style.transitionDelay = `${charIndex * 0.03}s`;
        span.textContent = char === ' ' ? '\u00A0' : char;
        element.appendChild(span);
      });
    });

    // Start autoplay
    startAutoPlay();

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(autoPlayInterval.current);
      } else {
        startAutoPlay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(autoPlayInterval.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    resetAutoPlay();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    resetAutoPlay();
  };

  const startAutoPlay = () => {
    clearInterval(autoPlayInterval.current);
    autoPlayInterval.current = setInterval(nextSlide, 5000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval.current);
    startAutoPlay();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] overflow-hidden">
      <div className="max-w-5xl w-[90%] h-[600px] bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-white/10 pointer-events-none"></div>
        <div className="absolute top-10 right-14 text-white/60 text-sm font-medium">
          <span>{currentSlide + 1}</span> / <span>{totalSlides}</span>
        </div>

        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`flex h-full absolute w-full items-center p-14 transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            } max-md:flex-col max-md:p-7 max-md:text-center`}
          >
            <div className="flex-shrink-0 w-[300px] h-[300px] mr-20 max-md:w-[200px] max-md:h-[200px] max-md:mr-0 max-md:mb-7 relative">
              <Image
                src={testimonial.image}
                alt={testimonial.author}
                width={400}
                height={400}
                className={`w-full h-full object-cover rounded-2xl shadow-2xl ${
                  index === currentSlide ? 'scale-105' : ''
                } transition-transform duration-600 ease-out`}
              />
            </div>
            <div className="flex-1 text-white relative">
              <div
                className="testimonial-text text-2xl leading-relaxed mb-10 font-light tracking-wide max-md:text-xl"
                data-text={testimonial.text}
              ></div>
              <div className="text-lg font-semibold opacity-90 mb-2">{testimonial.author}</div>
              <div className="text-base opacity-70 font-normal">{testimonial.role}</div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-10 right-14 flex gap-3 bg-white/15 p-4 rounded-full backdrop-blur-md border border-white/10 max-md:right-7 max-md:bottom-7">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                index === currentSlide
                  ? 'bg-white/90 scale-125 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                  : 'bg-white/30 hover:bg-white/60 hover:scale-110'
              }`}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default animatedTestimonials;