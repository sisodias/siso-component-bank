"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Star,
  Zap,
  Clock,
  CheckCircle,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  cn, 
  useCountdownTimer, 
  useHover, 
  formatTimeValue,
  type TimeLeft 
} from "@/lib/utils";

/**
 * ============================================
 * TYPE DEFINITIONS
 * ============================================
 */

interface Feature {
  id: string;
  text: string;
  icon?: LucideIcon;
}

interface Benefit {
  id: string;
  text: string;
  icon?: LucideIcon;
}

interface TrustIndicator {
  id: string;
  value: string;
  label: string;
  icon: LucideIcon;
}

interface CTAData {
  badge: {
    text: string;
    icon: LucideIcon;
  };
  title: {
    main: string;
    highlight: string;
  };
  description: string;
  features: Feature[];
  benefits: Benefit[];
  trustIndicators: TrustIndicator[];
  pricing: {
    original: string;
    discounted: string;
    discount: string;
    period: string;
    spotsRemaining: number;
  };
  primaryButton: {
    text: string;
    onClick: () => void;
  };
  secondaryButton: {
    text: string;
    onClick: () => void;
  };
  discountButton: {
    text: string;
    onClick: () => void;
  };
}

/**
 * ============================================
 * SUB-COMPONENT: CTABadge
 * ============================================
 * Displays a badge with icon and optional timer control
 */
interface CTABadgeProps {
  text: string;
  icon: LucideIcon;
  isPlaying?: boolean;
  onToggle?: () => void;
  showTimer?: boolean;
  className?: string;
}

const CTABadge: React.FC<CTABadgeProps> = ({
  text,
  icon: Icon,
  isPlaying = false,
  onToggle,
  showTimer = false,
  className = "",
}) => (
  <Badge
    variant="secondary"
    className={cn(
      "inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm",
      "bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold",
      "animate-in fade-in slide-in-from-left duration-700",
      className
    )}
  >
    <Icon className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse text-white" />
    <span className="font-semibold text-white text-xs sm:text-sm">{text}</span>
    {showTimer && onToggle && (
      <button
        onClick={onToggle}
        className="ml-2 p-1 hover:bg-accent rounded-full transition-colors"
        aria-label={isPlaying ? "Pause timer" : "Play timer"}
      >
        {isPlaying ? (
          <Pause className="w-3 h-3 text-white" />
        ) : (
          <Play className="w-3 h-3 text-white" />
        )}
      </button>
    )}
  </Badge>
);

/**
 * ============================================
 * SUB-COMPONENT: CTATitle
 * ============================================
 * Displays the main title with highlighted text
 */
interface CTATitleProps {
  main: string;
  highlight: string;
  className?: string;
}

const CTATitle: React.FC<CTATitleProps> = ({ main, highlight, className = "" }) => (
  <h1 className={cn(
    "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white drop-shadow-lg",
    "animate-in fade-in slide-in-from-left duration-700 animation-delay-200",
    className
  )}>
    {main}
    <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
      {highlight}
    </span>
  </h1>
);

/**
 * ============================================
 * SUB-COMPONENT: CTADescription
 * ============================================
 * Displays the description text
 */
interface CTADescriptionProps {
  text: string;
  className?: string;
}

const CTADescription: React.FC<CTADescriptionProps> = ({ text, className = "" }) => (
  <p className={cn(
    "text-base sm:text-lg md:text-xl text-white/95 leading-relaxed drop-shadow-md",
    "animate-in fade-in slide-in-from-left duration-700 animation-delay-400",
    className
  )}>
    {text}
  </p>
);

/**
 * ============================================
 * SUB-COMPONENT: FeatureList
 * ============================================
 * Displays a list of features with icons
 */
interface FeatureListProps {
  features: Feature[];
  className?: string;
  iconColor?: string;
}

const FeatureList: React.FC<FeatureListProps> = ({
  features,
  className = "",
  iconColor = "text-green-400",
}) => (
  <ul className={cn("space-y-2 sm:space-y-3", className)}>
    {features.map((feature) => (
      <li key={feature.id} className="flex items-start sm:items-center gap-2 sm:gap-3">
        <div className="p-1 sm:p-1.5 rounded-full bg-white/20 backdrop-blur-sm flex-shrink-0">
          {feature.icon ? (
            <feature.icon className={cn("w-4 h-4 sm:w-5 sm:h-5", iconColor)} />
          ) : (
            <CheckCircle className={cn("w-4 h-4 sm:w-5 sm:h-5", iconColor)} />
          )}
        </div>
        <span className="text-sm sm:text-base text-white font-medium drop-shadow-sm">{feature.text}</span>
      </li>
    ))}
  </ul>
);

