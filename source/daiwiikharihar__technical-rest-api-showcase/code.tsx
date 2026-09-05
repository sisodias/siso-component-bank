"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Icons ---
const DatabaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
);

const LegionDevIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
);

const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-emerald-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-sky-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-amber-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-rose-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const DatabaseStatusIcon = ({ type }: { type: string | null }) => {
    switch (type) {
        case "POST": return <PlusIcon />;
        case "GET": return <EyeIcon />;
        case "PUT": return <EditIcon />;
        case "DELETE": return <TrashIcon />;
        default: return null;
    }
};

// --- Helper Components for Technical Look ---

const CornerBrackets = () => (
    <>
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-zinc-700/50 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-zinc-700/50 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-zinc-700/50 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-zinc-700/50 rounded-br-lg" />
    </>
);

const GridBackground = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
        }}
    />
);

// --- Animation Variants ---

const recordVariants = {
    hidden: { opacity: 0, x: -10, scale: 0.95 },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.2, type: "spring", stiffness: 300, damping: 20 },
    },
    exit: {
        opacity: 0,
        x: 10,
        scale: 0.95,
        transition: { duration: 0.2 },
    },
    read: {
        backgroundColor: ["rgba(24,24,27,0.8)", "rgba(56,189,248,0.15)", "rgba(24,24,27,0.8)"],
        borderColor: ["rgba(39,39,42,1)", "rgba(56,189,248,0.4)", "rgba(39,39,42,1)"],
        transition: { duration: 0.5 },
    },
    updated: {
        scale: [1, 1.03, 1],
        backgroundColor: ["rgba(24,24,27,0.8)", "rgba(251,191,36,0.15)", "rgba(24,24,27,0.8)"],
        borderColor: ["rgba(39,39,42,1)", "rgba(251,191,36,0.4)", "rgba(39,39,42,1)"],
        transition: { duration: 0.5 },
    },
};

