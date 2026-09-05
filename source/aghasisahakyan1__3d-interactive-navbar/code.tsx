"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MeshReflectorMaterial, RoundedBox, Html } from "@react-three/drei"
import { Group, Mesh, Vector3, Color } from "three"
import * as THREE from 'three';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

interface Card3DProps {
  children?: ReactNode
  className?: string
  maxRotation?: number
  scale?: number
  position?: [number, number, number]
  color?: string
  opacity?: number
  reflective?: boolean
  title?: string
  content?: ReactNode
  rotationSmoothness?: number
  hoverScale?: number
  hoverLift?: number
  hoverColor?: string
  hoverLightIntensity?: number
  dynamicLight?: boolean
}

// (Keep CardContent, Scene, Card3D components as they are - they are not modified)
const CardContent = ({
  content,
  cardRotation,
  mousePosition,
  viewport,
}: {
  title?: string
  content?: ReactNode
  cardRotation?: THREE.Euler
  mousePosition?: THREE.Vector2
  viewport?: { width: number, height: number }
}) => {
  const contentRef = useRef<THREE.Group>(null);
  const parallaxAmount = 0.1;

  useFrame(() => {
    if (contentRef.current && cardRotation && mousePosition && viewport) {
      const parallaxX = -cardRotation.y * parallaxAmount * 10;
      const parallaxY = cardRotation.x * parallaxAmount * 10;

      contentRef.current.position.x = parallaxX;
      contentRef.current.position.y = parallaxY;
    }
  });

  return (
    <group ref={contentRef} position={[0, 0, 0.7]}>
       <Html transform pointerEvents="none">
         <div style={{
         }}>
            {content}
         </div>
       </Html>
    </group>
  );
}

const Scene = ({
  children,
  maxRotation = 0.05,
  scale = 1.2,
  position = [0, 0, 0],
  color = "#111",
  opacity = 0.9,
  reflective = true,
  title,
  content,
  rotationSmoothness = 0.1,
  hoverScale = 1.03,
  hoverLift = 0.3,
  hoverColor = "#333",
  hoverLightIntensity = 5,
  dynamicLight = true,
}: Omit<Card3DProps, "className">) => {
  const group = useRef<Group>(null);
  const cardMesh = useRef<Mesh>(null);
  const dynamicLightRef = useRef<THREE.PointLight>(null);

  const [hover, setHover] = useState(false);
  const { mouse, viewport, gl } = useThree();

  const targetRotation = useRef(new Vector3(0, 0, 0));
  const targetScale = useRef(scale);
  const targetZ = useRef(position[2]);
  const targetColor = useRef(new Color(color));
  const baseColor = useRef(new Color(color));
  const hoverColorTarget = useRef(new Color(hoverColor));

  useEffect(() => {
      baseColor.current.set(color);
      hoverColorTarget.current.set(hoverColor);
      targetScale.current = scale;
      targetZ.current = position[2];
      targetColor.current.set(color);
  }, [scale, position, color, hoverColor]);


  useEffect(() => {
    if (hover) {
      targetScale.current = scale * hoverScale;
      targetZ.current = position[2] + hoverLift;
      targetColor.current.set(hoverColor);
    } else {
      targetScale.current = scale;
      targetZ.current = position[2];
      targetColor.current.set(color);
    }
  }, [hover, scale, position, hoverScale, hoverLift, color, hoverColor]);


  useFrame(() => {
    if (!group.current || !cardMesh.current) return;

    const rotationTargetX = mouse.y * -maxRotation;
    const rotationTargetY = mouse.x * maxRotation;

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      hover ? rotationTargetX : 0,
      rotationSmoothness
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      hover ? rotationTargetY : 0,
      rotationSmoothness
    );

    group.current.scale.x = group.current.scale.y = group.current.scale.z = THREE.MathUtils.lerp(
      group.current.scale.x,
      targetScale.current,
      rotationSmoothness
    );

    group.current.position.z = THREE.MathUtils.lerp(
      group.current.position.z,
      targetZ.current,
      rotationSmoothness
    );

    if (cardMesh.current.material) {
      const material = cardMesh.current.material as THREE.Material & { color?: THREE.Color };
      if (material.color) {
        material.color.lerp(targetColor.current, rotationSmoothness * 0.5);
      }
    }

    if (dynamicLightRef.current && dynamicLight) {
        const lightOffset = new THREE.Vector3(
          group.current.rotation.y * 5,
          -group.current.rotation.x * 5 + 3,
          2
        );

        lightOffset.applyEuler(group.current.rotation);

        dynamicLightRef.current.position.copy(lightOffset);

        dynamicLightRef.current.intensity = THREE.MathUtils.lerp(
            dynamicLightRef.current.intensity,
            hover ? hoverLightIntensity : 0,
            rotationSmoothness
        );
    }

  });


  return (
    <group
      ref={group}
      scale={5}
      position={position}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <RoundedBox ref={cardMesh} args={[12, 8.4, 0.4]} radius={0.4} smoothness={10} castShadow receiveShadow>
        {reflective ? (
          <MeshReflectorMaterial
            color={color}
            roughness={0.2}
            metalness={0.8}
            opacity={opacity}
            transparent={opacity < 1}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.7}
            opacity={opacity}
            transparent={opacity < 1}
          />
        )}
      </RoundedBox>

      <CardContent
        title={title}
        content={content}
        cardRotation={group.current ? group.current.rotation : undefined}
        mousePosition={mouse}
        viewport={viewport}
      />

      {dynamicLight && (
         <pointLight
           ref={dynamicLightRef}
           position={[0, 0, 0]}
           intensity={0}
           distance={15}
           decay={2}
           color="#ffffff"
           castShadow
           visible={false}
         />
      )}


      <group position={[0, 0, 0.16]}>
        {children}
      </group>
    </group>
  );
}


