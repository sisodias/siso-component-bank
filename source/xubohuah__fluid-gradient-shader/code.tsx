"use client";

import React, { useRef, useEffect } from "react";

const fragmentShader = `
precision mediump float;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 2.0;

    for(int i = 0; i < 6; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }

    return value;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 aspect = vec2(u_resolution.x/u_resolution.y, 1.0);
    uv = uv * 2.0 - 1.0;
    uv *= aspect;
    
    vec2 mouse = u_mouse.xy / u_resolution.xy;
    mouse = mouse * 2.0 - 1.0;
    mouse *= aspect;

    float mouseInfluence = length(uv - mouse);
    mouseInfluence = 1.0 - smoothstep(0.0, 0.6, mouseInfluence);

    // Slower, more elegant motion
    vec2 motion = vec2(u_time * 0.08, u_time * 0.06);
    float f1 = fbm(uv * 2.5 + motion);
    float f2 = fbm(uv * 1.8 - motion * 0.7 + f1 * 0.8);
    float f3 = fbm(uv * 3.5 + f2 * 0.6 + motion * 0.4);

    // More elegant color palette - sunset/aurora inspired
    vec3 color1 = vec3(0.95, 0.7, 0.5);   // Warm peach
    vec3 color2 = vec3(0.4, 0.3, 0.7);    // Soft purple
    vec3 color3 = vec3(0.15, 0.2, 0.35);  // Deep ocean blue
    vec3 color4 = vec3(1.0, 0.85, 0.7);   // Soft cream
    
    // Mouse adds golden highlight
    vec3 mouseColor = vec3(1.0, 0.9, 0.6);
    
    // Create smooth noise value for color mixing
    float noiseBlend = f1 * 0.5 + f2 * 0.3 + f3 * 0.2;
    noiseBlend = smoothstep(0.2, 0.8, noiseBlend);
    
    // Multi-layer color blending for depth
    vec3 baseColor = mix(color3, color2, smoothstep(0.0, 0.5, f1));
    vec3 midColor = mix(baseColor, color1, smoothstep(0.3, 0.7, f2));
    vec3 finalColor = mix(midColor, color4, smoothstep(0.5, 0.9, f3 * 0.8));
    
    // Add subtle color variations
    finalColor = mix(finalColor, color2, sin(f1 * 3.14159) * 0.15);
    
    // Mouse interaction adds warmth
    finalColor = mix(finalColor, mouseColor, mouseInfluence * 0.25 * (0.8 + 0.2 * sin(u_time * 2.0)));
    
    // Subtle brightness modulation
    float brightness = 0.95 + 0.05 * sin(noiseBlend * 6.28319 + u_time * 0.5);
    finalColor *= brightness;
    
    // Soft vignette for depth
    float vignette = 1.0 - dot(uv * 0.7, uv * 0.7) * 0.3;
    finalColor *= vignette;
    
    // Gentle contrast adjustment
    finalColor = pow(finalColor, vec3(0.92));
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

const vertexShader = `
attribute vec3 a_position;

void main() {
    gl_Position = vec4(a_position, 1.0);
}
`;

export default function FluidGradient() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>();
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
    const startTimeRef = useRef(Date.now());

    // Initialize WebGL
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl', {
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false
        });

        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        glRef.current = gl;
        
        // Set clear color to transparent
        gl.clearColor(0.0, 0.0, 0.0, 0.0);

        // Create shaders
        const createShader = (type: number, source: string) => {
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
        };

        const vShader = createShader(gl.VERTEX_SHADER, vertexShader);
        const fShader = createShader(gl.FRAGMENT_SHADER, fragmentShader);
        
        if (!vShader || !fShader) return;

        // Create program
        const program = gl.createProgram();
        if (!program) return;
        
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
            return;
        }
        
        programRef.current = program;
        gl.useProgram(program);

        // Get uniform locations
        uniformsRef.current = {
            u_mouse: gl.getUniformLocation(program, 'u_mouse'),
            u_resolution: gl.getUniformLocation(program, 'u_resolution'),
            u_time: gl.getUniformLocation(program, 'u_time')
        };

        // Create geometry
        const vertices = new Float32Array([
            -1, -1, 0,
             1, -1, 0,
            -1,  1, 0,
             1,  1, 0
        ]);

        // Position buffer
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        const positionLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        return () => {
            gl.deleteProgram(program);
            gl.deleteShader(vShader);
            gl.deleteShader(fShader);
        };
    }, []);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            const dpr = Math.min(window.devicePixelRatio, 2);
            const width = container.clientWidth;
            const height = container.clientHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            const gl = glRef.current;
            if (gl) {
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle mouse move with damping for smoother movement
    useEffect(() => {
        let targetMouse = { x: 0, y: 0 };
        const currentMouse = { x: 0, y: 0 };
        let animationId: number;

        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            
            const dpr = Math.min(window.devicePixelRatio, 2);
            targetMouse = {
                x: (clientX - rect.left) * dpr,
                y: (canvas.height - (clientY - rect.top) * dpr)
            };
        };

        // Smooth mouse interpolation
        const updateMouse = () => {
            const damping = 0.1;
            currentMouse.x += (targetMouse.x - currentMouse.x) * damping;
            currentMouse.y += (targetMouse.y - currentMouse.y) * damping;
            mouseRef.current = currentMouse;
            animationId = requestAnimationFrame(updateMouse);
        };
        
        updateMouse();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleMouseMove);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleMouseMove);
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, []);

    // Animation loop
    useEffect(() => {
        const animate = () => {
            const canvas = canvasRef.current;
            const gl = glRef.current;
            const program = programRef.current;
            
            if (!canvas || !gl || !program) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            // Clear and render
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Update uniforms
            const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
            
            if (uniformsRef.current.u_mouse) {
                gl.uniform2f(uniformsRef.current.u_mouse, mouseRef.current.x, mouseRef.current.y);
            }
            
            if (uniformsRef.current.u_resolution) {
                gl.uniform2f(uniformsRef.current.u_resolution, canvas.width, canvas.height);
            }
            
            if (uniformsRef.current.u_time) {
                gl.uniform1f(uniformsRef.current.u_time, elapsedTime);
            }

            // Draw
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full">
            <canvas 
                ref={canvasRef}
                className="w-full h-full"
            />
        </div>
    );
}

export const Component = FluidGradient;