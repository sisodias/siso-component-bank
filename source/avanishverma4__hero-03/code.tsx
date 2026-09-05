import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall, Sun, Moon } from "lucide-react";

// Theme Toggle Component
function ThemeToggle({ theme, setTheme }) {
  const buttonStyles = theme === "dark"
    ? "bg-white text-black border-white hover:bg-gray-200"
    : "bg-black text-white border-black hover:bg-gray-800";
    
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`fixed top-4 right-4 z-50 p-2 rounded-lg border-2 transition-colors ${buttonStyles}`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}

// Grid Background Component
function GridBackground({ theme }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid-pattern"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke={theme === "dark" ? "#333333" : "#e5e5e5"}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
}

// Button Component
function Button({ children, variant = "default", size = "default", className = "", ...props }) {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    outline: "border-2 border-black bg-transparent hover:bg-black hover:text-white"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8"
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Main Hero Component
function Hero() {
  const [theme, setTheme] = useState("dark");
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["amazing", "innovative", "powerful", "beautiful", "intelligent"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  // Black and white theme styles
  const themeStyles = theme === "dark"
    ? {
        background: "bg-black",
        text: "text-white",
        textMuted: "text-gray-400",
        accent: "text-white",
        buttonPrimary: "bg-white text-black hover:bg-gray-200",
        buttonSecondary: "bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-700",
        buttonOutline: "border-2 border-white bg-transparent hover:bg-white hover:text-black"
      }
    : {
        background: "bg-white",
        text: "text-black",
        textMuted: "text-gray-600",
        accent: "text-black",
        buttonPrimary: "bg-black text-white hover:bg-gray-800",
        buttonSecondary: "bg-gray-100 text-black hover:bg-gray-200 border-2 border-gray-300",
        buttonOutline: "border-2 border-black bg-transparent hover:bg-black hover:text-white"
      };

  return (
    <div className={`w-full h-screen relative ${themeStyles.background} ${themeStyles.text} transition-colors duration-300`}>
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <GridBackground theme={theme} />
      
      <div className="container mx-auto relative z-10 h-full">
        <div className="flex gap-8 items-center justify-center flex-col px-4 h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              className={`gap-4 h-9 rounded-md px-3 inline-flex items-center justify-center text-sm font-medium transition-colors ${themeStyles.buttonSecondary}`}
            >
              Read our launch article 
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <MoveRight className="w-4 h-4 ml-2" />
              </motion.div>
            </button>
          </motion.div>

          <div className="flex gap-6 flex-col">
            <motion.h1
              className="text-5xl md:text-7xl max-w-3xl tracking-tighter text-center font-regular leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className={themeStyles.text}>This is something</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-6 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className={`absolute font-semibold ${themeStyles.accent}`}
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            <motion.p
              className={`text-lg md:text-xl leading-relaxed tracking-tight ${themeStyles.textMuted} max-w-2xl text-center`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Managing a small business today is already tough. Avoid further
              complications by ditching outdated, tedious trade methods. Our
              goal is to streamline SMB trade, making it easier and faster than
              ever.
            </motion.p>
          </div>

          <motion.div
            className="flex flex-row gap-4 md:gap-6 flex-wrap justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              className={`gap-4 h-11 rounded-md px-8 inline-flex items-center justify-center text-sm font-medium transition-colors ${themeStyles.buttonOutline}`}
            >
              Jump on a call 
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <PhoneCall className="w-4 h-4 ml-2" />
              </motion.div>
            </button>
            <button
              className={`gap-4 h-11 rounded-md px-8 inline-flex items-center justify-center text-sm font-medium transition-colors ${themeStyles.buttonPrimary}`}
            >
              Sign up here 
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <MoveRight className="w-4 h-4 ml-2" />
              </motion.div>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Hero;