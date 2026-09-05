"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, Share2, Package, CreditCard, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StageItem {
  id: string;
  text: string;
  completed: boolean;
  icon: React.ReactNode;
}

interface ThemeColors {
  // Background gradients
  outerGradient?: {
    from: string;
    to: string;
  };
  
  // Header colors
  headerBackground?: string;
  headerText?: string;
  percentageText?: string;
  
  // Card colors
  cardBackground?: string;
  dividerColor?: string;
  
  // Stage colors
  stageTitle?: string;
  completedBadge?: {
    background: string;
    text: string;
  };
  todoBadge?: {
    background: string;
    text: string;
  };
  
  // Item colors
  completedIcon?: {
    background: string;
    text: string;
  };
  completedText?: string;
  pendingIcon?: string;
  pendingText?: string;
  
  // Button colors
  button?: {
    background: string;
    hover: string;
    text: string;
  };
}

interface OnboardingStagesProps {
  className?: string;
  enableAnimations?: boolean;
  onButtonClick?: () => void;
  
  // Customization props
  title?: string;
  percentage?: number;
  buttonText?: string;
  
  // Theme customization
  theme?: 'blue' | 'purple' | 'green' | 'orange' | 'custom';
  customColors?: ThemeColors;
  
  // Animation controls
  animationDuration?: number;
  staggerDelay?: number;
  
  // Layout props
  variant?: 'default' | 'compact' | 'expanded';
  showPercentage?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
}

// Predefined theme configurations
const themes: Record<string, ThemeColors> = {
  blue: {
    outerGradient: { from: "from-blue-100", to: "to-purple-100" },
    headerText: "text-blue-800",
    percentageText: "text-blue-800",
    cardBackground: "bg-white",
    dividerColor: "bg-gray-200",
    stageTitle: "text-gray-900",
    completedBadge: { background: "bg-green-100", text: "text-green-700" },
    todoBadge: { background: "bg-blue-100", text: "text-blue-700" },
    completedIcon: { background: "bg-green-500", text: "text-white" },
    completedText: "text-gray-700",
    pendingIcon: "text-gray-500",
    pendingText: "text-gray-500",
    button: { background: "bg-blue-600", hover: "hover:bg-blue-700", text: "text-white" },
  },
  purple: {
    outerGradient: { from: "from-purple-100", to: "to-pink-100" },
    headerText: "text-purple-800",
    percentageText: "text-purple-800",
    cardBackground: "bg-white",
    dividerColor: "bg-gray-200",
    stageTitle: "text-gray-900",
    completedBadge: { background: "bg-green-100", text: "text-green-700" },
    todoBadge: { background: "bg-purple-100", text: "text-purple-700" },
    completedIcon: { background: "bg-green-500", text: "text-white" },
    completedText: "text-gray-700",
    pendingIcon: "text-gray-500",
    pendingText: "text-gray-500",
    button: { background: "bg-purple-600", hover: "hover:bg-purple-700", text: "text-white" },
  },
  green: {
    outerGradient: { from: "from-green-100", to: "to-emerald-100" },
    headerText: "text-green-800",
    percentageText: "text-green-800",
    cardBackground: "bg-white",
    dividerColor: "bg-gray-200",
    stageTitle: "text-gray-900",
    completedBadge: { background: "bg-emerald-100", text: "text-emerald-700" },
    todoBadge: { background: "bg-green-100", text: "text-green-700" },
    completedIcon: { background: "bg-emerald-500", text: "text-white" },
    completedText: "text-gray-700",
    pendingIcon: "text-gray-500",
    pendingText: "text-gray-500",
    button: { background: "bg-green-600", hover: "hover:bg-green-700", text: "text-white" },
  },
  orange: {
    outerGradient: { from: "from-orange-100", to: "to-amber-100" },
    headerText: "text-orange-800",
    percentageText: "text-orange-800",
    cardBackground: "bg-white",
    dividerColor: "bg-gray-200",
    stageTitle: "text-gray-900",
    completedBadge: { background: "bg-green-100", text: "text-green-700" },
    todoBadge: { background: "bg-orange-100", text: "text-orange-700" },
    completedIcon: { background: "bg-green-500", text: "text-white" },
    completedText: "text-gray-700",
    pendingIcon: "text-gray-500",
    pendingText: "text-gray-500",
    button: { background: "bg-orange-600", hover: "hover:bg-orange-700", text: "text-white" },
  },
};

