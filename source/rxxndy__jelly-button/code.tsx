"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

// Made by Voicu Apostol - www.cerpow.com
// Adapted for React by Randy

interface JellyButtonProps {
  className?: string;
  totalFrames?: number;
  startFrame?: number;
  squishTarget?: number;
  imageBaseUrl?: string;
}

export default function JellyButton({
  className,
  totalFrames = 215,
  startFrame = 70,
  squishTarget = 180,
  imageBaseUrl = "https://cerpow.github.io/cerpow-img/jelly/jelly_",
}: JellyButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(-1);
  const displayFrameRef = useRef(startFrame);
  const animationPhaseRef = useRef<'idle' | 'squishing' | 'holding' | 'dragging' | 'expanding' | 'settling' | 'releasing'>('idle');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Interaction state refs
  const isPressedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const pressStartTimeRef = useRef(0);
  const pressStartYRef = useRef(0);
  const pressStartFrameRef = useRef(0);
  const squishTweenRef = useRef<gsap.core.Tween | null>(null);
  const releaseTweenRef = useRef<gsap.core.Tween | null>(null);

  const quickClickThreshold = 200;
  const dragThreshold = 10;
  const dragSensitivity = 0.8;

  // Draw frame
  const drawFrame = useCallback((frame: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameIndex = Math.max(0, Math.min(totalFrames - 1, Math.floor(frame)));
    const img = imagesRef.current[frameIndex];
    
    if (frameIndex !== currentFrameRef.current && img?.complete) {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.drawImage(img, 0, 0, canvas.clientWidth, canvas.clientHeight);
      currentFrameRef.current = frameIndex;
    }
  }, [totalFrames]);

  // Animation loop
  const animate = useCallback(() => {
    drawFrame(displayFrameRef.current);
    requestAnimationFrame(animate);
  }, [drawFrame]);

  // Set canvas size
  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = width * (3 / 4);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.height = `${height}px`;
    ctx.scale(ratio, ratio);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium";
    currentFrameRef.current = -1;
  }, []);

  // Pointer handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isPressedRef.current) return;
    isPressedRef.current = true;
    isDraggingRef.current = false;
    pressStartTimeRef.current = Date.now();
    pressStartYRef.current = e.clientY;
    pressStartFrameRef.current = displayFrameRef.current;

    // Kill existing animations
    if (releaseTweenRef.current) {
      releaseTweenRef.current.kill();
      releaseTweenRef.current = null;
    }
    if (squishTweenRef.current) {
      squishTweenRef.current.kill();
      squishTweenRef.current = null;
    }

    animationPhaseRef.current = 'squishing';

    squishTweenRef.current = gsap.to({ frame: displayFrameRef.current }, {
      frame: squishTarget,
      duration: 0.1,
      ease: "power2.in",
      onUpdate: function() {
        if (!isDraggingRef.current) {
          displayFrameRef.current = this.targets()[0].frame;
        }
      },
      onComplete: () => {
        if (!isDraggingRef.current) {
          animationPhaseRef.current = 'holding';
        }
      }
    });
  }, [squishTarget]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPressedRef.current) return;

    const deltaY = e.clientY - pressStartYRef.current;

    if (!isDraggingRef.current && Math.abs(deltaY) > dragThreshold) {
      isDraggingRef.current = true;
      animationPhaseRef.current = 'dragging';

      if (squishTweenRef.current) {
        squishTweenRef.current.kill();
        squishTweenRef.current = null;
      }
    }

    if (isDraggingRef.current) {
      const frameOffset = deltaY * dragSensitivity;
      let newFrame = pressStartFrameRef.current + frameOffset;
      newFrame = Math.max(0, Math.min(totalFrames - 1, newFrame));
      displayFrameRef.current = newFrame;
    }
  }, [totalFrames]);

  const handlePointerUp = useCallback(() => {
    if (!isPressedRef.current) return;
    isPressedRef.current = false;

    const pressDuration = Date.now() - pressStartTimeRef.current;
    const wasQuickClick = pressDuration < quickClickThreshold && !isDraggingRef.current;

    if (squishTweenRef.current) {
      squishTweenRef.current.kill();
      squishTweenRef.current = null;
    }

    if (wasQuickClick) {
      animationPhaseRef.current = 'squishing';

      squishTweenRef.current = gsap.to({ frame: displayFrameRef.current }, {
        frame: squishTarget,
        duration: 0,
        ease: "power2.in",
        onUpdate: function() {
          displayFrameRef.current = this.targets()[0].frame;
        },
        onComplete: () => {
          animationPhaseRef.current = 'expanding';
          releaseTweenRef.current = gsap.to({ frame: squishTarget }, {
            frame: 0,
            duration: 0.45,
            ease: "power2.out",
            onUpdate: function() {
              displayFrameRef.current = this.targets()[0].frame;
            },
            onComplete: () => {
              animationPhaseRef.current = 'settling';
              gsap.to({ frame: 0 }, {
                frame: startFrame,
                duration: 0.2,
                ease: "power1.inOut",
                onUpdate: function() {
                  displayFrameRef.current = this.targets()[0].frame;
                },
                onComplete: () => {
                  releaseTweenRef.current = null;
                  animationPhaseRef.current = 'idle';
                  displayFrameRef.current = startFrame;
                }
              });
            }
          });
        }
      });
    } else {
      animationPhaseRef.current = 'releasing';

      const distance = Math.abs(displayFrameRef.current - startFrame);
      const releaseDuration = Math.max(0.3, Math.min(1.2, distance / 100));

      releaseTweenRef.current = gsap.to({ frame: displayFrameRef.current }, {
        frame: startFrame,
        duration: releaseDuration,
        ease: "power2.out",
        onUpdate: function() {
          displayFrameRef.current = this.targets()[0].frame;
        },
        onComplete: () => {
          releaseTweenRef.current = null;
          animationPhaseRef.current = 'idle';
          displayFrameRef.current = startFrame;
          isDraggingRef.current = false;
        }
      });
    }

    isDraggingRef.current = false;
  }, [squishTarget, startFrame]);

  // Preload images and initialize
  useEffect(() => {
    let loadedImages = 0;
    let failedImages = 0;
    const images: HTMLImageElement[] = [];

    const checkComplete = () => {
      if (loadedImages + failedImages === totalFrames) {
        imagesRef.current = images;
        setIsLoading(false);
        
        setTimeout(() => {
          displayFrameRef.current = startFrame;
          setIsReady(true);
          animate();
        }, 350);
      }
    };

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `${imageBaseUrl}${i.toString().padStart(5, "0")}.jpg`;
      img.onload = () => {
        loadedImages++;
        checkComplete();
      };
      img.onerror = () => {
        failedImages++;
        checkComplete();
      };
      images[i] = img;
    }

    return () => {
      // Cleanup tweens on unmount
      if (squishTweenRef.current) squishTweenRef.current.kill();
      if (releaseTweenRef.current) releaseTweenRef.current.kill();
    };
  }, [totalFrames, startFrame, imageBaseUrl, animate]);

  // Handle resize
  useEffect(() => {
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    return () => window.removeEventListener("resize", setCanvasSize);
  }, [setCanvasSize]);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative w-full max-w-[640px] aspect-[4/3] flex items-center justify-center cursor-pointer select-none",
        "translate-x-[-1%] translate-y-[3%]",
        className
      )}
      style={{ touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <canvas
        ref={canvasRef}
        width={1280}
        height={960}
        className={cn(
          "w-full h-full select-none z-10 rounded-[clamp(22px,6vw,42px)]",
          "transition-all duration-1000 ease-out",
          isReady ? "opacity-100 scale-100" : "opacity-0 scale-[0.92]"
        )}
      />
      
      {/* Loader */}
      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[90%] max-w-[150px] h-0.5 bg-white/20",
          "transition-opacity duration-500",
          !isLoading && "opacity-0 invisible"
        )}
      >
        <span 
          className="flex bg-white h-full w-1/4"
          style={{
            animation: "jellyLoader 1.3s infinite alternate ease-in-out"
          }}
        />
      </div>
    </div>
  );
}

