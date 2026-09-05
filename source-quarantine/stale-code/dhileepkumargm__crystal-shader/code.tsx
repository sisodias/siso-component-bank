import React, { useRef, useEffect } from 'react';

interface InteractiveShaderProps {
  cellDensity?: number;      // How many cells in the Voronoi grid
  animationSpeed?: number;   // Speed multiplier for time
  warpFactor?: number;       // How strongly the second Voronoi field warps the first
  mouseInfluence?: number;   // How much the mouse repels the pattern
}

const InteractiveShader: React.FC<InteractiveShaderProps> = ({
  cellDensity = 8.0,
  animationSpeed = 0.2,
  warpFactor = 0.6,
  mouseInfluence = 0.15,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get WebGL context
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL is not supported in this browser.');
      return;
    }

    // Full-viewport resize helper
    function resizeCanvas() {
      // Always cover the viewport
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Account for device pixel ratio for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(iResolutionLoc, canvas.width, canvas.height);
    }

    // Mouse-tracking helper
    function handleMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    }

    // Compile a shader of given type
    function compileShader(src: string, type: number) {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);

      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    // Vertex shader (fullscreen quad)
    const vertexShaderSrc = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Fragment shader (Voronoi + warp + color)
    const fragmentShaderSrc = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform float uCellDensity;
      uniform float uAnimationSpeed;
      uniform float uWarpFactor;
      uniform float uMouseInfluence;
      #define PI 3.14159265359

      vec2 random2(vec2 p) {
        return fract(sin(vec2(
          dot(p, vec2(127.1,311.7)),
          dot(p, vec2(269.5,183.3))
        )) * 43758.5453);
      }

      // Returns shortest and second-shortest distance in a Voronoi diagram
      vec2 voronoi(vec2 x, float time) {
        vec2 n = floor(x);
        vec2 f = fract(x);

        float m = 10.0;
        float m2 = 10.0;

        for(int j = -1; j <= 1; j++){
          for(int i = -1; i <= 1; i++){
            vec2 g = vec2(float(i), float(j));
            vec2 o = random2(n + g);
            o = 0.5 + 0.5 * sin(time + o * PI * 2.0);
            float d = length(g - f + o);
            if (d < m) {
              m2 = m;
              m = d;
            } else if (d < m2) {
              m2 = d;
            }
          }
        }
        return vec2(m, m2);
      }

      void main() {
        // Normalized pixel coords
        vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);

        // Mouse in [-1..1]
        vec2 m = (iMouse * 2.0 - 1.0);
        m.y *= -1.0;

        // Repel effect
        float md = length(uv - m);
        vec2 disp = normalize(uv - m)
          * (1.0 - smoothstep(0.0, 0.5, md))
          * uMouseInfluence;
        uv -= disp;

        float t = iTime * uAnimationSpeed;
        vec2 b = voronoi(uv * uCellDensity, t);
        vec2 w = voronoi(uv * uCellDensity + b.yy * uWarpFactor, t);

        float pattern = w.y - w.x;
        vec3 baseColor = 0.5 + 0.5 * cos(t * 0.5 + vec3(0.0, 0.2, 0.4));
        baseColor *= 1.0 - smoothstep(0.01, 0.02, pattern);
        baseColor += pow(1.0 - b.x, 10.0) * 0.1;

        gl_FragColor = vec4(baseColor, 1.0);
      }
    `;

    // Compile & link the program
    const vShader = compileShader(vertexShaderSrc, gl.VERTEX_SHADER);
    const fShader = compileShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);
    if (!vShader || !fShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Look up attribute/uniform locations
    const aPosLoc = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosLoc);

    const iResolutionLoc = gl.getUniformLocation(program, 'iResolution')!;
    const iTimeLoc       = gl.getUniformLocation(program, 'iTime')!;
    const iMouseLoc      = gl.getUniformLocation(program, 'iMouse')!;
    const uCellDensityLoc     = gl.getUniformLocation(program, 'uCellDensity')!;
    const uAnimationSpeedLoc  = gl.getUniformLocation(program, 'uAnimationSpeed')!;
    const uWarpFactorLoc      = gl.getUniformLocation(program, 'uWarpFactor')!;
    const uMouseInfluenceLoc  = gl.getUniformLocation(program, 'uMouseInfluence')!;

    // Full-screen quad
    const quad = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    // Prepare GL state
    gl.clearColor(0, 0, 0, 1);

    // Start time
    const start = performance.now();
    let rafId: number;

    // Hook up events
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Main render loop
    function render() {
      gl.clear(gl.COLOR_BUFFER_BIT);

      const now = (performance.now() - start) / 1000;
      gl.uniform1f(iTimeLoc, now);
      gl.uniform2f(iMouseLoc, mousePos.current.x, mousePos.current.y);
      gl.uniform1f(uCellDensityLoc, cellDensity);
      gl.uniform1f(uAnimationSpeedLoc, animationSpeed);
      gl.uniform1f(uWarpFactorLoc, warpFactor);
      gl.uniform1f(uMouseInfluenceLoc, mouseInfluence);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    }
    render();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      if (!gl.isContextLost()) {
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);
        gl.deleteProgram(program);
        gl.deleteBuffer(buf);
      }
    };
  }, [cellDensity, animationSpeed, warpFactor, mouseInfluence]);

  // Make canvas fill viewport
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'block',
      }}
    />
  );
};

export default InteractiveShader;
