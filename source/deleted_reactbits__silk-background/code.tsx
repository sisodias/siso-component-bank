'use client';

import React, {
  FC,
  forwardRef,
  useRef,
  useMemo,
  useLayoutEffect,
  ComponentPropsWithoutRef,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, Mesh } from 'three';

const hexToRgb = (hex: string): [number, number, number] => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return [r, g, b];
};

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

float noise(vec2 p) {
  float G = 2.71828;
  vec2 r = (G * sin(G * p));
  return fract(r.x * r.y * (1.0 + p.x));
}

vec2 rotate(vec2 uv, float angle) {
  mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  return rot * uv;
}

void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 uv = rotate(vUv * uScale, uRotation);
  vec2 tex = uv * uScale;
  float t = uSpeed * uTime;
  tex.y += 0.03 * sin(8.0 * tex.x - t);
  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * t) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * t)));
  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

type SilkPlaneProps = {
  uniforms: any;
};

const SilkPlane = forwardRef<Mesh, SilkPlaneProps>(function SilkPlaneComponent(
  { uniforms },
  ref
) {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

  useFrame((state, delta) => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.material.uniforms.uTime.value += 0.1 * delta;
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});

interface ComponentProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
}

const Component: FC<ComponentProps & ComponentPropsWithoutRef<'div'>> = ({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0,
  className,
  ...props
}) => {
  const meshRef = useRef<Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToRgb(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, color, rotation]
  );

  return (
    <Canvas
      dpr={[1, 2]}
      frameloop="always"
      className={className}
      {...props}
    >
      <SilkPlane ref={meshRef} uniforms={uniforms} />
    </Canvas>
  );
};

export default Component;