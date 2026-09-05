import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg")}>
      <h1 className="text-2xl font-bold mb-2">Component Example</h1>
      <h2 className="text-xl font-semibold">{count}</h2>
      <div className="flex gap-2">
        <button onClick={() => setCount((prev) => prev - 1)}>-</button>
        <button onClick={() => setCount((prev) => prev + 1)}>+</button>
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';

// Reusable BentoItem component with 3D tilt and spotlight effects
const BentoItem = ({ className, children }) => {
    const itemRef = useRef(null);

    useEffect(() => {
        const item = itemRef.current;
        if (!item) return;

        const handleMouseMove = (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const width = rect.width;
            const height = rect.height;

            // Spotlight effect
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);

            // 3D Tilt effect
            const rotateX = (y - height / 2) / 20; // Adjust divisor for sensitivity
            const rotateY = -(x - width / 2) / 20;
            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        };

        const handleMouseLeave = () => {
            item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        };

        item.addEventListener('mousemove', handleMouseMove);
        item.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            item.removeEventListener('mousemove', handleMouseMove);
            item.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div ref={itemRef} className={`bento-item ${className}`}>
            {children}
        </div>
    );
};

export default BentoItem;
