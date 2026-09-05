import React from 'react';

/**
 * A self-contained 3D rotating planes animation component.
 * This component replicates a CSS animation using React and Tailwind CSS.
 * The keyframes for the animation are defined in a <style> tag to ensure
 * it works without any external configuration.
 */
const RotatingPlanes = () => {
  // An array to dynamically generate the four rotating plane elements.
  const planes = [1, 2, 3, 4];

  return (
    // The main container that sets up the 3D perspective.
    // Equivalent to the original `.box` class.
    <div className="relative h-[120px] w-[80px] [transform-style:preserve-3d] [transform:perspective(1000px)_rotateY(-45deg)]">
      
      {/* This div is the rotating element that contains the planes. */}
      {/* It uses an arbitrary property to apply the animation defined in the <style> tag below. */}
      <div className="absolute inset-0 [transform-style:preserve-3d] [animation:spin-3d_5s_linear_infinite]">
        
        {/* Map over the planes array to create each span element. */}
        {planes.map((i) => (
          <span
            key={i}
            // These are the individual planes.
            // The transform here uses the '--i' custom property to set the initial rotation.
            className="absolute inset-0 rounded-[20px] bg-gradient-to-t from-[#f1f1f1] to-[#bbb] [transform-style:preserve-3d] [transform:rotateX(calc(var(--i)*45deg))]"
            
            // The CSS custom property `--i` is passed via the inline style prop.
            // This is the standard React way to handle dynamic CSS variables for styling.
            style={{ '--i': i }}
          ></span>
        ))}
      </div>

      {/* Shadow Element */}
      {/* In React, it's standard practice to use a real element for shadows */}
      {/* instead of a CSS pseudo-element like `::before`. */}
      <div className="absolute -bottom-[110px] left-0 h-[150px] w-[90px] bg-black/60 opacity-50 blur-[30px] [transform:rotateX(90deg)]"></div>
    </div>
  );
};


/**
 * Main App component to display the RotatingPlanes animation.
 * It sets up the centered layout and background color.
 */
export default function App() {
  // CSS keyframes are defined here and injected into the document head.
  // This makes the component self-contained and avoids tailwind.config.js edits.
  const animationKeyframes = `
    @keyframes spin-3d {
      from {
        transform: perspective(1000px) rotateX(0deg);
      }
      to {
        transform: perspective(1000px) rotateX(360deg);
      }
    }
  `;
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#854775]">
      <style>{animationKeyframes}</style>
      <RotatingPlanes />
    </div>
  );
}
