"use client" 

import * as React from "react"
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

export const CommitsGrid = ({ text }: { text: string }) => {
  const cleanString = (str: string): string => {
    const upperStr = str.toUpperCase();

    const withoutAccents = upperStr
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const allowedChars = Object.keys(letterPatterns);
    return withoutAccents
      .split("")
      .filter((char) => allowedChars.includes(char))
      .join("");
  };

  const generateHighlightedCells = (text: string) => {
    const cleanedText = cleanString(text);

    const width = Math.max(cleanedText.length * 6, 6) + 1;

    let currentPosition = 1; // we start at 1 to leave space for the top border
    const highlightedCells: number[] = [];

    cleanedText
      .toUpperCase()
      .split("")
      .forEach((char) => {
        if (letterPatterns[char]) {
          const pattern = letterPatterns[char].map((pos) => {
            const row = Math.floor(pos / 50);
            const col = pos % 50;
            return (row + 1) * width + col + currentPosition;
          });
          highlightedCells.push(...pattern);
        }
        currentPosition += 6;
      });

    return {
      cells: highlightedCells,
      width,
      height: 9, // 7+2 for the top and bottom borders
    };
  };

  const {
    cells: highlightedCells,
    width: gridWidth,
    height: gridHeight,
  } = generateHighlightedCells(text);

  const getRandomColor = () => {
    const commitColors = [
      "#48d55d",
      "#016d32",
      "#0d4429"
    ];
    const randomIndex = Math.floor(Math.random() * commitColors.length);
    return commitColors[randomIndex];
  };

  const getRandomDelay = () => `${(Math.random() * 0.6).toFixed(1)}s`;
  const getRandomFlash = () => +(Math.random() < 0.3);

  return (
    <section
      className="w-full max-w-xl bg-card border grid p-1.5 sm:p-3 gap-0.5 sm:gap-1 rounded-[10px] sm:rounded-[15px]"
      style={{
        gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridHeight}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: gridWidth * gridHeight }).map((_, index) => {
        const isHighlighted = highlightedCells.includes(index);
        const shouldFlash = !isHighlighted && getRandomFlash();

        return (
          <div
            key={index}
            className={cn(
              `border h-full w-full aspect-square rounded-[4px] sm:rounded-[3px]`,
              isHighlighted ? "animate-highlight" : "",
              shouldFlash ? "animate-flash" : "",
              !isHighlighted && !shouldFlash ? "bg-card" : ""
            )}
            style={
              {
                animationDelay: getRandomDelay(),
                "--highlight": getRandomColor(),
              } as CSSProperties
            }
          />
        );
      })}
    </section>
  );
};

const letterPatterns: { [key: string]: number[] } = {
  A: [
    1, 2, 3, 50, 100, 150, 200, 250, 300, 54, 104, 154, 204, 254, 304, 151, 152,
    153,
  ],
  B: [
    0, 1, 2, 3, 4, 50, 100, 150, 151, 200, 250, 300, 301, 302, 303, 304, 54,
    104, 152, 153, 204, 254, 303,
  ],
  C: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304],
  D: [
    0, 1, 2, 3, 50, 100, 150, 200, 250, 300, 301, 302, 54, 104, 154, 204, 254,
    303,
  ],
  E: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304, 151, 152],
  F: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 151, 152, 153],
  G: [
    0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 153, 204, 154,
    304, 254,
  ],
  H: [
    0, 50, 100, 150, 200, 250, 300, 151, 152, 153, 4, 54, 104, 154, 204, 254,
    304,
  ],
  I: [0, 1, 2, 3, 4, 52, 102, 152, 202, 252, 300, 301, 302, 303, 304],
  J: [0, 1, 2, 3, 4, 52, 102, 152, 202, 250, 252, 302, 300, 301],
  K: [0, 4, 50, 100, 150, 200, 250, 300, 151, 152, 103, 54, 203, 254, 304],
  L: [0, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304],
  M: [
    0, 50, 100, 150, 200, 250, 300, 51, 102, 53, 4, 54, 104, 154, 204, 254, 304,
  ],
  N: [
    0, 50, 100, 150, 200, 250, 300, 51, 102, 153, 204, 4, 54, 104, 154, 204,
    254, 304,
  ],
  Ñ: [
    0, 50, 100, 150, 200, 250, 300, 51, 102, 153, 204, 4, 54, 104, 154, 204,
    254, 304,
  ],
  O: [1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 303, 54, 104, 154, 204, 254],
  P: [0, 50, 100, 150, 200, 250, 300, 1, 2, 3, 54, 104, 151, 152, 153],
  Q: [
    1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 54, 104, 154, 204, 202, 253, 304,
  ],
  R: [
    0, 50, 100, 150, 200, 250, 300, 1, 2, 3, 54, 104, 151, 152, 153, 204, 254,
    304,
  ],
  S: [1, 2, 3, 4, 50, 100, 151, 152, 153, 204, 254, 300, 301, 302, 303],
  T: [0, 1, 2, 3, 4, 52, 102, 152, 202, 252, 302],
  U: [0, 50, 100, 150, 200, 250, 301, 302, 303, 4, 54, 104, 154, 204, 254],
  V: [0, 50, 100, 150, 200, 251, 302, 4, 54, 104, 154, 204, 253],
  W: [
    0, 50, 100, 150, 200, 250, 301, 152, 202, 252, 4, 54, 104, 154, 204, 254,
    303,
  ],
  X: [0, 50, 203, 254, 304, 4, 54, 152, 101, 103, 201, 250, 300],
  Y: [0, 50, 101, 152, 202, 252, 302, 4, 54, 103],
  Z: [0, 1, 2, 3, 4, 54, 103, 152, 201, 250, 300, 301, 302, 303, 304],
  "0": [1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 303, 54, 104, 154, 204, 254],
  "1": [1, 52, 102, 152, 202, 252, 302, 0, 2, 300, 301, 302, 303, 304],
  "2": [0, 1, 2, 3, 54, 104, 152, 153, 201, 250, 300, 301, 302, 303, 304],
  "3": [0, 1, 2, 3, 54, 104, 152, 153, 204, 254, 300, 301, 302, 303],
  "4": [0, 50, 100, 150, 4, 54, 104, 151, 152, 153, 154, 204, 254, 304],
  "5": [0, 1, 2, 3, 4, 50, 100, 151, 152, 153, 204, 254, 300, 301, 302, 303],
  "6": [
    1, 2, 3, 50, 100, 150, 151, 152, 153, 200, 250, 301, 302, 204, 254, 303,
  ],
  "7": [0, 1, 2, 3, 4, 54, 103, 152, 201, 250, 300],
  "8": [
    1, 2, 3, 50, 100, 151, 152, 153, 200, 250, 301, 302, 303, 54, 104, 204, 254,
  ],
  "9": [1, 2, 3, 50, 100, 151, 152, 153, 154, 204, 254, 304, 54, 104],
  " ": [],
};
