import React, { useEffect, useRef } from 'react';

const fragmentShaderSource = `#version 300 es
precision highp float;
uniform float time;
uniform vec2 vp;
in vec2 uv;
out vec4 fragColor;

float rand(vec2 p) {
    return fract(sin(dot(p.xy, vec2(1., 300.))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = rand(i);
    float b = rand(i + vec2(1.0, 0.0));
    float c = rand(i + vec2(0.0, 1.0));
    float d = rand(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 5
float fbm(vec2 p) {
    float value = 0.;
    float amplitude = .4;
    float frequency = 0.;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(p);
        p *= 2.;
        amplitude *= .4;
    }
    return value;
}

void main() {
    vec2 p = uv.xy;
    p.x *= vp.x / vp.y; 
    float gradient = mix(p.y*.6 + .1, p.y*1.2 + .9, fbm(p));
    float speed = 0.2;
    float details = 7.;
    float force = .9;
    float shift = .5;
   
    vec2 fast = vec2(p.x, p.y - time*speed) * details;
    float ns_a = fbm(fast);
    float ns_b = force * fbm(fast + ns_a + time) - shift;    
    float nns = force * fbm(vec2(ns_a, ns_b));
    float ins = fbm(vec2(ns_b, ns_a));
    vec3 c1 = mix(vec3(.9, .5, .3), vec3(.5, .0, .0), ins + shift);
    fragColor = vec4(c1 + vec3(ins - gradient), 1.0);
}`;

class WebGLHandler {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private startTime: number;
  private timeLocation: WebGLUniformLocation | null;
  private resolutionLocation: WebGLUniformLocation | null;
  private animationId: number | null = null;

  private vertexShaderSource = `#version 300 es
    precision mediump float;
    const vec2 positions[6] = vec2[6](vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(-1.0, 1.0), vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(1.0, 1.0));
    out vec2 uv;
    void main() {
        uv = positions[gl_VertexID];
        gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
    }`;

  constructor(canvas: HTMLCanvasElement, fragmentShaderSource: string) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl2');
    if (!gl) throw new Error('WebGL2 not supported');
    this.gl = gl;
    
    this.startTime = Date.now();
    this.resize();
    
    this.program = this.gl.createProgram()!;
    this.compileShader(this.vertexShaderSource, this.gl.VERTEX_SHADER);
    this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);
    this.gl.linkProgram(this.program);
    this.gl.useProgram(this.program);
    
    this.timeLocation = this.gl.getUniformLocation(this.program, 'time');
    this.resolutionLocation = this.gl.getUniformLocation(this.program, 'vp');
    
    this.render();
  }

  resize = () => {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  };

  compileShader(source: string, type: number) {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    this.gl.attachShader(this.program, shader);
    return shader;
  }

  render = () => {
    this.gl.uniform1f(this.timeLocation, (Date.now() - this.startTime) / 1000);
    this.gl.uniform2fv(this.resolutionLocation, [this.canvas.width, this.canvas.height]);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    this.animationId = requestAnimationFrame(this.render);
  };

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

interface FireHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

const FireHero: React.FC<FireHeroProps> = ({
  title = "IGNITE",
  subtitle = "Your Digital Presence",
  description = "Experience the power of cutting-edge technology that burns brighter than the competition. Transform your vision into reality with our blazing-fast solutions.",
  primaryButtonText = "Get Started",
  secondaryButtonText = "Learn More",
  onPrimaryClick,
  onSecondaryClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webglHandlerRef = useRef<WebGLHandler | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      webglHandlerRef.current = new WebGLHandler(canvasRef.current, fragmentShaderSource);

      const handleResize = () => {
        if (webglHandlerRef.current) {
          webglHandlerRef.current.resize();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (webglHandlerRef.current) {
          webglHandlerRef.current.destroy();
        }
      };
    } catch (error) {
      console.error('Failed to initialize WebGL:', error);
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Fire Shader Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 bg-gradient-to-b from-orange-300 via-red-500 to-red-900 bg-clip-text text-transparent leading-tight">
          {title}
        </h1>
        
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
          {subtitle}
        </h2>
        
        <p className="text-lg md:text-xl text-orange-100 mb-12 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onPrimaryClick}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
          >
            {primaryButtonText}
          </button>
          
          <button 
            onClick={onSecondaryClick}
            className="px-8 py-4 border-2 border-orange-400 text-orange-300 font-semibold rounded-lg hover:bg-orange-400 hover:text-black transition-all duration-300 backdrop-blur-sm"
          >
            {secondaryButtonText}
          </button>
        </div>
      </div>
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
    </section>
  );
};

export default FireHero;