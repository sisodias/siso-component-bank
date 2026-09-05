import React from 'react';

export const Component = () => {

  return (
    <div className="pattern-wrapper">
        <div className="ocean-backdrop">
          <div className="island-backdrop"></div>
        </div>
        <div className="snow"></div>
        {/* SVG filter definition */}
        <svg height="0" width="0" style={{ position: 'absolute' }}>
          <filter id="handDrawnNoise">
            <feTurbulence result="noise" numOctaves="5" baseFrequency="0.0065" type="fractalNoise">
              {/* This animate tag creates a subtle, slow-moving water effect by animating the turbulence frequency */}
              <animate attributeName="baseFrequency" dur="60s" values="0.0065;0.008;0.0065" repeatCount="indefinite"></animate>
            </feTurbulence>
            <feDisplacementMap yChannelSelector="G" xChannelSelector="R" scale="900" in2="noise" in="SourceGraphic"></feDisplacementMap>
          </filter>
        </svg>
        {/* Example content */}
        <div className="content">
          <div>
            <h1>Hand-Drawn Arctic Map</h1>
            <div className="card">
              This background uses a cool, frosty color palette and a snowfall effect to create the feeling of a frozen, arctic landscape.
            </div>
          </div>
        </div>
      </div>
  );
};
