import { ArrowDown, Zap, Ghost, Skull } from 'lucide-react';

export const Component = () => {

  return (
     <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Matrix Background */}
      <div className="absolute inset-0">
        <div className="matrix-container">
          <div className="matrix-pattern">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="matrix-column"></div>
            ))}
          </div>
          <div className="matrix-pattern">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="matrix-column"></div>
            ))}
          </div>
          <div className="matrix-pattern">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="matrix-column"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"></div>
      
      {/* Glitch Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-red-900/20 animate-pulse"></div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          {/* Floating Icons */}
          <div className="absolute -top-20 left-10 animate-bounce delay-100">
            <Skull className="w-8 h-8 text-red-500 opacity-60" />
          </div>
          <div className="absolute -top-16 right-16 animate-bounce delay-300">
            <Ghost className="w-6 h-6 text-purple-400 opacity-70" />
          </div>
          <div className="absolute top-20 -left-8 animate-bounce delay-500">
            <Zap className="w-7 h-7 text-green-400 opacity-50" />
          </div>

          {/* Main Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-900/50 to-red-900/50 border border-purple-500/30 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-mono tracking-wider">SYSTEM_ONLINE</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-green-400 to-purple-400 bg-clip-text text-transparent font-mono tracking-tight leading-none">
              DARK
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-mono tracking-tight leading-none animate-pulse">
              MATRIX
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Enter the digital void where{' '}
            <span className="text-green-400 font-mono">reality</span> meets{' '}
            <span className="text-purple-400 font-mono">chaos</span>.{' '}
            <span className="text-red-400">No cap.</span>
          </p>

          {/* Glitch Text Effect */}
          <div className="text-lg text-green-400 font-mono mb-12 opacity-80">
            <span className="animate-pulse">{'>'} Welcome to the underground_</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-black font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">JACK IN</span>
            </button>
            
            <button className="group px-8 py-4 border-2 border-purple-500 text-purple-400 font-bold rounded-full transition-all duration-300 hover:bg-purple-500 hover:text-black hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              <span className="font-mono">EXPLORE_VOID</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mb-12">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-green-400 mb-1">99%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-purple-400 mb-1">∞</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Possibilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-red-400 mb-1">404</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Rules Found</div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <ArrowDown className="w-6 h-6 text-green-400 mx-auto opacity-60" />
          </div>
        </div>
      </div>

      {/* Side Decorative Elements */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-green-400 to-transparent opacity-60"></div>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-60"></div>
      </div>

      {/* Bottom Glitch Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>

      <style jsx>{`
        .matrix-container {
          position: relative;
          width: 100%;
          height: 100%;
          background: #000;
          display: flex;
        }

        .matrix-pattern {
          position: relative;
          width: 1000px;
          height: 100%;
          flex-shrink: 0;
        }

        .matrix-column {
          position: absolute;
          top: -100%;
          width: 20px;
          height: 100%;
          font-size: 16px;
          line-height: 18px;
          font-weight: bold;
          animation: fall linear infinite;
          white-space: nowrap;
        }

        .matrix-column::before {
          content: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          position: absolute;
          top: 0;
          left: 0;
          background: linear-gradient(
            to bottom,
            #ffffff 0%,
            #ffffff 5%,
            #00ff41 10%,
            #00ff41 20%,
            #00dd33 30%,
            #00bb22 40%,
            #009911 50%,
            #007700 60%,
            #005500 70%,
            #003300 80%,
            rgba(0, 255, 65, 0.5) 90%,
            transparent 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          writing-mode: vertical-lr;
          letter-spacing: 1px;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .matrix-column:nth-child(1) { left: 0px; animation-delay: -2.5s; animation-duration: 3s; }
        .matrix-column:nth-child(2) { left: 25px; animation-delay: -3.2s; animation-duration: 4s; }
        .matrix-column:nth-child(3) { left: 50px; animation-delay: -1.8s; animation-duration: 2.5s; }
        .matrix-column:nth-child(4) { left: 75px; animation-delay: -2.9s; animation-duration: 3.5s; }
        .matrix-column:nth-child(5) { left: 100px; animation-delay: -1.5s; animation-duration: 3s; }
        .matrix-column:nth-child(6) { left: 125px; animation-delay: -3.8s; animation-duration: 4.5s; }
        .matrix-column:nth-child(7) { left: 150px; animation-delay: -2.1s; animation-duration: 2.8s; }
        .matrix-column:nth-child(8) { left: 175px; animation-delay: -2.7s; animation-duration: 3.2s; }
        .matrix-column:nth-child(9) { left: 200px; animation-delay: -3.4s; animation-duration: 3.8s; }
        .matrix-column:nth-child(10) { left: 225px; animation-delay: -1.9s; animation-duration: 2.7s; }
        .matrix-column:nth-child(11) { left: 250px; animation-delay: -3.6s; animation-duration: 4.2s; }
        .matrix-column:nth-child(12) { left: 275px; animation-delay: -2.3s; animation-duration: 3.1s; }
        .matrix-column:nth-child(13) { left: 300px; animation-delay: -3.1s; animation-duration: 3.6s; }
        .matrix-column:nth-child(14) { left: 325px; animation-delay: -2.6s; animation-duration: 2.9s; }
        .matrix-column:nth-child(15) { left: 350px; animation-delay: -3.7s; animation-duration: 4.1s; }
        .matrix-column:nth-child(16) { left: 375px; animation-delay: -2.8s; animation-duration: 3.3s; }
        .matrix-column:nth-child(17) { left: 400px; animation-delay: -3.3s; animation-duration: 3.7s; }
        .matrix-column:nth-child(18) { left: 425px; animation-delay: -2.2s; animation-duration: 2.6s; }
        .matrix-column:nth-child(19) { left: 450px; animation-delay: -3.9s; animation-duration: 4.3s; }
        .matrix-column:nth-child(20) { left: 475px; animation-delay: -2.4s; animation-duration: 3.4s; }
        .matrix-column:nth-child(21) { left: 500px; animation-delay: -1.7s; animation-duration: 2.4s; }
        .matrix-column:nth-child(22) { left: 525px; animation-delay: -3.5s; animation-duration: 3.9s; }
        .matrix-column:nth-child(23) { left: 550px; animation-delay: -2s; animation-duration: 3s; }
        .matrix-column:nth-child(24) { left: 575px; animation-delay: -4s; animation-duration: 4.4s; }
        .matrix-column:nth-child(25) { left: 600px; animation-delay: -1.6s; animation-duration: 2.3s; }
        .matrix-column:nth-child(26) { left: 625px; animation-delay: -3s; animation-duration: 3.5s; }
        .matrix-column:nth-child(27) { left: 650px; animation-delay: -3.8s; animation-duration: 4s; }
        .matrix-column:nth-child(28) { left: 675px; animation-delay: -2.5s; animation-duration: 2.8s; }
        .matrix-column:nth-child(29) { left: 700px; animation-delay: -3.2s; animation-duration: 3.6s; }
        .matrix-column:nth-child(30) { left: 725px; animation-delay: -2.7s; animation-duration: 3.2s; }
        .matrix-column:nth-child(31) { left: 750px; animation-delay: -1.8s; animation-duration: 2.7s; }
        .matrix-column:nth-child(32) { left: 775px; animation-delay: -3.6s; animation-duration: 4.1s; }
        .matrix-column:nth-child(33) { left: 800px; animation-delay: -2.1s; animation-duration: 3.1s; }
        .matrix-column:nth-child(34) { left: 825px; animation-delay: -3.4s; animation-duration: 3.7s; }
        .matrix-column:nth-child(35) { left: 850px; animation-delay: -2.8s; animation-duration: 2.9s; }
        .matrix-column:nth-child(36) { left: 875px; animation-delay: -3.7s; animation-duration: 4.2s; }
        .matrix-column:nth-child(37) { left: 900px; animation-delay: -2.3s; animation-duration: 3.3s; }
        .matrix-column:nth-child(38) { left: 925px; animation-delay: -1.9s; animation-duration: 2.5s; }
        .matrix-column:nth-child(39) { left: 950px; animation-delay: -3.5s; animation-duration: 3.8s; }
        .matrix-column:nth-child(40) { left: 975px; animation-delay: -2.6s; animation-duration: 3.4s; }

        .matrix-column:nth-child(odd)::before {
          content: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン123456789";
        }

        .matrix-column:nth-child(even)::before {
          content: "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴァィゥェォャュョッABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }

        .matrix-column:nth-child(3n)::before {
          content: "アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロヲン0987654321";
        }

        .matrix-column:nth-child(4n)::before {
          content: "ンヲロヨモホノトソコオレメヘネテセケエルユムフヌツスクウリミヒニチシキイワラヤマハナタサカア";
        }

        .matrix-column:nth-child(5n)::before {
          content: "ガザダバパギジヂビピグズヅブプゲゼデベペゴゾドボポヴァィゥェォャュョッ!@#$%^&*()_+-=[]{}|;:,.<>?";
        }

        @keyframes fall {
          0% {
            transform: translateY(-10%);
            opacity: 1;
          }
          100% {
            transform: translateY(200%);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .matrix-column {
            font-size: 14px;
            line-height: 16px;
            width: 18px;
          }
        }

        @media (max-width: 480px) {
          .matrix-column {
            font-size: 12px;
            line-height: 14px;
            width: 15px;
          }
        }
      `}</style>
    </div>
  );
};
