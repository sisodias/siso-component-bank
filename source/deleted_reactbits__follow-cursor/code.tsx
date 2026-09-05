"use client"; 

import React, { useRef, useEffect, ReactNode, FC, useState } from "react";
import { useSpring, animated, to, SpringValue, SpringConfig } from "@react-spring/web";

interface FollowCursorProps {
  children: ReactNode;
  className?: string; 
  cardClassName?: string; 
  animationConfig?: Partial<SpringConfig> & { [key: string]: any }; 
  hoverScale?: number;
  offsetX?: number; 
  offsetY?: number; 
  cardWidth?: string;
  cardHeight?: string; 
  rotationFactor?: number;
  perspective?: string;
  zoomSensitivity?: number;
  wheelConfig?: Partial<SpringConfig> & { [key: string]: any };
  enableTilt?: boolean;
  enableZoom?: boolean; 
  enableDrag?: boolean; 
  style?: React.CSSProperties; 
}

const calcXRotate = (yPosRelativeToCardCenter: number, rotationFactor: number): number =>
  -yPosRelativeToCardCenter / rotationFactor;

const calcYRotate = (xPosRelativeToCardCenter: number, rotationFactor: number): number =>
  xPosRelativeToCardCenter / rotationFactor;

const isMobileClient = (): boolean => {
  if (typeof navigator !== 'undefined') {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }
  return false;
};

interface TouchState {
  startX?: number; startY?: number;
  offsetX?: number; offsetY?: number;
}

export const FollowCursor: FC<FollowCursorProps> = ({ 
  children,
  className = "", 
  cardClassName = "", 
  animationConfig = { mass: 0.5, tension: 400, friction: 30 }, 
  hoverScale = 1, 
  offsetX = 20, 
  offsetY = 20, 
  cardWidth = "200px",
  cardHeight = "250px", 
  rotationFactor = 30, 
  perspective = "1000px", 
  zoomSensitivity = 0.5, 
  wheelConfig = { mass: 1, tension: 200, friction: 20 },
  enableTilt = true,
  enableZoom = true,
  enableDrag = true,
  style, 
}) => {
  const domTarget = useRef<HTMLDivElement | null>(null); 
  const touchState = useRef<TouchState>({});
  const [isClientMobile, setIsClientMobile] = useState(false);

  useEffect(() => {
    setIsClientMobile(isMobileClient()); 
  }, []);


  const [{ x, y, rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(
    () => ({
      rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, zoom: 0, x: 0, y: 0,
      config: animationConfig,
    })
  );

  useEffect(() => {
    const card = domTarget.current;
    if (!isClientMobile || !card || !enableDrag) return;
    let isDragging = false; let pinchStartDistance = 0; let pinchStartAngle = 0;
    let initialZoom = 0; let initialRotateZ = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1 && enableDrag) {
        const touch = e.touches[0];
        touchState.current = { startX: touch.clientX, startY: touch.clientY, offsetX: x.get(), offsetY: y.get(), };
        isDragging = true; card.style.cursor = 'grabbing';
      } else if (e.touches.length === 2 && enableZoom) {
        isDragging = false; const touch1 = e.touches[0]; const touch2 = e.touches[1];
        pinchStartDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        pinchStartAngle = Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX);
        initialZoom = zoom.get(); initialRotateZ = rotateZ.get();
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging && enableDrag) {
        e.preventDefault(); const touch = e.touches[0];
        const deltaX = touch.clientX - (touchState.current.startX || 0);
        const deltaY = touch.clientY - (touchState.current.startY || 0);
        api.start({ x: (touchState.current.offsetX || 0) + deltaX, y: (touchState.current.offsetY || 0) + deltaY, rotateX: 0, rotateY: 0, immediate: true, });
      } else if (e.touches.length === 2 && enableZoom) {
        e.preventDefault(); const touch1 = e.touches[0]; const touch2 = e.touches[1];
        const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        const currentAngle = Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX);
        const zoomDelta = (currentDistance - pinchStartDistance) * zoomSensitivity * 0.01; 
        const rotateDelta = currentAngle - pinchStartAngle;
        api.start({ zoom: initialZoom + zoomDelta, rotateZ: initialRotateZ + rotateDelta, immediate: true });
      }
    };
    const handleTouchEnd = () => {
      if (isDragging) isDragging = false; card.style.cursor = 'grab';
      api.start({ immediate: false });
    };
    card.addEventListener("touchstart", handleTouchStart, { passive: !enableDrag }); 
    window.addEventListener("touchmove", handleTouchMove, { passive: false }); 
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd); 
    return () => {
      card.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isClientMobile, api, x, y, zoom, rotateZ, enableDrag, enableZoom, zoomSensitivity, animationConfig]);

  useEffect(() => {
    const cardElement = domTarget.current;
    if (isClientMobile || !cardElement) return; 
    const handleMouseMove = (event: MouseEvent) => {
      const cardRect = cardElement.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const viewportMouseX = event.clientX; const viewportMouseY = event.clientY;
      const targetX = viewportMouseX + offsetX; const targetY = viewportMouseY + offsetY;
      let rx = 0, ry = 0;
      if (enableTilt) {
        const mouseRelativeToCardX = viewportMouseX - cardCenterX;
        const mouseRelativeToCardY = viewportMouseY - cardCenterY;
        rx = calcXRotate(mouseRelativeToCardY, rotationFactor);
        ry = calcYRotate(mouseRelativeToCardX, rotationFactor);
      }
      api.start({ x: targetX, y: targetY, rotateX: rx, rotateY: ry, scale: hoverScale, });
    };
    const handleMouseLeaveScreen = () => { /* Optional: Reset or keep position */ };
    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeaveScreen);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeaveScreen);
      api.start({ x: x.get(), y: y.get(), rotateX: 0, rotateY: 0, scale: 1, immediate: false });
    };
  }, [isClientMobile, api, offsetX, offsetY, hoverScale, enableTilt, rotationFactor, x, y, animationConfig]);

  useEffect(() => {
    const card = domTarget.current;
    if (isClientMobile || !card || !enableZoom) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const newZoom = zoom.get() - e.deltaY * zoomSensitivity * 0.001;
      api.start({ zoom: newZoom, config: wheelConfig });
    };
    card.addEventListener("wheel", handleWheel, { passive: false });
    return () => card.removeEventListener("wheel", handleWheel);
  }, [isClientMobile, enableZoom, api, zoom, zoomSensitivity, wheelConfig]);

  const getCardWidth = cardWidth || "200px";
  const getCardHeight = cardHeight || "250px";

  return (
    <animated.div
      ref={domTarget}
      className={`follow-cursor-card fixed touch-none pointer-events-auto ${className} ${cardClassName}`} 
      style={{
        width: getCardWidth,
        height: getCardHeight,
        transformStyle: "preserve-3d",
        perspective: perspective, 
        x: x as SpringValue<number>, 
        y: y as SpringValue<number>,
        scale: to([scale, zoom], (s, z) => s * (1 + z)), 
        rotateX: enableTilt ? (rotateX as SpringValue<number>) : 0,
        rotateY: enableTilt ? (rotateY as SpringValue<number>) : 0,
        rotateZ: enableZoom && isClientMobile ? (rotateZ as SpringValue<number>) : 0, 
        cursor: isClientMobile && enableDrag ? 'grab' : 'default',
        ...style 
      }}
    >
      {children}
    </animated.div>
  );
};