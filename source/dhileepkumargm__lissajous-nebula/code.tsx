import React, { useEffect, useRef, useCallback } from 'react';

// GLSL shaders
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  varying vec2 vUv;

  vec3 palette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0);
    vec3 d = vec3(0.00, 0.33, 0.67);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    float t = iTime * 0.15;
    float lissajous = sin(p.x * 3.0 + t) + cos(p.y * 5.0 - t * 1.5);
    float radius = length(p);
    float swirl = sin(6.28318 * (radius * 4.0 - t * 0.5) + lissajous * 2.0);
    float edge = smoothstep(0.2, 0.22, abs(swirl));
    vec3 color = palette(radius + swirl * 0.5 + t);
    fragColor = vec4(color * edge, edge);
  }

  void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
  }
`;

function LissajousNebula() {
  const containerRef = useRef(null);
  const threeState = useRef({});

  const animate = useCallback(() => {
    const { clock, renderer, scene, camera, material } = threeState.current;
    if (!clock) return;

    material.uniforms.iTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
    threeState.current.rafId = requestAnimationFrame(animate);
  }, []);

  const onResize = useCallback(() => {
    const { renderer, camera, material } = threeState.current;
    const container = containerRef.current;
    if (!renderer || !camera || !material || !container) return;

    const { clientWidth: w, clientHeight: h } = container;
    renderer.setSize(w, h);
    material.uniforms.iResolution.value.set(w, h);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;

    script.onload = () => {
      if (!isMounted || !window.THREE) return;
      const THREE = window.THREE;
      const container = containerRef.current;
      const state = threeState.current;

      state.scene = new THREE.Scene();
      state.clock = new THREE.Clock();
      state.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      state.material = new THREE.ShaderMaterial({
        uniforms: {
          iTime: { value: 0.0 },
          iResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        },
        vertexShader,
        fragmentShader,
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      state.quad = new THREE.Mesh(geometry, state.material);
      state.scene.add(state.quad);

      state.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(state.renderer.domElement);

      window.addEventListener('resize', onResize);
      onResize();
      animate();
    };

    document.body.appendChild(script);

    return () => {
      isMounted = false;
      const state = threeState.current;
      window.removeEventListener('resize', onResize);
      if (state.rafId) cancelAnimationFrame(state.rafId);

      state.quad?.geometry?.dispose();
      state.material?.dispose();

      if (state.renderer) {
        state.renderer.domElement.remove();
        state.renderer.dispose();
      }

      document.body.removeChild(script);
      threeState.current = {};
    };
  }, [animate, onResize]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-background"
      aria-label="Lissajous nebula shader background"
    />
  );
}

export default LissajousNebula;
