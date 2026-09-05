import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react'
import * as THREE from 'three';

interface LiquidEtherProps {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

interface SimOptions {
  iterations_poisson: number;
  iterations_viscous: number;
  mouse_force: number;
  resolution: number;
  cursor_size: number;
  viscous: number;
  isBounce: boolean;
  dt: number;
  isViscous: boolean;
  BFECC: boolean;
}

interface LiquidEtherWebGL {
  output?: { simulation?: { options: SimOptions; resize: () => void } };
  autoDriver?: {
    enabled: boolean;
    speed: number;
    resumeDelay: number;
    rampDurationMs: number;
    mouse?: { autoIntensity: number; takeoverDuration: number };
    forceStop: () => void;
  };
  resize: () => void;
  start: () => void;
  pause: () => void;
  dispose: () => void;
}

const defaultColors = ['#5227FF', '#FF9FFC', '#B19EEF'];

function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = defaultColors,
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6
}: LiquidEtherProps): React.ReactElement {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const webglRef = useRef<LiquidEtherWebGL | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const resizeRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    function makePaletteTexture(stops: string[]): THREE.DataTexture {
      let arr: string[];
      if (Array.isArray(stops) && stops.length > 0) {
        arr = stops.length === 1 ? [stops[0], stops[0]] : stops;
      } else {
        arr = ['#ffffff', '#ffffff'];
      }
      const w = arr.length;
      const data = new Uint8Array(w * 4);
      for (let i = 0; i < w; i++) {
        const c = new THREE.Color(arr[i]);
        data[i * 4 + 0] = Math.round(c.r * 255);
        data[i * 4 + 1] = Math.round(c.g * 255);
        data[i * 4 + 2] = Math.round(c.b * 255);
        data[i * 4 + 3] = 255;
      }
      const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    }

    const paletteTex = makePaletteTexture(colors);
    // Hard-code transparent background vector (alpha 0)
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

    class CommonClass {
      width = 0;
      height = 0;
      aspect = 1;
      pixelRatio = 1;
      isMobile = false;
      breakpoint = 768;
      fboWidth: number | null = null;
      fboHeight: number | null = null;
      time = 0;
      delta = 0;
      container: HTMLElement | null = null;
      renderer: THREE.WebGLRenderer | null = null;
      clock: THREE.Clock | null = null;
      init(container: HTMLElement) {
        this.container = container;
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        this.resize();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        // Always transparent
        this.renderer.autoClear = false;
        this.renderer.setClearColor(new THREE.Color(0x000000), 0);
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.setSize(this.width, this.height);
        const el = this.renderer.domElement;
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.display = 'block';
        this.clock = new THREE.Clock();
        this.clock.start();
      }
      resize() {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.width = Math.max(1, Math.floor(rect.width));
        this.height = Math.max(1, Math.floor(rect.height));
        this.aspect = this.width / this.height;
        if (this.renderer) this.renderer.setSize(this.width, this.height, false);
      }
      update() {
        if (!this.clock) return;
        this.delta = this.clock.getDelta();
        this.time += this.delta;
      }
    }
    const Common = new CommonClass();

    class MouseClass {
      mouseMoved = false;
      coords = new THREE.Vector2();
      coords_old = new THREE.Vector2();
      diff = new THREE.Vector2();
      timer: number | null = null;
      container: HTMLElement | null = null;
      isHoverInside = false;
      hasUserControl = false;
      isAutoActive = false;
      autoIntensity = 2.0;
      takeoverActive = false;
      takeoverStartTime = 0;
      takeoverDuration = 0.25;
      takeoverFrom = new THREE.Vector2();
      takeoverTo = new THREE.Vector2();
      onInteract: (() => void) | null = null;
      private _onMouseMove = this.onDocumentMouseMove.bind(this);
      private _onTouchStart = this.onDocumentTouchStart.bind(this);
      private _onTouchMove = this.onDocumentTouchMove.bind(this);
      private _onMouseEnter = this.onMouseEnter.bind(this);
      private _onMouseLeave = this.onMouseLeave.bind(this);
      private _onTouchEnd = this.onTouchEnd.bind(this);
      init(container: HTMLElement) {
        this.container = container;
        container.addEventListener('mousemove', this._onMouseMove);
        container.addEventListener('touchstart', this._onTouchStart, { passive: true });
        container.addEventListener('touchmove', this._onTouchMove, { passive: true });
        container.addEventListener('mouseenter', this._onMouseEnter);
        container.addEventListener('mouseleave', this._onMouseLeave);
        container.addEventListener('touchend', this._onTouchEnd);
      }
      dispose() {
        const c = this.container;
        if (!c) return;
        c.removeEventListener('mousemove', this._onMouseMove);
        c.removeEventListener('touchstart', this._onTouchStart);
        c.removeEventListener('touchmove', this._onTouchMove);
        c.removeEventListener('mouseenter', this._onMouseEnter);
        c.removeEventListener('mouseleave', this._onMouseLeave);
        c.removeEventListener('touchend', this._onTouchEnd);
      }
      setCoords(x: number, y: number) {
        if (!this.container) return;
        if (this.timer) window.clearTimeout(this.timer);
        const rect = this.container.getBoundingClientRect();
        const nx = (x - rect.left) / rect.width;
        const ny = (y - rect.top) / rect.height;
        this.coords.set(nx * 2 - 1, -(ny * 2 - 1));
        this.mouseMoved = true;
        this.timer = window.setTimeout(() => {
          this.mouseMoved = false;
        }, 100);
      }
      setNormalized(nx: number, ny: number) {
        this.coords.set(nx, ny);
        this.mouseMoved = true;
      }
      onDocumentMouseMove(event: MouseEvent) {
        if (this.onInteract) this.onInteract();
        if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
          if (!this.container) return;
          const rect = this.container.getBoundingClientRect();
          const nx = (event.clientX - rect.left) / rect.width;
          const ny = (event.clientY - rect.top) / rect.height;
          this.takeoverFrom.copy(this.coords);
          this.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1));
          this.takeoverStartTime = performance.now();
          this.takeoverActive = true;
          this.hasUserControl = true;
          this.isAutoActive = false;
          return;
        }
        this.setCoords(event.clientX, event.clientY);
        this.hasUserControl = true;
      }
      onDocumentTouchStart(event: TouchEvent) {
        if (event.touches.length === 1) {
          const t = event.touches[0];
          if (this.onInteract) this.onInteract();
          this.setCoords(t.pageX, t.pageY);
          this.hasUserControl = true;
        }
      }
      onDocumentTouchMove(event: TouchEvent) {
        if (event.touches.length === 1) {
          const t = event.touches[0];
          if (this.onInteract) this.onInteract();
          this.setCoords(t.pageX, t.pageY);
        }
      }
      onTouchEnd() {
        this.isHoverInside = false;
      }
      onMouseEnter() {
        this.isHoverInside = true;
      }
      onMouseLeave() {
        this.isHoverInside = false;
      }
      update() {
        if (this.takeoverActive) {
          const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
          if (t >= 1) {
            this.takeoverActive = false;
            this.coords.copy(this.takeoverTo);
            this.coords_old.copy(this.coords);
            this.diff.set(0, 0);
          } else {
            const k = t * t * (3 - 2 * t);
            this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
          }
        }
        this.diff.subVectors(this.coords, this.coords_old);
        this.coords_old.copy(this.coords);
        if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
        if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
      }
    }
    const Mouse = new MouseClass();

    class AutoDriver {
      mouse: MouseClass;
      manager: WebGLManager;
      enabled: boolean;
      speed: number;
      resumeDelay: number;
      rampDurationMs: number;
      active = false;
      current = new THREE.Vector2(0, 0);
      target = new THREE.Vector2();
      lastTime = performance.now();
      activationTime = 0;
      margin = 0.2;
      private _tmpDir = new THREE.Vector2();
      constructor(
        mouse: MouseClass,
        manager: WebGLManager,
        opts: { enabled: boolean; speed: number; resumeDelay: number; rampDuration: number }
      ) {
        this.mouse = mouse;
        this.manager = manager;
        this.enabled = opts.enabled;
        this.speed = opts.speed;
        this.resumeDelay = opts.resumeDelay || 3000;
        this.rampDurationMs = (opts.rampDuration || 0) * 1000;
        this.pickNewTarget();
      }
      pickNewTarget() {
        const r = Math.random;
        this.target.set((r() * 2 - 1) * (1 - this.margin), (r() * 2 - 1) * (1 - this.margin));
      }
      forceStop() {
        this.active = false;
        this.mouse.isAutoActive = false;
      }
      update() {
        if (!this.enabled) return;
        const now = performance.now();
        const idle = now - this.manager.lastUserInteraction;
        if (idle < this.resumeDelay) {
          if (this.active) this.forceStop();
          return;
        }
        if (this.mouse.isHoverInside) {
          if (this.active) this.forceStop();
          return;
        }
        if (!this.active) {
          this.active = true;
          this.current.copy(this.mouse.coords);
          this.lastTime = now;
          this.activationTime = now;
        }
        if (!this.active) return;
        this.mouse.isAutoActive = true;
        let dtSec = (now - this.lastTime) / 1000;
        this.lastTime = now;
        if (dtSec > 0.2) dtSec = 0.016;
        const dir = this._tmpDir.subVectors(this.target, this.current);
        const dist = dir.length();
        if (dist < 0.01) {
          this.pickNewTarget();
          return;
        }
        dir.normalize();
        let ramp = 1;
        if (this.rampDurationMs > 0) {
          const t = Math.min(1, (now - this.activationTime) / this.rampDurationMs);
          ramp = t * t * (3 - 2 * t);
        }
        const step = this.speed * dtSec * ramp;
        const move = Math.min(step, dist);
        this.current.addScaledVector(dir, move);
        this.mouse.setNormalized(this.current.x, this.current.y);
      }
    }

    const face_vert = `
  attribute vec3 position;
  uniform vec2 px;
  uniform vec2 boundarySpace;
  varying vec2 uv;
  precision highp float;
  void main(){
  vec3 pos = position;
  vec2 scale = 1.0 - boundarySpace * 2.0;
  pos.xy = pos.xy * scale;
  uv = vec2(0.5)+(pos.xy)*0.5;
  gl_Position = vec4(pos, 1.0);
}
`;
    const line_vert = `
  attribute vec3 position;
  uniform vec2 px;
  precision highp float;
  varying vec2 uv;
  void main(){
  vec3 pos = position;
  uv = 0.5 + pos.xy * 0.5;
  vec2 n = sign(pos.xy);
  pos.xy = abs(pos.xy) - px * 1.0;
  pos.xy *= n;
  gl_Position = vec4(pos, 1.0);
}
`;
    const mouse_vert = `
    precision highp float;
    attribute vec3 position;
    attribute vec2 uv;
    uniform vec2 center;
    uniform vec2 scale;
    uniform vec2 px;
    varying vec2 vUv;
    void main(){
    vec2 pos = position.xy * scale * 2.0 * px + center;
    vUv = uv;
    gl_Position = vec4(pos, 0.0, 1.0);
}
`;
    const advection_frag = `
    precision highp float;
    uniform sampler2D velocity;
    uniform float dt;
    uniform bool isBFECC;
    uniform vec2 fboSize;
    uniform vec2 px;
    varying vec2 uv;
    void main(){
    vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
    if(isBFECC == false){
        vec2 vel = texture2D(velocity, uv).xy;
        vec2 uv2 = uv - vel * dt * ratio;
        vec2 newVel = texture2D(velocity, uv2).xy;
        gl_FragColor = vec4(newVel, 0.0, 0.0);
    } else {
        vec2 spot_new = uv;
        vec2 vel_old = texture2D(velocity, uv).xy;
        vec2 spot_old = spot_new - vel_old * dt * ratio;
        vec2 vel_new1 = texture2D(velocity, spot_old).xy;
        vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
        vec2 error = spot_new2 - spot_new;
        vec2 spot_new3 = spot_new - error / 2.0;
        vec2 vel_2 = texture2D(velocity, spot_new3).xy;
        vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
        vec2 newVel2 = texture2D(velocity, spot_old2).xy; 
        gl_FragColor = vec4(newVel2, 0.0, 0.0);
    }
}
`;
    const color_frag = `
    precision highp float;
    uniform sampler2D velocity;
    uniform sampler2D palette;
    uniform vec4 bgColor;
    varying vec2 uv;
    void main(){
    vec2 vel = texture2D(velocity, uv).xy;
    float lenv = clamp(length(vel), 0.0, 1.0);
    vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
    vec3 outRGB = mix(bgColor.rgb, c, lenv);
    float outA = mix(bgColor.a, 1.0, lenv);
    gl_FragColor = vec4(outRGB, outA);
}
`;
    const divergence_frag = `
    precision highp float;
    uniform sampler2D velocity;
    uniform float dt;
    uniform vec2 px;
    varying vec2 uv;
    void main(){
    float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x;
    float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x;
    float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y;
    float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y;
    float divergence = (x1 - x0 + y1 - y0) / 2.0;
    gl_FragColor = vec4(divergence / dt);
}
`;
    const externalForce_frag = `
    precision highp float;
    uniform vec2 force;
    uniform vec2 center;
    uniform vec2 scale;
    uniform vec2 px;
    varying vec2 vUv;
    void main(){
    vec2 circle = (vUv - 0.5) * 2.0;
    float d = 1.0 - min(length(circle), 1.0);
    d *= d;
    gl_FragColor = vec4(force * d, 0.0, 1.0);
}
`;
    const poisson_frag = `
    precision highp float;
    uniform sampler2D pressure;
    uniform sampler2D divergence;
    uniform vec2 px;
    varying vec2 uv;
    void main(){
    float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
    float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
    float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
    float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
    float div = texture2D(divergence, uv).r;
    float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
    gl_FragColor = vec4(newP);
}
`;
    const pressure_frag = `
    precision highp float;
    uniform sampler2D pressure;
    uniform sampler2D velocity;
    uniform vec2 px;
    uniform float dt;
    varying vec2 uv;
    void main(){
    float step = 1.0;
    float p0 = texture2D(pressure, uv + vec2(px.x * step, 0.0)).r;
    float p1 = texture2D(pressure, uv - vec2(px.x * step, 0.0)).r;
    float p2 = texture2D(pressure, uv + vec2(0.0, px.y * step)).r;
    float p3 = texture2D(pressure, uv - vec2(0.0, px.y * step)).r;
    vec2 v = texture2D(velocity, uv).xy;
    vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
    v = v - gradP * dt;
    gl_FragColor = vec4(v, 0.0, 1.0);
}
`;
    const viscous_frag = `
    precision highp float;
    uniform sampler2D velocity;
    uniform sampler2D velocity_new;
    uniform float v;
    uniform vec2 px;
    uniform float dt;
    varying vec2 uv;
    void main(){
    vec2 old = texture2D(velocity, uv).xy;
    vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
    vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
    vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
    vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
    vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
    newv /= 4.0 * (1.0 + v * dt);
    gl_FragColor = vec4(newv, 0.0, 0.0);
}
`;

    type Uniforms = Record<string, { value: any }>;

    class ShaderPass {
      props: any;
      uniforms?: Uniforms;
      scene: THREE.Scene | null = null;
      camera: THREE.Camera | null = null;
      material: THREE.RawShaderMaterial | null = null;
      geometry: THREE.BufferGeometry | null = null;
      plane: THREE.Mesh | null = null;
      constructor(props: any) {
        this.props = props || {};
        this.uniforms = this.props.material?.uniforms;
      }
      init(..._args: any[]) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        if (this.uniforms) {
          this.material = new THREE.RawShaderMaterial(this.props.material);
          this.geometry = new THREE.PlaneGeometry(2, 2);
          this.plane = new THREE.Mesh(this.geometry, this.material);
          this.scene.add(this.plane);
        }
      }
      update(..._args: any[]) {
        if (!Common.renderer || !this.scene || !this.camera) return;
        Common.renderer.setRenderTarget(this.props.output || null);
        Common.renderer.render(this.scene, this.camera);
        Common.renderer.setRenderTarget(null);
      }
    }

    class Advection extends ShaderPass {
      line!: THREE.LineSegments;
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: advection_frag,
            uniforms: {
              boundarySpace: { value: simProps.cellScale },
              px: { value: simProps.cellScale },
              fboSize: { value: simProps.fboSize },
              velocity: { value: simProps.src.texture },
              dt: { value: simProps.dt },
              isBFECC: { value: true }
            }
          },
          output: simProps.dst
        });
        this.uniforms = this.props.material.uniforms;
        this.init();
      }
      init() {
        super.init();
        this.createBoundary();
      }
      createBoundary() {
        const boundaryG = new THREE.BufferGeometry();
        const vertices_boundary = new Float32Array([
          -1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, -1, -1, 0
        ]);
        boundaryG.setAttribute('position', new THREE.BufferAttribute(vertices_boundary, 3));
        const boundaryM = new THREE.RawShaderMaterial({
          vertexShader: line_vert,
          fragmentShader: advection_frag,
          uniforms: this.uniforms!
        });
        this.line = new THREE.LineSegments(boundaryG, boundaryM);
        this.scene!.add(this.line);
      }
      update(...args: any[]) {
        const { dt, isBounce, BFECC } = (args[0] || {}) as { dt?: number; isBounce?: boolean; BFECC?: boolean };
        if (!this.uniforms) return;
        if (typeof dt === 'number') this.uniforms.dt.value = dt;
        if (typeof isBounce === 'boolean') this.line.visible = isBounce;
        if (typeof BFECC === 'boolean') this.uniforms.isBFECC.value = BFECC;
        super.update();
      }
    }

    class ExternalForce extends ShaderPass {
      mouse!: THREE.Mesh;
      constructor(simProps: any) {
        super({ output: simProps.dst });
        this.init(simProps);
      }
      init(simProps: any) {
        super.init();
        const mouseG = new THREE.PlaneGeometry(1, 1);
        const mouseM = new THREE.RawShaderMaterial({
          vertexShader: mouse_vert,
          fragmentShader: externalForce_frag,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          uniforms: {
            px: { value: simProps.cellScale },
            force: { value: new THREE.Vector2(0, 0) },
            center: { value: new THREE.Vector2(0, 0) },
            scale: { value: new THREE.Vector2(simProps.cursor_size, simProps.cursor_size) }
          }
        });
        this.mouse = new THREE.Mesh(mouseG, mouseM);
        this.scene!.add(this.mouse);
      }
      update(...args: any[]) {
        const props = args[0] || {};
        const forceX = (Mouse.diff.x / 2) * (props.mouse_force || 0);
        const forceY = (Mouse.diff.y / 2) * (props.mouse_force || 0);
        const cellScale = props.cellScale || { x: 1, y: 1 };
        const cursorSize = props.cursor_size || 0;
        const cursorSizeX = cursorSize * cellScale.x;
        const cursorSizeY = cursorSize * cellScale.y;
        const centerX = Math.min(
          Math.max(Mouse.coords.x, -1 + cursorSizeX + cellScale.x * 2),
          1 - cursorSizeX - cellScale.x * 2
        );
        const centerY = Math.min(
          Math.max(Mouse.coords.y, -1 + cursorSizeY + cellScale.y * 2),
          1 - cursorSizeY - cellScale.y * 2
        );
        const uniforms = (this.mouse.material as THREE.RawShaderMaterial).uniforms;
        uniforms.force.value.set(forceX, forceY);
        uniforms.center.value.set(centerX, centerY);
        uniforms.scale.value.set(cursorSize, cursorSize);
        super.update();
      }
    }

    class Viscous extends ShaderPass {
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: viscous_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              velocity: { value: simProps.src.texture },
              velocity_new: { value: simProps.dst_.texture },
              v: { value: simProps.viscous },
              px: { value: simProps.cellScale },
              dt: { value: simProps.dt }
            }
          },
          output: simProps.dst,
          output0: simProps.dst_,
          output1: simProps.dst
        });
        this.init();
      }
      update(...args: any[]) {
        const { viscous, iterations, dt } = (args[0] || {}) as { viscous?: number; iterations?: number; dt?: number };
        if (!this.uniforms) return;
        let fbo_in: any, fbo_out: any;
        if (typeof viscous === 'number') this.uniforms.v.value = viscous;
        const iter = iterations ?? 0;
        for (let i = 0; i < iter; i++) {
          if (i % 2 === 0) {
            fbo_in = this.props.output0;
            fbo_out = this.props.output1;
          } else {
            fbo_in = this.props.output1;
            fbo_out = this.props.output0;
          }
          this.uniforms.velocity_new.value = fbo_in.texture;
          this.props.output = fbo_out;
          if (typeof dt === 'number') this.uniforms.dt.value = dt;
          super.update();
        }
        return fbo_out;
      }
    }

    class Divergence extends ShaderPass {
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: divergence_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              velocity: { value: simProps.src.texture },
              px: { value: simProps.cellScale },
              dt: { value: simProps.dt }
            }
          },
          output: simProps.dst
        });
        this.init();
      }
      update(...args: any[]) {
        const { vel } = (args[0] || {}) as { vel?: any };
        if (this.uniforms && vel) {
          this.uniforms.velocity.value = vel.texture;
        }
        super.update();
      }
    }

    class Poisson extends ShaderPass {
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: poisson_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              pressure: { value: simProps.dst_.texture },
              divergence: { value: simProps.src.texture },
              px: { value: simProps.cellScale }
            }
          },
          output: simProps.dst,
          output0: simProps.dst_,
          output1: simProps.dst
        });
        this.init();
      }
      update(...args: any[]) {
        const { iterations } = (args[0] || {}) as { iterations?: number };
        let p_in: any, p_out: any;
        const iter = iterations ?? 0;
        for (let i = 0; i < iter; i++) {
          if (i % 2 === 0) {
            p_in = this.props.output0;
            p_out = this.props.output1;
          } else {
            p_in = this.props.output1;
            p_out = this.props.output0;
          }
          if (this.uniforms) this.uniforms.pressure.value = p_in.texture;
          this.props.output = p_out;
          super.update();
        }
        return p_out;
      }
    }

    class Pressure extends ShaderPass {
      constructor(simProps: any) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: pressure_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              pressure: { value: simProps.src_p.texture },
              velocity: { value: simProps.src_v.texture },
              px: { value: simProps.cellScale },
              dt: { value: simProps.dt }
            }
          },
          output: simProps.dst
        });
        this.init();
      }
      update(...args: any[]) {
        const { vel, pressure } = (args[0] || {}) as { vel?: any; pressure?: any };
        if (this.uniforms && vel && pressure) {
          this.uniforms.velocity.value = vel.texture;
          this.uniforms.pressure.value = pressure.texture;
        }
        super.update();
      }
    }

    class Simulation {
      options: SimOptions;
      fbos: Record<string, THREE.WebGLRenderTarget | null> = {
        vel_0: null,
        vel_1: null,
        vel_viscous0: null,
        vel_viscous1: null,
        div: null,
        pressure_0: null,
        pressure_1: null
      };
      fboSize = new THREE.Vector2();
      cellScale = new THREE.Vector2();
      boundarySpace = new THREE.Vector2();
      advection!: Advection;
      externalForce!: ExternalForce;
      viscous!: Viscous;
      divergence!: Divergence;
      poisson!: Poisson;
      pressure!: Pressure;
      constructor(options?: Partial<SimOptions>) {
        this.options = {
          iterations_poisson: 32,
          iterations_viscous: 32,
          mouse_force: 20,
          resolution: 0.5,
          cursor_size: 100,
          viscous: 30,
          isBounce: false,
          dt: 0.014,
          isViscous: false,
          BFECC: true,
          ...options
        };
        this.init();
      }
      init() {
        this.calcSize();
        this.createAllFBO();
        this.createShaderPass();
      }
      getFloatType() {
        const isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
        return isIOS ? THREE.HalfFloatType : THREE.FloatType;
      }
      createAllFBO() {
        const type = this.getFloatType();
        const opts = {
          type,
          depthBuffer: false,
          stencilBuffer: false,
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          wrapS: THREE.ClampToEdgeWrapping,
          wrapT: THREE.ClampToEdgeWrapping
        } as const;
        for (const key in this.fbos) {
          this.fbos[key] = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, opts);
        }
      }
      createShaderPass() {
        this.advection = new Advection({
          cellScale: this.cellScale,
          fboSize: this.fboSize,
          dt: this.options.dt,
          src: this.fbos.vel_0,
          dst: this.fbos.vel_1
        });
        this.externalForce = new ExternalForce({
          cellScale: this.cellScale,
          cursor_size: this.options.cursor_size,
          dst: this.fbos.vel_1
        });
        this.viscous = new Viscous({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          viscous: this.options.viscous,
          src: this.fbos.vel_1,
          dst: this.fbos.vel_viscous1,
          dst_: this.fbos.vel_viscous0,
          dt: this.options.dt
        });
        this.divergence = new Divergence({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          src: this.fbos.vel_viscous0,
          dst: this.fbos.div,
          dt: this.options.dt
        });
        this.poisson = new Poisson({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          src: this.fbos.div,
          dst: this.fbos.pressure_1,
          dst_: this.fbos.pressure_0
        });
        this.pressure = new Pressure({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          src_p: this.fbos.pressure_0,
          src_v: this.fbos.vel_viscous0,
          dst: this.fbos.vel_0,
          dt: this.options.dt
        });
      }
      calcSize() {
        const width = Math.max(1, Math.round(this.options.resolution * Common.width));
        const height = Math.max(1, Math.round(this.options.resolution * Common.height));
        this.cellScale.set(1 / width, 1 / height);
        this.fboSize.set(width, height);
      }
      resize() {
        this.calcSize();
        for (const key in this.fbos) {
          this.fbos[key]!.setSize(this.fboSize.x, this.fboSize.y);
        }
      }
      update() {
        if (this.options.isBounce) this.boundarySpace.set(0, 0);
        else this.boundarySpace.copy(this.cellScale);
        this.advection.update({ dt: this.options.dt, isBounce: this.options.isBounce, BFECC: this.options.BFECC });
        this.externalForce.update({
          cursor_size: this.options.cursor_size,
          mouse_force: this.options.mouse_force,
          cellScale: this.cellScale
        });
        let vel: any = this.fbos.vel_1;
        if (this.options.isViscous) {
          vel = this.viscous.update({
            viscous: this.options.viscous,
            iterations: this.options.iterations_viscous,
            dt: this.options.dt
          });
        }
        this.divergence.update({ vel });
        const pressure = this.poisson.update({ iterations: this.options.iterations_poisson });
        this.pressure.update({ vel, pressure });
      }
    }

    class Output {
      simulation: Simulation;
      scene: THREE.Scene;
      camera: THREE.Camera;
      output: THREE.Mesh;
      constructor() {
        this.simulation = new Simulation();
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        this.output = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.RawShaderMaterial({
            vertexShader: face_vert,
            fragmentShader: color_frag,
            transparent: true,
            depthWrite: false,
            uniforms: {
              velocity: { value: this.simulation.fbos.vel_0!.texture },
              boundarySpace: { value: new THREE.Vector2() },
              palette: { value: paletteTex },
              bgColor: { value: bgVec4 }
            }
          })
        );
        this.scene.add(this.output);
      }
      resize() {
        this.simulation.resize();
      }
      render() {
        if (!Common.renderer) return;
        Common.renderer.setRenderTarget(null);
        Common.renderer.render(this.scene, this.camera);
      }
      update() {
        this.simulation.update();
        this.render();
      }
    }

    class WebGLManager implements LiquidEtherWebGL {
      props: any;
      output!: Output;
      autoDriver?: AutoDriver;
      lastUserInteraction = performance.now();
      running = false;
      private _loop = this.loop.bind(this);
      private _resize = this.resize.bind(this);
      private _onVisibility?: () => void;
      constructor(props: any) {
        this.props = props;
        Common.init(props.$wrapper);
        Mouse.init(props.$wrapper);
        Mouse.autoIntensity = props.autoIntensity;
        Mouse.takeoverDuration = props.takeoverDuration;
        Mouse.onInteract = () => {
          this.lastUserInteraction = performance.now();
          if (this.autoDriver) this.autoDriver.forceStop();
        };
        this.autoDriver = new AutoDriver(Mouse, this as any, {
          enabled: props.autoDemo,
          speed: props.autoSpeed,
          resumeDelay: props.autoResumeDelay,
          rampDuration: props.autoRampDuration
        });
        this.init();
        window.addEventListener('resize', this._resize);
        this._onVisibility = () => {
          const hidden = document.hidden;
          if (hidden) {
            this.pause();
          } else if (isVisibleRef.current) {
            this.start();
          }
        };
        document.addEventListener('visibilitychange', this._onVisibility);
      }
      init() {
        if (!Common.renderer) return;
        this.props.$wrapper.prepend(Common.renderer.domElement);
        this.output = new Output();
      }
      resize() {
        Common.resize();
        this.output.resize();
      }
      render() {
        if (this.autoDriver) this.autoDriver.update();
        Mouse.update();
        Common.update();
        this.output.update();
      }
      loop() {
        if (!this.running) return;
        this.render();
        rafRef.current = requestAnimationFrame(this._loop);
      }
      start() {
        if (this.running) return;
        this.running = true;
        this._loop();
      }
      pause() {
        this.running = false;
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      }
      dispose() {
        try {
          window.removeEventListener('resize', this._resize);
          if (this._onVisibility) document.removeEventListener('visibilitychange', this._onVisibility);
          Mouse.dispose();
          if (Common.renderer) {
            const canvas = Common.renderer.domElement;
            if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
            Common.renderer.dispose();
          }
        } catch {
          /* noop */
        }
      }
    }

    const container = mountRef.current;
    container.style.position = container.style.position || 'relative';
    container.style.overflow = container.style.overflow || 'hidden';

    const webgl = new WebGLManager({
      $wrapper: container,
      autoDemo,
      autoSpeed,
      autoIntensity,
      takeoverDuration,
      autoResumeDelay,
      autoRampDuration
    });
    webglRef.current = webgl;

    const applyOptionsFromProps = () => {
      if (!webglRef.current) return;
      const sim = webglRef.current.output?.simulation;
      if (!sim) return;
      const prevRes = sim.options.resolution;
      Object.assign(sim.options, {
        mouse_force: mouseForce,
        cursor_size: cursorSize,
        isViscous,
        viscous,
        iterations_viscous: iterationsViscous,
        iterations_poisson: iterationsPoisson,
        dt,
        BFECC,
        resolution,
        isBounce
      });
      if (resolution !== prevRes) sim.resize();
    };
    applyOptionsFromProps();
    webgl.start();

    const io = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0;
        isVisibleRef.current = isVisible;
        if (!webglRef.current) return;
        if (isVisible && !document.hidden) {
          webglRef.current.start();
        } else {
          webglRef.current.pause();
        }
      },
      { threshold: [0, 0.01, 0.1] }
    );
    io.observe(container);
    intersectionObserverRef.current = io;

    const ro = new ResizeObserver(() => {
      if (!webglRef.current) return;
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        if (!webglRef.current) return;
        webglRef.current.resize();
      });
    });
    ro.observe(container);
    resizeObserverRef.current = ro;

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeObserverRef.current) {
        try {
          resizeObserverRef.current.disconnect();
        } catch {
          /* noop */
        }
      }
      if (intersectionObserverRef.current) {
        try {
          intersectionObserverRef.current.disconnect();
        } catch {
          /* noop */
        }
      }
      if (webglRef.current) {
        webglRef.current.dispose();
      }
      webglRef.current = null;
    };
  }, [
    BFECC,
    cursorSize,
    dt,
    isBounce,
    isViscous,
    iterationsPoisson,
    iterationsViscous,
    mouseForce,
    resolution,
    viscous,
    colors,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration
  ]);

  useEffect(() => {
    const webgl = webglRef.current;
    if (!webgl) return;
    const sim = webgl.output?.simulation;
    if (!sim) return;
    const prevRes = sim.options.resolution;
    Object.assign(sim.options, {
      mouse_force: mouseForce,
      cursor_size: cursorSize,
      isViscous,
      viscous,
      iterations_viscous: iterationsViscous,
      iterations_poisson: iterationsPoisson,
      dt,
      BFECC,
      resolution,
      isBounce
    });
    if (webgl.autoDriver) {
      webgl.autoDriver.enabled = autoDemo;
      webgl.autoDriver.speed = autoSpeed;
      webgl.autoDriver.resumeDelay = autoResumeDelay;
      webgl.autoDriver.rampDurationMs = autoRampDuration * 1000;
      if (webgl.autoDriver.mouse) {
        webgl.autoDriver.mouse.autoIntensity = autoIntensity;
        webgl.autoDriver.mouse.takeoverDuration = takeoverDuration;
      }
    }
    if (resolution !== prevRes) sim.resize();
  }, [
    mouseForce,
    cursorSize,
    isViscous,
    viscous,
    iterationsViscous,
    iterationsPoisson,
    dt,
    BFECC,
    resolution,
    isBounce,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration
  ]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full relative overflow-hidden pointer-events-none touch-none ${className || ''}`}
      style={style}
    />
  );
}


const ModernHeroSection = () => {
  const [activeTab, setActiveTab] = useState('home');
  const scrollRef = useRef(null);

  const scrollToContent = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      {/* Background with LiquidEther */}
      <div className="absolute inset-0 z-0">
       <LiquidEther
  colors={['#00F5D4', '#00BBF9', '#005F73']}
  mouseForce={25}
  cursorSize={120}
  isViscous={false}
  viscous={25}
  iterationsViscous={40}
  iterationsPoisson={40}
  resolution={0.6}
  isBounce={false}
  autoDemo={true}
  autoSpeed={0.3}
  autoIntensity={2.5}
  takeoverDuration={0.3}
  autoResumeDelay={2000}
  autoRampDuration={0.7}
/>
      </div>

      {/* Glassmorphic Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="text-2xl font-bold text-white">
          MYSH<span className="text-[#00F5D4]">.AI</span>
        </div>
        
        {/* Pill-shaped navigation */}
        <div className="glass-pill">
          {['home', 'features', 'pricing', 'contact'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === item
                  ? 'bg-white/20 text-white backdrop-blur-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
        
        <button className="px-6 py-2.5 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm font-medium">
          Get Started
        </button>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center rounded-b-2xl overflow-x-hidden">
        <h1 className="text-6xl md:text-7xl font-thin mb-6 text-white tracking-tight">
          The Future Is <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#008C76] via-[#00BBF9] to-[#6FFFE9]">Now</span>
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mb-12 font-light tracking-wide">
          Experience next-generation technology with our cutting-edge platform that transforms how you interact with digital environments.
        </p>
        
        {/* Animated Buttons */}
        <div className="flex flex-col sm:flex-row gap-5">
          <button 
            onClick={scrollToContent}
            className="futuristic-btn primary"
          >
            <span className="btn-text">Explore Features</span>
            <div className="btn-gradient"></div>
            <div className="hover-effect"></div>
          </button>
          
          <button className="futuristic-btn secondary">
            <span className="btn-text">Watch Demo</span>
            <div className="btn-gradient"></div>
            <div className="hover-effect"></div>
          </button>
        </div>

        <div className="group relative mt-40 max-w-5xl  px-6">
                <div className="group-hover:scale-105 mx-auto grid max-w-2xl grid-cols-4 gap-x-12 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16">
                    <div className="flex">
                        <img
                            className="mx-auto h-6 w-fit dark:invert"
                            src="https://html.tailus.io/blocks/customers/openai.svg"
                            alt="OpenAI Logo"
                            height="24"
                            width="auto"
                        />
                    </div>

                    <div className="flex">
                        <img
                            className="mx-auto h-6 w-fit "
                            src="data:image/png;base64,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"
                            alt="Column Logo"
                            height="16"
                            width="auto"
                        />
                    </div>
                    <div className="flex">
                        <img
                            className="mx-auto h-4 w-fit dark:invert"
                            src="https://html.tailus.io/blocks/customers/github.svg"
                            alt="GitHub Logo"
                            height="16"
                            width="auto"
                        />
                    </div>
                    <div className="flex">
                        <img
                            className="mx-auto h-6 w-fit dark"
                            src="data:image/png;base64,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"
                            alt="Nike Logo"
                            height="20"
                            width="auto"
                        />
                    </div>
                </div>
            </div>

      </div>

      {/* Additional Content Section */}
      <div ref={scrollRef} className="relative bg-black/80 z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-center text-white mb-16">How It Works</h2>
          {/* Content would go here */}
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        .glass-pill {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          padding: 4px;
        }
        
        .futuristic-btn {
          position: relative;
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 50px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          transform-style: preserve-3d;
          perspective: 1000px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .futuristic-btn.primary {
  background: linear-gradient(
    95deg,
    rgba(0, 245, 212, 0.2),
    rgba(0, 187, 249, 0.2)
  );
  box-shadow: 0 8px 32px 0 rgba(0, 187, 249, 0.3);
}

        
        .futuristic-btn .btn-text {
          position: relative;
          z-index: 2;
          color: white;
          font-weight: 500;
          letter-spacing: 0.5px;
          transition: all 0.4s ease;
        }
        
        .futuristic-btn .btn-gradient {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    95deg,
    transparent,
    rgba(0, 245, 212, 0.2),
    rgba(0, 187, 249, 0.2),
    transparent
  );
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}
        .futuristic-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px 0 rgba(92, 60, 240, 0.4);
        }
        
        .futuristic-btn:hover .btn-gradient {
          left: 100%;
        }
        
        .futuristic-btn:active {
          transform: translateY(0);
        }
        
        .futuristic-btn .hover-effect {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .futuristic-btn:hover .hover-effect {
          transform: translate(-50%, -50%) scale(15);
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ModernHeroSection;