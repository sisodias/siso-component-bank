import React, { useRef, useEffect } from 'react';

// --- Custom Hook for Raw WebGL Management ---
// This hook encapsulates all the WebGL setup, state management, and the animation loop.
const useWebGLShader = (canvasRef, fragmentShader, props) => {
  const webglState = useRef(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  // This useEffect handles the one-time setup of the WebGL context, shaders, and program.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: true });
    if (!gl) {
      console.error("WebGL is not supported in this browser.");
      return;
    }

    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragShader = compileShader(fragmentShader, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const positionAttributeLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const uniformLocations = {
      iTime: gl.getUniformLocation(program, 'iTime'),
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      iMouse: gl.getUniformLocation(program, 'iMouse'),
      uHue: gl.getUniformLocation(program, 'uHue'),
      uShape: gl.getUniformLocation(program, 'uShape'),
      uSpeed: gl.getUniformLocation(program, 'uSpeed'),
    };

    webglState.current = { gl, program, uniformLocations, vertexBuffer };

    return () => {
      if (gl && !gl.isContextLost()) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragShader);
        gl.deleteBuffer(vertexBuffer);
      }
    };
  }, [canvasRef, fragmentShader]);
  
  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mousePos.current = {
            x: (e.clientX - rect.left) / rect.width,
            y: 1.0 - (e.clientY - rect.top) / rect.height,
        };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [canvasRef]);


  // Animation loop and resizing
  useEffect(() => {
    if (!webglState.current) return;
    
    const { gl, uniformLocations } = webglState.current;
    const startTime = performance.now();
    let animationFrameId;

    const handleResize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uniformLocations.iResolution, canvas.width, canvas.height);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    const animate = () => {
      const time = ((performance.now() - startTime) / 1000.0);
      
      gl.uniform1f(uniformLocations.iTime, time);
      gl.uniform2f(uniformLocations.iMouse, mousePos.current.x, mousePos.current.y);
      gl.uniform1f(uniformLocations.uHue, props.hue);
      gl.uniform1f(uniformLocations.uShape, props.shape);
      gl.uniform1f(uniformLocations.uSpeed, props.speed);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [webglState, canvasRef, props]);
};

// --- UI Controls Component ---
export const ControlsPanel = ({ params, onParamChange }) => (
  <div className="absolute top-4 left-4 bg-gray-900/60 backdrop-blur-xl text-white p-6 rounded-2xl shadow-2xl w-[340px] border border-white/10 transition-all duration-300">
    <h1 className="text-2xl font-bold mb-6 tracking-wider text-white/90">Crystalline Growth</h1>
    
    {[
      { name: 'Color Hue', key: 'hue', min: 0, max: 360, step: 1, value: params.hue },
      { name: 'Growth Speed', key: 'speed', min: 0, max: 1, step: 0.01, value: params.speed },
      { name: 'Crystal Shape', key: 'shape', min: 0.0, max: 1, step: 0.01, value: params.shape },
    ].map(p => (
      <div className="mb-4" key={p.key}>
        <label htmlFor={p.key} className="block mb-2 text-sm font-medium text-white/80">
          {p.name}: {p.value.toFixed(p.step < 1 ? 2 : 0)}
        </label>
        <input
          id={p.key}
          type="range"
          min={p.min}
          max={p.max}
          step={p.step}
          value={p.value}
          onChange={onParamChange(p.key)}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
      </div>
    ))}
  </div>
);

// --- Shader Component ---
export const InteractiveShader = (props) => {
  const canvasRef = useRef(null);

  const fragmentShader = `
    precision highp float;
    uniform float iTime;
    uniform vec2 iResolution;
    uniform vec2 iMouse;
    uniform float uHue;
    uniform float uShape;
    uniform float uSpeed;

    // --- UTILITY FUNCTIONS ---
    vec3 hsv2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
      return c.z * mix(vec3(1.0), rgb, c.y);
    }
    
    mat3 rotationMatrix(vec3 axis, float angle) {
        axis = normalize(axis);
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;
        return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
                    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
    }

    // --- SIGNED DISTANCE FUNCTIONS (SDFs) ---
    // These functions calculate the shortest distance from a point to a surface.
    
    float sdBox(vec3 p, vec3 b) {
      vec3 q = abs(p) - b;
      return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }

    float sdSphere(vec3 p, float s) {
      return length(p) - s;
    }

    // --- SCENE DEFINITION ---
    // This function defines the entire 3D scene using SDFs.
    float map(vec3 p) {
        float time = iTime * uSpeed;
        
        // Create a repeating grid space
        p = mod(p, 4.0) - 2.0;

        // Animate the growth of the crystals
        float growth = sin(time) * 0.5 + 0.5;
        growth = pow(growth, 2.0);

        // Base shape is a box
        float box = sdBox(p, vec3(0.5, 0.5, 0.5) * growth);
        
        // Carve out spheres from the box corners
        float sphere = sdSphere(abs(p) - 0.2, 0.4 * growth);

        // Blend between the box and the carved shape
        float final_shape = mix(box, max(box, -sphere), uShape);
        
        return final_shape;
    }

    // --- RAYMARCHING ---
    // This function "marches" a ray through the scene to find intersections.
    float rayMarch(vec3 ro, vec3 rd) {
        float d = 0.0;
        for(int i = 0; i < 100; i++) {
            vec3 p = ro + rd * d;
            float ds = map(p);
            d += ds;
            if(d > 100.0 || abs(ds) < 0.001) break;
        }
        return d;
    }
    
    // Calculate the normal of a surface for lighting
    vec3 getNormal(vec3 p) {
        vec2 e = vec2(0.001, 0.0);
        return normalize(vec3(
            map(p + e.xyy) - map(p - e.xyy),
            map(p + e.yxy) - map(p - e.yxy),
            map(p + e.yyx) - map(p - e.yyx)
        ));
    }

    // --- MAIN SHADER LOGIC ---
    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
      vec2 mouse = (iMouse - 0.5);

      // --- Camera Setup ---
      vec3 ro = vec3(0.0, 0.0, -5.0); // Ray Origin (camera position)
      vec3 rd = normalize(vec3(uv, 1.0)); // Ray Direction
      
      // Rotate camera based on time and mouse position
      mat3 rot = rotationMatrix(normalize(vec3(mouse.y, mouse.x, 0.0)), iTime * 0.1);
      ro = rot * ro;
      rd = rot * rd;

      // --- Rendering ---
      float d = rayMarch(ro, rd);
      vec3 col = vec3(0.0);

      if (d < 100.0) {
        vec3 p = ro + rd * d;
        vec3 normal = getNormal(p);
        
        // --- Lighting ---
        vec3 lightPos = ro + vec3(sin(iTime), cos(iTime), 0.0);
        vec3 lightDir = normalize(lightPos - p);
        float diffuse = max(dot(normal, lightDir), 0.1);
        
        // --- Coloring ---
        float hue = uHue / 360.0 + (d * 0.05);
        vec3 baseColor = hsv2rgb(vec3(hue, 0.7, 0.8));
        
        col = baseColor * diffuse;
        
        // Add some ambient occlusion and fog
        col *= exp(-0.1 * d);
      }
      
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  useWebGLShader(canvasRef, fragmentShader, props);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};
