import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const InteractiveWaveShader = () => {
  const containerRef = useRef(null);
  const materialRef = useRef();

  // React state to control shader uniforms
  const [hasActive, setHasActive] = useState(false);
  const [hasUpcoming, setHasUpcoming] = useState(false);
  const [dimmingDisabled, setDimmingDisabled] = useState(false);

  // Update shader uniforms when state changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.hasActiveReminders.value = hasActive;
    }
  }, [hasActive]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.hasUpcomingReminders.value = hasUpcoming;
    }
  }, [hasUpcoming]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.disableCenterDimming.value = dimmingDisabled;
    }
  }, [dimmingDisabled]);


  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1) Renderer + Scene + Camera + Clock
    let renderer;
    try {
      // Use alpha:false for a standard opaque background
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.error('WebGL not supported', err);
      container.innerHTML = '<p style="color:white;text-align:center;">Sorry, WebGL isn’t available.</p>';
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    // 2) Shaders
    const vertexShader = `
      // We pass the UV coordinates of the plane to the fragment shader
      varying vec2 vTextureCoord;
      void main() {
        vTextureCoord = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // The new fragment shader you provided
    const fragmentShader = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform bool hasActiveReminders;
      uniform bool hasUpcomingReminders;
      uniform bool disableCenterDimming;
      varying vec2 vTextureCoord;

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

        // Calculate distance from center for dimming the center
        vec2 center = iResolution.xy * 0.5;
        float dist = distance(fragCoord, center);
        float radius = min(iResolution.x, iResolution.y) * 0.5;
        
        // Create a dimming factor for the center area (30% of the radius)
        float centerDim = disableCenterDimming ? 1.0 : smoothstep(radius * 0.3, radius * 0.5, dist);

        for(float i = 1.0; i < 10.0; i++){
          uv.x += 0.6 / i * cos(i * 2.5 * uv.y + iTime);
          uv.y += 0.6 / i * cos(i * 1.5 * uv.x + iTime);
        }
        
        // Determine color based on reminder state
        if (hasActiveReminders) {
          // Blue shade for active reminders
          fragColor = vec4(vec3(0.1, 0.3, 0.6) / abs(sin(iTime - uv.y - uv.x)), 1.0);
        } else if (hasUpcomingReminders) {
          // Green shade for upcoming reminders
          fragColor = vec4(vec3(0.1, 0.5, 0.2) / abs(sin(iTime - uv.y - uv.x)), 1.0);
        } else {
          // Original neutral color
          fragColor = vec4(vec3(0.1) / abs(sin(iTime - uv.y - uv.x)), 1.0);
        }
        
        // Apply center dimming only if not disabled
        if (!disableCenterDimming) {
          fragColor.rgb = mix(fragColor.rgb * 0.3, fragColor.rgb, centerDim);
        }
      }

      void main() {
        // Remove the circular mask to make the shader full screen
        vec4 color;
        mainImage(color, vTextureCoord * iResolution);
        gl_FragColor = color;
      }
    `;

    // 3) Material, Geometry, Mesh
    const uniforms = {
      iTime:       { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      iMouse:      { value: new THREE.Vector2() },
      hasActiveReminders: { value: hasActive },
      hasUpcomingReminders: { value: hasUpcoming },
      disableCenterDimming: { value: dimmingDisabled }
    };
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    materialRef.current = material; // Store material in ref
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh     = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 4) Resize and Mouse Move Handlers
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w, h);
    };
    
    const onMouseMove = (event) => {
        uniforms.iMouse.value.set(event.clientX, event.clientY);
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    onResize();

    // 5) Animation Loop
    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    // 6) Cleanup
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
  }, [hasActive, hasUpcoming, dimmingDisabled]);

  const buttonStyle = {
    padding: '10px 15px',
    margin: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '8px',
    border: '1px solid #555',
    backgroundColor: '#333',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  };

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          backgroundColor: '#000'
        }}
        aria-label="Interactive wave animation"
      />
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '12px',
        display: 'flex',
        gap: '10px'
      }}>
        <button style={{...buttonStyle, backgroundColor: hasActive ? '#007bff' : '#333'}} onClick={() => setHasActive(!hasActive)}>
          Active Reminders
        </button>
        <button style={{...buttonStyle, backgroundColor: hasUpcoming ? '#28a745' : '#333'}} onClick={() => setHasUpcoming(!hasUpcoming)}>
          Upcoming Reminders
        </button>
        <button style={{...buttonStyle, backgroundColor: dimmingDisabled ? '#dc3545' : '#333'}} onClick={() => setDimmingDisabled(!dimmingDisabled)}>
          Disable Dimming
        </button>
      </div>
    </>
  );
};

export default InteractiveWaveShader;