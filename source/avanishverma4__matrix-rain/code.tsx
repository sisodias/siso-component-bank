import React from 'react';

export default function MatrixRain() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      background: '#000',
      overflow: 'hidden',
      display: 'flex'
    }}>
      {[...Array(5)].map((_, patternIndex) => (
        <div
          key={patternIndex}
          style={{
            position: 'relative',
            width: '1000px',
            height: '100%',
            flexShrink: 0
          }}
        >
          {[...Array(40)].map((_, colIndex) => (
            <MatrixColumn key={colIndex} index={colIndex} />
          ))}
        </div>
      ))}
    </div>
  );
}

function MatrixColumn({ index }) {
  const delays = [-2.5, -3.2, -1.8, -2.9, -1.5, -3.8, -2.1, -2.7, -3.4, -1.9, -3.6, -2.3, -3.1, -2.6, -3.7, -2.8, -3.3, -2.2, -3.9, -2.4, -1.7, -3.5, -2, -4, -1.6, -3, -3.8, -2.5, -3.2, -2.7, -1.8, -3.6, -2.1, -3.4, -2.8, -3.7, -2.3, -1.9, -3.5, -2.6];
  const durations = [3, 4, 2.5, 3.5, 3, 4.5, 2.8, 3.2, 3.8, 2.7, 4.2, 3.1, 3.6, 2.9, 4.1, 3.3, 3.7, 2.6, 4.3, 3.4, 2.4, 3.9, 3, 4.4, 2.3, 3.5, 4, 2.8, 3.6, 3.2, 2.7, 4.1, 3.1, 3.7, 2.9, 4.2, 3.3, 2.5, 3.8, 3.4];
  
  const characters = [
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン123456789",
    "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴァィゥェォャュョッABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロヲン0987654321",
    "ンヲロヨモホノトソコオレメヘネテセケエルユムフヌツスクウリミヒニチシキイワラヤマハナタサカア",
    "ガザダバパギジヂビピグズヅブプゲゼデベペゴゾドボポヴァィゥェォャュョッ!@#$%^&*()_+-=[]{}|;:,.<>?"
  ];
  
  let charSet = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
  if (index % 2 === 1) charSet = characters[0];
  if (index % 2 === 0) charSet = characters[1];
  if (index % 3 === 0) charSet = characters[2];
  if (index % 4 === 0) charSet = characters[3];
  if (index % 5 === 0) charSet = characters[4];
  
  return (
    <div
      style={{
        position: 'absolute',
        top: '-100%',
        left: `${index * 25}px`,
        width: '20px',
        height: '100%',
        fontSize: '16px',
        lineHeight: '18px',
        fontWeight: 'bold',
        animation: `fall ${durations[index]}s linear infinite`,
        animationDelay: `${delays[index]}s`,
        whiteSpace: 'nowrap'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'linear-gradient(to bottom, #ffffff 0%, #ffffff 5%, #00ff41 10%, #00ff41 20%, #00dd33 30%, #00bb22 40%, #009911 50%, #007700 60%, #005500 70%, #003300 80%, rgba(0, 255, 65, 0.5) 90%, transparent 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        writingMode: 'vertical-lr',
        letterSpacing: '1px',
        textRendering: 'optimizeLegibility',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}>
        {charSet}
      </div>
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10%);
            opacity: 1;
          }
          100% {
            transform: translateY(200%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}