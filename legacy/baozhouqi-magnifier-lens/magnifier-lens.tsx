import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface LensProps {
  children: React.ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  position?: {
    x: number;
    y: number;
  };
  isStatic?: boolean;
  isFocusing?: () => void;
  hovering?: boolean;
  setHovering?: (hovering: boolean) => void;
}

const Lens: React.FC<LensProps> = ({
  children,
  zoomFactor = 2.0,
  lensSize = 150,
  isStatic = false,
  position = { x: 200, y: 150 },
  hovering,
  setHovering,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [localIsHovering, setLocalIsHovering] = useState(false);
  const isHovering = hovering !== undefined ? hovering : localIsHovering;
  const setIsHovering = setHovering || setLocalIsHovering;
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg z-20 cursor-none"
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {children}

      {isStatic ? (
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.58 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 overflow-hidden"
            style={{
              maskImage: `radial-gradient(circle ${lensSize / 2}px at ${
                position.x
              }px ${position.y}px, black 100%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(circle ${lensSize / 2}px at ${
                position.x
              }px ${position.y}px, black 100%, transparent 100%)`,
              transformOrigin: `${position.x}px ${position.y}px`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoomFactor})`,
                transformOrigin: `${position.x}px ${position.y}px`,
              }}
            >
              {children}
            </div>
          </motion.div>
                    <div
            className="absolute pointer-events-none"
            style={{
              left: position.x - lensSize / 2,
              top: position.y - lensSize / 2,
              width: lensSize,
              height: lensSize,
              borderRadius: '50%',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)',
              background: 'radial-gradient(circle at center, transparent 60%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0.2) 80%, transparent 100%)',
            }}
          />
        </div>
      ) : (
        <AnimatePresence>
          {isHovering && (
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.58 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 overflow-hidden"
                style={{
                  maskImage: `radial-gradient(circle ${lensSize / 2}px at ${
                    mousePosition.x
                  }px ${mousePosition.y}px, black 100%, transparent 100%)`,
                  WebkitMaskImage: `radial-gradient(circle ${
                    lensSize / 2
                  }px at ${mousePosition.x}px ${
                    mousePosition.y
                  }px, black 100%, transparent 100%)`,
                  transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`,
                  zIndex: 50,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `scale(${zoomFactor})`,
                    transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`,
                  }}
                >
                  {children}
                </div>
              </motion.div>
                            <motion.div
                initial={{ opacity: 0, scale: 0.58 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute pointer-events-none z-[60]"
                style={{
                  left: mousePosition.x - lensSize / 2,
                  top: mousePosition.y - lensSize / 2,
                  width: lensSize,
                  height: lensSize,
                  borderRadius: '50%',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)',
                  background: 'radial-gradient(circle at center, transparent 60%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0.2) 80%, transparent 100%)',
                }}
              />
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const MagnifyingGlassDemo = () => {
  const [hovering, setHovering] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Magnifying Glass Effect
          </h1>
          <p className="text-muted-foreground">
            Hover over the image to see the magnifying glass effect with optical distortion
          </p>
        </div>
        
        <div className="relative">
          <Lens 
            hovering={hovering} 
            setHovering={setHovering}
            zoomFactor={2.5}
            lensSize={180}
          >
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Mountain landscape"
              width={600}
              height={400}
              className="rounded-lg shadow-lg object-cover w-full h-[400px]"
            />
          </Lens>
          
          <motion.div
            animate={{
              filter: hovering ? "blur(1px)" : "blur(0px)",
            }}
            className="mt-6 text-center"
          >
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Beautiful Mountain Vista
            </h2>
            <p className="text-muted-foreground">
              Experience the detailed beauty of nature with our interactive magnifying glass. 
              Move your cursor around to explore different areas of the image in stunning detail.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const Component = MagnifyingGlassDemo;