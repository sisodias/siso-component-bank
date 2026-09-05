import React, { useRef, useEffect, useState, useMemo } from "react";
import {
    Clock, PerspectiveCamera, Scene, WebGLRenderer, SRGBColorSpace, MathUtils,
    Vector2, Vector3, MeshPhysicalMaterial, Color, Object3D, InstancedMesh,
    PMREMGenerator, SphereGeometry, AmbientLight, PointLight, ACESFilmicToneMapping,
    Raycaster, Plane, WebGLRendererParameters,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useTheme } from "next-themes";
import { Mail, ArrowRight, Menu, Sun, Moon } from 'lucide-react';
import { cn } from "../_utils/cn"; // Assumes you have a `cn` utility

// --- Three.js Boilerplate Class (X) ---
// This class handles the basic setup of a Three.js scene, camera, and renderer.
// It also manages the animation loop and resizing.
class X {
    // ... (Boilerplate class code is omitted for brevity, but it's the same as your provided 'X' class)
    #config: any;
    #resizeObserver?: ResizeObserver;
    #intersectionObserver?: IntersectionObserver;
    #resizeTimer?: number;
    #animationFrameId: number = 0;
    #clock: Clock = new Clock();
    #animationState = { elapsed: 0, delta: 0 };
    #isAnimating: boolean = false;
    #isVisible: boolean = false;
    canvas: HTMLCanvasElement;
    camera: PerspectiveCamera;
    scene: Scene;
    renderer: WebGLRenderer;
    size: any = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
    onBeforeRender: (state: { elapsed: number; delta: number }) => void = () => {};
    onAfterResize: (size: any) => void = () => {};

