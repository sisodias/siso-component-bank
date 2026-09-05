import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion';
import { 
  Copy, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  Shield, 
  Check, 
  Unlock, 
  Zap,
  Settings2,
  RotateCcw,
  Sun,
  Moon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * UTILITIES
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * UI COMPONENTS
 */

// Tooltip Component
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'bottom';
}

const Tooltip = ({ content, children, className, side = 'top' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={cn("relative flex items-center justify-center", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: side === 'top' ? 5 : -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === 'top' ? 5 : -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 px-3 py-1.5 text-xs font-medium rounded-md shadow-xl whitespace-nowrap pointer-events-none",
              "bg-zinc-900 text-zinc-100 border border-zinc-700", // Dark mode default
              "dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700",
              "light:bg-white light:text-zinc-900 light:border-zinc-200", // Not real utility, handling via parent class usually, but standard tailwind:
              "bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700", // Corrected
              side === 'top' ? "bottom-full mb-2.5" : "top-full mt-2.5"
            )}
          >
            {content}
            <div className={cn(
              "absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45",
              "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700",
              side === 'top' ? "-bottom-1 border-r border-b" : "-top-1 border-l border-t"
            )} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Button Component
interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-lg focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black',
      secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700',
      ghost: 'bg-transparent hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white',
      outline: 'border border-zinc-200 bg-transparent hover:bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:text-white',
      neon: 'bg-neon-green text-black hover:bg-[#33ffb0] shadow-[0_0_20px_rgba(0,255,157,0.4)] focus:ring-offset-2 focus:ring-offset-black',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 text-lg',
      icon: 'h-10 w-10 p-0 flex items-center justify-center',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

// Switch Component
interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const Switch = ({ checked, onCheckedChange, id, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy }: SwitchProps) => {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 focus:ring-offset-white',
        checked ? 'bg-neon-blue' : 'bg-zinc-300 dark:bg-zinc-700'
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
};

// Card Component
const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn(
    'rounded-xl border shadow-2xl backdrop-blur-xl',
    'bg-white/60 border-zinc-200/50', // Light mode - increased opacity
    'dark:bg-zinc-900/60 dark:border-zinc-800/80', // Dark mode - improved contrast against zinc-950
    className
  )}>
    {children}
  </div>
);

// Slider Component
interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
  id?: string;
  'aria-labelledby'?: string;
}

const Slider = ({ value, min, max, step = 1, onChange, className, id, 'aria-labelledby': ariaLabelledBy }: SliderProps) => {
  // Logic to handle gradient in both themes requires CSS variables or conditional logic.
  // We'll use CSS variable injection via style attribute for the background gradient colors.
  
  return (
    <div className={cn('relative flex w-full touch-none select-none items-center group', className)}>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        aria-labelledby={ariaLabelledBy}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full appearance-none rounded-full outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 focus:ring-offset-white text-zinc-900 dark:text-white"
        style={{
          background: `linear-gradient(to right, currentColor 0%, currentColor ${(
            ((value - min) / (max - min)) *
            100
          ).toFixed(1)}%, rgba(128,128,128,0.3) ${(
            ((value - min) / (max - min)) *
            100
          ).toFixed(1)}%, rgba(128,128,128,0.3) 100%)`,
        }}
      />
    </div>
  );
};

/**
 * PASSWORD LOGIC & CONSTANTS
 */

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  defaultSymbols: '!@#$%^&*()-_=+[]{};:,.<>?/|',
};

type StrengthLevel = 'veryweak' | 'weak' | 'medium' | 'strong' | 'verystrong' | 'extremelystrong';

const STRENGTH_LEVELS: StrengthLevel[] = ['veryweak', 'weak', 'medium', 'strong', 'verystrong', 'extremelystrong'];

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