export function OnboardingStages({
  className,
  enableAnimations = true,
  onButtonClick,
  title = "ONBOARDING",
  percentage = 40,
  buttonText = "Let's Go",
  theme = 'blue',
  customColors,
  animationDuration = 1500,
  staggerDelay = 0.12,
  variant = 'default',
  showPercentage = true,
  rounded = 'xl',
}: OnboardingStagesProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Get theme colors
  const themeColors = customColors || themes[theme] || themes.blue;

  // Responsive padding based on variant
  const variantStyles = {
    compact: "p-0.5",
    default: "p-1",
    expanded: "p-2",
  };

  // Rounded styles
  const roundedStyles = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
  };

  // Animate percentage counter on mount
  useEffect(() => {
    if (!enableAnimations || shouldReduceMotion) {
      setDisplayPercentage(percentage);
      return;
    }

    const startTime = Date.now();

    const animateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // More sophisticated easing with overshoot
      const easeOut = 1 - Math.pow(1 - progress, 2.5);
      const currentValue = Math.round(easeOut * percentage);
      
      setDisplayPercentage(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      }
    };

    // Longer delay for more dramatic entrance
    const timeout = setTimeout(animateCounter, 800);
    return () => clearTimeout(timeout);
  }, [enableAnimations, shouldReduceMotion, percentage, animationDuration]);

  const stage1Items: StageItem[] = [
    {
      id: "mission",
      text: "Define your brand mission",
      completed: true,
      icon: <Check className="w-4 h-4" />,
    },
    {
      id: "logo",
      text: "Upload your brand logo",
      completed: true,
      icon: <Check className="w-4 h-4" />,
    },
    {
      id: "colors",
      text: "Select your brand colors",
      completed: true,
      icon: <Check className="w-4 h-4" />,
    },
  ];

  const stage2Items: StageItem[] = [
    {
      id: "social",
      text: "Connect your social media accounts",
      completed: false,
      icon: <Share2 className="w-4 h-4" />,
    },
    {
      id: "product",
      text: "Add your first product/service",
      completed: false,
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: "payment",
      text: "Set up your payment methods",
      completed: false,
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      id: "shipping",
      text: "Configure your shipping options",
      completed: false,
      icon: <Truck className="w-4 h-4" />,
    },
  ];

  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  // Enhanced animation variants with more sophisticated timing
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      scale: 0.92,
      rotateX: 10, // Subtle 3D entrance effect
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 32,
        mass: 0.9,
        staggerChildren: staggerDelay,
        delayChildren: 0.15,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 28,
        mass: 0.7,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -25, 
      scale: 0.95,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.6,
      },
    },
  };

  const stageContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay * 0.8,
        delayChildren: 0.1,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 22,
        mass: 0.5,
      },
    },
  };

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      y: 25, 
      scale: 0.95,
      rotateX: 5,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
        delay: 1.2, // Much longer delay for dramatic entrance
      },
    },
  };

  const percentageVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -10 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        mass: 0.6,
        delay: 1.5, // Animated after counter finishes
      },
    },
  };

  return (
    <motion.div 
      className={cn("relative", className)}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      variants={shouldAnimate ? containerVariants : {}}
    >
      {/* Outer card with customizable gradient */}
      <div className={cn(
        variantStyles[variant],
        `bg-gradient-to-br ${themeColors.outerGradient?.from} ${themeColors.outerGradient?.to}`,
        roundedStyles[rounded],
        "shadow-lg"
      )}>
        {/* Header */}
        <motion.div
          className="flex items-center justify-between px-4 py-2"
          variants={shouldAnimate ? headerVariants : {}}
        >
          <h1 className={cn(
            "text-md font-semibold tracking-wide",
            themeColors.headerText
          )}>
            {title}
          </h1>
          {showPercentage && (
            <motion.div
              className={cn("text-md font-bold", themeColors.percentageText)}
              variants={shouldAnimate ? percentageVariants : {}}
            >
              {displayPercentage}%
            </motion.div>
          )}
        </motion.div>
        
        {/* Inner card */}
        <motion.div
          className={cn(
            themeColors.cardBackground,
            variant === 'compact' ? 'rounded-lg' : 'rounded-2xl',
            "overflow-hidden"
          )}
          variants={shouldAnimate ? itemVariants : {}}
        >
          <div className={cn(
            variant === 'compact' ? 'p-4 pt-3' : variant === 'expanded' ? 'p-10 pt-8' : 'p-8 pt-6'
          )}>

            {/* Stage 1 */}
            <motion.div
              className="mb-8"
              variants={shouldAnimate ? stageContainerVariants : {}}
            >
              <motion.div 
                className="flex items-center justify-between mb-6"
                variants={shouldAnimate ? itemVariants : {}}
              >
                <h2 className={cn("text-lg font-semibold", themeColors.stageTitle)}>
                  STAGE 1
                </h2>
                <span className={cn(
                  "px-3 py-1 text-sm font-medium rounded-full",
                  themeColors.completedBadge?.background,
                  themeColors.completedBadge?.text
                )}>
                  Completed
                </span>
              </motion.div>

              <motion.div 
                className="space-y-4"
                variants={shouldAnimate ? stageContainerVariants : {}}
              >
                {stage1Items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center space-x-3"
                    variants={shouldAnimate ? itemVariants : {}}
                    custom={index}
                  >
                    <motion.div
                      className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full",
                        themeColors.completedIcon?.background,
                        themeColors.completedIcon?.text
                      )}
                      variants={shouldAnimate ? iconVariants : {}}
                      whileHover={
                        shouldAnimate
                          ? {
                              scale: 1.15,
                              rotate: 10,
                              transition: {
                                type: "spring",
                                stiffness: 500,
                                damping: 20,
                              },
                            }
                          : {}
                      }
                    >
                      <Check className="w-3 h-3" />
                    </motion.div>
                    <span className={cn("font-medium", themeColors.completedText)}>
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Divider */}
            <motion.div
              className={cn("h-px mb-8", themeColors.dividerColor)}
              variants={shouldAnimate ? itemVariants : {}}
            />

            {/* Stage 2 */}
            <motion.div
              className="mb-8"
              variants={shouldAnimate ? stageContainerVariants : {}}
            >
              <motion.div 
                className="flex items-center justify-between mb-6"
                variants={shouldAnimate ? itemVariants : {}}
              >
                <h2 className={cn("text-lg font-semibold", themeColors.stageTitle)}>
                  STAGE 2
                </h2>
                <span className={cn(
                  "px-3 py-1 text-sm font-medium rounded-full",
                  themeColors.todoBadge?.background,
                  themeColors.todoBadge?.text
                )}>
                  To Do
                </span>
              </motion.div>

              <motion.div 
                className="space-y-4"
                variants={shouldAnimate ? stageContainerVariants : {}}
              >
                {stage2Items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center space-x-3"
                    variants={shouldAnimate ? itemVariants : {}}
                    custom={index}
                  >
                    <motion.div
                      className={cn("mr-2", themeColors.pendingIcon)}
                      variants={shouldAnimate ? iconVariants : {}}
                      whileHover={
                        shouldAnimate
                          ? {
                              scale: 1.1,
                              x: 2,
                              transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                              },
                            }
                          : {}
                      }
                    >
                      {item.icon}
                    </motion.div>
                    <span className={cn("font-medium", themeColors.pendingText)}>
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Button */}
            <motion.button
              className={cn(
                "w-full cursor-pointer font-semibold py-4 px-6 rounded-2xl transition-all duration-200",
                themeColors.button?.background,
                themeColors.button?.hover,
                themeColors.button?.text,
                "transform-gpu" // Ensure hardware acceleration
              )}
              variants={shouldAnimate ? buttonVariants : {}}
              whileHover={
                shouldAnimate
                  ? {
                      scale: 1.02,
                      y: -3,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      },
                    }
                  : {}
              }
              whileTap={shouldAnimate ? { scale: 0.98, y: -1 } : {}}
              onClick={onButtonClick}
            >
              {buttonText}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
