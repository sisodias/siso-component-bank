import React, { type JSX, useEffect, useState } from 'react';
import { motion, MotionProps } from 'framer-motion';

// --- TextScramble Component ---

type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  scrambleClassName?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
} & MotionProps;

const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * TextScramble component that animates text by scrambling characters.
 * Enhanced to allow different styling for scrambled vs revealed characters.
 */
export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  scrambleClassName = "opacity-50", // Default: dim scrambled characters for better readability
  as: Component = 'p',
  trigger = true,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  const MotionComponent = motion.create(
    Component as keyof JSX.IntrinsicElements
  );
  
  const [displayChars, setDisplayChars] = useState<{ char: string; isScrambled: boolean }[]>(
    children.split('').map(c => ({ char: c, isScrambled: false }))
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const text = children;

  const scramble = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const steps = duration / speed;
    let step = 0;

    const interval = setInterval(() => {
      const progress = step / steps;
      const threshold = progress * text.length;

      const newChars = text.split('').map((originalChar, i) => {
        if (originalChar === ' ') return { char: ' ', isScrambled: false };

        if (threshold > i) {
          return { char: originalChar, isScrambled: false };
        } else {
          const randomChar = characterSet[Math.floor(Math.random() * characterSet.length)];
          return { char: randomChar, isScrambled: true };
        }
      });

      setDisplayChars(newChars);
      step++;

      if (step > steps) {
        clearInterval(interval);
        setDisplayChars(text.split('').map(c => ({ char: c, isScrambled: false })));
        setIsAnimating(false);
        onScrambleComplete?.();
      }
    }, speed * 1000);
  };

  useEffect(() => {
    if (!trigger) return;
    scramble();
  }, [trigger, text]);

  return (
    <MotionComponent className={className} {...props}>
      {displayChars.map((item, i) => (
        <span 
          key={i} 
          className={item.isScrambled ? scrambleClassName : undefined}
          aria-hidden={item.isScrambled ? "true" : "false"}
        >
          {item.char}
        </span>
      ))}
    </MotionComponent>
  );
}

// --- Demo Components ---

function CustomTriggerDemo() {
  const [isTrigger, setIsTrigger] = useState(false)

  return (
    <div className="flex justify-center items-center min-h-[160px] p-8 bg-zinc-950/90 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl transition-all duration-300 hover:border-zinc-700">
      <a
        href="#"
        className="text-zinc-300 transition-colors hover:text-white group relative block"
        onClick={(e) => e.preventDefault()}
        onMouseEnter={() => setIsTrigger(true)}
        onMouseLeave={() => setIsTrigger(false)}
      >
        <TextScramble
          className="text-lg md:text-xl font-semibold tracking-tight font-mono inline-block"
          as="span"
          speed={0.015}
          trigger={isTrigger}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          scrambleClassName="text-indigo-400 opacity-60"
        >
          Tyler, The Creator - I Hope You Find Your Way Home
        </TextScramble>
        <div className="absolute -bottom-2 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-sky-500 opacity-80" />
      </a>
    </div>
  )
}

const demos = [
  {
    name: "Hover Trigger",
    description: "Interactive scramble effect with a subtle spring-based scaling animation for high-fidelity tactile feedback.",
    component: CustomTriggerDemo,
  }
];

// --- Main App Component ---

const App: React.FC = () => {
  return (
    <div className="w-screen relative min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Sophisticated Mesh Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-indigo-200/25 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-sky-200/25 blur-[120px]" />
        <div className="absolute top-[15%] right-[10%] w-[35%] h-[35%] rounded-full bg-violet-100/20 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-rose-100/15 blur-[80px]" />
      </div>

      {/* Layered Orthogonal Grid System */}
      {/* Minor Grid: 20px spacing */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.4]" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Major Grid: 100px spacing */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.7]" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Radial fade for softer grid edges and center focus */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,white_90%)] opacity-80" />

      {/* Demo Grid */}
      <main className="relative z-10 max-w-xl w-full grid grid-cols-1 gap-12">
        {demos.map((demo, index) => (
          <div key={index} className="flex flex-col group">
            <div className="mb-8 border-l-4 border-indigo-500 pl-4 py-1">
              <div className="mb-2">
                <h3 className="text-2xl font-extrabold text-zinc-900 tracking-tightest leading-none">
                  {demo.name}
                </h3>
              </div>
              <p className="text-base text-zinc-600 font-medium leading-relaxed max-w-md">
                {demo.description}
              </p>
            </div>
            <div className="transition-all duration-500 group-hover:-translate-y-2 group-hover:drop-shadow-2xl">
              <demo.component />
            </div>
          </div>
        ))}
      </main>
      
      {/* Footer hint */}
      <footer className="fixed bottom-8 text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold pointer-events-none z-10">
        Showcase / Framer Motion / Tailwind
      </footer>
    </div>
  );
};

export default App;