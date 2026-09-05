"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Check,
  Copy,
  Github,
  Instagram,
  Quote,
  Twitter,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";

type CitationFormat = "APA" | "MLA" | "Chicago" | "BibTeX";

type SocialLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export type AuraFarmCreditProps = {
  name?: string;
  title?: string;
  subtitle?: string;
  researchTag?: string;
  researchSubtag?: string;
  credits?: string[];
  imagePrimarySrc?: string;
  imageRevealSrc?: string;
  citationBaseUrl?: string;
  citationTitle?: string;
  citationAuthor?: string;
  citationInstitution?: string;
  quoteLines?: string[];
  socials?: SocialLink[];
};

type BlobState = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
};

function BlobCanvas({ imageRevealSrc }: { imageRevealSrc: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const targetMouse = useRef({ x: -9999, y: -9999 });
  const currentMouse = useRef({ x: -9999, y: -9999 });
  const isHovering = useRef(false);
  const blobsRef = useRef<BlobState[]>([]);
  const velocityRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageRevealSrc;
    image.onload = () => {
      imageRef.current = image;
    };
  }, [imageRevealSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return undefined;
    }

    let isVisible = false;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      frameRef.current = 0;
      if (!isVisible) {
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      const image = imageRef.current;

      if (!image || !isHovering.current) {
        blobsRef.current = blobsRef.current
          .map((blob) => ({ ...blob, opacity: blob.opacity * 0.86, size: blob.size * 0.96 }))
          .filter((blob) => blob.opacity > 0.04);

        if (blobsRef.current.length > 0) {
          frameRef.current = requestAnimationFrame(draw);
        }
        return;
      }

      const ease = 0.1;
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * ease;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * ease;

      velocityRef.current.x = (targetMouse.current.x - currentMouse.current.x) * 0.4;
      velocityRef.current.y = (targetMouse.current.y - currentMouse.current.y) * 0.4;

      const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y);
      const mx = currentMouse.current.x;
      const my = currentMouse.current.y;

      if (speed > 2) {
        blobsRef.current.push({
          x: mx,
          y: my,
          size: 64 + speed * 2.4,
          opacity: 0.56,
          rotation: Math.random() * Math.PI,
        });
        if (blobsRef.current.length > 22) {
          blobsRef.current.shift();
        }
      }

      context.save();
      context.beginPath();
      const stretch = Math.min(speed * 0.72, 62);
      context.ellipse(
        mx,
        my,
        128 + stretch,
        104 - stretch * 0.36,
        Math.atan2(velocityRef.current.y, velocityRef.current.x),
        0,
        Math.PI * 2,
      );

      for (const blob of blobsRef.current) {
        context.ellipse(
          blob.x,
          blob.y,
          blob.size * 0.55,
          blob.size * 0.45,
          blob.rotation,
          0,
          Math.PI * 2,
        );
      }

      context.fillStyle = "#ffffff";
      context.fill();
      context.clip();

      context.fillStyle = "#000000";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      const x = (canvas.width - width) / 2;
      const y = 0;

      context.drawImage(image, x, y, width, height);
      context.restore();

      blobsRef.current = blobsRef.current
        .map((blob) => ({ ...blob, opacity: blob.opacity * 0.92, size: blob.size * 0.97 }))
        .filter((blob) => blob.opacity > 0.04 && blob.size > 4);

      frameRef.current = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
        if (isVisible && frameRef.current === 0) {
          frameRef.current = requestAnimationFrame(draw);
        }
      },
      { threshold: 0.01 },
    );

    intersectionObserver.observe(canvas);

    const handleEnter = () => {
      isHovering.current = true;
      if (isVisible && frameRef.current === 0) {
        frameRef.current = requestAnimationFrame(draw);
      }
    };

    const handleLeave = () => {
      isHovering.current = false;
    };

    const handleMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    canvas.addEventListener("mouseenter", handleEnter);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("mousemove", handleMove, { passive: true });

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("mouseenter", handleEnter);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("mousemove", handleMove);
    };
  }, [imageRevealSrc]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ cursor: "none" }} />;
}

