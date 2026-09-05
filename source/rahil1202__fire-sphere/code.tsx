'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const vert = `
  varying vec3 vNormal;
  void main() {
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = `
  #define NUM_OCTAVES 5
  uniform vec4 resolution;
  uniform vec3 color1;
  uniform vec3 color0;
  uniform float time;
  varying vec3 vNormal;

  float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }

  float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    float res = mix(
      mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
      mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
  }

  float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
      v += a * noise(x);
      x = rot * x * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  vec3 rgbcol(float r, float g, float b) { return vec3(r/255.0,g/255.0,b/255.0); }

  float setOpacity(float r, float g, float b) {
    float tone = (r + g + b) / 3.0;
    return tone < 0.99 ? 0.0 : 1.0;
  }

  void main(){
    vec2 uv = normalize(vNormal).xy * 0.5 + 0.5;
    vec2 newUv = uv + vec2(0.0, -time*0.0004);
    float scale = 12.0;
    vec2 p = newUv * scale;
    float n = fbm(p + fbm(p));

    vec4 backColor = vec4(1.0 - uv.y) + vec4(vec3(n*(1.0 - uv.y)), 1.0);
    backColor.a = setOpacity(backColor.r, backColor.g, backColor.b);
    backColor.rgb = rgbcol(color1.r, color1.g, color1.b);

    vec4 frontColor = vec4(1.08 - uv.y) + vec4(vec3(n*(1.0 - uv.y)), 1.0);
    frontColor.a = setOpacity(frontColor.r, frontColor.g, frontColor.b);
    frontColor.rgb = rgbcol(color0.r, color0.g, color0.b);

    // edge
    frontColor.a = frontColor.a - backColor.a;

    gl_FragColor = frontColor.a > 0.0 ? frontColor : backColor;
  }
`;

export type FireSphereProps = {
  /** Bloom intensity (default 1.7) */
  bloomStrength?: number;
  /** Bloom radius (default 0.8) */
  bloomRadius?: number;
  /** Bloom threshold (default 0) */
  bloomThreshold?: number;
  /** Border RGB in 0–255 (default [74,30,0]) */
  color0?: [number, number, number];
  /** Base RGB in 0–255 (default [201,158,72]) */
  color1?: [number, number, number];
  /** Whether to animate (default true) */
  animate?: boolean;
  /** Optional extra classes for the wrapper */
  className?: string;
};

function FireSphere({
  bloomStrength = 1.7,
  bloomRadius = 0.8,
  bloomThreshold = 0.0,
  color0 = [74, 30, 0],
  color1 = [201, 158, 72],
  animate = true,
  className = '',
}: FireSphereProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  // keep refs to update when props change
  const apiRef = useRef<{
    uniforms?: {
      time: { value: number };
      resolution: { value: THREE.Vector4 };
      color1: { value: THREE.Vector3 };
      color0: { value: THREE.Vector3 };
    };
    bloomPass?: UnrealBloomPass;
    renderer?: THREE.WebGLRenderer;
    composer?: EffectComposer;
    scene?: THREE.Scene;
    camera?: THREE.Camera;
    cleanup?: () => void;
    clock?: THREE.Clock;
    raf?: number;
  }>({});

  // init
  useEffect(() => {
    if (!mountRef.current) return;
    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
    composer.addPass(bloomPass);

    const uniforms = {
      time: { value: 0.0 },
      resolution: { value: new THREE.Vector4(width, height, 1, 1) },
      color1: { value: new THREE.Vector3(...color1) },
      color0: { value: new THREE.Vector3(...color0) },
    };

    const geometry = new THREE.SphereGeometry(1.7, 64, 64);
    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: vert,
      fragmentShader: frag,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight;
      (camera as THREE.PerspectiveCamera).aspect = width / height;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
      uniforms.resolution.value.set(width, height, 1, 1);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (animate) {
        uniforms.time.value = clock.getElapsedTime() * 1000.0; // ms scale
      }
      composer.render();
    };
    tick();

    const cleanup = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      composer.dispose();
      renderer.dispose();
      scene.clear();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };

    apiRef.current = { uniforms, bloomPass, renderer, composer, scene, camera, cleanup, clock, raf };

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount once

  // push prop changes to GPU/PP without re-creating scene
  useEffect(() => {
    const api = apiRef.current;
    if (!api.uniforms) return;
    api.uniforms.color0.value.set(...color0);
    api.uniforms.color1.value.set(...color1);
  }, [color0, color1]);

  useEffect(() => {
    const api = apiRef.current;
    if (!api.bloomPass) return;
    api.bloomPass.threshold = bloomThreshold;
    api.bloomPass.strength = bloomStrength;
    api.bloomPass.radius = bloomRadius;
  }, [bloomStrength, bloomRadius, bloomThreshold]);

  return (
    <div className={`relative h-screen w-screen ${className}`}>
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}

export {FireSphere}