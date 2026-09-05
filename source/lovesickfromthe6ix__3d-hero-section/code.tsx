import React, { useState, useEffect, useRef } from 'react';

export const Component = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height
        });
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const FloatingCube = ({ delay, size, initialX, initialY }) => {
    const cubeStyle = {
      '--delay': delay,
      '--size': size,
      '--initial-x': initialX,
      '--initial-y': initialY,
      transform: `
        translateX(${mousePosition.x * 20}px)
        translateY(${mousePosition.y * 20}px)
        translateZ(${scrollY * 0.1}px)
      `
    };

    return (
      <div className="floating-cube" style={cubeStyle}>
        <div className="cube-face front"></div>
        <div className="cube-face back"></div>
        <div className="cube-face right"></div>
        <div className="cube-face left"></div>
        <div className="cube-face top"></div>
        <div className="cube-face bottom"></div>
      </div>
    );
  };

  return (
    <div className="hero-container" ref={heroRef}>
      <style jsx>{`
        .hero-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          color: white;
          transform-style: preserve-3d;
          animation: fadeInUp 1s ease-out;
        }

        .hero-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          margin: 0;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffffff 0%, #64ffda 50%, #ffffff 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease infinite;
          transform: translateZ(50px);
        }

        .hero-subtitle {
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          margin: 1rem 0 2rem;
          opacity: 0.8;
          font-weight: 300;
          animation: fadeInUp 1s ease-out 0.2s both;
        }

        .cta-button {
          display: inline-block;
          padding: 1rem 3rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: #0a0a0a;
          background: linear-gradient(135deg, #64ffda 0%, #48cae4 100%);
          border: none;
          border-radius: 50px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: fadeInUp 1s ease-out 0.4s both;
          transform-style: preserve-3d;
        }

        .cta-button:hover {
          transform: translateY(-2px) translateZ(20px);
          box-shadow: 0 10px 30px rgba(100, 255, 218, 0.3);
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .cta-button:active::before {
          width: 300px;
          height: 300px;
        }

        .floating-cube {
          position: absolute;
          width: var(--size);
          height: var(--size);
          transform-style: preserve-3d;
          animation: float 6s ease-in-out infinite;
          animation-delay: var(--delay);
          left: var(--initial-x);
          top: var(--initial-y);
          transition: transform 0.1s ease-out;
        }

        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(100, 255, 218, 0.1) 0%, rgba(72, 202, 228, 0.1) 100%);
          border: 1px solid rgba(100, 255, 218, 0.3);
          backdrop-filter: blur(10px);
        }

        .cube-face.front {
          transform: translateZ(calc(var(--size) / 2));
        }

        .cube-face.back {
          transform: rotateY(180deg) translateZ(calc(var(--size) / 2));
        }

        .cube-face.right {
          transform: rotateY(90deg) translateZ(calc(var(--size) / 2));
        }

        .cube-face.left {
          transform: rotateY(-90deg) translateZ(calc(var(--size) / 2));
        }

        .cube-face.top {
          transform: rotateX(90deg) translateZ(calc(var(--size) / 2));
        }

        .cube-face.bottom {
          transform: rotateX(-90deg) translateZ(calc(var(--size) / 2));
        }

        .particle-field {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(100, 255, 218, 0.8);
          border-radius: 50%;
          animation: particleFloat 10s linear infinite;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotateX(0) rotateY(0);
          }
          25% {
            transform: translateY(-20px) rotateX(20deg) rotateY(20deg);
          }
          50% {
            transform: translateY(0) rotateX(40deg) rotateY(40deg);
          }
          75% {
            transform: translateY(20px) rotateX(60deg) rotateY(60deg);
          }
        }

        @keyframes particleFloat {
          from {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          to {
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: clamp(2.5rem, 10vw, 4rem);
          }
          
          .floating-cube {
            display: none;
          }
        }
      `}</style>

      <div className="particle-field">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <FloatingCube delay="0s" size="60px" initialX="10%" initialY="20%" />
      <FloatingCube delay="2s" size="80px" initialX="80%" initialY="30%" />
      <FloatingCube delay="4s" size="40px" initialX="20%" initialY="70%" />
      <FloatingCube delay="1s" size="70px" initialX="70%" initialY="60%" />

      <div 
        className="hero-content"
        style={{
          transform: `
            rotateX(${-mousePosition.y * 10}deg)
            rotateY(${mousePosition.x * 10}deg)
            translateZ(${scrollY * 0.2}px)
          `
        }}
      >
        <h1 className="hero-title">Welcome to the Future</h1>
        <p className="hero-subtitle">Experience the next dimension of web design</p>
        <button className="cta-button">
          Explore Now
        </button>
      </div>
    </div>
  );
};