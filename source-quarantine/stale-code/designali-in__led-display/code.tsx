"use client";

import { useState, useEffect } from "react";

interface LEDDisplayProps {
  text?: string;
  speed?: number;
  dotColor?: string; 
  dotSize?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  showBorder?: boolean;
  borderColor?: string;
  fade?: boolean;
}

export const LEDDisplay = ({
  text = "Hello World",
  speed = 150,
  dotColor = "#0000ff", 
  dotSize = 10,
  direction = "left",
  pauseOnHover = false,
  showBorder = false,
  borderColor = "#0000ff",
  fade = false,
}: LEDDisplayProps) => {
  const [scroll, setScroll] = useState<boolean[][]>([]);
  const [pos, setPos] = useState(0);
  const [paused, setPaused] = useState(false);

  // --- FONT MAP (Uppercase + symbols)
  const char: Record<string, string> = {
    A: "....###..." + "...##.##.." + "..##...##." + ".##.....##" + ".#########" + ".##.....##" + ".##.....##",
    B: ".########." + ".##.....##" + ".##.....##" + ".########." + ".##.....##" + ".##.....##" + ".########.",
    C: "..######.." + ".##....##." + ".##......." + ".##......." + ".##......." + ".##....##." + "..######..",
    D: ".########." + ".##.....##" + ".##.....##" + ".##.....##" + ".##.....##" + ".##.....##" + ".########.",
    E: ".########" + ".##......" + ".##......" + ".######.." + ".##......" + ".##......" + ".########",
    F: ".########" + ".##......" + ".##......" + ".######.." + ".##......" + ".##......" + ".##......",
    G: "..######.." + ".##....##." + ".##......." + ".##...####" + ".##....##." + ".##....##." + "..######..",
    H: ".##.....##" + ".##.....##" + ".##.....##" + ".#########" + ".##.....##" + ".##.....##" + ".##.....##",
    I: ".####" + "..##." + "..##." + "..##." + "..##." + "..##." + ".####",
    J: ".......##" + ".......##" + ".......##" + ".......##" + ".##....##" + ".##....##" + "..######.",
    K: ".##....##" + ".##...##." + ".##..##.." + ".#####..." + ".##..##.." + ".##...##." + ".##....##",
    L: ".##......" + ".##......" + ".##......" + ".##......" + ".##......" + ".##......" + ".########",
    M: ".##.....##" + ".###...###" + ".####.####" + ".##.###.##" + ".##.....##" + ".##.....##" + ".##.....##",
    N: ".##....##" + ".###...##" + ".####..##" + ".##.##.##" + ".##..####" + ".##...###" + ".##....##",
    O: "..#######." + ".##.....##" + ".##.....##" + ".##.....##" + ".##.....##" + ".##.....##" + "..#######.",
    P: ".########." + ".##.....##" + ".##.....##" + ".########." + ".##......." + ".##......." + ".##.......",
    Q: "..#######." + ".##.....##" + ".##.....##" + ".##.....##" + ".##..##.##" + ".##....##." + "..#####.##",
    R: ".########." + ".##.....##" + ".##.....##" + ".########." + ".##...##.." + ".##....##." + ".##.....##",
    S: "..######." + ".##....##" + ".##......" + "..######." + ".......##" + ".##....##" + "..######.",
    T: ".########" + "....##..." + "....##..." + "....##..." + "....##..." + "....##..." + "....##...",
    U: ".##.....##" + ".##.....##" + ".##.....##" + ".##.....##" + ".##.....##" + ".##.....##" + "..#######.",
    V: ".##.....##" + ".##.....##" + ".##.....##" + ".##.....##" + "..##...##." + "...##.##.." + "....###...",
    W: ".##......##" + ".##..##..##" + ".##..##..##" + ".##..##..##" + ".##..##..##" + ".##..##..##" + "..###..###.",
    X: ".##.....##" + "..##...##." + "...##.##.." + "....###..." + "...##.##.." + "..##...##." + ".##.....##",
    Y: ".##....##" + "..##..##." + "...####.." + "....##..." + "....##..." + "....##..." + "....##...",
    Z: ".########" + "......##." + ".....##.." + "....##..." + "...##...." + "..##....." + ".########",
    "!": ".####" + ".####" + ".####" + "..##." + "....." + ".####" + ".####",
  };

  const cw: Record<string, number> = {
    A: 10, B: 10, C: 9, D: 10, E: 9, F: 9, G: 10, H: 10, I: 5, J: 9, K: 9, L: 9, M: 10, N: 9, O: 10, P: 10,
    Q: 10, R: 10, S: 9, T: 9, U: 10, V: 10, W: 11, X: 10, Y: 9, Z: 9, "!": 5,
  };

  // --- lowercase mapping to uppercase
  const normalizeChar = (c: string) => {
    if (/[a-z]/.test(c)) return c.toUpperCase();
    return c;
  };

  // --- Build scrolling matrix
  useEffect(() => {
    const txt = text;
    const spc = 5;
    const newScroll: boolean[][] = Array(7)
      .fill(null)
      .map(() => Array(30).fill(false));

    for (let i = 0; i < txt.length; i++) {
      let t = normalizeChar(txt.charAt(i));
      if (t === " ") {
        for (let v = 0; v < spc; v++) for (let j = 0; j < 7; j++) newScroll[j].push(false);
        continue;
      }
      const w = cw[t] || 9;
      const charData = char[t] || "";
      for (let j = 0; j < 7; j++) {
        for (let v = 0; v < w; v++) {
          const isOn = charData.charAt(j * w + v) === "#";
          newScroll[j].push(isOn);
        }
      }
      for (let j = 0; j < 7; j++) newScroll[j].push(false);
    }

    setScroll(newScroll);
    setPos(0);
  }, [text]);

  // --- Animate
  useEffect(() => {
    if (scroll.length === 0 || paused) return;
    const interval = setInterval(() => {
      setPos((prev) => {
        const l = scroll[0]?.length || 1;
        return direction === "left"
          ? (prev + 1) % l
          : (prev - 1 + l) % l;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [scroll, speed, direction, paused]);

  if (scroll.length === 0) return null;
  const l = scroll[0].length;
  const visibleWidth = 40;

  return (
    <div
      className="flex flex-col items-center justify-center p-2"
      style={{ 
        border: showBorder ? `2px solid ${borderColor}` : "none",
      }}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      {scroll.map((row, y) => (
        <div key={y} className="flex gap-[1px]">
          {Array(visibleWidth)
            .fill(null)
            .map((_, x) => {
              const index =
                direction === "left"
                  ? (pos + x) % l
                  : (pos - x + l) % l;
              const isActive = row[index];
              return (
                <div
                  key={x}
                  style={{
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                    backgroundColor: isActive ? dotColor : "transparent",
                    border: `1px solid ${dotColor}30`,
                    borderRadius: "2px",
                    opacity:
                      fade && (x < 3 || x > visibleWidth - 4)
                        ? 0.4
                        : 1,
                    transition: "background-color 0.1s ease",
                  }}
                />
              );
            })}
        </div>
      ))}
    </div>
  );
};
