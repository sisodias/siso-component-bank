import React from 'react';

/**
 * LogoScroller component
 * @param {Object} props
 * @param {string[]} props.logos - Array of brand names or logos.
 * @param {string} [props.speed] - Scroll duration (e.g., "40s"). Default is "40s".
 */
const LogoScroller = ({ logos, speed = "40s" }) => {
  if (!logos || logos.length === 0) return null;

  return (
    <div className="scroller-mask group">
      <div className="scroller-track animate-scroll" style={{ "--scroll-duration": speed }}>
        <div className="scroller-set">
          {logos.map((logo, index) => (
            <span key={index} className="logo-item">{logo}</span>
          ))}
        </div>
        <div className="scroller-set" aria-hidden="true">
          {logos.map((logo, index) => (
            <span key={`dup-${index}`} className="logo-item">{logo}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoScroller;
