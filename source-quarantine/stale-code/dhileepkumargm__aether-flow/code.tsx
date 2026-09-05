import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// --- Custom Hook for Shader Animation ---
/**
 * A custom React hook to encapsulate the Three.js scene, shader material,
 * animation loop, and event listeners for a WebGL shader effect.
 * @param {React.RefObject<HTMLDivElement>} mountRef - Ref to the container element.
 * @param {object} shaderProps - An object containing the shader's uniform values.
 */
const useShaderAnimation = (mountRef, shaderProps) => {
  // Use a ref to hold the Three.js objects to prevent re-creation on every render
  const threeRef = useRef(null);

  useEffect(() => {
    // Ensure the mount point is available
    const mount = mountRef.current;
    if (!mount) return;

    // --- Three.js Core Setup (runs only once) ---
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // --- Shader Material Setup ---
    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(mount.clientWidth, mount.clientHeight) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_hue: { value: shaderProps.hue },
      u_speed: { value: shaderProps.speed },
      u_intensity: { value: shaderProps.intensity },
      u_complexity: { value: shaderProps.complexity },
      u_warp: { value: shaderProps.warp },
    };

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
      uniform float u_hue;
      uniform float u_speed;
      uniform float u_intensity;
      uniform float u_complexity;
      uniform float u_warp;

      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
                   mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 10; i++) {
          if (i >= int(u_complexity)) break;
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      mat2 rotate(float angle) {
        return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float t = u_time * u_speed;
        
        vec2 mouse_uv = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float warp_effect = smoothstep(0.7, 0.0, distance(uv, mouse_uv)) * u_warp;

        vec2 p = uv * rotate(t * 0.1) + warp_effect;
        
        float n1 = fbm(p * 1.2 + vec2(t * 0.1, t * 0.2));
        float n2 = fbm(p * 2.0 + n1 + vec2(-t * 0.25, t * 0.15));
        float n3 = fbm(p * 3.5 + n2 + vec2(t * 0.1, -t * 0.2));

        float final_noise = n1 * 0.6 + n2 * 0.25 + n3 * 0.15;

        float hue_shift = final_noise * 0.1;
        float saturation = 0.6 + final_noise * 0.4;
        float value = 0.15 + pow(final_noise, 2.5) * u_intensity;
        
        value += pow(smoothstep(0.7, 1.0, final_noise), 3.0) * 0.7 * u_intensity;

        vec3 color = hsv2rgb(vec3((u_hue / 360.0) + hue_shift, saturation, value));
        
        color *= 1.0 - smoothstep(0.8, 1.5, length(uv));

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    threeRef.current = { renderer, scene, camera, material };

    // --- Animation & Event Listeners ---
    const clock = new THREE.Clock();
    let animationFrameId;
    const animate = () => {
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      renderer.setSize(clientWidth, clientHeight);
      uniforms.u_resolution.value.set(clientWidth, clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      uniforms.u_mouse.value.x = e.clientX;
      uniforms.u_mouse.value.y = window.innerHeight - e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []); // Empty dependency array ensures this runs only once

  // This effect runs when shaderProps change, updating the uniforms
  useEffect(() => {
    if (threeRef.current) {
      const { material } = threeRef.current;
      material.uniforms.u_hue.value = shaderProps.hue;
      material.uniforms.u_speed.value = shaderProps.speed;
      material.uniforms.u_intensity.value = shaderProps.intensity;
      material.uniforms.u_complexity.value = shaderProps.complexity;
      material.uniforms.u_warp.value = shaderProps.warp;
    }
  }, [shaderProps]);
};


// --- React Components ---

/**
 * The core canvas component that utilizes the useShaderAnimation hook.
 * @param {object} props - The properties for the shader uniforms.
 */
export const ShaderCanvas = (props) => {
  const mountRef = useRef(null);
  useShaderAnimation(mountRef, props);
  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />;
};

/**
 * A reusable slider component for the control panel.
 */
export const ControlSlider = ({ label, value, onChange, min, max, step }) => (
  <div className="flex flex-col text-white/90">
    <div className="flex justify-between items-center mb-2">
      <label className="text-sm font-medium tracking-wide">{label}</label>
      <span className="text-xs bg-white/10 px-2 py-1 rounded-full font-mono">{Number(value).toFixed(2)}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={value} onChange={onChange}
      className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-violet-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
    />
  </div>
);
