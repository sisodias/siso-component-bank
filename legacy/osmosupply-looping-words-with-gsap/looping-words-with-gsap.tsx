/* src/components/ui/component.tsx */
'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

interface LoopingWordsProps {
  words: string[];
}

export const LoopingWords: React.FC<LoopingWordsProps> = ({ words }) => {
  const wordListRef = useRef<HTMLUListElement>(null);
  const edgeElementRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Calculate total words and the height percentage for each word's vertical shift.
  const totalWords = words.length;
  const wordHeight = 100 / totalWords;

  // `currentIndex` is managed locally within the animation scope, not as React state,
  // to avoid re-renders that would interfere with GSAP's direct DOM manipulation.
  let currentIndex = 0; // This variable persists across `moveWords` calls within the useEffect closure.

  // Callback to update the width of the selector edge based on the currently displayed word.
  const updateEdgeWidth = useCallback(() => {
    const wordList = wordListRef.current;
    const edgeElement = edgeElementRef.current;
    if (!wordList || !edgeElement) return;

    // The original JS targets the word at `currentIndex + 1` for width calculation,
    // as that is effectively the word centered in the viewport after the list has shifted.
    const centerWordIndex = (currentIndex + 1) % totalWords;
    const centerWord = wordList.children[centerWordIndex] as HTMLLIElement;

    if (centerWord) {
      const centerWordWidth = centerWord.getBoundingClientRect().width;
      const listWidth = wordList.getBoundingClientRect().width;
      const percentageWidth = (centerWordWidth / listWidth) * 100;

      gsap.to(edgeElement, {
        width: `${percentageWidth}%`,
        duration: 0.5,
        ease: 'expo.out', // Corresponds to 'Expo.easeOut' in older GSAP versions
      });
    }
  }, [totalWords]);

  // Callback to animate the word list and manage the infinite loop.
  const moveWords = useCallback(() => {
    const wordList = wordListRef.current;
    if (!wordList) return;

    currentIndex++; // Increment the local currentIndex for the next word.

    gsap.to(wordList, {
      yPercent: -wordHeight * currentIndex,
      duration: 1.2,
      ease: 'elastic.out(1, 0.85)',
      onStart: updateEdgeWidth, // Update selector width at the start of the word scroll animation.
      onComplete: function() {
        // This is the core logic for the seamless looping effect from the original JS.
        // When currentIndex reaches `totalWords - 3`, it means the visual end of the
        // "original" list is near, so we perform a trick:
        // 1. Move the first `li` element to the end of the `ul`.
        // 2. Decrement `currentIndex` to compensate for the shifted element.
        // 3. Instantly reset the `yPercent` of the `ul` to maintain visual continuity.
        if (currentIndex >= totalWords - 3) {
          wordList.appendChild(wordList.children[0]);
          currentIndex--; // Adjust index for the shift
          gsap.set(wordList, { yPercent: -wordHeight * currentIndex }); // Snap to new position
        }
      },
    });
  }, [wordListRef, wordHeight, updateEdgeWidth, totalWords]);

  // useEffect to initialize and clean up the GSAP animation timeline.
  useEffect(() => {
    // Initial call to set the edge width for the first word.
    // This runs once when the component mounts.
    updateEdgeWidth();

    // Create the GSAP timeline with infinite repetition.
    timelineRef.current = gsap.timeline({ repeat: -1, delay: 1 });
    timelineRef.current
      .call(moveWords) // Call `moveWords` function at the start of each cycle.
      .to({}, { duration: 2 }); // Then, a 2-second pause before the next cycle starts.

    // Cleanup function: kill the GSAP timeline when the component unmounts
    // to prevent memory leaks and ensure animations stop gracefully.
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [moveWords, updateEdgeWidth]); // Dependencies ensure the effect recreates if these callbacks change.

  return (
    <>
      <section className="cloneable">
        <div className="looping-words">
          <div className="looping-words__containers">
            <ul data-looping-words-list="" className="looping-words__list" ref={wordListRef}>
              {words.map((word, index) => (
                // Each list item also has the `looping-words__list` class, as per original HTML.
                <li key={index} className="looping-words__list">
                  <p className="looping-words__p">{word}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="looping-words__fade"></div>
          <div data-looping-words-selector="" className="looping-words__selector" ref={edgeElementRef}>
            <div className="looping-words__edge"></div>
            <div className="looping-words__edge is--2"></div>
            <div className="looping-words__edge is--3"></div>
            <div className="looping-words__edge is--4"></div>
          </div>
        </div>
      </section>
      <div className="osmo-credits">
        <p className="osmo-credits__p">
          Resource by{' '}
          <a target="_blank" href="https://www.osmo.supply/" className="osmo-credits__p-a">
            Osmo
          </a>
        </p>
      </div>
    </>
  );
};