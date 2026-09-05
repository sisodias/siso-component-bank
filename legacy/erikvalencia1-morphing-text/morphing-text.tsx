// Original text effect component with character morphing animation
// Each character animates independently for a unique effect

import { cn } from "../_utils/cn";
import { useState, useEffect } from "react";

interface MorphingTextProps {
  words: string[];
  className?: string;
  interval?: number;
}

export const MorphingText = ({ 
  words, 
  className,
  interval = 3000 
}: MorphingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [morphProgress, setMorphProgress] = useState(0);

  const currentWord = words[currentIndex];
  const nextWord = words[(currentIndex + 1) % words.length];

  useEffect(() => {
    // Morph animation
    const morphDuration = 800;
    const steps = 20;
    let step = 0;

    const morphInterval = setInterval(() => {
      step++;
      const progress = step / steps;
      setMorphProgress(progress);

      if (progress < 0.5) {
        // Morphing out
        const charCount = Math.floor(currentWord.length * (1 - progress * 2));
        setDisplayText(currentWord.slice(0, charCount));
      } else {
        // Morphing in
        const charCount = Math.floor(nextWord.length * ((progress - 0.5) * 2));
        setDisplayText(nextWord.slice(0, charCount));
      }

      if (step >= steps) {
        clearInterval(morphInterval);
        setDisplayText(nextWord);
      }
    }, morphDuration / steps);

    const wordTimeout = setTimeout(() => {
      setCurrentIndex((currentIndex + 1) % words.length);
    }, interval);

    return () => {
      clearInterval(morphInterval);
      clearTimeout(wordTimeout);
    };
  }, [currentIndex, currentWord, nextWord, interval, words.length]);

  return (
    <div className={cn("relative inline-block", className)}>
      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        {displayText}
        <span className="inline-block w-0.5 h-8 bg-gradient-to-b from-blue-600 to-purple-600 animate-pulse ml-1" />
      </span>
    </div>
  );
};
