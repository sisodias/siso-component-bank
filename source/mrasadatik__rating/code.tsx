"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

/**
 * Configuration for the Rating component
 *
 * @interface RatingProps
 */
interface RatingProps {
    /** Maximum number of stars (1-10 recommended) */
    totalStars?: number;
    /** Sum of all ratings for average calculation (display mode only) */
    totalRatingCount?: number;
    /** Number of users who provided ratings (display mode only) */
    totalRateUser?: number;
    /** Display calculated average beside stars */
    showRatingNumber?: boolean;
    /** Display user count in parentheses (display mode only) */
    showReviewCount?: boolean;
    /** Format large numbers with K/M/B abbreviations */
    useAbbreviation?: boolean;
    /** Internationalization locale (e.g., 'en-US', 'bn-BD') */
    locale?: string;
    /** Component behavior: interactive input or static display */
    mode?: "input" | "display";
    /** Visual size preset */
    size?: "sm" | "md" | "lg" | "xl";
    /** Rating change handler (input mode only) */
    onRatingChange?: (rating: number) => void;
    /** Click/input granularity: full stars, half stars, or decimal */
    precision?: "full" | "half" | "fractional";
    /** Additional CSS classes */
    className?: string;
    /** Enable hover animations and effects */
    animated?: boolean;
    /** Tailwind classes for filled star appearance */
    starFillColor?: string;
    /** Tailwind classes for filled star border */
    starStrokeColor?: string;
    /** Tailwind classes for empty star appearance */
    starEmptyColor?: string;
    /** Tailwind classes for empty star border */
    starEmptyStrokeColor?: string;
    /** Show numeric input field alongside stars (input mode only) */
    showManualInput?: boolean;
}

/**
 * Formats numbers with optional abbreviations (1K, 1M, 1B)
 * Uses locale-specific formatting for accessibility
 */
function formatNumber(num: number, useAbbreviation = true, locale = "en-US"): string {
    if (!useAbbreviation || num <= 999999) {
        return num.toLocaleString(locale);
    }

    return new Intl.NumberFormat(locale, {
        notation: "compact",
        compactDisplay: "short",
    }).format(num);
}

/**
 * Versatile rating component supporting both display and input modes
 *
 * Features:
 * - Display mode: Shows calculated averages with user counts
 * - Input mode: Interactive star selection with hover effects
 * - Internationalization support with locale-specific formatting
 * - Customizable precision (full, half, or fractional stars)
 * - Responsive sizing and theming options
 */
