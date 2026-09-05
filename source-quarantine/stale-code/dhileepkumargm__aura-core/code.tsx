import React, { useRef, useEffect, useState } from 'react';

// --- OGL Library Inlined ---
// To resolve the import error, the necessary classes from the OGL library
// have been included directly in this file. This makes the component self-contained.

class Vec2 extends Array {
    constructor(x = 0, y = 0) {
        super(x, y);
        return this;
    }
    get x() {
        return this[0];
    }
    get y() {
        return this[1];
    }
    set x(v) {
        this[0] = v;
    }
    set y(v) {
        this[1] = v;
    }
    set(x, y) {
        if (x.length) return this.copy(x);
        this[0] = x;
        this[1] = y;
        return this;
    }
    copy(v) {
        this[0] = v[0];
        this[1] = v[1];
        return this;
    }
}

class Color extends Array {
    constructor(r, g, b) {
        if (r && r.length === 3) return super(...r);
        return super(r, g, b);
    }

    get r() {
        return this[0];
    }
    get g() {
        return this[1];
    }
    get b() {
        return this[2];
    }
    set r(v) {
        this[0] = v;
    }
    set g(v) {
        this[1] = v;
    }
    set b(v) {
        this[2] = v;
    }

    set(r, g, b) {
        if (r.length) return this.copy(r);
        this[0] = r;
        this[1] = g;
        this[2] = b;
        return this;
    }

    copy(v) {
        this[0] = v[0];
        this[1] = v[1];
        this[2] = v[2];
        return this;
    }
}


let ID = 1;
let ATTR_ID = 1;

class Geometry {
    constructor(gl, attributes = {}) {
        this.gl = gl;
        this.attributes = attributes;
        this.id = ID++;
        
        this.drawRange = {
            start: 0,
            count: 0
        };
        this.instancedCount = 0;

        for (let key in attributes) {
            this.addAttribute(key, attributes[key]);
        }
    }
    addAttribute(key, attr) {
        this.attributes[key] = attr;
        attr.id = ATTR_ID++;
        if (attr.data.length && !this.drawRange.count) {
            this.drawRange.count = attr.data.length / attr.size;
        }
    }
}

class Program {
    constructor(gl, {
        vertex,
        fragment,
        uniforms = {}
    } = {}) {
        this.gl = gl;
        this.uniforms = uniforms;
        this.vertex = vertex;
        this.fragment = fragment;
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertex);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(vertexShader));
        }

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragment);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(fragmentShader));
        }

        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(this.program));
        }

        this.uniformLocations = new Map();
        const numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniforms; i++) {
            const uniform = gl.getActiveUniform(this.program, i);
            this.uniformLocations.set(uniform.name, gl.getUniformLocation(this.program, uniform.name));
        }
        this.attributeLocations = new Map();
        const numAttribs = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttribs; i++) {
            const attrib = gl.getActiveAttrib(this.program, i);
            this.attributeLocations.set(attrib.name, gl.getAttribLocation(this.program, attrib.name));
        }
    }
    use() {
        this.gl.useProgram(this.program);
    }
}

class Mesh {
    constructor(gl, {
        geometry,
        program
    }) {
        this.gl = gl;
        this.geometry = geometry;
        this.program = program;

        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);

        Object.keys(this.geometry.attributes).forEach(key => {
            const attr = this.geometry.attributes[key];
            const location = this.program.attributeLocations.get(key);
            if (location === undefined) return;
            this.gl.enableVertexAttribArray(location);
            const buffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, attr.data, this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(location, attr.size, this.gl.FLOAT, false, 0, 0);
        });
        this.gl.bindVertexArray(null);
    }
    draw() {
        this.program.use();
        Object.keys(this.program.uniforms).forEach(key => {
            const uniform = this.program.uniforms[key];
            const location = this.program.uniformLocations.get(key);
            if (!location) return;
            if (uniform.value instanceof Color) {
                this.gl.uniform3fv(location, uniform.value);
            } else if (uniform.value instanceof Vec2) {
                this.gl.uniform2fv(location, uniform.value);
            } else {
                this.gl.uniform1f(location, uniform.value);
            }
        });
        
        this.gl.bindVertexArray(this.vao);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.geometry.drawRange.count);
    }
}

class Renderer {
    constructor({
        canvas,
        dpr = 1,
        antialias = false
    }) {
        this.dpr = dpr;
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2', {
            antialias
        });
    }
    setSize(width, height) {
        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }
    render({
        scene
    }) {
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        scene.draw();
    }
}

const Triangle = (gl) => new Geometry(gl, {
    position: {
        size: 2,
        data: new Float32Array([-1, -1, 3, -1, -1, 3])
    },
    uv: {
        size: 2,
        data: new Float32Array([0, 0, 2, 0, 0, 2])
    },
});

// --- End of Inlined OGL Library ---


