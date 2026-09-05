import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GooeyNavItem {
  label: string;
  href: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  initialActiveIndex?: number;
}

export const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  initialActiveIndex = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (
    distance: number,
    pointIndex: number,
    totalPoints: number
  ): [number, number] => {
    const angle =
      ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (
    i: number,
    t: number,
    d: [number, number],
    r: number
  ) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (element: HTMLElement) => {
    const d: [number, number] = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);

    const existingParticles = element.querySelectorAll(".particle");
    existingParticles.forEach(p => p.remove());
    
    element.classList.remove("active");

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      
      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty("--rotate", `${p.rotate}deg`);
        point.classList.add("point");
        particle.appendChild(point);
        element.appendChild(particle);
        
        if (i === particleCount - 1) {
            requestAnimationFrame(() => {
                element.classList.add("active");
            });
        }

        setTimeout(() => {
          try {
            if (particle.parentElement === element) {
                 element.removeChild(particle);
            }
          } catch {}
        }, t);
      }, i * 10);
    }
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.left - containerRect.left}px`,
      top: `${pos.top - containerRect.top}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>, index: number) => {
    const liEl = e.currentTarget;
    if (activeIndex === index) return;
    
    setActiveIndex(index);
    updateEffectPosition(liEl);

    if (textRef.current) {
      textRef.current.classList.remove("active");
      void textRef.current.offsetWidth;
      textRef.current.classList.add("active");
    }
    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };

  const handleLinkKeyDown = (
    e: React.KeyboardEvent<HTMLAnchorElement>,
    index: number
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const liEl = e.currentTarget.parentElement as HTMLLIElement;
      if (liEl) {
        handleClick(
          { currentTarget: liEl } as unknown as React.KeyboardEvent<HTMLLIElement>,
          index
        );
      }
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current || !textRef.current || !filterRef.current) return;
    
    const listItems = navRef.current.querySelectorAll("li");
    if (listItems.length === 0) return;

    const activeLi = listItems[activeIndex] as HTMLElement;
    if (activeLi) {
      updateEffectPosition(activeLi);
      if(textRef.current && !textRef.current.classList.contains("active")){
          textRef.current.classList.add("active");
      }
      if (filterRef.current && filterRef.current.children.length === 0) {
        makeParticles(filterRef.current);
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      if (navRef.current) {
        const currentActiveLi = navRef.current.querySelectorAll("li")[
          activeIndex
        ] as HTMLElement;
        if (currentActiveLi) {
          updateEffectPosition(currentActiveLi);
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
        if (containerRef.current) {
            resizeObserver.unobserve(containerRef.current);
        }
    };
  }, [activeIndex, items]);

  return (
    <>
      <style>
        {`
          .gooey-nav-container {
            --nav-bg: black;
            --nav-border: #333;
            --nav-text: white;
            --nav-text-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.2);

            --bubble-bg: white;
            --active-text: black;
            --particle-color: white;

            --filter-backdrop-bg: black;
            --filter-blend-mode: lighten;

            --linear-ease: linear(0, 0.068, 0.19 2.7%, 0.804 8.1%, 1.037, 1.199 13.2%, 1.245, 1.27 15.8%, 1.274, 1.272 17.4%, 1.249 19.1%, 0.996 28%, 0.949, 0.928 33.3%, 0.926, 0.933 36.8%, 1.001 45.6%, 1.013, 1.019 50.8%, 1.018 54.4%, 1 63.1%, 0.995 68%, 1.001 85%, 1);
          }
          html.dark .gooey-nav-container {
            --nav-bg: white;
            --nav-border: #ccc;
            --nav-text: black;
            --nav-text-shadow: 0 1px 1px hsl(0deg 0% 100% / 0.2);

            --bubble-bg: black;
            --active-text: white;
            --particle-color: black;

            --filter-backdrop-bg: white;
            --filter-blend-mode: darken;
          }

          .gooey-nav-container ul {
            background: var(--nav-bg);
            border: 1px solid var(--nav-border);
            border-radius: 9999px;
          }
          .gooey-nav-container ul li {
            color: var(--nav-text);
            text-shadow: var(--nav-text-shadow);
            transition: color 0.3s ease, text-shadow 0.3s ease;
          }
          .gooey-nav-container ul li.active {
            color: var(--active-text);
            text-shadow: none;
          }
          .gooey-nav-container ul li::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background: var(--bubble-bg);
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.3s var(--linear-ease);
            z-index: -1;
          }
          .gooey-nav-container ul li.active::after {
            opacity: 1;
            transform: scale(1);
          }

          .gooey-nav-container .effect {
            position: absolute;
            opacity: 1;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1;
          }
          .gooey-nav-container .effect.text {
            color: var(--active-text);
            transition: color 0.3s ease;
          }
          .gooey-nav-container .effect.text.active {
            color: var(--active-text);
          }
          .gooey-nav-container .effect.filter {
            filter: blur(7px) contrast(100);
            mix-blend-mode: var(--filter-blend-mode);
          }
          .gooey-nav-container .effect.filter::before {
            content: "";
            position: absolute;
            inset: -75px;
            z-index: -2;
            background: var(--filter-backdrop-bg);
          }
          .gooey-nav-container .effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: var(--bubble-bg);
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
          }
          .gooey-nav-container .effect.active::after {
            animation: gooey-pill 0.3s var(--linear-ease) both;
          }
          @keyframes gooey-pill {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .gooey-nav-container .particle,
          .gooey-nav-container .point {
            display: block;
            opacity: 0;
            width: 20px;
            height: 20px;
            border-radius: 9999px;
            transform-origin: center;
          }
          .gooey-nav-container .particle {
            position: absolute;
            top: calc(50% - 10px);
            left: calc(50% - 10px);
            animation: gooey-particle calc(var(--time)) ease 1 -350ms;
          }
          .gooey-nav-container .point {
            background: var(--particle-color);
            opacity: 1;
            animation: gooey-point calc(var(--time)) ease 1 -350ms;
          }
          @keyframes gooey-particle { 0% { transform: rotate(0deg) translate(var(--start-x), var(--start-y)); opacity: 1; animation-timing-function: cubic-bezier(.55,0,1,.45); } 70% { transform: rotate(calc(var(--rotate)*.5)) translate(calc(var(--end-x)*1.2), calc(var(--end-y)*1.2)); opacity: 1; animation-timing-function: ease; } 85% { transform: rotate(calc(var(--rotate)*.66)) translate(var(--end-x), var(--end-y)); opacity: 1; } 100% { transform: rotate(calc(var(--rotate)*1.2)) translate(calc(var(--end-x)*.5), calc(var(--end-y)*.5)); opacity: 1; } }
          @keyframes gooey-point { 0% { transform: scale(0); opacity: 0; animation-timing-function: cubic-bezier(.55,0,1,.45); } 25% { transform: scale(calc(var(--scale)*.25)); } 38% { opacity: 1; } 65% { transform: scale(var(--scale)); opacity: 1; animation-timing-function: ease; } 85% { transform: scale(var(--scale)); opacity: 1; } 100% { transform: scale(0); opacity: 0; } }
        `}
      </style>
      <div className="gooey-nav-container relative" ref={containerRef}>
        <nav
          className="flex relative"
          style={{ transform: "translate3d(0,0,0.01px)" }}
        >
          <ul
            ref={navRef}
            className={cn("flex gap-x-2 sm:gap-x-4 list-none p-0 px-2 sm:px-4 m-0 relative z-[3]")}
            role="menubar"
            aria-label="Main navigation"
          >
            {items.map((item, index) => (
              <li
                key={index}
                className={cn(`py-2 px-3 sm:py-3 sm:px-5 rounded-full relative cursor-pointer`,
                           activeIndex === index ? "active" : "")}
                onClick={(e) => handleClick(e, index)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick(e, index);
                    }
                }}
                role="menuitem"
                aria-current={activeIndex === index ? "page" : undefined}
                tabIndex={0}
              >
                <a 
                  href={item.href}
                  onClick={(e) => e.preventDefault()}
                  onKeyDown={(e) => handleLinkKeyDown(e, index)}
                  className="outline-none no-underline"
                  style={{ color: "inherit" }}
                  tabIndex={-1}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="effect filter" ref={filterRef} />
        <span className="effect text" ref={textRef} />
      </div>
    </>
  );
};