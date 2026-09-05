"use client" 
import * as React from "react"
import { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';

const IntIcon = ({
  animationData,
  autoplay = false,
  loop = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  playOnClick = false,
  toggleDirectionOnClick = false,
  playDirectionOnEnter = null,
  playDirectionOnLeave = null,
  color = null, // 'black' or 'white' or null for original colors
  size = 100    // Default size of 100px, can be overridden
}) => {
  const containerRef = useRef(null);
  const animationInstance = useRef(null);
  const [directionForward, setDirectionForward] = useState(true);
  const [resolvedAnimationData, setResolvedAnimationData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Convert size to appropriate CSS value
  const sizeStyle = React.useMemo(() => {
    // If size is a number, treat it as pixels
    if (typeof size === 'number') {
      return `${size}px`;
    }
    // If size is already a string (e.g., '5rem', '50%'), use it directly
    return size;
  }, [size]);

  useEffect(() => {
    if (!animationData) return;

    if (typeof animationData === 'string') {
      // It's a URL
      fetch(animationData)
        .then((res) => res.json())
        .then((data) => setResolvedAnimationData(data))
        .catch((err) => {
          console.error('Failed to load Lottie JSON from URL:', err);
        });
    } else {
      // It's already a JSON object
      setResolvedAnimationData(animationData);
    }
  }, [animationData]);

  useEffect(() => {
    if (!containerRef.current || !resolvedAnimationData) return;

    animationInstance.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop,
      autoplay,
      animationData: resolvedAnimationData
    });

    // Apply color if specified
    if (color && ['black', 'white'].includes(color)) {
      animationInstance.current.addEventListener('DOMLoaded', () => {
        applyColor(color);
      });
    }

    // Add complete event listener to track when animation finishes
    animationInstance.current.addEventListener('complete', () => {
      setIsPlaying(false);
    });

    return () => {
      if (animationInstance.current) {
        animationInstance.current.removeEventListener('complete');
        animationInstance.current.destroy();
      }
    };
  }, [resolvedAnimationData, autoplay, loop, color]);

  // Function to apply color uniformly to all elements
  const applyColor = (color) => {
    if (!animationInstance.current) return;
    
    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;
    
    const colorValue = color === 'black' ? '#000000' : '#FFFFFF';
    
    // Target all SVG elements that can be colored
    const elements = svgElement.querySelectorAll('path, circle, rect, ellipse, polygon, line, polyline');
    elements.forEach(el => {
      // Override fill if it exists
      if (el.getAttribute('fill') && el.getAttribute('fill') !== 'none') {
        el.style.fill = colorValue;
      }
      
      // Override stroke if it exists
      if (el.getAttribute('stroke') && el.getAttribute('stroke') !== 'none') {
        el.style.stroke = colorValue;
      }
    });
  };

  const handleClick = (e) => {
    if (!animationInstance.current) return;
    const anim = animationInstance.current;

    if (toggleDirectionOnClick) {
      anim.setDirection(directionForward ? 1 : -1);
      anim.play();
      setDirectionForward(!directionForward);
      setIsPlaying(true);
    } else if (playOnClick) {
      // Reset animation to start position if it's not playing
      if (!isPlaying) {
        // For non-looping animations, we need to reset
        if (!loop) {
          anim.goToAndStop(0, true);
        }
        anim.setDirection(1);
        anim.play();
        setIsPlaying(true);
      }
    }

    if (onClick) onClick(e);
  };

  const handleMouseEnter = (e) => {
    if (animationInstance.current && playDirectionOnEnter !== null) {
      animationInstance.current.setDirection(playDirectionOnEnter);
      animationInstance.current.play();
      setIsPlaying(true);
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    if (animationInstance.current && playDirectionOnLeave !== null) {
      animationInstance.current.setDirection(playDirectionOnLeave);
      animationInstance.current.play();
      setIsPlaying(true);
    }
    if (onMouseLeave) onMouseLeave(e);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        cursor: 'pointer', 
        display: 'inline-block', 
        width: sizeStyle, 
        height: sizeStyle 
      }}
    >
      {!resolvedAnimationData && <span style={{ color: 'gray' }}>Loading animation...</span>}
    </div>
  );
};

export {IntIcon}