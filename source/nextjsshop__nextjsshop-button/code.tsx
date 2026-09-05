import React from 'react';

export const Button01 = () => {
  return (
    <a href="#" className="button01">
      <span className="button01_bg">
        <span className="button01_bg-mid"></span>
        <span className="button01_bg-right">
          {[...Array(25)].map((_, index) => (
            <span
              key={`pixel-${index}`}
              style={{ '--index': Math.floor(Math.random() * 4) } as React.CSSProperties}
              className="button01_bg-pixel"
            ></span>
          ))}
        </span>
        <span className="button01_bg-right-overlay">
          {[...Array(11)].map((_, index) => (
            <span
              key={`overlay-${index}`}
              style={{ '--index': 4 + Math.floor(Math.random() * 4) }as React.CSSProperties}
              className="button01_bg-pixel"
            ></span>
          ))}
        </span>
      </span>
      <span data-text="Nextjsshop" className="button01_inner">
        <span className="button01_text">Nextjsshop</span>
      </span>
    </a>
  );
};
