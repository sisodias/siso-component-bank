import React from 'react';

// --- CONFIGURATION BLOCK for Easy Remixing ---
// ADJUST THESE VALUES TO EASILY CUSTOMIZE THE LOOK AND FEEL.
export const CONFIG = {
  // Colors (use RGB for ease in rgba() functions)
  primaryGlow: '100, 100, 255', // Main Blue Glow
  secondaryGlow: '255, 100, 200', // Secondary Pink/Magenta Glow
  gridColor: '150, 150, 150', // Grid line color

  // Animation Controls
  glitchSpeed: '5s', // How fast the distortion changes
  glitchIntensity: 0.05, // How aggressive the grid distortion is
  gridDensity: 15, // Spacing of the grid lines
};

// Inline style element with keyframes and CSS variables
const StyleBlock = () => (
  <style>
    {`
      :root {
        --primary-glow: ${CONFIG.primaryGlow};
        --secondary-glow: ${CONFIG.secondaryGlow};
        --grid-color: ${CONFIG.gridColor};
        --glitch-speed: ${CONFIG.glitchSpeed};
        --glitch-intensity: ${CONFIG.glitchIntensity};
        --grid-density: ${CONFIG.gridDensity}px;
      }

      @keyframes glitchAnimation {
        0% { filter: url(#glitchFilter); }
        50% { filter: url(#glitchFilter); }
        100% { filter: url(#glitchFilter); }
      }

      @keyframes gridPan {
        from { background-position: 0 0; }
        to { background-position: 100% 100%; }
      }

      .volumetric-container {
        position: relative;
        overflow: hidden;
        background: radial-gradient(circle at center, #0a0a0a 0%, #000000 100%);
        animation: glitchAnimation var(--glitch-speed) linear infinite alternate;
        height: 100vh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        color: #e6eef8;
      }

      .grid-layer {
        position: absolute;
        inset: 0;
        z-index: 1;
        opacity: 0.10;
        pointer-events: none;
        background-image: repeating-radial-gradient(
          circle at center,
          rgba(var(--grid-color), 0.5) 0px,
          transparent 1px,
          transparent var(--grid-density)
        );
        background-size: var(--grid-density) var(--grid-density);
        animation: gridPan 60s linear infinite;
      }

      .glow-flare {
        position: absolute;
        inset: -200px;
        z-index: 2;
        pointer-events: none;
        mix-blend-mode: color-dodge;
        filter: blur(100px);
        opacity: 0.5;
        background: radial-gradient(
          circle at 50% 50%,
          rgba(var(--primary-glow), 0.2) 0%,
          rgba(var(--secondary-glow), 0.1) 20%,
          transparent 70%
        );
        transform: scale(1.5);
      }

      .foreground {
        position: relative;
        z-index: 50;
        text-align: center;
        max-width: 56rem;
        padding: 2rem;
        border-radius: 14px;
      }

      .hero-title {
        margin: 0 0 0.75rem 0;
        font-weight: 800;
        line-height: 1;
        font-size: 2.25rem;
      }
      @media(min-width:640px){ .hero-title{ font-size:3rem } }
      @media(min-width:1024px){ .hero-title{ font-size:4rem } }

      .hero-gradient {
        background: linear-gradient(90deg, #fff 0%, rgba(var(--primary-glow),1) 50%, rgba(var(--secondary-glow),1) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        display: inline-block;
      }

      .hero-sub {
        color: rgba(230,238,248,0.85);
        max-width: 48rem;
        margin: 1rem auto 1.5rem auto;
        font-size: 1rem;
      }

      .cta-row { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }

      .btn-primary {
        padding: 0.75rem 1.5rem;
        border-radius: 999px;
        color: white;
        background: linear-gradient(90deg, rgba(var(--primary-glow),1), rgba(var(--secondary-glow),1));
        box-shadow: 0 18px 40px rgba(59,20,120,0.18);
        border: none;
        cursor: pointer;
        font-weight: 700;
        transition: transform .18s ease, box-shadow .18s ease, background .18s;
      }
      .btn-primary:hover { transform: translateY(-3px); }
      .btn-ghost {
        padding: 0.75rem 1.5rem;
        border-radius: 999px;
        color: white;
        background: transparent;
        border: 2px solid rgba(255,255,255,0.18);
        cursor: pointer;
        font-weight: 700;
        transition: background .18s ease, border-color .18s;
      }
      .vignette {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 60;
        box-shadow: inset 0 0 150px rgba(0,0,0,0.8), inset 0 0 80px rgba(0,0,0,0.5);
      }

      button:focus { outline: none; box-shadow: 0 0 0 6px rgba(255,255,255,0.06); }
    `}
  </style>
);

// Component
export default function VolumetricGlitchHero({
  title = 'Volumetric Glitch',
  subtitle = 'Designing at the intersection of 3D fidelity and dynamic user experience. This is excellence, redefined.',
  primaryCTA = { label: 'Initiate Launch', onClick: () => {} },
  secondaryCTA = { label: 'View Dimensional Map', onClick: () => {} },
  config = CONFIG,
}) {
  // allow runtime overrides
  React.useEffect(() => {
    // update CSS variables when config changes
    if (config) {
      const root = document.documentElement;
      root.style.setProperty('--primary-glow', config.primaryGlow);
      root.style.setProperty('--secondary-glow', config.secondaryGlow);
      root.style.setProperty('--grid-color', config.gridColor);
      root.style.setProperty('--glitch-speed', config.glitchSpeed);
      root.style.setProperty('--glitch-intensity', String(config.glitchIntensity));
      root.style.setProperty('--grid-density', `${config.gridDensity}px`);
    }
  }, [config]);

  // compute values for SVG filter animate values based on config
  const baseFrequencyX = config?.glitchIntensity ?? CONFIG.glitchIntensity;
  const baseFrequencyY = (config?.glitchIntensity ?? CONFIG.glitchIntensity) / 2;
  const filterId = 'glitchFilter';

  return (
    <div className="volumetric-container" role="region" aria-label="Volumetric glitch background hero">
      <StyleBlock />

      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${baseFrequencyX} ${baseFrequencyY}`}
              numOctaves="2"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values={`${baseFrequencyX} ${baseFrequencyY}; ${baseFrequencyX * 1.5} ${baseFrequencyY * 1.5}; ${baseFrequencyX} ${baseFrequencyY}`}
                dur={config?.glitchSpeed ?? CONFIG.glitchSpeed}
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
          </filter>
        </defs>
      </svg>

      <div className="grid-layer" style={{ filter: `url(#${filterId})` }} aria-hidden="true" />
      <div className="glow-flare" aria-hidden="true" />

      <div className="foreground">
        <h1 className="hero-title">
          <span className="hero-gradient">{title}</span>
        </h1>

        <p className="hero-sub" role="doc-subtitle">{subtitle}</p>

        <div className="cta-row" role="group" aria-label="Call to actions">
          <button
            className="btn-primary"
            onClick={primaryCTA.onClick}
            aria-label={primaryCTA.label}
          >
            {primaryCTA.label}
          </button>
          <button
            className="btn-ghost"
            onClick={secondaryCTA.onClick}
            aria-label={secondaryCTA.label}
          >
            {secondaryCTA.label}
          </button>
        </div>
      </div>

      <div className="vignette" aria-hidden="true" />
    </div>
  );
}
