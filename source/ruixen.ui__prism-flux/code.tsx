import { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";

// Vertex Shader
const vertex = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Fragment Shader
const fragment = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;
uniform float uDistort;
uniform float uGlow;
uniform float uSpeed;
uniform float uColorShift;

#define PI 3.14159265359

// Smooth rainbow palette
vec3 palette(float t) {
    return 0.5 + 0.5 * cos(6.2831 * (vec3(0.3, 0.6, 0.9) * t + vec3(0.0, 0.2, 0.4)));
}

// Distorted wave pattern
float wave(vec2 uv) {
    return sin(uv.x * 8.0 + uTime * uSpeed) * cos(uv.y * 6.0 - uTime * 0.7);
}

// Glow function
float glow(float d, float strength) {
    return exp(-d * d * strength);
}

void main() {
    vec2 uv = (gl_FragCoord.xy / uResolution.xy) * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    // Apply swirling distortion
    float r = length(uv);
    float a = atan(uv.y, uv.x);
    a += uDistort * sin(r * 3.0 - uTime * 0.5);
    uv = vec2(cos(a), sin(a)) * r;

    // Wave pattern
    float w = wave(uv * 2.0);

    // Gradient color shift
    vec3 col = palette(w + uColorShift * uTime * 0.05);

    // Glow effect on peaks
    float g = glow(abs(w), uGlow);
    col += g * 0.6;

    gl_FragColor = vec4(col, 1.0);
}
`;

type Props = {
  distort?: number;
  glow?: number;
  speed?: number;
  colorShift?: number;
  resolutionScale?: number;
};

export default function PrismFlux({
  distort = 0.5,
  glow = 4.0,
  speed = 1.0,
  colorShift = 2.0,
  resolutionScale = 1.0
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    const parent = canvas.parentElement as HTMLElement;

    // OGL renderer
    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas,
    });

    const gl = renderer.gl;
    const geometry = new Triangle(gl);

    // Shader program
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2() },
        uDistort: { value: distort },
        uGlow: { value: glow },
        uSpeed: { value: speed },
        uColorShift: { value: colorShift },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    // Resize handling
    const resize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w * resolutionScale, h * resolutionScale);
      program.uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener("resize", resize);
    resize();

    // Animation loop
    const start = performance.now();
    let frame = 0;

    const loop = () => {
      program.uniforms.uTime.value = (performance.now() - start) / 1000;
      program.uniforms.uDistort.value = distort;
      program.uniforms.uGlow.value = glow;
      program.uniforms.uSpeed.value = speed;
      program.uniforms.uColorShift.value = colorShift;

      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [distort, glow, speed, colorShift, resolutionScale]);

  return <canvas ref={ref} className="w-full h-full block" />;
}
