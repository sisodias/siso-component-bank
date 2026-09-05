import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, animate } from 'framer-motion';
import { ArrowRight, ShieldCheck, SlidersHorizontal, Layers, GitCommitHorizontal, TrendingUp } from 'lucide-react';

// Define TypeScript interfaces for component props
// Adheres to: Component Structure guideline
interface AnimatedNumberProps {
  value: number;
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}

// Animated Number Component for the count-up effect
// Adheres to: Performance (dedicated component for complex animation)
const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value }) => {
  const controls = useAnimation();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        transition: { duration: 0.5 }
      });
      // Animate number from 0 to target value
      const animation = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate(latest) {
          if (ref.current) {
            ref.current.textContent = `$${Math.round(latest).toLocaleString()}K`;
          }
        },
      });
      return () => animation.stop();
    }
  }, [inView, value, controls]);

  return <motion.span ref={ref} initial={{ opacity: 0 }} animate={controls} className="text-6xl font-bold text-slate-800" />;
};

// Simple feature card for left and right columns
const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, className = '' }) => (
    <div className={`bg-white p-8 rounded-2xl shadow-lg w-full ${className}`}>
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500">{description}</p>
    </div>
);

// List-style feature for the right-most card
const FeatureListItem: React.FC<{icon: React.ElementType, label: string}> = ({ icon: Icon, label }) => (
    <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full">
            <Icon className="w-4 h-4 text-slate-500" />
        </div>
        <span className="font-medium text-slate-600">{label}</span>
    </div>
);


// Main App component that renders the full hero section
// Adheres to: Code Quality 
export function Component() {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="bg-slate-50 min-h-screen w-full flex items-center justify-center font-sans p-8">
      <motion.div 
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="w-full max-w-6xl mx-auto"
      >
        {/* HERO TEXT SECTION */}
        <motion.div variants={itemVariants} className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-800 leading-tight">
            Your trusted world wide <br/>
            <span className="bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">
              investment firm
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            KKR offers solutions across alternative assets—real estate, private credit, private equity and infrastructure—delivering deep expertise, rigorous research and disciplined execution worldwide.
          </p>
          <div className="mt-8 flex justify-center items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              Start investing today
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="bg-white text-slate-700 font-semibold py-3 px-6 rounded-lg border border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50 flex items-center space-x-2"
            >
              <span>View our story</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* FEATURE CARDS SECTION */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Card 1: Secure child's future */}
          <FeatureCard 
            icon={ShieldCheck}
            title="Secure your child's future."
            description="Invest early, grow smart, and build a confident future for your child."
          />

          {/* Card 2: Main feature card */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full border-t-4 border-blue-500 transform md:scale-110">
            <div className="flex justify-between items-center mb-4">
              <img 
                src="https://placehold.co/48x48/E2E8F0/475569?text=AV" 
                alt="User Avatar" 
                className="w-12 h-12 rounded-full"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/48x48/E2E8F0/475569?text=AV'; }}
              />
              <div className="flex space-x-2">
                <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded-full">Age 25</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">2044</span>
              </div>
            </div>
            <div className="text-center my-6">
              <AnimatedNumber value={299} />
              <p className="text-slate-600 font-medium mt-2">Seed funding for your startup</p>
            </div>
            <div className="flex items-center justify-center space-x-3 text-blue-600 font-semibold">
              <TrendingUp className="w-5 h-5" />
              <span>Keep track of growth</span>
            </div>
          </div>

          {/* Card 3: Feature list */}
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full space-y-5">
            <FeatureListItem icon={SlidersHorizontal} label="CUSTOMIZABLE" />
            <FeatureListItem icon={Layers} label="FLEXIBLE" />
            <FeatureListItem icon={GitCommitHorizontal} label="FULL CONTROL" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
