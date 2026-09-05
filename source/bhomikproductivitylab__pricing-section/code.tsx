import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={cn("w-4 h-4", className)} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TargetIcon = ({ className }: { className?: string }) => (
    <svg className={cn("w-4 h-4", className)} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="8" cy="8" r="1" fill="currentColor" />
    </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
    <svg className={cn("w-4 h-4", className)} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 14L6 10L9 12L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 6H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const ListIcon = ({ className }: { className?: string }) => (
    <svg className={cn("w-4 h-4", className)} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 4H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const TrendIcon = ({ className }: { className?: string }) => (
    <svg className={cn("w-4 h-4", className)} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12L7 8L9 10L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 5H13V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const GearIcon = ({ className }: { className?: string }) => (
    <svg className={cn("w-4 h-4", className)} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 2V4M8 12V14M14 8H12M4 8H2M12.5 3.5L11 5M5 11L3.5 12.5M12.5 12.5L11 11M5 5L3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const BookIcon = ({ className }: { className?: string }) => (
    <svg className={cn("w-4 h-4", className)} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 3C2 2.44772 2.44772 2 3 2H6C7.10457 2 8 2.89543 8 4V14C8 13.4477 7.55228 13 7 13H3C2.44772 13 2 12.5523 2 12V3Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 3C14 2.44772 13.5523 2 13 2H10C8.89543 2 8 2.89543 8 4V14C8 13.4477 8.44772 13 9 13H13C13.5523 13 14 12.5523 14 12V3Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

const ArrowIcon = ({ className }: { className?: string }) => (
    <svg className={cn("w-4 h-4", className)} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const featureIcons: Record<string, React.FC<{ className?: string }>> = {
    strategy: TargetIcon,
    leads: ChartIcon,
    audit: ListIcon,
    performance: TrendIcon,
    automation: GearIcon,
    training: BookIcon,
    default: CheckIcon,
};

export interface PricingFeature {
    text: string;
    iconType?: keyof typeof featureIcons;
}

export interface PricingPlan {
    name: string;
    subtitle: string;
    monthlyPrice: number;
    yearlyPrice: number;
    billingPeriod: string;
    description: string;
    features: PricingFeature[];
    ctaText: string;
    isPopular?: boolean;
    badgeText?: string;
}

export interface CustomQuoteSection {
    title: string;
    description: string;
    ctaText: string;
}

export interface PricingProps {
    sectionTag: string;
    mainHeading: string;
    sectionDescription: string;
    plans: PricingPlan[];
    customQuote: CustomQuoteSection;
    onPlanSelect?: (planName: string) => void;
    onCustomQuote?: () => void;
    className?: string;
}

const AnimatedPrice = ({ value }: { value: number }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
    const [displayValue, setDisplayValue] = useState("0");

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 1.5,
            ease: "easeOut"
        });

        return rounded.on("change", (latest) => {
            setDisplayValue(latest);
        });
    }, [value, count, rounded]);

    return (
        <div className="flex overflow-hidden h-10 items-baseline">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">$</span>
            <span className="text-4xl font-bold text-gray-900 dark:text-white inline-block ml-1">
                {displayValue}
            </span>
        </div>
    );
};

const PricingCard = ({
    plan,
    onSelect,
    isYearly,
}: {
    plan: PricingPlan;
    onSelect?: () => void;
    isYearly: boolean;
}) => {
    const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const period = isYearly ? "year" : "month";

    return (
        <div
            className={cn(
                "relative bg-white dark:bg-gray-900 rounded-2xl p-8 flex flex-col transition-all duration-300",
                "shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
                "border border-gray-100 dark:border-gray-800",
                "flex-1 min-w-[320px] max-w-[380px]"
            )}
        >
            {plan.isPopular && plan.badgeText && (
                <div className="absolute top-6 right-6">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-500 text-white text-xs font-medium rounded-full">
                        <span className="text-sm">+</span>
                        {plan.badgeText}
                    </span>
                </div>
            )}

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{plan.subtitle}</p>

            <div className="flex items-baseline gap-1 mb-1">
                <AnimatedPrice value={currentPrice} />
                <span className="text-gray-500 dark:text-gray-400 text-sm">/{period}</span>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{plan.description}</p>

            <div className="border-t border-dashed border-gray-300 dark:border-gray-700 mb-6" />

            <div className="flex flex-col gap-3.5 flex-1">
                {plan.features.map((feature, index) => {
                    const IconComponent = feature.iconType
                        ? featureIcons[feature.iconType] || featureIcons.default
                        : featureIcons.default;

                    return (
                        <div key={index} className="flex items-center gap-3">
                            <IconComponent className="text-gray-600 dark:text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{feature.text}</span>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={onSelect}
                className={cn(
                    "mt-8 w-full py-3.5 px-6 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer",
                    plan.isPopular
                        ? "bg-purple-500 hover:bg-purple-600 text-white"
                        : "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white"
                )}
            >
                {plan.ctaText}
            </button>
        </div>
    );
};

const CustomQuoteBar = ({
    customQuote,
    onCustomQuote,
    maxWidth,
}: {
    customQuote: CustomQuoteSection;
    onCustomQuote?: () => void;
    maxWidth?: string;
}) => {
    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-900 rounded-2xl p-6 px-8 transition-all duration-300",
                "shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
                "border border-gray-100 dark:border-gray-800",
                "flex flex-col md:flex-row items-center justify-between gap-6",
                "w-full"
            )}
            style={{ maxWidth }}
        >
            <div className="text-center md:text-left">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {customQuote.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                    {customQuote.description}
                </p>
            </div>
            <button
                onClick={onCustomQuote}
                className={cn(
                    "px-8 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white",
                    "rounded-xl font-medium text-sm transition-all duration-200",
                    "w-full md:w-auto flex-shrink-0 cursor-pointer"
                )}
            >
                {customQuote.ctaText}
            </button>
        </div>
    );
};

export const Pricing = ({
    sectionTag,
    mainHeading,
    sectionDescription,
    plans,
    customQuote,
    onPlanSelect,
    onCustomQuote,
    className,
}: PricingProps) => {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section
            className={cn(
                "w-full min-h-screen bg-white dark:bg-black py-16 px-6 transition-colors duration-300",
                "flex flex-col items-center",
                className
            )}
        >
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium text-sm mb-4">
                    <span>{sectionTag}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                </div>

                <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-4">
                    {mainHeading.split(" ").map((word, index, arr) => (
                        <span key={index}>
                            {index === arr.length - 1 ? (
                                <span className="font-bold">{word}</span>
                            ) : (
                                <span className="font-light">{word} </span>
                            )}
                        </span>
                    ))}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed mb-8">
                    {sectionDescription}
                </p>

                <div className="flex items-center justify-center gap-4 mb-4">
                    <span className={cn("text-sm font-medium transition-colors", !isYearly ? "text-gray-900 dark:text-white" : "text-gray-500")}>
                        Monthly
                    </span>
                    <button
                        onClick={() => setIsYearly(!isYearly)}
                        className={cn(
                            "relative w-12 h-6 rounded-full p-1 transition-colors focus:outline-none",
                            isYearly ? "bg-purple-600 dark:bg-purple-500" : "bg-gray-200 dark:bg-gray-800"
                        )}
                    >
                        <motion.div
                            animate={{ x: isYearly ? 24 : 0 }}
                            className="w-4 h-4 bg-white rounded-full shadow-sm"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    </button>
                    <span className={cn("text-sm font-medium transition-colors", isYearly ? "text-gray-900 dark:text-white" : "text-gray-500")}>
                        Yearly
                        <span className="ml-1.5 inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] rounded-full uppercase tracking-wider">
                            -20%
                        </span>
                    </span>
                </div>
            </div>

            <div className="w-full max-w-[784px] flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-center gap-6">
                    {plans.map((plan, index) => (
                        <PricingCard
                            key={index}
                            plan={plan}
                            isYearly={isYearly}
                            onSelect={() => onPlanSelect?.(plan.name)}
                        />
                    ))}
                </div>

                <CustomQuoteBar
                    customQuote={customQuote}
                    onCustomQuote={onCustomQuote}
                />
            </div>
        </section>
    );
};

export const Component = Pricing;
