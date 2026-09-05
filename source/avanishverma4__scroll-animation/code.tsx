import React, { useRef, useState, useEffect } from 'react';
import { 
  motion, 
  useScroll, 
  useSpring, 
  useTransform, 
  MotionValue, 
  useInView 
} from 'framer-motion';
import { 
  ArrowUp, 
  BookOpen, 
  Clock, 
  Share2, 
  MessageCircle, 
  Heart,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

// --- Types ---
interface SectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
  id?: string;
}

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// --- Helpers ---
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// --- Components ---

/**
 * ScrollProgress
 * The core component requested: A horizontal bar indicating scroll depth.
 * Uses useSpring for physics-based smoothing.
 */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  
  // Apply spring physics to the scroll progress for a buttery smooth effect
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Optional: Transform color based on progress
  const background = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#84cc16", "#22c55e", "#10b981"] // Lime-500 -> Green-500 -> Emerald-500 (Slightly darker for visibility on light mode)
  );

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 origin-left z-50 shadow-[0_0_10px_rgba(132,204,22,0.5)]"
      style={{ 
        scaleX, 
        background 
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 15,
        mass: 1,
        delay: 0.5 
      }}
    />
  );
};

/**
 * AnimatedSection
 * A wrapper that fades content in as it scrolls into view.
 */
const AnimatedSection: React.FC<SectionProps> = ({ title, children, delay = 0, id }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id={id} ref={ref} className="mb-24 relative scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-slate-100 dark:to-slate-400">
          {title}
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed transition-colors duration-300">
          {children}
        </div>
      </motion.div>
    </section>
  );
};

/**
 * Hero
 * The top section of the page.
 */
const Hero = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden pt-32 pb-12 transition-colors duration-300">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-400/30 dark:bg-lime-500/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-pulse transition-all duration-700" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/30 dark:bg-green-500/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen transition-all duration-700" />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 text-lime-700 dark:text-lime-400 text-sm font-medium mb-6 backdrop-blur-sm transition-colors duration-300">
              Interactive Storytelling
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 transition-colors duration-300">
              The Art of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-600 via-green-600 to-emerald-600 dark:from-lime-400 dark:via-green-400 dark:to-emerald-400">
                Smooth Motion
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
              Discover how physics-based animations can transform digital interfaces from static pages into fluid, living experiences.
            </p>
            
            <div className="flex items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>12 min read</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-700" />
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Technology</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator hint */}
      <motion.button 
        onClick={() => scrollToSection('physics')}
        className="relative z-10 text-lime-600/80 dark:text-lime-400/80 hover:text-lime-600 dark:hover:text-lime-400 transition-colors flex flex-col items-center gap-3 cursor-pointer group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        aria-label="Scroll to explore content"
      >
        <span className="text-xs uppercase tracking-widest font-medium">Scroll to explore</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-0.5 h-12 bg-gradient-to-b from-lime-600 dark:from-lime-400 to-transparent rounded-full opacity-80 group-hover:opacity-100"
        />
      </motion.button>
    </div>
  );
};

/**
 * Navbar
 * Sticky header with blur effect.
 */
const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-lime-500 to-green-600 flex items-center justify-center text-white dark:text-slate-950">
            L
          </div>
          <span className="text-slate-900 dark:text-white transition-colors duration-300">Lumina</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <button onClick={() => scrollToSection('physics')} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">Articles</button>
          <button onClick={() => scrollToSection('implementation')} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">Tutorials</button>
          <button onClick={() => scrollToSection('color')} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">Showcase</button>
          
          <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button className="px-4 py-2 rounded-full bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-lg shadow-slate-900/10 dark:shadow-none">
              Subscribe
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            className="text-slate-700 dark:text-slate-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <div className="flex flex-col p-6 gap-4 text-slate-600 dark:text-slate-400">
            <button onClick={() => handleNavClick('physics')} className="hover:text-lime-600 dark:hover:text-lime-400 text-left">Articles</button>
            <button onClick={() => handleNavClick('implementation')} className="hover:text-lime-600 dark:hover:text-lime-400 text-left">Tutorials</button>
            <button onClick={() => handleNavClick('color')} className="hover:text-lime-600 dark:hover:text-lime-400 text-left">Showcase</button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

/**
 * BackToTop
 * Floating button that appears when scrolling down.
 */
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsVisible(latest > 500);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 p-3 rounded-full bg-lime-500 text-slate-900 shadow-lg shadow-lime-500/30 z-40 hover:bg-lime-400 transition-colors"
    >
      <ArrowUp className="w-6 h-6" />
    </motion.button>
  );
};

/**
 * Main Application Component
 */