// Updated colors for better contrast on varying backgrounds
const getStrengthColor = (strength: StrengthLevel) => {
  switch (strength) {
    case 'veryweak':
      return 'text-red-500 dark:text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]';
    case 'weak':
      return 'text-orange-500 dark:text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]';
    case 'medium':
      return 'text-amber-500 dark:text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]';
    case 'strong':
      return 'text-yellow-500 dark:text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]';
    case 'verystrong':
      return 'text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]';
    case 'extremelystrong':
      return 'text-cyan-500 dark:text-cyan-300 drop-shadow-[0_0_12px_rgba(103,232,249,0.8)]';
    default:
      return 'text-zinc-500 dark:text-zinc-400';
  }
};

const getStrengthStyles = (level: StrengthLevel) => {
  switch (level) {
    case 'veryweak': return { color: '#f87171', shadow: '0 0 12px rgba(248,113,113,0.6)' }; // red-400
    case 'weak': return { color: '#fb923c', shadow: '0 0 12px rgba(251,146,60,0.6)' }; // orange-400
    case 'medium': return { color: '#fbbf24', shadow: '0 0 12px rgba(251,191,36,0.6)' }; // amber-400
    case 'strong': return { color: '#facc15', shadow: '0 0 15px rgba(250,204,21,0.7)' }; // yellow-400
    case 'verystrong': return { color: '#34d399', shadow: '0 0 15px rgba(52,211,153,0.7)' }; // emerald-400
    case 'extremelystrong': return { color: '#22d3ee', shadow: '0 0 20px rgba(34,211,238,0.9)' }; // cyan-400
    default: return { color: '#71717a', shadow: 'none' };
  }
};

const getStrengthLabel = (strength: StrengthLevel) => {
  switch (strength) {
    case 'veryweak': return 'Very Weak';
    case 'weak': return 'Weak';
    case 'medium': return 'Medium';
    case 'strong': return 'Strong';
    case 'verystrong': return 'Very Strong';
    case 'extremelystrong': return 'Extremely Strong';
    default: return 'Unknown';
  }
};

const getStrengthPercentage = (strength: StrengthLevel) => {
  switch (strength) {
    case 'veryweak': return '16%';
    case 'weak': return '33%';
    case 'medium': return '50%';
    case 'strong': return '66%';
    case 'verystrong': return '83%';
    case 'extremelystrong': return '100%';
    default: return '0%';
  }
};

/**
 * MAIN COMPONENT
 */