    constructor(config: any) {
        this.#config = config;
        this.canvas = this.#config.canvas;
        this.camera = new PerspectiveCamera(50, 1, 0.1, 100);
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            powerPreference: "high-performance",
            alpha: true,
            antialias: true,
            ...this.#config.rendererOptions,
        });
        this.renderer.outputColorSpace = SRGBColorSpace;
        this.canvas.style.display = "block";
        this.#initObservers();
        this.resize();
    }
    #initObservers() {
        const parentEl = this.#config.size === "parent" ? this.canvas.parentNode as Element : null;
        if(parentEl) {
            this.#resizeObserver = new ResizeObserver(this.#onResize.bind(this));
            this.#resizeObserver.observe(parentEl);
        } else {
            window.addEventListener("resize", this.#onResize.bind(this));
        }
        this.#intersectionObserver = new IntersectionObserver(this.#onIntersection.bind(this), { threshold: 0 });
        this.#intersectionObserver.observe(this.canvas);
        document.addEventListener("visibilitychange", this.#onVisibilityChange.bind(this));
    }
    #onResize() { if (this.#resizeTimer) clearTimeout(this.#resizeTimer); this.#resizeTimer = window.setTimeout(this.resize.bind(this), 100); }
    resize() {
        const parentEl = this.#config.size === "parent" ? this.canvas.parentNode as HTMLElement : null;
        const w = parentEl ? parentEl.offsetWidth : window.innerWidth;
        const h = parentEl ? parentEl.offsetHeight : window.innerHeight;
        this.size.width = w; this.size.height = h; this.size.ratio = w / h;
        this.camera.aspect = this.size.ratio; this.camera.updateProjectionMatrix();
        const fovRad = (this.camera.fov * Math.PI) / 180;
        this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.z; this.size.wWidth = this.size.wHeight * this.camera.aspect;
        this.renderer.setSize(w, h); this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.onAfterResize(this.size);
    }
    #onIntersection(e: any) { this.#isAnimating = e[0].isIntersecting; this.#isAnimating ? this.#startAnimation() : this.#stopAnimation(); }
    #onVisibilityChange() { if (this.#isAnimating) document.hidden ? this.#stopAnimation() : this.#startAnimation(); }
    #startAnimation() { if (this.#isVisible) return; this.#isVisible = true; this.#clock.start(); const f = () => { this.#animationFrameId = requestAnimationFrame(f); this.#animationState.delta = this.#clock.getDelta(); this.#animationState.elapsed += this.#animationState.delta; this.onBeforeRender(this.#animationState); this.renderer.render(this.scene, this.camera); }; f(); }
    #stopAnimation() { if (this.#isVisible) { cancelAnimationFrame(this.#animationFrameId); this.#isVisible = false; this.#clock.stop(); } }
    dispose() { this.#stopAnimation(); this.#resizeObserver?.disconnect(); this.#intersectionObserver?.disconnect(); window.removeEventListener("resize", this.#onResize.bind(this)); document.removeEventListener("visibilitychange", this.#onVisibilityChange.bind(this)); this.scene.clear(); this.renderer.dispose(); }
}


// --- Physics Engine Class (W) ---
// Handles the physics simulation for the spheres, including gravity, collision, and boundaries.
class W {
    // ... (Physics engine class code is omitted for brevity, but it's the same as your provided 'W' class)
    config: any;
    positionData: Float32Array;
    velocityData: Float32Array;
    sizeData: Float32Array;
    center: Vector3 = new Vector3();

    constructor(config: any) {
        this.config = config;
        this.positionData = new Float32Array(3 * config.count);
        this.velocityData = new Float32Array(3 * config.count);
        this.sizeData = new Float32Array(config.count);
        this.#initializePositions(); this.setSizes();
    }
    #initializePositions() { const { count, maxX, maxY, maxZ } = this.config; this.center.toArray(this.positionData, 0); for (let i = 1; i < count; i++) { const idx = 3 * i; this.positionData[idx] = MathUtils.randFloatSpread(2 * maxX); this.positionData[idx + 1] = MathUtils.randFloatSpread(2 * maxY); this.positionData[idx + 2] = MathUtils.randFloatSpread(2 * maxZ); } }
    setSizes() { const { count, size0, minSize, maxSize } = this.config; this.sizeData[0] = size0; for (let i = 1; i < count; i++) this.sizeData[i] = MathUtils.randFloat(minSize, maxSize); }
    update(deltaInfo: { delta: number }) {
        const { config, center, positionData, sizeData, velocityData } = this;
        const startIdx = config.controlSphere0 ? 1 : 0;
        if (config.controlSphere0) { new Vector3().fromArray(positionData, 0).lerp(center, 0.1).toArray(positionData, 0); new Vector3(0, 0, 0).toArray(velocityData, 0); }
        for (let i = startIdx; i < config.count; i++) {
            const base = 3 * i;
            const pos = new Vector3().fromArray(positionData, base); const vel = new Vector3().fromArray(velocityData, base);
            vel.y -= deltaInfo.delta * config.gravity * sizeData[i]; vel.multiplyScalar(config.friction); vel.clampLength(0, config.maxVelocity); pos.add(vel);
            for (let j = i + 1; j < config.count; j++) { const otherBase = 3 * j; const otherPos = new Vector3().fromArray(positionData, otherBase); const diff = new Vector3().subVectors(otherPos, pos); const dist = diff.length(); const sumRadius = sizeData[i] + sizeData[j]; if (dist < sumRadius) { const overlap = (sumRadius - dist) * 0.5; diff.normalize(); pos.addScaledVector(diff, -overlap); otherPos.addScaledVector(diff, overlap); pos.toArray(positionData, base); otherPos.toArray(positionData, otherBase); } }
            if (Math.abs(pos.x) + sizeData[i] > config.maxX) { pos.x = Math.sign(pos.x) * (config.maxX - sizeData[i]); vel.x *= -config.wallBounce; }
            if (pos.y - sizeData[i] < -config.maxY) { pos.y = -config.maxY + sizeData[i]; vel.y *= -config.wallBounce; }
            if (Math.abs(pos.z) + sizeData[i] > config.maxZ) { pos.z = Math.sign(pos.z) * (config.maxZ - sizeData[i]); vel.z *= -config.wallBounce; }
            pos.toArray(positionData, base); vel.toArray(velocityData, base);
        }
    }
}


// --- Instanced Spheres Class (Z) ---
// Manages the creation and updating of the instanced sphere mesh.
const U = new Object3D();
class Z extends InstancedMesh {
    config: any;
    physics: W;
    ambientLight: AmbientLight;
    light: PointLight;
    constructor(renderer: WebGLRenderer, params: any) {
        const pmrem = new PMREMGenerator(renderer); const envTexture = pmrem.fromScene(new RoomEnvironment(renderer)).texture; pmrem.dispose();
        const geometry = new SphereGeometry(1, 24, 24);
        const material = new MeshPhysicalMaterial({ envMap: envTexture, ...params.materialParams });
        super(geometry, material, params.count);
        this.config = params; this.physics = new W(this.config);
        this.ambientLight = new AmbientLight(0xffffff, params.ambientIntensity); this.add(this.ambientLight);
        this.light = new PointLight(0xffffff, params.lightIntensity, 100, 1); this.add(this.light);
        this.setColors(this.config.colors);
    }
    setColors(colors: (string | Color)[]) {
        if (!Array.isArray(colors) || !colors.length) return;
        const colorObjs = colors.map(c => c instanceof Color ? c : new Color(c));
        for (let i = 0; i < this.count; i++) this.setColorAt(i, colorObjs[i % colorObjs.length]);
        if (this.instanceColor) this.instanceColor.needsUpdate = true;
    }
    update(deltaInfo: { delta: number }) {
        this.physics.update(deltaInfo);
        for (let i = 0; i < this.count; i++) {
            U.position.fromArray(this.physics.positionData, 3 * i);
            U.scale.setScalar(this.physics.sizeData[i]);
            U.updateMatrix();
            this.setMatrixAt(i, U.matrix);
        }
        this.instanceMatrix.needsUpdate = true;
        if (this.config.controlSphere0) this.light.position.fromArray(this.physics.positionData, 0);
    }
}

// --- Pointer Logic ---
const pointer = new Vector2();
function onPointerMove(e: PointerEvent) {
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
}

// --- Default Props ---
const defaultBallpitConfig = {
    count: 200,
    materialParams: { metalness: 0.7, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.2 },
    minSize: 0.3, maxSize: 0.8, size0: 1.0,
    gravity: 0.4, friction: 0.995, wallBounce: 0.2, maxVelocity: 0.1,
    maxX: 10, maxY: 10, maxZ: 10,
    controlSphere0: true, followCursor: true,
    lightIntensity: 3, ambientIntensity: 1.5,
};

// --- Theme Aware Color Palette ---
const lightColors = ["#E5E5E5", "#CCCCCC", "#B2B2B2"];
const darkColors = ["#444444", "#222222", "#111111"];


// --- Component Prop Interfaces ---
type BallpitProps = Partial<typeof defaultBallpitConfig & { colors: (string | Color)[] }>;

interface InteractiveHeroProps {
    brandName?: string;
    heroTitle?: string;
    heroDescription?: string;
    emailPlaceholder?: string;
    className?: string;
    ballpitConfig?: BallpitProps;
}

// --- Main React Component ---
export const InteractiveHero: React.FC<InteractiveHeroProps> = ({
    brandName = "NEXUS",
    heroTitle = "Innovation Meets Simplicity",
    heroDescription = "Discover cutting-edge solutions designed for the modern digital landscape.",
    emailPlaceholder = "your@email.com",
    className,
    ballpitConfig = {},
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme, setTheme } = useTheme();
    const [email, setEmail] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Memoize config to prevent re-renders from creating new objects
    const config = useMemo(() => ({
        ...defaultBallpitConfig,
        ...ballpitConfig,
        colors: theme === 'dark' ? darkColors : lightColors,
    }), [ballpitConfig, theme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Initialize Three.js scene
        const three = new X({ canvas, size: "parent" });
        three.renderer.toneMapping = ACESFilmicToneMapping;
        three.camera.position.set(0, 0, 20);

        const spheres = new Z(three.renderer, config);
        three.scene.add(spheres);

        const raycaster = new Raycaster();
        const plane = new Plane(new Vector3(0, 0, 1), 0);
        const intersectionPoint = new Vector3();

        if (config.followCursor) {
            window.addEventListener("pointermove", onPointerMove);
        }

        three.onBeforeRender = (deltaInfo) => {
            if (config.followCursor) {
                raycaster.setFromCamera(pointer, three.camera);
                if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
                    spheres.physics.center.copy(intersectionPoint);
                }
            }
            spheres.update(deltaInfo);
        };
        
        three.onAfterResize = (size) => {
            spheres.physics.config.maxX = size.wWidth / 2;
            spheres.physics.config.maxY = size.wHeight / 2;
            spheres.physics.config.maxZ = size.wWidth / 4;
        };

        // Cleanup on unmount
        return () => {
            if (config.followCursor) {
                window.removeEventListener("pointermove", onPointerMove);
            }
            three.dispose();
        };
    // The dependency array is now stable, preventing re-initialization on unrelated state changes.
    }, [config]);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle email submission logic
        console.log('Email submitted:', email);
    };
    
    return (
        <div className={cn("relative w-full h-screen overflow-hidden bg-background", className)}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
            
            <header className="relative z-10 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between gap-4">
                    <a href="#" className="font-bold text-2xl text-foreground tracking-tight">
                        {brandName}
                    </a>
                    <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <a href="#" className="hover:text-foreground px-3 py-2 transition-colors rounded-md">About</a>
                        <a href="#" className="hover:text-foreground px-3 py-2 transition-colors rounded-md">Blog</a>
                        <a href="#" className="hover:text-foreground px-3 py-2 transition-colors rounded-md">Contact</a>
                    </nav>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="bg-secondary/50 hover:bg-secondary flex-shrink-0 p-2.5 rounded-full transition-colors"
                            aria-label="Toggle theme"
                        >
                            <Sun className="h-5 w-5 text-foreground dark:hidden" />
                            <Moon className="h-5 w-5 text-foreground hidden dark:block" />
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2.5" aria-label="Open menu">
                            <Menu className="h-6 w-6 text-foreground" />
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="relative z-10 flex h-[calc(100%-100px)] items-center justify-center text-center px-4">
                <div className="max-w-3xl">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl text-foreground font-bold tracking-tighter">{heroTitle}</h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">{heroDescription}</p>
                    <form onSubmit={handleEmailSubmit} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                        <div className="relative w-full">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="email"
                                placeholder={emailPlaceholder}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-secondary/50 border border-transparent hover:border-border/50 focus:border-border text-foreground placeholder-muted-foreground font-medium pl-11 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 flex-shrink-0">
                            Get Notified <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </main>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-0 left-0 w-full h-full bg-background/80 backdrop-blur-sm z-20">
                    <div className="absolute top-24 right-8 p-4 bg-card border shadow-lg rounded-xl w-48">
                        <nav className="flex flex-col gap-2 text-muted-foreground font-medium">
                            <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg">About</a>
                            <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg">Blog</a>
                            <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg">Contact</a>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};