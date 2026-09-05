import React, { useState, useEffect, useRef } from 'react';

export interface ArcaneOrbProps {
  className?: string;
  hue?: number;        // 0–360
  speed?: number;      // Animation speed
  intensity?: number;  // Brightness multiplier
}

export const ArcaneOrb: React.FC<ArcaneOrbProps> = ({
  className,
  hue = 260,
  speed = 0.5,
  intensity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLibLoaded, setIsLibLoaded] = useState(false);

  useEffect(() => {
    if (window.THREE) {
      setIsLibLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => setIsLibLoaded(true);
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!isLibLoaded || !canvasRef.current) return;

    const THREE = window.THREE;
    const canvas = canvasRef.current;
    let scene, camera, renderer, mesh, uniforms, animationId;

    const vertexShader = `void main() { gl_Position = vec4(position, 1.0); }`;

    const fragmentShader = `precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 mouse;
      uniform float hue;
      uniform float speed;
      uniform float intensity;
      uniform vec3 backgroundColor;

      vec3 hsv2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
        return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = mod(((i.y + vec3(0.0, i1.y, 1.0)) * 34.0 + 1.0) * (i.x + vec3(0.0, i1.x, 1.0)), 289.0);
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
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
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        vec2 mouse_uv = (mouse * 2.0 - 1.0);
        mouse_uv.y *= -1.0;
        float t = time * speed;

        float dist = distance(uv, mouse_uv);
        float orb = smoothstep(0.3, 0.28, dist) - smoothstep(0.28, 0.25, dist);
        float orb_glow = smoothstep(0.5, 0.0, dist) * 0.5;

        float angle = atan(uv.y - mouse_uv.y, uv.x - mouse_uv.x);
        float vortex = snoise(vec2(angle * 2.0, dist * 4.0 - t)) * 0.5 + 0.5;
        vortex = smoothstep(0.6, 1.0, vortex) * smoothstep(1.5, 0.2, dist);

        float value = (orb + orb_glow + vortex) * intensity;
        vec3 hsv = vec3(hue / 360.0, 0.8, value);
        vec3 color = hsv2rgb(hsv);

        gl_FragColor = vec4(mix(backgroundColor, color, value), 1.0);
      }`;

    const parseThemeBackground = () => {
      const themeBg = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
      let h = 260, s = 100, l = 50;
      try {
        [h, s, l] = themeBg.split(' ').map(parseFloat);
      } catch {
        console.warn('Invalid --background format, using fallback HSL');
      }
      return new THREE.Color().setHSL(h / 360, s / 100, l / 100);
    };

    const initScene = () => {
      scene = new THREE.Scene();
      renderer = new THREE.WebGLRenderer({ canvas });
      renderer.setPixelRatio(window.devicePixelRatio);
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      uniforms = {
        resolution: { value: [window.innerWidth, window.innerHeight] },
        time: { value: 0.0 },
        mouse: { value: [0.5, 0.5] },
        hue: { value: hue },
        speed: { value: speed },
        intensity: { value: intensity },
        backgroundColor: { value: parseThemeBackground() },
      };

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      handleResize();
    };

    const animate = () => {
      uniforms.time.value += 0.01;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    function handleResize() {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.resolution.value = [window.innerWidth, window.innerHeight];
    }

    function handleMouseMove(event: MouseEvent) {
      uniforms.mouse.value = [
        event.clientX / window.innerWidth,
        1.0 - event.clientY / window.innerHeight,
      ];
    }

    initScene();
    animate();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mesh) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
      renderer.dispose();
    };
  }, [isLibLoaded, hue, speed, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Arcane Orb visual effect"
    >
      Your browser does not support the canvas element.
    </canvas>
  );
};