const Card3D = ({
  children,
  className,
  maxRotation,
  scale = 0.8,
  position,
  color = "#111",
  opacity = 0.9,
  reflective = true,
  title,
  content,
  rotationSmoothness,
  hoverScale,
  hoverLift,
  hoverColor,
  hoverLightIntensity,
  dynamicLight,
}: Card3DProps) => {
  return (
    <div className={cn("h-[300px] w-[400px] relative", className)}>
       <style jsx>{`
        .relative {
          --card-base-scale: ${scale};
          --card-width: ${10 * scale} units; /* Note: 'units' is not a valid CSS unit. Fix if needed. */
          --card-height: ${7 * scale} units; /* Note: 'units' is not a valid CSS unit. Fix if needed. */
        }
      `}</style>
      <Canvas
         shadows
         dpr={[1, 2]}
         camera={{ position: [0, 0, 23], fov:20 }}
         flat
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 25]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
         <directionalLight
          position={[-5, -10, -10]}
          intensity={0.3}
         />

        <directionalLight
          position={[0, -10, 5]}
          color="blue"
        />
        <directionalLight
          position={[10, 0, 5]}
          intensity={0.4}
          color="blue"
        />

        <Scene
          maxRotation={maxRotation}
          scale={scale}
          position={position}
          color={color}
          opacity={opacity}
          reflective={reflective}
          title={title}
          content={content}
          rotationSmoothness={rotationSmoothness}
          hoverScale={hoverScale}
          hoverLift={hoverLift}
          hoverColor={hoverColor}
          hoverLightIntensity={hoverLightIntensity}
          dynamicLight={dynamicLight}
        >
          {children}
        </Scene>
      </Canvas>
    </div>
  )
}


type NavItem = {
  title: string;
  href: string;
};

const navItems: NavItem[] = [
  {
    title: "HOME",
    href: "/",
  },
  {
    title: "DOCS",
    href: "/docs",
  },
  {
    title: "EXAMPLES",
    href: "/examples",
  },
  {
    title: "TEMPLATES",
    href: "/templates",
  },
  {
    title: "BLOG",
    href: "/blog",
  },
  {
    title: "GITHUB",
    href: "/github",
  },
];

