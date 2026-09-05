// component.tsx
import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export interface CircularMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  images: string[];
}

const CircularMenu = React.forwardRef<HTMLDivElement, CircularMenuProps>(
  ({ images, className, ...props }, ref) => {
    const [active, setActive] = useState(false);

    return (
      <div
        ref={ref}
        className={`relative flex items-center justify-center gap-4 ${className}`}
        {...props}
      >
        <motion.div
          className="absolute left-0 z-10 w-full rounded-[40px] bg-white"
          animate={{
            x: active ? "calc(100% + 20px)" : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.button
            className="flex size-12 items-center justify-center rounded-full bg-zinc-400 sm:size-20"
            onClick={() => setActive(!active)}
            animate={{ rotate: active ? 45 : 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
          >
            <Plus size={40} strokeWidth={3} className="text-white" />
          </motion.button>
        </motion.div>
        {images.map((src, index) => (
          <motion.img
            key={index}
            src={src}
            alt={`Image ${index + 1}`}
            className="size-10 rounded-full object-cover sm:size-16"
            animate={{
              filter: active ? "blur(0px)" : "blur(2px)",
              scale: active ? 1 : 0.9,
              rotate: active ? 0 : 45,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          />
        ))}
      </div>
    );
  }
);

CircularMenu.displayName = "CircularMenu";

export default CircularMenu;