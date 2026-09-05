import { motion } from 'framer-motion';
import { useState } from 'react';
import React from 'react';

export const Component = ({ mousePosition, projects }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { x, y } = mousePosition;

  return (
    <div className="section">
      {projects.map(({ name, backgroundImage, vignetteImage }, i) => (
        <div key={`project${i}`} className="projectSection">
          <div className="gallery">
            <div className="imageContainer">
              <img
                src={backgroundImage}
                alt={`${name} background image`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
              />
            </div>
            <motion.div
              className="vignetteGallery"
              style={{ x, y }}
              animate={{ opacity: hoveredIndex === i || hoveredIndex === null ? 1 : 0.5 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
               <img
                src={vignetteImage}
                alt={`${name} gallery vignette image`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
              />
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
};