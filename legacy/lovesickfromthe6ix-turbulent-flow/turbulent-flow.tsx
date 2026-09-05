// OrganicGradientBackground.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export const Component = ({ children }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced shader with turbulence
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_noise_scale;
      uniform float u_distortion;
      uniform float u_turbulence;
      uniform float u_sharpness;
      varying vec2 vUv;

      // Improved noise functions
      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
      }

      vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
      }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        
        i = mod289(i);
        vec4 p = permute(permute(permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      // Fractal Brownian Motion for turbulence
      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.6;
        
        for(int i = 0; i < 6; i++) {
          value += amplitude * snoise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value;
      }

      // Turbulence function
      float turbulence(vec3 p) {
        float t = 0.0;
        float amplitude = 1.0;
        float frequency = 0.4;
        
        for(int i = 0; i < 4; i++) {
          t += abs(snoise(p * frequency)) * amplitude;
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return t;
      }

      // Curl noise for more organic flow
      vec2 curl(vec2 p, float time) {
        float eps = 0.01;
        float n1 = snoise(vec3(p.x, p.y + eps, time));
        float n2 = snoise(vec3(p.x, p.y - eps, time));
        float n3 = snoise(vec3(p.x + eps, p.y, time));
        float n4 = snoise(vec3(p.x - eps, p.y, time));
        
        return vec2(n1 - n2, n4 - n3) / (2.0 * eps);
      }

      void main() {
        vec2 uv = vUv;
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        
        // Multi-layered turbulence
        float time = u_time * 0.5;
        vec3 pos = vec3(uv * u_noise_scale * 1.5, time * 0.1);
        
        // Primary turbulence layers
        float turb1 = turbulence(pos) * u_turbulence;
        float turb2 = turbulence(pos * 1.7 + vec3(100.0, 50.0, time * 0.3)) * u_turbulence * 0.3;
        float turb3 = fbm(pos * 0.8 + vec3(200.0, 100.0, time * 0.15)) * u_turbulence * 0.5;
        
        // Curl noise for organic flow
        vec2 curlForce = curl(uv * 2.0, time * 0.5) * 0.25;
        
        // Combined distortion
        vec2 distortion = vec2(turb1 + turb2, turb2 + turb3) * u_distortion + curlForce;
        vec2 distortedUV = uv + distortion;
        
        // Sharp animated gradient centers with turbulence influence
        vec2 center1 = vec2(
          0.5 + sin(time * 0.4) * 0.3 + turb1 * 0.2,
          0.75 + cos(time * 0.3) * 0.2 + turb2 * 0.3
        );
        vec2 center2 = vec2(
          0.75 + sin(time * 0.35) * 0.25 + turb2 * 0.8,
          0.65 + cos(time * 0.45) * 0.3 + turb3 * 0.61
        );
        vec2 center3 = vec2(
          0.6 + sin(time * 0.5) * 0.2 + turb3 * 0.12,
          0.25 + cos(time * 0.4) * 0.28 + turb1 * 0.09
        );
        vec2 center4 = vec2(
          0.15 + sin(time * 0.25) * 0.35 + turb1 * 0.11,
          0.8 + cos(time * 0.55) * 0.22 + turb2 * 0.08
        );
        
        // Calculate distances with enhanced sharpness
        float dist1 = length(distortedUV - center1);
        float dist2 = length(distortedUV - center2);
        float dist3 = length(distortedUV - center3);
        float dist4 = length(distortedUV - center4);
        
        // Sharp gradients with turbulence modulation
        float sharp = u_sharpness;
        float grad1 = 1.0 - smoothstep(0.0, 0.6 - turb1 * 0.2, dist1);
        float grad2 = 1.0 - smoothstep(0.0, 0.5 - turb2 * 0.15, dist2);
        float grad3 = 1.0 - smoothstep(0.0, 0.55 - turb3 * 0.18, dist3);
        float grad4 = 1.0 - smoothstep(0.0, 0.45 - turb1 * 0.12, dist4);
        
        // Enhanced color palette with more saturation
        vec3 color1 = vec3(1.0, 0.25, 0.05); // Intense orange/red
        vec3 color2 = vec3(0.0, 0.8, 0.95); // Bright cyan
        vec3 color3 = vec3(0.7, 0.1, 0.8); // Vivid purple
        vec3 color4 = vec3(0.2, 0.9, 0.3); // Bright green
        vec3 color5 = vec3(1.0, 0.7, 0.0); // Golden yellow
        
        // Base color with more contrast
        vec3 finalColor = vec3(0.02, 0.02, 0.01); // Darker base
        
        // Layer colors with turbulence influence
        finalColor += color1 * grad1 * (0.9 + turb1 * 0.3);
        finalColor += color2 * grad2 * (0.8 + turb2 * 0.4);
        finalColor += color3 * grad3 * (0.7 + turb3 * 0.3);
        finalColor += color4 * grad4 * (0.6 + turb1 * 0.2);
        
        // Add secondary color interactions
        float interaction1 = grad1 * grad2 * 0.7;
        float interaction2 = grad2 * grad3 * 0.93;
        float interaction3 = grad3 * grad4 * 0.35;
        
        finalColor += color5 * interaction1;
        finalColor += mix(color1, color2, 0.5) * interaction2;
        finalColor += mix(color3, color4, 0.6) * interaction3;
        
        // Sharp noise texture overlay
        float noiseDetail = fbm(vec3(uv * 15.0, time * 0.1)) * 0.5;
        float microTurbulence = turbulence(vec3(uv * 25.0, time * 0.05)) * 0.8;
        finalColor += (microTurbulence * noiseDetail) * 0.5;
        
        // Enhanced contrast and saturation
        finalColor = pow(finalColor, vec3(0.9)); // Gamma correction
        finalColor *= 1.2; // Brightness boost
        
        // Subtle vignette (less aggressive)
        float vignette = 1.0 - length(uv - 0.5) * 1.75;
        vignette = smoothstep(0.11, 1.0, vignette);
        finalColor *= vignette;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_noise_scale: { value: 4.0 },
        u_distortion: { value: 0.15 },
        u_turbulence: { value: 0.8 },
        u_sharpness: { value: 1.4 }
      }
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    materialRef.current = material;

    // Enhanced GSAP animation timeline
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(material.uniforms.u_turbulence, {
      value: 1.2,
      duration: 6,
      ease: "sine.inOut"
    })
    .to(material.uniforms.u_noise_scale, {
      value: 6.0,
      duration: 8,
      ease: "power2.inOut"
    }, 0)
    .to(material.uniforms.u_distortion, {
      value: 0.25,
      duration: 7,
      ease: "power1.inOut"
    }, 1)
        .to(material.uniforms.u_sharpness, {
      value: 1.8,
      duration: 5,
      ease: "power2.inOut"
    }, 2)
    .to(material.uniforms.u_turbulence, {
      value: 0.4,
      duration: 9,
      ease: "sine.inOut"
    })
    .to(material.uniforms.u_noise_scale, {
      value: 2.5,
      duration: 10,
      ease: "power2.inOut"
    }, "-=4")
    .to(material.uniforms.u_distortion, {
      value: 0.08,
      duration: 8,
      ease: "power1.inOut"
    }, "-=6")
    .to(material.uniforms.u_sharpness, {
      value: 1.0,
      duration: 7,
      ease: "power2.inOut"
    }, "-=5");

    // Mouse interaction for additional turbulence
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Add mouse influence to turbulence
      const mouseInfluence = Math.sqrt(mouseX * mouseX + mouseY * mouseY) * 0.3;
      material.uniforms.u_turbulence.value += mouseInfluence * 0.1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop with enhanced time progression
    const animate = () => {
      timeRef.current += 0.008; // Slightly slower for more organic feel
      material.uniforms.u_time.value = timeRef.current;
      
      // Add subtle breathing effect to sharpness
      const breathe = Math.sin(timeRef.current * 0.5) * 0.1;
      material.uniforms.u_sharpness.value += breathe;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      material.uniforms.u_resolution.value.set(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      tl.kill();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <div 
        ref={mountRef} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          zIndex: 1
        }} 
      />
      <div 
        style={{ 
          position: 'relative', 
          zIndex: 2, 
          width: '100%', 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};