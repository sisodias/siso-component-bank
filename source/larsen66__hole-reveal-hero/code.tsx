import React, { useEffect, useRef } from "react";
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Object3D,
  BoxGeometry,
  MeshBasicMaterial,
  InstancedMesh,
  DynamicDrawUsage,
  CanvasTexture,
  SRGBColorSpace,
  Color
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";

export default function InstancedWave() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  // ——— Load a professional font (Inter) once ———
  useEffect(() => {
    const id = "__inter_font_link__";
    if (!document.getElementById(id)) {
      const l1 = document.createElement("link");
      l1.rel = "preconnect";
      l1.href = "https://fonts.googleapis.com";
      l1.id = id;
      const l2 = document.createElement("link");
      l2.rel = "preconnect";
      l2.href = "https://fonts.gstatic.com";
      l2.crossOrigin = "anonymous";
      const l3 = document.createElement("link");
      l3.rel = "stylesheet";
      l3.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(l1);
      document.head.appendChild(l2);
      document.head.appendChild(l3);
    }
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    const canvasHost = canvasHostRef.current;
    const hero = heroRef.current;
    if (!wrapper || !content || !canvasHost || !hero) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
      wrapper,
      content,
      smooth: 0.6,
      normalizeScroll: true,
      ignoreMobileResize: true,
      effects: true,
      preventDefault: true
    });

    const getSize = () => ({
      width: canvasHost.clientWidth || window.innerWidth,
      height: canvasHost.clientHeight || window.innerHeight
    });
    let { width, height } = getSize();

    const camera = new PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.set(0.3, 0.3, -20 / 1.5);
    camera.lookAt(0, 0, 0);

    const scene = new Scene();
    scene.background = new Color(0x000000);
    scene.rotation.x = -Math.PI / 2;

    const geom = new BoxGeometry(1, 1, 1);

    const texCanvas = document.createElement("canvas");
    const tsize = (texCanvas.height = texCanvas.width = 32);
    const ctx = texCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, tsize, tsize);
      ctx.clearRect(1, 1, tsize - 2, tsize - 2);
    }
    const map = new CanvasTexture(texCanvas);
    map.colorSpace = SRGBColorSpace;

    const material = new MeshBasicMaterial({ map });

    const rowCount = 36;
    const columnCount = 30;
    const layerCount = 3;

    const mesh = new InstancedMesh(geom, material, rowCount * columnCount * layerCount);
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    scene.add(mesh);

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(width, height);
    map.anisotropy = renderer.capabilities.getMaxAnisotropy?.() || 1;

    canvasHost.appendChild(renderer.domElement);

    const grainVert = `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
      }
    `;
    const grainFrag = `
      uniform float amount;
      uniform sampler2D tDiffuse;
      varying vec2 vUv;

      float random(vec2 p){
        vec2 K1 = vec2(23.14069263277926, 2.665144142690225);
        return fract(cos(dot(p, K1)) * 12345.6789);
      }

      void main(){
        vec2 uv = vUv;
        float lineHash = random(vec2(floor(uv.y * 180.0), amount));
        float lineShift = (lineHash * 2.0 - 1.0) * amount * 0.03;
        uv.x += lineShift;

        float split = amount * 0.012;
        vec2 offR = vec2(split, 0.0);
        vec2 offB = vec2(-split, 0.0);

        vec4 cR = texture2D(tDiffuse, uv + offR);
        vec4 cG = texture2D(tDiffuse, uv);
        vec4 cB = texture2D(tDiffuse, uv + offB);
        vec4 col = vec4(cR.r, cG.g, cB.b, cG.a);

        vec2 uvRandom = uv;
        uvRandom.y *= random(vec2(uv.y, amount));
        col.rgb += random(uvRandom) * (0.08 + amount * 0.10);

        gl_FragColor = col;
      }
    `;

    let composer: EffectComposer, grainPass: ShaderPass | null;
    {
      composer = new EffectComposer(renderer);
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      const grainEffect = {
        uniforms: {
          tDiffuse: { value: null },
          amount:   { value: 0.0 }
        },
        vertexShader: grainVert,
        fragmentShader: grainFrag
      };
      grainPass = new ShaderPass(grainEffect);
      // @ts-ignore
      ;(grainPass as any).renderToScreen = true;
      composer.addPass(grainPass);
    }

    const onResize = () => {
      if (isShutDown) return;
      const { width: w, height: h } = getSize();
      width = w; height = h;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);

    const dummy = new Object3D();

    let rafId = 0;
    const startTime = performance.now();

    let scaleTarget = 1;
    const MIN_SCALE = 1.5;
    const MAX_SCALE = 8;
    const SPEED = 0.0035 / 3;
    const FIXED_SCALE = 2.7;
    let locked = false;

    let parallaxProgress = 0;
    const PARALLAX_MIN = 0;
    const PARALLAX_MAX = 1;
    const PARALLAX_SPEED = 0.0016;

    const heroTitle = hero.querySelector("h1") as HTMLElement | null;
    const heroText = hero.querySelector("p") as HTMLElement | null;
    const heroCtas = hero.querySelector("div") as HTMLElement | null;

    // Professional baseline styles + motion priming
    gsap.set([heroTitle, heroText, heroCtas], { willChange: "transform, opacity" });
    gsap.set(hero, { autoAlpha: 0, yPercent: 0, scale: 0.6, transformOrigin: "50% 50%" });

    // NEW: fade-out targets (everything except hero)
    const fadeTargets = Array.from(content.children).filter(el => el !== hero) as HTMLElement[];
    if (fadeTargets.length) gsap.set(fadeTargets, { willChange: "opacity, transform", autoAlpha: 1 });

    // NEW — subtle interactive typography
    if (heroTitle) {
      heroTitle.style.letterSpacing = "0.01em";
      heroTitle.style.fontWeight = "800";
    }
    if (heroText) {
      heroText.style.opacity = "0.92";
      heroText.style.fontWeight = "500";
    }

    const fx = { boost: 0, kick: 0 };

    // ——— Soft shutdown once hero is revealed ———
    let isShutDown = false;
    const deactivateCanvas = () => {
      if (isShutDown) return;
      isShutDown = true;
      window.removeEventListener("resize", onResize);
      wrapper.removeEventListener("wheel", onWheel as any);
      wrapper.removeEventListener("touchstart", onTouchStart as any);
      wrapper.removeEventListener("touchmove", onTouchMove as any);
      wrapper.removeEventListener("touchend", onTouchEnd as any);
      cancelAnimationFrame(rafId);
      smoother?.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
      try { composer?.dispose?.(); } catch {}
      try { renderer?.dispose?.(); } catch {}
      try { geom?.dispose?.(); } catch {}
      try { material?.dispose?.(); } catch {}
      try { map?.dispose?.(); } catch {}
      grainPass = null;
      if (canvasHost.contains(renderer.domElement)) canvasHost.removeChild(renderer.domElement);
      canvasHost.style.display = "none";
      wrapper.style.overflow = "auto";
    };

    const intensityFromScroll = () => {
      if (!locked) {
        const p = (scaleTarget - MIN_SCALE) / (FIXED_SCALE - MIN_SCALE);
        return gsap.utils.clamp(0, 1, p) * 0.35;
      }
      return parallaxProgress * 0.4 + 0.05;
    };

    const applyParallax = () => {
      const t = Math.min(PARALLAX_MAX, Math.max(PARALLAX_MIN, parallaxProgress));
      gsap.to(heroTitle, { yPercent: -10 * t, opacity: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
      gsap.to(heroText,  { yPercent: -16 * t, opacity: 0.9 + 0.1 * t, duration: 0.4, ease: "power2.out", overwrite: "auto" });
      gsap.to(heroCtas,  { yPercent: -22 * t, opacity: 0.9 + 0.1 * t, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    };

    const applyScale = () => {
      scaleTarget = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scaleTarget));
      gsap.to(scene.scale, {
        x: scaleTarget,
        y: scaleTarget,
        z: scaleTarget,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto"
      });
    };

    const fadeOutAndShutdown = () => {
      if (grainPass) {
        gsap.to(grainPass.uniforms.amount, { value: 0, duration: 0.5, ease: "power1.out" });
      }
      gsap.to(renderer.domElement, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: deactivateCanvas
      });
    };

    const revealHero = () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl
        .set(hero, { autoAlpha: 1 })
        .to(hero, { autoAlpha: 1, duration: 0.2 })
        .to(hero, { yPercent: 0, scale: 1, duration: 0.8 }, "<")
        .to(fadeTargets, { autoAlpha: 0, duration: 0.6, ease: "power2.out" }, "<")
        .to(grainPass ? (grainPass.uniforms as any).amount : {}, { value: 0.08, duration: 0.6 }, "<0.05")
        .add(fadeOutAndShutdown, ">-0.05");
    };

    const kickGlitch = (delta: number) => {
      const mag = Math.min(1, Math.abs(delta) * 0.004);
      const target = Math.max(fx.kick, mag);
      gsap.to(fx, { kick: target, duration: 0.06, overwrite: "auto" });
      gsap.to(fx, { kick: 0, duration: 0.45, ease: "power2.out", overwrite: "auto", delay: 0.06 });
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isShutDown) return;
      const dy = (e as any).deltaY || 0;
      kickGlitch(dy);
      if (!locked) {
        scaleTarget += dy * SPEED;
        if (scaleTarget >= FIXED_SCALE) {
          scaleTarget = FIXED_SCALE;
          locked = true;
          revealHero();
        }
        applyScale();
      } else {
        parallaxProgress += dy * PARALLAX_SPEED;
        parallaxProgress = Math.min(PARALLAX_MAX, Math.max(PARALLAX_MIN, parallaxProgress));
        applyParallax();
      }
    };

    let touchStartY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (!e.touches || !e.touches[0]) return;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isShutDown) return;
      if (touchStartY == null) return;
      const dy = touchStartY - e.touches[0].clientY;
      kickGlitch(dy);
      if (!locked) {
        scaleTarget += dy * SPEED * 0.8;
        if (scaleTarget >= FIXED_SCALE) {
          scaleTarget = FIXED_SCALE;
          locked = true;
          revealHero();
        }
        applyScale();
      } else {
        parallaxProgress += dy * PARALLAX_SPEED;
        parallaxProgress = Math.min(PARALLAX_MAX, Math.max(PARALLAX_MIN, parallaxProgress));
        applyParallax();
      }
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = () => { touchStartY = null; };

    wrapper.addEventListener("wheel", onWheel, { passive: false });
    wrapper.addEventListener("touchstart", onTouchStart as any, { passive: false });
    wrapper.addEventListener("touchmove", onTouchMove as any, { passive: false });
    wrapper.addEventListener("touchend", onTouchEnd as any, { passive: true });

    const render = () => {
      const time = (performance.now() - startTime) / 1000;
      let i = 0;
      for (let x = 0; x < rowCount; x++) {
        const a = (x / rowCount) * Math.PI * 2;
        const X = Math.cos(a) / 2;
        const Z = Math.sin(a) / 2;
        const t = time % 1;
        for (let y = 0; y < layerCount; y++) {
          const shift = y * Math.abs(Math.sin(x / 1.3)) + Math.sin(x / 1.3) + Math.cos(x / 1.7) - layerCount;
          for (let z = 0; z < columnCount; z++) {
            const t1 = Math.max(0, 3 - z + (time % 1) - shift);
            const Y = y - Math.pow(t1, 5);
            const radius = Math.sqrt((X * (z + 4 - t)) ** 2 + (Z * (z + 4 - t)) ** 2);
            if (radius < 3) continue;
            const xpos = X * (z + 4 - t);
            const zpos = Z * (z + 4 - t);
            dummy.position.set(xpos, Y, zpos);
            dummy.rotation.y = -a;
            dummy.scale.set(0.5, 1, 0.5);
            dummy.updateMatrix();
            mesh.setMatrixAt(i++, dummy.matrix);
          }
        }
      }
      mesh.count = i;
      mesh.instanceMatrix.needsUpdate = true;

      const base = intensityFromScroll();
      const amount = Math.min(1.2, base + fx.boost * 0.9 + fx.kick * 0.9);
      if (grainPass) (grainPass.uniforms as any).amount.value = amount;

      composer.render();
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    // ——— Micro-interactions for the hero after reveal ———
    // Parallax on pointer
    const pointerParallax = (e: MouseEvent) => {
      if (!heroTitle || !heroText || !heroCtas) return;
      const rect = hero.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width; // -0.5..0.5
      const dy = (e.clientY - cy) / rect.height;
      gsap.to(heroTitle, { xPercent: dx * 3, yPercent: dy * 3, duration: 0.3, ease: "power2.out" });
      gsap.to(heroText,  { xPercent: dx * 5, yPercent: dy * 5, duration: 0.35, ease: "power2.out" });
      gsap.to(heroCtas,  { xPercent: dx * 7, yPercent: dy * 7, duration: 0.4, ease: "power2.out" });
    };
    hero.addEventListener("mousemove", pointerParallax);

    // CTA hover focus states
    const ctaLinks = hero.querySelectorAll<HTMLAnchorElement>("a");
    ctaLinks.forEach((el) => {
      el.setAttribute("aria-label", el.textContent || "CTA");
      const enter = () => gsap.to(el, { scale: 1.05, y: -2, duration: 0.2, ease: "power2.out" });
      const leave = () => gsap.to(el, { scale: 1, y: 0, duration: 0.25, ease: "power2.out" });
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      el.addEventListener("focus", enter);
      el.addEventListener("blur", leave);
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      wrapper.removeEventListener("wheel", onWheel as any);
      wrapper.removeEventListener("touchstart", onTouchStart as any);
      wrapper.removeEventListener("touchmove", onTouchMove as any);
      wrapper.removeEventListener("touchend", onTouchEnd as any);
      hero.removeEventListener("mousemove", pointerParallax);
      smoother?.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
      if (canvasHost.contains(renderer.domElement)) canvasHost.removeChild(renderer.domElement);
      geom.dispose();
      material.dispose();
      map.dispose();
      // @ts-ignore
      composer?.dispose?.();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      id="wrapper"
      ref={wrapperRef}
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        touchAction: "none",
        background: "#000"
      }}
    >
      <div id="content" ref={contentRef}>
        <div
          ref={canvasHostRef}
          style={{ position: "fixed", inset: 0, width: "100%", height: "100vh", pointerEvents: "none", zIndex: 0 }}
        />

        <section
          ref={heroRef}
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            background: "transparent",
            color: "#fff",
            padding: "8vh 5vw",
            fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
            position: "relative",
            zIndex: 1,
            textRendering: "optimizeLegibility",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale"
          }}
        >
          {/* ——— Updated, more professional headline & copy in English ——— */}
          <h1
            style={{
              fontSize: "clamp(2.25rem, 6.2vw, 5.75rem)",
              letterSpacing: "-0.01em",
              margin: 0,
              fontWeight: 800,
              lineHeight: 1.05,
              filter: "drop-shadow(0 6px 18px rgba(0,0,0,.55))",
              textAlign: "center"
            }}
          >
            We Build Precise Digital Experiences
          </h1>

          <p
            style={{
              maxWidth: 820,
              textAlign: "center",
              lineHeight: 1.6,
              opacity: 0.95,
              margin: 0,
              fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
              fontWeight: 500,
              filter: "drop-shadow(0 4px 14px rgba(0,0,0,.55))"
            }}
          >
            Strategy, design and development without visual noise. Clear typography, expressive animation and product‑level performance.
          </p>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <a
              href="#"
              style={{
                padding: "0.9rem 1.2rem",
                border: "1px solid #fff",
                color: "#0f0f0f",
                textDecoration: "none",
                borderRadius: 9999,
                transition: "opacity .2s, background .2s, color .2s, transform .2s",
                background: "#fff",
                filter: "drop-shadow(0 4px 14px rgba(0,0,0,.45))",
                fontWeight: 600
              }}
            >
              Start a Project
            </a>
            <a
              href="#"
              style={{
                padding: "0.9rem 1.2rem",
                border: "1px solid #2a2a2a",
                color: "#cfcfcf",
                textDecoration: "none",
                borderRadius: 9999,
                transition: "opacity .2s, background .2s, color .2s, transform .2s",
                background: "rgba(255,255,255,0.02)",
                filter: "drop-shadow(0 4px 14px rgba(0,0,0,.45))",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                fontWeight: 600
              }}
            >
              Learn More
            </a>
          </div>
        </section>
      </div>
    </div>
  );

}