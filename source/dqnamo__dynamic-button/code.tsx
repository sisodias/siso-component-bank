import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  forwardRef,
  type Key,
  type ReactNode,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type DynamicButtonVariant = "primary" | "secondary";

const uiEaseOut = [0.23, 1, 0.32, 1] as const;

export type DynamicButtonProps = Omit<
  HTMLMotionProps<"button">,
  "animate" | "children" | "initial" | "ref" | "transition"
> & {
  children: string;
  icon?: ReactNode;
  stateKey?: Key;
  variant?: DynamicButtonVariant;
  width?: "content" | "full";
};

const buttonClasses: Record<DynamicButtonVariant, string> = {
  primary: "border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800",
  secondary:
    "border-neutral-200 bg-white text-neutral-950 hover:border-neutral-300 hover:bg-neutral-50",
};

function getButtonClassName({
  className,
  variant = "primary",
}: {
  className?: string;
  variant?: DynamicButtonVariant;
}) {
  return [
    "inline-flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2 text-sm font-medium transition-colors",
    buttonClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export const DynamicButton = forwardRef<HTMLButtonElement, DynamicButtonProps>(
  function DynamicButton(
    {
      children,
      className,
      icon,
      stateKey,
      type = "button",
      variant = "primary",
      width = "content",
      ...props
    },
    forwardedRef,
  ) {
    const shouldReduceMotion = useReducedMotion();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const measurementSignatureRef = useRef("");
    const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);

    const iconKey = stateKey ?? children;

    const measurementSignature = [
      children,
      className,
      icon ? "icon" : "no-icon",
      stateKey,
      variant,
    ].join("\0");

    const shouldMeasureWidth = width === "content";

    const widthTransition = shouldReduceMotion
      ? { duration: 0 }
      : { bounce: 0, duration: 0.26, type: "spring" as const };

    const contentTransition = {
      duration: shouldReduceMotion ? 0.16 : 0.18,
      ease: uiEaseOut,
    };

    const contentVisible = { opacity: 1, transform: "translateY(0px)" };

    const contentInitial = shouldReduceMotion
      ? { opacity: 0, transform: "translateY(0px)" }
      : { opacity: 0, transform: "translateY(8px)" };

    const contentExit = shouldReduceMotion
      ? { opacity: 0, transform: "translateY(0px)" }
      : { opacity: 0, transform: "translateY(-8px)" };

    useImperativeHandle(
      forwardedRef,
      () => buttonRef.current as HTMLButtonElement,
    );

    const syncWidth = useCallback(() => {
      const button = buttonRef.current;
      const measure = measureRef.current;

      if (!button || !measure || !shouldMeasureWidth) {
        return;
      }

      const styles = window.getComputedStyle(button);
      const horizontalPadding =
        Number.parseFloat(styles.paddingLeft) +
        Number.parseFloat(styles.paddingRight) +
        Number.parseFloat(styles.borderLeftWidth) +
        Number.parseFloat(styles.borderRightWidth);

      const nextWidth = Math.ceil(measure.scrollWidth + horizontalPadding);

      setMeasuredWidth((currentWidth) =>
        currentWidth === nextWidth ? currentWidth : nextWidth,
      );
    }, [shouldMeasureWidth]);

    useLayoutEffect(() => {
      const measure = measureRef.current;

      if (!measure || !shouldMeasureWidth) {
        setMeasuredWidth(null);
        return;
      }

      syncWidth();

      const observer = new ResizeObserver(syncWidth);
      observer.observe(measure);

      window.addEventListener("resize", syncWidth);

      return () => {
        observer.disconnect();
        window.removeEventListener("resize", syncWidth);
      };
    }, [shouldMeasureWidth, syncWidth]);

    useLayoutEffect(() => {
      if (measurementSignatureRef.current === measurementSignature) {
        return;
      }

      measurementSignatureRef.current = measurementSignature;
      syncWidth();
    }, [measurementSignature, syncWidth]);

    return (
      <motion.button
        {...props}
        animate={
          width === "content" ? { width: measuredWidth ?? "auto" } : undefined
        }
        className={getButtonClassName({
          className: [
            "relative overflow-hidden whitespace-nowrap",
            "transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
            width === "full" ? "w-full" : "",
            className,
          ]
            .filter(Boolean)
            .join(" "),
          variant,
        })}
        initial={false}
        ref={buttonRef}
        transition={width === "content" ? { width: widthTransition } : undefined}
        type={type}
      >
        <span className="relative inline-flex items-center gap-1.5">
          {icon ? (
            <span className="relative inline-grid size-[15px] shrink-0 overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  animate={contentVisible}
                  className="col-start-1 row-start-1 flex size-[15px] items-center justify-center"
                  exit={contentExit}
                  initial={contentInitial}
                  key={iconKey}
                  transition={contentTransition}
                >
                  {icon}
                </motion.span>
              </AnimatePresence>
            </span>
          ) : null}
          <span className="relative inline-grid overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                animate={contentVisible}
                className="col-start-1 row-start-1 block"
                exit={contentExit}
                initial={contentInitial}
                key={children}
                transition={contentTransition}
              >
                {children}
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inline-flex items-center gap-1.5 opacity-0"
          ref={measureRef}
        >
          {icon ? (
            <span className="flex size-[15px] shrink-0 items-center justify-center">
              {icon}
            </span>
          ) : null}
          <span>{children}</span>
        </span>
      </motion.button>
    );
  },
);

export default DynamicButton;
