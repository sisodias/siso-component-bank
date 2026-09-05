'use client';

import { useEffect, useRef } from 'react';
import Stats from 'stats.js';

type WebGLAnimationProps = {
  // Shader sources
  vertexShaderSource?: string;
  fragmentShaderSource?: string;

  // Canvas settings
  width?: number;
  height?: number;
  devicePixelRatio?: boolean;

  // WebGL context settings
  backgroundColor?: [number, number, number, number];
  depthTest?: boolean;
  depthFunc?: 'NEVER' | 'LESS' | 'EQUAL' | 'LEQUAL' | 'GREATER' | 'NOTEQUAL' | 'GEQUAL' | 'ALWAYS';

  // Vertex buffer data
  vertexData?: number[];
  vertexCount?: number;

  // Animation settings
  showStats?: boolean;
  animationSpeed?: number;
  autoResize?: boolean;
  initialTime?: number;
  resolution?: [number, number];

  // Ripple effect settings
  rippleEffect?: {
    amplitude?: number;
    frequency?: number;
    speed?: number;
  };
};

const WebGLAnimation = ({
  vertexShaderSource,
  fragmentShaderSource,
  width = window.innerWidth,
  height = window.innerHeight,
  devicePixelRatio = true,
  backgroundColor = [0.0, 0.0, 0.0, 0.0], // Default to transparent
  depthTest = true,
  depthFunc = 'LEQUAL',
  vertexData = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0],
  vertexCount = 6,
  showStats = false,
  animationSpeed = 1.0,
  autoResize = true,
  initialTime = 0.0,
  resolution,
  rippleEffect = { amplitude: 0.1, frequency: 5.0, speed: 2.0 },
}: WebGLAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const resolutionLocationRef = useRef<WebGLUniformLocation | null>(null);
  const timeLocationRef = useRef<WebGLUniformLocation | null>(null);
  const rippleAmplitudeRef = useRef<WebGLUniformLocation | null>(null);
  const rippleFrequencyRef = useRef<WebGLUniformLocation | null>(null);
  const rippleSpeedRef = useRef<WebGLUniformLocation | null>(null);
  const statsRef = useRef<Stats | null>(null);
  const timerRef = useRef<number>(initialTime);
  const lastUpdateRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const defaultVertexShader = `
    attribute vec4 a_position;
    void main() {
      gl_Position = a_position;
    }
  `;

  const defaultFragmentShader = `
    #define PI 3.1415926535897932384626433832795
    #define HALF_PI 1.57079632679
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float time;
    uniform float u_rippleAmplitude;
    uniform float u_rippleFrequency;
    uniform float u_rippleSpeed;
    void main() {
      vec3 color = vec3(1.0, 1.0, 1.0);
      vec2 uvcopy;
      float distance;
      float offset = time;
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv = ((uv - 0.5) * 2.0);
      // Apply ripple effect
      float ripple = sin(u_rippleFrequency * length(uv) - u_rippleSpeed * time) * u_rippleAmplitude;
      uv += uv * ripple;
      for(int i=0; i <= 2; i++) {
        uvcopy = uv;
        if (u_resolution.y > u_resolution.x) {
          uvcopy.y *= u_resolution.y / u_resolution.x;
        } else {
          uvcopy.x *= u_resolution.x / u_resolution.y;
        }
        distance = length(uvcopy) * 2.0;
        offset -= 0.1;
        uvcopy += uvcopy / distance;
        uvcopy *= abs(sin(-offset) + 2.0);
        uvcopy *= abs(sin((distance * 2.0) - offset));
        uvcopy *= abs(cos((distance * 1.0) - offset));
        uvcopy.x += sin(time * 0.2) * 4.0;
        uvcopy.y += cos(time * 0.2) * 4.0;
        color[i] /= abs(length(mod(uvcopy, 1.0) - 0.5)) / 0.1;
      }
      gl_FragColor = vec4(color / distance, 1.0);
    }
  `;

  const createShader = (gl: WebGLRenderingContext, source: string, type: number) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const initializeProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);
    programRef.current = program;
  };

  const initializeModel = (gl: WebGLRenderingContext) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(programRef.current!, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    resolutionLocationRef.current = gl.getUniformLocation(programRef.current!, 'u_resolution');
    timeLocationRef.current = gl.getUniformLocation(programRef.current!, 'time');
    rippleAmplitudeRef.current = gl.getUniformLocation(programRef.current!, 'u_rippleAmplitude');
    rippleFrequencyRef.current = gl.getUniformLocation(programRef.current!, 'u_rippleFrequency');
    rippleSpeedRef.current = gl.getUniformLocation(programRef.current!, 'u_rippleSpeed');

    const effectiveResolution = resolution || [gl.canvas.width, gl.canvas.height];
    gl.uniform2f(resolutionLocationRef.current, effectiveResolution[0], effectiveResolution[1]);
    gl.uniform1f(rippleAmplitudeRef.current, rippleEffect.amplitude ?? 0.1);
    gl.uniform1f(rippleFrequencyRef.current, rippleEffect.frequency ?? 5.0);
    gl.uniform1f(rippleSpeedRef.current, rippleEffect.speed ?? 2.0);
  };

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const effectiveWidth = width * (devicePixelRatio ? window.devicePixelRatio : 1);
    const effectiveHeight = height * (devicePixelRatio ? window.devicePixelRatio : 1);
    canvas.width = effectiveWidth;
    canvas.height = effectiveHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    gl.viewport(0, 0, canvas.width, canvas.height);
    if (resolutionLocationRef.current) {
      const effectiveResolution = resolution || [canvas.width, canvas.height];
      gl.uniform2f(resolutionLocationRef.current, effectiveResolution[0], effectiveResolution[1]);
    }
  };

  const render = (timeDelta: number) => {
    const gl = glRef.current;
    if (!gl || !timeLocationRef.current) return;

    timerRef.current += (timeDelta ? timeDelta / 1000 : 0.05) * animationSpeed;
    gl.uniform1fv(timeLocationRef.current, [timerRef.current]);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  };

  const animate = () => {
    statsRef.current?.begin();
    const currentTime = Date.now();
    const timeSinceLastUpdate = currentTime - lastUpdateRef.current;
    lastUpdateRef.current = currentTime;
    render(timeSinceLastUpdate);
    statsRef.current?.end();
    animationFrameRef.current = window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true }) || canvas.getContext('experimental-webgl', { alpha: true });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl as WebGLRenderingContext;

    gl.clearColor(...backgroundColor);
    if (depthTest) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl[depthFunc]);
    } else {
      gl.disable(gl.DEPTH_TEST);
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const vertexShader = createShader(gl, vertexShaderSource || defaultVertexShader, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fragmentShaderSource || defaultFragmentShader, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    initializeProgram(gl, vertexShader, fragmentShader);
    if (!programRef.current) return;

    initializeModel(gl);
    initializeCanvas();

    if (showStats) {
      statsRef.current = new Stats();
      statsRef.current.showPanel(0);
      document.body.appendChild(statsRef.current.domElement);
    }

    lastUpdateRef.current = Date.now();
    animate();

    const handleResize = () => {
      if (autoResize) initializeCanvas();
    };
    if (autoResize) {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (autoResize) {
        window.removeEventListener('resize', handleResize);
      }
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      if (statsRef.current && statsRef.current.domElement) {
        document.body.removeChild(statsRef.current.domElement);
      }
    };
  }, [
    vertexShaderSource,
    fragmentShaderSource,
    width,
    height,
    devicePixelRatio,
    backgroundColor,
    depthTest,
    depthFunc,
    vertexData,
    vertexCount,
    showStats,
    animationSpeed,
    autoResize,
    initialTime,
    resolution,
    rippleEffect.amplitude,
    rippleEffect.frequency,
    rippleEffect.speed,
  ]);

  return <canvas ref={canvasRef} />;
};

export  { WebGLAnimation };