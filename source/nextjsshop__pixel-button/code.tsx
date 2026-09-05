import React from 'react';

export const Button02 = ({ text = "Pixel-Tetris" }) => {
  return (
    <a href="#" className="button02 w-inline-block">
      <span className="button02_bg">
        <span className="button02_bg-left">
          {[...Array(8)].map((_, index) => (
            <span key={`left-${index}`} className="button02_bg-pixel"></span>
          ))}
        </span>
        <span className="button02_bg-mid"></span>
        <span className="button02_bg-right">
          {[...Array(8)].map((_, index) => (
            <span key={`right-${index}`} className="button02_bg-pixel"></span>
          ))}
        </span>
      </span>
      <span data-text={text} className="button02_inner">
        <span className="button02_text">{text}</span>
      </span>
    </a>
  );
};
