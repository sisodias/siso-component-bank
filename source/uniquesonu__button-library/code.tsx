import React, { useState } from 'react';

const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Base neomorphism button component
const NeoButton = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  shape = 'rounded',
  effect = 'standard',
  disabled = false, 
  className = '',
  dark = false,
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Base styles for light theme
  const lightBase = "bg-gradient-to-br from-gray-50 to-gray-200 shadow-[8px_8px_16px_#c1c1c1,-8px_-8px_16px_#ffffff]";
  const lightPressed = "shadow-[inset_8px_8px_16px_#c1c1c1,inset_-8px_-8px_16px_#ffffff]";
  const lightHover = "shadow-[12px_12px_24px_#c1c1c1,-12px_-12px_24px_#ffffff] transform translate-y-[-2px]";

  // Base styles for dark theme
  const darkBase = "bg-gradient-to-br from-gray-700 to-gray-900 shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#404040]";
  const darkPressed = "shadow-[inset_8px_8px_16px_#1a1a1a,inset_-8px_-8px_16px_#404040]";
  const darkHover = "shadow-[12px_12px_24px_#1a1a1a,-12px_-12px_24px_#404040] transform translate-y-[-2px]";

  // Effect variations
  const effectClasses = {
    standard: dark ? darkBase : lightBase,
    flat: dark ? 
      "bg-gray-800 shadow-[4px_4px_8px_#1a1a1a,-4px_-4px_8px_#404040]" : 
      "bg-gray-100 shadow-[4px_4px_8px_#c1c1c1,-4px_-4px_8px_#ffffff]",
    deep: dark ? 
      "bg-gradient-to-br from-gray-700 to-gray-900 shadow-[16px_16px_32px_#0a0a0a,-16px_-16px_32px_#505050]" : 
      "bg-gradient-to-br from-gray-50 to-gray-200 shadow-[16px_16px_32px_#a1a1a1,-16px_-16px_32px_#ffffff]",
    concave: dark ? 
      "bg-gradient-to-tl from-gray-700 to-gray-900 shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#404040,4px_4px_8px_#0a0a0a]" : 
      "bg-gradient-to-tl from-gray-50 to-gray-200 shadow-[inset_4px_4px_8px_#c1c1c1,inset_-4px_-4px_8px_#ffffff,4px_4px_8px_#a1a1a1]",
    convex: dark ? 
      "bg-gradient-to-br from-gray-600 to-gray-800 shadow-[6px_6px_12px_#1a1a1a,-6px_-6px_12px_#505050,inset_2px_2px_4px_#404040]" : 
      "bg-gradient-to-br from-gray-100 to-gray-300 shadow-[6px_6px_12px_#c1c1c1,-6px_-6px_12px_#ffffff,inset_2px_2px_4px_#e1e1e1]",
    pressed: dark ? darkPressed : lightPressed
  };

  // Size variations
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
    icon: 'p-2 text-base',
    wide: 'px-12 py-3 text-base w-full'
  };

  // Shape variations
  const shapeClasses = {
    rounded: 'rounded-lg',
    pill: 'rounded-full',
    square: 'rounded-none',
    circle: 'rounded-full aspect-square',
    soft: 'rounded-2xl',
    sharp: 'rounded-sm'
  };

  // Text color variants
  const variantClasses = {
    default: dark ? 'text-gray-100' : 'text-gray-800',
    primary: dark ? 'text-blue-300 font-medium' : 'text-blue-600 font-medium',
    secondary: dark ? 'text-purple-300 font-medium' : 'text-purple-600 font-medium',
    success: dark ? 'text-green-300 font-medium' : 'text-green-600 font-medium',
    warning: dark ? 'text-yellow-300 font-medium' : 'text-yellow-600 font-medium',
    destructive: dark ? 'text-red-300 font-medium' : 'text-red-600 font-medium',
    ghost: dark ? 'text-gray-400' : 'text-gray-500',
    accent: dark ? 'text-cyan-300 font-semibold' : 'text-cyan-600 font-semibold',
    muted: dark ? 'text-gray-500' : 'text-gray-600'
  };

  const getCurrentEffect = () => {
    if (disabled) return effectClasses.standard;
    if (isPressed) return effectClasses.pressed;
    return effectClasses[effect];
  };

  const getHoverEffect = () => {
    if (disabled || isPressed) return '';
    return effect === 'standard' ? (dark ? darkHover : lightHover) : '';
  };

  return (
    <button
      className={cn(
        getCurrentEffect(),
        sizeClasses[size],
        shapeClasses[shape],
        variantClasses[variant],
        'border-0 font-medium transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2',
        'active:transition-none',
        !disabled && !isPressed && `hover:${getHoverEffect()}`,
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Demo Component
export default function NeoButtonDemo() {
  const [darkMode, setDarkMode] = useState(false);

  const DemoSection = ({ title, children }) => (
    <div className={cn(
      'p-6 rounded-2xl mb-8',
      darkMode ? 
        'bg-gradient-to-br from-gray-700 to-gray-900 shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#404040]' :
        'bg-gradient-to-br from-gray-50 to-gray-200 shadow-[8px_8px_16px_#c1c1c1,-8px_-8px_16px_#ffffff]'
    )}>
      <h2 className={cn(
        'text-2xl font-bold mb-6',
        darkMode ? 'text-gray-100' : 'text-gray-800'
      )}>
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    <div className={cn(
      'min-h-screen p-8 transition-all duration-500',
      darkMode ? 'bg-gray-800' : 'bg-gray-100'
    )}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={cn(
            'text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent',
            darkMode ? 
              'from-blue-400 to-purple-400' : 
              'from-blue-600 to-purple-600'
          )}>
            Neomorphism Button Library v1
          </h1>
          <p className={cn(
            'text-xl mb-8',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            Next-generation soft UI buttons with advanced styling options
          </p>
          
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn(darkMode ? 'text-gray-300' : 'text-gray-600')}>☀️ Light</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                'relative w-16 h-8 rounded-full p-1 transition-all duration-300',
                darkMode ? 
                  'bg-gradient-to-r from-blue-600 to-purple-600 shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#404040]' :
                  'bg-gradient-to-r from-blue-500 to-purple-500 shadow-[inset_4px_4px_8px_#c1c1c1,inset_-4px_-4px_8px_#ffffff]'
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full transition-transform duration-300',
                  darkMode ? 
                    'bg-gradient-to-br from-gray-100 to-gray-300 shadow-[2px_2px_4px_#0a0a0a,-2px_-2px_4px_#505050] translate-x-8' :
                    'bg-gradient-to-br from-gray-700 to-gray-900 shadow-[2px_2px_4px_#a1a1a1,-2px_-2px_4px_#ffffff] translate-x-0'
                )}
              />
            </button>
            <span className={cn(darkMode ? 'text-gray-300' : 'text-gray-600')}>🌙 Dark</span>
          </div>
        </div>

        {/* Basic Variants */}
        <DemoSection title="Color Variants">
          <div className="flex flex-wrap gap-4">
            <NeoButton dark={darkMode}>Default</NeoButton>
            <NeoButton variant="primary" dark={darkMode}>Primary</NeoButton>
            <NeoButton variant="secondary" dark={darkMode}>Secondary</NeoButton>
            <NeoButton variant="success" dark={darkMode}>Success</NeoButton>
            <NeoButton variant="warning" dark={darkMode}>Warning</NeoButton>
            <NeoButton variant="destructive" dark={darkMode}>Destructive</NeoButton>
            <NeoButton variant="ghost" dark={darkMode}>Ghost</NeoButton>
            <NeoButton variant="accent" dark={darkMode}>Accent</NeoButton>
            <NeoButton variant="muted" dark={darkMode}>Muted</NeoButton>
          </div>
        </DemoSection>

        {/* Size Variants */}
        <DemoSection title="Size Variants">
          <div className="flex flex-wrap items-center gap-4">
            <NeoButton size="xs" dark={darkMode}>Extra Small</NeoButton>
            <NeoButton size="sm" dark={darkMode}>Small</NeoButton>
            <NeoButton size="md" dark={darkMode}>Medium</NeoButton>
            <NeoButton size="lg" dark={darkMode}>Large</NeoButton>
            <NeoButton size="xl" dark={darkMode}>Extra Large</NeoButton>
            <NeoButton size="icon" shape="circle" dark={darkMode}>🚀</NeoButton>
          </div>
          <div className="mt-4">
            <NeoButton size="wide" variant="primary" dark={darkMode}>Full Width Button</NeoButton>
          </div>
        </DemoSection>

        {/* Shape Variants */}
        <DemoSection title="Shape Variants">
          <div className="flex flex-wrap gap-4">
            <NeoButton shape="rounded" dark={darkMode}>Rounded</NeoButton>
            <NeoButton shape="pill" dark={darkMode}>Pill</NeoButton>
            <NeoButton shape="square" dark={darkMode}>Square</NeoButton>
            <NeoButton shape="soft" dark={darkMode}>Soft</NeoButton>
            <NeoButton shape="sharp" dark={darkMode}>Sharp</NeoButton>
            <NeoButton shape="circle" size="icon" dark={darkMode}>⭐</NeoButton>
          </div>
        </DemoSection>

        {/* Effect Variants */}
        <DemoSection title="Effect Variants">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className={cn('font-semibold', darkMode ? 'text-gray-200' : 'text-gray-700')}>Standard</h3>
              <NeoButton effect="standard" variant="primary" dark={darkMode}>Standard Effect</NeoButton>
            </div>
            <div className="space-y-3">
              <h3 className={cn('font-semibold', darkMode ? 'text-gray-200' : 'text-gray-700')}>Flat</h3>
              <NeoButton effect="flat" variant="secondary" dark={darkMode}>Flat Effect</NeoButton>
            </div>
            <div className="space-y-3">
              <h3 className={cn('font-semibold', darkMode ? 'text-gray-200' : 'text-gray-700')}>Deep</h3>
              <NeoButton effect="deep" variant="success" dark={darkMode}>Deep Effect</NeoButton>
            </div>
            <div className="space-y-3">
              <h3 className={cn('font-semibold', darkMode ? 'text-gray-200' : 'text-gray-700')}>Concave</h3>
              <NeoButton effect="concave" variant="warning" dark={darkMode}>Concave Effect</NeoButton>
            </div>
            <div className="space-y-3">
              <h3 className={cn('font-semibold', darkMode ? 'text-gray-200' : 'text-gray-700')}>Convex</h3>
              <NeoButton effect="convex" variant="accent" dark={darkMode}>Convex Effect</NeoButton>
            </div>
          </div>
        </DemoSection>

        {/* Interactive Examples */}
        <DemoSection title="Interactive States">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <NeoButton dark={darkMode}>Normal State</NeoButton>
              <NeoButton disabled dark={darkMode}>Disabled State</NeoButton>
            </div>
            
            <div className="space-y-2">
              <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                Try hovering and clicking the buttons above to see the interactive effects!
              </p>
            </div>
          </div>
        </DemoSection>

        {/* Creative Combinations */}
        <DemoSection title="Creative Combinations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NeoButton 
              variant="primary" 
              shape="pill" 
              effect="deep" 
              size="lg" 
              dark={darkMode}
            >
              🚀 Launch App
            </NeoButton>
            <NeoButton 
              variant="destructive" 
              shape="soft" 
              effect="convex" 
              dark={darkMode}
            >
              🗑️ Delete Item
            </NeoButton>
            <NeoButton 
              variant="success" 
              shape="rounded" 
              effect="flat" 
              size="sm" 
              dark={darkMode}
            >
              ✅ Confirm
            </NeoButton>
            <NeoButton 
              variant="accent" 
              shape="circle" 
              effect="concave" 
              size="icon" 
              dark={darkMode}
            >
              💎
            </NeoButton>
            <NeoButton 
              variant="secondary" 
              shape="pill" 
              effect="standard" 
              dark={darkMode}
            >
              🎨 Customize
            </NeoButton>
            <NeoButton 
              variant="warning" 
              shape="sharp" 
              effect="deep" 
              size="xs" 
              dark={darkMode}
            >
              ⚠️ Alert
            </NeoButton>
          </div>
        </DemoSection>

      </div>
    </div>
  );
}