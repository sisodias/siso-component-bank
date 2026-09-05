"use client";

import type React from "react";
import { useEffect, useRef } from "react";

const declarePI = `
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`;

const proceduralHash11 = `
float hash11(float p) {
  p = fract(p * 0.3183099) + 0.1;
  p *= p + 19.19;
  return fract(p * p);
}
`;

const proceduralHash21 = `
float hash21(vec2 p) {
  p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}
`;

const simplexNoise = `
vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );

  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod(i, 289.0);

  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) +
    i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
    0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ),
    0.0
  );

  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}
`;

const vertexShaderSource = `#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_colorBack;
uniform vec4 u_colorFront;
uniform float u_shape;
uniform float u_type;
uniform float u_pxSize;

out vec4 fragColor;

${simplexNoise}
${declarePI}
${proceduralHash11}
${proceduralHash21}

float getSimplexNoise(vec2 uv, float t) {
  float noise = 0.5 * snoise(uv - vec2(0.0, 0.3 * t));
  noise += 0.5 * snoise(2.0 * uv + vec2(0.0, 0.32 * t));
  return noise;
}

const int bayer2x2[4] = int[4](
  0, 2,
  3, 1
);

const int bayer4x4[16] = int[16](
   0,  8,  2, 10,
  12,  4, 14,  6,
   3, 11,  1,  9,
  15,  7, 13,  5
);

const int bayer8x8[64] = int[64](
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(mod(uv, float(size)));
  int index = pos.y * size + pos.x;

  if (size == 2) {
    return float(bayer2x2[index]) / 4.0;
  } else if (size == 4) {
    return float(bayer4x4[index]) / 16.0;
  } else if (size == 8) {
    return float(bayer8x8[index]) / 64.0;
  }

  return 0.0;
}

float isExactCell(vec2 a, vec2 b) {
  float matchX = 1.0 - step(0.5, abs(a.x - b.x));
  float matchY = 1.0 - step(0.5, abs(a.y - b.y));
  return matchX * matchY;
}

float pixelStarShape(vec2 localCell) {
  float center =
    isExactCell(localCell, vec2(2.0, 2.0));

  float cross =
    isExactCell(localCell, vec2(2.0, 1.0)) +
    isExactCell(localCell, vec2(2.0, 3.0)) +
    isExactCell(localCell, vec2(1.0, 2.0)) +
    isExactCell(localCell, vec2(3.0, 2.0));

  float diagonals =
    isExactCell(localCell, vec2(1.0, 1.0)) +
    isExactCell(localCell, vec2(3.0, 1.0)) +
    isExactCell(localCell, vec2(1.0, 3.0)) +
    isExactCell(localCell, vec2(3.0, 3.0));

  float star = 0.0;
  star = max(star, center);
  star = max(star, cross);
  star = max(star, diagonals);

  return clamp(star, 0.0, 1.0);
}

void main() {
  float t = 0.5 * u_time;

  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv -= 0.5;

  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;

  float pxSize = u_pxSize;

  vec2 pxSizeUv = gl_FragCoord.xy;
  pxSizeUv -= 0.5 * u_resolution;
  pxSizeUv /= pxSize;

  vec2 pixelizedUv = floor(pxSizeUv) * pxSize / u_resolution.xy;
  pixelizedUv += 0.5;
  pixelizedUv -= 0.5;
  pixelizedUv.x *= aspect;

  vec2 shape_uv = pixelizedUv;
  vec2 dithering_uv = pxSizeUv;
  vec2 ditheringNoise_uv = uv * u_resolution;

  float shape = 0.0;

  if (u_shape < 1.5) {
    // Simplex noise
    shape_uv *= 0.001;
    shape = 0.5 + 0.5 * getSimplexNoise(shape_uv, t);
    shape = smoothstep(0.3, 0.9, shape);

  } else if (u_shape < 2.5) {
    // Warp
    shape_uv *= 0.003;

    for (float i = 1.0; i < 6.0; i++) {
      shape_uv.x += 0.6 / i * cos(i * 2.5 * shape_uv.y + t);
      shape_uv.y += 0.6 / i * cos(i * 1.5 * shape_uv.x + t);
    }

    shape = 0.15 / abs(sin(t - shape_uv.y - shape_uv.x));
    shape = smoothstep(0.02, 1.0, shape);

  } else if (u_shape < 3.5) {
    // Dots
    shape_uv *= 0.05;

    float stripeIdx = floor(2.0 * shape_uv.x / TWO_PI);
    float rand = hash11(stripeIdx * 10.0);
    rand = sign(rand - 0.5) * pow(0.1 + abs(rand), 0.4);

    shape = sin(shape_uv.x) * cos(shape_uv.y - 5.0 * rand * t);
    shape = pow(abs(shape), 6.0);

  } else if (u_shape < 4.5) {
    // Wave
    vec2 p = shape_uv;

    p.x *= 5.0;
    p.y *= 3.0;

    // Left-to-right motion
    float movingX = p.x - t * 2.8;

    // Small phase softness, without stretching the whole wave
    float phaseNoise = snoise(vec2(p.x * 0.45, t * 0.35)) * 0.25;

    // Stronger overall motion
    float verticalMotion = sin(t * 2.2 + p.x * 0.75) * 0.30;

    // Time-varying amplitude envelopes
    float ampMain = 0.70 + 0.35 * snoise(vec2(t * 0.22, p.x * 0.08));
    float ampDetail = 0.16 + 0.28 * snoise(vec2(t * 0.34 + 11.0, p.x * 0.12));
    float ampSpike = 0.10 + 0.40 * smoothstep(
      0.15,
      0.85,
      0.5 + 0.5 * snoise(vec2(t * 0.42 + 23.0, p.x * 0.06))
    );

    ampMain = max(0.30, ampMain);
    ampDetail = max(0.00, ampDetail);
    ampSpike = max(0.00, ampSpike);

    // Base wave layers
    float waveA = sin(movingX * 0.90 + phaseNoise) * ampMain;
    float waveB = sin(movingX * 2.60 - t * 1.00 + phaseNoise * 0.5) * ampDetail;
    float waveC = cos(movingX * 0.55 + t * 0.45) * 0.18;

    // Sharp pulse peaks for ECG / audio-wave feel
    float pulse = pow(
      max(0.0, sin(movingX * 1.15 - t * 0.85 + phaseNoise)),
      3.5
    ) * ampSpike;

    // Small negative dip after the spike, to feel less smooth
    float pulseDip = -pow(
      max(0.0, sin(movingX * 1.15 - t * 0.85 + 1.6)),
      3.0
    ) * 0.18;

    // Final ribbon path
    float centerLine = waveA + waveB + waveC + pulse + pulseDip;
    centerLine *= 0.60;
    centerLine += verticalMotion;

    // Signed distance
    float signedDist = p.y - centerLine;
    float absDist = abs(signedDist);

    // Dramatic ribbon thickness variation
    float thickness =
      0.22
      + 0.10 * sin(movingX * 1.2 + t * 0.9)
      + 0.05 * sin(movingX * 2.0 - t * 1.1)
      + pulse * 0.10;

    // Core solid ribbon
    float core = 1.0 - smoothstep(
      thickness * 0.25,
      thickness * 1.22,
      absDist
    );

    // Middle density layer.
    // This creates the missing gradient between solid body and outer glow.
    float midDensity = 1.0 - smoothstep(
      thickness * 0.88,
      thickness + 0.55,
      absDist
    );

    // Outer soft density layer
    float outerDensity = 1.0 - smoothstep(
      thickness + 0.24,
      thickness + 0.86,
      absDist
    );

    // Separate density fields for top and bottom outer areas
    float topDensityNoise =
      snoise(vec2(movingX * 0.85, p.y * 1.6 + t * 0.35));

    float bottomDensityNoise =
      snoise(vec2(movingX * 0.95 + 19.7, p.y * 1.8 - t * 0.28));

    float topDensity = clamp(
      0.50 + 0.44 * topDensityNoise,
      0.10,
      1.0
    );

    float bottomDensity = clamp(
      0.50 + 0.44 * bottomDensityNoise,
      0.10,
      1.0
    );

    float sideMask = step(0.0, signedDist);
    float densityVariation = mix(bottomDensity, topDensity, sideMask);

    // Smaller breakup so the gradient does not collapse into chunky blobs
    float edgeNoise = snoise(vec2(movingX * 1.6, p.y * 2.4 + t * 0.35));
    float breakup = clamp(0.82 + edgeNoise * 0.18, 0.35, 1.0);

    // Apply density variation mostly to the middle/outer layers,
    // while keeping the center ribbon strong.
    midDensity *= mix(0.82, densityVariation, 0.45);
    outerDensity *= densityVariation * breakup;

    // Final body gradient.
    // Values:
    // core = solid center
    // midDensity = visible halftone transition
    // outerDensity = sparse outside glow
    float body = max(
      core,
      max(
        midDensity * 0.82,
        outerDensity * 0.28
      )
    );

    // Secondary wave layer
    float secondLine = centerLine - 0.54 + sin(movingX * 1.55 + t * 0.7) * 0.10;
    float secondDist = abs(p.y - secondLine);
    float secondary = 1.0 - smoothstep(0.20, 0.44, secondDist);

    // Pixel stars instead of rectangle chunks
    vec2 starUv = floor(dithering_uv);
    vec2 starTile = floor(starUv / 5.0);
    vec2 starLocal = mod(starUv, 5.0);

    float starSpawn = step(0.979, hash21(starTile + 27.3));
    float starBand = 1.0 - smoothstep(0.75, 1.55, absDist);
    float stars = starSpawn * starBand * pixelStarShape(starLocal);

    shape = body;
    shape = max(shape, secondary * 0.18);
    shape = max(shape, stars);

  } else if (u_shape < 5.5) {
    // Ripple
    float dist = length(shape_uv);
    float waves = sin(pow(dist, 1.7) * 7.0 - 3.0 * t) * 0.5 + 0.5;
    shape = waves;

  } else if (u_shape < 6.5) {
    // Swirl
    float l = length(shape_uv);
    float angle = 6.0 * atan(shape_uv.y, shape_uv.x) + 4.0 * t;
    float twist = 1.2;
    float offset = pow(l, -twist) + angle / TWO_PI;
    float mid = smoothstep(0.0, 1.0, pow(l, twist));

    shape = mix(0.0, fract(offset), mid);

  } else {
    // Sphere
    shape_uv *= 2.0;

    float d = 1.0 - pow(length(shape_uv), 2.0);

    if (d > 0.0) {
      vec3 pos = vec3(shape_uv, sqrt(d));
      vec3 lightPos = normalize(vec3(cos(1.5 * t), 0.8, sin(1.25 * t)));
      shape = 0.5 + 0.5 * dot(lightPos, pos);
      shape *= step(0.0, d);
    } else {
      shape = 0.0;
    }
  }

  int type = int(floor(u_type));
  float dithering = 0.0;

  // Keep the final dithering grid static
  vec2 animatedDitheringUv = dithering_uv;
  vec2 animatedNoiseUv = ditheringNoise_uv;

  switch (type) {
    case 1: {
      dithering = step(hash21(animatedNoiseUv), shape);
    } break;

    case 2: {
      dithering = getBayerValue(animatedDitheringUv, 2);
    } break;

    case 3: {
      dithering = getBayerValue(animatedDitheringUv, 4);
    } break;

    default: {
      dithering = getBayerValue(animatedDitheringUv, 8);
    } break;
  }

  dithering -= 0.5;

  float res = step(0.5, shape + dithering);

  vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
  float fgOpacity = u_colorFront.a;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  float bgOpacity = u_colorBack.a;

  vec3 color = fgColor * res;
  float opacity = fgOpacity * res;

  color += bgColor * (1.0 - opacity);
  opacity += bgOpacity * (1.0 - opacity);

  fragColor = vec4(color, opacity);
}
`;

