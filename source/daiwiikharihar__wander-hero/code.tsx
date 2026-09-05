"use client";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import {
  Compass,
  Map,
  Wallet,
  Shield
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const WanderHero = () => {
  const containerRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Subtle Parallax effect based on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotateCard = useTransform(scrollYProgress, [0, 1], [0, 2]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#f8fafc] overflow-hidden font-sans selection:bg-emerald-200"
    >
      {/* Background Blobs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="relative z-50 flex justify-center items-center gap-3 py-8"
      >
        <div className="flex bg-white/70 backdrop-blur-xl border border-white/40 p-1.5 rounded-full shadow-sm">
          <button className="bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-all">
            Explore
          </button>
          <button className="px-5 py-2 text-slate-600 text-sm font-medium">
            Guides
          </button>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-6 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4 pb-20">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-24">
          <SocialBubble
            yOffset={y1}
            delay={0.2}
            emoji="✈️ 🌍"
            author="Sarah Jenkins"
            color="bg-emerald-600"
            floatDuration={4}
            text="The hidden gem filters found me a villa that wasn't even on AirBnB!"
          />
          <SocialBubble
            yOffset={y2}
            delay={0.4}
            emoji="📸 ✨"
            author="Marc Rossi"
            color="bg-slate-800"
            floatDuration={5}
            text="The offline map saved my life in the Atlas Mountains."
          />
        </div>

        {/* CENTER CARD WITH VIDEO */}
        <motion.div
          style={{ rotate: rotateCard }}
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="w-full max-w-[420px] bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border-[10px] border-white overflow-hidden relative">
            <div className="p-8">
              <div className="flex justify-center mb-6">
                  <Compass className="text-black-600 w-8 h-8" />
              </div>

              <h1 className="text-4xl font-black text-center text-slate-900 tracking-tight mb-3">
                Wander
              </h1>

              {/* VIDEO PLAYER CONTAINER */}
              <div className="relative group my-8 rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-inner aspect-[4/3]">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                >
                  {/* Replace with your actual video URL */}
                  <source
                    src="https://ik.imagekit.io/kqmrslzuq/Videos/3.mp4?updatedAt=1766415070663"
                    type="video/mp4"
                  />
                </video>

                {/* Video Overlay UI */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5 shadow-lg">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  PREVIEW
                </div>
              </div>

              <div className="space-y-4">
                <FeatureItem
                  delay={0.6}
                  icon={<Map size={18} className="text-emerald-500" />}
                  text="300+ Secret Spots verified weekly"
                />
                <FeatureItem
                  delay={0.7}
                  icon={<Wallet size={18} className="text-amber-500" />}
                  text="Real-time Cost of Living data"
                />
                <FeatureItem
                  delay={0.8}
                  icon={<Shield size={18} className="text-blue-500" />}
                  text="Safety scores for every district"
                />
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-10 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors"
              >
                Get Access
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-24 pt-20">
          <SocialBubble
            yOffset={y2}
            delay={0.6}
            emoji="🍕 🇮🇹"
            author="Liam Zhao"
            color="bg-amber-500"
            floatDuration={6}
            text="The food map in Florence is elite. Away from all tourist traps!"
          />
          <SocialBubble
            yOffset={y1}
            delay={0.8}
            emoji="🧗‍♂️ 🏔️"
            author="Elena Fisher"
            color="bg-indigo-600"
            floatDuration={4.5}
            text="Finally tracks Wi-Fi speeds in remote hiking basecamps."
          />
        </div>
      </div>
    </div>
  );
};

// --- Sub-components (FeatureItem & SocialBubble) remain same as previous version ---
const FeatureItem = ({ icon, text, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-3 text-sm font-medium text-slate-600"
  >
    <div className="bg-slate-50 p-1.5 rounded-lg">{icon}</div>
    {text}
  </motion.div>
);

const SocialBubble = ({
  text,
  author,
  emoji,
  color,
  delay,
  yOffset,
  floatDuration,
}: any) => (
  <motion.div
    style={{ y: yOffset }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.8 }}
  >
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{
        duration: floatDuration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="group cursor-default"
    >
      <div
        className={`${color} text-white p-6 rounded-[2rem] rounded-br-none shadow-xl`}
      >
        <div className="text-lg mb-2">{emoji}</div>
        <p className="text-sm font-medium leading-relaxed opacity-90 italic">
          "{text}"
        </p>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
          <img src={`https://i.pravatar.cc/100?u=${author}`} alt={author} />
        </div>
        <div className="text-xs font-bold text-slate-800">{author}</div>
      </div>
    </motion.div>
  </motion.div>
);

export default WanderHero;