export { JellyButton };
export type { JellyButtonProps };

// ============================================================================
// DEMO COMPONENT FOR 21ST.DEV
// Fully self-contained - no external imports
// ============================================================================

function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(-1);
  const displayFrameRef = useRef(70);
  const animationPhaseRef = useRef<string>('idle');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const isPressedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const pressStartTimeRef = useRef(0);
  const pressStartYRef = useRef(0);
  const pressStartFrameRef = useRef(0);
  const squishTweenRef = useRef<ReturnType<typeof gsap.to> | null>(null);
  const releaseTweenRef = useRef<ReturnType<typeof gsap.to> | null>(null);

  const totalFrames = 215;
  const startFrame = 70;
  const squishTarget = 180;
  const imageBaseUrl = "https://cerpow.github.io/cerpow-img/jelly/jelly_";
  const quickClickThreshold = 200;
  const dragThreshold = 10;
  const dragSensitivity = 0.8;

  const drawFrame = useCallback((frame: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const frameIndex = Math.max(0, Math.min(totalFrames - 1, Math.floor(frame)));
    const img = imagesRef.current[frameIndex];
    if (frameIndex !== currentFrameRef.current && img?.complete) {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.drawImage(img, 0, 0, canvas.clientWidth, canvas.clientHeight);
      currentFrameRef.current = frameIndex;
    }
  }, []);

  const animate = useCallback(() => {
    drawFrame(displayFrameRef.current);
    requestAnimationFrame(animate);
  }, [drawFrame]);

  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = width * (3 / 4);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.height = `${height}px`;
    ctx.scale(ratio, ratio);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium";
    currentFrameRef.current = -1;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isPressedRef.current) return;
    isPressedRef.current = true;
    isDraggingRef.current = false;
    pressStartTimeRef.current = Date.now();
    pressStartYRef.current = e.clientY;
    pressStartFrameRef.current = displayFrameRef.current;

    if (releaseTweenRef.current) { releaseTweenRef.current.kill(); releaseTweenRef.current = null; }
    if (squishTweenRef.current) { squishTweenRef.current.kill(); squishTweenRef.current = null; }

    animationPhaseRef.current = 'squishing';
    squishTweenRef.current = gsap.to({ frame: displayFrameRef.current }, {
      frame: squishTarget,
      duration: 0.1,
      ease: "power2.in",
      onUpdate: function() { if (!isDraggingRef.current) displayFrameRef.current = this.targets()[0].frame; },
      onComplete: () => { if (!isDraggingRef.current) animationPhaseRef.current = 'holding'; }
    });
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPressedRef.current) return;
    const deltaY = e.clientY - pressStartYRef.current;
    if (!isDraggingRef.current && Math.abs(deltaY) > dragThreshold) {
      isDraggingRef.current = true;
      animationPhaseRef.current = 'dragging';
      if (squishTweenRef.current) { squishTweenRef.current.kill(); squishTweenRef.current = null; }
    }
    if (isDraggingRef.current) {
      const frameOffset = deltaY * dragSensitivity;
      let newFrame = pressStartFrameRef.current + frameOffset;
      newFrame = Math.max(0, Math.min(totalFrames - 1, newFrame));
      displayFrameRef.current = newFrame;
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isPressedRef.current) return;
    isPressedRef.current = false;
    const pressDuration = Date.now() - pressStartTimeRef.current;
    const wasQuickClick = pressDuration < quickClickThreshold && !isDraggingRef.current;
    if (squishTweenRef.current) { squishTweenRef.current.kill(); squishTweenRef.current = null; }

    if (wasQuickClick) {
      animationPhaseRef.current = 'squishing';
      squishTweenRef.current = gsap.to({ frame: displayFrameRef.current }, {
        frame: squishTarget, duration: 0, ease: "power2.in",
        onUpdate: function() { displayFrameRef.current = this.targets()[0].frame; },
        onComplete: () => {
          animationPhaseRef.current = 'expanding';
          releaseTweenRef.current = gsap.to({ frame: squishTarget }, {
            frame: 0, duration: 0.45, ease: "power2.out",
            onUpdate: function() { displayFrameRef.current = this.targets()[0].frame; },
            onComplete: () => {
              animationPhaseRef.current = 'settling';
              gsap.to({ frame: 0 }, {
                frame: startFrame, duration: 0.2, ease: "power1.inOut",
                onUpdate: function() { displayFrameRef.current = this.targets()[0].frame; },
                onComplete: () => { releaseTweenRef.current = null; animationPhaseRef.current = 'idle'; displayFrameRef.current = startFrame; }
              });
            }
          });
        }
      });
    } else {
      animationPhaseRef.current = 'releasing';
      const distance = Math.abs(displayFrameRef.current - startFrame);
      const releaseDuration = Math.max(0.3, Math.min(1.2, distance / 100));
      releaseTweenRef.current = gsap.to({ frame: displayFrameRef.current }, {
        frame: startFrame, duration: releaseDuration, ease: "power2.out",
        onUpdate: function() { displayFrameRef.current = this.targets()[0].frame; },
        onComplete: () => { releaseTweenRef.current = null; animationPhaseRef.current = 'idle'; displayFrameRef.current = startFrame; isDraggingRef.current = false; }
      });
    }
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    let loadedImages = 0;
    let failedImages = 0;
    const images: HTMLImageElement[] = [];
    const checkComplete = () => {
      if (loadedImages + failedImages === totalFrames) {
        imagesRef.current = images;
        setIsLoading(false);
        setTimeout(() => { displayFrameRef.current = startFrame; setIsReady(true); animate(); }, 350);
      }
    };
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `${imageBaseUrl}${i.toString().padStart(5, "0")}.jpg`;
      img.onload = () => { loadedImages++; checkComplete(); };
      img.onerror = () => { failedImages++; checkComplete(); };
      images[i] = img;
    }
    return () => {
      if (squishTweenRef.current) squishTweenRef.current.kill();
      if (releaseTweenRef.current) releaseTweenRef.current.kill();
    };
  }, [animate]);

  useEffect(() => {
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    return () => window.removeEventListener("resize", setCanvasSize);
  }, [setCanvasSize]);

  return (
    <>
      <style>{`
        @keyframes jellyLoader {
          0% { opacity: 0; transform: translateX(0%); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateX(300%); }
        }
      `}</style>
      <div
        ref={wrapperRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 640,
          aspectRatio: "4/3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          userSelect: "none",
          touchAction: "none",
          transform: "translateX(-1%) translateY(3%)",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <canvas
          ref={canvasRef}
          width={1280}
          height={960}
          style={{
            width: "100%",
            height: "100%",
            userSelect: "none",
            zIndex: 10,
            borderRadius: "clamp(22px, 6vw, 42px)",
            transition: "all 1000ms ease-out",
            opacity: isReady ? 1 : 0,
            transform: isReady ? "scale(1)" : "scale(0.92)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translateX(-50%) translateY(-50%)",
            width: "90%",
            maxWidth: 150,
            height: 2,
            backgroundColor: "rgba(255,255,255,0.2)",
            transition: "opacity 500ms",
            opacity: isLoading ? 1 : 0,
            visibility: isLoading ? "visible" : "hidden",
          }}
        >
          <span
            style={{
              display: "flex",
              backgroundColor: "white",
              height: "100%",
              width: "25%",
              animation: "jellyLoader 1.3s infinite alternate ease-in-out",
            }}
          />
        </div>
      </div>
    </>
  );
}

export { Component };