const componentItems = [
  { id: "UI_001", title: "Sign In Flow", previewImage: "https://cdn.21st.dev/nubmaster4568/sign-in-flow-1/default/preview.1747131539764.png", url: "https://21st.dev/nubmaster4568/sign-in-flow-1/default" },
  { id: "UI_002", title: "Animated Search Bar", previewImage: "https://cdn.21st.dev/nubmaster4568/animated-search-bar/default/preview.1747126579206.png", url: "https://21st.dev/nubmaster4568/animated-search-bar/default" },
  { id: "UI_003", title: "Interactive 3D Robot", previewImage: "https://cdn.21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/interactive-3d-robot/default/preview.1746896202959.png", url: "https://21st.dev/nubmaster4568/interactive-3d-robot/default" },
  { id: "UI_004", title: "Hero Section - Nexus", previewImage: "https://cdn.21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/hero-section-nexus/default/preview.1746816017274.png", url: "https://21st.dev/nubmaster4568/hero-section-nexus/default" },
  { id: "UI_005", title: "Mini Navbar", previewImage: "https://cdn.21st.dev/nubmaster4568/mini-navbar/default/preview.png?v=1", url: "https://21st.dev/nubmaster4568/mini-navbar/default" },
  { id: "UI_006", title: "Hero Section", previewImage: "https://cdn.21st.dev/nubmaster4568/hero-section/default/preview.png?v=1", url: "https://21st.dev/nubmaster4568/hero-section/default" },
  { id: "UI_007", title: "Navbar with Animated Mega Dropdown", previewImage: "https://cdn.21st.dev/nubmaster4568/navbar-with-animated-mega-dropdown/default/preview.png?v=1", url: "https://21st.dev/nubmaster4568/navbar-with-animated-mega-dropdown/default" },
  { id: "UI_008", title: "Multimodal AI Chat Input", previewImage: "https://cdn.21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/multimodal-ai-chat-input/default/preview.1746633059633.png", url: "https://21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/multimodal-ai-chat-input/default" },
  { id: "UI_009", title: "Galaxy Interactive Hero Section", previewImage: "https://cdn.21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/galaxy-interactive-hero-section/default/preview.1746632771616.png", url: "https://21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/galaxy-interactive-hero-section/default" },
  { id: "UI_010", title: "3D Hero Section Boxes", previewImage: "https://cdn.21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/3d-hero-section-boxes/default/preview.1746632692728.png", url: "https://21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/3d-hero-section-boxes/default" },
  { id: "UI_011", title: "Section With Mockup", previewImage: "https://cdn.21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/section-with-mockup/default/preview.1746632628368.png", url: "https://21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/section-with-mockup/default" },
  { id: "UI_012", title: "Hover Peek Link", previewImage: "https://cdn.21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/link-preview/hover-peek-demo-page/preview.png?v=1", url: "https://21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/link-preview/hover-peek-demo-page" },
  { id: "UI_013", title: "Draw With Cursor", previewImage: "https://cdn.21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/draw-with-cursor/draw/preview.png?v=1", url: "https://21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/draw-with-cursor/draw" },
  { id: "UI_014", title: "Sticky Section Tabs", previewImage: "https://cdn.21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/sticky-section-tabs/default/preview.1746444616173.png", url: "https://21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/sticky-section-tabs/default" },
];

function NavbarItem({ item }: { item: NavItem }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={item.href}
      className="relative py-2 text-xs font-medium tracking-wider text-white/70 transition-colors hover:text-white/100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="inline-block relative" style={{ width: `${item.title.length}ch` }}>
        {isHovered ? (
          <DecryptEffect text={item.title} />
        ) : (
          <span className="font-medium">{item.title}</span>
        )}
      </span>
    </Link>
  );
}

