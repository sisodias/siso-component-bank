import React from 'react';

export const Button05 = () => {
  // Function to generate dot elements for the icons
  const renderDots = () => {
    const dotValues = [2, 1, 0, 1, 2];
    return dotValues.map((value, index) => (
      <span 
        key={`dot-${index}`} 
        className="button05_dot"
        style={{ '--index': value }as React.CSSProperties} 
      ></span>
    ));
  };

  // Function to generate icon elements with dots
  const renderIcons = () => {
    return [3, 2, 1, 0].map((indexParent) => (
      <span 
        key={`icon-${indexParent}`} 
        className="button05_icon"
        style={{ '--index-parent': indexParent }as React.CSSProperties} 
      >
        {renderDots()}
      </span>
    ));
  };

  return (
    <a href="#" className="button05 w-inline-block">
      <span className="button05_bg"></span>
      <span 
        data-text="Arrow-Dots" 
        className="button05_inner"
      >
        <span className="button05_text">Arrow-Dots</span>
        <span className="button05_icon-wrap">
          {renderIcons()}
        </span>
      </span>
    </a>
  );
};
