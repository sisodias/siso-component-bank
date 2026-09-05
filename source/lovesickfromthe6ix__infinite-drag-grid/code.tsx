// InfiniteDragGrid.tsx - Complete fixed version
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, MousePointer, Hand } from 'lucide-react';

export interface GridItem {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface InfiniteDragGridProps {
  gridItems: GridItem[];
  animationEnabled?: boolean;
  onItemClick?: (item: GridItem) => void;
  gridColumns?: number;
  gridRows?: number;
  itemWidth?: number;
  itemHeight?: number;
  gap?: number;
  enablePostProcessing?: boolean;
}

// Enhanced WebGL2 Fragment Shader with new effects
const FRAGMENT_SHADER_SOURCE = `#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform sampler2D u_previousTexture;
uniform vec2 u_resolution;
uniform vec2 u_velocity;
uniform float u_time;
uniform float u_velocityMagnitude;
uniform vec2 u_cameraShake;

in vec2 v_texCoord;
out vec4 fragColor;

float noise(vec2 uv) {
  return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

vec4 motionBlur(vec2 uv, vec2 velocity) {
  vec4 color = vec4(0.0);
  float samples = 32.0 + u_velocityMagnitude * 32.0;
  float blurStrength = u_velocityMagnitude * 0.03;
  
  for (float i = 0.0; i < 16.0; i++) {
    if (i >= samples) break;
    float t = i / samples;
    vec2 offset = velocity * t * blurStrength;
    color += texture(u_texture, uv - offset);
  }
  
  return color / samples;
}

vec4 chromaticAberration(vec2 uv, float amount) {
  float fadeAmount = smoothstep(0.0, 3.0, u_velocityMagnitude) * amount * 0.5;
  vec2 offset = normalize(u_velocity) * fadeAmount * 0.003;
  
  float r = texture(u_texture, uv + offset).r;
  float g = texture(u_texture, uv).g;
  float b = texture(u_texture, uv - offset).b;
  float a = texture(u_texture, uv).a;
  
  return vec4(r, g, b, a);
}

float vignette(vec2 uv) {
  vec2 center = vec2(0.5);
  float dist = distance(uv, center);
  return 1.0 - smoothstep(0.3, 0.9, dist) * (u_velocityMagnitude * 0.01);
}

float filmGrain(vec2 uv) {
  float grainIntensity = 0.02 + u_velocityMagnitude * 0.04;
  return (noise(uv + u_time * 0.1) - 0.5) * grainIntensity;
}

vec4 bloom(vec2 uv) {
  vec4 color = texture(u_texture, uv);
  vec4 bloom = vec4(0.0);
  
  float bloomSize = 1.0 + u_velocityMagnitude * 2.0;
  float bloomIntensity = u_velocityMagnitude * 0.5;
  
  for (float x = -2.0; x <= 2.0; x += 1.0) {
    for (float y = -2.0; y <= 2.0; y += 1.0) {
      vec2 offset = vec2(x, y) * bloomSize / u_resolution;
      bloom += texture(u_texture, uv + offset) * bloomIntensity;
    }
  }
  
  bloom /= 25.0;
  return color + bloom;
}

void main() {
  vec2 uv = v_texCoord;
  
  uv += u_cameraShake / u_resolution;
  uv = clamp(uv, 0.0, 1.0);
  
  vec4 color;
  
  if (u_velocityMagnitude > 0.1) {
    color = motionBlur(uv, u_velocity);
    
    if (u_velocityMagnitude > 0.5) {
      color = mix(color, chromaticAberration(uv, 1.0), 
                  smoothstep(0.5, 3.0, u_velocityMagnitude) * 0.3);
    }
    
    color = mix(color, bloom(uv), 0.3);
  } else {
    color = texture(u_texture, uv);
  }
  
  vec4 previous = texture(u_previousTexture, uv);
  color = mix(previous, color, 0.8);
  
  color.rgb *= vignette(uv);
  color.rgb += vec3(filmGrain(uv));
  color.a = 1.0;
  
  fragColor = color;
}`;

// Image cache for WebGL rendering
class ImageCache {
  private cache = new Map<string, HTMLImageElement>();
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>();

