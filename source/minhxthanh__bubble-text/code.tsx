import React, { useState } from "react";

export const BubbleText = () => {

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const text = "Bubbbbbbbble text";

  return (
    <h2
      // Reset the hovered index when the mouse leaves the entire text container.
      onMouseLeave={() => setHoveredIndex(null)}
      className="text-center text-5xl font-thin text-indigo-300"
    >
      {text.split("").map((char, idx) => {
        // Calculate the distance from the currently hovered character.
        // This will be 0 for the hovered character, 1 for its immediate neighbors, etc.
        const distance = hoveredIndex !== null ? Math.abs(hoveredIndex - idx) : null;
        
        // Base classes for all characters, including the transition effect.
        let classes = "transition-all duration-300 ease-in-out cursor-default";
        
        // Apply different styles based on the distance from the hovered character.
        switch (distance) {
          case 0: // The character being hovered over.
            classes += " font-black text-indigo-50";
            break;
          case 1: // Immediate neighbors.
            classes += " font-medium text-indigo-200";
            break;
          case 2: // Second-degree neighbors.
            classes += " font-light"; // Inherits the color from the parent h2.
            break;
          default:
            // No additional classes for characters further away or when not hovering.
            break;
        }

        return (
          <span
            key={idx}
            // Update the state with the index of the character being hovered.
            onMouseEnter={() => setHoveredIndex(idx)}
            className={classes}
          >
            {/* Use a non-breaking space for space characters to prevent collapsing */}
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </h2>
  );
};