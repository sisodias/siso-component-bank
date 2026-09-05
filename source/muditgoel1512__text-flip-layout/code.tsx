import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Layers, ArrowRight } from "lucide-react";

// Feature card subcomponent
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.2 } 
      }}
      className="glass rounded-2xl p-6 group cursor-pointer transition-all hover:shadow-glow"
    >
      <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 transition-all group-hover:bg-primary/20 group-hover:shadow-glow">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
};

 export const Component = () => {
  const phrases = ["interfaces", "experiences", "products", "brands"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleHover = () => {
    setIsHovering(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    
    // Reset hover state after animation completes
    setTimeout(() => {
      setIsHovering(false);
    }, 500);
  };

  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "Modern Design",
      description: "Beautiful glassmorphism effects with smooth animations and contemporary aesthetics.",
    },
    {
      icon: <Zap className="h-6 w-6 text-accent" />,
      title: "Lightning Fast",
      description: "Optimized performance with Framer Motion for buttery smooth 60fps animations.",
    },
    {
      icon: <Layers className="h-6 w-6 text-secondary" />,
      title: "Fully Responsive",
      description: "Perfectly adapts to any screen size from mobile to ultrawide displays.",
    },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden gradient-primary">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-[100px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-secondary/20 blur-[100px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px] animate-glow-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left column - Main content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex"
            >
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground shadow-glow">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                Modern UI Component
              </span>
            </motion.div>

            {/* Main heading with flip animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Build stunning{" "}
                <span 
                  className="relative inline-block cursor-pointer"
                  onMouseEnter={handleHover}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentIndex}
                      initial={{ rotateX: 90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      exit={{ rotateX: -90, opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="inline-block rounded-2xl glass px-6 py-2 text-foreground shadow-glow transition-all hover:shadow-glow-accent"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {phrases[currentIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl"
            >
              A reusable text flip component perfect for hero sections, landing pages, and modern SaaS applications. 
              Built with React, TypeScript, and Framer Motion for smooth, professional animations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 rounded-xl gradient-secondary px-8 py-4 text-base font-semibold text-white shadow-glow transition-all hover:shadow-glow-accent"
              >
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 rounded-xl glass px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-white/10"
              >
                View Code
                <Layers className="h-5 w-5 transition-transform group-hover:rotate-12" />
              </motion.button>
            </motion.div>
          </div>

          {/* Right column - Feature cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={0.4 + index * 0.1}
              />
            ))}
            
            {/* Additional decorative card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="glass rounded-2xl p-6 sm:col-span-2 lg:col-span-1 xl:col-span-2"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full bg-gradient-secondary ring-2 ring-background"
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Join 10,000+ developers</p>
                  <p className="text-xs text-muted-foreground">Building amazing experiences</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};