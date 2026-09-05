import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
// import PropTypes from 'prop-types'; // Not used

const PROXIMITY_RADIUS = 200;
const GSAP_CDN_URL = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";

const defaultItemsArr = ['S', 'E', 'C', 'R', 'E', 'T'];

// Interface for props if using TypeScript (optional but good practice)
// interface SecretProps {
//   items?: string[];
//   className?: string;
// }

const Secret = ({
  items = defaultItemsArr,
  className = '', // className will now apply to the UL element
  // }: SecretProps) => { // Uncomment if using the SecretProps interface
}) => {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [gsapReady, setGsapReady] = useState(false);

  useEffect(() => {
    if (window.gsap) {
      setGsapReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = GSAP_CDN_URL;
    script.async = true;
    script.onload = () => {
      if (window.gsap) {
        setGsapReady(true);
      } else {
        console.error("GSAP failed to load from CDN.");
      }
    };
    script.onerror = () => {
      console.error("Error loading GSAP from CDN.");
    };
    document.head.appendChild(script);

    return () => {
      // Minimal cleanup for script tag if component unmounts fast
    };
  }, []);

  // Global style injection for body::before has been removed.
  // Add it to your parent page component if needed.
  // useLayoutEffect(() => { /* ... */ }, []);

  useEffect(() => {
    if (!gsapReady || !window.gsap) {
      return;
    }

    const { gsap } = window;
    const { mapRange, clamp } = gsap.utils;

    const containerElement = containerRef.current;
    const revealableElements = itemRefs.current.filter(Boolean);

    if (!containerElement || revealableElements.length !== items.length || items.length === 0) {
      itemRefs.current.forEach(el => {
        if (el) gsap.set(el, { '--active': 0 });
      });
      return;
    }

    const DISTANCE_MAPPER = mapRange(250, 50, 0, 90);

    const updateItemsVisibility = (event) => {
      const { clientX: x, clientY: y } = event;

      if (!containerElement) return;

      const containerBounds = containerElement.getBoundingClientRect();
      const containerCenterX = containerBounds.x + containerBounds.width * 0.5;
      const containerCenterY = containerBounds.y + containerBounds.height * 0.5;
      const distToContainerCenter = Math.hypot(x - containerCenterX, y - containerCenterY);

      if (distToContainerCenter > Math.max(containerBounds.width, containerBounds.height) * 0.5 + PROXIMITY_RADIUS) {
        // Optionally tween items back to 0 if mouse is far
        // revealableElements.forEach((itemEl) => {
        //   if (itemEl) gsap.to(itemEl, { '--active': 0, duration: 0.3, ease: 'power1.out' });
        // });
        return;
      }

      revealableElements.forEach((itemEl) => {
        if (!itemEl) return;
        const itemBounds = itemEl.getBoundingClientRect();
        const itemCenterX = itemBounds.x + itemBounds.width * 0.5;
        const itemCenterY = itemBounds.y + itemBounds.height * 0.5;
        const distToItem = Math.hypot(x - itemCenterX, y - itemCenterY);
        
        const activeAngleDeg = clamp(0, 90, DISTANCE_MAPPER(distToItem));
        const activeAngleRad = activeAngleDeg * (Math.PI / 180);
        const activeValue = Math.sin(activeAngleRad);

        gsap.to(itemEl, {
          '--active': activeValue.toFixed(4),
          duration: 0.1,
          ease: 'power1.out'
        });
      });
    };

    revealableElements.forEach((itemEl) => {
      if (itemEl) {
        gsap.set(itemEl, { '--active': 0 });
      }
    });
    
    document.body.addEventListener('pointermove', updateItemsVisibility);

    return () => {
      document.body.removeEventListener('pointermove', updateItemsVisibility);
      // itemRefs.current.forEach(el => {
      //   if (el && gsapReady && window.gsap) window.gsap.set(el, { '--active': 0 });
      // });
    };
  }, [items, gsapReady]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items.length]);

  const assignRef = (el, index) => {
    itemRefs.current[index] = el;
  };

  if (items.length === 0) {
    return <p className="text-neutral-500 text-center">No items to display.</p>; // Or null, or some other placeholder
  }

  return (
    <ul
      ref={containerRef}
      className={`p-0 m-0 flex flex-nowrap 
                 rounded-xl sm:rounded-2xl bg-neutral-900/[0.95] justify-center 
                 shadow-[inset_0_1px_1px_hsl(0_0%_100%_/_0.15),0_5px_15px_rgba(0,0,0,0.3)]
                 py-12 sm:py-[4.5rem] px-2 sm:px-4 select-none list-none w-full overflow-x-auto
                 ${className}`}
    >
      {items.map((item, index) => (
        <li
          key={index}
          ref={(el) => assignRef(el, index)}
          tabIndex="0"
          className="flex items-center justify-center h-full p-1 sm:p-2 md:p-3 lg:p-4 outline-none
                     focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-4 focus-visible:rounded-md
                     flex-shrink-0"
          style={{ '--active': 0 }}
        >
          <span
            className="text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text
                       transform-gpu 
                       focus:outline-none
                       scale-[calc(var(--active,0)*0.5+0.5)] 
                       blur-[calc((1-var(--active,0))*1rem)]
                       text-lg sm:text-xl md:text-2xl lg:text-3xl 
                       whitespace-nowrap px-1"
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
};


export { Secret };