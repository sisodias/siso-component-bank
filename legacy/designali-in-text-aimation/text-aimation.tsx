import React from 'react';

const TextAnimation = ({ text, size = '20vmin', color = '#f43f5e', animationDuration = '1200ms'  }) => {
  const shadowColors = [
    `${color}40`,  
    `${color}33`,  
    `${color}26`,  
    `${color}1A`  
  ];
  const shadowDistanceStep = '0.033333em';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        margin: 0, 
        textRendering: 'optimizeLegibility',
        overflow: 'hidden',
        boxSizing: 'border-box',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <div 
        id="text"
        style={{
          animation: `layerize cubic-bezier(0.4, 0.0, 0.2, 1) ${animationDuration} 200ms infinite alternate`,
          opacity: 0,
          width: '100%',
          color: color, 
          font: `${size} "Geist", sans-serif`,
          cursor: 'default',
          userSelect: 'none',
          textAlign: 'center',
          textShadow: shadowColors
            .map((shadowColor, i) => `${shadowDistanceStep} * ${i + 1} * 1 ${shadowDistanceStep} * ${i + 1} * 1 ${shadowColor}`)
            .join(', ')
        }}
      >
      <span className="italic tracking-tighter font-bold">
        {text}
        </span>
      </div>
      <style jsx>{`
        @keyframes layerize {
          0% {
            opacity: 0;
            transform: translate(0, 0);
            text-shadow: ${shadowColors
              .map(() => '0 0 transparent')
              .join(', ')};
          }
          100% {
            opacity: 1;
            transform: translate(calc(${shadowDistanceStep} * ${shadowColors.length} / -2), calc(${shadowDistanceStep} * ${shadowColors.length} / -2));
            text-shadow: ${shadowColors
              .map((shadowColor, i) => `calc(${shadowDistanceStep} * ${i + 1} * 1) calc(${shadowDistanceStep} * ${i + 1} * 1) ${shadowColor}`)
              .join(', ')};
          }
        }
      `}</style>
    </div>
  );
};

export { TextAnimation };