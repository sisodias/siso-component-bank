"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Home, User, Briefcase, Mail, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ScrollNavbarProps {
  items?: NavItem[];
  logo?: string;
  className?: string;
}

const ScrollNavbar = ({ 
  items = [
    { name: "Home", href: "#", icon: Home },
    { name: "About", href: "#", icon: User },
    { name: "Services", href: "#", icon: Briefcase },
    { name: "Contact", href: "#", icon: Mail },
  ],
  logo = "✨ Brand",
  className 
}: ScrollNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100);
  });

  const navVariants = {
    expanded: {
      width: "100%",
      borderRadius: "0px",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    },
    collapsed: {
      width: "64px",
      borderRadius: "32px",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        when: "afterChildren",
      }
    }
  };

  const itemVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      }
    },
    collapsed: {
      opacity: 0,
      x: -20,
      scale: 0.8,
      transition: {
        duration: 0.2,
      }
    }
  };

  const logoVariants = {
    expanded: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      }
    },
    collapsed: {
      opacity: 0,
      scale: 0.5,
      rotate: -90,
      transition: {
        duration: 0.3,
      }
    }
  };

  const hamburgerVariants = {
    expanded: {
      opacity: 0,
      scale: 0.5,
      rotate: 180,
      transition: {
        duration: 0.2,
      }
    },
    collapsed: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: 0.2,
      }
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.2,
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      }
    }
  };

  const sparkleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  };

  const handleNavClick = () => {
    if (isScrolled) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  return (
    <>
      <motion.nav
        ref={navRef}
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-50 h-16 flex items-center justify-center overflow-hidden",
          isScrolled && "cursor-pointer",
          className
        )}
        variants={navVariants}
        animate={isScrolled ? "collapsed" : "expanded"}
        onClick={handleNavClick}
        whileHover={isScrolled ? { scale: 1.05 } : {}}
        whileTap={isScrolled ? { scale: 0.95 } : {}}
      >
        {/* Expanded Navigation */}
        <motion.div
          className="flex items-center justify-between w-full px-6"
          variants={itemVariants}
        >
          {/* Logo */}
          <motion.div
            variants={logoVariants}
            className="flex items-center space-x-2 text-lg font-bold text-foreground"
          >
            <motion.div variants={sparkleVariants} animate="animate">
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
            <span>{logo}</span>
          </motion.div>

          {/* Navigation Items */}
          <motion.div
            className="hidden md:flex items-center space-x-8"
            variants={itemVariants}
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="relative flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {hoveredItem === item.name && (
                    <motion.div
                      layoutId="navbar-hover"
                      className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </motion.a>
              );
            })}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            variants={itemVariants}
            className="md:hidden p-2 text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Collapsed Hamburger Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={hamburgerVariants}
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Menu className="w-6 h-6 text-white" />
          </motion.div>
        </motion.div>
      </motion.nav>

      {/* Mobile/Collapsed Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-80 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-2 text-lg font-bold">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-primary" />
                  </motion.div>
                  <span>{logo}</span>
                </div>
                <motion.button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Menu Items */}
              <div className="p-6 space-y-4">
                {items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      variants={menuItemVariants}
                      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-muted transition-colors group"
                      onClick={() => setIsMenuOpen(false)}
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-5 h-5 text-primary" />
                      </motion.div>
                      <span className="font-medium">{item.name}</span>
                      <motion.div
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        →
                      </motion.div>
                    </motion.a>
                  );
                })}
              </div>

              {/* Menu Footer */}
              <div className="p-6 border-t border-border bg-muted/30">
                <motion.div
                  className="text-center text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Scroll to see the magic ✨
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Demo Content Component
const DemoContent = () => {
  return (
    <div className="min-h-[300vh] bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl mx-auto px-6">
          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Scroll Navigation
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Watch the navigation transform as you scroll down the page
          </motion.p>
          <motion.div
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            ↓ Scroll down to see the magic
          </motion.div>
        </div>
      </div>

      {/* Content Sections */}
      {[1, 2, 3, 4].map((section) => (
        <div key={section} className="h-screen flex items-center justify-center">
          <motion.div
            className="text-center space-y-4 max-w-xl mx-auto px-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold">Section {section}</h2>
            <p className="text-lg text-muted-foreground">
              This is content section {section}. Notice how the navigation bar transforms
              into a compact hamburger menu when you scroll down.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[1, 2, 3, 4].map((card) => (
                <motion.div
                  key={card}
                  className="p-6 bg-muted rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <h3 className="font-semibold mb-2">Card {card}</h3>
                  <p className="text-sm text-muted-foreground">
                    Some content for card {card}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

// Main Demo Component
export const Component = () => {
  return (
    <div className="relative">
      <ScrollNavbar />
      <DemoContent />
    </div>
  );
}
