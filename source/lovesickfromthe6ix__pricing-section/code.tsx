// glass-pricing-section.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, ArrowRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Type Definitions
// ============================================================================

export interface PricingFeature {
  id: string;
  text: string;
  included: boolean;
  tooltip?: string;
  highlight?: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency?: string;
  currencyPosition?: 'before' | 'after';
  icon?: LucideIcon;
  iconClassName?: string;
  featured?: boolean;
  featuredBadge?: string;
  features: PricingFeature[];
  cta?: {
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
  savings?: string;
  metadata?: Record<string, any>;
  disabled?: boolean;
  customPrice?: boolean;
  customPriceText?: string;
}

export interface PricingSectionProps {
  tiers: PricingTier[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  defaultBilling?: 'monthly' | 'yearly';
  onBillingChange?: (billing: 'monthly' | 'yearly') => void;
  showBillingToggle?: boolean;
  billingToggleLabels?: {
    monthly?: string;
    yearly?: string;
    discount?: string;
  };
  className?: string;
  containerClassName?: string;
  cardsClassName?: string;
  animated?: boolean;
  animationDelay?: number;
  glassEffect?: boolean;
  backgroundEffects?: boolean;
  columns?: 1 | 2 | 3 | 4 | 5;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  trustBadges?: React.ReactNode;
  footer?: React.ReactNode;
}

export interface PricingCardProps {
  tier: PricingTier;
  billing: 'monthly' | 'yearly';
  index?: number;
  animated?: boolean;
  animationDelay?: number;
  glassEffect?: boolean;
  onCtaClick?: (tierId: string) => void;
  className?: string;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook to detect system color scheme preference
 */
const useSystemTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial theme
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return theme;
};

/**
 * Hook for staggered animations
 */
const useStaggeredAnimation = (
  index: number = 0,
  animated: boolean = true,
  delay: number = 150
) => {
  const [isVisible, setIsVisible] = useState(!animated);

  useEffect(() => {
    if (!animated) {
      setIsVisible(true);
      return;
    }

    const timer = setTimeout(() => setIsVisible(true), index * delay);
    return () => clearTimeout(timer);
  }, [index, animated, delay]);

  return isVisible;
};

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Billing Toggle Component
 */
export const BillingToggle: React.FC<{
  billing: 'monthly' | 'yearly';
  onChange: (billing: 'monthly' | 'yearly') => void;
  labels?: {
    monthly?: string;
    yearly?: string;
    discount?: string;
  };
  className?: string;
}> = ({ 
  billing, 
  onChange, 
  labels = {
    monthly: 'Monthly',
    yearly: 'Yearly',
    discount: 'Save 20%'
  },
  className 
}) => {
  return (
    <div className={cn(
      "flex items-center justify-center gap-3 @container",
      className
    )}>
      <span 
        className={cn(
          "text-sm font-medium transition-colors duration-200",
          "select-none cursor-pointer",
          billing === 'monthly' 
            ? "text-gray-900 dark:text-gray-100" 
            : "text-gray-500 dark:text-gray-400"
        )}
        onClick={() => onChange('monthly')}
      >
        {labels.monthly}
      </span>
      
      <button
        type="button"
        role="switch"
        aria-checked={billing === 'yearly'}
        onClick={() => onChange(billing === 'monthly' ? 'yearly' : 'monthly')}
        className={cn(
          "relative inline-flex h-7 w-12 items-center rounded-full",
          "transition-colors duration-200 focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-offset-2",
          "focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400",
          "bg-gray-200 dark:bg-gray-700",
          billing === 'yearly' && "bg-purple-500 dark:bg-purple-600"
        )}
      >
        <span className="sr-only">Toggle billing period</span>
        <span 
          className={cn(
            "inline-block h-5 w-5 transform rounded-full",
            "bg-white shadow-sm transition-transform duration-200",
            "ring-0",
            billing === 'yearly' ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      
      <div className="flex items-center gap-2">
        <span 
          className={cn(
            "text-sm font-medium transition-colors duration-200",
            "select-none cursor-pointer",
            billing === 'yearly' 
              ? "text-gray-900 dark:text-gray-100" 
              : "text-gray-500 dark:text-gray-400"
          )}
          onClick={() => onChange('yearly')}
        >
          {labels.yearly}
        </span>
        {labels.discount && (
          <span 
            className={cn(
              "inline-flex px-2 py-0.5 rounded-full",
              "text-xs font-semibold",
              "bg-green-100 text-green-800",
              "dark:bg-green-900/30 dark:text-green-400",
              "@md:px-2.5 @md:py-1"
            )}
          >
            {labels.discount}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Feature List Item Component
 */
const FeatureItem: React.FC<{
  feature: PricingFeature;
  className?: string;
}> = ({ feature, className }) => {
  return (
    <li 
      className={cn(
        "flex items-start gap-3 group",
        feature.highlight && "font-medium",
        className
      )}
    >
      <span 
        className={cn(
          "mt-0.5 rounded-full p-1 shrink-0",
          "transition-colors duration-200",
          feature.included 
            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
            : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
        )}
      >
        {feature.included ? (
          <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />
        ) : (
          <X className="w-3 h-3" strokeWidth={2} aria-hidden="true" />
        )}
      </span>
      <span 
        className={cn(
          "text-sm leading-relaxed",
          feature.included 
            ? "text-gray-700 dark:text-gray-300" 
            : "text-gray-400 dark:text-gray-600 line-through"
        )}
        title={feature.tooltip}
      >
        {feature.text}
      </span>
    </li>
  );
};

// ============================================================================
// Main Components
// ============================================================================

/**
 * Individual Pricing Card Component
 */
export const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  billing,
  index = 0,
  animated = true,
  animationDelay = 150,
  glassEffect = true,
  onCtaClick,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isVisible = useStaggeredAnimation(index, animated, animationDelay);
  const theme = useSystemTheme();
  
  const price = billing === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
  const isCustomPrice = tier.customPrice || price < 0;
  const Icon = tier.icon;
  
  const handleCtaClick = () => {
    if (tier.cta?.onClick) {
      tier.cta.onClick();
    } else if (onCtaClick) {
      onCtaClick(tier.id);
    }
  };
  
  // CTA button variants
  const ctaVariants = {
    primary: cn(
      "bg-purple-500 text-white hover:bg-purple-600",
      "dark:bg-purple-600 dark:hover:bg-purple-700",
      "shadow-lg hover:shadow-xl"
    ),
    secondary: cn(
      "bg-white/10 backdrop-blur-sm",
      "text-gray-900 dark:text-white",
      "border border-gray-200 dark:border-gray-700",
      "hover:bg-white/20 dark:hover:bg-gray-800/40"
    ),
    ghost: cn(
      "bg-transparent text-gray-700 dark:text-gray-300",
      "hover:bg-gray-100 dark:hover:bg-gray-800"
    )
  };
  
  return (
    <article
      className={cn(
        "relative h-full transition-all duration-500",
        "transform-gpu will-change-transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        tier.featured && "lg:scale-105 z-10",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${tier.name} pricing tier`}
    >
      {/* Featured Badge */}
      {tier.featured && tier.featuredBadge && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center z-20">
          <span 
            className={cn(
              "px-4 py-1.5 rounded-full",
              "text-xs font-bold text-white",
              "bg-gradient-to-r from-purple-500 to-pink-500",
              "shadow-lg shadow-purple-500/25",
              "animate-pulse"
            )}
          >
            {tier.featuredBadge}
          </span>
        </div>
      )}
      
      <div 
        className={cn(
          "relative h-full overflow-hidden rounded-2xl",
          "transition-all duration-300",
          glassEffect && [
            "backdrop-blur-xl backdrop-saturate-150",
            "bg-white/70 dark:bg-gray-900/70",
            "border border-gray-200/50 dark:border-gray-700/50",
          ],
          !glassEffect && [
            "bg-white dark:bg-gray-900",
            "border border-gray-200 dark:border-gray-800",
          ],
          isHovered && "transform -translate-y-1 shadow-2xl",
          tier.featured && "border-2 border-purple-400/50 dark:border-purple-500/50",
          tier.disabled && "opacity-50 pointer-events-none"
        )}
      >
        {/* Background Gradient */}
        {tier.featured && (
          <div 
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10" 
            aria-hidden="true" 
          />
        )}
        
        <div className="relative z-10 p-6 @lg:p-8 flex flex-col h-full">
          {/* Header */}
          <header className="mb-6">
            {Icon && (
              <div 
                className={cn(
                  "inline-flex p-3 rounded-xl mb-4",
                  "bg-gradient-to-br",
                  tier.iconClassName || "from-purple-500/10 to-pink-500/10",
                  isHovered && "animate-pulse"
                )}
              >
                <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              </div>
            )}
            
            <h3 className="text-xl @lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {tier.name}
            </h3>
            {tier.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tier.description}
              </p>
            )}
          </header>
          
          {/* Pricing */}
          <div className="mb-8">
            <div className="flex items-baseline gap-1 mb-2">
              {!isCustomPrice ? (
                <>
                  {tier.currencyPosition === 'before' && (
                    <span className="text-lg text-gray-500 dark:text-gray-400">
                      {tier.currency || '$'}
                    </span>
                  )}
                  <span className="text-4xl @lg:text-5xl font-bold text-gray-900 dark:text-white">
                    {price}
                  </span>
                  {tier.currencyPosition === 'after' && (
                    <span className="text-lg text-gray-500 dark:text-gray-400">
                      {tier.currency || '$'}
                    </span>
                  )}
                  <span className="text-gray-500 dark:text-gray-400">
                    /{billing === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </>
              ) : (
                <span className="text-2xl @lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {tier.customPriceText || 'Custom Pricing'}
                </span>
              )}
            </div>
            
            {billing === 'yearly' && tier.savings && !isCustomPrice && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <span className="text-xs font-medium">{tier.savings}</span>
              </div>
            )}
          </div>
          
          {/* Features */}
          <div className="flex-grow mb-8">
            <ul className="space-y-3" role="list">
              {tier.features.map((feature) => (
                <FeatureItem key={feature.id} feature={feature} />
              ))}
            </ul>
          </div>
          
          {/* CTA Button */}
          {tier.cta && (
            <button
              onClick={handleCtaClick}
              disabled={tier.disabled}
              className={cn(
                "w-full py-3 px-6 rounded-xl font-semibold",
                "transition-all duration-300",
                "flex items-center justify-center gap-2",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                ctaVariants[tier.cta.variant || (tier.featured ? 'primary' : 'secondary')]
              )}
              aria-label={`${tier.cta.text} for ${tier.name} plan`}
            >
              {tier.cta.text}
              <ArrowRight 
                className={cn(
                  "w-4 h-4 transition-transform",
                  isHovered && !tier.disabled && "translate-x-1"
                )} 
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

/**
 * Main Pricing Section Component
 */
export const GlassPricingSection: React.FC<PricingSectionProps> = ({
  tiers,
  title,
  subtitle,
  defaultBilling = 'yearly',
  onBillingChange,
  showBillingToggle = true,
  billingToggleLabels,
  className,
  containerClassName,
  cardsClassName,
  animated = true,
  animationDelay = 150,
  glassEffect = true,
  backgroundEffects = true,
  columns = 3,
  gap = 'md',
  trustBadges,
  footer
}) => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>(defaultBilling);
  
  const handleBillingChange = (newBilling: 'monthly' | 'yearly') => {
    setBilling(newBilling);
    onBillingChange?.(newBilling);
  };
  
  const gapSizes = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10'
  };
  
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'
  };
  
  return (
    <section 
      className={cn(
        "relative w-full py-12 @lg:py-20 px-4 @lg:px-6",
        glassEffect && "backdrop-blur-sm",
        className
      )}
      aria-labelledby="pricing-title"
    >
      {/* Background Effects */}
      {backgroundEffects && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-[10%] w-64 @lg:w-96 h-64 @lg:h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-[10%] w-64 @lg:w-96 h-64 @lg:h-96 bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />
        </div>
      )}
      
      <div className={cn("relative z-10 max-w-7xl mx-auto", containerClassName)}>
        {/* Header */}
        {(title || subtitle) && (
          <header className="text-center mb-8 @lg:mb-12">
            {title && (
              <h2 
                id="pricing-title"
                className="text-3xl @lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base @lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </header>
        )}
        
        {/* Billing Toggle */}
        {showBillingToggle && (
          <div className="mb-8 @lg:mb-12">
            <BillingToggle
              billing={billing}
              onChange={handleBillingChange}
              labels={billingToggleLabels}
            />
          </div>
        )}
        
        {/* Pricing Cards */}
        <div 
          className={cn(
            "grid",
            gridCols[columns],
            gapSizes[gap],
            cardsClassName
          )}
        >
          {tiers.map((tier, index) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              billing={billing}
              index={index}
              animated={animated}
              animationDelay={animationDelay}
              glassEffect={glassEffect}
            />
          ))}
        </div>
        
        {/* Trust Badges */}
        {trustBadges && (
          <div className="mt-8 @lg:mt-12">
            {trustBadges}
          </div>
        )}
        
        {/* Footer */}
        {footer && (
          <div className="mt-12 @lg:mt-16 text-center">
            {footer}
          </div>
        )}
      </div>
    </section>
  );
};

export default GlassPricingSection;