import React from 'react';

export const Button04 = ({ text = "Nothing-Plop" }) => {
  // Define dot indices for the two icon variations
  const firstIconDots = [0, 2, 2, 1, 2, 0, 1, 1, 2, 2, 0, 1, 0, 2, 2, 1, 0, 2, 2, 2, 2, 0, 1, 0, 2];
  const secondIconDots = [0, 2, 2, 1, 2, 0, 1, 1, 2];

  return (
    <a href="#" className="button04 w-inline-block">
      <span className="button04_bg"></span>
      <span data-text={text} className="button04_inner">
        <span className="button04_text">{text}</span>
        <span className="button04_icon-wrap">
          <span 
            style={{ '--index-parent': 0 } as React.CSSProperties} 
            className="button04_icon"
          >
            {firstIconDots.map((index, i) => (
              <span
                key={`first-dot-${i}`}
                style={{ '--index': index }as React.CSSProperties}
                className="button04_dot"
              ></span>
            ))}
          </span>
          <span 
            style={{ '--index-parent': 1 }as React.CSSProperties} 
            className="button04_icon is-arrow"
          >
            {secondIconDots.map((index, i) => (
              <span
                key={`second-dot-${i}`}
                style={{ '--index': index }as React.CSSProperties}
                className="button04_dot"
              ></span>
            ))}
          </span>
        </span>
      </span>
    </a>
  );
};
