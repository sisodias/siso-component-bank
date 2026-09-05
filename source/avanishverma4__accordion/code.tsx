import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Sparkles, 
  Zap, 
  Heart, 
  Star, 
  Moon, 
  Sun,
  Rocket,
  Palette,
  Code
} from 'lucide-react';

// shadcn/ui components (simplified implementations)
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '',
  onClick 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 bg-blue-600 hover:bg-blue-700 text-white',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700',
    ghost: 'hover:bg-accent hover:text-accent-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Accordion Components
interface AccordionItemData {
  id: string;
  title: string;
  content: {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    features: string[];
  };
}

const AccordionItem: React.FC<{
  item: AccordionItemData;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ item, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {item.title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-white dark:bg-gray-900">
              <CreativeCard content={item.content} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CreativeCard: React.FC<{
  content: AccordionItemData['content'];
}> = ({ content }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-0 opacity-10 ${content.color}`} />
        
        {/* Animated floating accent */}
        <motion.div
          className="absolute top-4 right-4"
          animate={{ 
            y: isHovered ? -8 : 0,
            rotate: isHovered ? 12 : 0,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className={`p-3 rounded-full ${content.color} text-white shadow-lg`}>
            {content.icon}
          </div>
        </motion.div>

        <CardContent>
          <motion.h3 
            className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3"
            animate={{ x: isHovered ? 8 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {content.title}
          </motion.h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {content.description}
          </p>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Features:</h4>
            <ul className="space-y-2">
              {content.features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-center text-gray-600 dark:text-gray-300"
                >
                  <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button>
                Learn More
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline">
                Try Demo
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Theme Toggle Component
const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage and system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldBeDark);
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-6 right-6 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5 text-yellow-500" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5 text-blue-600" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Main AccordionPage Component
const AccordionPage: React.FC = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const accordionData: AccordionItemData[] = [
    {
      id: 'design',
      title: 'Creative Design Solutions',
      content: {
        title: 'Design That Inspires',
        description: 'Transform your vision into stunning visual experiences with our creative design solutions. We blend aesthetics with functionality to create memorable user experiences.',
        icon: <Palette className="w-6 h-6" />,
        color: 'bg-gradient-to-br from-purple-500 to-pink-600',
        features: [
          'Custom UI/UX Design',
          'Brand Identity Development',
          'Responsive Design Systems',
          'Interactive Prototypes'
        ]
      }
    },
    {
      id: 'development',
      title: 'Modern Development',
      content: {
        title: 'Code That Performs',
        description: 'Build robust, scalable applications with cutting-edge technologies. Our development approach ensures your product is fast, secure, and future-ready.',
        icon: <Code className="w-6 h-6" />,
        color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
        features: [
          'React & TypeScript',
          'Performance Optimization',
          'Cloud Architecture',
          'CI/CD Pipelines'
        ]
      }
    },
    {
      id: 'innovation',
      title: 'Innovation & Growth',
      content: {
        title: 'Ideas That Scale',
        description: 'Accelerate your business growth with innovative solutions. We help you identify opportunities and implement strategies that drive real results.',
        icon: <Rocket className="w-6 h-6" />,
        color: 'bg-gradient-to-br from-green-500 to-emerald-600',
        features: [
          'Market Analysis',
          'Growth Strategy',
          'Digital Transformation',
          'Performance Metrics'
        ]
      }
    },
    {
      id: 'experience',
      title: 'User Experience Excellence',
      content: {
        title: 'Experiences That Delight',
        description: 'Create meaningful connections with your users through exceptional experiences. Every interaction is designed to engage, convert, and retain.',
        icon: <Heart className="w-6 h-6" />,
        color: 'bg-gradient-to-br from-red-500 to-rose-600',
        features: [
          'User Research',
          'Journey Mapping',
          'A/B Testing',
          'Conversion Optimization'
        ]
      }
    }
  ];

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
      {/* Orthogonal Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <ThemeToggle />

      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center justify-center mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Creative Solutions Hub
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our range of services designed to elevate your business through innovative design and development.
            </p>
          </motion.div>

          {/* Accordion */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {accordionData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <AccordionItem
                  item={item}
                  isOpen={openAccordion === item.id}
                  onToggle={() => toggleAccordion(item.id)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="text-center mt-16 py-8 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-gray-600 dark:text-gray-400">
              Built with React, TypeScript, Tailwind CSS, and Framer Motion
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AccordionPage;