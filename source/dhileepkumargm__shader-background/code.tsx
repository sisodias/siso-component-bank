import React, { useRef, useEffect, useState } from 'react';

/**
 * Props for the ShaderBackground component.
 */
interface ShaderBackgroundProps extends React.ComponentProps<'canvas'> {
  /** The base hue for the shader's color palette, ranging from 0 to 360. */
  hue?: number;
  /** Controls the animation speed of the shader effect. */
  speed?: number;
  /** The overall brightness and intensity of the visual effect. */
  intensity?: number;
  /** Controls the scale and complexity of the noise pattern. */
  size?: number;
}

/**
 * A reusable, theme-aware, and accessible animated shader background component.
 * It follows modern best practices and is designed for high-quality web experiences.
 */
export const ShaderBackground: React.FC<ShaderBackgroundProps> = ({
  hue = 310,
  speed = 3.0,
  intensity = 0.7,
  size = 5.0,
  className,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Accessibility: Check if the user prefers reduced motion.
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const gl = canvas.getContext("webgl", { antialias: true });
    if (!gl) {
      console.error("WebGL is not supported in this browser.");
      return;
    }

    let animationFrameId: number;

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        const dpr = Math.min(window.devicePixelRatio, 2);
        const { clientWidth, clientHeight } = canvas.parentElement;
        canvas.width = clientWidth * dpr;
        canvas.height = clientHeight * dpr;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      
      #define OCTAVE_COUNT 8

      vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
      }

      mat2 rotate2d(float angle) {
          return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      }

      float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
                     mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float fbm(vec2 st) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; i++) {
              value += amplitude * noise(st);
              st *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      void main() {
          vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
          
          vec2 p = uv * uSize;
          p = rotate2d(iTime * uSpeed * 0.05) * p;
          
          float noise_val = fbm(p + iTime * uSpeed * 0.1);
          float flow = fbm(p * 0.2 + vec2(iTime * uSpeed * 0.05));
          noise_val += flow * 0.4;

          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
          
          vec3 final_color = baseColor * smoothstep(0.4, 0.6, noise_val) * uIntensity;
          final_color += baseColor * 0.15 * pow(noise_val, 2.5);

          gl_FragColor = vec4(final_color, 1.0);
      }
    `;

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Shader compile error:`, gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const uHueLocation = gl.getUniformLocation(program, "uHue");
    const uSpeedLocation = gl.getUniformLocation(program, "uSpeed");
    const uIntensityLocation = gl.getUniformLocation(program, "uIntensity");
    const uSizeLocation = gl.getUniformLocation(program, "uSize");

    const startTime = performance.now();
    
    const renderLoop = () => {
      if (!gl || gl.isContextLost()) {
        cancelAnimationFrame(animationFrameId);
        return;
      }
      
      gl.uniform2f(iResolutionLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform1f(iTimeLocation, (performance.now() - startTime) / 1000.0);
      gl.uniform1f(uHueLocation, hue);
      gl.uniform1f(uSpeedLocation, speed);
      gl.uniform1f(uIntensityLocation, intensity);
      gl.uniform1f(uSizeLocation, size);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    
    renderLoop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      if (gl && !gl.isContextLost()) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(vertexBuffer);
      }
    };
  }, [hue, speed, intensity, size, prefersReducedMotion]);

  // Render a static, theme-aware fallback if motion is disabled
  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 bg-background -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10" />
      </div>
    );
  }

  return <canvas ref={canvasRef} className={`absolute top-0 left-0 w-full h-full -z-10 ${className}`} {...props} />;
};