/**
 * ============================================
 * SUB-COMPONENT: BenefitList
 * ============================================
 * Displays a list of benefits with icons
 */
interface BenefitListProps {
  benefits: Benefit[];
  className?: string;
  iconColor?: string;
}

const BenefitList: React.FC<BenefitListProps> = ({
  benefits,
  className = "",
  iconColor = "text-yellow-400",
}) => (
  <div className={cn("space-y-3", className)}>
    {benefits.map((benefit) => {
      const Icon = benefit.icon || Zap;
      return (
        <div key={benefit.id} className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4", iconColor, "drop-shadow-sm")} />
          <span className="text-sm text-white font-medium">{benefit.text}</span>
        </div>
      );
    })}
  </div>
);

/**
 * ============================================
 * SUB-COMPONENT: TrustIndicators
 * ============================================
 * Displays trust indicators with values
 */
interface TrustIndicatorsProps {
  indicators: TrustIndicator[];
  className?: string;
}

const TrustIndicators: React.FC<TrustIndicatorsProps> = ({
  indicators,
  className = "",
}) => (
  <div className={cn("flex flex-wrap items-center gap-6", className)}>
    {indicators.map((indicator) => (
      <span key={indicator.id} className="flex items-center gap-2">
        <indicator.icon className="w-4 h-4 fill-current" />
        {indicator.value} {indicator.label}
      </span>
    ))}
  </div>
);

/**
 * ============================================
 * SUB-COMPONENT: CountdownTimer
 * ============================================
 * Displays a countdown timer
 */
interface CountdownTimerProps {
  timeLeft: TimeLeft;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  timeLeft,
  className = "",
}) => {
  const units = [
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className={cn("flex justify-center gap-2 sm:gap-4", className)}>
      {units.map((unit, index) => (
        <div key={index} className="text-center flex-1 sm:flex-initial">
          <div className="bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-4 min-w-[60px] sm:min-w-[80px] border border-white/30">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md">
              {formatTimeValue(unit.value)}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-white/90 mt-1 sm:mt-2 block font-medium uppercase tracking-wider">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * ============================================
 * SUB-COMPONENT: PricingDisplay
 * ============================================
 * Displays pricing information
 */
interface PricingDisplayProps {
  original: string;
  discounted: string;
  period: string;
  className?: string;
}

const PricingDisplay: React.FC<PricingDisplayProps> = ({
  original,
  discounted,
  period,
  className = "",
}) => (
  <div className={cn("text-center", className)}>
    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
      <span className="text-xl sm:text-2xl text-white/60 line-through">{original}</span>
      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{discounted}</span>
    </div>
    <p className="text-sm sm:text-base text-white/90 font-medium">{period}</p>
  </div>
);

/**
 * ============================================
 * SUB-COMPONENT: AnimatedBackground
 * ============================================
 * Creates animated background effects
 */
interface AnimatedBackgroundProps {
  showStars?: boolean;
  showOrbs?: boolean;
  showGrid?: boolean;
  showOverlay?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  showStars = true,
  showOrbs = true,
  showGrid = true,
  showOverlay = true,
}) => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Floating Orbs */}
    {showOrbs && (
      <>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </>
    )}

    {/* Dynamic Grid Pattern */}
    {showGrid && (
      <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden="true">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path
              d="M0 32V0h32"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    )}

    {/* Animated Stars */}
    {showStars && (
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          >
            <Star className="w-3 h-3 text-white/20 fill-white/10" />
          </div>
        ))}
      </div>
    )}

    {/* Gradient Overlay */}
    {showOverlay && (
      <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-foreground/5" />
    )}
  </div>
);

/**
 * ============================================
 * SUB-COMPONENT: CTAButtons
 * ============================================
 * Action buttons group
 */
interface CTAButtonsProps {
  primaryButton: {
    text: string;
    onClick: () => void;
  };
  secondaryButton: {
    text: string;
    onClick: () => void;
  };
  className?: string;
}

const CTAButtons: React.FC<CTAButtonsProps> = ({
  primaryButton,
  secondaryButton,
  className = "",
}) => (
  <div className={cn(
    "flex flex-col sm:flex-row gap-3 sm:gap-4",
    className
  )}>
    <Button
      onClick={primaryButton.onClick}
      size="lg"
      className="group bg-white text-purple-700 hover:bg-white/95 font-bold shadow-lg w-full sm:w-auto"
    >
      {primaryButton.text}
      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
    </Button>
    <Button
      onClick={secondaryButton.onClick}
      size="lg"
      variant="outline"
      className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30 font-semibold w-full sm:w-auto"
    >
      {secondaryButton.text}
    </Button>
  </div>
);

