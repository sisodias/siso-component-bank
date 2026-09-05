import { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2, Vec3  } from "ogl";

const vertex = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;
uniform float uMorph;
uniform float uGlow;
uniform float uSpeed;
uniform vec3 uBaseColor;

// Polygonal distance function
float polygon(vec2 uv, float sides, float radius) {
    float a = atan(uv.y, uv.x) + 3.14159265359;
    float r = length(uv);
    float tau = 6.28318530718 / sides;
    float d = cos(floor(0.5 + a / tau) * tau - a) * r;
    return smoothstep(radius, radius + 0.01, d);
}

// Glow effect
float glow(float d, float strength) {
    return exp(-d * d * strength);
}

void main() {
    vec2 uv = (gl_FragCoord.xy / uResolution.xy) * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    // Morphing effect
    float angle = uMorph * sin(uTime * uSpeed) + length(uv) * 3.0;
    vec2 rotated = vec2(
        cos(angle) * uv.x - sin(angle) * uv.y,
        sin(angle) * uv.x + cos(angle) * uv.y
    );

    // Generate multiple polygon layers
    float d1 = polygon(rotated * 1.5, 6.0, 0.5);
    float d2 = polygon(rotated * 2.0, 5.0, 0.4);
    float d3 = polygon(rotated * 3.0, 8.0, 0.3);

    float shape = d1 * 0.6 + d2 * 0.3 + d3 * 0.1;

    // Color
    vec3 col = uBaseColor * shape;

    // Glow
    col += glow(shape, uGlow) * 0.4;

    gl_FragColor = vec4(col, 1.0);
}
`;

type Props = {
  morphSpeed?: number;       // How fast polygons morph
  glowIntensity?: number;    // Glow effect intensity
  speed?: number;            // Animation speed
  baseColor?: [number, number, number]; // Base RGB color
  resolutionScale?: number;  // Canvas resolution scale
};

export default function PolygonFlux({
  morphSpeed = 1.0,
  glowIntensity = 4.0,
  speed = 0.5,
  baseColor = [0.2, 0.7, 1.0], // Light blue default
  resolutionScale = 1.0
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    const parent = canvas.parentElement as HTMLElement;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas
    });

    const gl = renderer.gl;
    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2() },
        uMorph: { value: morphSpeed },
        uGlow: { value: glowIntensity },
        uSpeed: { value: speed },
        uBaseColor: { value: new Vec2(baseColor[0], baseColor[1]) } // We’ll pass RGB as vec3 later
      },
    });

    // Convert RGB to Vec3 for uniform
    program.uniforms.uBaseColor.value = baseColor as unknown as Vec2;

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w * resolutionScale, h * resolutionScale);
      program.uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener("resize", resize);
    resize();

    const start = performance.now();
    let frame = 0;

    const loop = () => {
      program.uniforms.uTime.value = (performance.now() - start) / 1000;
      program.uniforms.uMorph.value = morphSpeed;
      program.uniforms.uGlow.value = glowIntensity;
      program.uniforms.uSpeed.value = speed;
      program.uniforms.uBaseColor.value = baseColor as unknown as Vec2;
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [morphSpeed, glowIntensity, speed, baseColor, resolutionScale]);

  return <canvas ref={ref} className="w-full h-full block" />;
}
