'use client';

import { useEffect, useRef } from 'react';
import { animate, svg, utils } from 'animejs';

interface ShadowProps {
  className?: string;
}

export function Shadow({ className }: ShadowProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const path1Ref = useRef<SVGPolygonElement>(null);
  const path2Ref = useRef<SVGPolygonElement>(null);

  useEffect(() => {
    if (!svgRef.current || !path1Ref.current || !path2Ref.current) return;

    const $path1 = path1Ref.current;
    const $path2 = path2Ref.current;

    function animateRandomPoints() {
      // Update the points attribute on #path-2
      const newPoints = generatePoints();
      $path2.setAttribute('points', newPoints);
      
      // Morph the points of #path-1 into #path-2
      animate($path1, {
        points: svg.morphTo($path2),
        ease: 'inOutCirc',
        duration: 500,
        onComplete: animateRandomPoints,
      });
    }

    // Start the animation
    animateRandomPoints();

    // Cleanup function
    return () => {
      // Stop any ongoing animations
      if (svgRef.current) {
        animate.remove(svgRef.current);
      }
    };
  }, []);

  // A function to generate random points on #path-2 on each iteration
  function generatePoints(): string {
    const total = utils.random(4, 64);
    const r1 = utils.random(4, 56);
    const r2 = 56;
    const isOdd = (n: number): boolean => n % 2 === 1;
    let points = '';
    
    for (let i = 0, l = isOdd(total) ? total + 1 : total; i < l; i++) {
      const r = isOdd(i) ? r1 : r2;
      const a = (2 * Math.PI * i) / l - Math.PI / 2;
      const x = 152 + utils.round(r * Math.cos(a), 0);
      const y = 56 + utils.round(r * Math.sin(a), 0);
      points += `${x},${y} `;
    }
    return points;
  }

  return (
    <svg ref={svgRef} viewBox="0 0 304 112" className={className}>
      <g
        strokeWidth="2"
        stroke="currentColor"
        strokeLinejoin="round"
        fill="none"
        fillRule="evenodd"
      >
        <polygon
          ref={path1Ref}
          id="path-1"
          points="152,4 170,38 204,56 170,74 152,108 134,74 100,56 134,38"
        />
        <polygon
          ref={path2Ref}
          style={{ opacity: 0 }}
          id="path-2"
          points="152,4 170,38 204,56 170,74 152,108 134,74 100,56 134,38"
        />
      </g>
    </svg>
  );
}
