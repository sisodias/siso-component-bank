'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Params = {
  blueish: number;
  scale: number;
  illumination: number;
  surfaceDistortion: number;
  waterDistortion: number;
  /** default image to load initially */
  src: string;
};

export type WaterRippleImageProps = Partial<Params> & {
  /** Extra class on the canvas wrapper */
  className?: string;
};

const VERT = `
precision mediump float;
varying vec2 vUv;
attribute vec2 a_position;
void main() {
  vUv = .5 * (a_position + 1.);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;

varying vec2 vUv;
uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_blueish;
uniform float u_scale;
uniform float u_illumination;
uniform float u_surface_distortion;
uniform float u_water_distortion;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
  m = m*m;
  m = m*m;
  vec3 x = 2. * fract(p * C.www) - 1.;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130. * dot(m, g);
}

mat2 rotate2D(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

float surface_noise(vec2 uv, float t, float scale) {
  vec2 n = vec2(.1);
  vec2 N = vec2(.1);
  mat2 m = rotate2D(.5);
  for (int j = 0; j < 10; j++) {
    uv *= m;
    n *= m;
    vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
    n += sin(q);
    N += cos(q) / scale;
    scale *= 1.2;
  }
  return (N.x + N.y + .1);
}

void main() {
  vec2 uv = vUv;
  uv.y = 1. - uv.y;
  uv.x *= u_ratio;

  float t = .002 * u_time;
  vec3 color = vec3(0.);
  float opacity = 0.;

  float outer_noise = snoise((.3 + .1 * sin(t)) * uv + vec2(0., .2 * t));
  vec2 surface_noise_uv = 2. * uv + (outer_noise * .2);

  float surf = surface_noise(surface_noise_uv, t, u_scale);
  surf *= pow(uv.y, .3);
  surf = pow(surf, 2.);

  vec2 img_uv = vUv;
  img_uv -= .5;
  if (u_ratio > u_img_ratio) {
    img_uv.x = img_uv.x * u_ratio / u_img_ratio;
  } else {
    img_uv.y = img_uv.y * u_img_ratio / u_ratio;
  }
  float scale_factor = 1.4;
  img_uv *= scale_factor;
  img_uv += .5;
  img_uv.y = 1. - img_uv.y;

  img_uv += (u_water_distortion * outer_noise);
  img_uv += (u_surface_distortion * surf);

  vec4 img = texture2D(u_image_texture, img_uv);
  img *= (1. + u_illumination * surf);

  color += img.rgb;
  color += u_illumination * vec3(1. - u_blueish, 1., 1.) * surf;
  opacity += img.a;

  float edge_width = .02;
  float edge_alpha = smoothstep(0., edge_width, img_uv.x) * smoothstep(1., 1. - edge_width, img_uv.x);
  edge_alpha *= smoothstep(0., edge_width, img_uv.y) * smoothstep(1., 1. - edge_width, img_uv.y);
  color *= edge_alpha;
  opacity *= edge_alpha;

  gl_FragColor = vec4(color, opacity);
}
`;

function compileShader(gl: WebGLRenderingContext, src: string, type: number) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`Shader compile error: ${info || 'unknown'}`);
  }
  return sh;
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const v = compileShader(gl, vs, gl.VERTEX_SHADER);
  const f = compileShader(gl, fs, gl.FRAGMENT_SHADER);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, v);
  gl.attachShader(prog, f);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error(`Program link error: ${info || 'unknown'}`);
  }
  return prog;
}

export default function WaterRippleImage({
  blueish = 0.6,
  scale = 7,
  illumination = 0.15,
  surfaceDistortion = 0.07,
  waterDistortion = 0.03,
  src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  showControls = true,
  className = '',
}: WaterRippleImageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const texRef = useRef<WebGLTexture | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const animRef = useRef<number | null>(null);

  // parameters state (mirrors your original `params`)
  const [params, setParams] = useState<Params>({
    blueish,
    scale,
    illumination,
    surfaceDistortion,
    waterDistortion,
    src,
  });

  // devicePixelRatio cap like original
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

  const updateUniforms = (gl: WebGLRenderingContext) => {
    const u = uniformsRef.current;
    gl.uniform1f(u['u_blueish'], params.blueish);
    gl.uniform1f(u['u_scale'], params.scale);
    gl.uniform1f(u['u_illumination'], params.illumination);
    gl.uniform1f(u['u_surface_distortion'], params.surfaceDistortion);
    gl.uniform1f(u['u_water_distortion'], params.waterDistortion);
  };

  const setTextureFromImage = (gl: WebGLRenderingContext, image: HTMLImageElement) => {
    if (texRef.current) gl.deleteTexture(texRef.current);
    const texture = gl.createTexture()!;
    texRef.current = texture;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    const u = uniformsRef.current;
    gl.uniform1i(u['u_image_texture'], 0);

    // set ratios
    const imgRatio = image.naturalWidth / image.naturalHeight;
    const canvas = canvasRef.current!;
    gl.uniform1f(u['u_ratio'], canvas.width / canvas.height);
    gl.uniform1f(u['u_img_ratio'], imgRatio);
  };

  const loadImage = (srcUrl: string, gl: WebGLRenderingContext) =>
    new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imgRef.current = img;
        setTextureFromImage(gl, img);
        resolve();
      };
      img.onerror = reject;
      img.src = srcUrl;
    });

  const resize = () => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    if (!gl || !canvas) return;

    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);

    const u = uniformsRef.current;
    gl.uniform1f(u['u_ratio'], canvas.width / canvas.height);

    // if we have an image, ensure u_img_ratio is set
    if (imgRef.current) {
      const imgRatio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
      gl.uniform1f(u['u_img_ratio'], imgRatio);
    }
  };

  // init GL once
  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl =
      canvas.getContext('webgl', { alpha: true, antialias: true }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl;

    // program
    const program = createProgram(gl, VERT, FRAG);
    programRef.current = program;
    gl.useProgram(program);

    // uniforms map
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(program, i);
      if (!info) continue;
      uniformsRef.current[info.name] = gl.getUniformLocation(program, info.name);
    }

    // buffer for a_position
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // initial uniforms
    updateUniforms(gl);

    // load default image
    loadImage(params.src, gl).catch((e) => console.error(e));

    // first resize + listener
    resize();
    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    // render loop
    const render = () => {
      const u = uniformsRef.current;
      if (u['u_time']) {
        gl.uniform1f(u['u_time'], performance.now());
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animRef.current = requestAnimationFrame(render);
    };
    animRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', onResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (texRef.current) gl.deleteTexture(texRef.current);
      gl.useProgram(null);
      if (programRef.current) gl.deleteProgram(programRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when params change → push to uniforms (exactly like updateUniforms)
  useEffect(() => {
    const gl = glRef.current;
    if (!gl) return;
    updateUniforms(gl);
  }, [params.blueish, params.scale, params.illumination, params.surfaceDistortion, params.waterDistortion]);

  // handle file selection → load into texture
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const onChange = () => {
      const [file] = input.files ?? [];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const gl = glRef.current;
        if (!gl) return;
        loadImage(dataUrl, gl).catch((err) => console.error(err));
      };
      reader.readAsDataURL(file);
    };

    input.addEventListener('change', onChange);
    return () => input.removeEventListener('change', onChange);
  }, []);

  return (
    <div className={`relative w-screen h-screen ${className}`}>
      {/* hidden file input (exact behavior) */}
      <input ref={inputRef} id="image-selector-input" type="file" className="hidden" />

      {/* full-screen canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-screen"
        style={{ top: 0, left: 0 }}
      />
       </div>
  );
}

export { WaterRippleImage };
