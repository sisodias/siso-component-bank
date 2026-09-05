import { useRef, useEffect, useState, ReactNode } from "react";
import { useSpring, animated, SpringConfig } from "@react-spring/web";

interface AnimatedContentProps {
  children: ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  config?: SpringConfig;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  className?: string; // Added className for styling from demo
  style?: React.CSSProperties; // Added style prop for styling from demo
}

export const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
  config = { tension: 50, friction: 25 },
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  className,
  style
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(element);
          setTimeout(() => {
            setInView(true);
          }, delay);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, delay]);

  const directionsConfig: Record<"vertical" | "horizontal", string> = {
    vertical: "Y",
    horizontal: "X",
  };

  const transformFrom = `translate${directionsConfig[direction]}(${
    reverse ? `-${distance}px` : `${distance}px`
  }) scale(${scale})`;
  
  const transformTo = `translate${directionsConfig[direction]}(0px) scale(1)`;

  const springProps = useSpring({
    from: {
      transform: transformFrom,
      opacity: animateOpacity ? initialOpacity : 1,
    },
    to: async (next) => {
      if (inView) {
        await next({
          transform: transformTo,
          opacity: 1,
        });
      }
    },
    config,
    // Reset animation if inView becomes false (e.g. if component re-renders and inView resets)
    // This part is optional and depends on desired behavior if the component could re-trigger
    reset: !inView && initialOpacity !== 1, // Only reset if it's not already at the target opacity
  });

  return (
    <animated.div ref={ref} style={{...style, ...springProps}} className={className}>
      {children}
    </animated.div>
  );
};