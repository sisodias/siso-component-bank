import React from "react";
import { motion } from "framer-motion";
import { Plus, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AvatarData {
    id: string | number;
    src?: string;
    initials?: string;
    label?: string;
    borderColor?: string;
    className?: string;
    icon?: React.ReactNode;
}

interface OrbitalAvatarsProps {
    centerIcon?: React.ReactNode;
    innerRing?: AvatarData[];
    outerRing?: AvatarData[];
    className?: string;
}

const AvatarCircle = ({
    avatar,
    radius,
    angle,
    index,
    total
}: {
    avatar: AvatarData;
    radius: number;
    angle: number;
    index: number;
    total: number;
}) => {
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    // Subtle drift animation for modern feel
    const driftX = (Math.random() - 0.5) * 10;
    const driftY = (Math.random() - 0.5) * 10;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
                opacity: 1,
                scale: 1,
                x: [0, x, x + driftX, x],
                y: [0, y, y + driftY, y],
                transition: {
                    x: {
                        duration: 0.8,
                        delay: index * 0.05,
                        times: [0, 0.8, 0.9, 1],
                        ease: "easeOut"
                    },
                    y: {
                        duration: 0.8,
                        delay: index * 0.05,
                        times: [0, 0.8, 0.9, 1],
                        ease: "easeOut"
                    },
                    scale: { delay: index * 0.05 },
                    opacity: { delay: index * 0.05 }
                }
            }}
            whileHover={{
                scale: 1.2,
                zIndex: 50,
                transition: { duration: 0.2, ease: "backOut" }
            }}
            className="absolute left-1/2 top-1/2 -ml-6 -mt-6 cursor-pointer group"
        >
            {/* Ambient Glow */}
            <div className="absolute inset-0 rounded-full bg-purple-500/0 group-hover:bg-purple-500/10 blur-xl transition-all duration-500" />

            <div className={cn(
                "relative w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-background/40 backdrop-blur-md flex items-center justify-center transition-all duration-500 shadow-xl group-hover:border-white/40 group-hover:shadow-purple-500/20",
                avatar.className
            )}
                style={{ borderColor: avatar.borderColor ? `${avatar.borderColor}88` : undefined }}
            >
                {avatar.src ? (
                    <img src={avatar.src} alt={avatar.label || "avatar"} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
                ) : avatar.icon ? (
                    <div className="text-foreground group-hover:scale-110 transition-transform duration-500">{avatar.icon}</div>
                ) : (
                    <span className="text-xs font-bold text-foreground/80 uppercase tracking-tighter">
                        {avatar.initials}
                    </span>
                )}

                {/* Glassy reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

                {/* Active/Status Indicator as seen in premium UIs */}
                {avatar.borderColor && (
                    <div
                        className="absolute inset-0 rounded-full border-[1.5px]"
                        style={{ borderColor: avatar.borderColor }}
                    />
                )}
            </div>

            {/* Label Tooltip - Modern minimal version */}
            {avatar.label && (
                <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide shadow-2xl border border-white/10">
                    {avatar.label}
                </div>
            )}
        </motion.div>
    );
};

