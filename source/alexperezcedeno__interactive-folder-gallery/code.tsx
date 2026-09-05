"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export interface GalleryPhoto {
  id: string | number;
  image: string;
}

const defaultPhotos: GalleryPhoto[] = [
  { id: 1, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" },
  { id: 2, image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=800&auto=format&fit=crop" },
  { id: 3, image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop" },
  { id: 4, image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop" },
  { id: 5, image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop" },
];

export interface InteractiveFolderGalleryProps {
  photos?: GalleryPhoto[];
  folderName?: string;
  dragHintText?: string;
  className?: string;
}

export function InteractiveFolderGallery({
  photos = defaultPhotos,
  folderName = "Photography.gallery",
  dragHintText = "Drag any photo down to close",
  className
}: InteractiveFolderGalleryProps) {
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [hoverFolder, setHoverFolder] = useState(false);

  return (
    <div className={`w-full py-32 relative ${className || ""}`}>
      <div className="relative w-full min-h-[500px] flex flex-col items-center justify-center">

        <div className="relative w-[400px] h-[500px] flex justify-center pointer-events-none z-0">

          <motion.div 
            className="absolute bottom-6 w-80 h-56 drop-shadow-2xl"
            animate={{ opacity: isFolderOpen ? 0 : 1, scale: isFolderOpen ? 0.9 : 1 }}
          >
            <div className="absolute top-0 left-0 w-32 h-10 bg-linear-to-t from-[#1e1e1e] to-[#2a2a2a] rounded-t-xl border-t border-l border-r border-white/10" />
            <div className="absolute top-8 left-0 right-0 bottom-0 bg-linear-to-b from-[#1e1e1e] to-[#0a0a0a] rounded-b-xl rounded-tr-xl border border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" />
            <div className="absolute top-10 left-2 right-2 bottom-2 bg-black rounded-lg shadow-inner pointer-events-none" />
          </motion.div>

          <div className="absolute bottom-10 z-10 flex justify-center">
            {photos.map((photo, i) => {
              const offset = i - 2;

              const stackY = hoverFolder ? offset * -10 - 40 : offset * -5;
              const stackX = hoverFolder ? offset * 30 : offset * 3;
              const stackRotate = hoverFolder ? offset * 8 : offset * 3;
              const stackScale = 1 - Math.abs(offset) * 0.03;

              const openY = -130;
              const openX = offset * 130;
              const openRotate = 0;
              const openScale = 1.05;

              return (
                <motion.div
                  key={photo.id}
                  drag={isFolderOpen ? true : false}
                  dragSnapToOrigin={true}
                  onDragEnd={(e, info) => {
                    if (info.offset.y > 100 && isFolderOpen) {
                      setIsFolderOpen(false);
                      setHoverFolder(false);
                    }
                  }}
                  className={`absolute bottom-0 w-56 h-72 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 origin-bottom ${isFolderOpen ? "cursor-grab active:cursor-grabbing pointer-events-auto" : "pointer-events-none"}`}
                  animate={!isFolderOpen ? {
                    y: stackY,
                    x: stackX,
                    rotate: stackRotate,
                    scale: stackScale,
                    zIndex: i + 10
                  } : {
                    y: openY,
                    x: openX,
                    rotate: openRotate,
                    scale: openScale,
                    zIndex: 50
                  }}
                  whileHover={isFolderOpen ? { scale: openScale + 0.05, zIndex: 100 } : {}}
                  whileDrag={isFolderOpen ? { scale: openScale + 0.1, rotate: 5, zIndex: 150 } : {}}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                >
                  <img src={photo.image} alt="Gallery item" className="w-full h-full object-cover pointer-events-none" />
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            className="absolute bottom-0 w-[340px] h-44 drop-shadow-[0_-20px_40px_rgba(0,0,0,0.8)] cursor-pointer z-20 pointer-events-auto"
            style={{ transformOrigin: "bottom" }}
            animate={{ 
              opacity: isFolderOpen ? 0 : 1, 
              rotateX: hoverFolder ? -25 : 0, 
              y: hoverFolder ? 10 : 0,
              pointerEvents: isFolderOpen ? "none" : "auto" 
            }}
            onMouseEnter={() => setHoverFolder(true)}
            onMouseLeave={() => setHoverFolder(false)}
            onClick={() => setIsFolderOpen(true)}
          >
            <div className="w-full h-full bg-linear-to-b from-[#2a2a2a] to-[#111] rounded-2xl border border-white/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)] relative overflow-hidden flex items-end justify-center pb-8">
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />

              <div className="px-5 py-2.5 bg-black rounded-lg border border-black/80 shadow-inner flex items-center justify-center backdrop-blur-md">
                <span className="text-white/90 text-sm font-medium tracking-wide">
                  {folderName}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ opacity: isFolderOpen ? 1 : 0, y: isFolderOpen ? 0 : 50 }}
          className="absolute bottom-10 px-6 py-3 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md text-black/50 dark:text-white/50 text-sm font-medium uppercase tracking-widest pointer-events-none"
        >
          {dragHintText}
        </motion.div>

      </div>
    </div>
  );
}

export { InteractiveFolderGallery as Component };