import { useEffect, useRef, useState } from "react";

const ROOMS = [
  { id: "airlock", title: "AIRLOCK", subtitle: "Entry Decompression Chamber", desc: "Atmospheric equalization in progress. Stand by.", color: "#00d4ff", bg: "radial-gradient(ellipse at center, #001a2e 0%, #000d1a 100%)", robotMsg: "Welcome aboard, explorer. I am ARIA — your station guide.", objects: "hexagons" },
  { id: "corridor", title: "MAIN CORRIDOR", subtitle: "Primary Transit Axis — Level 3", desc: "Four hundred meters of reinforced titanium hull.", color: "#7b2fff", bg: "radial-gradient(ellipse at center, #0d0a2e 0%, #060312 100%)", robotMsg: "This corridor connects all six station modules.", objects: "pipes" },
  { id: "lab", title: "RESEARCH LAB", subtitle: "Xenobiology Division — Sector 4", desc: "Classified experiments. Do not touch the specimens.", color: "#00ff9d", bg: "radial-gradient(ellipse at center, #001a0e 0%, #00100a 100%)", robotMsg: "Seventeen active experiments running. Fascinating, isn't it?", objects: "containers" },
  { id: "reactor", title: "POWER CORE", subtitle: "Fusion Reactor — Output 4.2 TW", desc: "Do not stare directly at the plasma column.", color: "#ff6b00", bg: "radial-gradient(ellipse at center, #1a0800 0%, #0d0400 100%)", robotMsg: "This reactor powers the entire sector. Stay on the walkway.", objects: "rings" },
  { id: "cryo", title: "CRYO VAULT", subtitle: "Long-Duration Sleep Chambers", desc: "246 colonists in stasis. Destination: Kepler-452b.", color: "#88ccff", bg: "radial-gradient(ellipse at center, #000e1a 0%, #00070d 100%)", robotMsg: "They've been sleeping for eleven years. Almost there.", objects: "pods" },
  { id: "observatory", title: "OBSERVATORY", subtitle: "Deep Space Observation Deck", desc: "Full panoramic view. 360° stellar mapping active.", color: "#ff3366", bg: "radial-gradient(ellipse at center, #1a0010 0%, #0d0008 100%)", robotMsg: "The nearest star is 4.2 light-years away. Beautiful, yes?", objects: "stars" },
  { id: "bridge", title: "COMMAND BRIDGE", subtitle: "Mission Control — Clearance Level 9", desc: "From here, we navigate the infinite.", color: "#ffd700", bg: "radial-gradient(ellipse at center, #1a1400 0%, #0d0a00 100%)", robotMsg: "You've reached the heart of the station. The journey ends… or begins.", objects: "screens" },
];

const ROOM_DEPTH = 1200;

