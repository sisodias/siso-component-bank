import React, { useRef, useEffect, useState, memo } from 'react';
import * as THREE from 'three';

// --- GLSL Shaders ---
const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_glitch_intensity;
  uniform float u_rgb_shift;
  uniform float u_scanline_density;
  uniform float u_scanline_opacity;
  uniform vec3 u_base_color;

  // 2D Random function
  float random(vec2 p) {
    return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  // Noise function for glitch effect
  float noise(float p) {
    return random(vec2(p, p * 2.0));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // --- Glitch Effect ---
    float glitch_time = floor(u_time * 10.0);
    float glitch_amount = noise(glitch_time) * u_glitch_intensity * 0.1;
    
    if (fract(uv.y * 10.0 + noise(glitch_time) * 100.0) > 0.95) {
      uv.x += glitch_amount;
    }

    // --- Chromatic Aberration (RGB Shift) ---
    vec2 uv_r = uv + vec2(u_rgb_shift, 0.0);
    vec2 uv_g = uv;
    vec2 uv_b = uv - vec2(u_rgb_shift, 0.0);
    
    float pattern_r = step(0.5, fract(uv_r.x * 5.0 + u_time));
    float pattern_g = step(0.5, fract(uv_g.x * 5.0 + u_time));
    float pattern_b = step(0.5, fract(uv_b.x * 5.0 + u_time));
    
    vec3 color = vec3(pattern_r, pattern_g, pattern_b);
    color *= u_base_color;

    // --- Scanline Effect ---
    float scanline = sin(uv.y * u_scanline_density) * 0.5 + 0.5;
    color *= mix(1.0, scanline, u_scanline_opacity);

    // --- Film Grain ---
    color += (random(uv + u_time) - 0.5) * 0.05;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// --- Helper Function ---
const hexToThreeColor = (hex) => new THREE.Color(hex);

// --- Shader Canvas Component ---
const ShaderCanvas = memo((props) => {
  const mountRef = useRef(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const threeRef = useRef({});

  useEffect(() => {
    if (!mountRef.current) return;

    const canvas = document.createElement('canvas');
    if (!canvas.getContext('webgl') && !canvas.getContext('experimental-webgl')) {
        setIsWebGLSupported(false);
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_base_color: { value: hexToThreeColor(props.baseColor) },
      u_glitch_intensity: { value: props.glitchIntensity },
      u_rgb_shift: { value: props.rgbShift },
      u_scanline_density: { value: props.scanlineDensity },
      u_scanline_opacity: { value: props.scanlineOpacity },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    threeRef.current = { renderer, scene, camera, uniforms, clock: new THREE.Clock() };

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    const animate = () => {
      uniforms.u_time.value = threeRef.current.clock.getElapsedTime() * threeRef.current.speed;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const { uniforms } = threeRef.current;
    if (uniforms) {
      uniforms.u_base_color.value = hexToThreeColor(props.baseColor);
      uniforms.u_glitch_intensity.value = props.glitchIntensity;
      uniforms.u_rgb_shift.value = props.rgbShift;
      uniforms.u_scanline_density.value = props.scanlineDensity;
      uniforms.u_scanline_opacity.value = props.scanlineOpacity;
      threeRef.current.speed = props.speed;
    }
  }, [props]);

  if (!isWebGLSupported) {
    return (
        <div className="w-full h-full flex items-center justify-center bg-black text-white">
            <div className="text-center p-8 bg-gray-900/50 rounded-lg border border-red-500/50">
                <h2 className="text-2xl font-bold text-red-400">WebGL Not Supported</h2>
                <p className="text-white/70 mt-2">Sorry, your browser does not support WebGL, which is required for this animation.</p>
            </div>
        </div>
    );
  }

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />;
});

export default ShaderCanvas;
