import React from 'react';

const styles = `
.circle-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  perspective: 1500px;
}

.circle-wrapper {
  position: absolute;
  transform-style: preserve-3d;
  pointer-events: none;
}

.circle1 {
  transform: rotateX(60deg) rotateY(20deg) rotateZ(5deg);
  top: 0;
  left: -15%;
  width: 75%;
  height: 75%;
}

.circle2 {
  transform: rotateX(-60deg) rotateY(20deg) rotateZ(5deg);
  top: -10%;
  left: 25%;
  width: 100%;
  height: 100%;
}

.circle3 {
  transform: rotateX(60deg) rotateY(-20deg) rotateZ(5deg);
  top: 20%;
  left: -5%;
  width: 80%;
  height: 80%;
}

.circle4 {
  transform: rotateX(-60deg) rotateY(-20deg) rotateZ(5deg);
  top: 15%;
  left: 20%;
  width: 100%;
  height: 100%;
}
`;

export default function CometHero() {
  return (
    <>
      <style>{styles}</style>
      <div className="circle-container">
        {/* Circle 1 - Teal theme */}
        <div className="circle-wrapper circle1">
          <svg viewBox="0 0 600 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(45 212 191)" stopOpacity="1" /> {/* teal-400 */}
                <stop offset="100%" stopColor="rgb(17 94 89)" stopOpacity="0.1" /> {/* teal-900 */}
              </linearGradient>
            </defs>
            <circle cx="300" cy="300" r="250" fill="none" stroke="url(#grad1)" strokeWidth="0.75"
                    strokeDasharray="520 1050" strokeDashoffset="20">
              <animate attributeName="stroke-dashoffset" from="20" to="1590" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Circle 2 - Orange theme */}
        <div className="circle-wrapper circle2">
          <svg viewBox="0 0 800 800" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision">
            <defs>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="-20%" stopColor="rgb(251 146 60)" stopOpacity="0.05" /> {/* orange-400 */}
                <stop offset="80%" stopColor="rgb(249 115 22)" stopOpacity="1" /> {/* orange-500 */}
              </linearGradient>
            </defs>
            <circle cx="400" cy="400" r="300" fill="none" stroke="url(#grad2)" strokeWidth="0.75"
                    strokeDasharray="900 985" strokeDashoffset="0">
              <animate attributeName="stroke-dashoffset" from="0" to="-1885" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Circle 3 - Rose theme */}
        <div className="circle-wrapper circle3">
          <svg viewBox="0 0 600 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision">
            <defs>
              <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(251 113 133)" stopOpacity="1" /> {/* rose-400 */}
                <stop offset="100%" stopColor="rgb(225 29 72)" stopOpacity="0.1" /> {/* rose-600 */}
              </linearGradient>
            </defs>
            <circle cx="300" cy="300" r="150" fill="none" stroke="url(#grad3)" strokeWidth="0.75"
                    strokeDasharray="400 542" strokeDashoffset="60">
              <animate attributeName="stroke-dashoffset" from="60" to="1002" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Circle 4 - Amber theme */}
        <div className="circle-wrapper circle4">
          <svg viewBox="0 0 800 800" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision">
            <defs>
              <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="-20%" stopColor="rgb(252 211 77)" stopOpacity="0.05" /> {/* amber-300 */}
                <stop offset="80%" stopColor="rgb(251 191 36)" stopOpacity="1" /> {/* amber-400 */}
              </linearGradient>
            </defs>
            <circle cx="400" cy="400" r="200" fill="none" stroke="url(#grad4)" strokeWidth="0.75"
                    strokeDasharray="500 756" strokeDashoffset="300">
              <animate attributeName="stroke-dashoffset" from="300" to="-956" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>
    </>
  );
}
