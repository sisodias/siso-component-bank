import React from 'react';

export const Button03 = ({ text = "Pixel-Broke" }) => {
  // Define the index patterns for left and right pixels
  const leftPixelIndices = [0, 0, 1, 3, 4, 0, 0, 2, 0, 0, 0, 1];
  const rightPixelIndices = [3, 0, 0, 0, 4, 0, 0, 2, 1, 3, 0, 0];

  return (
    <a href="#" className="button03 w-inline-block">
      <span className="button03_bg">
        <span className="button03_bg-left">
          {leftPixelIndices.map((index, i) => (
            <span
              key={`left-${i}`}
              style={{ '--index': index }as React.CSSProperties}
              className="button03_bg-pixel"
            ></span>
          ))}
        </span>
        <span className="button03_bg-mid"></span>
        <span className="button03_bg-right">
          {rightPixelIndices.map((index, i) => (
            <span
              key={`right-${i}`}
              style={{ '--index': index }as React.CSSProperties}
              className="button03_bg-pixel"
            ></span>
          ))}
        </span>
      </span>
      <span data-text={text} className="button03_inner">
        <span className="button03_text">{text}</span>
      </span>
    </a>
  );
};
