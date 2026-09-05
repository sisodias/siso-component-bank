import { useState, useEffect, useRef, useMemo } from "react"
import { motion, useAnimation } from "framer-motion"
import * as THREE from "three"

export default function HeroWithNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    controls.start("visible")
  }, [controls])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="w-full min-h-screen relative bg-background dark:bg-background overflow-x-hidden flex flex-col justify-start items-center">
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 dark:bg-background/80 backdrop-blur-md shadow-lg border border-border/50"
            : "bg-background/60 dark:bg-background/60 backdrop-blur-sm"
        } rounded-full px-6 py-3`}
      >
        <div className="flex justify-between items-center max-w-4xl">
          <div className="flex justify-center items-center">
            <div className="flex justify-start items-center">
              <div className="flex flex-col justify-center text-foreground text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans">
                sickui
              </div>
            </div>
            <div className="pl-3 sm:pl-4 md:pl-5 lg:pl-5 flex justify-start items-start hidden sm:flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-4">
              <div className="flex justify-start items-center">
                <button className="flex flex-col justify-center text-muted-foreground hover:text-foreground text-xs md:text-[13px] font-medium leading-[14px] font-sans transition-colors">
                  Products
                </button>
              </div>
              <div className="flex justify-start items-center">
                <button className="flex flex-col justify-center text-muted-foreground hover:text-foreground text-xs md:text-[13px] font-medium leading-[14px] font-sans transition-colors">
                  Pricing
                </button>
              </div>
              <div className="flex justify-start items-center">
                <button className="flex flex-col justify-center text-muted-foreground hover:text-foreground text-xs md:text-[13px] font-medium leading-[14px] font-sans transition-colors">
                  Docs
                </button>
              </div>
            </div>
          </div>

          <div className="h-6 sm:h-7 md:h-8 flex justify-start items-start gap-2 sm:gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden px-2 py-1 text-foreground"
              aria-label="Toggle menu"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden absolute top-full left-0 right-0 mt-2 bg-card rounded-lg shadow-lg border border-border"
          >
            <div className="flex flex-col p-4 gap-3">
              <button className="text-left text-card-foreground hover:text-foreground text-sm font-medium py-2 transition-colors">
                Products
              </button>
              <button className="text-left text-card-foreground hover:text-foreground text-sm font-medium py-2 transition-colors">
                Pricing
              </button>
              <button className="text-left text-card-foreground hover:text-foreground text-sm font-medium py-2 transition-colors">
                Docs
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      <div className="relative flex flex-col justify-start items-center w-full">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1070px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-border shadow-[1px_0px_0px_hsl(var(--background))] z-0"></div>
          {/* Right vertical line */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-border shadow-[1px_0px_0px_hsl(var(--background))] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-border flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            <motion.div
              initial="hidden"
              animate={controls}
              variants={containerVariants}
              className="pt-32 sm:pt-36 md:pt-40 lg:pt-[200px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0"
            >
              <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  <motion.div
                    variants={itemVariants}
                    className="w-full max-w-[748.71px] lg:w-[748.71px] text-center flex justify-center flex-col text-foreground text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[80px] font-normal leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-serif px-2 sm:px-4 md:px-0"
                  >
                    Effortless custom contract
                    <br />
                    billing by sickui
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-muted-foreground sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm"
                  >
                    Streamline your billing process with seamless automation
                    <br className="hidden sm:block" />
                    for every custom contract, tailored by sickui.
                  </motion.div>
                </div>
              </div>

              <motion.div
                variants={itemVariants}
                className="w-full max-w-[540px] flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10 mt-6 sm:mt-8 md:mt-10 lg:mt-12"
              >
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-10 lg:px-12 sm:py-[6px] relative bg-primary shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center hover:bg-primary/90 transition-colors group"
              >
                <div className="w-20 sm:w-24 md:w-28 lg:w-44 h-[41px] absolute left-0 top-[-0.5px] bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply"></div>
                <div className="flex flex-col justify-center text-primary-foreground text-sm sm:text-base md:text-[15px] font-medium leading-5 font-sans group-hover:text-primary-foreground/90 transition-colors">
                  Start for free
                </div>
              </motion.button>
                {/* Decorative WebGL Orb */}
                <div className="w-full">
                  <div className="relative mx-auto w-full max-w-[620px] h-[320px] sm:h-[380px] md:h-[440px] lg:h-[520px]">
                    <OrbCanvas />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}



/**
 * OrbCanvas
 * A performant Three.js canvas rendering a soft, refractive, animated orb
 * with subtle noise and lighting. It adapts to container size.
 */
function OrbCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const rafRef = useRef<number | null>(null)
  const startTime = useRef<number>(performance.now())
  const mouse = useRef({ x: 0, y: 0 })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uBg: { value: new THREE.Color(0.06, 0.06, 0.07) },
      uAccentA: { value: new THREE.Color("#6ee7ff") },
      uAccentB: { value: new THREE.Color("#a78bfa") },
      uAccentC: { value: new THREE.Color("#22d3ee") },
    }),
    []
  )

  useEffect(() => {
    const container = containerRef.current!
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
    camera.position.set(0, 0, 6.2)
    cameraRef.current = camera

    // Geometry with enough segments to look smooth
    const geometry = new THREE.IcosahedronGeometry(1.45, 5)

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec3 vPos;
        varying vec3 vNormal;
        varying vec2 vUv;
        uniform float uTime;

        // Simple domain warp noise displacement for surface undulation
        // 3D noise
        vec3 mod289(vec3 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        float snoise(vec3 v){
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 =   v - i + dot(i, C.xxx) ;

          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );

          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

          i = mod289(i);
          vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

          float n_ = 0.142857142857;
          vec3  ns = n_ * D.wyz - D.xzx;

          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

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
          vec3 p1 = vec3(a1.xy,h.y);
          vec3 p2 = vec3(a1.zw,h.z);
          vec3 p3 = vec3(a0.zw,h.w);

          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
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
          vUv = uv;
          vNormal = normalMatrix * normalize(normal);
          float t = uTime * 0.22;
          // Smooth displacement
          float n = snoise(normalize(position) * 1.6 + vec3(0.0, t, t*0.7));
          float d = n * 0.18;
          vec3 displaced = position + normal * d;
          vPos = (modelMatrix * vec4(displaced, 1.0)).xyz;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        varying vec3 vPos;
        varying vec3 vNormal;
        varying vec2 vUv;

        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        uniform vec3 uBg;
        uniform vec3 uAccentA;
        uniform vec3 uAccentB;
        uniform vec3 uAccentC;

        // Soft lighting + fresnel + thin film tint
        float fresnel(vec3 n, vec3 v, float powFactor) {
          return pow(1.0 - max(dot(normalize(n), normalize(v)), 0.0), powFactor);
        }

        vec3 tonemap(vec3 c) {
          // filmic
          c = max(vec3(0.0), c - 0.004);
          return (c * (6.2 * c + 0.5)) / (c * (6.2 * c + 1.7) + 0.06);
        }

        // rotate hue-ish between accents
        vec3 palette(float k) {
          vec3 a = uAccentA;
          vec3 b = uAccentB;
          vec3 c = uAccentC;
          float e = smoothstep(0.0, 1.0, 0.5 + 0.5 * sin(k));
          float f = smoothstep(0.0, 1.0, 0.5 + 0.5 * cos(k * 0.7));
          return mix(mix(a, b, e), c, f * 0.6);
        }

        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(cameraPosition - vPos);

          // moving light directions
          float t = uTime * 0.35;
          vec3 L1 = normalize(vec3(sin(t*0.9), 0.6, cos(t*0.7)));
          vec3 L2 = normalize(vec3(-cos(t*0.6), 0.2 + 0.3*sin(t*0.8), -sin(t*0.9)));
          vec3 L3 = normalize(vec3(0.0, 1.0, 0.2));

          // diff/spec
          float diff1 = max(dot(N, L1), 0.0);
          float diff2 = max(dot(N, L2), 0.0);
          float diff3 = max(dot(N, L3), 0.0);

          float spec1 = pow(max(dot(reflect(-L1, N), V), 0.0), 64.0);
          float spec2 = pow(max(dot(reflect(-L2, N), V), 0.0), 48.0);

          // color swirl
          vec3 col = palette(t + N.x * 2.0 + N.y);

          // base
          vec3 base = col * (0.25 + 0.9 * (diff1 * 0.6 + diff2 * 0.3 + diff3 * 0.2));
          base += vec3(0.9, 0.95, 1.0) * (spec1 * 0.9 + spec2 * 0.6);

          // fresnel rim and thin-film iridescence
          float f = fresnel(N, V, 2.2);
          vec3 rim = mix(vec3(0.0), palette(t*1.3 + N.z*3.0), f);
          base += rim * 0.85;

          // subtle transmission glow
          float trans = pow(1.0 - max(dot(N, V), 0.0), 3.0);
          base += palette(t*0.8) * trans * 0.25;

          // ambient lift
          base += vec3(0.05);

          gl_FragColor = vec4(tonemap(base), 0.95);
        }
      `,
      transparent: true,
      depthWrite: true,
    })

    const mesh = new THREE.Mesh(geometry, material)
    meshRef.current = mesh
    scene.add(mesh)

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h, false)
      if (camera) {
        camera.aspect = w / Math.max(h, 1)
        camera.updateProjectionMatrix()
      }
      uniforms.uResolution.value.set(w, h)
    }
    resize()

    const onMouseMove = (e: MouseEvent) => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      mouse.current.x = x * 2 - 1
      mouse.current.y = -(y * 2 - 1)
      uniforms.uMouse.value.set(mouse.current.x, mouse.current.y)
    }
    window.addEventListener("mousemove", onMouseMove, { passive: true })

    const animate = () => {
      const now = performance.now()
      const t = (now - startTime.current) / 1000
      uniforms.uTime.value = t

      // rotate orb slightly with mouse and time
      if (meshRef.current) {
        const targetRotX = mouse.current.y * 0.35
        const targetRotY = mouse.current.x * 0.55 + t * 0.15
        meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.06
        meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.06
      }

      renderer.render(scene, camera)
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      resize()
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (meshRef.current) {
        meshRef.current.geometry.dispose()
        ;(meshRef.current.material as THREE.Material).dispose()
      }
      renderer.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      scene.clear()
    }
  }, [uniforms])

  return (
    <div
      ref={containerRef}
      className="absolute justify-center inset-0 rounded-[28px] sm:rounded-[36px] md:rounded-[44px] overflow-hidden"
      style={{
        WebkitMaskImage:
          "radial-gradient(100% 140% at 50% 0%, black 70%, transparent 100%)",
        filter: "drop-shadow(0 30px 80px rgba(0,0,0,0.35))",
      }}
      aria-hidden="true"
    />
  )
}