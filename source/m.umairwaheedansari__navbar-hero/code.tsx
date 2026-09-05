import React, { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types for better structure
interface NavLink {
  id: string | number;
  title: string;
  path: string;
}

interface Logo {
  full: string;
  short: string;
}

interface HeroConfig {
  headline: string;
  subheadline: string;
  cta: {
    text: string;
    path: string;
  };
}

interface NavbarProps {
  logo: Logo;
  links: NavLink[];
  hero?: HeroConfig;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  className?: string;
}

// Enhanced Navbar Component
const EnhancedNavbar: React.FC<NavbarProps> = ({
  logo,
  links,
  hero,
  currentPath = "/",
  onNavigate,
  className = ""
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleCollapse = () => {
    setCollapsed(prev => !prev);
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    onNavigate?.(path);
    setIsMobileMenuOpen(false);
  };

  // Focus management for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      const firstLink = mobileMenuRef.current.querySelector("a");
      firstLink?.focus();
    }
  }, [isMobileMenuOpen]);

  // Animation variants
  const linksContainer = {
    hidden: { opacity: 0, y: -8 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        staggerChildren: 0.06, 
        delayChildren: 0.05 
      } 
    },
    exit: { opacity: 0, y: -8 },
  };

  const linkItem = {
    hidden: { opacity: 0, y: -6 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.22 } 
    },
  };

  const mobileMenu = {
    hidden: { y: -10, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "tween", duration: 0.28 } 
    },
    exit: { 
      y: -10, 
      opacity: 0, 
      transition: { type: "tween", duration: 0.22 } 
    },
  };

  const heroContainer = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.2, 
        delayChildren: 0.5 
      } 
    },
  };

  const heroItem = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    },
  };

  return (
    <>
      {/* Hero Section */}
      {hero && (
        <motion.section
          className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-gradient-to-b from-background/20 to-muted/20 backdrop-blur-sm z-10"
          variants={heroContainer}
          initial="hidden"
          animate="show"
        >
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <motion.h1
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-6"
              variants={heroItem}
            >
              {hero.headline}
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-8"
              variants={heroItem}
            >
              {hero.subheadline}
            </motion.p>
            <motion.div variants={heroItem}>
              <button
                onClick={() => handleNavigate(hero.cta.path)}
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-primary-foreground bg-gradient-to-r from-primary to-blue-600 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {hero.cta.text}
              </button>
            </motion.div>
          </div>
          
          {/* Background Effects */}
          <div className="absolute inset-0 z-[-1] opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </motion.section>
      )}

      {/* Navbar */}
      <motion.nav
        aria-label="Main navigation"
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 shadow-lg rounded-2xl backdrop-blur-lg border border-border bg-background/90 text-foreground flex items-center h-16 max-w-7xl ${className}`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          width: collapsed ? "80px" : "90%" 
        }}
        transition={{ 
          width: { type: "spring", stiffness: 120, damping: 20 }, 
          opacity: { duration: 0.4, delay: 0.3 }, 
          y: { duration: 0.4, delay: 0.3 } 
        }}
      >
        <div className="flex items-center w-full h-full">
          {/* Logo/Brand */}
          <div
            onClick={toggleCollapse}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleCollapse()}
            tabIndex={0}
            role="button"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            aria-expanded={!collapsed}
            className="flex items-center justify-center px-4 py-3 cursor-pointer hover:bg-accent rounded-lg m-2 transition-all duration-300 h-[85%] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <span className="font-bold text-lg whitespace-nowrap bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {collapsed ? logo.short : logo.full}
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex ml-auto items-center h-full">
            <AnimatePresence>
              {!collapsed && (
                <motion.ul
                  className="flex items-center gap-2 pr-4 h-full"
                  variants={linksContainer}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {links.map((nav) => (
                    <motion.li 
                      key={nav.id} 
                      variants={linkItem} 
                      className="h-full flex items-center"
                    >
                      <button
                        onClick={() => handleNavigate(nav.path)}
                        className={`p-3 rounded-lg hover:bg-accent transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          currentPath === nav.path 
                            ? "bg-accent text-accent-foreground" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {nav.title}
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          {!collapsed && (
            <div className="lg:hidden ml-auto pr-4 h-full flex items-center">
              <button
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                className="p-2 rounded-lg hover:bg-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            className="fixed top-[5rem] left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-7xl rounded-b-2xl bg-background/95 backdrop-blur-lg border border-border shadow-lg"
            variants={mobileMenu}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <ul className="flex flex-col">
              {links.map((nav) => (
                <li 
                  key={nav.id} 
                  className="border-b border-border last:border-0"
                >
                  <button
                    onClick={() => handleNavigate(nav.path)}
                    className={`w-full text-left block px-4 py-3 hover:bg-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset ${
                      currentPath === nav.path 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {nav.title}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Demo Component
const NavbarDemo = () => {
  const [currentPath, setCurrentPath] = useState("/");

  const demoConfig = {
    logo: { 
      full: "The Coding Journey", 
      short: "TCJ" 
    },
    links: [
      { id: 1, title: "Home", path: "/" },
      { id: 2, title: "About Us", path: "/about" },
      { id: 3, title: "Our Team", path: "/team" },
      { id: 4, title: "Contact Us", path: "/contact" },
    ],
    hero: {
      headline: "Welcome to The Coding Journey",
      subheadline: "Explore the future of coding with our innovative platform",
      cta: { text: "Get Started", path: "/start" },
    },
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    console.log(`Navigating to: ${path}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EnhancedNavbar
        logo={demoConfig.logo}
        links={demoConfig.links}
        hero={demoConfig.hero}
        currentPath={currentPath}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default NavbarDemo;