// The main GLSL code for the shader, written as a string.
const fragmentShader = `
    precision highp float;

    // Uniforms are variables passed from JavaScript to the shader.
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec3 uColor;
    uniform float uPower;
    uniform float uFocus;
    uniform float uDistortion;

    varying vec2 vUv;

    // Function to convert HSV (Hue, Saturation, Value) color to RGB.
    // This makes it easy to change the color scheme with a single 'hue' value.
    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    // 2D random function.
    float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // 2D noise function based on the random function.
    float noise (vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
    }

    // Fractal Brownian Motion (fbm) - creates more complex, layered noise.
    float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
            value += amplitude * noise(st);
            st *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }

    void main() {
        // Normalize coordinates, making (0,0) the center.
        vec2 uv = (vUv - 0.5) * uResolution / min(uResolution.x, uResolution.y);
        
        // --- Mouse Interaction ---
        // Calculate distance from the current pixel to the mouse position.
        float mouseDist = distance(uv, uMouse);
        // The power of the effect increases as the mouse gets closer to the center.
        float mouseEffect = smoothstep(1.0, 0.0, mouseDist) * uPower;

        // --- The Core ---
        float dist = length(uv);
        float core = smoothstep(0.2, 0.18, dist); // A soft-edged circle.
        
        // --- Core Distortion ---
        // Create a time-varying, distorted coordinate space for the core texture.
        vec2 distortedUv = uv + vec2(
            fbm(uv * 2.0 + uTime * 0.1),
            fbm(uv * 2.0 - uTime * 0.1)
        ) * 0.1 * uDistortion;
        float coreTexture = fbm(distortedUv * 5.0 + uTime * 0.2);
        core *= coreTexture * (1.0 + mouseEffect); // Apply texture and mouse effect.

        // --- The Rays ---
        float angle = atan(uv.y, uv.x);
        float rays = 0.0;
        // Create 10 rotating rays using sine waves based on the angle.
        for(int i = 0; i < 10; i++){
            float angle_offset = float(i) * (3.14159 * 2.0 / 10.0);
            rays += pow(abs(sin(angle * 5.0 + uTime * 0.5 + angle_offset)), uFocus);
        }
        // The rays fade out from the center and are boosted by the mouse.
        rays *= smoothstep(0.8, 0.0, dist) * (1.0 + mouseEffect * 2.0);

        // --- The Particles/Glow ---
        // Create a field of shimmering particles using noise.
        float particles = fbm(uv * 4.0 + uTime * 0.1) * 0.2;
        particles *= smoothstep(0.6, 0.0, dist); // Fade particles away from the center.

        // --- Final Composition ---
        // Combine all layers: core, rays, and particles.
        float final_color = core + rays + particles;
        
        // Convert the base color (from JS) and the calculated brightness into a final RGB color.
        vec3 hsv = vec3(uColor.r, 0.7, final_color * (0.5 + mouseEffect));
        vec3 rgb = hsv2rgb(hsv);

        gl_FragColor = vec4(rgb, 1.0);
    }
`;

const vertexShader = `
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;

// A simple slider component for the UI.
const Slider = ({ label, value, min, max, step, onChange }) => (
    <div className="flex flex-col space-y-2">
        <label className="text-xs font-medium text-gray-400">{label}</label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
        />
    </div>
);

// The main React component.
const AuraCore = () => {
    const canvasRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const programRef = useRef(null);

    // State variables to hold the shader parameters, controlled by sliders.
    const [hue, setHue] = useState(210);
    const [power, setPower] = useState(1.5);
    const [focus, setFocus] = useState(30.0);
    const [distortion, setDistortion] = useState(1.0);

    // This effect runs only once to initialize the WebGL scene.
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const renderer = new Renderer({ canvas, dpr: Math.min(window.devicePixelRatio, 2), antialias: true });
        const gl = renderer.gl;

        const geometry = Triangle(gl);

        const program = new Program(gl, {
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vec2(gl.canvas.width, gl.canvas.height) },
                uMouse: { value: new Vec2() },
                uColor: { value: new Color(0,0,0) },
                uPower: { value: 0 },
                uFocus: { value: 0 },
                uDistortion: { value: 0 },
            },
        });
        programRef.current = program;

        const mesh = new Mesh(gl, { geometry, program });

        const handleResize = () => {
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            program.uniforms.uResolution.value.set(gl.canvas.width, gl.canvas.height);
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const normalizedX = (e.clientX - rect.left) / rect.width * 2 - 1;
            const normalizedY = -((e.clientY - rect.top) / rect.height * 2 - 1);
            
            const aspectRatio = rect.width / rect.height;
            mousePos.current = { x: normalizedX * aspectRatio, y: normalizedY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        let animationFrameId;
        const animate = (t) => {
            animationFrameId = requestAnimationFrame(animate);
            program.uniforms.uTime.value = t * 0.001;
            program.uniforms.uMouse.value.set(mousePos.current.x, mousePos.current.y);
            renderer.render({ scene: mesh });
        };
        animate(0);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []); // Empty dependency array ensures this runs only once.

    // This effect runs whenever the slider values change to update the uniforms.
    useEffect(() => {
        if (programRef.current) {
            programRef.current.uniforms.uColor.value.set(hue / 360, 1, 1);
            programRef.current.uniforms.uPower.value = power;
            programRef.current.uniforms.uFocus.value = focus;
            programRef.current.uniforms.uDistortion.value = distortion;
        }
    }, [hue, power, focus, distortion]);

    return (
        <div className="relative w-full h-full bg-black">
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute z-10 bottom-4 left-4 right-4 md:left-auto md:w-72 p-4 rounded-lg
                            bg-black/30 backdrop-blur-md border border-white/10 text-white shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Aura Core Controls</h2>
                    <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                </div>
                <div className="space-y-4">
                    <Slider label="Hue" value={hue} min="0" max="360" step="1" onChange={(e) => setHue(parseFloat(e.target.value))} />
                    <Slider label="Power" value={power} min="0.1" max="5.0" step="0.1" onChange={(e) => setPower(parseFloat(e.target.value))} />
                    <Slider label="Ray Focus" value={focus} min="5.0" max="100.0" step="1.0" onChange={(e) => setFocus(parseFloat(e.target.value))} />
                    <Slider label="Distortion" value={distortion} min="0.0" max="3.0" step="0.1" onChange={(e) => setDistortion(parseFloat(e.target.value))} />
                </div>
            </div>
        </div>
    );
};
export default AuraCore;