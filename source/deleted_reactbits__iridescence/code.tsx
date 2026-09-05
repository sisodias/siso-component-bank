import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

interface IridescenceProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
}

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;

export const Iridescence: React.FC<IridescenceProps> = ({
  color = [1, 1, 1],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  className,
  style,
  ...rest
}) => {
  const ctnDom = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const rendererRef = useRef<Renderer | null>(null);

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), antialias: true });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    let program: Program;

    function resize() {
      if (!ctnDom.current || !rendererRef.current) return;
      rendererRef.current.setSize(ctnDom.current.offsetWidth, ctnDom.current.offsetHeight);
      if (program) {
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height
        );
      }
    }
    window.addEventListener("resize", resize, false);
    

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: {
          value: new Color(
            ctn.offsetWidth,
            ctn.offsetHeight,
            ctn.offsetWidth / ctn.offsetHeight
          ),
        },
        uMouse: { value: new Float32Array([mousePos.current.x, mousePos.current.y]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
      },
    });
    resize();

    const mesh = new Mesh(gl, { geometry, program });
    let animateId: number;

    function update(t: number) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      if (mouseReact) {
         program.uniforms.uMouse.value[0] = mousePos.current.x;
         program.uniforms.uMouse.value[1] = mousePos.current.y;
      } else {
        program.uniforms.uMouse.value[0] = 0.5;
        program.uniforms.uMouse.value[1] = 0.5;
      }
      renderer.render({ scene: mesh });
    }
    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    function handleMouseMove(e: MouseEvent) {
      if (!ctnDom.current) return;
      const rect = ctnDom.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mousePos.current = { x, y };
    }
    if (mouseReact) {
      ctn.addEventListener("mousemove", handleMouseMove);
    }
    
    program.uniforms.uColor.value.set(...color);
    program.uniforms.uSpeed.value = speed;
    program.uniforms.uAmplitude.value = amplitude;


    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (mouseReact) {
        ctn.removeEventListener("mousemove", handleMouseMove);
      }
      
      const currentRenderer = rendererRef.current;
      if (currentRenderer) {
        const currentGl = currentRenderer.gl;
         if (currentGl && currentGl.canvas && ctn.contains(currentGl.canvas)) {
            ctn.removeChild(currentGl.canvas);
        }
        const loseContextExtension = currentGl.getExtension("WEBGL_lose_context");
        if (loseContextExtension) {
          loseContextExtension.loseContext();
        }
      }
      rendererRef.current = null;
    };
  }, [color, speed, amplitude, mouseReact]);

  return (
    <div
      ref={ctnDom}
      className={className}
      style={style}
      {...rest}
    />
  );
};