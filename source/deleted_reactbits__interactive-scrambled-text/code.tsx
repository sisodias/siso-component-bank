
'use client';

import {
  useEffect,
  useRef,
  FC,
  ReactNode,
  CSSProperties,
} from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';


gsap.registerPlugin(SplitText, ScrambleTextPlugin);

/**
 * Props for the InteractiveScrambledText component.
 */
interface InteractiveScrambledTextProps {
  /** The radius of the scramble effect around the pointer. */
  radius?: number;
  /** The duration of the scramble animation. */
  duration?: number;
  /** The speed of the character scrambling. */
  speed?: number;
  /** The characters to use for the scramble effect. */
  scrambleChars?: string;
  /** Additional CSS classes to apply to the container. */
  className?: string;
  /** Inline CSS styles to apply to the container. */
  style?: CSSProperties;
  /** The text content to be animated. */
  children: ReactNode;
}


const InteractiveScrambledText: FC<InteractiveScrambledTextProps> = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || !children) return;

    // Target the paragraph element for the split animation
    const paragraph = rootRef.current.querySelector('p');
    if (!paragraph) return;

    const split = SplitText.create(paragraph, {
      type: 'chars',
      charsClass: 'inline-block will-change-transform',
    });

    // Store the original character content in a data attribute
    split.chars.forEach((char) => {
      gsap.set(char, { attr: { 'data-content': char.innerHTML } });
    });

    const handlePointerMove = (e: PointerEvent) => {
      split.chars.forEach((char) => {
        const { left, top, width, height } = char.getBoundingClientRect();
        const charCenterX = left + width / 2;
        const charCenterY = top + height / 2;
        const distance = Math.hypot(e.clientX - charCenterX, e.clientY - charCenterY);

        if (distance < radius) {
          gsap.to(char, {
            overwrite: true,
            duration: duration * (1 - distance / radius), // Effect is faster closer to the center
            scrambleText: {
              text: char.dataset.content || '',
              chars: scrambleChars,
              speed,
            },
            ease: 'none',
          });
        }
      });
    };

    const container = rootRef.current;
    container.addEventListener('pointermove', handlePointerMove);

    // Cleanup function
    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      // Revert the SplitText to restore the original DOM structure
      if (split.revert) {
        split.revert();
      }
    };
  }, [radius, duration, speed, scrambleChars, children]);

  return (
    <div
      ref={rootRef}
      className={`font-mono text-[clamp(14px,4vw,32px)] text-neutral-800 dark:text-neutral-200 transition-colors duration-300 ${className}`}
      style={style}
    >
      <p>{children}</p>
    </div>
  );
};

export default InteractiveScrambledText;