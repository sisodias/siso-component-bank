import React, { useEffect, useRef } from 'react';

export default function HeroSection() {
  const buttonRef = useRef(null);
  const mainTextRef = useRef(null);
  const subtextRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const mainText = mainTextRef.current;
    const subtext = subtextRef.current;
    const shapes = document.querySelectorAll('.shape');

    function handleStartBuilding() {
      if (!button) return;
      button.classList.add('clicked');
      setTimeout(() => {
        button.classList.remove('clicked');
      }, 200);
      alert('Ready to start building the future! 🚀');
    }

    if (button) {
      // Click handler
      button.addEventListener('click', handleStartBuilding);
      // Hover interactions
      button.addEventListener('mouseenter', () => {
        if (subtext) subtext.style.filter = 'brightness(1.1)';
      });
      button.addEventListener('mouseleave', () => {
        if (subtext) subtext.style.filter = 'brightness(1)';
      });
    }

    // Mouse move parallax
    function handleMouseMove(e) {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      shapes.forEach((shape, index) => {
        const speed = (index % 3 + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 20;
        const y = (mouseY - 0.5) * speed * 20;
        shape.style.transform = `translate(${x}px, ${y}px)`;
      });
      if (mainText) mainText.style.transform = `translate(${(mouseX - 0.5) * 2}px, ${(mouseY - 0.5) * 2}px)`;
      if (subtext) subtext.style.transform = `translate(${(mouseX - 0.5) * 1}px, ${(mouseY - 0.5) * 1}px)`;
    }
    document.addEventListener('mousemove', handleMouseMove);

    // Keyboard interactions
    function handleKeyDown(e) {
      if ((e.code === 'Space' || e.code === 'Enter') && document.activeElement === button) {
        e.preventDefault();
        handleStartBuilding();
      }
      if (e.code === 'Tab' && button) {
        button.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);

    // Reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      shapes.forEach(shape => { shape.style.animation = 'none'; });
      if (subtext) subtext.style.animation = 'fadeInUp 1s ease-out 0.3s both';
      if (mainText) mainText.style.animation = 'fadeInUp 1s ease-out both';
      if (button) button.style.animation = 'fadeInUp 1s ease-out 0.6s both';
    }

    // Intersection Observer for future use
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });
      if (mainText) observer.observe(mainText);
      if (subtext) observer.observe(subtext);
      if (button) observer.observe(button);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      if (button) {
        button.removeEventListener('click', handleStartBuilding);
        button.removeEventListener('mouseenter', () => {});
        button.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* Geometric background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Triangle 1 */}
        <div className="shape absolute top-[15%] left-[10%] opacity-10 animate-float" style={{ width: 0, height: 0, borderLeft: '50px solid transparent', borderRight: '50px solid transparent', borderBottom: '86px solid #4a90e2' }} />
        {/* Triangle 2 */}
        <div className="shape absolute top-[70%] right-[15%] opacity-10 animate-float-reverse delay-2000" style={{ width: 0, height: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderBottom: '52px solid #7b68ee' }} />
        {/* Hexagon 1 */}
        <div className="shape absolute top-[25%] right-[8%] opacity-10 animate-pulse-custom" style={{ width: '60px', height: '34px', backgroundColor: '#6c63ff' }}>
          <div className="absolute bottom-full left-0" style={{ width: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderBottom: '17px solid #6c63ff' }} />
          <div className="absolute top-full left-0" style={{ width: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderTop: '17px solid #6c63ff' }} />
        </div>
        {/* Hexagon 2 */}
        <div className="shape absolute top-[60%] left-[5%] opacity-10 animate-pulse-custom delay-1000" style={{ width: '40px', height: '23px', backgroundColor: '#20b2aa' }}>
          <div className="absolute bottom-full left-0" style={{ width: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderBottom: '11px solid #20b2aa' }} />
          <div className="absolute top-full left-0" style={{ width: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderTop: '11px solid #20b2aa' }} />
        </div>
        {/* Line 1 */}
        <div className="shape absolute top-[35%] right-[20%] opacity-10 animate-slide" style={{ width: '120px', height: '2px', background: 'linear-gradient(90deg, transparent, #4a90e2, transparent)' }} />
        {/* Line 2 */}
        <div className="shape absolute top-[80%] left-[20%] opacity-10 animate-slide-reverse delay-2000" style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg, transparent, #7b68ee, transparent)' }} />
        {/* Line 3 */}
        <div className="shape absolute top-[45%] left-[85%] opacity-10 animate-slide-vertical" style={{ width: '2px', height: '100px', background: 'linear-gradient(180deg, transparent, #20b2aa, transparent)' }} />
        {/* Circle 1 */}
        <div className="shape absolute top-[20%] right-[30%] opacity-10 animate-rotate-custom" style={{ width: '40px', height: '40px', border: '2px solid #4a90e2', borderRadius: '50%' }} />
        {/* Circle 2 */}
        <div className="shape absolute top-[75%] left-[25%] opacity-10 animate-rotate-custom-reverse delay-1000" style={{ width: '25px', height: '25px', border: '1px solid #7b68ee', borderRadius: '50%' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-3xl px-8">
        <h1 ref={mainTextRef} className="main-text text-white text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
          Ready to build
        </h1>
        <h2 ref={subtextRef} className="subtext text-5xl md:text-7xl font-light text-[#ff6b35] mb-12 animate-fadeInUp animate-delay-300 mix-blend-add">
          the software of the future?
        </h2>
        <button
          ref={buttonRef}
          className="cta-button cursor-pointer bg-white text-black py-4 px-10 rounded-lg uppercase text-lg font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-200 animate-fadeInUp animate-delay-600 focus:outline-none focus:ring-4 focus:ring-[#4a90e2]/40"
        >
          Start building
        </button>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 1s ease-out forwards; }
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-600 { animation-delay: 0.6s; }

        @keyframes glow {
          from {
            text-shadow:
              0 0 10px #ff6b35,
              0 0 20px #ff6b35,
              0 0 30px #ff6b35,
              0 0 40px #ff6b35;
          }
          to {
            text-shadow:
              0 0 15px #ff6b35,
              0 0 25px #ff6b35,
              0 0 35px #ff6b35,
              0 0 50px #ff6b35;
          }
        }
        .subtext { animation: glow 2s ease-in-out infinite alternate; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-reverse { animation: float 8s ease-in-out infinite reverse; }

        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        .animate-pulse-custom { animation: pulse 4s ease-in-out infinite; }
        .delay-1000 { animation-delay: 1s; }

        @keyframes slide {
          0% { transform: translateX(-100px); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateX(100px); opacity: 0; }
        }
        .animate-slide { animation: slide 7s linear infinite; }
        .animate-slide-reverse { animation: slide 9s linear infinite reverse; }

        @keyframes slideVertical {
          0% { transform: translateY(-50px); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateY(50px); opacity: 0; }
        }
        .animate-slide-vertical { animation: slideVertical 6s linear infinite; }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-rotate-custom { animation: rotate 10s linear infinite; }
        .animate-rotate-custom-reverse { animation: rotate 12s linear infinite reverse; }

        .clicked { transform: translateY(0) scale(0.95) !important; box-shadow: 0 2px 10px rgba(255, 255, 255, 0.3) !important; }
      `}</style>
    </main>
  );
}
