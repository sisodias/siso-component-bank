import React from 'react';
/**
 * A modern, reusable loader component.
 * It displays three pulsing dots.
 */
const Loader = () => {
  return (
    <div className="loader-container">
      <div
        className="loader-dot animate-pulse-dot"
        style={{ animationDelay: '0s' }}
      ></div>
      <div
        className="loader-dot animate-pulse-dot"
        style={{ animationDelay: '0.2s' }}
      ></div>
      <div
        className="loader-dot animate-pulse-dot"
        style={{ animationDelay: '0.4s' }}
      ></div>
    </div>
  );
};

export default Loader;