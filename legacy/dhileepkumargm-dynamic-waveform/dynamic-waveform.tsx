import React, { useRef, useEffect, memo } from 'react';
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
  uniform vec2 u_mouse;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_complexity;
  uniform float u_amplitude;
  uniform float u_frequency;
  uniform float u_mouse_distortion;

  // 2D Random
  float random(vec2 p) {
    return fract(sin(dot(p,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // --- Wave Generation ---
    float y = uv.y;
    float waveSum = 0.0;
    for (float i = 1.0; i <= 8.0; i++) {
      if (i > u_complexity) break;
      float freq = i * (u_frequency + 2.0);
      float amp  = (u_amplitude / i) * 0.2;
      float speed = u_time * (i * 0.5);

      // mouse-driven distortion
      float mEff = 1.0 + (u_mouse.y - 0.5) * u_mouse_distortion * i;
      waveSum += sin(uv.x * freq * mEff + speed) * amp;
    }
    y += waveSum;

    // --- Line + Glow ---
    float lineW  = 0.01;
    float glowW  = 0.1;
    float line   = smoothstep(lineW, 0.0, abs(uv.y - y));
    float glow   = smoothstep(glowW, 0.0, abs(uv.y - y));

    // --- Color Mix ---
    vec3 base = mix(u_color1, u_color2, smoothstep(0.3, 0.7, y));
    vec3 color = base * line + base * glow * 0.5;

    // --- Static Noise Overlay ---
    float noise = (random(uv + u_time) - 0.5) * 0.05;
    color += noise;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface ShaderCanvasProps {
  color1?: THREE.Color | string | number;
  color2?: THREE.Color | string | number;
  complexity?: number;
  amplitude?: number;
  frequency?: number;
  mouseDistortion?: number;
  speed?: number;
}

const ShaderCanvas: React.FC<ShaderCanvasProps> = memo(({
  color1         = '#ff4444',
  color2         = '#4444ff',
  complexity     = 8,
  amplitude      = 1,
  frequency      = 1,
  mouseDistortion= 0.5,
  speed          = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<any>({});

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene, Camera
    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 2. Renderer (solid background)
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1);    // black bg
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // 3. Uniforms (incl. initial props)
    const uniforms = {
      u_time:             { value: 0.0 },
      u_resolution:       { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_mouse:            { value: new THREE.Vector2(0.5, 0.5) },
      u_color1:           { value: new THREE.Color(color1) },
      u_color2:           { value: new THREE.Color(color2) },
      u_complexity:       { value: complexity },
      u_amplitude:        { value: amplitude },
      u_frequency:        { value: frequency },
      u_mouse_distortion: { value: mouseDistortion },
    };

    // 4. Fullscreen quad
    const geo  = new THREE.PlaneGeometry(2, 2);
    const mat  = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // 5. Clock & speed
    const clock = new THREE.Clock();
    threeRef.current = { renderer, scene, camera, uniforms, clock, speed };

    // 6. Resize handler
    function onResize() {
      const W = window.innerWidth;
      const H = window.innerHeight;
      renderer.setSize(W, H);
      uniforms.u_resolution.value.set(W, H);
    }
    window.addEventListener('resize', onResize);
    onResize();

    // 7. Mouse handler
    function onMouse(e: MouseEvent) {
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - e.clientY / window.innerHeight;
      uniforms.u_mouse.value.set(x, y);
    }
    window.addEventListener('mousemove', onMouse);

    // 8. Render loop
    let id: number;
    const loop = () => {
      const { clock, uniforms } = threeRef.current;
      const t = clock.getElapsedTime() * threeRef.current.speed;
      uniforms.u_time.value = t;
      renderer.render(scene, camera);
      id = requestAnimationFrame(loop);
    };
    loop();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Keep uniforms in sync if props change
  useEffect(() => {
    const { uniforms } = threeRef.current;
    if (!uniforms) return;
    uniforms.u_color1.value.set(color1);
    uniforms.u_color2.value.set(color2);
    uniforms.u_complexity.value       = complexity;
    uniforms.u_amplitude.value        = amplitude;
    uniforms.u_frequency.value        = frequency;
    uniforms.u_mouse_distortion.value = mouseDistortion;
    threeRef.current.speed = speed;
  }, [color1, color2, complexity, amplitude, frequency, mouseDistortion, speed]);

  // Fill viewport with a fallback background
  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        overflow: 'hidden',
      }}
    />
  );
});

export default ShaderCanvas;