export function Rating({
    totalStars = 5,
    totalRatingCount = 0,
    totalRateUser = 0,
    showRatingNumber = true,
    showReviewCount = true,
    useAbbreviation = true,
    locale = "en-US",
    mode = "display",
    size = "md",
    onRatingChange,
    precision = "half",
    className,
    animated = true,
    starFillColor = "fill-amber-400 text-amber-400",
    starStrokeColor = "stroke-amber-500",
    starEmptyColor = "text-muted",
    starEmptyStrokeColor = "stroke-muted-foreground/20",
    showManualInput = true,
}: RatingProps) {
    // Calculate average rating, constrained to valid range
    const calculatedRating =
        mode === "display" && totalRateUser > 0
            ? Math.min(totalStars, Math.max(0, totalRatingCount / totalRateUser))
            : 0;

    // Input mode state management
    const [hoverRating, setHoverRating] = React.useState<number | null>(null);
    const [selectedRating, setSelectedRating] = React.useState(mode === "input" ? 0 : calculatedRating);
    const [manualInputValue, setManualInputValue] = React.useState("");

    // Sync display mode with calculated rating changes
    React.useEffect(() => {
        if (mode === "display") {
            setSelectedRating(calculatedRating);
        }
    }, [calculatedRating, mode]);

    // Priority: hover rating → selected rating → calculated rating
    const displayRating = mode === "input" ? (hoverRating !== null ? hoverRating : selectedRating) : calculatedRating;

    const precisionStep = {
        full: 1.0,
        half: 0.5,
        fractional: 0.1,
    }[precision];

    const sizeConfig = {
        sm: {
            star: "w-4 h-4",
            text: "text-sm",
            gap: "gap-0.5",
            input: "h-8 text-sm",
        },
        md: {
            star: "w-5 h-5",
            text: "text-base",
            gap: "gap-1",
            input: "h-9 text-base",
        },
        lg: {
            star: "w-6 h-6",
            text: "text-lg",
            gap: "gap-1.5",
            input: "h-10 text-lg",
        },
        xl: {
            star: "w-8 h-8",
            text: "text-xl",
            gap: "gap-2",
            input: "h-12 text-xl",
        },
    };

    const config = sizeConfig[size];

    const handleStarClick = (starIndex: number, position: number) => {
        if (mode !== "input") return;

        const newRating = Math.min(totalStars, Math.max(0, starIndex + position));
        setSelectedRating(newRating);
        setManualInputValue(
            new Intl.NumberFormat(locale, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
            }).format(newRating),
        );
        onRatingChange?.(newRating);
    };

    const handleStarHover = (starIndex: number, event: React.MouseEvent<HTMLElement>) => {
        if (mode !== "input") return;

        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percentage = x / rect.width;

        // Calculate position based on precision setting
        let position: number;
        if (precision === "full") {
            position = 1;
        } else if (precision === "half") {
            position = percentage < 0.5 ? 0.5 : 1;
        } else {
            // Fractional precision: round to nearest 0.1
            position = Math.round(percentage * 10) / 10;
            position = Math.max(0.1, Math.min(1, position));
        }

        const newRating = Math.min(totalStars, starIndex + position);
        setHoverRating(newRating);
    };

    const handleMouseLeave = () => {
        if (mode !== "input") return;
        setHoverRating(null);
    };

    const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setManualInputValue(value);

        const numValue = Number.parseFloat(value);
        if (!Number.isNaN(numValue)) {
            // Apply precision rounding and bounds checking
            const roundedValue = Math.round(numValue / precisionStep) * precisionStep;
            const clampedValue = Math.min(totalStars, Math.max(0, roundedValue));
            setSelectedRating(clampedValue);
            onRatingChange?.(clampedValue);
        }
    };

    const handleManualInputBlur = () => {
        // Sync input field with actual rating value
        setManualInputValue(
            selectedRating > 0
                ? new Intl.NumberFormat(locale, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                  }).format(selectedRating)
                : "",
        );
    };

    const renderStar = (index: number) => {
        const constrainedRating = Math.min(totalStars, Math.max(0, displayRating));
        const fillPercentage = Math.max(0, Math.min(1, constrainedRating - index));

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;

            // Same precision logic as hover handler
            let position: number;
            if (precision === "full") {
                position = 1;
            } else if (precision === "half") {
                position = percentage < 0.5 ? 0.5 : 1;
            } else {
                position = Math.round(percentage * 10) / 10;
                position = Math.max(0.1, Math.min(1, position));
            }

            handleStarClick(index, position);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStarClick(index, 1); // Keyboard defaults to full star
            }
        };

        if (mode === "input") {
            return (
                <button
                    key={index}
                    type="button"
                    className={cn(
                        "relative inline-block cursor-pointer bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 rounded",
                    )}
                    onMouseMove={(e) => handleStarHover(index, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    aria-label={`Rate ${index + 1} star${index + 1 > 1 ? "s" : ""}`}
                >
                    <motion.div
                        className="relative"
                        initial={false}
                        animate={{
                            scale: animated && hoverRating !== null && index < hoverRating ? 1.1 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        {/* Empty star background */}
                        <Star
                            className={cn(
                                config.star,
                                starEmptyColor,
                                starEmptyStrokeColor,
                                "transition-colors duration-150",
                            )}
                            strokeWidth={1.5}
                        />

                        {/* Partial fill overlay using width clipping */}
                        <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage * 100}%` }}>
                            <Star
                                className={cn(
                                    config.star,
                                    starFillColor,
                                    starStrokeColor,
                                    hoverRating !== null && "brightness-110",
                                )}
                                strokeWidth={1.5}
                            />
                        </div>

                        {/* Animated glow effect on hover */}
                        {hoverRating !== null && index < hoverRating && (
                            <motion.div
                                className="absolute inset-0 -z-10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.3, scale: 1.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Star className={cn(config.star, starFillColor, "blur-sm")} />
                            </motion.div>
                        )}
                    </motion.div>
                </button>
            );
        }

        // Display mode: static, non-interactive stars
        return (
            <div key={index} className="relative inline-block">
                <motion.div
                    className="relative"
                    initial={false}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <Star className={cn(config.star, starEmptyColor, starEmptyStrokeColor)} strokeWidth={1.5} />

                    {/* Partial fill for fractional ratings */}
                    <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage * 100}%` }}>
                        <Star className={cn(config.star, starFillColor, starStrokeColor)} strokeWidth={1.5} />
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className={cn("inline-flex items-center flex-wrap", config.gap, className)}>
            {/* Star rating visualization */}
            <div className={cn("flex items-center", config.gap)}>
                {Array.from({ length: totalStars }, (_, i) => renderStar(i))}
            </div>

            {/* Calculated average display */}
            {mode === "display" && (
                <AnimatePresence mode="wait">
                    {showRatingNumber && (
                        <motion.span
                            key={displayRating}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            transition={{ duration: 0.2 }}
                            className={cn("font-semibold text-foreground tabular-nums", config.text)}
                        >
                            {new Intl.NumberFormat(locale, {
                                minimumFractionDigits: 1,
                                maximumFractionDigits: 1,
                            }).format(displayRating)}
                        </motion.span>
                    )}
                </AnimatePresence>
            )}

            {/* User count with abbreviated formatting */}
            <AnimatePresence>
                {mode === "display" && showReviewCount && totalRateUser > 0 && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={cn("text-muted-foreground tabular-nums", config.text)}
                    >
                        ({formatNumber(totalRateUser, useAbbreviation, locale)})
                    </motion.span>
                )}
            </AnimatePresence>

            {/* Direct numeric input alternative */}
            {mode === "input" && showManualInput && (
                <Input
                    type="number"
                    min={0}
                    max={totalStars}
                    step={precisionStep}
                    value={manualInputValue}
                    onChange={handleManualInputChange}
                    onBlur={handleManualInputBlur}
                    placeholder="0.0"
                    className={cn("w-20 tabular-nums", config.input)}
                />
            )}
        </div>
    );
}
