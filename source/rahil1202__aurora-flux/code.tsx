'use client';

import React, { useEffect, useRef } from 'react';

export type AuroraFluxProps = {
  /** Run full-bleed (fills viewport). If false, the canvas just fills its parent. */
  fullScreen?: boolean;
  /** Pause animation when not visible (via page visibility). Default: true */
  pauseWhenHidden?: boolean;
  /** Pause animation while pointer is over the canvas. Default: false */
  pauseOnHover?: boolean;
  /** Initial value for u_mix (kept for parity with original). */
  mix?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Optional aria label for accessibility. */
  ariaLabel?: string;
};

const VERT = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;
out vec2 vUv;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  vUv = a_position * 0.5 + 0.5;
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec3 u_resolution;
uniform float u_time;
uniform float u_mix;
out vec4 fragColor;

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 r = u_resolution.xy;
  vec2 p = (fragCoord + fragCoord - r) / r.y;
  vec2 z = vec2(0.5);
  vec2 i = vec2(0.1);
  vec2 f = p * (z += 5. - 6. * exp(.4 - dot(p, p)));
  vec4 O = vec4(0.0);
  for (i.y = 1.0; i.y <= 8.0; i.y += 1.0) {
    O += (tanh(f) + 1.0).xyyx * abs(f.x - f.y);
    f += tanh(f.yx * i.y + i + u_time) / i.y + 0.7;
  }
  O = tanh(5.0 * exp(z.x - 4.0 - p.y * vec4(-1.0, 1.0, 2.0, 0.0)) / O);

  float mixPhase = dot(p, p) + z.x + u_time + sin(p.x * 1.5 + p.y * 2.5 + u_time * 0.5);
  float channel = cos(mixPhase * 4.0);
  vec3 glow = vec3(
    0.6 + 0.4 * sin(channel + 1.0),
    0.6 + 0.4 * sin(channel + 0.0),
    0.6 + 0.4 * sin(channel + 2.0)
  );
  O.rgb *= glow * 1.0;

  fragColor = O;
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh) || 'Unknown shader compile error';
    gl.deleteShader(sh);
    throw new Error(info);
  }
  return sh;
}

function createProgram(gl: WebGL2RenderingContext, vsSrc: string, fsSrc: string) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(prog) || 'Unknown program link error';
    gl.deleteProgram(prog);
    throw new Error(info);
  }
  return prog;
}

export default function AuroraFlux({
  fullScreen = true,
  pauseWhenHidden = true,
  pauseOnHover = false,
  mix = 0.5,
  className = '',
  style,
  ariaLabel = 'Aurora flux shader background',
}: AuroraFluxProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const vaoRef = useRef<WebGLVertexArrayObject | null>(null);
  const rafRef = useRef<number | null>(null);
  const hoverRef = useRef(false);

  // uniforms
  const uTimeRef = useRef<WebGLUniformLocation | null>(null);
  const uResRef = useRef<WebGLUniformLocation | null>(null);
  const uMixRef = useRef<WebGLUniformLocation | null>(null);

  // handle DPR sizing
  const resize = () => {
    const canvas = canvasRef.current!;
    const gl = glRef.current!;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const displayW = fullScreen ? window.innerWidth : canvas.clientWidth;
    const displayH = fullScreen ? window.innerHeight : canvas.clientHeight;
    const w = Math.floor(displayW * dpr);
    const h = Math.floor(displayH * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    if (uResRef.current) gl.uniform3f(uResRef.current, w, h, 1);
  };

  const shouldRender = () =>
    !(pauseWhenHidden && document.visibilityState === 'hidden') &&
    !(pauseOnHover && hoverRef.current);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // style for full-screen or embedded
    if (fullScreen) {
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    } else {
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
    }

    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
    if (!gl) {
      console.error('WebGL2 not supported.');
      return;
    }
    glRef.current = gl;

    // program & quad
    const program = createProgram(gl, VERT, FRAG);
    programRef.current = program;
    gl.useProgram(program);

    const vao = gl.createVertexArray()!;
    vaoRef.current = vao;
    gl.bindVertexArray(vao);

    const quad = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const aPosLoc = 0; // layout(location = 0)
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    // uniforms
    uTimeRef.current = gl.getUniformLocation(program, 'u_time');
    uResRef.current = gl.getUniformLocation(program, 'u_resolution');
    uMixRef.current  = gl.getUniformLocation(program, 'u_mix');

    if (uMixRef.current) gl.uniform1f(uMixRef.current, mix);

    // first size + listeners
    resize();
    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    const onVisibility = () => {
      if (shouldRender() && rafRef.current === null) loop(0);
    };
    document.addEventListener('visibilitychange', onVisibility);

    if (pauseOnHover) {
      const onEnter = () => { hoverRef.current = true; };
      const onLeave = () => {
        hoverRef.current = false;
        if (rafRef.current === null && shouldRender()) loop(0);
      };
      canvas.addEventListener('pointerenter', onEnter);
      canvas.addEventListener('pointerleave', onLeave);
      // cleanup hover listeners below
      (canvas as any).__onEnter = onEnter;
      (canvas as any).__onLeave = onLeave;
    }

    // render loop
    const loop = (t: number) => {
      if (!shouldRender()) {
        rafRef.current = null;
        return;
      }
      if (!gl || !program) return;
      gl.useProgram(program);
      if (uTimeRef.current) gl.uniform1f(uTimeRef.current, t * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(loop);
    };
    (window as any).requestAnimationFrame((time: number) => {
      loop(time);
    });

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (pauseOnHover && canvas) {
        canvas.removeEventListener('pointerenter', (canvas as any).__onEnter);
        canvas.removeEventListener('pointerleave', (canvas as any).__onLeave);
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (vaoRef.current) gl.deleteVertexArray(vaoRef.current);
      if (programRef.current) gl.deleteProgram(programRef.current);
      glRef.current = null;
      programRef.current = null;
      vaoRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullScreen, pauseWhenHidden, pauseOnHover, mix]);

  return (
    <canvas
      ref={canvasRef}
      id="aurora-flux-canvas"
      className={className}
      style={style}
      aria-label={ariaLabel}
      role="img"
    />
  );
}

export { AuroraFlux };
