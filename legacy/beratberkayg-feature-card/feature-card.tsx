"use client";

import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  items: string[];
  buttonText: string;
  glowColor?: string;
 
}

export function FeatureCard({
  title,
  description,
  items,
  buttonText,
  glowColor = "violet",
 
}: FeatureCardProps) {
  const glowColorMap: Record<
    string,
    { glow: string; button: string; check: string }
  > = {
    violet: {
      glow: "bg-violet-600/40",
      button: "from-violet-600 to-fuchsia-400",
      check: "bg-violet-600",
    },
    pink: {
      glow: "bg-pink-500/40",
      button: "from-pink-500 to-rose-400",
      check: "bg-pink-500",
    },
    emerald: {
      glow: "bg-emerald-500/40",
      button: "from-emerald-500 to-green-400",
      check: "bg-emerald-500",
    },
    blue: {
      glow: "bg-blue-500/40",
      button: "from-blue-500 to-cyan-400",
      check: "bg-blue-500",
    },
    fuchsia: {
      glow: "bg-fuchsia-500/40",
      button: "from-fuchsia-500 to-pink-400",
      check: "bg-fuchsia-500",
    },
  };

  const selected = glowColorMap[glowColor] || glowColorMap.violet;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      className="relative"
    >
      {/* Glow Effect */}
      <motion.div
        className={`absolute -inset-6 rounded-3xl blur-3xl -z-20 ${selected.glow}`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
      />

      <Card className="relative w-80 rounded-md p-6 flex flex-col gap-7 bg-[#13111C] text-white shadow-[0px_-16px_24px_rgba(255,255,255,0.10)_inset] overflow-hidden">
        {/* Border Effect */}
        <motion.div
          className="absolute inset-0 rounded-md -z-10"
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          style={{
            backgroundImage:
              "radial-gradient(at 88% 40%, #13111C 0px, transparent 85%), radial-gradient(at 49% 30%, #13111C 0px, transparent 85%), radial-gradient(at 14% 26%, #13111C 0px, transparent 85%), radial-gradient(at 0% 64%, #7C3AED 0px, transparent 85%), radial-gradient(at 41% 94%, #D8B4FE 0px, transparent 85%), radial-gradient(at 100% 99%, #F472B6 0px, transparent 85%)",
          }}
        />

        {/* Title + Description */}
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>

        <hr className="border-gray-700" />

        {/* Feature List */}
        <CardContent className="p-0 flex flex-col gap-5">
          {items.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-md ${selected.check}`}
              >
                <Check className="w-3 h-3 text-black" />
              </span>
              <span className="text-sm">{item}</span>
            </motion.div>
          ))}
        </CardContent>

        {/* Button */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
          
            className={`w-full rounded-md text-sm font-medium bg-gradient-to-t ${selected.button} shadow-inner cursor-pointer`}
          >
            {buttonText}
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
}
