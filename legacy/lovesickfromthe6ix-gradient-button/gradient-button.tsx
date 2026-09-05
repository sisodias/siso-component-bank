// AdvancedButton.jsx
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

// Film grain shader
const FilmGrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    intensity: { value: 0 },
    grainSize: { value: 1.5 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float intensity;
    uniform float grainSize;
    varying vec2 vUv;
    
    float random(vec2 p) {
      return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      
      // Film grain
      vec2 grainUV = vUv * grainSize;
      float grain = random(grainUV + time * 0.1);
      grain = (grain - 0.5) * intensity;
      
      // Add grain to color
      color.rgb += grain;
      
      // Subtle vignette
      float vignette = 1.0 - length(vUv - 0.5) * 0.3 * intensity;
      color.rgb *= vignette;
      
      gl_FragColor = color;
    }
  `
};

// Enhanced gradient distortion shader with bloom preparation
const GradientDistortionShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    distortion: { value: 0 },
    mouseX: { value: 0.5 },
    mouseY: { value: 0.5 },
    gradientShift: { value: 0 },
    bloomThreshold: { value: 0.8 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float distortion;
    uniform float mouseX;
    uniform float mouseY;
    uniform float gradientShift;
    uniform float bloomThreshold;
    varying vec2 vUv;
    
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
      vec2 uv = vUv;
      vec2 mouse = vec2(mouseX, mouseY);
      float dist = distance(uv, mouse);
      
      // Wave distortion
      float wave = sin(dist * 10.0 - time * 2.0) * distortion;
      uv += normalize(uv - mouse) * wave * 0.02;
      
      // Get base color
      vec4 color = texture2D(tDiffuse, uv);
      
      // Animated gradient overlay
      float gradientAngle = time * 0.5 + gradientShift;
      float gradientPos = uv.x * cos(gradientAngle) + uv.y * sin(gradientAngle);
      vec3 gradientColor = hsv2rgb(vec3(gradientPos + time * 0.1, 0.7, 1.0));
      
      // Mix gradient with original color
      color.rgb = mix(color.rgb, gradientColor, 0.3 * distortion);
      
      // Enhance bright areas for bloom
      float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      if (brightness > bloomThreshold * (1.0 - distortion * 0.3)) {
        color.rgb *= 1.0 + distortion * 0.5;
      }
      
      // Chromatic aberration with gradient influence
      float r = texture2D(tDiffuse, uv + vec2(0.002, 0.0) * distortion).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - vec2(0.002, 0.0) * distortion).b;
      
      vec3 finalColor = vec3(r, g, b);
      finalColor = mix(finalColor, gradientColor, 0.2 * distortion);
      
      gl_FragColor = vec4(finalColor, color.a);
    }
  `
};

