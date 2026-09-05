'use client';

import React, { useEffect, useRef, useState } from 'react';

type TextScrambleProps = {
  /** Strings to display one after another */
  phrases: string[];
  /** Characters used for the scrambling effect */
  chars?: string;
  /** Delay between phrase completions and the next phrase (ms) */
  pauseMs?: number;
  /** Start automatically on mount */
  autoStart?: boolean;
  /** Loop through phrases forever */
  loop?: boolean;
  /** Class applied to the live text container */
  textClass?: string;
  /** Class applied to the scrambling (dud) characters */
  dudClass?: string;
  /** Called whenever a phrase finishes animating */
  onPhraseComplete?: (index: number) => void;
};

type QueueItem = {
  from: string;
  to: string;
  start: number;
  end: number;
  char?: string;
};

const TextScramble = ({
  phrases,
  chars = '!<>-_\\/[]{}—=+*^?#________',
  pauseMs = 800,
  autoStart = true,
  loop = true,
  textClass = 'text-3xl font-semibold text-white',
  dudClass = 'text-white/40',
  onPhraseComplete,
}: TextScrambleProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const queueRef = useRef<QueueItem[]>([]);
  const frameCountRef = useRef(0);
  const [index, setIndex] = useState(0);

  // core: scramble one phrase into the next
  const setText = (newText: string): Promise<void> => {
    const el = containerRef.current!;
    const oldText = el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const q: QueueItem[] = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      q.push({ from, to, start, end });
    }
    queueRef.current = q;
    frameCountRef.current = 0;

    return new Promise<void>((resolve) => {
      const step = () => {
        let output = '';
        let complete = 0;
        const queue = queueRef.current;

        for (let i = 0; i < queue.length; i++) {
          let { from, to, start, end, char } = queue[i];
          if (frameCountRef.current >= end) {
            complete++;
            output += to;
          } else if (frameCountRef.current >= start) {
            if (!char || Math.random() < 0.28) {
              char = randomChar(chars);
              queue[i].char = char;
            }
            output += `<span class="${dudClass}">${escapeHtml(char)}</span>`;
          } else {
            output += escapeHtml(from);
          }
        }

        el.innerHTML = output;

        if (complete === queue.length) {
          resolve();
        } else {
          frameCountRef.current++;
          frameRef.current = requestAnimationFrame(step);
        }
      };

      cancelAnimationFrameSafe(frameRef.current);
      frameRef.current = requestAnimationFrame(step);
    });
  };

  useEffect(() => {
    if (!autoStart || phrases.length === 0) return;

    let cancelled = false;

    const run = async () => {
      while (!cancelled) {
        await setText(phrases[index]);
        onPhraseComplete?.(index);
        if (!loop && index === phrases.length - 1) break;
        await wait(pauseMs);
        setIndex((i) => (i + 1) % phrases.length);
      }
    };

    run();

    return () => {
      cancelled = true;
      cancelAnimationFrameSafe(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, index, loop, pauseMs, phrases.join('|')]);

  return (
    <div className="container">
      <div
        ref={containerRef}
        className={textClass}
        // reserve some height to avoid layout shift between phrases of different lengths
        style={{ minHeight: '1em', lineHeight: 1.15, willChange: 'contents' }}
      />
    </div>
  );
}

/* helpers */
function randomChar(chars: string) {
  return chars[Math.floor(Math.random() * chars.length)];
}

function cancelAnimationFrameSafe(id: number | null) {
  if (id != null) cancelAnimationFrame(id);
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function escapeHtml(str: string) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export {TextScramble};
export default TextScramble;