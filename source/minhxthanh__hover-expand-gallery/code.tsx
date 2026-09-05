"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

export const HoverExpandGallery = ({
  images,
}: {
  images: { src: string; alt: string; title: string }[];
}) => {
  // State to track the currently active (expanded) image. Defaults to the first image.
  const [activeImage, setActiveImage] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      // Responsive container: full width on small screens, max-width on larger screens
      className="relative w-full max-w-md mx-auto"
    >
      <div className="flex w-full flex-col items-center justify-center gap-2">
        {images.map((image, index) => (
          <motion.div
            key={image.src}
            className="group relative w-full cursor-pointer overflow-hidden rounded-2xl shadow-md"
            // The initial height is fixed, but the width is now flexible
            initial={{ height: "3rem" }}
            // Animate height based on whether the item is active
            animate={{
              height: activeImage === index ? "20rem" : "3rem",
            }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            // Set the active image on click or hover
            onClick={() => setActiveImage(index)}
            onHoverStart={() => setActiveImage(index)}
          >
            {/* Dark gradient overlay for better text readability on expanded image */}
            <AnimatePresence>
              {activeImage === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-transparent"
                />
              )}
            </AnimatePresence>

            {/* Title text that animates in on the expanded image */}
            <AnimatePresence>
              {activeImage === index && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="absolute bottom-0 left-0 z-20 flex h-full w-full flex-col justify-end p-4"
                >
                  <h3 className="text-lg font-bold text-white drop-shadow-lg">
                    {image.title}
                  </h3>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* The actual image element */}
            <img
              src={image.src}
              className="absolute h-full w-full object-cover"
              alt={image.alt}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
