import React, { useRef, useEffect } from 'react';

// The GLSL shader code remains the same.
const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision mediump float;

    uniform vec2 iResolution;
    uniform float iTime;

    mat2 rotate2d(float angle){
        return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    }

    vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263, 0.416, 0.557);
        return a + b * cos(6.28318 * (c * t + d));
    }

    float sdCircle(vec2 p, float r) {
        return length(p) - r;
    }

    void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
        vec2 uv0 = uv;
        vec3 finalColor = vec3(0.0);

        for (float i = 0.0; i < 4.0; i++) {
            uv = rotate2d(iTime * 0.2 + i * 0.5) * uv;
            vec2 repeated_uv = fract(uv * (2.0 + i * 0.5)) - 0.5;
            float d = sdCircle(repeated_uv, 0.2);
            vec3 col = palette(length(uv0) + i * 0.4 + iTime * 0.4);
            float glow = pow(0.01 / abs(d), 1.5);
            finalColor += col * glow;
        }

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;


function ShaderComponent() {
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl');

        if (!gl) {
            console.error("WebGL not supported!");
            return;
        }

        const createShader = (gl, type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                return shader;
            }
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        };

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const createProgram = (gl, vertexShader, fragmentShader) => {
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
                return program;
            }
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        };

        const program = createProgram(gl, vertexShader, fragmentShader);
        if (!program) return;

        gl.useProgram(program);

        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        const resolutionUniformLocation = gl.getUniformLocation(program, "iResolution");
        const timeUniformLocation = gl.getUniformLocation(program, "iTime");

        const render = (time) => {
            time *= 0.001; // convert to seconds

            const displayWidth = gl.canvas.clientWidth;
            const displayHeight = gl.canvas.clientHeight;

            if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
                gl.canvas.width = displayWidth;
                gl.canvas.height = displayHeight;
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            }

            gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(timeUniformLocation, time);
            
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            animationFrameId.current = requestAnimationFrame(render);
        };

        animationFrameId.current = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ display: 'block', width: '100vw', height: '100vh' }} />;
}
export default ShaderComponent;