function MorphingBackText({ title }: { title: string }) {
  const [showAlt, setShowAlt] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setShowAlt((current) => !current);
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="text-center" style={{ perspective: "900px" }}>
        <div
          className="font-black uppercase leading-none tracking-widest"
          style={{
            fontSize: "clamp(4rem, 12vw, 11rem)",
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(255,255,255,0.06)",
            textShadow: "0 0 80px rgba(30,161,242,0.06)",
            transform: "rotateX(8deg) rotateY(-3deg)",
          }}
        >
          Author &
        </div>

        <div
          className="relative overflow-hidden font-black uppercase leading-none tracking-widest"
          style={{ fontSize: "clamp(4rem, 12vw, 11rem)" }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={showAlt ? "alt" : "primary"}
              initial={{ y: 44, opacity: 0, filter: "blur(8px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -44, opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="block"
              style={{
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(30,161,242,0.12)",
                textShadow: "0 0 80px rgba(30,161,242,0.08)",
                transform: "rotateX(8deg) rotateY(-3deg)",
              }}
            >
              {showAlt ? title : "Designer"}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function WaveLines({ mouseX }: { mouseX: number }) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-10">
      {Array.from({ length: 6 }).map((_, index) => {
        const offset = typeof window !== "undefined" ? (mouseX / window.innerWidth) * 20 - 10 : 0;
        const yBase = (index + 1) * (100 / 7);

        return (
          <motion.path
            key={index}
            d={`M 0 ${yBase}% Q 50% ${yBase - 3 + offset * 0.3}% 100% ${yBase}%`}
            stroke={index % 2 === 0 ? "#1EA1F2" : "#8B4DFF"}
            strokeWidth="0.5"
            fill="none"
            animate={{
              d: [
                `M 0 ${yBase}% Q 50% ${yBase - 4 + offset}% 100% ${yBase}%`,
                `M 0 ${yBase}% Q 30% ${yBase + 3 - offset * 0.5}% 100% ${yBase - 1}%`,
                `M 0 ${yBase}% Q 70% ${yBase - 2 + offset * 0.3}% 100% ${yBase}%`,
              ],
            }}
            transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}
    </svg>
  );
}

function CitationModal({
  onClose,
  citationAuthor,
  citationTitle,
  citationInstitution,
  citationBaseUrl,
}: {
  onClose: () => void;
  citationAuthor: string;
  citationTitle: string;
  citationInstitution: string;
  citationBaseUrl: string;
}) {
  const [selected, setSelected] = useState<CitationFormat>("APA");
  const [copied, setCopied] = useState(false);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const citations: Record<CitationFormat, string> = {
    APA: `${citationAuthor}. (2025). ${citationTitle}. ${citationInstitution}. ${citationBaseUrl}`,
    MLA: `${citationAuthor}. "${citationTitle}." ${citationInstitution}, 2025. ${citationBaseUrl}. Accessed ${today}.`,
    Chicago: `${citationAuthor}. 2025. "${citationTitle}." ${citationInstitution}. ${citationBaseUrl}`,
    BibTeX: `@misc{aura_farm_credit,\n  author = {${citationAuthor}},\n  title = {${citationTitle}},\n  year = {2025},\n  url = {${citationBaseUrl}}\n}`,
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(citations[selected]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-lg"
    >
      <motion.div
        initial={{ y: 40, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 20, scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(10,10,20,0.96)_0%,rgba(3,3,5,0.98)_100%)] shadow-[0_0_80px_rgba(30,161,242,0.14),0_30px_60px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center justify-between border-b border-white/8 px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-400/10">
              <BookOpen className="h-4 w-4 text-sky-300" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-white">Cite This Credit</span>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-white/50 transition hover:bg-white/5 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2 px-8 pt-6 pb-2">
          {(["APA", "MLA", "Chicago", "BibTeX"] as CitationFormat[]).map((format) => (
            <button
              key={format}
              onClick={() => setSelected(format)}
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${
                selected === format
                  ? "bg-sky-400 text-black shadow-[0_0_20px_rgba(30,161,242,0.45)]"
                  : "border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              {format}
            </button>
          ))}
        </div>

        <div className="px-8 py-6">
          <div className="relative rounded-2xl border border-white/8 bg-white/[0.03] p-6 font-mono text-sm leading-relaxed text-white/80">
            <div className="absolute top-3 right-3 text-[10px] uppercase tracking-widest text-white/20">{selected}</div>
            {citations[selected]}
          </div>
        </div>

        <div className="flex items-center justify-between px-8 pb-7">
          <p className="text-xs text-white/28">Generated · {today}</p>
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-5 py-2.5 text-sm font-bold text-sky-300"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

const defaultSocials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/solez-ai", icon: <Github className="h-5 w-5" /> },
  { label: "X / Twitter", href: "https://x.com/Solez_None", icon: <Twitter className="h-5 w-5" /> },
  { label: "Instagram", href: "https://www.instagram.com/solez.ai/", icon: <Instagram className="h-5 w-5" /> },
];

function AuraFarmCredit({
  name = "Samin Yeasar",
  title = "Developer",
  subtitle = "of this Website",
  researchTag = "Author of the Research",
  researchSubtag = "Published at IARCO 2025",
  credits = ["Research", "Design", "Engineering"],
  imagePrimarySrc = "https://i.postimg.cc/7PNND1Rf/image1.png",
  imageRevealSrc = "https://i.postimg.cc/c44BJgqt/image2.png",
  citationBaseUrl = "https://privacy-ai-in-medicine.vercel.app",
  citationTitle = "Privacy-Preserving Federated & Differentially Private Deep Learning for Multi Center Medical Imaging",
  citationAuthor = "Samin Yeasar",
  citationInstitution = "Birshreshtha Munshi Abdur Rouf Public College",
  quoteLines = [
    "The approach is timely: new regulatory pressures demand privacy-by-design and explainable AI.",
    "The goal is to show that hospitals can build safer shared models without giving up performance or breaking privacy laws.",
  ],
  socials = defaultSocials,
}: AuraFarmCreditProps) {
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const [mounted, setMounted] = useState(false);
  const [citationOpen, setCitationOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  }, []);

  /*
    To use local images instead of hosted URLs:

    1. Put the files inside your app's /public folder
       Example:
       /public/image1.png
       /public/image2.png

    2. Pass the local paths as props:

       <AuraFarmCredit
         imagePrimarySrc="/image1.png"
         imageRevealSrc="/image2.png"
       />
  */

  return (
    <>
      <section
        onMouseMove={handleMouseMove}
        className="relative w-full overflow-hidden bg-[#030305]"
        style={{ minHeight: "100svh", height: "100svh" }}
      >
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(to right, rgba(3,3,5,0.65) 0%, rgba(3,3,5,0.12) 40%, rgba(3,3,5,0.12) 60%, rgba(3,3,5,0.65) 100%), linear-gradient(to bottom, rgba(3,3,5,0.42) 0%, rgba(3,3,5,0) 30%, rgba(3,3,5,0) 70%, rgba(3,3,5,0.92) 100%)",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagePrimarySrc}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover object-top"
            draggable={false}
          />
        </div>

        <MorphingBackText title={title} />
        <WaveLines mouseX={mousePos.x} />

        {mounted && (
          <div className="absolute inset-0 z-[3]">
            <BlobCanvas imageRevealSrc={imageRevealSrc} />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 pt-12 sm:p-10 lg:p-14">
          <div className="flex w-full flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: -20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <div
                className="leading-[0.9] tracking-tight text-white"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(2.5rem, 8vw, 5rem)",
                  fontWeight: 700,
                  textShadow: "0 2px 40px rgba(0,0,0,0.8)",
                }}
              >
                {name.split(" ").map((part) => (
                  <div key={part}>{part}</div>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-1 lg:mt-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300 sm:text-xs sm:tracking-[0.25em]">
                  {title}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/42 sm:text-xs sm:tracking-[0.25em]">
                  {subtitle}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="mt-2 flex flex-col gap-4 lg:items-end lg:text-right"
            >
              <div className="flex flex-col gap-1 lg:items-end">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300 sm:text-xs sm:tracking-[0.25em]">
                  {researchTag}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/42 sm:text-xs sm:tracking-[0.25em]">
                  {researchSubtag}
                </span>
              </div>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCitationOpen(true)}
                className="pointer-events-auto flex w-max items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-5 py-2.5 backdrop-blur-xl"
              >
                <BookOpen className="h-4 w-4 text-sky-300" />
                <span className="text-[10px] uppercase tracking-widest text-white/75 sm:text-xs">Cite Credit</span>
              </motion.button>
            </motion.div>
          </div>

          <div className="mt-auto flex w-full flex-col-reverse justify-between gap-6 lg:flex-row lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center gap-3"
            >
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 backdrop-blur-xl transition hover:text-white"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>

            <div className="lg:text-right">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-[9px] uppercase tracking-widest text-white/22 sm:text-[10px]"
              >
                {credits.join(" · ")}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-2 flex flex-wrap gap-2 lg:justify-end"
              >
                {quoteLines.map((line) => (
                  <span
                    key={line}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[9px] uppercase tracking-[0.18em] text-white/42 sm:text-[10px]"
                  >
                    <Quote className="h-3 w-3 text-sky-300/80" />
                    {line}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {mounted && (
        <AnimatePresence>
          {citationOpen && (
            <CitationModal
              onClose={() => setCitationOpen(false)}
              citationAuthor={citationAuthor}
              citationTitle={citationTitle}
              citationInstitution={citationInstitution}
              citationBaseUrl={citationBaseUrl}
            />
          )}
        </AnimatePresence>
      )}
    </>
  );
}

export function Component(props: AuraFarmCreditProps) {
  return <AuraFarmCredit {...props} />;
}

export default AuraFarmCredit;
