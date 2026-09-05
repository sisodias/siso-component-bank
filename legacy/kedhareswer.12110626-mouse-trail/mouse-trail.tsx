'use client';

import React, { useEffect, useRef } from 'react';
import { ImageTrailController } from "../_utils/cn";

const flairImages = [
  "https://assets.codepen.io/16327/Revised+Flair.png",
  "https://assets.codepen.io/16327/Revised+Flair-1.png",
  "https://assets.codepen.io/16327/Revised+Flair-2.png",
  "https://assets.codepen.io/16327/Revised+Flair-3.png",
  "https://assets.codepen.io/16327/Revised+Flair-4.png",
  "https://assets.codepen.io/16327/Revised+Flair-5.png",
  "https://assets.codepen.io/16327/Revised+Flair-6.png",
  "https://assets.codepen.io/16327/Revised+Flair-7.png",
  "https://assets.codepen.io/16327/Revised+Flair-8.png",
  "https://assets.codepen.io/16327/Revised+Flair.png",
  "https://assets.codepen.io/16327/Revised+Flair-1.png",
  "https://assets.codepen.io/16327/Revised+Flair-2.png",
  "https://assets.codepen.io/16327/Revised+Flair-3.png",
  "https://assets.codepen.io/16327/Revised+Flair-4.png",
  "https://assets.codepen.io/16327/Revised+Flair-5.png",
  "https://assets.codepen.io/16327/Revised+Flair-6.png",
  "https://assets.codepen.io/16327/Revised+Flair-7.png",
  "https://assets.codepen.io/16327/Revised+Flair-8.png",
];

export function MouseTrailComponent() {
  const contentRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ImageTrailController | null>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const flairElements = Array.from(
      contentRef.current.querySelectorAll('.flair')
    ) as HTMLElement[];

    const controller = new ImageTrailController(flairElements, 100);
    controllerRef.current = controller;
    controller.init();

    const handleMouseMove = (e: MouseEvent) => {
      controller.setMousePos(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      controller.destroy();
    };
  }, []);

  return (
    <>
      <p>wiggle your mouse around.</p>
      <div className="content" ref={contentRef}>
        {flairImages.map((src, index) => (
          <img
            key={index}
            className="flair"
            src={src}
            alt=""
          />
        ))}
      </div>
    </>
  );
}
