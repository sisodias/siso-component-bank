import React, { useEffect, useState } from "react";
import { Property } from "csstype";
import clsx from "clsx";

const BREAKPOINTS = {
  SM: 0,
  MD: 600,
  LG: 960,
  XL: 1200
}

export const useResponsive = (styles: any) => {
  const [responsiveStyles, setResponsiveStyles] = useState();

  useEffect(() => {
    const getResponsive = (styles: any) => {
      let currentDirection;
      if (typeof styles === "object") {
        if (styles.sm && window.innerWidth >= BREAKPOINTS.SM) {
          currentDirection = (styles.sm);
        } if (styles.md && window.innerWidth >= BREAKPOINTS.MD) {
          currentDirection = (styles.md);
        } if (styles.lg && window.innerWidth >= BREAKPOINTS.LG) {
          currentDirection = (styles.lg);
        } if (styles.xl && window.innerWidth >= BREAKPOINTS.XL) {
          currentDirection = (styles.xl);
        }
      } else {
        currentDirection = (styles);
      }
      return currentDirection;
    };

    const listener = () => {
      setResponsiveStyles(getResponsive(styles));
    };

    listener();

    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [JSON.stringify(styles)]);

  return responsiveStyles;
};

interface ResponsiveProp<T> {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

const variants = {
  "heading-72": "font-semibold leading-[4.5rem] tracking-[-4.32px]",
  "heading-64": "font-semibold leading-[4rem] tracking-[-3.84px]",
  "heading-56": "font-semibold leading-[3.5rem] tracking-[-3.36px]",
  "heading-48": "font-semibold leading-[3.5rem] tracking-[-2.88px]",
  "heading-40": "font-semibold leading-[3rem] tracking-[-2.4px]",
  "heading-32": "font-semibold leading-10 tracking-[-1.28px]",
  "heading-24": "font-semibold leading-8 tracking-[-0.96px]",
  "heading-20": "font-semibold leading-[1.625rem] tracking-[-0.4px]",
  "heading-16": "font-semibold leading-6 tracking-[-0.32px]",
  "button-16": "font-medium leading-5",
  "button-14": "font-medium leading-5",
  "button-12": "font-medium leading-4",
  "label-20": "leading-8",
  "label-18": "leading-5",
  "label-16": "leading-5",
  "label-14": "leading-5",
  "label-13": "leading-4",
  "label-12": "leading-4",
  "copy-24": "leading-9",
  "copy-20": "leading-9",
  "copy-18": "leading-7",
  "copy-16": "leading-6",
  "copy-14": "leading-5",
  "copy-13": "leading-[1.125rem]"
};

export type TTextVariant = keyof typeof variants;

interface TextProps {
  size?: number | ResponsiveProp<number>;
  variant?: TTextVariant | ResponsiveProp<TTextVariant>;
  transform?: Property.TextTransform;
  color?: string;
  children?: React.ReactNode;
  truncate?: boolean | number;
  align?: Property.TextAlign;
  monospace?: boolean;
  className?: string;
}

export const Text = ({
  size = 16,
  variant,
  transform,
  color = "gray-1000",
  children,
  truncate,
  align,
  monospace = false,
  className
}: TextProps) => {
  let _size = useResponsive(size) || 16;
  const _variant = useResponsive(variant) || "";
  if (_variant) {
    _size = parseInt((_variant as string)?.split("-")[1]);
  }

  return (
    <p
      className={clsx(
        monospace ? "font-mono" : "font-sans",
        !_variant && _size >= 48 && "font-bold",
        !_variant && _size >= 20 && _size < 48 && "font-semibold",
        !_variant && _size >= 72 && "leading-[4.5rem]",
        !_variant && _size >= 64 && _size < 72 && "leading-[4rem]",
        !_variant && _size >= 48 && _size < 64 && "leading-[3.5rem]",
        !_variant && _size >= 32 && _size < 48 && "leading-10",
        !_variant && _size >= 28 && _size < 32 && "leading-9",
        !_variant && _size >= 24 && _size < 28 && "leading-8",
        !_variant && _size >= 16 && _size < 24 && "leading-6",
        !_variant && _size >= 14 && _size < 16 && "leading-5",
        !_variant && _size >= 12 && _size < 14 && "leading-4",
        !_variant && _size >= 10 && _size < 12 && "leading-3",
        !!_variant && variants[_variant],
        typeof truncate === "boolean" && "truncate",
        className
      )}
      style={{
        color: `var(--ds-${color})`,
        fontSize: `${_size}px`,
        textTransform: transform,
        textAlign: align,
        display: typeof truncate === "number" ? "-webkit-box" : undefined,
        WebkitBoxOrient: typeof truncate === "number" ? "vertical" : undefined,
        WebkitLineClamp: typeof truncate === "number" ? truncate : undefined,
        overflow: typeof truncate === "number" ? "hidden" : undefined,
    }}
    >
      {children}
    </p>
  );
};