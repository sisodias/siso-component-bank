"use client";

import React, { useRef, useEffect, FC } from "react";
import { gsap } from "gsap";

// --- Helper Functions ---
function lerp(a: number, b: number, n: number): number {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(
  e: MouseEvent | TouchEvent,
  rect: DOMRect | null // Allow rect to be null
): { x: number; y: number } {
  let clientX = 0,
    clientY = 0;
  if ("touches" in e && e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ("clientX" in e) {
    clientX = (e as MouseEvent).clientX;
    clientY = (e as MouseEvent).clientY;
  }
  if (!rect) return { x: clientX, y: clientY };
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function getMouseDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

// --- ImageItem Class ---
class ImageItem {
  public DOM: { el: HTMLDivElement; inner: HTMLDivElement | null };
  public defaultStyle: gsap.TweenVars = { scale: 1, x: 0, y: 0, opacity: 0 };
  public rect: DOMRect | null = null;
  private resizeHandler: () => void;

  constructor(DOM_el: HTMLDivElement) {
    this.DOM = { el: DOM_el, inner: null }; // Initialize inner properly
    if (this.DOM.el) { // Ensure el exists before querying
        this.DOM.inner = this.DOM.el.querySelector<HTMLDivElement>(".content__img-inner");
    }
    this.resizeHandler = () => {
      if (!this.DOM.el) return;
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    this.initEvents();
    this.getRect(); // Call getRect after initEvents or if DOM.el is already set
  }

  private initEvents() {
    window.addEventListener("resize", this.resizeHandler);
  }

  public destroy() {
    window.removeEventListener("resize", this.resizeHandler);
  }

  private getRect() {
    if (this.DOM.el) {
      this.rect = this.DOM.el.getBoundingClientRect();
    }
  }
}

// --- ImageTrailVariant1 (with example cleanup) ---
class ImageTrailVariant1 {
  private container: HTMLDivElement;
  private images: ImageItem[];
  private imagesTotal: number;
  private imgPosition: number = 0;
  private zIndexVal: number = 1;
  private activeImagesCount: number = 0;
  private isIdle: boolean = true;
  private threshold: number = 80;
  private mousePos: { x: number; y: number } = { x: 0, y: 0 };
  private lastMousePos: { x: number; y: number } = { x: 0, y: 0 };
  private cacheMousePos: { x: number; y: number } = { x: 0, y: 0 };
  private animationFrameId: number | null = null;

  // Store bound event handlers for easy removal
  private boundHandlePointerMove: (ev: MouseEvent | TouchEvent) => void;
  private boundInitRender: (ev: MouseEvent | TouchEvent) => void;
  private boundRenderLoop: () => void;

  constructor(container: HTMLDivElement) {
    this.container = container;
    const imgElements = Array.from(container.querySelectorAll<HTMLDivElement>(".content__img"));
    this.images = imgElements.map((img) => new ImageItem(img));
    this.imagesTotal = this.images.length;

    if (this.imagesTotal === 0) {
        console.warn("ImageTrailVariant1: No images found to animate.");
        // Initialize bound functions even if no images, to prevent errors in destroy
        this.boundHandlePointerMove = () => {};
        this.boundInitRender = () => {};
        this.boundRenderLoop = () => {};
        return;
    }
    
    this.boundRenderLoop = this.render.bind(this);

    this.boundHandlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    this.boundInitRender = (ev: MouseEvent | TouchEvent) => {
      if (!this.container) return; // Should not happen if constructor was called properly
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      if (this.animationFrameId === null) { // Start render loop only once
        this.animationFrameId = requestAnimationFrame(this.boundRenderLoop);
      }
      this.container.removeEventListener("mousemove", this.boundInitRender as EventListener);
      this.container.removeEventListener("touchmove", this.boundInitRender as EventListener);
    };

    this.container.addEventListener("mousemove", this.boundHandlePointerMove);
    this.container.addEventListener("touchmove", this.boundHandlePointerMove);
    this.container.addEventListener("mousemove", this.boundInitRender as EventListener);
    this.container.addEventListener("touchmove", this.boundInitRender as EventListener);
  }

  private render() {
    if (!this.container) { // Safety check
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        return;
    }
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    this.animationFrameId = requestAnimationFrame(this.boundRenderLoop);
  }

  private showNextImage() {
    if (this.imagesTotal === 0) return;
    ++this.zIndexVal;
    this.imgPosition = (this.imgPosition + 1) % this.imagesTotal;
    const img = this.images[this.imgPosition];
    if (!img || !img.DOM.el || !img.rect) return;

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo( img.DOM.el,
        { opacity: 1, scale: 1, zIndex: this.zIndexVal, x: this.cacheMousePos.x - img.rect.width / 2, y: this.cacheMousePos.y - img.rect.height / 2, },
        { duration: 0.4, ease: "power1", x: this.mousePos.x - img.rect.width / 2, y: this.mousePos.y - img.rect.height / 2, },0
      )
      .to( img.DOM.el, { duration: 0.4, ease: "power3", opacity: 0, scale: 0.2, }, 0.4 );
  }

  private onImageActivated() { this.activeImagesCount++; this.isIdle = false; }
  private onImageDeactivated() { this.activeImagesCount--; if (this.activeImagesCount === 0) this.isIdle = true; }

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.container) {
        this.container.removeEventListener("mousemove", this.boundHandlePointerMove);
        this.container.removeEventListener("touchmove", this.boundHandlePointerMove);
        this.container.removeEventListener("mousemove", this.boundInitRender as EventListener);
        this.container.removeEventListener("touchmove", this.boundInitRender as EventListener);
    }
    this.images.forEach(img => img.destroy());
    // console.log("ImageTrailVariant1 destroyed");
  }
}

// --- Placeholder for other variants (YOU NEED TO IMPLEMENT THEIR CLEANUP TOO) ---
// If other variants are exact copies, you might not need separate classes.
// If they are different, each needs its own destroy method and proper listener management.
class ImageTrailVariant2 extends ImageTrailVariant1 {} // Example, needs its own logic if different
class ImageTrailVariant3 extends ImageTrailVariant1 {}
class ImageTrailVariant4 extends ImageTrailVariant1 {}
class ImageTrailVariant5 extends ImageTrailVariant1 {}
class ImageTrailVariant6 extends ImageTrailVariant1 {}
class ImageTrailVariant7 extends ImageTrailVariant1 {} // Needs different logic for visibleImagesCount
class ImageTrailVariant8 extends ImageTrailVariant1 {}


const variantMap: { [key: number]: new (container: HTMLDivElement) => any } = {
  1: ImageTrailVariant1,
  2: ImageTrailVariant2, // Replace with actual class if different
  3: ImageTrailVariant3, // Replace
  4: ImageTrailVariant4, // Replace
  5: ImageTrailVariant5, // Replace
  6: ImageTrailVariant6, // Replace
  7: ImageTrailVariant7, // Replace
  8: ImageTrailVariant8, // Replace
};

interface ImageTrailProps {
  items?: string[];
  variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // Specific variant numbers
  className?: string;
  style?: React.CSSProperties;
  imageClassName?: string;
  imageInnerClassName?: string;
  imageWidth?: string;
  imageAspectRatio?: string;
}

export const ImageTrail: FC<ImageTrailProps> = ({
  items = [],
  variant = 1,
  className = "",
  style = {},
  imageClassName = "w-[190px] aspect-[1.1] rounded-[15px]", // Default from your code
  imageInnerClassName = "bg-center bg-cover w-[calc(100%+20px)] h-[calc(100%+20px)] absolute top-[-10px] left-[-10px]", // Default
  imageWidth,
  imageAspectRatio,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;
    
    const Cls = variantMap[variant] || variantMap[1];
    if (!Cls) {
        console.error(`ImageTrail: Variant ${variant} class not found.`);
        return;
    }
    
    const instance = new Cls(containerRef.current);

    return () => {
      if (instance && typeof instance.destroy === 'function') {
        instance.destroy();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, items]); // Keying on items as well, in case the image list changes

  let finalImageClasses = `content__img absolute top-0 left-0 opacity-0 overflow-hidden pointer-events-none select-none ${imageClassName}`;
  let imageStyles: React.CSSProperties = { willChange: "transform, opacity, filter" };

  if (imageWidth) {
    finalImageClasses = finalImageClasses.replace(/w-\[.*?\]/g, '').replace(/w-\d+/g, ''); // Remove Tailwind width
    imageStyles.width = imageWidth;
  }
  if (imageAspectRatio) {
    finalImageClasses = finalImageClasses.replace(/aspect-\[.*?\]/g, ''); // Remove Tailwind aspect
    imageStyles.aspectRatio = imageAspectRatio;
  }


  if (items.length === 0) {
    return <div className={`w-full h-full flex justify-center items-center ${className}`} style={style}><p>No images for trail.</p></div>;
  }

  return (
    <div
      className={`w-full h-full relative z-[100] bg-transparent ${className}`} // Removed overflow-visible, let parent handle
      ref={containerRef}
      style={style}
    >
      {items.map((url, i) => (
        <div
          className={finalImageClasses}
          style={imageStyles}
          key={`${variant}-${i}-${url}`} // More robust key
        >
          <div
            className={`content__img-inner ${imageInnerClassName}`}
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ))}
    </div>
  );
};