export const DitheringShapes = {
  simplex: 1,
  warp: 2,
  dots: 3,
  wave: 4,
  ripple: 5,
  swirl: 6,
  sphere: 7,
} as const;

export const DitheringTypes = {
  random: 1,
  "2x2": 2,
  "4x4": 3,
  "8x8": 4,
} as const;

export type DitheringShape = keyof typeof DitheringShapes;
export type DitheringType = keyof typeof DitheringTypes;

interface DitheringShaderProps {
  width?: number;
  height?: number;
  colorBack?: string;
  colorFront?: string;
  shape?: DitheringShape;
  type?: DitheringType;
  pxSize?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

function hexToRgba(hex: string): [number, number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    return [0, 0, 0, 1];
  }

  return [
    Number.parseInt(result[1], 16) / 255,
    Number.parseInt(result[2], 16) / 255,
    Number.parseInt(result[3], 16) / 255,
    1,
  ];
}

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shader:",
      gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program:",
      gl.getProgramInfoLog(program)
    );
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export function DitheringShader({
  width = 800,
  height = 800,
  colorBack = "#000000",
  colorFront = "#ffffff",
  shape = "simplex",
  type = "8x8",
  pxSize = 4,
  speed = 1,
  className = "",
  style = {},
}: DitheringShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);

  const uniformLocationsRef = useRef<Record<string, WebGLUniformLocation | null>>(
    {}
  );

  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) {
      return;
    }

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
    });

    if (!gl) {
      console.error("WebGL2 is not supported in this browser.");
      return;
    }

    glRef.current = gl;

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    if (!program) {
      return;
    }

    programRef.current = program;

    uniformLocationsRef.current = {
      u_time: gl.getUniformLocation(program, "u_time"),
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_colorBack: gl.getUniformLocation(program, "u_colorBack"),
      u_colorFront: gl.getUniformLocation(program, "u_colorFront"),
      u_shape: gl.getUniformLocation(program, "u_shape"),
      u_type: gl.getUniformLocation(program, "u_type"),
      u_pxSize: gl.getUniformLocation(program, "u_pxSize"),
    };

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    const positionBuffer = gl.createBuffer();

    if (!positionBuffer) {
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const resizeCanvas = () => {
      const rect = wrapper.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      const canvasWidth = Math.max(1, Math.floor(rect.width * dpr));
      const canvasHeight = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        gl.viewport(0, 0, canvasWidth, canvasHeight);
      }
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    resizeObserver.observe(wrapper);

    const render = () => {
      const currentTime = (Date.now() - startTimeRef.current) * 0.001 * speed;

      const context = glRef.current;
      const shaderProgram = programRef.current;

      if (!context || !shaderProgram || !canvasRef.current) {
        return;
      }

      resizeCanvas();

      context.clearColor(0, 0, 0, 0);
      context.clear(context.COLOR_BUFFER_BIT);
      context.useProgram(shaderProgram);

      const locations = uniformLocationsRef.current;

      if (locations.u_time) {
        context.uniform1f(locations.u_time, currentTime);
      }

      if (locations.u_resolution) {
        context.uniform2f(
          locations.u_resolution,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }

      if (locations.u_colorBack) {
        context.uniform4fv(locations.u_colorBack, hexToRgba(colorBack));
      }

      if (locations.u_colorFront) {
        context.uniform4fv(locations.u_colorFront, hexToRgba(colorFront));
      }

      if (locations.u_shape) {
        context.uniform1f(locations.u_shape, DitheringShapes[shape]);
      }

      if (locations.u_type) {
        context.uniform1f(locations.u_type, DitheringTypes[type]);
      }

      if (locations.u_pxSize) {
        context.uniform1f(locations.u_pxSize, pxSize);
      }

      context.drawArrays(context.TRIANGLES, 0, 6);

      if (speed !== 0) {
        animationRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      resizeObserver.disconnect();

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (glRef.current && programRef.current) {
        glRef.current.deleteProgram(programRef.current);
      }

      if (glRef.current && positionBuffer) {
        glRef.current.deleteBuffer(positionBuffer);
      }

      programRef.current = null;
      glRef.current = null;
    };
  }, [width, height, colorBack, colorFront, shape, type, pxSize, speed]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        position: "relative",
        width,
        height,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}