"use client";

import { cn } from "@/lib/utils";
import React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { Plus } from "lucide-react";

/* ---------- Types ---------- */

interface Profile {
  id: string;
  name: string;
  image: string;
}

/* ---------- Data ---------- */

const profiles: Profile[] = [
  {
    id: "alpha",
    name: "Alpha",
    image: "https://ik.imagekit.io/kqmrslzuq/21st.dev%20Components/3D%20Profile%20Selector/1.jpg", // ensure these are in /public
  },
  {
    id: "nova",
    name: "Nova",
    image: "https://ik.imagekit.io/kqmrslzuq/21st.dev%20Components/3D%20Profile%20Selector/2.jpg",
  },
  {
    id: "zen",
    name: "Zen",
    image: "https://ik.imagekit.io/kqmrslzuq/21st.dev%20Components/3D%20Profile%20Selector/3.jpg",
  },
];

/* ---------- Motion variants ---------- */

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

/* ---------- Main component ---------- */

export default function ProfileSelect() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) => {
    const rect = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - rect.left);
    mouseY.set(clientY - rect.top);
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-neutral-50 selection:bg-white/20"
      onMouseMove={handleMouseMove}
    >
      <Spotlight mouseX={mouseX} mouseY={mouseY} />

      <motion.div
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="mb-16 text-center text-5xl font-bold tracking-tighter sm:text-7xl"
          variants={titleVariants}
        >
          Who&apos;s watching?
        </motion.h1>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 perspective-[1000px]"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15, delayChildren: 0.1 },
            },
          }}
        >
          {profiles.map((profile) => (
            <TiltCard key={profile.id} profile={profile} />
          ))}
          <AddProfileCard />
        </motion.div>

        <motion.button
          type="button"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 0.5 },
          }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          className="mt-16 border border-neutral-800 bg-neutral-900/50 px-8 py-2.5 text-sm font-medium uppercase tracking-widest text-neutral-400 backdrop-blur transition-colors hover:border-neutral-700 hover:text-white"
        >
          Manage Profiles
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ---------- Background spotlight ---------- */

function Spotlight({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const background = useMotionTemplate`radial-gradient(
    650px circle at ${mouseX}px ${mouseY}px,
    rgba(255, 255, 255, 0.1),
    transparent 80%
  )`;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 opacity-0 md:opacity-100 transition-opacity duration-300"
      style={{ background }}
    />
  );
}

/* ---------- Tilt profile card ---------- */

function TiltCard({ profile }: { profile: Profile }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative h-40 w-40 cursor-pointer sm:h-52 sm:w-52"
    >
      {/* Image layer */}
     <div
  style={{ transform: "translateZ(50px)" }}
  className="absolute inset-0 overflow-hidden rounded-4xl bg-neutral-900 shadow-2xl transition-shadow duration-500 group-hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.2)] flex items-center justify-center"
>
  <Image
    src={profile.image}
    alt={profile.name}
    fill
    sizes="(max-width: 640px) 10rem, 13rem"
    priority
    className="object-cover opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
</div>


      {/* Border glow */}
      <div
        style={{ transform: "translateZ(40px)" }}
        className="absolute inset-0 rounded-4xl ring-1 ring-inset ring-white/10 transition-colors duration-300 group-hover:ring-white/30"
      />

      {/* Name */}
      <div
        style={{ transform: "translateZ(80px)" }}
        className="absolute bottom-4 left-0 right-0 text-center"
      >
        <span className="text-xl font-medium text-neutral-200 drop-shadow-lg transition-colors duration-300 group-hover:text-white">
          {profile.name}
        </span>
      </div>
    </motion.div>
  );
}

/* ---------- Add profile card ---------- */

function AddProfileCard() {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex h-40 w-40 cursor-pointer flex-col items-center justify-center gap-4 sm:h-52 sm:w-52"
    >
      {/* Rotating border */}
      <div className="absolute inset-0 overflow-hidden rounded-4xl">
        <div className="absolute inset-[-50%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-0 transition-opacity duration-500 group-hover:opacity-20" />
      </div>

      {/* Inner */}
      <div className="absolute inset-px flex flex-col items-center justify-center rounded-4xl bg-neutral-900/80 backdrop-blur-md transition-colors duration-300 group-hover:bg-neutral-800/80">
        <motion.div
          className="relative flex h-16 w-16 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 shadow-inner"
          animate={{
            boxShadow: [
              "0px 0px 0px rgba(0,0,0,0)",
              "0px 0px 20px rgba(255,255,255,0.1)",
              "0px 0px 0px rgba(0,0,0,0)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            className="text-neutral-400 group-hover:text-white"
            whileHover={{ rotate: 90, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Plus size={32} strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        <span className="mt-4 text-lg font-medium text-neutral-400 transition-colors group-hover:text-white">
          Add Profile
        </span>
      </div>
    </motion.div>
  );
}
