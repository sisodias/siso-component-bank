import { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Geometry, Vec2 } from "ogl";

const vertex = `
attribute vec3 position;
attribute float pointSize;
void main() {
  gl_Position = vec4(position, 1.0);
  gl_PointSize = pointSize;
}
`;

const fragment = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;
uniform float uPointSize;
uniform float uLineIntensity;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;

    // Simple circular point
    float dist = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, dist);

    gl_FragColor = vec4(vec3(1.0), alpha * uLineIntensity);
}
`;

type Props = {
  numPoints?: number;
  speed?: number;
  pointSize?: number;
  lineIntensity?: number;
  resolutionScale?: number;
};

export default function MeshWaveHero({
  numPoints = 150,
  speed = 1.0,
  pointSize = 4.0,
  lineIntensity = 0.8,
  resolutionScale = 1
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

    // Generate points in grid
    const positions: number[] = [];
    const sizes: number[] = [];
    const spacing = 2 / Math.sqrt(numPoints);

    for (let i = 0; i < numPoints; i++) {
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      const z = Math.random() * 0.1;
      positions.push(x, y, z);
      sizes.push(pointSize);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array(positions) },
      pointSize: { size: 1, data: new Float32Array(sizes) }
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2() },
        uPointSize: { value: pointSize },
        uLineIntensity: { value: lineIntensity }
      }
    });

    const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });

    // Connect points with lines (subtle)
    const linePositions: number[] = [];
    for (let i = 0; i < positions.length; i += 3) {
      for (let j = i + 3; j < positions.length; j += 3) {
        const dx = positions[i] - positions[j];
        const dy = positions[i + 1] - positions[j + 1];
        const dz = positions[i + 2] - positions[j + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 0.3) {
          linePositions.push(positions[i], positions[i + 1], positions[i + 2]);
          linePositions.push(positions[j], positions[j + 1], positions[j + 2]);
        }
      }
    }

    const lineGeometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array(linePositions) }
    });

    const lineProgram = new Program(gl, {
      vertex: `
        attribute vec3 position;
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragment: `
        precision mediump float;
        uniform float uLineIntensity;
        void main() {
          gl_FragColor = vec4(vec3(1.0), uLineIntensity);
        }
      `,
      uniforms: {
        uLineIntensity: { value: lineIntensity }
      }
    });

    const lineMesh = new Mesh(gl, { geometry: lineGeometry, program: lineProgram, mode: gl.LINES });

    const resize = () => {
      const w = parent.clientWidth,
        h = parent.clientHeight;
      renderer.setSize(w * resolutionScale, h * resolutionScale);
      program.uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener("resize", resize);
    resize();

    const start = performance.now();
    let frame = 0;

    const loop = () => {
      const t = (performance.now() - start) / 1000 * speed;
      program.uniforms.uTime.value = t;

      // Animate points slightly in a wave
      const pos = geometry.attributes.position.data as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 2] = Math.sin(pos[i] * 5 + t) * 0.05 + Math.cos(pos[i + 1] * 5 + t) * 0.05;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render({ scene: mesh });
      renderer.render({ scene: lineMesh });
      frame = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [numPoints, speed, pointSize, lineIntensity, resolutionScale]);

  return <canvas ref={ref} className="w-full h-full block" />;
}
