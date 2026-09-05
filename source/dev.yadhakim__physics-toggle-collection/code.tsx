'use client';

import React, { useState, useRef, useEffect } from 'react';
import '../../index.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue?: number;
  size?: number;
}

interface ToggleProps {
  label: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

// Liquid Mercury Toggle
const LiquidToggle: React.FC<ToggleProps> = ({ label, defaultChecked = false, onChange }) => {
  const [isOn, setIsOn] = useState(defaultChecked);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number }>>([]);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange?.(newState);
    
    // Create ripple effect
    setRipples(prev => [...prev, { id: Date.now(), x: newState ? 70 : 30 }]);
    setTimeout(() => {
      setRipples(prev => prev.slice(1));
    }, 600);
  };

  return (
    <div className="toggle-item">
      <label className="toggle-label">{label}</label>
      <div 
        className={`liquid-toggle ${isOn ? 'on' : 'off'}`}
        onClick={handleToggle}
      >
        <div className="liquid-track">
          {ripples.map(ripple => (
            <div 
              key={ripple.id} 
              className="liquid-ripple"
              style={{ left: `${ripple.x}%` }}
            />
          ))}
        </div>
        <div className="liquid-blob" />
      </div>
    </div>
  );
};

// Electric Arc Toggle
const ElectricToggle: React.FC<ToggleProps> = ({ label, defaultChecked = false, onChange }) => {
  const [isOn, setIsOn] = useState(defaultChecked);
  const [sparks, setSparks] = useState<Particle[]>([]);

  useEffect(() => {
    if (!isOn) return;
    
    const interval = setInterval(() => {
      setSparks(prev => {
        const updated = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.05
          }))
          .filter(p => p.life > 0);

        // Add new sparks
        if (Math.random() > 0.7) {
          updated.push({
            x: 50,
            y: 50,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1
          });
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isOn]);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange?.(newState);
    setSparks([]);
  };

  return (
    <div className="toggle-item">
      <label className="toggle-label">{label}</label>
      <div 
        className={`electric-toggle ${isOn ? 'on' : 'off'}`}
        onClick={handleToggle}
      >
        <div className="electric-track">
          {isOn && (
            <>
              <svg className="lightning-bolt" viewBox="0 0 100 100">
                <path 
                  className="bolt-path"
                  d="M 10 50 L 30 45 L 25 55 L 45 50 L 35 60 L 55 55 L 50 65 L 70 60 L 65 70 L 90 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              {sparks.map((spark, i) => (
                <div
                  key={i}
                  className="electric-spark"
                  style={{
                    left: `${spark.x}%`,
                    top: `${spark.y}%`,
                    opacity: spark.life
                  }}
                />
              ))}
            </>
          )}
        </div>
        <div className="electric-knob" />
      </div>
    </div>
  );
};

// Fire & Ice Toggle
const FireIceToggle: React.FC<ToggleProps> = ({ label, defaultChecked = false, onChange }) => {
  const [isOn, setIsOn] = useState(defaultChecked);
  const [flames, setFlames] = useState<Particle[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlames(prev => {
        const updated = prev
          .map(p => ({
            ...p,
            y: p.y + p.vy,
            x: p.x + p.vx,
            life: p.life - 0.03,
            size: (p.size || 5) * 0.98
          }))
          .filter(p => p.life > 0);

        // Add new flames/ice
        if (Math.random() > 0.5) {
          updated.push({
            x: isOn ? 70 + Math.random() * 20 : 10 + Math.random() * 20,
            y: 80,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -2 - Math.random() * 2,
            life: 1,
            size: 5 + Math.random() * 10
          });
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isOn]);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange?.(newState);
  };

  return (
    <div className="toggle-item">
      <label className="toggle-label">{label}</label>
      <div 
        className={`fireice-toggle ${isOn ? 'on' : 'off'}`}
        onClick={handleToggle}
      >
        <div className="fireice-track">
          {flames.map((flame, i) => (
            <div
              key={i}
              className={isOn ? 'flame-particle' : 'ice-particle'}
              style={{
                left: `${flame.x}%`,
                top: `${flame.y}%`,
                opacity: flame.life,
                width: `${flame.size}px`,
                height: `${flame.size}px`
              }}
            />
          ))}
        </div>
        <div className="fireice-knob" />
      </div>
    </div>
  );
};

// Cosmic Wormhole Toggle
const CosmicToggle: React.FC<ToggleProps> = ({ label, defaultChecked = false, onChange }) => {
  const [isOn, setIsOn] = useState(defaultChecked);
  const [stars, setStars] = useState<Particle[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStars(prev => {
        const updated = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx * (isOn ? 1 : -1),
            y: p.y + p.vy,
            life: p.life - 0.02
          }))
          .filter(p => p.life > 0);

        // Add new stars
        if (Math.random() > 0.6) {
          updated.push({
            x: 50,
            y: 50,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: 1,
            hue: Math.random() * 360
          });
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isOn]);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange?.(newState);
  };

  return (
    <div className="toggle-item">
      <label className="toggle-label">{label}</label>
      <div 
        className={`cosmic-toggle ${isOn ? 'on' : 'off'}`}
        onClick={handleToggle}
      >
        <div className="cosmic-track">
          <div className="wormhole" />
          {stars.map((star, i) => (
            <div
              key={i}
              className="star-particle"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                opacity: star.life,
                filter: `hue-rotate(${star.hue}deg)`
              }}
            />
          ))}
        </div>
        <div className="cosmic-orb" />
      </div>
    </div>
  );
};

