import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
const ORIG = "AUTHENTICATE";
const STATUS_MSGS = [
  "Secure channel established",
  "TLS 1.3 handshake complete",
  "End-to-end encrypted",
  "Zero knowledge proof active",
];

export const Component = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [inp1Mouse, setInp1Mouse] = useState(0);
  const [inp2Mouse, setInp2Mouse] = useState(0);
  const [inp1Hover, setInp1Hover] = useState(false);
  const [inp2Hover, setInp2Hover] = useState(false);
  const [inp1Focus, setInp1Focus] = useState(false);
  const [inp2Focus, setInp2Focus] = useState(false);
  const [btnText, setBtnText] = useState(ORIG);
  const [statusIdx, setStatusIdx] = useState(0);
  const [statusVisible, setStatusVisible] = useState(true);
  const [typedHint, setTypedHint] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const scrambleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrambleCount = useRef(0);
  const typedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);

  // Cursor animation
  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    const animate = () => {
      animRef.current.rx += (mouse.x - animRef.current.rx) * 0.12;
      animRef.current.ry += (mouse.y - animRef.current.ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = Math.round(animRef.current.rx) + "px";
        ringRef.current.style.top = Math.round(animRef.current.ry) + "px";
      }
      if (dotRef.current) {
        dotRef.current.style.left = mouse.x + "px";
        dotRef.current.style.top = mouse.y + "px";
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mouse]);

  // Status cycling
  useEffect(() => {
    const iv = setInterval(() => {
      setStatusVisible(false);
      setTimeout(() => {
        setStatusIdx((i) => (i + 1) % STATUS_MSGS.length);
        setStatusVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  // Typed hint
  const handleEmailChange = (v: string) => {
    setEmail(v);
    if (typedTimer.current) clearTimeout(typedTimer.current);
    setTypedHint("");
    if (v.length > 3) {
      const hints = ["verifying domain...", "resolving identity...", "checking registry...", "user found ✓"];
      const idx = v.includes("@") ? 3 : Math.min(2, Math.floor(v.length / 4));
      typedTimer.current = setTimeout(() => setTypedHint("> " + hints[idx]), 600);
    }
  };

  // Scramble
  const startScramble = () => {
    if (scrambleRef.current) clearInterval(scrambleRef.current);
    scrambleCount.current = 0;
    scrambleRef.current = setInterval(() => {
      const s = ORIG.split("").map((c, i) =>
        i < scrambleCount.current ? ORIG[i] : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join("");
      setBtnText(s);
      scrambleCount.current++;
      if (scrambleCount.current > ORIG.length) {
        clearInterval(scrambleRef.current!);
        setBtnText(ORIG);
      }
    }, 40);
  };

  const stopScramble = () => {
    if (scrambleRef.current) clearInterval(scrambleRef.current);
    setBtnText(ORIG);
  };

  // Magnetic button
  const handleBtnMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setBtnPos({
      x: (e.clientX - r.left - r.width / 2) * 0.25,
      y: (e.clientY - r.top - r.height / 2) * 0.25,
    });
  };

  const beamGrad = (x: number) =>
    `radial-gradient(50px circle at ${x}px 0px, rgba(0,245,200,0.8) 0%, transparent 70%)`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        .login-root { font-family: 'JetBrains Mono', monospace; }
        .login-grid-bg {
          background-image:
            linear-gradient(rgba(0,245,200,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,200,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: gridShift 20s linear infinite;
        }
        @keyframes gridShift { from { background-position: 0 0; } to { background-position: 48px 48px; } }
        .login-scanline {
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
        }
        .login-particle { position: absolute; width: 2px; height: 2px; background: #00F5C8; border-radius: 50%; opacity: 0; }
        @keyframes floatUp {
          0% { transform: translateY(100%) translateX(0); opacity: 0; }
          10% { opacity: 0.6; } 90% { opacity: 0.2; }
          100% { transform: translateY(-80px) translateX(var(--x,20px)); opacity: 0; }
        }
        .login-glitch { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; color: #fff; position: relative; display: inline-block; letter-spacing: -0.5px; }
        .login-glitch::before, .login-glitch::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        .login-glitch::before { color: #00F5C8; z-index: -1; animation: glitch1 4s infinite; clip-path: polygon(0 0,100% 0,100% 35%,0 35%); }
        .login-glitch::after { color: #ff2d78; z-index: -2; animation: glitch2 4s infinite; clip-path: polygon(0 65%,100% 65%,100% 100%,0 100%); }
        @keyframes glitch1 { 0%,95%,100%{transform:translate(0)} 96%{transform:translate(-2px,-1px)} 97%{transform:translate(2px,1px)} 98%{transform:translate(-1px,2px)} 99%{transform:translate(1px,-1px)} }
        @keyframes glitch2 { 0%,95%,100%{transform:translate(0)} 96%{transform:translate(2px,1px)} 97%{transform:translate(-2px,-1px)} 98%{transform:translate(1px,-2px)} 99%{transform:translate(-1px,1px)} }
        .login-inp { width:100%; height:48px; padding:0 16px; background:rgba(0,245,200,0.03); border:1px solid rgba(0,245,200,0.12); border-radius:2px; color:#e8f4f0; font-family:'JetBrains Mono',monospace; font-size:14px; outline:none; transition:all 0.3s; caret-color:#00F5C8; }
        .login-inp::placeholder { color: rgba(0,245,200,0.2); }
        .login-inp:focus { background:rgba(0,245,200,0.05); border-color:rgba(0,245,200,0.4); box-shadow:0 0 0 3px rgba(0,245,200,0.06),inset 0 1px 0 rgba(0,245,200,0.1); }
        .login-scan-beam { position:absolute;top:0;left:-100%;width:40%;height:100%;background:linear-gradient(90deg,transparent,rgba(0,245,200,0.08),transparent);pointer-events:none;border-radius:2px; }
        .login-inp:focus ~ .login-scan-beam { animation:scan 1.5s ease-in-out; }
        @keyframes scan { 0%{left:-40%} 100%{left:140%} }
        .login-btn { position:relative;overflow:hidden;height:48px;padding:0 32px;background:transparent;border:1px solid rgba(0,245,200,0.4);border-radius:2px;color:#00F5C8;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:border-color 0.3s,box-shadow 0.3s,color 0.3s; }
        .login-btn:hover { border-color:rgba(0,245,200,0.8);box-shadow:0 0 24px rgba(0,245,200,0.15),inset 0 0 24px rgba(0,245,200,0.05);color:#fff; }
        .login-btn-shine { position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(0,245,200,0.15),transparent);transform:skewX(-15deg);pointer-events:none; }
        .login-btn:hover .login-btn-shine { animation:shineMove 0.8s ease-in-out forwards; }
        @keyframes shineMove { 0%{left:-60%} 100%{left:140%} }
        .dot-pulse { animation: dotPulse 2s ease-in-out infinite; }
        @keyframes dotPulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        .card-corner::before { content:'';position:absolute;width:8px;height:8px;background:#00F5C8;border-radius:50%;box-shadow:0 0 12px #00F5C8,0 0 24px rgba(0,245,200,0.4);animation:dotPulse 2s ease-in-out infinite;top:-4px;left:-4px; }
        .card-corner::after { content:'';position:absolute;width:8px;height:8px;background:#00F5C8;border-radius:50%;box-shadow:0 0 12px #00F5C8,0 0 24px rgba(0,245,200,0.4);animation:dotPulse 2s ease-in-out infinite 1s;bottom:-4px;right:-4px; }
        .cursor-ring { position:fixed;width:32px;height:32px;border:1px solid rgba(0,245,200,0.5);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:screen;transition:width 0.2s,height 0.2s; }
        .cursor-dot { position:fixed;width:4px;height:4px;background:#00F5C8;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);box-shadow:0 0 8px #00F5C8; }
      `}</style>

      {/* Cursor */}
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />

      <div className="login-root" style={{ width: "100%", minHeight: 600, background: "#030507", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {/* Grid bg */}
        <div className="login-grid-bg" style={{ position: "absolute", inset: 0 }} />
        {/* Scanline */}
        <div className="login-scanline" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }} />

        {/* Particles */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="login-particle" style={{
              left: `${Math.random() * 100}%`,
              animation: `floatUp ${6 + Math.random() * 12}s ${Math.random() * 8}s infinite linear`,
              ["--x" as string]: `${Math.random() * 60 - 30}px`,
            }} />
          ))}
        </div>

        {/* Corner brackets */}
        {[
          { style: { top: 24, left: 24, borderWidth: "2px 0 0 2px" } },
          { style: { top: 24, right: 24, borderWidth: "2px 2px 0 0" } },
          { style: { bottom: 24, left: 24, borderWidth: "0 0 2px 2px" } },
          { style: { bottom: 24, right: 24, borderWidth: "0 2px 2px 0" } },
        ].map((b, i) => (
          <div key={i} style={{ position: "absolute", width: 20, height: 20, borderColor: "#00F5C8", borderStyle: "solid", opacity: 0.5, ...b.style }} />
        ))}

        {/* Card */}
        <div className="card-corner" style={{
          position: "relative", zIndex: 10, width: 420, maxWidth: "calc(100vw - 32px)",
          padding: "48px 40px 40px",
          background: "rgba(5,12,18,0.92)",
          border: "1px solid rgba(0,245,200,0.15)",
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 0 1px rgba(0,245,200,0.05), 0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(0,245,200,0.1)",
        }}>

          {/* Status */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <div className="dot-pulse" style={{ width: 6, height: 6, background: "#00F5C8", borderRadius: "50%", boxShadow: "0 0 8px #00F5C8", flexShrink: 0 }} />
            <span style={{ fontSize: 10, letterSpacing: 2, color: "rgba(0,245,200,0.5)", textTransform: "uppercase", opacity: statusVisible ? 1 : 0, transition: "opacity 0.3s" }}>
              {STATUS_MSGS[statusIdx]}
            </span>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 8 }}>
            <div className="login-glitch" data-text="SIGN IN">SIGN IN</div>
          </div>
          <div style={{ fontSize: 11, color: "rgba(0,245,200,0.4)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 36, fontFamily: "'JetBrains Mono',monospace" }}>
            // identity verification required
          </div>

          {/* Email field */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 10, letterSpacing: 2, color: "rgba(0,245,200,0.5)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Identifier</label>
            <div style={{ position: "relative" }}>
              <input
                className="login-inp"
                type="email"
                placeholder="user@domain.io"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setInp1Mouse(e.clientX - r.left); }}
                onMouseEnter={() => setInp1Hover(true)}
                onMouseLeave={() => setInp1Hover(false)}
                onFocus={() => setInp1Focus(true)}
                onBlur={() => setInp1Focus(false)}
              />
              <div className="login-scan-beam" />
              {(inp1Hover || inp1Focus) && <>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: beamGrad(inp1Mouse), pointerEvents: "none", zIndex: 2 }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: beamGrad(inp1Mouse), pointerEvents: "none", zIndex: 2 }} />
              </>}
            </div>
            {typedHint && <div style={{ fontSize: 11, color: "#00F5C8", letterSpacing: 1, marginTop: 6, opacity: 0.7, fontFamily: "'JetBrains Mono',monospace" }}>{typedHint}</div>}
          </div>

          {/* Password field */}
          <div style={{ marginBottom: 0 }}>
            <label style={{ fontSize: 10, letterSpacing: 2, color: "rgba(0,245,200,0.5)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Auth key</label>
            <div style={{ position: "relative" }}>
              <input
                className="login-inp"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setInp2Mouse(e.clientX - r.left); }}
                onMouseEnter={() => setInp2Hover(true)}
                onMouseLeave={() => setInp2Hover(false)}
                onFocus={() => setInp2Focus(true)}
                onBlur={() => setInp2Focus(false)}
              />
              <div className="login-scan-beam" />
              {(inp2Hover || inp2Focus) && <>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: beamGrad(inp2Mouse), pointerEvents: "none", zIndex: 2 }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: beamGrad(inp2Mouse), pointerEvents: "none", zIndex: 2 }} />
              </>}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
            <button
              className="login-btn"
              style={{ transform: `translate(${btnPos.x}px,${btnPos.y}px)` }}
              onMouseEnter={startScramble}
              onMouseLeave={() => { stopScramble(); setBtnPos({ x: 0, y: 0 }); }}
              onMouseMove={handleBtnMove}
            >
              <div className="login-btn-shine" />
              {btnText}
            </button>
            <span style={{ fontSize: 11, color: "rgba(0,245,200,0.3)", letterSpacing: 1, cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(0,245,200,0.7)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,245,200,0.3)")}>
              reset access →
            </span>
          </div>

          {/* Meta */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(0,245,200,0.06)", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, color: "rgba(0,245,200,0.2)", letterSpacing: 1 }}>256-bit encryption</span>
            <span style={{ fontSize: 10, color: "rgba(0,245,200,0.15)", fontFamily: "'JetBrains Mono',monospace" }}>v2.4.1</span>
          </div>
        </div>
      </div>
    </>
  );
};