export const innerRingData: AvatarData[] = [
    { id: 1, initials: "K", className: "bg-purple-100" },
    { id: 2, src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", label: "Felix" },
    { id: 3, initials: "G", className: "bg-fuchsia-100" },
    { id: 4, src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka", label: "Aneka" },
    { id: 5, icon: <Link2 className="w-6 h-6 text-blue-500" />, className: "bg-blue-50" },
    { id: 6, src: "https://p1.itc.cn/images01/20201015/3c8b417c8a4c4b69b8e8f8045b4c1062.jpeg", label: "Rabbit", borderColor: "#f97316" },
    { id: 7, src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max", label: "Max", borderColor: "#fbbf24" },
    { id: 8, initials: "J", className: "bg-purple-50" },
    { id: 9, initials: "D", className: "bg-slate-50" },
    { id: 10, src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie", label: "Sophie" },
    { id: 11, src: "https://cdn.iconscout.com/icon/free/png-256/free-react-1-282599.png", label: "React", borderColor: "#ca8a04" },
    { id: 12, src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun", label: "Arjun" },
    { id: 13, src: "https://github.com/shadcn.png", label: "Shad" },
    { id: 14, src: "https://prism-data-lake-public-assets.s3.us-east-2.amazonaws.com/logos/prisma.png", label: "Prisma", borderColor: "#3b82f6" },
    { id: 15, src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo", label: "Leo", borderColor: "#f97316" },
    { id: 16, src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo", label: "Milo" },
];

export const outerRingData: AvatarData[] = [
    { id: 101, initials: "AI", className: "bg-blue-100" },
    { id: 102, src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow", label: "Shadow" },
    { id: 103, initials: "UX", className: "bg-orange-100" },
    { id: 104, src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neon", label: "Neon", borderColor: "#8b5cf6" },
];

export const Component = ({
    centerIcon = <Plus className="w-8 h-8 text-white" />,
    innerRing = innerRingData,
    outerRing = outerRingData,
    className
}: OrbitalAvatarsProps) => {
    const innerRadius = 130;
    const outerRadius = 240;

    return (
        <div className={cn("relative w-[600px] h-[600px] flex items-center justify-center overflow-visible", className)}>
            {/* Modern Mesh Gradient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 180, 270, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute inset-[-50%] opacity-20 blur-[100px]"
                >
                    <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-fuchsia-500/40" />
                    <div className="absolute bottom-[20%] right-[20%] w-[60%] h-[60%] rounded-full bg-purple-600/40" />
                    <div className="absolute top-[40%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/30" />
                </motion.div>
            </div>

            {/* Refined Concentric Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Outer decorative dotted ring */}
                <div className="absolute w-[580px] h-[580px] rounded-full border border-dashed border-border/10 animate-[spin_100s_linear_infinite]" />

                {/* Primary Orbital Tracks */}
                <div className="absolute w-[260px] h-[260px] rounded-full border border-border/5 shadow-[0_0_50px_rgba(168,85,247,0.03)]" />
                <div className="absolute w-[480px] h-[480px] rounded-full border border-border/10" />

                {/* Inner glowing core area */}
                <div className="absolute w-[160px] h-[160px] rounded-full bg-gradient-to-b from-purple-500/5 to-transparent blur-2xl" />
            </div>

            {/* Outer Ring Avatars */}
            {outerRing.map((avatar, i) => {
                const angle = (i / outerRing.length) * 2 * Math.PI - Math.PI / 2;
                return (
                    <AvatarCircle
                        key={avatar.id}
                        avatar={avatar}
                        radius={outerRadius}
                        angle={angle}
                        index={i}
                        total={outerRing.length}
                    />
                );
            })}

            {/* Inner Ring Avatars */}
            {innerRing.map((avatar, i) => {
                const angle = (i / innerRing.length) * 2 * Math.PI - Math.PI / 2;
                return (
                    <AvatarCircle
                        key={avatar.id}
                        avatar={avatar}
                        radius={innerRadius}
                        angle={angle}
                        index={i}
                        total={innerRing.length}
                    />
                );
            })}

            {/* Central Action Area */}
            <div className="relative z-20">
                {/* Multiple Pulse Rings */}
                {[1, 1.5, 2].map((s, i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border border-purple-500/20"
                        animate={{
                            scale: [1, s + 0.5],
                            opacity: [0.3, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.8,
                            ease: "easeOut"
                        }}
                    />
                ))}

                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.3)] cursor-pointer group/center"
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 40px rgba(236,72,153,0.5)" }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="absolute inset-0.5 rounded-full bg-black/10 backdrop-blur-[2px]" />
                    <motion.div
                        animate={{ rotate: [0, 90] }}
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                    >
                        {centerIcon}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};
