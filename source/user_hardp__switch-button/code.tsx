import { motion } from "motion/react";
import { ReactNode } from "react";

type SwitchProps = {
  value: boolean;
  onToggle: () => void;
  iconOn: ReactNode;
  iconOff: ReactNode;
  className?: string;
};

export function Switch({
  value,
  onToggle,
  iconOn,
  iconOff,
  className = "",
}: SwitchProps) {
  return (
    <button
      className={`bg-card-foreground/15 flex w-12 cursor-pointer rounded-full p-0.5 ${
        value ? "justify-end" : "justify-start"
      } ${className}`}
      onClick={onToggle}
    >
      <motion.div
        className="flex justify-center items-center size-6 rounded-full bg-background"
        layout
        transition={{
          type: "spring",
          duration: 0.6,
          bounce: 0.2,
        }}
      >
        {value ? (
          <motion.div
            key="on"
            initial={{ opacity: 0, rotate: -60 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 60 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center size-5"
          >
            {iconOn}
          </motion.div>
        ) : (
          <motion.div
            key="off"
            initial={{ opacity: 0, rotate: 60 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -60 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center size-5"
          >
            {iconOff}
          </motion.div>
        )}
      </motion.div>
    </button>
  );
}