  async loadImage(src: string): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    const loadingPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(src, img);
        this.loadingPromises.delete(src);
        resolve(img);
      };
      
      img.onerror = () => {
        this.loadingPromises.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.crossOrigin = 'anonymous';
      img.src = src;
    });

    this.loadingPromises.set(src, loadingPromise);
    return loadingPromise;
  }

  getImage(src: string): HTMLImageElement | null {
    return this.cache.get(src) || null;
  }

  clear() {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}

// Enhanced PostProcessingManager with camera shake
class PostProcessingManager {
  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private framebuffers: WebGLFramebuffer[] = [];
  private textures: WebGLTexture[] = [];
  private currentTextureIndex = 0;
  private uniforms: { [key: string]: WebGLUniformLocation | null } = {};
  private isInitialized = false;
  private cameraShake = { x: 0, y: 0 };
  
  constructor(private canvas: HTMLCanvasElement) {
    this.initWebGL();
  }

  private initWebGL() {
    try {
      this.gl = this.canvas.getContext('webgl2', {
        alpha: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        antialias: false,
        depth: false,
        stencil: false,
      });

      if (!this.gl) {
        console.warn('WebGL2 not supported');
        return;
      }

      const vertexShader = this.createShader(this.gl.VERTEX_SHADER, `#version 300 es
        in vec2 a_position;
        in vec2 a_texCoord;
        out vec2 v_texCoord;

        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
          v_texCoord = a_texCoord;
        }`);
      const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

      if (!vertexShader || !fragmentShader) return;

      this.program = this.gl.createProgram()!;
      this.gl.attachShader(this.program, vertexShader);
      this.gl.attachShader(this.program, fragmentShader);
      this.gl.linkProgram(this.program);

      if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
        console.error('Program link failed:', this.gl.getProgramInfoLog(this.program));
        return;
      }

      this.uniforms = {
        u_texture: this.gl.getUniformLocation(this.program, 'u_texture'),
        u_previousTexture: this.gl.getUniformLocation(this.program, 'u_previousTexture'),
        u_resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
        u_velocity: this.gl.getUniformLocation(this.program, 'u_velocity'),
        u_time: this.gl.getUniformLocation(this.program, 'u_time'),
        u_velocityMagnitude: this.gl.getUniformLocation(this.program, 'u_velocityMagnitude'),
        u_cameraShake: this.gl.getUniformLocation(this.program, 'u_cameraShake'),
      };

      this.setupGeometry();
      this.createFramebuffers();
      this.isInitialized = true;
    } catch (error) {
      console.error('WebGL initialization failed:', error);
    }
  }

  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private setupGeometry() {
    if (!this.gl || !this.program) return;

    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, 1, 1,
    ]);

    // Fixed texture coordinates
    const texCoords = new Float32Array([
      0, 0, 1, 0, 0, 1, 1, 1,
    ]);

    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

    const positionLoc = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(positionLoc);
    this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 0, 0);

    const texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW);

    const texCoordLoc = this.gl.getAttribLocation(this.program, 'a_texCoord');
    this.gl.enableVertexAttribArray(texCoordLoc);
    this.gl.vertexAttribPointer(texCoordLoc, 2, this.gl.FLOAT, false, 0, 0);
  }

  private createFramebuffers() {
    if (!this.gl) return;

    for (let i = 0; i < 2; i++) {
      const texture = this.gl.createTexture()!;
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D, 0, this.gl.RGBA,
        this.canvas.width, this.canvas.height, 0,
        this.gl.RGBA, this.gl.UNSIGNED_BYTE, null
      );
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

      const framebuffer = this.gl.createFramebuffer()!;
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
      this.gl.framebufferTexture2D(
        this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0,
        this.gl.TEXTURE_2D, texture, 0
      );

      this.textures.push(texture);
      this.framebuffers.push(framebuffer);
    }
  }

  public render(sourceCanvas: HTMLCanvasElement, velocity: { x: number; y: number }) {
    if (!this.isInitialized || !this.gl || !this.program) return;

    try {
      this.gl.useProgram(this.program);

      const sourceTexture = this.gl.createTexture()!;
      this.gl.bindTexture(this.gl.TEXTURE_2D, sourceTexture);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D, 0, this.gl.RGBA,
        this.gl.RGBA, this.gl.UNSIGNED_BYTE, sourceCanvas
      );
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

      // Calculate velocity magnitude
      const velocityMagnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y) * 0.01;
      
      // Update camera shake for extreme velocity
      if (velocityMagnitude > 2.0) {
        const shakeIntensity = Math.min((velocityMagnitude - 2.0) * 5.0, 10.0);
        this.cameraShake.x = (Math.random() - 0.5) * shakeIntensity;
        this.cameraShake.y = (Math.random() - 0.5) * shakeIntensity;
      } else {
        this.cameraShake.x *= 0.9;
        this.cameraShake.y *= 0.9;
      }

      // Set uniforms
      this.gl.uniform1i(this.uniforms.u_texture, 0);
      this.gl.uniform1i(this.uniforms.u_previousTexture, 1);
            this.gl.uniform2f(this.uniforms.u_resolution, this.canvas.width, this.canvas.height);
      this.gl.uniform2f(this.uniforms.u_velocity, velocity.x * 0.01, velocity.y * 0.01);
      this.gl.uniform1f(this.uniforms.u_time, performance.now() * 0.001);
      this.gl.uniform1f(this.uniforms.u_velocityMagnitude, velocityMagnitude);
      this.gl.uniform2f(this.uniforms.u_cameraShake, this.cameraShake.x, this.cameraShake.y);

      // Bind textures
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, sourceTexture);
      
      this.gl.activeTexture(this.gl.TEXTURE1);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[1 - this.currentTextureIndex]);

      // Render to framebuffer
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffers[this.currentTextureIndex]);
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

      // Render to screen
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[this.currentTextureIndex]);
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

      this.currentTextureIndex = 1 - this.currentTextureIndex;

      // Cleanup
      this.gl.deleteTexture(sourceTexture);
    } catch (error) {
      console.error('WebGL render error:', error);
    }
  }

  public resize(width: number, height: number) {
    if (!this.gl) return;

    this.canvas.width = width;
    this.canvas.height = height;

    // Recreate framebuffers with new size
    this.textures.forEach(texture => this.gl!.deleteTexture(texture));
    this.framebuffers.forEach(fb => this.gl!.deleteFramebuffer(fb));
    
    this.textures = [];
    this.framebuffers = [];
    this.createFramebuffers();
  }

  public destroy() {
    if (!this.gl) return;

    this.textures.forEach(texture => this.gl!.deleteTexture(texture));
    this.framebuffers.forEach(fb => this.gl!.deleteFramebuffer(fb));
    
    if (this.program) {
      this.gl.deleteProgram(this.program);
    }
  }
}

