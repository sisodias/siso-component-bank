// src/components/ui/component.tsx
"use client";
import React, { useEffect, useRef } from "react";

const SHADER_SRC = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 v_uv;

uniform vec3  iResolution;   // (w, h, dpr)
uniform float iTime;
uniform int   iFrame;
uniform vec4  iMouse;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
  vec2  r  = iResolution.xy;
  float t  = iTime;
  vec3  FC = vec3(fragCoord, t);
  vec4  o  = vec4(0.0);

  // --- Nucleus ---
  vec3 p, a;
  float z = 0.0;
  float d = 0.0;

  for (float i = 0.0; i < 100.0; i++)
  {
    p = z * normalize(FC.rgb * 2.0 - r.xyy);
    a = normalize(cos(vec3(4.0, 2.0, 0.0) + t - d * 10.0)); // (d/.1) == d*10
    p.z += 8.0;
    a = a * dot(a, p) - cross(a, p);
    for (float k = 1.0; k < 5.0; k += 1.0) {
      a += sin(a * k + t).yzx / k;
    }
    d = abs(length(a) - 5.0) / 6.0;
    z += d;
    o += vec4(3.0, 8.0, z, 0.0) / max(d, 1e-4) / 9e4;
  }

  fragColor = vec4(o.rgb, 1.0);
}

void main(){ mainImage(fragColor, gl_FragCoord.xy); }
`;

const VERT_SRC = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  const ok = gl.getShaderParameter(sh, gl.COMPILE_STATUS);
  if (!ok) {
    console.error("Shader compile error:", gl.getShaderInfoLog(sh) || "");
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}
function link(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  const ok = gl.getProgramParameter(prog, gl.LINK_STATUS);
  if (!ok) {
    console.error("Program link error:", gl.getProgramInfoLog(prog) || "");
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!gl) return;

    // fullscreen triangle
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, SHADER_SRC);
    if (!vs || !fs) {
      // безопасный cleanup при раннем выходе
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
      return;
    }

    const program = link(gl, vs, fs);
    if (!program) {
      try { gl.deleteShader(vs); } catch {}
      try { gl.deleteShader(fs); } catch {}
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
      return;
    }
    gl.useProgram(program);

    // uniforms
    const uRes   = gl.getUniformLocation(program, "iResolution");
    const uTime  = gl.getUniformLocation(program, "iTime");
    const uFrame = gl.getUniformLocation(program, "iFrame");
    const uMouse = gl.getUniformLocation(program, "iMouse");

    // mouse (если нужно)
    const mouse = { x:0, y:0, l:0, r:0 };
    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = rect.height - (e.clientY - rect.top);
    }
    function onDown(e: MouseEvent){ if (e.button===0) mouse.l = 1; }
    function onUp  (e: MouseEvent){ if (e.button===0) mouse.l = 0; }
    function onContextMenu(e: MouseEvent){ e.preventDefault(); }
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("contextmenu", onContextMenu);

    // SAFE ResizeObserver (исправление бага ro before init)
    let ro: ResizeObserver | null = null;
    const applySize = () => {
      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    // создаём наблюдатель и сразу применяем размер
    ro = new ResizeObserver(() => applySize());
    ro.observe(canvas);
    applySize();

    let raf = 0;
    let start = performance.now();
    let frame = 0;

    function tick(now: number) {
      const t = (now - start) / 1000;
      frame++;

      gl.useProgram(program);
      // на случай смены DPR/размера без события
      applySize();

      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      uRes   && gl.uniform3f(uRes, canvas.width, canvas.height, dpr);
      uTime  && gl.uniform1f(uTime, t);
      uFrame && gl.uniform1i(uFrame, frame);
      uMouse && gl.uniform4f(uMouse, mouse.x, mouse.y, mouse.l, mouse.r);

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("contextmenu", onContextMenu);
      try { ro && ro.disconnect(); } catch {}
      try { gl.deleteProgram(program); } catch {}
      try { gl.deleteShader(vs); } catch {}
      try { gl.deleteShader(fs); } catch {}
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
    };
  }, []);

  // фуллскрин канвас
  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
        background: "black",
        cursor: "crosshair",
      }}
    />
  );
}