function MenuIcon({ isOpen = false, isWhite = true }: { isOpen?: boolean, isWhite?: boolean }) {
  if (isOpen) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1H17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M1 6H17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M1 11H17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ComponentLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="16" height="16" rx="2" stroke="white" strokeWidth="2"/>
      <path d="M13 16L15 18L19 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}


// --- MODIFIED ComponentsLink Component ---
function ComponentsLink({ onDropdownChange }: { onDropdownChange?: (isOpen: boolean) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const megaDropdownRef = useRef<{ startClosingAnimation: () => void } | null>(null);
  const text = "COMPONENTS";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (megaDropdownRef.current) {
          megaDropdownRef.current.startClosingAnimation();
        } else {
          setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (onDropdownChange) {
      onDropdownChange(isDropdownOpen);
    }
  }, [isDropdownOpen, onDropdownChange]);

  // Determine if the dotted grid background should be active
  const showDottedGrid = isHovered && !isDropdownOpen;

  return (
    <div
      className={`relative h-full z-50 border-neutral-800`}
      ref={dropdownRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
       <style jsx>{`
        .components-button {
          position: relative; /* Needed for pseudo-element positioning */
          overflow: hidden; /* Hides the grid pseudo-element outside the button boundaries */
          /* Existing styles */
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 2.5rem; /* px-10 */
          padding-right: 2.5rem; /* px-10 */
          min-width: 180px;
          max-width: 180px;
          /* Add transition for text color */
          transition: color 0.3s ease;
        }

        .components-button::before {
          content: '';
          position: absolute;
          inset: 0; /* Cover the entire button */
          background-image: radial-gradient(circle, #444 1px, transparent 1px); /* Tiny grey dots */
          background-size: 8px 8px; /* Spacing of the dots */
          opacity: 0; /* Initially hidden */
          transition: opacity 0.4s ease-in-out; /* Fade animation */
          z-index: 0; /* Ensure it's behind the text and white overlay */
          pointer-events: none; /* Allow clicks to pass through */
        }

        /* State when the dotted grid should be visible */
        .components-button.dotted-grid-active::before {
          opacity: 1;
        }

        /* Content wrapper to ensure text is above pseudo-element */
        .components-button-content {
           position: relative;
           z-index: 2; /* Ensure content is above pseudo-element (z-index 0) and white overlay (z-index 1) */
           width: 100%;
           display: flex;
           align-items: center;
           justify-content: center;
        }
        
        /* Text color change based on dropdown state */
        .components-button-content span {
             color: white; /* Default color */
             transition: color 0.3s ease;
        }

        .components-button.dropdown-open .components-button-content span {
             color: black; /* Color when dropdown is open */
        }

      `}</style>
      <motion.button
        className={`components-button ${showDottedGrid ? 'dotted-grid-active' : ''} ${isDropdownOpen ? 'dropdown-open' : ''}`}
        onClick={() => {
          if (isDropdownOpen && megaDropdownRef.current) {
            megaDropdownRef.current.startClosingAnimation();
          } else {
            setIsDropdownOpen(true);
          }
        }}
        // Keep style prop for explicit Framer Motion animations if any apply to the button directly
        // style={{ ... }} // No direct style needed for this effect
      >
        {isDropdownOpen && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ zIndex: 1 }} // Ensure white background is between grid (0) and content (2)
          />
        )}

        <div className="components-button-content"> {/* Use the content wrapper class */}
          <div className="text-xs font-medium tracking-wider"> {/* Text styles handled by CSS now */}
            {showDottedGrid ? ( // Use showDottedGrid state for decrypt effect
              <StableDecryptEffect text={text} />
            ) : (
              <span>{text}</span>
            )}
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="fixed top-20 left-0 w-full bg-black border-b border-neutral-800 z-50 overflow-hidden" // z-index 50 is fine for the dropdown container
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "calc(100vh - 5rem)", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              opacity: { duration: 0.5 }
            }}
          >
            <MegaDropdown
              ref={megaDropdownRef}
              onClose={() => setIsDropdownOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// --- END MODIFIED ComponentsLink Component ---


// (Keep MegaDropdown, DecryptEffect, StableDecryptEffect, Navbar components as they are)
const MegaDropdown = React.forwardRef<{ startClosingAnimation: () => void }, { onClose: () => void }>(
  ({ onClose }, ref) => {
    const [visibleRows, setVisibleRows] = useState<number>(0);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [lockedItem, setLockedItem] = useState<string | null>(null);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    const preloadImage = (src: string) => {
      if (loadedImages.has(src)) return;

      const img = new globalThis.Image();
      img.src = src;
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(src));
      };
    };

    useEffect(() => {
      if (hoveredItem) {
        const item = componentItems.find(item => item.id === hoveredItem);
        if (item) {
          preloadImage(item.previewImage);
        }
      }
    }, [hoveredItem]);

    useEffect(() => {
      const imagesToPreload = componentItems.slice(0, 4);
      imagesToPreload.forEach(item => {
        preloadImage(item.previewImage);
      });
    }, []);

    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref({ startClosingAnimation });
        } else {
          ref.current = { startClosingAnimation };
        }
      }
    }, [ref]);

    useEffect(() => {
      const rowsCount = Math.ceil(componentItems.length / 2);
      let currentRow = 0;

      const timer = setInterval(() => {
        if (currentRow < rowsCount) {
          setVisibleRows(prev => prev + 1);
          currentRow++;
        } else {
          clearInterval(timer);
        }
      }, 200);

      return () => clearInterval(timer);
    }, []);

    const startClosingAnimation = () => {
      onClose();
    };

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (lockedItem) {
            setLockedItem(null);
          } else {
            startClosingAnimation();
          }
        }
      };

      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }, [lockedItem]);

    const handleComponentClick = (id: string) => {
      if (lockedItem === id) {
        setLockedItem(null);
      } else {
        setLockedItem(id);
        const item = componentItems.find(item => item.id === id);
        if (item) {
          preloadImage(item.previewImage);
        }
      }
    };

    const displayedComponent = lockedItem
      ? componentItems.find(item => item.id === lockedItem)
      : (hoveredItem ? componentItems.find(item => item.id === hoveredItem) : null);

    const rows = [];
    for (let i = 0; i < componentItems.length; i += 2) {
      const rowItems = componentItems.slice(i, i + 2);
      rows.push(rowItems);
    }

    return (
      <div className="h-full overflow-auto">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[minmax(300px,1fr)_2fr] h-full"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.01,
                delayChildren: 0.05,
                ease: "easeOut"
              }
            }
          }}
        >
          <motion.div
            className="p-10 flex flex-col h-full"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: "easeOut" }
              }
            }}
          >
            <div className="text-xs text-neutral-500 mb-4">
              _COMPONENTS
            </div>
            <h2 className="text-[2.5rem] font-extralight leading-[1.1] mb-auto">
              Beautiful UI components for modern web apps
            </h2>
            <div className="mt-auto mb-4 w-full">
              <Card3D
                content={
                  <div className="flex p-10 flex-col h-full text-center">
                    {displayedComponent ? (
                      <>
                        <div className="text-xs text-neutral-500 mb-2">
                          {displayedComponent.id}
                        </div>
                        <div className="text-xl font-light mb-4">
                          {displayedComponent.title}
                        </div>
                        <div className="flex-1 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
                          <div className="relative w-full h-[100px]" style={{
                            backgroundImage: `url(${displayedComponent.previewImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          </div>
                        </div>
                        <button
                          onClick={() => window.open(displayedComponent.url, '_blank')}
                          className="pointer-events-auto px-4 py-2 bg-white text-black text-xs font-medium tracking-wider rounded hover:bg-white/90 transition-colors"
                        >
                          SEE COMPONENT
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-neutral-500">
                        <span>Hover over a component to preview{lockedItem ? '' : ' or click to lock'}</span>
                      </div>
                    )}
                  </div>
                }
                maxRotation={0.03}
                className="mx-auto w-full max-w-[400px] h-[300px]"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 h-full" style={{ gridTemplateRows: `repeat(${rows.length}, 1fr)` }}>
            {rows.slice(0, visibleRows).map((rowItems, rowIndex) => (
              <div key={`row-${rowIndex}`} className="grid grid-cols-1 sm:grid-cols-2 w-full">
                {rowItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className={`relative border-t border-l border-neutral-800 text-center ${
                      rowIndex === rows.length - 1 ? 'border-b' : ''
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute top-0 left-0 w-0 h-[1px] bg-neutral-700"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute top-0 left-0 w-[1px] h-0 bg-neutral-700"
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    <div
                      className={`flex flex-col justify-center items-center h-full px-6 py-8 relative overflow-hidden cursor-pointer ${
                        lockedItem === item.id ? 'ring-1 ring-inset ring-white/20' : ''
                      }`}
                      onMouseEnter={() => {
                        if (!lockedItem) {
                          setHoveredItem(item.id);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!lockedItem) {
                          setHoveredItem(null);
                        }
                      }}
                      onClick={() => handleComponentClick(item.id)}
                    >
                      <motion.div
                        className="absolute inset-0 bg-neutral-500/20"
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{
                          scaleX: (hoveredItem === item.id && !lockedItem) || lockedItem === item.id ? 1 : 0
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />

                      <div className="text-xs text-neutral-500 mb-4 font-mono relative z-10 h-4 flex items-center justify-center">
                        <div className="w-full text-center" style={{ minWidth: `${(`/ ${item.id}`).length}ch` }}>
                          {(hoveredItem === item.id && !lockedItem) || lockedItem === item.id ? (
                            <DecryptEffect text={`/ ${item.id}`} startDecrypting={true} />
                          ) : (
                            `/ ${item.id}`
                          )}
                        </div>
                      </div>
                      <div className="text-white text-[17px] font-extralight relative z-10">
                        {item.title}
                      </div>
                      {lockedItem === item.id && (
                        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-white animate-pulse" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }
);

function DecryptEffect({ text, startDecrypting = false }: { text: string, startDecrypting?: boolean }) {
  const [decodedText, setDecodedText] = useState(startDecrypting ? "" : text);

  useEffect(() => {
    let iteration = 0;
    let shouldAnimate = true;
    const frameRate = 24;
    const speed = startDecrypting ? 0.3 : 0.5;

    const interval = setInterval(() => {
      if (!shouldAnimate) return;

      setDecodedText(prev => {
        const result = text.split("").map((letter, index) => {
          if (index < iteration) {
            return text[index];
          }

          return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
            Math.floor(Math.random() * 62)
          ]
        }).join("");

        iteration += speed;

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        return result;
      });
    }, 1000 / frameRate);

    return () => {
      shouldAnimate = false;
      clearInterval(interval);
    };
  }, [text, startDecrypting]);

  return (
    <span className="inline-block font-medium">
      {decodedText}
    </span>
  );
}

function StableDecryptEffect({ text }: { text: string }) {
  const [decodedText, setDecodedText] = useState(text);

  useEffect(() => {
    let iteration = 0;
    let shouldAnimate = true;
    const frameRate = 24;
    const speed = 0.5;

    const interval = setInterval(() => {
      if (!shouldAnimate) return;

      setDecodedText(prev => {
        const result = text.split("").map((letter, index) => {
          if (index < iteration) {
            return text[index];
          }

          return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
            Math.floor(Math.random() * 62)
          ]
        }).join("");

        iteration += speed;

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        return result;
      });
    }, 1000 / frameRate);

    return () => {
      shouldAnimate = false;
      clearInterval(interval);
    };
  }, [text]);

  return (
    <span style={{ fontFamily: 'inherit' }}>
      {decodedText}
    </span>
  );
}


export function Navbar() {
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`w-full bg-black text-white border border-neutral-800`}>
      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[auto_auto_1fr_auto] items-center h-20">
        <div className={`px-4 md:px-10 h-full flex items-center border-r border-neutral-800`}>
          <Link href="/" className="flex items-center">
            <ComponentLogo />
            <span className="ml-3 font-bold text-lg tracking-wide">UI KIT</span>
          </Link>
        </div>

        <div className="px-4 h-full flex md:hidden items-center justify-end">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <MenuIcon isOpen={isMobileMenuOpen} isWhite={true} />
          </button>
        </div>

        <div className="border-r border-neutral-800 h-full hidden md:block">
          <ComponentsLink onDropdownChange={setIsNavDropdownOpen} />
        </div>

        <div className="hidden md:flex items-center h-full pl-10">
          <div className="grid grid-flow-col auto-cols-auto gap-x-10">
            {navItems.map((item) => (
              <NavbarItem key={item.title} item={item} />
            ))}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed top-20 left-0 right-0 z-50 bg-black border-t border-neutral-800 overflow-hidden max-h-[calc(100vh-5rem)]"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="py-4 px-6 flex flex-col space-y-6 overflow-y-auto max-h-[calc(100vh-5rem)]">


              <div className="py-2 border-b border-neutral-800 mt-6">
                <button
                  onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
                  className="flex border-r border-neutral-800 items-center justify-between w-full py-3"
                >
                  <span className="text-sm tracking-wide">COMPONENTS</span>
                </button>

                <AnimatePresence>
                  {isNavDropdownOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 px-2">
                        {componentItems.map((item) => (
                          <Link
                            key={item.id}
                            href={`/components/${item.id.toLowerCase()}`}
                            className="text-white/70 hover:text-white text-sm py-2"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="text-sm font-medium tracking-wider text-white/70 hover:text-white py-2"
                >
                  {item.title}
                </Link>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}