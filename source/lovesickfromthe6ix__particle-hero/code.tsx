import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// Custom hook for smooth animations
const useAnimationFrame = (callback) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  
  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [callback]);
};

// Custom hook for mouse tracking
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return mousePosition;
};

// WebGL shader sources
const vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec3 a_normal;
  
  uniform mat4 u_matrix;
  uniform mat4 u_normalMatrix;
  
  varying vec3 v_normal;
  varying vec3 v_position;
  
  void main() {
    gl_Position = u_matrix * a_position;
    v_normal = mat3(u_normalMatrix) * a_normal;
    v_position = (u_matrix * a_position).xyz;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  
  varying vec3 v_normal;
  varying vec3 v_position;
  
  uniform vec3 u_lightDirection;
  uniform vec3 u_color;
  uniform float u_time;
  
  void main() {
    vec3 normal = normalize(v_normal);
    vec3 lightDir = normalize(u_lightDirection);
    
    float light = dot(normal, lightDir);
    light = clamp(light, 0.0, 1.0);
    
    vec3 ambient = u_color * 0.3;
    vec3 diffuse = u_color * light * 0.7;
    
    // Add some animated color variation
    vec3 color = ambient + diffuse;
    sin1 = sin(u_time * 0.1 + v_position.x * 0.5)
    sin2 = sin(u_time * 0.2 + v_position.y * 0.5)
    sin3 = sin(u_time * 0.01 + v_normal.x * 0.5)
    vec3 sinus = (sin1, sin2, sin3)
    color += sinus;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Matrix math utilities
const mat4 = {
  create: () => new Float32Array(16),
  
  identity: (out) => {
    out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0;
    out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0;
    out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
    return out;
  },
  
  perspective: (out, fovy, aspect, near, far) => {
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = 2 * far * near * nf;
    out[15] = 0;
    return out;
  },
  
  multiply: (out, a, b) => {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    
    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    
    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    
    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    
    return out;
  },
  
  rotateY: (out, a, rad) => {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    
    if (a !== out) {
      out[4] = a[4]; out[5] = a[5]; out[6] = a[6]; out[7] = a[7];
      out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
    }
    return out;
  },
  
  translate: (out, a, v) => {
    const x = v[0], y = v[1], z = v[2];
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    
    if (a !== out) {
      out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; out[3] = a[3];
      out[4] = a[4]; out[5] = a[5]; out[6] = a[6]; out[7] = a[7];
      out[8] = a[8]; out[9] = a[9]; out[10] = a[10]; out[11] = a[11];
    }
    return out;
  }
};

// Main component
export const Component = () => {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [particles, setParticles] = useState([]);
  const mousePosition = useMousePosition();
  const containerRef = useRef(null);
  
  // Initialize particles
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 5,
      opacity: Math.random() * 0.3 + 0.7
    }));
    setParticles(newParticles);
  }, []);
  
  // Create cube geometry
  const createCubeGeometry = () => {
    const positions = new Float32Array([
      // Front face
      -1, -1,  1,  1, -1,  1,  1,  1,  1, -1,  1,  1,
      // Back face
      -1, -1, -1, -1,  1, -1,  1,  1, -1,  1, -1, -1,
      // Top face
      -1,  1, -1, -1,  1,  1,  1,  1,  1,  1,  1, -1,
      // Bottom face
      -1, -1, -1,  1, -1, -1,  1, -1,  1, -1, -1,  1,
      // Right face
       1, -1, -1,  1,  1, -1,  1,  1,  1,  1, -1,  1,
      // Left face
      -1, -1, -1, -1, -1,  1, -1,  1,  1, -1,  1, -1
    ]);
    
    const normals = new Float32Array([
      // Front face
       0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,
      // Back face
       0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,
      // Top face
       0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,
      // Bottom face
       0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,
      // Right face
       1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,
      // Left face
      -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0
    ]);
    
    const indices = new Uint16Array([
      0,  1,  2,    0,  2,  3,    // front
      4,  5,  6,    4,  6,  7,    // back
      8,  9, 10,    8, 10, 11,    // top
      12, 13, 14,   12, 14, 15,   // bottom
      16, 17, 18,   16, 18, 19,   // right
      20, 21, 22,   20, 22, 23    // left
    ]);
    
    return { positions, normals, indices };
  };
  
  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    
    glRef.current = gl;
    
    // Create shaders
    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };
    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }
    
    programRef.current = program;
    
    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const normalLocation = gl.getAttribLocation(program, 'a_normal');
    const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
    const normalMatrixLocation = gl.getUniformLocation(program, 'u_normalMatrix');
    const lightDirectionLocation = gl.getUniformLocation(program, 'u_lightDirection');
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    
    // Create geometry
    const geometry = createCubeGeometry();
    
    // Create buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.positions, gl.STATIC_DRAW);
    
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.normals, gl.STATIC_DRAW);
    
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);
    
    // Store references for render loop
    gl.program = program;
    gl.positionBuffer = positionBuffer;
    gl.normalBuffer = normalBuffer;
    gl.indexBuffer = indexBuffer;
    gl.positionLocation = positionLocation;
    gl.normalLocation = normalLocation;
    gl.matrixLocation = matrixLocation;
    gl.normalMatrixLocation = normalMatrixLocation;
    gl.lightDirectionLocation = lightDirectionLocation;
    gl.colorLocation = colorLocation;
    gl.timeLocation = timeLocation;
    gl.indexCount = geometry.indices.length;
    
    // Setup GL state
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    
    return () => {
      gl.deleteProgram(program);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(normalBuffer);
      gl.deleteBuffer(indexBuffer);
    };
  }, []);
  
  // Animation loop
  useAnimationFrame(useCallback((deltaTime) => {
    setRotation(prev => prev + deltaTime * 0.001);
    
    // Update particles
    setParticles(prevParticles => 
      prevParticles.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;
        let newVx = particle.vx;
        let newVy = particle.vy;
        
        if (newX < 0 || newX > 100) {
          newVx = -newVx;
          newX = Math.max(0, Math.min(100, newX));
        }
        if (newY < 0 || newY > 100) {
          newVy = -newVy;
          newY = Math.max(0, Math.min(100, newY));
        }
        
        return {
          ...particle,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy
        };
      })
    );
    
    // Render WebGL
    const gl = glRef.current;
    const canvas = canvasRef.current;
    if (!gl || !programRef.current || !canvas) return;
    
    // Resize canvas if needed
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, displayWidth, displayHeight);
    }
    
    // Clear
    gl.clearColor(0.05, 0.05, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Use program
    gl.useProgram(gl.program);
    
    // Set up attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.positionBuffer);
    gl.enableVertexAttribArray(gl.positionLocation);
    gl.vertexAttribPointer(gl.positionLocation, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.normalBuffer);
    gl.enableVertexAttribArray(gl.normalLocation);
    gl.vertexAttribPointer(gl.normalLocation, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.indexBuffer);
    
    // Create matrices
    const aspect = displayWidth / displayHeight;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, aspect, 0.1, 100);
    
    const viewMatrix = mat4.create();
    mat4.identity(viewMatrix);
    mat4.translate(viewMatrix, viewMatrix, [0, 0, -5]);
    
    const modelMatrix = mat4.create();
    mat4.identity(modelMatrix);
    mat4.rotateY(modelMatrix, modelMatrix, rotation);
    
    // Mouse influence on rotation
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (mousePosition.x - rect.left) / rect.width - 0.5;
      const mouseY = (mousePosition.y - rect.top) / rect.height - 0.5;
      mat4.rotateY(modelMatrix, modelMatrix, mouseX * 0.5);
      mat4.multiply(modelMatrix, modelMatrix, mat4.create());
    }
    
    const mvMatrix = mat4.create();
    mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    
    const mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
    
    // Set uniforms
    gl.uniformMatrix4fv(gl.matrixLocation, false, mvpMatrix);
    gl.uniformMatrix4fv(gl.normalMatrixLocation, false, modelMatrix);
    gl.uniform3fv(gl.lightDirectionLocation, [0.5, 0.7, 0.2]);
    gl.uniform3fv(gl.colorLocation, [0.65, 0.6, 1.0]);
    gl.uniform1f(gl.timeLocation, Date.now());
    
    // Draw
    gl.drawElements(gl.TRIANGLES, gl.indexCount, gl.UNSIGNED_SHORT, 0);
  }, [rotation, mousePosition]));
  
  return (
    <div ref={containerRef} className="advanced-dev-container">
      
      <div className="particles-layer">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity
            }}
          />
        ))}
      </div>
      
      <div className="glow-effect" />
      
      <div className="content-overlay">
        <h1 className="title">Say Something Bold</h1>
      </div>
    </div>
  );
};