"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react"
import {
  AnimatePresence,
  AnimatePresenceProps,
  motion,
  MotionProps,
  Transition,
} from "framer-motion" // Using framer-motion directly

import { cn } from "@/lib/utils"

interface TextRotatorProps {
  /** An array of strings to rotate through. */
  texts: string[]
  /** Time in ms between text rotations. */
  rotationInterval?: number
  /** Framer Motion 'initial' prop. */
  initial?: MotionProps["initial"]
  /** Framer Motion 'animate' prop. */
  animate?: MotionProps["animate"]
  /** Framer Motion 'exit' prop. */
  exit?: MotionProps["exit"]
  /** Framer Motion 'AnimatePresence' mode. */
  animatePresenceMode?: AnimatePresenceProps["mode"]
  /** Framer Motion 'AnimatePresence' initial prop. */
  animatePresenceInitial?: boolean
  /** Stagger duration in seconds for each element. */
  staggerDuration?: number
  /** Staggering start point. */
  staggerFrom?: "first" | "last" | "center" | number | "random"
  /** Framer Motion 'transition' prop. */
  transition?: Transition
  /** Whether to loop back to the first text. */
  loop?: boolean
  /** Whether to start the animation automatically. */
  auto?: boolean
  /** Split level for animation (characters, words, or lines). */
  splitBy?: "words" | "characters" | "lines" | string
  /** Callback function when the text changes. */
  onNext?: (index: number) => void
  /** ClassName for the main wrapper span. */
  mainClassName?: string
  /** ClassName for the split-level element (e.g., each word). */
  splitLevelClassName?: string
  /** ClassName for the individual animated element (e.g., each character). */
  elementLevelClassName?: string
}

export interface TextRotatorRef {
  /** Manually trigger the next text. */
  next: () => void
  /** Manually trigger the previous text. */
  previous: () => void
  /** Jump to a specific text index. */
  jumpTo: (index: number) => void
  /** Reset to the first text. */
  reset: () => void
}

interface WordObject {
  characters: string[]
  needsSpace: boolean
}

const TextRotator = forwardRef<TextRotatorRef, TextRotatorProps>(
  (
    {
      texts,
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { opacity: 0, y: "100%" },
      animate = { opacity: 1, y: 0 },
      exit = { opacity: 0, y: "-120%" },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      ...props
    },
    ref
  ) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0)

    // Splits text into characters with support for unicode/emojis
    const splitIntoCharacters = (text: string): string[] => {
      if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })
        return Array.from(segmenter.segment(text), ({ segment }) => segment)
      }
      // Fallback for older browsers
      return Array.from(text)
    }

    const elements = useMemo(() => {
      const currentText = texts[currentTextIndex]
      if (splitBy === "characters") {
        const text = currentText.split(" ")
        return text.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== text.length - 1,
        }))
      }
      return splitBy === "words"
        ? currentText.split(" ")
        : splitBy === "lines"
          ? currentText.split("\n")
          : currentText.split(splitBy)
    }, [texts, currentTextIndex, splitBy])

    const getStaggerDelay = useCallback(
      (index: number, totalChars: number) => {
        const total = totalChars
        if (staggerFrom === "first") return index * staggerDuration
        if (staggerFrom === "last") return (total - 1 - index) * staggerDuration
        if (staggerFrom === "center") {
          const center = Math.floor(total / 2)
          return Math.abs(center - index) * staggerDuration
        }
        if (staggerFrom === "random") {
          const randomIndex = Math.floor(Math.random() * total)
          return Math.abs(randomIndex - index) * staggerDuration
        }
        return Math.abs(staggerFrom - index) * staggerDuration
      },
      [staggerFrom, staggerDuration]
    )

    // Helper function to handle index changes and trigger callback
    const handleIndexChange = useCallback(
      (newIndex: number) => {
        setCurrentTextIndex(newIndex)
        onNext?.(newIndex)
      },
      [onNext]
    )

    const next = useCallback(() => {
      const nextIndex =
        currentTextIndex === texts.length - 1
          ? loop
            ? 0
            : currentTextIndex
          : currentTextIndex + 1

      if (nextIndex !== currentTextIndex) {
        handleIndexChange(nextIndex)
      }
    }, [currentTextIndex, texts.length, loop, handleIndexChange])

    const previous = useCallback(() => {
      const prevIndex =
        currentTextIndex === 0
          ? loop
            ? texts.length - 1
            : currentTextIndex
          : currentTextIndex - 1

      if (prevIndex !== currentTextIndex) {
        handleIndexChange(prevIndex)
      }
    }, [currentTextIndex, texts.length, loop, handleIndexChange])

    const jumpTo = useCallback(
      (index: number) => {
        const validIndex = Math.max(0, Math.min(index, texts.length - 1))
        if (validIndex !== currentTextIndex) {
          handleIndexChange(validIndex)
        }
      },
      [texts.length, currentTextIndex, handleIndexChange]
    )

    const reset = useCallback(() => {
      if (currentTextIndex !== 0) {
        handleIndexChange(0)
      }
    }, [currentTextIndex, handleIndexChange])

    // Expose all navigation functions via ref
    useImperativeHandle(
      ref,
      () => ({
        next,
        previous,
        jumpTo,
        reset,
      }),
      [next, previous, jumpTo, reset]
    )

    useEffect(() => {
      if (!auto) return
      const intervalId = setInterval(next, rotationInterval)
      return () => clearInterval(intervalId)
    }, [next, rotationInterval, auto])

    return (
      <motion.span
        className={cn("flex flex-wrap whitespace-pre-wrap", mainClassName)}
        {...props}
        layout
        transition={transition}
      >
        {/* Accessibility: Screen reader only text */}
        <span className="sr-only">{texts[currentTextIndex]}</span>

        <AnimatePresence
          mode={animatePresenceMode}
          initial={animatePresenceInitial}
        >
          <motion.div
            key={currentTextIndex}
            className={cn(
              "flex flex-wrap",
              splitBy === "lines" && "flex-col w-full"
            )}
            layout
            aria-hidden="true"
          >
            {(splitBy === "characters"
              ? (elements as WordObject[])
              : (elements as string[]).map((el, i) => ({
                  characters: [el],
                  needsSpace: i !== elements.length - 1,
                }))
            ).map((wordObj, wordIndex, array) => {
              const previousCharsCount = array
                .slice(0, wordIndex)
                .reduce((sum, word) => sum + word.characters.length, 0)

              return (
                <span
                  key={wordIndex}
                  className={cn("inline-flex", splitLevelClassName)}
                >
                  {wordObj.characters.map((char, charIndex) => (
                    <motion.span
                      initial={initial}
                      animate={animate}
                      exit={exit}
                      key={charIndex}
                      transition={{
                        ...transition,
                        delay: getStaggerDelay(
                          previousCharsCount + charIndex,
                          array.reduce(
                            (sum, word) => sum + word.characters.length,
                            0
                          )
                        ),
                      }}
                      className={cn("inline-block", elementLevelClassName)}
                    >
                      {char}
                    </motion.span>
                  ))}
                  {/* Add space between words if needed */}
                  {wordObj.needsSpace && (
                    <span className="whitespace-pre"> </span>
                  )}
                </span>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </motion.span>
    )
  }
)

TextRotator.displayName = "TextRotator"

export { TextRotator }