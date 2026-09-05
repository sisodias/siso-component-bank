import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { ArrowUpRight, Bookmark, Share2, Play } from "lucide-react";

export default function AdvancedParallaxInterface() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const storyData = [
    {
      id: 1,
      imgUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      subheading: "Collaborate",
      heading: "Built for all of us.",
      position: "left",
      gradient: "from-purple-900/80 via-blue-900/60 to-indigo-800/40"
    },
    {
      id: 2,
      imgUrl: "https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      subheading: "Quality",
      heading: "Never compromise.",
      position: "right",
      gradient: "from-emerald-900/80 via-teal-900/60 to-cyan-800/40"
    },
    {
      id: 3,
      imgUrl: "https://images.unsplash.com/photo-1504610926078-a1611febcad3?q=80&w=2416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      subheading: "Modern",
      heading: "Dress for the best.",
      position: "center",
      gradient: "from-rose-900/80 via-pink-900/60 to-purple-800/40"
    }
  ];

  return (
    <div ref={containerRef} className="relative bg-black overflow-hidden w-full min-h-screen">
      {/* Ambient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      
      {/* Floating Particles */}
      <FloatingParticles mousePosition={mousePosition} />
      
      {/* Story Cards */}
      {storyData.map((story, index) => (
        <CinematicStoryCard
          key={story.id}
          story={story}
          index={index}
          mousePosition={mousePosition}
        />
      ))}
      
      {/* Navigation Constellation */}
      <NavigationConstellation stories={storyData} />
    </div>
  );
}

const CinematicStoryCard = ({ story, index, mousePosition }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { threshold: 0.1 });
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const scaleSpring = useSpring(scale, springConfig);
  const ySpring = useSpring(y, springConfig);

  const getPositionClasses = () => {
    switch (story.position) {
      case "left": return "ml-4 md:ml-12 lg:ml-24";
      case "right": return "mr-4 md:mr-12 lg:mr-24 ml-auto";
      default: return "mx-auto";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      style={{
        y: ySpring,
        scale: scaleSpring,
        opacity,
        rotate
      }}
      className={`relative w-full max-w-7xl h-screen my-20 ${getPositionClasses()}`}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      {/* Main Card Container */}
      <motion.div
        className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl"
        whileHover={{ scale: 1.02, rotateY: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Background Image with Ken Burns Effect */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${story.imgUrl})`,
            scale: useTransform(scrollYProgress, [0, 1], [1, 1.1])
          }}
          animate={{
            scale: [1, 1.05, 1],
            x: [0, -10, 0],
            y: [0, -5, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        {/* Dynamic Gradient Overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${story.gradient}`}
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 0.4, 0.7])
          }}
        />

        {/* Atmospheric Effects */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 bg-white/5 rounded-full blur-xl"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.5
              }}
            />
          ))}
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
          <motion.div
            className="text-center space-y-6"
            style={{
              y: useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50])
            }}
          >
            {/* Subheading with Kinetic Typography */}
            <motion.p
              className="text-2xl md:text-4xl font-light tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {story.subheading.split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  animate={{
                    y: [0, -5, 0],
                    rotateZ: [0, 2, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.1
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.p>

            {/* Main Heading */}
            <motion.h1
              className="text-5xl md:text-8xl font-bold tracking-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{
                textShadow: "0 0 20px rgba(255,255,255,0.5)"
              }}
            >
              {story.heading}
            </motion.h1>

            {/* Interactive Elements */}
            <motion.div
              className="flex gap-6 justify-center items-center mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <ActionButton icon={Play} label="Explore" primary />
              <ActionButton icon={Bookmark} label="Save" />
              <ActionButton icon={Share2} label="Share" />
            </motion.div>
          </motion.div>
        </div>

        {/* Cursor Following Elements */}
        <motion.div
          className="absolute w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none"
          animate={{
            x: (mousePosition.x - window.innerWidth / 2) * 0.02,
            y: (mousePosition.y - window.innerHeight / 2) * 0.02
          }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        />
      </motion.div>

      {/* Expandable Content */}
      <ExpandableContent story={story} />
    </motion.div>
  );
};

const ActionButton = ({ icon: Icon, label, primary = false }) => {
  return (
    <motion.button
      className={`flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-sm transition-all ${
        primary
          ? "bg-white/20 text-white border border-white/30"
          : "bg-white/10 text-white/80 border border-white/20"
      }`}
      whileHover={{ 
        scale: 1.05, 
        backgroundColor: primary ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)",
        boxShadow: "0 0 20px rgba(255,255,255,0.3)"
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={16} />
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
};

const ExpandableContent = ({ story }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        layout
        animate={{ height: isExpanded ? "auto" : "120px" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <h2 className="col-span-1 md:col-span-4 text-2xl font-bold text-white">
            Additional insights about {story.subheading.toLowerCase()}
          </h2>
          <div className="col-span-1 md:col-span-8">
            <p className="text-white/80 text-lg leading-relaxed mb-4">
              Discover the depth behind our {story.subheading.toLowerCase()} philosophy and how it shapes every aspect of our approach.
            </p>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-white/70 text-base leading-relaxed mb-6">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, blanditiis soluta eius quam modi aliquam quaerat odit deleniti minima maiores voluptate est ut saepe accusantium maxime doloremque nulla consectetur possimus.
                </p>
              </motion.div>
            )}
            <motion.button
              className="inline-flex items-center gap-2 text-white font-medium hover:text-white/80 transition-colors"
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isExpanded ? "Show less" : "Learn more"}
              <ArrowUpRight className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FloatingParticles = ({ mousePosition }) => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

const NavigationConstellation = ({ stories }) => {
  return (
    <motion.div
      className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5 }}
    >
      {stories.map((story, index) => (
        <motion.div
          key={story.id}
          className="relative group cursor-pointer"
          whileHover={{ scale: 1.5 }}
          whileTap={{ scale: 0.8 }}
        >
          <div className="w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/80 transition-colors" />
          <div className="absolute left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/80 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap">
              {story.heading}
            </div>
          </div>
          {/* Constellation Lines */}
          {index < stories.length - 1 && (
            <div className="absolute top-6 left-1.5 w-0.5 h-4 bg-white/20" />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};