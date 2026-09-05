import React, { useRef, useEffect, useState } from 'react';

// Shader code remains the same
const vertShader = `attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 pos = vec4(aPosition, 1.0);
  pos.xy = pos.xy * 2.0 - 1.0;
  gl_Position = pos;
}`;

const fragShader = `#ifdef GL_ES
precision highp float;  // Changed from mediump to highp for better precision
#endif

varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform float uScale;

// Simplex noise (Ashima Arts)
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0,1.0/3.0);
  const vec4 D = vec4(0.0,0.5,1.0,2.0);  // Added explicit decimals
  vec3 i = floor(v + dot(v,C.yyy));
  vec3 x0 = v - i + dot(i,C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i,289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0,i1.z,i2.z,1.0))
    + i.y + vec4(0.0,i1.y,i2.y,1.0))
    + i.x + vec4(0.0,i1.x,i2.x,1.0));
  float n_ = 0.142857142857; // 1.0/7.0
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  // mod(p,7*7)
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// Bayer dithering
float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x/2.0 + a.y*a.y*0.75);
}
#define Bayer4(a)  (Bayer2(0.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a)  (Bayer4(0.5*(a))*0.25 + Bayer2(a))
#define Bayer16(a) (Bayer8(0.5*(a))*0.25 + Bayer2(a))
#define Bayer32(a) (Bayer16(0.5*(a))*0.25 + Bayer2(a))

void main() {
  vec2 uv = (gl_FragCoord.xy / u_resolution);
  uv.x *= u_resolution.x/u_resolution.y;

  float t = u_time * 0.5;
  float n1 = snoise(vec3(uv, t));
  float n2 = snoise(vec3(uv + 5.0, t * 1.2));
  float gray = mix(n1, n2, 0.5) * 0.5 + 0.5;

  float d = step(Bayer32(gl_FragCoord.xy * uScale), gray);
  gl_FragColor = vec4(vec3(d), 1.0);
}`;

export default function ShaderBackground({
  className = '',
  scale = 0.5,
}) {
  const containerRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If user prefers reduced motion, do nothing
    if (typeof window !== 'undefined' && 
        window.matchMedia && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let isCancelled = false;
    let sketchInstance = null;

    // Check WebGL support
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch (e) {
        return false;
      }
    };

    if (!checkWebGLSupport()) {
      setError("WebGL is not supported in your browser");
      return;
    }

    import('p5').then((P5Module) => {
      if (isCancelled) return;
      const P5 = P5Module.default || P5Module;

      const sketch = (p) => {
        let shaderProg;
        let timeOffset;
        let isShaderValid = false;

        p.setup = () => {
          // Create canvas with explicit dimensions if parent isn't ready
          const canvas = p.createCanvas(
            containerRef.current?.offsetWidth || window.innerWidth, 
            containerRef.current?.offsetHeight || window.innerHeight, 
            p.WEBGL
          );
          
          if (containerRef.current) {
            canvas.parent(containerRef.current);
          }
          
          p.noStroke();
          
          try {
            shaderProg = p.createShader(vertShader, fragShader);
            timeOffset = p.random() * 100;
            isShaderValid = true;
          } catch (e) {
            console.error('Shader compilation error:', e);
            setError('Failed to compile shader: ' + e.message);
          }
        };

        p.draw = () => {
          if (!isShaderValid) {
            // Draw fallback if shader failed
            p.background(0);
            return;
          }
          
          try {
            p.shader(shaderProg);
            
            // Set uniforms with proper error handling
            shaderProg.setUniform('u_resolution', [p.width, p.height]);
            shaderProg.setUniform('u_time', p.millis() / 1000 + timeOffset);
            shaderProg.setUniform('uScale', scale);
            
            // Draw full-screen quad
            p.rectMode(p.CENTER);
            p.rect(0, 0, p.width, p.height);
          } catch (e) {
            console.error('Shader render error:', e);
            isShaderValid = false;
            setError('Error rendering shader: ' + e.message);
          }
        };

        p.windowResized = () => {
          if (containerRef.current) {
            p.resizeCanvas(
              containerRef.current.offsetWidth, 
              containerRef.current.offsetHeight
            );
          } else {
            p.resizeCanvas(window.innerWidth, window.innerHeight);
          }
        };
      };

      try {
        sketchInstance = new P5(sketch);
        p5InstanceRef.current = sketchInstance;
      } catch (e) {
        console.error('P5 initialization error:', e);
        setError('Failed to initialize p5.js: ' + e.message);
      }
    }).catch((err) => {
      console.error('Failed to load p5:', err);
      setError('Failed to load p5.js library: ' + err.message);
    });

    return () => {
      isCancelled = true;
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
    };
  }, [scale]);

  return (
    <>
      <div
        ref={containerRef}
        className={`shader-bg ${className}`}
        role="img"
        aria-label="Procedural noise shader background"
        style={{ width: '100%', height: '100%' }}
      />
      {error && (
        <div style={{ 
          position: 'fixed', 
          bottom: 10, 
          left: 10, 
          background: 'rgba(255,0,0,0.7)', 
          padding: '10px',
          color: 'white',
          zIndex: 1000
        }}>
          Shader Error: {error}
        </div>
      )}
    </>
  );
}