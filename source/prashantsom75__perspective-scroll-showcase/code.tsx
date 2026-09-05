"use client";

import { useRef } from "react";
import { motion, useTransform, useSpring, MotionValue, useScroll } from "framer-motion";

export interface Project {
    title: string;
    tags: string[];
    bgText: string;
    src: string;
}

interface PerspectiveScrollShowcaseProps {
    projects: Project[];
}

const BackgroundText = ({
    text,
    index,
    progress
}: {
    text: string;
    index: number;
    progress: MotionValue<number>;
}) => {
    const localProgress = useTransform(progress, (p) => p - index);

    // Fade to exactly 0 at precisely 0.5 (180 degrees)
    const opacity = useTransform(localProgress, [-0.5, 0, 0.5], [0, 1, 0]);

    // Optional: Keep the squash effect, or just let it fade? 
    // The user said "slowely hiding it on scroll" which implies fade, but scaleY helps the 3D effect.
    const scaleY = useTransform(localProgress, [-0.5, 0, 0.5], [0, 1, 0]);

    // Keep it precisely centered vertically at all times.
    const y = "-50%";

    const marqueeText = Array(4).fill(text).join(" ");

    return (
        <motion.div
            style={{ opacity, scaleY, y, x: "-50%" }}
            className="absolute top-1/2 left-1/2 overflow-hidden w-[200vw] pointer-events-none"
        >
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ ease: "linear", duration: 30, repeat: Infinity }}
                className="flex whitespace-nowrap text-[max(4rem,7.5vw)] font-black uppercase tracking-tighter mix-blend-overlay leading-none transition-colors duration-500 text-black/20 dark:text-white/20"
            >
                <span>{marqueeText}</span>
                <span>{marqueeText}</span>
            </motion.div>
        </motion.div>
    );
};

const ProjectCard = ({
    project,
    index,
    progress
}: {
    project: Project;
    index: number;
    progress: MotionValue<number>;
}) => {
    const visibility = useTransform(progress, (p) => {
        return Math.abs(p - index) <= 1.0 ? "visible" : "hidden";
    });

    return (
        <motion.div
            style={{
                rotateX: index * 180,
                visibility
            }}
            className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl sm:rounded-[2rem] border transition-colors duration-500 [backface-visibility:hidden] bg-white dark:bg-[#0a0a0a] border-black/10 dark:border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)]"
        >
            <img
                src={project.src}
                alt={project.title}
                className="w-full h-full object-cover opacity-90"
            />

            {/* Dark gradient overlay for text readability always stays dark so white text remains readable */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

            <div className="absolute bottom-0 left-0 p-6 sm:p-10 flex flex-col gap-3 w-full">
                <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                    {project.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-sm sm:text-base font-medium text-white border border-white/20"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default function PerspectiveScrollShowcase({ projects }: PerspectiveScrollShowcaseProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const springProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    const totalRotation = Math.max(0, projects.length - 1) * 180;
    const rotateX = useTransform(springProgress, [0, 1], [0, totalRotation]);

    const normalizedProgress = useTransform(springProgress, [0, 1], [0, Math.max(0, projects.length - 1)]);

    if (!projects || projects.length === 0) return null;

    const containerHeight = Math.max(projects.length * 100, 100);

    return (
        <div
            ref={containerRef}
            className="relative w-full transition-colors duration-500 bg-gray-50 dark:bg-black"
            style={{ height: `${containerHeight}vh` }}
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center [perspective:1200px]">
                {/* Background Marquee Texts */}
                {projects.map((project, i) => (
                    <BackgroundText
                        key={`bg-${i}`}
                        index={i}
                        progress={normalizedProgress}
                        text={project.bgText}
                    />
                ))}

                {/* 3D Canvas */}
                <motion.div
                    style={{
                        rotateX,
                        transformStyle: "preserve-3d",
                    }}
                    className="relative w-[90%] max-w-6xl aspect-[4/3] sm:aspect-[16/9] cursor-grab active:cursor-grabbing"
                >
                    {projects.map((project, i) => (
                        <ProjectCard
                            key={`card-${i}`}
                            index={i}
                            progress={normalizedProgress}
                            project={project}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
