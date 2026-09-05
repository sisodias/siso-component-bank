import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const WarpDriveShader = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1) Renderer + Scene + Camera + Clock
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    // 2) GLSL Shaders
    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;

      void main() {
        // Normalize to center, scale by height
        vec2 uv    = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        vec2 mouse = (iMouse      - 0.5 * iResolution.xy) / iResolution.y;

        // Time warp
        float t = iTime * 0.5;
        uv -= mouse;

        float r = length(uv) * 0.8;
        float a = atan(uv.y, uv.x);

        // Tunnel effect
        vec3 finalColor = vec3(0.0);
        float offset = 0.01;
        finalColor.r = pow(fract(0.5 / length(uv + vec2(offset, 0.0)) + t * 2.0), 15.0);
        finalColor.g = pow(fract(0.5 / length(uv)                  + t * 2.0), 15.0);
        finalColor.b = pow(fract(0.5 / length(uv - vec2(offset, 0.0)) + t * 2.0), 15.0);

        float fade = smoothstep(0.0, 0.1, r);
        finalColor *= fade;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // 3) Uniforms + Material + Mesh
    const uniforms = {
      iTime:       { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      iMouse:      { value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2) }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh     = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 4) Resize handler
    const onResize = () => {
      const width  = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.iResolution.value.set(width, height);
    };
    window.addEventListener('resize', onResize);
    onResize(); // initialize size

    // 5) Mouse handler
    const onMouseMove = (e) => {
      // flip Y so origin is bottom-left
      uniforms.iMouse.value.set(
        e.clientX,
        container.clientHeight - e.clientY
      );
    };
    window.addEventListener('mousemove', onMouseMove);

    // 6) Animation loop
    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    // 7) Cleanup on unmount
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);

      renderer.setAnimationLoop(null);

      const canvas = renderer.domElement;
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }

      material.dispose();
      geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="shader-container"
      style={{
        position:     'fixed',
        top:          0,
        left:         0,
        width:        '100vw',
        height:       '100vh',
        zIndex:       -1,
        pointerEvents:'none'
      }}
      aria-label="Warp Drive animated background"
    />
  );
};

export default WarpDriveShader;
