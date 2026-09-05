'use client';

import React from 'react';
import { motion } from 'framer-motion';

type MediaButtonProps = {
  label: string;
  mediaUrl: string; // .mp4, .webm, or .gif
};

export const MediaButton: React.FC<MediaButtonProps> = ({ label, mediaUrl }) => {
  const isVideo = /\.(mp4|webm)$/i.test(mediaUrl);

  return (
    <motion.button
      className="relative overflow-hidden rounded-2xl px-6 py-3 text-white font-semibold text-lg bg-black group shadow-lg hover:cursor-pointer"
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      {isVideo ? (
        <motion.video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          src={mediaUrl}
          muted
          loop
          playsInline
          autoPlay
        />
      ) : (
        <motion.img
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          src={mediaUrl}
          alt="Background"
        />
      )}

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none group-hover:opacity-100 transition-opacity duration-300" />

      {/* Button Text */}
      <span className="relative z-20 text-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{label}</span>
    </motion.button>
  );
};