import React from 'react';

/**
 * VerticalLogoScroller component
 * @param {Object} props
 * @param {string[]} props.logos - Array of brand names or logos.
 * @param {string} [props.speed] - Scroll duration (e.g., "40s"). Default is "40s".
 * @param {string} [props.direction] - Scroll direction ("up" or "down"). Default is "up".
 */
const VerticalLogoScroller = ({ logos, speed = "40s", direction = "up" }) => {
  if (!logos || logos.length === 0) return null;

  const animationClass = direction === 'down'
    ? 'animate-scroll-vertical-reverse'
    : 'animate-scroll-vertical';

  return (
    <div className="scroller-container group">
      <div className={`scroller-track ${animationClass}`} style={{ "--scroll-duration": speed }}>
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

export default VerticalLogoScroller;