export default function App() {
  // Initialize theme from localStorage or system preference, default to dark
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [customSymbols, setCustomSymbols] = useState(CHAR_SETS.defaultSymbols);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState<StrengthLevel>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  const calculateStrength = useCallback((pwd: string) => {
    if (!pwd) return 'veryweak';

    let poolSize = 0;
    if (/[a-z]/.test(pwd)) poolSize += 26;
    if (/[A-Z]/.test(pwd)) poolSize += 26;
    if (/[0-9]/.test(pwd)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 33;

    if (poolSize === 0) return 'veryweak';

    let entropy = pwd.length * Math.log2(poolSize);
    let penalty = 0;

    if (pwd.length < 6) penalty += 20;
    if (pwd.length < 8) penalty += 10;

    const uniqueChars = new Set(pwd.split('')).size;
    const repeats = pwd.length - uniqueChars;
    if (repeats > 0) penalty += repeats * 2;

    for (let i = 0; i < pwd.length - 2; i++) {
      const c1 = pwd.charCodeAt(i);
      const c2 = pwd.charCodeAt(i + 1);
      const c3 = pwd.charCodeAt(i + 2);
      
      if (c1 + 1 === c2 && c2 + 1 === c3) penalty += 15;
      if (c1 - 1 === c2 && c2 - 1 === c3) penalty += 15;
    }

    const finalScore = entropy - penalty;

    if (finalScore < 30) return 'veryweak';
    if (finalScore < 50) return 'weak';
    if (finalScore < 75) return 'medium';
    if (finalScore < 100) return 'strong';
    if (finalScore < 130) return 'verystrong';
    return 'extremelystrong';
  }, []);

  const generatePassword = useCallback(() => {
    setIsGenerating(true);
    
    setTimeout(() => {
      let chars = '';
      if (options.lowercase) chars += CHAR_SETS.lowercase;
      if (options.uppercase) chars += CHAR_SETS.uppercase;
      if (options.numbers) chars += CHAR_SETS.numbers;
      if (options.symbols) chars += customSymbols;

      if (chars === '') {
        setPassword('');
        setIsGenerating(false);
        return;
      }

      let generatedPassword = '';
      const array = new Uint32Array(options.length);
      crypto.getRandomValues(array);

      const mandatoryChars: string[] = [];
      if (options.lowercase) mandatoryChars.push(CHAR_SETS.lowercase[Math.floor(Math.random() * CHAR_SETS.lowercase.length)]);
      if (options.uppercase) mandatoryChars.push(CHAR_SETS.uppercase[Math.floor(Math.random() * CHAR_SETS.uppercase.length)]);
      if (options.numbers) mandatoryChars.push(CHAR_SETS.numbers[Math.floor(Math.random() * CHAR_SETS.numbers.length)]);
      if (options.symbols && customSymbols.length > 0) mandatoryChars.push(customSymbols[Math.floor(Math.random() * customSymbols.length)]);

      for (let i = 0; i < options.length; i++) {
        generatedPassword += chars[array[i] % chars.length];
      }

      const pwdArray = generatedPassword.split('');
      for (let i = 0; i < mandatoryChars.length; i++) {
        if (i < pwdArray.length) {
          pwdArray[i] = mandatoryChars[i];
        }
      }

      for (let i = pwdArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pwdArray[i], pwdArray[j]] = [pwdArray[j], pwdArray[i]];
      }

      const finalPassword = pwdArray.join('');
      setPassword(finalPassword);
      setStrength(calculateStrength(finalPassword));
      setIsGenerating(false);
    }, 50);
  }, [options, customSymbols, calculateStrength]);

  useEffect(() => {
    generatePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      copyButtonRef.current?.focus();
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const updateOption = (key: keyof PasswordOptions, value: any) => {
    setOptions(prev => {
      if (typeof value === 'boolean' && value === false) {
        const boolKeys: (keyof PasswordOptions)[] = ['uppercase', 'lowercase', 'numbers', 'symbols'];
        const activeBools = boolKeys.filter(k => prev[k]).length;
        if (activeBools <= 1 && boolKeys.includes(key as any)) {
          return prev;
        }
      }
      return { ...prev, [key]: value };
    });
  };

  useEffect(() => {
    generatePassword();
  }, [options.length, generatePassword]); 

  const toggleOption = (key: keyof PasswordOptions) => {
    updateOption(key, !options[key]);
  };
  
  useEffect(() => {
    generatePassword();
  }, [options.uppercase, options.lowercase, options.numbers, options.symbols, customSymbols, generatePassword]);

  const getStrengthIcon = () => {
    switch(strength) {
      case 'extremelystrong': return <ShieldCheck className="w-4 h-4 text-cyan-500 dark:text-cyan-300" aria-hidden="true" />;
      case 'verystrong': return <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" aria-hidden="true" />;
      case 'strong': return <ShieldCheck className="w-4 h-4 text-yellow-500 dark:text-yellow-300" aria-hidden="true" />;
      case 'medium': return <Shield className="w-4 h-4 text-amber-500 dark:text-amber-400" aria-hidden="true" />;
      case 'weak': return <ShieldAlert className="w-4 h-4 text-orange-500 dark:text-orange-400" aria-hidden="true" />;
      case 'veryweak': return <Zap className="w-4 h-4 text-red-500 dark:text-red-400" aria-hidden="true" />;
      default: return <Zap className="w-4 h-4 text-zinc-400" aria-hidden="true" />;
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-500">
      {/* Background Grid Pattern - Decorative */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-500" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-transparent to-transparent dark:from-zinc-950"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-neon-blue/20 opacity-20 blur-[100px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-neon-green blur opacity-40 rounded-lg"></div>
              <div className="relative bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-neon-green" aria-hidden="true" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Neon<span className="text-zinc-400 dark:text-zinc-500">Guard</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-700">
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">v3.0</span>
             </div>
             <Tooltip content={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
               <Button 
                 variant="ghost" 
                 size="icon" 
                 onClick={toggleTheme}
                 className="rounded-full w-9 h-9"
                 aria-label="Toggle theme"
               >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={theme}
                      initial={{ y: -20, opacity: 0, rotate: -90 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      exit={{ y: 20, opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </motion.div>
                  </AnimatePresence>
               </Button>
             </Tooltip>
          </div>
        </div>

        <Card className="p-6 space-y-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] transition-colors duration-300">
          {/* Display Area - marked as live region for screen readers */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-neon-green rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur" aria-hidden="true"></div>
            <div className="relative bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between h-20 transition-all duration-300">
              <div 
                className="font-mono text-xl sm:text-2xl tracking-wider text-zinc-900 dark:text-white truncate mr-4 w-full"
                aria-live="polite"
                aria-label="Generated password"
              >
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-1"
                      aria-hidden="true"
                    >
                      {Array.from({ length: 8 }).map((_, i) => (
                         <motion.span
                           key={i}
                           animate={{ opacity: [0.3, 1, 0.3] }}
                           transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                           className="inline-block w-3 h-3 bg-zinc-400 dark:bg-zinc-600 rounded-full"
                         />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.span
                      key={password}
                      initial={{ filter: 'blur(10px)', opacity: 0 }}
                      animate={{ filter: 'blur(0px)', opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="select-all w-full block overflow-hidden text-ellipsis"
                    >
                      {password}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                 <Tooltip content={copied ? "Copied!" : "Copy to clipboard"}>
                   <Button 
                     ref={copyButtonRef}
                     variant="ghost" 
                     size="icon" 
                     onClick={handleCopy}
                     aria-label={copied ? "Copied" : "Copy to clipboard"}
                     className={cn("relative hover:text-neon-blue hover:bg-neon-blue/10", copied && "text-neon-green hover:text-neon-green hover:bg-neon-green/10")}
                   >
                     <AnimatePresence>
                       {copied ? (
                         <motion.div
                           initial={{ scale: 0.5, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           exit={{ scale: 0.5, opacity: 0 }}
                           className="absolute inset-0 flex items-center justify-center"
                         >
                           <Check className="w-5 h-5" aria-hidden="true" />
                         </motion.div>
                       ) : (
                         <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                         >
                           <Copy className="w-5 h-5" aria-hidden="true" />
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </Button>
                 </Tooltip>
                 <Tooltip content="Generate new password">
                   <Button 
                     variant="secondary" 
                     size="icon" 
                     onClick={generatePassword}
                     className="group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                     aria-label="Generate new password"
                   >
                     <RefreshCw className={cn("w-5 h-5 transition-transform duration-500", isGenerating && "animate-spin")} aria-hidden="true" />
                   </Button>
                 </Tooltip>
              </div>
            </div>
            
            {/* Strength Indicator Line - Decorative */}
            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800/50" aria-hidden="true">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ 
                   width: getStrengthPercentage(strength),
                   backgroundColor: getStrengthStyles(strength).color
                 }}
                 transition={{ duration: 0.5, type: 'spring', bounce: 0 }}
                 className="h-full shadow-[0_-2px_10px_rgba(255,255,255,0.2)]"
               />
            </div>
          </div>

          {/* Strength Meter */}
          <div className="space-y-2" role="status" aria-label={`Password strength: ${getStrengthLabel(strength)}`}>
             <div className="flex justify-between items-end">
               <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium uppercase tracking-wider">Security Level</span>
               <div className="flex items-center gap-2">
                 <AnimatePresence mode="wait">
                   <motion.span 
                     key={strength}
                     initial={{ y: 5, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     exit={{ y: -5, opacity: 0 }}
                     transition={{ duration: 0.2 }}
                     className={cn("text-sm font-bold uppercase tracking-wider", getStrengthColor(strength))}
                   >
                     {getStrengthLabel(strength)}
                   </motion.span>
                 </AnimatePresence>
                 
                 <motion.div
                    key={`${strength}-icon`}
                    initial={{ scale: 0.8, opacity: 0, rotate: -45 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                 >
                   {getStrengthIcon()}
                 </motion.div>
               </div>
             </div>
             
             <div className="h-2.5 w-full bg-zinc-200 dark:bg-zinc-800/50 rounded-full overflow-hidden flex gap-1 p-0.5 border border-zinc-300 dark:border-zinc-800" aria-hidden="true">
               {STRENGTH_LEVELS.map((level, index) => {
                 const strengthIndex = STRENGTH_LEVELS.indexOf(strength);
                 const isActive = index <= strengthIndex;
                 const styles = getStrengthStyles(strength); // Use current strength style for all active bars

                 return (
                   <motion.div
                     key={level}
                     className="h-full flex-1 rounded-full"
                     initial={false}
                     animate={{ 
                       backgroundColor: isActive ? styles.color : (theme === 'dark' ? '#27272a' : '#e4e4e7'), // zinc-800 or zinc-200
                       boxShadow: isActive ? styles.shadow : 'none',
                       opacity: isActive ? 1 : 0.5,
                     }}
                     transition={{ 
                       duration: 0.35, 
                       type: "spring", 
                       stiffness: 200, 
                       damping: 25,
                       delay: isActive ? index * 0.05 : 0 
                     }}
                   />
                 );
               })}
             </div>
          </div>

          {/* Controls */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Length Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label htmlFor="length-slider" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password Length</label>
                <span className="inline-flex items-center justify-center w-12 h-8 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-neon-blue border border-zinc-200 dark:border-zinc-700 shadow-sm">
                  {options.length}
                </span>
              </div>
              <Tooltip content="Slide to adjust length (4-32 characters)">
                <Slider 
                  id="length-slider"
                  min={4} 
                  max={32} 
                  value={options.length} 
                  onChange={(val) => updateOption('length', val)} 
                  className="py-2"
                />
              </Tooltip>
              <div className="flex justify-between text-xs text-zinc-400 font-mono" aria-hidden="true">
                <span>4</span>
                <span>18</span>
                <span>32</span>
              </div>
            </div>

            {/* Character Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {/* Uppercase */}
               <label htmlFor="uppercase-switch" className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer group shadow-sm">
                 <div className="flex items-center gap-3">
                   <div className="p-2 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 transition-colors shadow-sm">
                     <span className="font-mono text-xs" aria-hidden="true">Ab</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Uppercase</span>
                     <span className="text-[10px] text-zinc-500 dark:text-zinc-400">A-Z characters</span>
                   </div>
                 </div>
                 <Tooltip content="Include uppercase letters">
                   <Switch 
                     id="uppercase-switch"
                     checked={options.uppercase} 
                     onCheckedChange={() => toggleOption('uppercase')} 
                     aria-label="Enable uppercase characters"
                   />
                 </Tooltip>
               </label>

               {/* Lowercase */}
               <label htmlFor="lowercase-switch" className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer group shadow-sm">
                 <div className="flex items-center gap-3">
                   <div className="p-2 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 transition-colors shadow-sm">
                     <span className="font-mono text-xs" aria-hidden="true">ab</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Lowercase</span>
                     <span className="text-[10px] text-zinc-500 dark:text-zinc-400">a-z characters</span>
                   </div>
                 </div>
                 <Tooltip content="Include lowercase letters">
                   <Switch 
                     id="lowercase-switch"
                     checked={options.lowercase} 
                     onCheckedChange={() => toggleOption('lowercase')} 
                     aria-label="Enable lowercase characters"
                   />
                 </Tooltip>
               </label>

               {/* Numbers */}
               <label htmlFor="numbers-switch" className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer group shadow-sm">
                 <div className="flex items-center gap-3">
                   <div className="p-2 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 transition-colors shadow-sm">
                     <span className="font-mono text-xs" aria-hidden="true">12</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Numbers</span>
                     <span className="text-[10px] text-zinc-500 dark:text-zinc-400">0-9 digits</span>
                   </div>
                 </div>
                 <Tooltip content="Include numbers">
                   <Switch 
                     id="numbers-switch"
                     checked={options.numbers} 
                     onCheckedChange={() => toggleOption('numbers')} 
                     aria-label="Enable numbers"
                   />
                 </Tooltip>
               </label>

               {/* Symbols */}
               <div className={cn(
                 "col-span-1 sm:col-span-2 flex flex-col gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm", 
                 options.symbols ? "bg-white dark:bg-zinc-900/80" : ""
               )}>
                 <label htmlFor="symbols-switch" className="flex items-center justify-between cursor-pointer group">
                   <div className="flex items-center gap-3">
                     <div className="p-2 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 transition-colors shadow-sm">
                       <span className="font-mono text-xs" aria-hidden="true">#$</span>
                     </div>
                     <div className="flex flex-col">
                       <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Symbols</span>
                       <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                         {options.symbols ? 'Customizable' : '!@#... chars'}
                       </span>
                     </div>
                   </div>
                   <Tooltip content="Include special characters">
                     <Switch 
                       id="symbols-switch"
                       checked={options.symbols} 
                       onCheckedChange={() => toggleOption('symbols')} 
                       aria-label="Enable symbols"
                     />
                   </Tooltip>
                 </label>
                 
                 <AnimatePresence>
                   {options.symbols && (
                     <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                     >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Settings2 className="w-3 h-3 text-zinc-500" aria-hidden="true" />
                            <label htmlFor="custom-symbols-input" className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                              Symbol Set
                            </label>
                          </div>
                          {customSymbols !== CHAR_SETS.defaultSymbols && (
                            <Tooltip content="Restore default symbols" side="top">
                              <button 
                                type="button"
                                onClick={() => setCustomSymbols(CHAR_SETS.defaultSymbols)}
                                className="flex items-center gap-1 text-[10px] text-neon-blue hover:text-zinc-900 dark:hover:text-white transition-colors"
                                aria-label="Reset symbols to default"
                              >
                                <RotateCcw className="w-3 h-3" /> Reset
                              </button>
                            </Tooltip>
                          )}
                        </div>
                        <input 
                           id="custom-symbols-input"
                           type="text" 
                           value={customSymbols}
                           onChange={(e) => setCustomSymbols(e.target.value)}
                           className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono text-zinc-800 dark:text-zinc-300 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors placeholder:text-zinc-400"
                           placeholder="Enter symbols to use..."
                           aria-label="Custom symbol set"
                        />
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
            </div>

            <Tooltip content="Generate password with current settings">
              <Button 
                className="w-full h-12 text-base font-semibold tracking-wide"
                onClick={generatePassword}
                disabled={isGenerating}
                type="button"
                variant="primary" // Reverts to primary which handles theming
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" /> Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Generate Secure Password <Unlock className="w-4 h-4 opacity-50" aria-hidden="true" />
                  </span>
                )}
              </Button>
            </Tooltip>
          </form>

        </Card>
        
        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
            Secure • Client-Side • Random
          </p>
        </div>
      </motion.div>
    </main>
  );
}