export const AdvancedButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  gradientType = 'animated',
  className = ''
}) => {
  const buttonRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const rippleRef = useRef(null);
  const glowRef = useRef(null);
  const gradientRef = useRef(null);
  const borderGradientRef = useRef(null);
  const filmGrainRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  // Three.js references
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const composerRef = useRef(null);
  const distortionPassRef = useRef(null);
  const bloomPassRef = useRef(null);
  const filmGrainPassRef = useRef(null);
  const filmPassRef = useRef(null);
  const meshRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // Post-processing setup
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Enhanced bloom effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.0,  // Initial strength (will animate)
      0.6,  // radius
      0.7   // threshold
    );
    bloomPassRef.current = bloomPass;
    composer.addPass(bloomPass);

    // Gradient distortion effect
    const distortionPass = new ShaderPass(GradientDistortionShader);
    distortionPassRef.current = distortionPass;
    composer.addPass(distortionPass);

    // Film grain effect
    const filmGrainPass = new ShaderPass(FilmGrainShader);
    filmGrainPassRef.current = filmGrainPass;
    composer.addPass(filmGrainPass);

    // Built-in film pass for additional effects
    const filmPass = new FilmPass(
      0.0,   // noise intensity (will animate)
      0.0,   // scanline intensity
      648,   // scanline count
      false  // grayscale
    );
    filmPassRef.current = filmPass;
    composer.addPass(filmPass);

    // Create advanced gradient mesh with bloom-ready materials
    const geometry = new THREE.PlaneGeometry(2, 2, 32, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(0x6366f1) },
        color2: { value: new THREE.Color(0x8b5cf6) },
        color3: { value: new THREE.Color(0xec4899) },
        time: { value: 0 },
        mouseX: { value: 0.5 },
        mouseY: { value: 0.5 },
        hover: { value: 0 },
        bloomStrength: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float time;
        uniform float hover;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Subtle vertex displacement on hover
          float displacement = sin(pos.x * 10.0 + time) * sin(pos.y * 10.0 + time) * 0.02 * hover;
          pos.z += displacement;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform float time;
        uniform float mouseX;
        uniform float mouseY;
        uniform float hover;
        uniform float bloomStrength;
        varying vec2 vUv;
        
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          vec2 uv = vUv;
          vec2 mouse = vec2(mouseX, mouseY);
          
          // Dynamic gradient based on mouse position
          float mouseDist = distance(uv, mouse);
          float mouseInfluence = 1.0 - smoothstep(0.0, 0.5, mouseDist);
          
          // Animated noise-based gradient
          float noise = snoise(uv * 3.0 + time * 0.2) * 0.5 + 0.5;
          float gradientNoise = snoise(uv * 2.0 - time * 0.1) * 0.5 + 0.5;
          
          // Three-color gradient with animation
          vec3 gradient = mix(color1, color2, uv.x + sin(time * 0.5) * 0.2);
          gradient = mix(gradient, color3, uv.y + cos(time * 0.3) * 0.2);
          
          // Add noise variation
          gradient = mix(gradient, color3, noise * 0.3);
          
          // Mouse-reactive gradient shift
          vec3 mouseGradient = mix(color2, color3, mouseInfluence);
          gradient = mix(gradient, mouseGradient, hover * 0.5);
          
          // Radial gradient overlay
          float radial = 1.0 - length(uv - 0.5) * 2.0;
          radial = smoothstep(0.0, 1.0, radial);
          gradient *= 0.8 + radial * 0.2;
          
          // Animated shimmer effect
          float shimmer = sin(uv.x * 20.0 - time * 3.0) * sin(uv.y * 20.0 + time * 2.0);
          shimmer = shimmer * 0.05 * hover;
          gradient += shimmer;
          
          // Bloom enhancement on hover
          float bloomBoost = 1.0 + bloomStrength * mouseInfluence * 2.0;
          gradient *= bloomBoost;
          
          // Add hot spots for bloom
          float hotSpot = smoothstep(0.3, 0.0, mouseDist) * hover;
          gradient += vec3(hotSpot * 0.5);
          
          gl_FragColor = vec4(gradient, 1.0);
        }
      `,
            transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const time = performance.now() * 0.001;
      
      // Update material uniforms
      if (meshRef.current && meshRef.current.material) {
        meshRef.current.material.uniforms.time.value = time;
        meshRef.current.material.uniforms.hover.value = gsap.utils.interpolate(
          meshRef.current.material.uniforms.hover.value,
          isHovered ? 1 : 0,
          0.1
        );
        meshRef.current.material.uniforms.bloomStrength.value = gsap.utils.interpolate(
          meshRef.current.material.uniforms.bloomStrength.value,
          isHovered ? 1 : 0,
          0.1
        );
      }
      
      // Animate bloom intensity
      if (bloomPassRef.current) {
        bloomPassRef.current.strength = gsap.utils.interpolate(
          bloomPassRef.current.strength,
          isHovered ? 1.5 : 0,
          0.1
        );
      }
      
      // Animate film grain
      if (filmGrainPassRef.current && filmGrainPassRef.current.uniforms) {
        filmGrainPassRef.current.uniforms.time.value = time;
        filmGrainPassRef.current.uniforms.intensity.value = gsap.utils.interpolate(
          filmGrainPassRef.current.uniforms.intensity.value,
          isHovered ? 0.3 : 0,
          0.1
        );
      }
      
      // Animate built-in film pass
      if (filmPassRef.current && filmPassRef.current.uniforms && filmPassRef.current.uniforms.nIntensity) {
        filmPassRef.current.uniforms.nIntensity.value = gsap.utils.interpolate(
          filmPassRef.current.uniforms.nIntensity.value,
          isHovered ? 0.2 : 0,
          0.1
        );
      }
      
      // Update distortion pass
      if (distortionPassRef.current && distortionPassRef.current.uniforms) {
        distortionPassRef.current.uniforms.time.value = time;
        distortionPassRef.current.uniforms.distortion.value = gsap.utils.interpolate(
          distortionPassRef.current.uniforms.distortion.value,
          isHovered ? 1 : 0,
          0.1
        );
        distortionPassRef.current.uniforms.gradientShift.value = mousePos.x * Math.PI * 2;
      }
      
      if (composerRef.current) {
        composerRef.current.render();
      }
    };

    const handleResize = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        renderer.setSize(rect.width, rect.height);
        composer.setSize(rect.width, rect.height);
      }
    };

    handleResize();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, []); // Remove isHovered and mousePos from dependencies to prevent recreation

  // Update hover state effect
  useEffect(() => {
    // This effect will trigger re-renders when hover state changes
    // The animation loop will pick up the new state
  }, [isHovered, mousePos]);

  useEffect(() => {
    // GSAP timeline for button animations
    const tl = gsap.timeline({ paused: true });
    
    tl.to(buttonRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    })
    .to(textRef.current, {
      letterSpacing: '0.05em',
      duration: 0.3,
      ease: 'power2.out'
    }, 0)
    .to(glowRef.current, {
      opacity: 1,
      scale: 1.2,
      duration: 0.3,
      ease: 'power2.out'
    }, 0)
    .to(gradientRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    }, 0);

    if (borderGradientRef.current) {
      tl.to(borderGradientRef.current, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, 0);
    }

    if (filmGrainRef.current) {
      tl.to(filmGrainRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, 0);
    }

    if (buttonRef.current) {
      buttonRef.current._timeline = tl;
    }

    // Animate gradient rotation
    if (gradientRef.current) {
      gsap.to(gradientRef.current, {
        '--gradient-angle': '360deg',
        duration: 10,
        repeat: -1,
        ease: 'none'
      });
    }

    return () => {
      tl.kill();
    };
  }, []);

  const handleMouseEnter = (e) => {
    if (disabled) return;
    setIsHovered(true);
    
    if (buttonRef.current && buttonRef.current._timeline) {
      buttonRef.current._timeline.play();
    }
    
    if (rippleRef.current) {
      gsap.to(rippleRef.current, {
        scale: 1,
        opacity: 0.3,
        duration: 0.4,
        ease: 'power2.out'
      });
    }

    // Animate bloom glow expansion
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        filter: 'blur(40px)',
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setIsHovered(false);
    
    if (buttonRef.current && buttonRef.current._timeline) {
      buttonRef.current._timeline.reverse();
    }
    
    if (rippleRef.current) {
      gsap.to(rippleRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
    }

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        filter: 'blur(20px)',
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  };

  const handleMouseMove = (e) => {
    if (disabled || !buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePos({ x, y });
    
    // Update shader uniforms
    if (distortionPassRef.current && distortionPassRef.current.uniforms) {
      distortionPassRef.current.uniforms.mouseX.value = x;
      distortionPassRef.current.uniforms.mouseY.value = y;
    }

    if (meshRef.current && meshRef.current.material && meshRef.current.material.uniforms) {
      meshRef.current.material.uniforms.mouseX.value = x;
      meshRef.current.material.uniforms.mouseY.value = y;
    }

    if (rippleRef.current) {
      gsap.to(rippleRef.current, {
        x: (x - 0.5) * rect.width,
        y: (y - 0.5) * rect.height,
        duration: 0.1
      });
    }

    // Update CSS gradient position
    buttonRef.current.style.setProperty('--mouse-x', `${x * 100}%`);
    buttonRef.current.style.setProperty('--mouse-y', `${y * 100}%`);
  };

  const handleClick = (e) => {
    if (disabled || !buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create gradient ripple effect with bloom
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple gradient-ripple bloom-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    buttonRef.current.appendChild(ripple);
    
    gsap.fromTo(ripple, {
      scale: 0,
      opacity: 1
    }, {
      scale: 3,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    });
    
    // Button press animation with bloom pulse
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });

    // Gradient flash effect
    if (gradientRef.current) {
      gsap.to(gradientRef.current, {
        opacity: 1,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
    }

    // Bloom flash
    if (bloomPassRef.current) {
      gsap.to(bloomPassRef.current, {
        strength: 2.5,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }
    
    onClick?.(e);
  };

  const sizeClasses = {
    small: 'btn-small',
    medium: 'btn-medium',
    large: 'btn-large'
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    gradient: 'btn-gradient'
  };

  const gradientClasses = {
    animated: 'gradient-animated',
    static: 'gradient-static',
    radial: 'gradient-radial',
    conic: 'gradient-conic'
  };

  return (
    <button
      ref={buttonRef}
      className={`advanced-button ${sizeClasses[size]} ${variantClasses[variant]} ${gradientClasses[gradientType]} ${disabled ? 'disabled' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      disabled={disabled}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%'
      }}
    >
      <canvas ref={canvasRef} className="button-canvas" />
      
      {/* Film grain overlay */}
      <div ref={filmGrainRef} className="film-grain-overlay" />
      
      {/* Animated gradient background */}
      <div ref={gradientRef} className="button-gradient" />
      
      {/* Border gradient */}
      <svg className="button-border" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`border-gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1">
              <animate attributeName="stop-color" values="#6366f1;#8b5cf6;#ec4899;#6366f1" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#8b5cf6">
              <animate attributeName="stop-color" values="#8b5cf6;#ec4899;#6366f1;#8b5cf6" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#ec4899">
              <animate attributeName="stop-color" values="#ec4899;#6366f1;#8b5cf6;#ec4899" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        <rect
          ref={borderGradientRef}
          x="1"
          y="1"
          width="98"
          height="98"
          fill="none"
          stroke={`url(#border-gradient-${variant})`}
          strokeWidth="2"
          strokeDasharray="400"
          strokeDashoffset="400"
          rx="8"
        />
      </svg>
      
      <div ref={glowRef} className="button-glow" />
      <div ref={rippleRef} className="button-ripple" />
      <span ref={textRef} className="button-text">
        {children}
      </span>
    </button>
  );
};