const App: React.FC = () => {
  // Theme state - defaults to true (dark) since that was original design
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <ScrollProgress />
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main className="relative">
        <Hero />

        {/* Content Container */}
        <div className="max-w-3xl mx-auto px-6 pb-32">
          
          <AnimatedSection id="physics" title="The Physics of UI">
            <p>
              In the real world, objects don't start and stop instantly. They carry momentum, 
              they have weight, and they interact with friction. When we bring these physical 
              principles into our user interfaces, we create something that feels natural and intuitive.
            </p>
            <p>
              Framer Motion allows us to simulate these forces. The scroll progress bar at the top 
              of this screen isn't just mapping pixels 1:1. It's using a spring physics simulation 
              to catch up to your scroll position, absorbing the jagged movements of a mouse wheel 
              and outputting a fluid motion.
            </p>
            <figure className="my-12">
              <img 
                src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&h=400&auto=format&fit=crop" 
                alt="Abstract fluid simulation representing physics" 
                className="rounded-xl shadow-2xl shadow-slate-300/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-800 w-full object-cover transition-colors duration-300"
              />
              <figcaption className="text-center text-sm text-slate-500 mt-4">
                Visualizing momentum in digital space
              </figcaption>
            </figure>
          </AnimatedSection>

          <AnimatedSection id="implementation" title="Implementation Details">
            <p>
              To achieve the effect you see at the top of the viewport, we utilize the 
              <code className="bg-slate-200 dark:bg-slate-800 text-lime-700 dark:text-lime-300 px-1.5 py-0.5 rounded mx-1 text-sm font-mono transition-colors duration-300">useScroll</code> 
              hook. This gives us a raw value between 0 and 1 representing the scroll distance.
            </p>
            <p>
              However, raw scroll values can be jittery, especially on high-refresh-rate displays 
              or with specific input devices. This is where 
              <code className="bg-slate-200 dark:bg-slate-800 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded mx-1 text-sm font-mono transition-colors duration-300">useSpring</code> 
              comes in. By passing our scroll value through a spring, we dampen the noise and 
              create that "heavy" feel that signifies quality.
            </p>
            <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 my-8 font-mono text-sm overflow-x-auto transition-colors duration-300">
              <div className="text-slate-500 mb-2">// The secret sauce</div>
              <div className="text-emerald-600 dark:text-emerald-400 inline">const</div> <div className="text-slate-800 dark:text-slate-200 inline">scaleX</div> = <div className="text-lime-600 dark:text-lime-400 inline">useSpring</div>(scrollYProgress, {'{'}
              <div className="pl-4 text-slate-500 dark:text-slate-400">stiffness: 100,</div>
              <div className="pl-4 text-slate-500 dark:text-slate-400">damping: 30,</div>
              <div className="pl-4 text-slate-500 dark:text-slate-400">restDelta: 0.001</div>
              {'}'});
            </div>
          </AnimatedSection>

          <AnimatedSection id="responsive" title="Responsive Design Principles">
            <p>
              A truly world-class experience isn't just about animation; it's about consistency across devices. 
              Using Tailwind CSS, we ensure that the typography scales beautifully from mobile phones to 
              large desktop monitors. The scroll indicator works flawlessly on touch devices as well, 
              providing immediate visual feedback to the user's gesture.
            </p>
            <p>
              Notice how the navigation bar blurs the content behind it? This technique, known as 
              backdrop filtration, helps maintain context while ensuring the UI controls remain 
              legible and accessible at all times.
            </p>
          </AnimatedSection>

          <AnimatedSection id="color" title="Color Theory in Motion">
            <p>
              Did you notice the color of the progress bar changing? We mapped the scroll progress 
              not just to the width of the bar, but also to its color.
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-lime-500">
              <li>It starts as an electric <span className="text-lime-600 dark:text-lime-400 font-medium">Lime</span>, capturing attention.</li>
              <li>Transitions to a vivid <span className="text-green-600 dark:text-green-400 font-medium">Neon Green</span> in the middle of the content.</li>
              <li>Ends with a soothing <span className="text-emerald-600 dark:text-emerald-400 font-medium">Emerald</span> as you reach the conclusion.</li>
            </ul>
            <p>
              This subtle cue provides a secondary layer of information about the user's position 
              within the document, reinforcing the spatial mental model of the page.
            </p>
             <figure className="my-12 grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=400&h=300&auto=format&fit=crop" 
                alt="Neon lime abstract light" 
                className="rounded-lg border border-slate-200 dark:border-slate-800 w-full object-cover h-48 transition-colors duration-300"
              />
              <img 
                src="https://images.unsplash.com/photo-1530982011887-3cc11cc85693?q=80&w=400&h=300&auto=format&fit=crop" 
                alt="Deep emerald green texture" 
                className="rounded-lg border border-slate-200 dark:border-slate-800 w-full object-cover h-48 transition-colors duration-300"
              />
            </figure>
          </AnimatedSection>

          <AnimatedSection title="Conclusion">
            <p>
              Web animation has graduated from being a mere embellishment to a core component of 
              interaction design. Tools like Framer Motion and Tailwind CSS empower engineers to 
              build these sophisticated interfaces with clean, maintainable code.
            </p>
            <p>
              The result is a web that feels less like a static document and more like a fluid, 
              responsive environment. Thank you for scrolling through this demonstration.
            </p>
          </AnimatedSection>

          {/* Article Footer */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-12 mt-20 transition-colors duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
                  <Heart className="w-4 h-4 text-emerald-500" />
                  <span>2.4k Likes</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
                  <MessageCircle className="w-4 h-4 text-lime-600 dark:text-lime-500" />
                  <span>18 Comments</span>
                </button>
              </div>
              <div className="flex items-center gap-4 text-slate-500">
                <span className="text-sm">Share this article:</span>
                <button className="hover:text-slate-900 dark:hover:text-white transition-colors"><Share2 className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

        </div>
      </main>
      
      <BackToTop />
    </div>
  );
};

export default App;