export default function CrudApiAnimation () {
    const [activeOp, setActiveOp] = useState<string | null>(null);
    const [records, setRecords] = useState<{ id: number; label: string; updated?: boolean }[]>([
        { id: 1, label: "user:1" },
        { id: 2, label: "user:2" },
        { id: 3, label: "user:3" },
    ]);
    const [justReadIds, setJustReadIds] = useState<number[]>([]);
    const [nextId, setNextId] = useState(4);

    // Operation Handlers
    const runGet = () => {
        setActiveOp("GET");
        const ids = records.map((r) => r.id);
        setJustReadIds(ids);
        setTimeout(() => setJustReadIds([]), 600);
    };

    const runPost = () => {
        setActiveOp("POST");
        setRecords((prev) => [...prev, { id: nextId, label: `user:${nextId}` }]);
        setNextId((n) => n + 1);
    };

    const runPut = () => {
        if (!records.length) {
            setActiveOp("PUT");
            return;
        }
        setActiveOp("PUT");
        setRecords((prev) =>
            prev.map((r, idx) =>
                idx === prev.length - 1
                    ? { ...r, label: `${r.label} · up`, updated: true }
                    : r
            )
        );
        setTimeout(() => {
            setRecords((prev) => prev.map((r) => ({ ...r, updated: false })));
        }, 900);
    };

    const runDelete = () => {
        if (!records.length) {
            setActiveOp("DELETE");
            return;
        }
        setActiveOp("DELETE");
        setRecords((prev) => prev.slice(0, prev.length - 1));
    };

    const handleOpClick = (op: string) => {
        switch (op) {
            case "GET": runGet(); break;
            case "POST": runPost(); break;
            case "PUT": runPut(); break;
            case "DELETE": runDelete(); break;
        }
        setTimeout(() => setActiveOp(null), 1400);
    };

    const ops = [
        { key: "GET", color: "text-sky-400 border-sky-400/30 hover:bg-sky-400/10", glow: "shadow-sky-500/20", desc: "Read" },
        { key: "POST", color: "text-emerald-400 border-emerald-400/30 hover:bg-emerald-400/10", glow: "shadow-emerald-500/20", desc: "Create" },
        { key: "PUT", color: "text-amber-400 border-amber-400/30 hover:bg-amber-400/10", glow: "shadow-amber-500/20", desc: "Update" },
        { key: "DELETE", color: "text-rose-400 border-rose-500/30 hover:bg-rose-500/10", glow: "shadow-rose-500/20", desc: "Delete" },
    ];

    // Colors for the radar center based on active op
    const getRadarColor = () => {
        switch (activeOp) {
            case "GET": return "border-sky-500 shadow-[0_0_30px_rgba(14,165,233,0.3)]";
            case "POST": return "border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]";
            case "PUT": return "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]";
            case "DELETE": return "border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)]";
            default: return "border-zinc-700/50 shadow-none";
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] text-zinc-300 flex items-center justify-center p-6 font-mono">
            <div className="relative w-full max-w-5xl">

                {/* Outer Tech Container */}
                <div className="relative rounded-lg border border-zinc-800 bg-[#0a0a0a] shadow-2xl overflow-hidden">
                    <GridBackground />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />

                    {/* Top decorative bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 opacity-20" />

                    <div className="relative p-12">
                        <CornerBrackets />

                        {/* Header */}
                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded border border-zinc-700 bg-zinc-900">
                                    <div className={`h-2 w-2 rounded-full ${activeOp ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase tracking-[0.2em] text-zinc-100 font-bold">
                                        API Gateway
                                    </span>
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                        REST Protocol · v2.4.0
                                    </span>
                                </div>
                            </div>
                            <div className="text-[10px] text-zinc-600 border border-zinc-800 px-2 py-1 rounded bg-black/40">
                                STATUS: {activeOp ? "PROCESSING" : "IDLE"}
                            </div>
                        </div>

                        {/* Main Layout */}
                        <div className="flex items-center justify-between gap-12 relative z-10">

                            {/* LEFT: Operation Buttons */}
                            <div className="flex flex-col gap-4 z-20">
                                {ops.map((op) => {
                                    const isActive = activeOp === op.key;
                                    return (
                                        <motion.button
                                            key={op.key}
                                            onClick={() => handleOpClick(op.key)}
                                            whileHover={{ x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={!!activeOp}
                                            className={`
                          group relative w-48 h-12 flex items-center justify-between px-4 
                          border bg-zinc-900/50 backdrop-blur-sm transition-all duration-300
                          ${op.color} 
                          ${isActive ? `border-opacity-100 bg-opacity-20 ${op.glow}` : "border-opacity-20 grayscale opacity-70 hover:grayscale-0 hover:opacity-100"}
                          disabled:cursor-not-allowed
                        `}
                                        >
                                            {/* Button Active Indicator Line */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-line"
                                                    className={`absolute left-0 top-0 bottom-0 w-1 ${op.color.split(' ')[0].replace('text', 'bg')}`}
                                                />
                                            )}

                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm font-bold ${isActive ? 'translate-x-1' : ''} transition-transform`}>{op.key}</span>
                                            </div>
                                            <span className="text-[10px] uppercase opacity-50 tracking-wider">{op.desc}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* CENTER: Technical Radar Core */}
                            <div className="flex-1 flex items-center justify-center relative">
                                {/* Horizontal Connection Line */}
                                <div className="absolute w-full h-px bg-zinc-800 z-0" />

                                <div className="relative z-10 w-48 h-48 flex items-center justify-center">

                                    {/* Spinning Outer Ring (Dashed) */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                                        className="absolute inset-0 rounded-full border border-dashed border-zinc-700/60"
                                    />

                                    {/* Reverse Spinning Inner Ring */}
                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                                        className="absolute inset-4 rounded-full border border-dotted border-zinc-800"
                                    />

                                    {/* Active Radar Sweep (Only visible when active) */}
                                    <AnimatePresence>
                                        {activeOp && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{
                                                    rotate: { duration: 1.5, ease: "linear", repeat: Infinity },
                                                    opacity: { duration: 0.3 }
                                                }}
                                                className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-white/10"
                                            />
                                        )}
                                    </AnimatePresence>

                                    {/* Pulsing Ripple Effect */}
                                    {activeOp && (
                                        <>
                                            <motion.div
                                                initial={{ scale: 1, opacity: 0.5 }}
                                                animate={{ scale: 1.6, opacity: 0 }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                                className={`absolute inset-0 rounded-full border ${getRadarColor().split(' ')[0]} opacity-20`}
                                            />
                                            <motion.div
                                                initial={{ scale: 1, opacity: 0.5 }}
                                                animate={{ scale: 1.4, opacity: 0 }}
                                                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                                className={`absolute inset-0 rounded-full border ${getRadarColor().split(' ')[0]} opacity-20`}
                                            />
                                        </>
                                    )}

                                    {/* Main Core Circle */}
                                    <motion.div
                                        className={`relative w-24 h-24 bg-black rounded-full border flex items-center justify-center z-20 transition-all duration-500 ${getRadarColor()}`}
                                        animate={{ scale: activeOp ? 0.95 : 1 }}
                                    >
                                        <div className="absolute inset-0 bg-zinc-900/50 rounded-full" />

                                        {/* Core Content */}
                                        <div className="relative z-30 flex flex-col items-center">
                                            <AnimatePresence mode="wait">
                                                {activeOp ? (
                                                    <motion.div
                                                        key="active"
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -5 }}
                                                        className="flex flex-col items-center gap-1"
                                                    >
                                                        <DatabaseStatusIcon type={activeOp} />
                                                        <span className="text-[10px] font-bold tracking-widest mt-1">{activeOp}</span>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="idle"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex flex-col items-center gap-1 opacity-40"
                                                    >
                                                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-ping mb-1" />
                                                        <span className="text-[9px] tracking-widest">READY</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* RIGHT: Database Records */}
                            <div className="flex flex-col w-64 z-20">
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <FolderIcon />
                                        <span className="text-xs font-bold tracking-wider uppercase">Database</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-600">{records.length} items</span>
                                </div>

                                <div className="h-[240px] border border-zinc-800 bg-black/40 rounded p-2 overflow-hidden relative">
                                    {/* Scanline overlay for the DB list */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none z-10 animate-scan" />

                                    <div className="flex flex-col gap-2">
                                        <AnimatePresence initial={false} mode="popLayout">
                                            {records.map((record) => {
                                                const isRead = justReadIds.includes(record.id);
                                                const isUpdated = !!record.updated;

                                                return (
                                                    <motion.div
                                                        key={record.id}
                                                        layout
                                                        variants={recordVariants}
                                                        initial="hidden"
                                                        animate={
                                                            activeOp === "GET" && isRead ? "read" :
                                                                activeOp === "PUT" && isUpdated ? "updated" :
                                                                    "visible"
                                                        }
                                                        exit="exit"
                                                        className="flex items-center justify-between p-2 rounded border border-zinc-800 bg-zinc-900 text-xs font-medium relative overflow-hidden"
                                                    >
                                                        <span className="font-mono text-zinc-300">{record.label}</span>
                                                        {isUpdated && <span className="text-[9px] text-amber-400 bg-amber-400/10 px-1 rounded">MOD</span>}
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                        {records.length === 0 && (
                                            <div className="h-full flex flex-col items-center justify-center text-zinc-700 text-[10px] uppercase tracking-widest mt-10">
                                                <span>Empty Set</span>
                                                <span className="opacity-50">Await Input</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Client Tag */}
                                <div className="mt-4 flex justify-end">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50">
                                        <LegionDevIcon />
                                        <span className="text-[10px] text-zinc-400 tracking-wider">CLIENT_CONNECTED</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Keyframe for the scanline */}
            <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
        </div>
    );
};