// Retro Arcade Toggle
const RetroToggle: React.FC<ToggleProps> = ({ label, defaultChecked = false, onChange }) => {
  const [isOn, setIsOn] = useState(defaultChecked);
  const [pixels, setPixels] = useState<Array<{ x: number; y: number; active: boolean }>>([]);

  useEffect(() => {
    // Generate pixel grid
    const newPixels = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 4; j++) {
        newPixels.push({ x: i * 12.5, y: j * 25, active: false });
      }
    }
    setPixels(newPixels);
  }, []);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange?.(newState);

    // Animate pixels
    pixels.forEach((_, index) => {
      setTimeout(() => {
        setPixels(prev => 
          prev.map((p, i) => i === index ? { ...p, active: newState } : p)
        );
      }, index * 20);
    });
  };

  return (
    <div className="toggle-item">
      <label className="toggle-label">{label}</label>
      <div 
        className={`retro-toggle ${isOn ? 'on' : 'off'}`}
        onClick={handleToggle}
      >
        <div className="retro-track">
          {pixels.map((pixel, i) => (
            <div
              key={i}
              className={`pixel ${pixel.active ? 'active' : ''}`}
              style={{
                left: `${pixel.x}%`,
                top: `${pixel.y}%`
              }}
            />
          ))}
        </div>
        <div className="retro-knob" />
      </div>
    </div>
  );
};

// Crystal Refraction Toggle
const CrystalToggle: React.FC<ToggleProps> = ({ label, defaultChecked = false, onChange }) => {
  const [isOn, setIsOn] = useState(defaultChecked);
  const [shards, setShards] = useState<Particle[]>([]);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange?.(newState);

    // Create shattering effect
    if (newState) {
      const newShards = [];
      for (let i = 0; i < 12; i++) {
        newShards.push({
          x: 50,
          y: 50,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 1
        });
      }
      setShards(newShards);

      setTimeout(() => {
        setShards([]);
      }, 800);
    }
  };

  return (
    <div className="toggle-item">
      <label className="toggle-label">{label}</label>
      <div 
        className={`crystal-toggle ${isOn ? 'on' : 'off'}`}
        onClick={handleToggle}
      >
        <div className="crystal-track">
          {shards.map((shard, i) => (
            <div
              key={i}
              className="crystal-shard"
              style={{
                left: `${shard.x}%`,
                top: `${shard.y}%`,
                transform: `translate(-50%, -50%) translate(${shard.vx * 10}px, ${shard.vy * 10}px) rotate(${i * 30}deg)`,
                opacity: shard.life
              }}
            />
          ))}
        </div>
        <div className="crystal-gem" />
      </div>
    </div>
  );
};

// Sakura Petals Toggle
const SakuraToggle: React.FC<ToggleProps> = ({ label, defaultChecked = false, onChange }) => {
  const [isOn, setIsOn] = useState(defaultChecked);
  const [petals, setPetals] = useState<Particle[]>([]);

  useEffect(() => {
    if (!isOn) return;

    const interval = setInterval(() => {
      setPetals(prev => {
        const updated = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.015
          }))
          .filter(p => p.life > 0);

        // Add new petals
        if (Math.random() > 0.7) {
          updated.push({
            x: 70 + Math.random() * 20,
            y: 20,
            vx: -0.5 - Math.random() * 0.5,
            vy: 0.5 + Math.random() * 0.5,
            life: 1
          });
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isOn]);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange?.(newState);
  };

  return (
    <div className="toggle-item">
      <label className="toggle-label">{label}</label>
      <div 
        className={`sakura-toggle ${isOn ? 'on' : 'off'}`}
        onClick={handleToggle}
      >
        <div className="sakura-track">
          {petals.map((petal, i) => (
            <div
              key={i}
              className="sakura-petal"
              style={{
                left: `${petal.x}%`,
                top: `${petal.y}%`,
                opacity: petal.life
              }}
            >
              🌸
            </div>
          ))}
        </div>
        <div className="sakura-blossom" />
      </div>
    </div>
  );
};

// Cyberpunk Glitch Toggle
const GlitchToggle: React.FC<ToggleProps> = ({ label, defaultChecked = false, onChange }) => {
  const [isOn, setIsOn] = useState(defaultChecked);
  const [glitching, setGlitching] = useState(false);

  const handleToggle = () => {
    setGlitching(true);
    
    setTimeout(() => {
      const newState = !isOn;
      setIsOn(newState);
      onChange?.(newState);
    }, 200);

    setTimeout(() => {
      setGlitching(false);
    }, 600);
  };

  return (
    <div className="toggle-item">
      <label className="toggle-label">{label}</label>
      <div 
        className={`glitch-toggle ${isOn ? 'on' : 'off'} ${glitching ? 'glitching' : ''}`}
        onClick={handleToggle}
      >
        <div className="glitch-track">
          <div className="scan-line" />
          <div className="glitch-layer glitch-r" />
          <div className="glitch-layer glitch-g" />
          <div className="glitch-layer glitch-b" />
        </div>
        <div className="glitch-knob">
          <span className="glitch-text">{isOn ? '1' : '0'}</span>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function PhysicsToggleShowcase() {
  return (
    <div className="toggle-showcase">
      <div className="toggles-grid">
        <LiquidToggle label="Liquid Mercury" defaultChecked={true} />
        <ElectricToggle label="Electric Arc" defaultChecked={false} />
        <FireIceToggle label="Fire & Ice" defaultChecked={true} />
        <CosmicToggle label="Cosmic Wormhole" defaultChecked={false} />
        <RetroToggle label="Retro Arcade" defaultChecked={true} />
        <CrystalToggle label="Crystal Refraction" defaultChecked={false} />
        <SakuraToggle label="Sakura Petals" defaultChecked={true} />
        <GlitchToggle label="Cyberpunk Glitch" defaultChecked={false} />
      </div>
    </div>
  );
}