/**
 * ============================================
 * SUB-COMPONENT: OfferCard
 * ============================================
 * Special offer card component
 */
interface OfferCardProps {
  timeLeft: TimeLeft;
  pricing: CTAData['pricing'];
  benefits: Benefit[];
  discountButton: CTAData['discountButton'];
  isHovered: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({
  timeLeft,
  pricing,
  benefits,
  discountButton,
  isHovered,
}) => (
  <div className="relative animate-in fade-in zoom-in duration-1000 animation-delay-400">
    {/* Glow Effect */}
    <div
      className={cn(
        "absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 blur-3xl transition-all duration-500 hidden sm:block",
        isHovered ? "opacity-100 scale-110" : "opacity-50"
      )}
    />

    {/* Card Content */}
    <Card className="relative bg-white/15 backdrop-blur-xl transform transition-all hover:scale-105 border border-white/30">
      {/* Discount Badge - Floating */}
      <div className="absolute -top-4 -right-3 sm:-top-5 sm:-right-4 z-10">
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold px-4 py-2 sm:px-6 sm:py-3 text-xl sm:text-2xl animate-bounce border-0 shadow-lg">
          {pricing.discount}
        </Badge>
      </div>

      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-white text-center drop-shadow-md">
          Offer Ends In:
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        {/* Timer */}
        <CountdownTimer timeLeft={timeLeft} />

        {/* Pricing */}
        <PricingDisplay
          original={pricing.original}
          discounted={pricing.discounted}
          period={pricing.period}
        />

        {/* Benefits */}
        <BenefitList benefits={benefits} />
      </CardContent>

      <CardFooter className="flex flex-col gap-3 sm:gap-4 px-4 sm:px-6">
        {/* Action Button */}
        <Button
          onClick={discountButton.onClick}
          size="lg"
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:from-yellow-500 hover:to-orange-500 hover:shadow-2xl font-bold"
        >
          {discountButton.text}
        </Button>

        {/* Urgency Text */}
        <p className="text-center text-[11px] sm:text-xs text-white/80 font-medium">
          <Clock className="w-3 h-3 inline mr-1" />
          <span className="hidden sm:inline">Only {pricing.spotsRemaining} spots remaining at this price</span>
          <span className="sm:hidden">{pricing.spotsRemaining} spots left</span>
        </p>
      </CardFooter>
    </Card>
  </div>
);

/**
 * ============================================
 * MAIN COMPONENT: CTA
 * ============================================
 * Main CTA component that orchestrates all sub-components
 */
interface CTAProps {
  data: CTAData;
  initialTime?: TimeLeft;
}

export const CTA: React.FC<CTAProps> = ({ 
  data,
  initialTime = { hours: 23, minutes: 59, seconds: 59 }
}) => {
  const { timeLeft, isPlaying, toggleTimer } = useCountdownTimer(initialTime);
  const { isHovered, handlers } = useHover();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-2 sm:p-4">
      <section 
        className="relative w-full max-w-7xl"
        {...handlers}
      >
        {/* Main Container */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 shadow-2xl">
          {/* Animated Background */}
          <AnimatedBackground />

          {/* Content Container */}
          <div className="relative z-10 px-4 py-8 sm:px-8 sm:py-12 md:px-12 md:py-16 lg:px-20 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6 text-white">
                {/* Badge */}
                <CTABadge
                  text={data.badge.text}
                  icon={data.badge.icon}
                  isPlaying={isPlaying}
                  onToggle={toggleTimer}
                  showTimer
                />

                {/* Title */}
                <CTATitle main={data.title.main} highlight={data.title.highlight} />

                {/* Description */}
                <CTADescription text={data.description} />

                {/* Features */}
                <FeatureList 
                  features={data.features}
                  className="animate-in fade-in slide-in-from-left duration-700 animation-delay-600"
                />

                {/* CTA Buttons */}
                <CTAButtons
                  primaryButton={data.primaryButton}
                  secondaryButton={data.secondaryButton}
                  className="pt-4 animate-in fade-in slide-in-from-left duration-700 animation-delay-800"
                />
              </div>

              {/* Right Content - Offer Card */}
              <OfferCard
                timeLeft={timeLeft}
                pricing={data.pricing}
                benefits={data.benefits}
                discountButton={data.discountButton}
                isHovered={isHovered}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};