// Enhanced InfiniteDragGrid Component
export const InfiniteDragGrid: React.FC<InfiniteDragGridProps> = ({
  gridItems,
  animationEnabled = true,
  onItemClick,
  gridColumns = 3,
  gridRows = 3,
  itemWidth = 280,
  itemHeight = 200,
  gap = 30,
  enablePostProcessing = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const postProcessingRef = useRef<PostProcessingManager | null>(null);
  const imageCacheRef = useRef<ImageCache>(new ImageCache());
  
  const dragStateRef = useRef({
    isDragging: false,
    startPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
    targetPos: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    hasMoved: false,
    lastVelocity: { x: 0, y: 0 },
  });
  
  const [expandedItem, setExpandedItem] = useState<HTMLElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Memoized settings
  const settings = useMemo(() => ({
    gap,
    itemWidth,
    itemHeight,
    expandedScale: 0.8,
    dragSpeed: 1.5,
    momentumFactor: 0.96,
    friction: 0.94,
    snapThreshold: 0.3,
    cellWidth: itemWidth + gap,
    cellHeight: itemHeight + gap,
    totalGridWidth: (itemWidth + gap) * gridColumns,
    totalGridHeight: (itemHeight + gap) * gridRows,
  }), [gap, itemWidth, itemHeight, gridColumns, gridRows]);

  // Preload images in background
  useEffect(() => {
    const loadAllImages = async () => {
      try {
        const imageCache = imageCacheRef.current;
        const loadPromises = gridItems.map(item => 
          imageCache.loadImage(item.thumbnail).catch(error => {
            console.warn(`Failed to load image ${item.thumbnail}:`, error);
            return null;
          })
        );
        
        await Promise.allSettled(loadPromises);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    if (gridItems.length > 0) {
      loadAllImages();
    }

    return () => {
      imageCacheRef.current.clear();
    };
  }, [gridItems]);

  // Initialize WebGL post-processing
  useEffect(() => {
    if (!enablePostProcessing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!container) return;

    // Set canvas size
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Create offscreen canvas for rendering the gallery
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    offscreenCanvasRef.current = offscreenCanvas;

    // Initialize post-processing
    postProcessingRef.current = new PostProcessingManager(canvas);

    return () => {
      if (postProcessingRef.current) {
        postProcessingRef.current.destroy();
      }
    };
  }, [enablePostProcessing]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!enablePostProcessing || !canvasRef.current || !containerRef.current) return;

      const container = containerRef.current;
      const canvas = canvasRef.current;
      const rect = container.getBoundingClientRect();

      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      if (offscreenCanvasRef.current) {
        offscreenCanvasRef.current.width = canvas.width;
        offscreenCanvasRef.current.height = canvas.height;
      }

      if (postProcessingRef.current) {
        postProcessingRef.current.resize(canvas.width, canvas.height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [enablePostProcessing]);

  // Calculate grid positions
  const calculateGridPosition = useCallback((index: number, repeatX: number, repeatY: number) => {
    const row = Math.floor(index / gridColumns);
    const col = index % gridColumns;
    
    const originX = -settings.totalGridWidth / 2;
    const originY = -settings.totalGridHeight / 2;
    
    return {
      x: originX + (col * settings.cellWidth) + (repeatX * settings.totalGridWidth),
      y: originY + (row * settings.cellHeight) + (repeatY * settings.totalGridHeight),
    };
  }, [gridColumns, settings]);

  // Render to offscreen canvas
  const renderToOffscreenCanvas = useCallback(() => {
    if (!offscreenCanvasRef.current || !containerRef.current) return;

    const offscreenCanvas = offscreenCanvasRef.current;
    const ctx = offscreenCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const container = containerRef.current;
    const items = container.querySelectorAll('.gallery-item, .gallery-item-clone');
    const containerRect = container.getBoundingClientRect();
    const imageCache = imageCacheRef.current;
    const scale = window.devicePixelRatio;
    ctx.scale(scale, scale);
    
    items.forEach((item) => {
      const el = item as HTMLElement;
      const rect = el.getBoundingClientRect();
      
      if (item === expandedItem || rect.width === 0 || rect.height === 0) return;
      
      const x = rect.left - containerRect.left;
      const y = rect.top - containerRect.top;
      
      const imgElement = el.querySelector('img') as HTMLImageElement;
      if (!imgElement) return;
      
      const imageSrc = imgElement.src;
      const cachedImage = imageCache.getImage(imageSrc);
      
      if (cachedImage && cachedImage.complete && cachedImage.naturalWidth > 0) {
        ctx.save();
        
        try {
          const radius = 8;
          ctx.beginPath();
          ctx.roundRect(x, y, rect.width, rect.height, radius);
          ctx.clip();
          
          ctx.drawImage(cachedImage, x, y, rect.width, rect.height);
          
          const opacity = Math.max(0.1, Math.min(0.3, 
            Math.abs(x - containerRect.width / 2) / containerRect.width
          ));
          ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.1})`;
          ctx.fillRect(x, y, rect.width, rect.height);
          
        } catch (error) {
          // Silently skip failed images
        }
        
        ctx.restore();
      }
    });
  }, [expandedItem]);

  // Animation loop with enhanced post-processing
  const animate = useCallback(() => {
    const state = dragStateRef.current;
    
    // Apply easing
    state.currentPos.x += (state.targetPos.x - state.currentPos.x) * 0.1;
    state.currentPos.y += (state.targetPos.y - state.currentPos.y) * 0.1;
    
    // Apply momentum
    if (!state.isDragging) {
      state.velocity.x *= settings.friction;
      state.velocity.y *= settings.friction;
      state.targetPos.x += state.velocity.x;
      state.targetPos.y += state.velocity.y;
    }

    // Store velocity for motion blur
    state.lastVelocity = { ...state.velocity };
    
    // Wrap positions for infinite scroll
    const wrapThreshold = 0.7;
    let wrapped = false;
    
    if (Math.abs(state.currentPos.x) > settings.totalGridWidth * wrapThreshold) {
      const wrapDirection = state.currentPos.x > 0 ? -1 : 1;
      state.currentPos.x += wrapDirection * settings.totalGridWidth;
      state.targetPos.x += wrapDirection * settings.totalGridWidth;
      wrapped = true;
    }
    
    if (Math.abs(state.currentPos.y) > settings.totalGridHeight * wrapThreshold) {
      const wrapDirection = state.currentPos.y > 0 ? -1 : 1;
      state.currentPos.y += wrapDirection * settings.totalGridHeight;
      state.targetPos.y += wrapDirection * settings.totalGridHeight;
      wrapped = true;
    }
    
    // Update all items
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll('.gallery-item, .gallery-item-clone');
      items.forEach((item) => {
        if (item === expandedItem) return;
        
        const el = item as HTMLElement;
        const originalX = Number(el.dataset.originalX || 0);
        const originalY = Number(el.dataset.originalY || 0);
        
        gsap.set(el, {
          x: originalX + state.currentPos.x,
          y: originalY + state.currentPos.y,
        });
      });
      
      // Add wrap effect
      if (wrapped) {
        gsap.to(items, {
          opacity: 0.7,
          duration: 0.2,
          onComplete: () => {
            gsap.to(items, { opacity: 1, duration: 0.3, stagger: 0.01 });
          }
        });
      }
    }

    // Apply post-processing effects
    if (enablePostProcessing && postProcessingRef.current && offscreenCanvasRef.current) {
      try {
        renderToOffscreenCanvas();
        postProcessingRef.current.render(offscreenCanvasRef.current, state.lastVelocity);
      } catch (error) {
        console.warn('Post-processing render error:', error);
      }
    }
    
    if (animationEnabled) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [expandedItem, settings, animationEnabled, enablePostProcessing, renderToOffscreenCanvas]);

  // Initialize grid positions
  const initializeGrid = useCallback(() => {
    if (!containerRef.current || gridItems.length === 0) return;
    
    const container = containerRef.current;
    const repeatingFactor = 2;
    
    // Clear existing clones
    container.querySelectorAll('.gallery-item-clone').forEach(clone => clone.remove());
    
    // Create grid pattern
    const fragment = document.createDocumentFragment();
    
    for (let repeatX = -repeatingFactor; repeatX <= repeatingFactor; repeatX++) {
      for (let repeatY = -repeatingFactor; repeatY <= repeatingFactor; repeatY++) {
        gridItems.forEach((item, index) => {
          const isOriginal = repeatX === 0 && repeatY === 0;
          const position = calculateGridPosition(index, repeatX, repeatY);
          
          if (isOriginal) {
            // Position original items
            const element = container.querySelector(`[data-item-id="${item.id}"]`) as HTMLElement;
            if (element) {
              gsap.set(element, {
                width: settings.itemWidth,
                height: settings.itemHeight,
                x: position.x,
                y: position.y,
                zIndex: index,
              });
              element.dataset.originalX = String(position.x);
              element.dataset.originalY = String(position.y);
            }
          } else {
            // Create clones
            const clone = createGridItemElement(item, index, position, true);
            fragment.appendChild(clone);
          }
        });
      }
    }
    
    container.appendChild(fragment);
  }, [gridItems, calculateGridPosition, settings]);

  // Create grid item element with proper image handling
  const createGridItemElement = (item: GridItem, index: number, position: { x: number; y: number }, isClone: boolean) => {
    const div = document.createElement('div');
    div.className = `gallery-item absolute cursor-pointer transition-opacity ${isClone ? 'gallery-item-clone' : ''}`;
    div.dataset.itemId = item.id;
    div.dataset.originalX = String(position.x);
    div.dataset.originalY = String(position.y);
    div.style.width = `${settings.itemWidth}px`;
    div.style.height = `${settings.itemHeight}px`;
    div.style.transform = `translate(${position.x}px, ${position.y}px)`;
    div.style.zIndex = String(index);
    
    div.innerHTML = `
      <div class="w-full h-full overflow-hidden rounded-lg group bg-gray-200 animate-pulse">
        <img 
          src="${item.thumbnail}" 
          alt="${item.title}"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-0"
          loading="lazy"
          crossorigin="anonymous"
          onload="this.style.opacity='1'; this.parentElement.classList.remove('animate-pulse', 'bg-gray-200');"
          onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm\\'>Image failed to load</div>';"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span class="inline-block px-2 py-1 bg-white/20 backdrop-blur text-white text-xs rounded mb-2">
            ${item.category}
          </span>
          <h3 class="text-xl font-bold text-white mb-2">
            ${item.title}
          </h3>
          <div class="flex items-center text-white/80 text-sm">
            <span>View Details</span>
            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
        </div>
      </div>
    `;
    
    return div;
  };

  // Handle item expansion
  const handleItemExpand = useCallback((element: HTMLElement) => {
    if (isExpanded || dragStateRef.current.hasMoved) return;
    
    const itemId = element.dataset.itemId;
    const item = gridItems.find(i => i.id === itemId);
    
    if (item && onItemClick) {
      onItemClick(item);
      return;
    }
    
    setIsExpanded(true);
    setExpandedItem(element);
    
    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const targetWidth = viewportWidth * settings.expandedScale;
    const aspectRatio = rect.height / rect.width;
    const targetHeight = targetWidth * aspectRatio;
    
    // Show overlay
    if (overlayRef.current) {
      gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.5 });
    }
    
    // Expand item
    gsap.to(element, {
      x: (viewportWidth - targetWidth) / 2,
      y: (viewportHeight - targetHeight) / 2,
      width: targetWidth,
      height: targetHeight,
      zIndex: 1000,
      duration: 0.5,
      ease: "power2.out"
    });
  }, [isExpanded, gridItems, onItemClick, settings.expandedScale]);

  // Close expanded item
  const closeExpandedItem = useCallback(() => {
    if (!isExpanded || !expandedItem) return;
    
    setIsExpanded(false);
    
    if (overlayRef.current) {
      gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3 });
    }
    
    const originalX = Number(expandedItem.dataset.originalX || 0);
    const originalY = Number(expandedItem.dataset.originalY || 0);
    
    gsap.to(expandedItem, {
      x: originalX + dragStateRef.current.currentPos.x,
      y: originalY + dragStateRef.current.currentPos.y,
      width: settings.itemWidth,
      height: settings.itemHeight,
      zIndex: expandedItem.style.zIndex || 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => setExpandedItem(null)
    });
  }, [isExpanded, expandedItem, settings]);

  // Mouse/Touch handlers with fixed direction
  const handlePointerDown = useCallback((clientX: number, clientY: number) => {
    if (isExpanded) return;
    
    const state = dragStateRef.current;
    state.isDragging = true;
    state.hasMoved = false;
    state.startPos = { x: clientX, y: clientY };
    
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  }, [isExpanded]);

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    const state = dragStateRef.current;
    if (!state.isDragging || isExpanded) return;
    
    const dx = clientX - state.startPos.x;
    const dy = clientY - state.startPos.y;
    
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      state.hasMoved = true;
    }
    
    // Fixed direction
    state.velocity.x = dx * settings.dragSpeed;
    state.velocity.y = dy * settings.dragSpeed;
    state.targetPos.x += dx * settings.dragSpeed;
    state.targetPos.y += dy * settings.dragSpeed;
    
    state.startPos = { x: clientX, y: clientY };
  }, [isExpanded, settings.dragSpeed]);

  const handlePointerUp = useCallback(() => {
    const state = dragStateRef.current;
    if (state.isDragging) {
      state.isDragging = false;
      
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
      }
      
      if (state.hasMoved) {
        state.targetPos.x += state.velocity.x * settings.momentumFactor;
        state.targetPos.y += state.velocity.y * settings.momentumFactor;
      }
    }
  }, [settings.momentumFactor]);

  // Setup event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => handlePointerDown(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const handleMouseUp = () => handlePointerUp();

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      handlePointerDown(touch.clientX, touch.clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    };
    const handleTouchEnd = () => handlePointerUp();

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.gallery-item');
      if (target && !dragStateRef.current.hasMoved) {
        handleItemExpand(target as HTMLElement);
      }
    };

    const handleOverlayClick = () => closeExpandedItem();

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('click', handleClick);
    overlayRef.current?.addEventListener('click', handleOverlayClick);

    container.style.cursor = 'grab';

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('click', handleClick);
      overlayRef.current?.removeEventListener('click', handleOverlayClick);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, handleItemExpand, closeExpandedItem]);

  // Initialize and start animation
  useEffect(() => {
    initializeGrid();
    
    if (animationEnabled) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeGrid, animate, animationEnabled]);

  return (
    <div className="infinite-gallery-container relative w-full h-[70vh] overflow-hidden bg-background">
      {/* WebGL Canvas for post-processing effects */}
      {enablePostProcessing && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10"
          style={{ mixBlendMode: 'normal' }}
        />
      )}
      
      {/* Overlay for expanded view */}
      <div 
        ref={overlayRef} 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[999] opacity-0 invisible pointer-events-auto"
        aria-hidden="true"
      />
      
      {/* Interactive hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full text-sm text-muted-foreground">
        <Hand className="w-4 h-4" />
        <span>Click and drag to explore</span>
        <MousePointer className="w-4 h-4" />
        {enablePostProcessing && (
          <span className="ml-2 px-2 py-1 bg-primary/20 rounded text-xs">
            WebGL Effects
          </span>
        )}
      </div>
      
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-gradient" />
      
      {/* Gallery container - Always visible for dragging */}
      <div 
        ref={containerRef}
        className="relative w-full h-full opacity-100"
        role="region"
        aria-label="Draggable image gallery"
      >
        {gridItems.map((item) => (
          <div 
            key={item.id}
            className="gallery-item absolute cursor-pointer transition-opacity"
            data-item-id={item.id}
            role="button"
            tabIndex={0}
            aria-label={`View ${item.title}`}
          >
            <div className="w-full h-full overflow-hidden rounded-lg group bg-gray-200 animate-pulse">
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-0"
                loading="lazy"
                crossOrigin="anonymous"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.opacity = '1';
                  img.parentElement?.classList.remove('animate-pulse', 'bg-gray-200');
                }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.parentElement) {
                    img.parentElement.innerHTML = `
                      <div class="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                        Image failed to load
                      </div>
                    `;
                  }
                }}
              />
              
              {/* Overlay with info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur text-white text-xs rounded mb-2">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <div className="flex items-center text-white/80 text-sm">
                  <span>View Details</span>
                  <ArrowUpRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};