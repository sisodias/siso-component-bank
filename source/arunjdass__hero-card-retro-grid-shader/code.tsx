import React, { useRef, useEffect } from 'react';

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;

  
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; 
    vec3 x3 = x0 - D.yyy;      

    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
      
      float gridSize = 45.0; 
      
      
      vec2 uv = gl_FragCoord.xy / u_resolution.y; 
      
      
      vec2 id = floor(uv * gridSize);
      vec2 local_uv = fract(uv * gridSize) - 0.5;

      
      float t = u_time * 0.15;

      
      vec2 noise_uv = id / gridSize;
      
      
      float n1 = snoise(vec3(noise_uv * 1.5, t));
      float n2 = snoise(vec3(noise_uv * 2.8 + vec2(10.0), t * 1.5));
      float n3 = snoise(vec3(noise_uv * 0.9 - vec2(5.0), t * 0.5));

      
      float flow = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
      flow = flow * 0.5 + 0.5;
      
      
      vec3 col1 = vec3(0.02, 0.02, 0.04); 
      vec3 col2 = vec3(0.05, 0.15, 0.20); 
      vec3 col3 = vec3(0.15, 0.08, 0.25); 
      vec3 col4 = vec3(0.25, 0.15, 0.35); 
      vec3 col5 = vec3(0.20, 0.40, 0.45); 
      
      
      vec3 color = mix(col1, col2, smoothstep(0.1, 0.35, flow));
      color = mix(color, col3, smoothstep(0.35, 0.60, flow));
      color = mix(color, col4, smoothstep(0.60, 0.85, flow));
      color = mix(color, col5, smoothstep(0.85, 1.00, flow));

      
      float pixelScale = 0.35; 
      vec2 q = abs(local_uv) - pixelScale; 
      float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
      
      
      float pixel_shape = 1.0 - smoothstep(0.0, 0.15, dist); 
      
      
      float brightness = smoothstep(0.1, 0.9, flow) * 1.8 + 0.2;
      
      vec3 finalColor = color * pixel_shape * brightness;

      
      float gridLine = max(smoothstep(0.46, 0.5, abs(local_uv.x)), smoothstep(0.46, 0.5, abs(local_uv.y)));
      finalColor += vec3(0.015) * gridLine;

      gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function AnimatedShader({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

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

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    let animationFrameId: number;
    let startTime = Date.now();

    const render = () => {
      
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      const time = (Date.now() - startTime) * 0.001;

      gl.uniform1f(timeLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`w-full h-full ${className}`}
    />
  );
}

export default function AnimatedShaderPreview() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[700px] bg-background p-4 md:p-8">
      
      
      <div className="relative w-full max-w-4xl h-[500px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
        
        
        <AnimatedShader className="absolute inset-0" />

        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-black/10 backdrop-blur-[2px]">
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-white mb-6 text-center drop-shadow-2xl max-w-3xl font-serif">
            Meet your <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-indigo-300">AI engineer.</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-extralight text-white/60 max-w-2xl text-center mb-12 tracking-wide font-sans">
            Deploy intelligent agents that understand your codebase, automate tedious tasks, and write production-ready code in seconds. Welcome to the future of software engineering.
          </p>

          <div className="flex items-center gap-4">
             <button className="group flex items-center gap-2 px-6 py-3 rounded-md bg-white text-black font-medium hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 cursor-pointer hover:ring-2 hover:ring-white/50">
               Start Building Free
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
             </button>
             <button className="group flex items-center gap-2 px-6 py-3 rounded-md bg-white/10 text-white font-medium hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/10 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 cursor-pointer">
               Book a Demo
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