function Robot({ color }: { color: string }) {
  const [blink, setBlink] = useState(false);
  const [bounce, setBounce] = useState(0);
  useEffect(() => {
    const b = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 120); }, 3500);
    let f = 0;
    const loop = setInterval(() => { f++; setBounce(Math.sin(f * 0.12) * 3); }, 30);
    return () => { clearInterval(b); clearInterval(loop); };
  }, []);
  return (
    <svg width="72" height="100" viewBox="0 0 72 100" style={{ transform: `translateY(${bounce}px)`, filter: `drop-shadow(0 0 10px ${color}88)` }}>
      <rect x="20" y="55" width="32" height="34" rx="7" fill="#0d0d1a" stroke={color} strokeWidth="1.5"/>
      <rect x="26" y="62" width="20" height="12" rx="3" fill={color} opacity="0.15" stroke={color} strokeWidth="1"/>
      <circle cx="30" cy="68" r="2" fill={color} opacity="0.9"><animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.8s" repeatCount="indefinite"/></circle>
      <circle cx="36" cy="68" r="2" fill="white" opacity="0.5"/>
      <circle cx="42" cy="68" r="2" fill={color} opacity="0.7"><animate attributeName="opacity" values="0.7;1;0.7" dur="2.2s" repeatCount="indefinite"/></circle>
      <rect x="9" y="57" width="11" height="22" rx="5" fill="#0d0d1a" stroke={color} strokeWidth="1.5"/>
      <circle cx="14" cy="81" r="4" fill={color} opacity="0.7"/>
      <rect x="52" y="57" width="11" height="22" rx="5" fill="#0d0d1a" stroke={color} strokeWidth="1.5"/>
      <circle cx="57" cy="81" r="4" fill={color} opacity="0.5"/>
      <rect x="25" y="86" width="8" height="14" rx="4" fill="#0d0d1a" stroke={color} strokeWidth="1.5"/>
      <rect x="39" y="86" width="8" height="14" rx="4" fill="#0d0d1a" stroke={color} strokeWidth="1.5"/>
      <rect x="22" y="98" width="12" height="4" rx="2" fill={color} opacity="0.8"/>
      <rect x="38" y="98" width="12" height="4" rx="2" fill={color} opacity="0.8"/>
      <rect x="32" y="48" width="8" height="8" rx="3" fill="#0d0d1a" stroke={color} strokeWidth="1"/>
      <rect x="16" y="20" width="40" height="30" rx="9" fill="#0d0d1a" stroke={color} strokeWidth="2"/>
      <line x1="36" y1="20" x2="36" y2="9" stroke={color} strokeWidth="2"/>
      <circle cx="36" cy="7" r="4" fill={color}><animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/></circle>
      <rect x="23" y="29" width="10" height={blink ? 1 : 8} rx="4" fill={color}/>
      <rect x="39" y="29" width="10" height={blink ? 1 : 8} rx="4" fill={color}/>
      <rect x="27" y="41" width="18" height="3" rx="1.5" fill={color} opacity="0.7"/>
    </svg>
  );
}

