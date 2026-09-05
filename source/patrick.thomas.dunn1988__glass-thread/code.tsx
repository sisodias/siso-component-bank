import React, { useRef, useEffect, useCallback } from 'react';

interface ShaderSpiralProps {
  width?: number;
  height?: number;
  className?: string;
}

const ShaderSpiralDemo: React.FC<ShaderSpiralProps> = ({
  width = 1200,
  height = 800,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  const vertexShaderSource = `#version 300 es
    in vec4 a_position;
    void main() {
      gl_Position = a_position;
    }
  `;

  const fragmentShaderSource = `#version 300 es
   
    precision highp float;
    out vec4 O;
    uniform vec2 resolution;
    uniform float time;
    #define FC gl_FragCoord.xy
    #define R resolution
    #define T time
    #define MN min(R.x,R.y)
    #define S smoothstep
    #define beat(a) pow(S(.4,.6,sin(3.1415/a*T)*.5+.5),5.)
    
    float rnd(vec2 p) {
      p=fract(p*vec2(12.9898,78.233));
      p+=dot(p,p+34.56);
      return fract(p.x*p.y);
    }
    
    float spirals(vec2 uv) {
      float c=.0, d=.0, k=.68;
      for (float i=1.;i<8.;i++) {
        c+=abs(sin(T/i)*0.07)/length(vec2(uv.y,sin(uv.y+T*i)*k)-uv.yx);
        vec2 p=uv;
        p.x-=sin(p.y+T*i)*k;
        p.y+=T*1.5;
        p.y=mod(p.y,.5)-.25;
        d+=.008/length(p);
      }
      c*=abs(d);
      return c;
    }
    
    vec3 pattern(vec2 uv) {
      float k=4./MN;
      return sqrt(spirals(uv*.95)*vec3(
        spirals(uv-k),
        spirals(uv),
        spirals(uv+k)
      ))*0.15;
    }
    
    void main(){
      vec3 col=vec3(0);
      float
      tt=beat(3.),
      t =beat(6.),
      m =S(1e-3,.5,1./(10.+90.*(1.-tt))),
      n =S(1e-3,.5,1./(7.+93.*tt));
      vec2 uv=(FC-.5*R)/MN;
      if (R.x>R.y) uv=vec2(uv.y,-uv.x);
      uv*=1.5+sqrt(t*.8);
      vec2 p=uv*(1.+.25*sqrt(t));
      uv-=uv*mix(.2,1.,rnd(uv))*n;
      p-=p*mix(.4,.8,rnd(FC))*m;
      col+=vec3(pow(sin(p.x*10.)*cos(p.y*10.),.2))*.2;
      col=max(col,pattern(uv));
      O=vec4(col,1);
    }
  `;

  const createShader = useCallback((gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }, []);

  const createProgram = useCallback((gl: WebGL2RenderingContext): WebGLProgram | null => {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
  }, [createShader, vertexShaderSource, fragmentShaderSource]);

  const setupGeometry = useCallback((gl: WebGL2RenderingContext, program: WebGLProgram): void => {
    const vertices = new Float32Array([
      -1.0, -1.0,
      1.0, -1.0,
      -1.0, 1.0,
      1.0, 1.0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  }, []);

  const render = useCallback((gl: WebGL2RenderingContext, program: WebGLProgram): void => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const timeLocation = gl.getUniformLocation(program, 'time');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');

    const currentTime = (Date.now() - startTimeRef.current) / 3000.0;

    gl.uniform1f(timeLocation, currentTime);
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, []);

  const animate = useCallback((): void => {
    const gl = glRef.current;
    const program = programRef.current;

    if (gl && program) {
      render(gl, program);
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [render]);

  const initWebGL = useCallback((): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL2 is not supported');
      return false;
    }

    glRef.current = gl;

    const program = createProgram(gl);
    if (!program) return false;

    programRef.current = program;

    setupGeometry(gl, program);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    return true;
  }, [createProgram, setupGeometry]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    if (initWebGL()) {
      startTimeRef.current = Date.now();
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const gl = glRef.current;
      const program = programRef.current;

      if (gl && program) {
        gl.deleteProgram(program);
      }
    };
  }, [width, height, initWebGL, animate]);

  return (
    <div className={`w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black ${className}`}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=BBH+Hegarty&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Imperial+Script&display=swap');
        `}
      </style>
      
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          display: 'block',
          background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #000000 90%)'
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-4">
        <div className="text-center select-none max-w-6xl">
          <h1 
            className="font-black tracking-wider leading-none text-white mb-8"
            style={{
              fontSize: 'clamp(3rem, 12vw, 10rem)',
              fontFamily: "'BBH Hegarty', system-ui, sans-serif",
              textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(255,255,255,0.2)'
            }}
          >
            DEATH <span style={{ fontFamily: "'Imperial Script', cursive", fontWeight: '400' }}>&</span> TAXES
          </h1>
          
          <p 
            className="text-white/70 mb-12 leading-relaxed"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
              fontWeight: '300',
              letterSpacing: '0.05em',
              maxWidth: '800px',
              margin: '0 auto 3rem',
              fontFamily: "'BBH Hegarty', system-ui, sans-serif"
            }}
          >
            The <span style={{ fontFamily: "'Bodini Moda', serif", fontSize: '1.2em' }}>only</span> two certainties in life. Buy your headstone today.
          </p>

          <div className="flex gap-4 justify-center pointer-events-auto">
            <button 
              className="px-8 py-4 bg-white text-black font-bold tracking-wide transition-all duration-300 hover:bg-white/90 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              style={{
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              GET STARTED
            </button>
            <button 
              className="px-8 py-4 border-2 border-white text-white font-bold tracking-wide transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              style={{
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              LEARN MORE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Component = ShaderSpiralDemo;
export default Component;