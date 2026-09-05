import React, { FC } from "react";
import { cn } from "@/lib/utils";
import 'daisyui';

export const tooltipVariants = {
    base: "tooltip",
    part: {
        content: "tooltip-content",
    },
    placement: {
        top: "tooltip-top",
        bottom: "tooltip-bottom",
        left: "tooltip-left",
        right: "tooltip-right",
    },
    modifier: {
        open: "tooltip-open",
    },
    color: {
        primary: "tooltip-primary",
        secondary: "tooltip-secondary",
        accent: "tooltip-accent",
        info: "tooltip-info",
        success: "tooltip-success",
        warning: "tooltip-warning",
        error: "tooltip-error",
        neutral: "tooltip-neutral",
    }
};

export type TooltipModifier = keyof typeof tooltipVariants.modifier;
export type TooltipPlacement = keyof typeof tooltipVariants.placement;
export type TooltipColor = keyof typeof tooltipVariants.color;

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
    color?: TooltipColor;
    placement?: TooltipPlacement;
    modifier?: TooltipModifier;
    children?: React.ReactNode;
}

const TooltipDaisyUI: FC<TooltipProps> = (props) => {
    const { color, placement, modifier, className, ...divProps } = props;
    const tooltipClassName = cn(
        tooltipVariants.base,
        color && tooltipVariants.color[color],
        placement && tooltipVariants.placement[placement],
        modifier && tooltipVariants.modifier[modifier],
        className
    );
    return (
        <div className={tooltipClassName} {...divProps} />
    );
};

const TooltipContentDaisyUI: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
    const { className, ...divProps } = props;
    const contentClassName = cn(
        tooltipVariants.part.content,
        className
    );
    return (
        <div className={contentClassName} {...divProps} />
    );
}

export default TooltipDaisyUI;
export { TooltipContentDaisyUI };
