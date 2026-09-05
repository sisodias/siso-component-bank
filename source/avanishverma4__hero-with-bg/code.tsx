import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const DesignHero = () => {
  const stats = [
    { value: '200+', label: 'Projects Delivered' },
    { value: '50+', label: 'Clients Worldwide' },
    { value: '8', label: 'Years in Practice' },
    { value: '12', label: 'Team Members' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="relative overflow-hidden bg-white/5 border-white/10 border rounded-2xl w-full h-screen">
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
      
      {/* Background Image */}
      <img
        src="https://plus.unsplash.com/premium_photo-1732098509325-a788722be342?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Creative team working on design projects"
        className="w-full h-full object-cover"
        loading="eager"
      />
      
      {/* Bottom Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex items-end"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="w-full sm:p-8 pt-6 pr-6 pb-6 pl-6">
          <div className="max-w-3xl">
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-7xl text-white font-bold tracking-tighter drop-shadow-lg"
            >
              Design that moves brands forward
            </motion.h2>
            
            <motion.p
              variants={itemVariants}
              className="sm:text-lg leading-relaxed text-lg font-normal text-white/90 mt-3 drop-shadow-sm"
            >
              We craft brand identities, digital products, and strategic campaigns for ambitious teams. From concept to
              launch, our studio blends clarity, utility, and aesthetics to create work that performs and endures. Explore a
              curated reel of recent collaborations and outcomes.
            </motion.p>
            
            <motion.div variants={itemVariants} className="mt-4">
              <motion.a
                href="#showreel"
                className="inline-flex items-center gap-2 hover:bg-white/15 text-sm font-medium text-white tracking-tight bg-white/8 backdrop-blur-sm rounded-full pt-2 pr-4 pb-2 pl-4 border border-white/15 shadow-sm transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4 stroke-1.5" />
                <span>Watch Showreel</span>
              </motion.a>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={statVariants}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                className="rounded-xl bg-white/6 backdrop-blur-sm border border-white/10 p-3 shadow-sm transition-all duration-300"
              >
                <div className="text-xl font-semibold tracking-tight text-white drop-shadow-sm">
                  {stat.value}
                </div>
                <p className="text-[11px] text-white/80 mt-0.5">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DesignHero;