export default function SpaceStationJourney() {
  const [scrollY, setScrollY] = useState(0);
  const [typedMsg, setTypedMsg] = useState("");
  const [showHint, setShowHint] = useState(true);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalScroll = ROOM_DEPTH * ROOMS.length;
  const activeRoom = Math.min(ROOMS.length - 1, Math.floor((scrollY / totalScroll) * ROOMS.length));
  const cameraZ = scrollY;
  const room = ROOMS[activeRoom];

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const depth = (el.scrollTop / maxScroll) * totalScroll;
      setScrollY(depth);
      if (el.scrollTop > 10) setShowHint(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [totalScroll]);

  useEffect(() => {
    const msg = room.robotMsg;
    setTypedMsg("");
    if (typingRef.current) clearInterval(typingRef.current);
    let i = 0;
    typingRef.current = setInterval(() => {
      i++;
      setTypedMsg(msg.slice(0, i));
      if (i >= msg.length && typingRef.current) clearInterval(typingRef.current);
    }, 40);
    return () => { if (typingRef.current) clearInterval(typingRef.current); };
  }, [activeRoom]);

  return (
    <>
      <style>{`
        @keyframes spinCW { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes spinCCW { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
        @keyframes twinkle { from{opacity:0.2} to{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        html, body { margin: 0; padding: 0; overflow-x: hidden; background: #000; }
      `}</style>

      {/* Scroll spacer */}
      <div style={{ height: `${ROOMS.length * 280}vh` }} />

      {/* Sticky 3D viewport */}
      <div style={{ position: "fixed", inset: 0, perspective: 900, perspectiveOrigin: "50% 48%", overflow: "hidden" }}>

        {/* Vignette */}
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.9) 100%)",pointerEvents:"none",zIndex:10 }}/>

        {/* Scanlines */}
        <div style={{ position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.05) 3px,rgba(0,0,0,0.05) 4px)",pointerEvents:"none",zIndex:11 }}/>

        {/* 3D world */}
        <div style={{ position:"absolute",inset:0,transformStyle:"preserve-3d",transform:`translateZ(${cameraZ}px)`,transition:"transform 0.05s linear" }}>
          {ROOMS.map((r, i) => {
            const z = -i * ROOM_DEPTH;
            const c = r.color;
            return (
              <div key={r.id} style={{ position:"absolute",inset:0,transform:`translateZ(${z}px)`,transformStyle:"preserve-3d" }}>
                {/* BG */}
                <div style={{ position:"absolute",inset:0,background:r.bg }}/>
                {/* Floor grid */}
                <div style={{ position:"absolute",bottom:0,left:"-50%",right:"-50%",height:"55%",background:`linear-gradient(90deg,${c}18 1px,transparent 1px) 0 0/60px 60px,linear-gradient(0deg,${c}18 1px,transparent 1px) 0 0/60px 60px,linear-gradient(180deg,transparent 0%,${c}08 100%)`,transform:"rotateX(58deg)",transformOrigin:"bottom center" }}/>
                {/* Ceiling grid */}
                <div style={{ position:"absolute",top:0,left:"-50%",right:"-50%",height:"50%",background:`linear-gradient(90deg,${c}10 1px,transparent 1px) 0 0/60px 60px,linear-gradient(0deg,${c}10 1px,transparent 1px) 0 0/60px 60px`,transform:"rotateX(-58deg)",transformOrigin:"top center" }}/>
                {/* Wall panels L */}
                {[-1,0,1].map(j=>(
                  <div key={j} style={{ position:"absolute",left:"2%",top:`${28+j*18}%`,width:"14%",height:"14%",border:`1px solid ${c}33`,borderRadius:6,background:`linear-gradient(135deg,${c}08 0%,transparent 100%)` }}/>
                ))}
                {/* Wall panels R */}
                {[-1,0,1].map(j=>(
                  <div key={j} style={{ position:"absolute",right:"2%",top:`${28+j*18}%`,width:"14%",height:"14%",border:`1px solid ${c}33`,borderRadius:6,background:`linear-gradient(135deg,${c}08 0%,transparent 100%)` }}/>
                ))}
                {/* Room-specific objects */}
                {r.objects === "rings" && [0,1,2,3].map(k=>(
                  <div key={k} style={{ position:"absolute",width:80+k*80,height:80+k*80,border:`${3-k*0.5}px solid ${c}66`,borderRadius:"50%",left:"50%",top:"50%",marginLeft:-(40+k*40),marginTop:-(40+k*40),animation:`${k%2===0?"spinCW":"spinCCW"} ${8+k*4}s linear infinite` }}/>
                ))}
                {r.objects === "pods" && [-2,-1,0,1,2].map(k=>(
                  <div key={k} style={{ position:"absolute",width:100,height:180,border:`1px solid ${c}44`,borderRadius:"50px 50px 20px 20px",background:`linear-gradient(180deg,${c}11 0%,${c}05 100%)`,left:"50%",top:"50%",marginLeft:-50+k*130,marginTop:-90 }}/>
                ))}
                {r.objects === "hexagons" && [0,1,2,3,4,5].map(k=>(
                  <div key={k} style={{ position:"absolute",width:50+k*20,height:50+k*20,border:`1px solid ${c}33`,borderRadius:"8px",transform:`rotate(${k*15}deg) translate(${Math.cos(k*Math.PI/3)*180}px,${Math.sin(k*Math.PI/3)*80}px)`,left:"50%",top:"50%",marginLeft:-(25+k*10),marginTop:-(25+k*10) }}/>
                ))}
                {r.objects === "stars" && Array.from({length:50},(_,k)=>(
                  <div key={k} style={{ position:"absolute",width:Math.random()*3+1,height:Math.random()*3+1,background:"white",borderRadius:"50%",left:`${(k*137.5)%100}%`,top:`${(k*71.3)%100}%`,opacity:0.6,animation:`twinkle ${2+k%4}s ease-in-out ${k%3}s infinite alternate` }}/>
                ))}
                {r.objects === "screens" && [-1,0,1].map(k=>(
                  <div key={k} style={{ position:"absolute",width:160,height:100,border:`2px solid ${c}66`,borderRadius:8,background:`linear-gradient(135deg,${c}11,${c}05)`,left:"50%",top:"50%",marginLeft:-80+k*200,marginTop:k===0?-150:-50,overflow:"hidden" }}>
                    {[0,1,2,3].map(m=><div key={m} style={{ height:2,margin:"12px 10px",background:`${c}44`,borderRadius:1,width:`${40+m*12}%` }}/>)}
                  </div>
                ))}
                {/* Portal arch */}
                <div style={{ position:"absolute",left:"50%",top:"50%",marginLeft:-140,marginTop:-200,width:280,height:320,border:`2px solid ${c}66`,borderRadius:"140px 140px 0 0",boxShadow:`0 0 40px ${c}44,inset 0 0 40px ${c}22` }}/>
                {/* Title */}
                <div style={{ position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none" }}>
                  <div style={{ fontSize:"clamp(24px,5vw,52px)",fontWeight:900,letterSpacing:"0.18em",color:c,textShadow:`0 0 30px ${c}88,0 0 60px ${c}44`,fontFamily:"monospace",marginBottom:8 }}>{r.title}</div>
                  <div style={{ color:`${c}bb`,fontSize:13,letterSpacing:"0.2em",fontFamily:"monospace",marginBottom:10 }}>{r.subtitle}</div>
                  <div style={{ color:"#ffffff55",fontSize:12,fontFamily:"monospace",fontStyle:"italic" }}>{r.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* HUD */}
        <div style={{ position:"fixed",top:20,left:24,fontFamily:"monospace",fontSize:11,color:`${room.color}cc`,lineHeight:1.8,zIndex:20,textShadow:`0 0 8px ${room.color}66` }}>
          <div>◈ DEPTH: {Math.round(cameraZ)}m</div>
          <div>◈ SECTION: {activeRoom+1}/{ROOMS.length}</div>
          <div>◈ {room.id.toUpperCase()}</div>
          <div style={{ marginTop:6,opacity:0.5 }}>ARIA GUIDANCE ACTIVE</div>
        </div>

        {/* Progress bar */}
        <div style={{ position:"fixed",bottom:0,left:0,right:0,height:2,background:"rgba(255,255,255,0.1)",zIndex:20 }}>
          <div style={{ height:"100%",width:`${(cameraZ/totalScroll)*100}%`,background:room.color,boxShadow:`0 0 8px ${room.color}`,transition:"width 0.1s linear,background 0.5s" }}/>
        </div>

        {/* Room dots */}
        <div style={{ position:"fixed",bottom:16,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8,zIndex:20 }}>
          {ROOMS.map((r,i)=>(
            <div key={r.id} style={{ width:i===activeRoom?24:8,height:8,borderRadius:4,background:i===activeRoom?room.color:"rgba(255,255,255,0.2)",boxShadow:i===activeRoom?`0 0 8px ${room.color}`:"none",transition:"all 0.4s" }}/>
          ))}
        </div>

        {/* Robot ARIA */}
        <div style={{ position:"fixed",bottom:48,right:24,zIndex:30,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8 }}>
          <div style={{ maxWidth:230,background:"rgba(0,0,0,0.88)",border:`1px solid ${room.color}66`,borderRadius:12,padding:"10px 14px",fontSize:12,color:"#fff",fontFamily:"monospace",lineHeight:1.5,boxShadow:`0 0 20px ${room.color}22`,position:"relative" }}>
            <span style={{ color:room.color,fontSize:10,display:"block",marginBottom:4 }}>ARIA ◈</span>
            {typedMsg}<span style={{ animation:"pulse 0.8s infinite",display:"inline-block",marginLeft:2 }}>▌</span>
            <div style={{ position:"absolute",bottom:-8,right:24,width:0,height:0,borderLeft:"8px solid transparent",borderRight:"8px solid transparent",borderTop:`8px solid ${room.color}66` }}/>
          </div>
          <Robot color={room.color}/>
        </div>

        {/* Scroll hint */}
        {showHint && (
          <div style={{ position:"fixed",bottom:"28%",left:"50%",transform:"translateX(-50%)",textAlign:"center",zIndex:20,animation:"fadeUp 1s ease forwards" }}>
            <div style={{ color:"#ffffff66",fontFamily:"monospace",fontSize:11,letterSpacing:"0.3em",marginBottom:8 }}>SCROLL TO WALK THROUGH</div>
            <div style={{ color:room.color,fontSize:22,animation:"pulse 1.2s infinite" }}>↓</div>
          </div>
        )}
      </div>
    </>
  );
}
