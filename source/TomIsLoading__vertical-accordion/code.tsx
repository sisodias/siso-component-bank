"use client";

import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiBarChart, FiBell, FiDollarSign, FiPlay } from "react-icons/fi";
import { IconType } from "react-icons";

// Custom hook for window size
function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>(() => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return {
      width: 0,
      height: 0,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export const VerticalAccordion = () => {
  const [open, setOpen] = useState(items[0].id);

  return (
    // Updated section for theme colors
    <section className="p-4 bg-white text-black dark:bg-black dark:text-white w-full h-full">
      <div className="flex flex-col lg:flex-row h-fit lg:h-[450px] w-full max-w-6xl mx-auto shadow overflow-hidden">
        {items.map((item) => {
          return (
            <Panel
              key={item.id}
              open={open}
              setOpen={setOpen}
              id={item.id}
              Icon={item.Icon}
              title={item.title}
              imgSrc={item.imgSrc}
              description={item.description}
            />
          );
        })}
      </div>
    </section>
  );
};

interface PanelProps {
  open: number;
  setOpen: Dispatch<SetStateAction<number>>;
  id: number;
  Icon: IconType;
  title: string;
  imgSrc: string;
  description: string;
}

const Panel = ({
  open,
  setOpen,
  id,
  Icon,
  title,
  imgSrc,
  description,
}: PanelProps) => {
  const { width } = useWindowSize();
  const isOpen = open === id;

  return (
    <>
      <button
        // Updated button for theme colors
        className="bg-white hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-900 transition-colors p-3 border-r-[1px] border-b-[1px] border-gray-200 dark:border-gray-800 flex flex-row-reverse lg:flex-col justify-end items-center gap-4 relative group"
        onClick={() => setOpen(id)}
      >
        <span
          style={{
            writingMode: "vertical-lr",
          }}
          className="hidden lg:block text-xl font-light rotate-180 text-black dark:text-white" // Explicit text color
        >
          {title}
        </span>
        <span className="block lg:hidden text-xl font-light text-black dark:text-white">{title}</span> {/* Explicit text color */}
        <div className="w-6 lg:w-full aspect-square bg-black text-white dark:bg-white dark:text-black grid place-items-center"> {/* Icon background and color flip */}
          <Icon />
        </div>
        <span
          // Updated diamond shape for theme colors
          className="w-4 h-4 bg-white group-hover:bg-gray-100 dark:bg-black dark:group-hover:bg-gray-900 transition-colors border-r-[1px] border-b-[1px] lg:border-b-0 lg:border-t-[1px] border-gray-200 dark:border-gray-800 rotate-45 absolute bottom-0 lg:bottom-[50%] right-[50%] lg:right-0 translate-y-[50%] translate-x-[50%] z-20"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={`panel-${id}`}
            variants={width && width > 1024 ? panelVariants : panelVariantsSm}
            initial="closed"
            animate="open"
            exit="closed"
            style={{
              backgroundImage: `url(${imgSrc})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            // Background is always black for the image overlay for better readability
            className="w-full h-full overflow-hidden relative bg-black flex items-end"
          >
            <motion.div
              variants={descriptionVariants}
              initial="closed"
              animate="open"
              exit="closed"
              // Text is always white for readability over image
              className="px-4 py-2 bg-black/40 backdrop-blur-sm text-white"
            >
              <p>{description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const panelVariants = {
  open: {
    width: "100%",
    height: "100%",
  },
  closed: {
    width: "0%",
    height: "100%",
},
};

const panelVariantsSm = {
  open: {
    width: "100%",
    height: "200px",
  },
  closed: {
    width: "100%",
    height: "0px",
  },
};

const descriptionVariants = {
  open: {
    opacity: 1,
    y: "0%",
    transition: {
      delay: 0.125,
    },
  },
  closed: { opacity: 0, y: "100%" },
};

const items = [
  {
    id: 1,
    title: "Earn more",
    Icon: FiDollarSign,
    imgSrc:
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum eius deserunt quia consectetur aliquid obcaecati voluptatibus quos distinctio natus! Tenetur.",
  },
  {
    id: 2,
    title: "Play more",
    Icon: FiPlay,
    imgSrc:
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum eius deserunt quia consectetur aliquid obcaecati voluptatibus quos distinctio natus! Tenetur.",
  },
  {
    id: 3,
    title: "Keep track",
    Icon: FiBell,
    imgSrc:
      "https://images.unsplash.com/photo-1578450671530-5b6a7c9f32a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum eius deserunt quia consectetur aliquid obcaecati voluptatibus quos distinctio natus! Tenetur.",
  },
  {
    id: 4,
    title: "Grow faster",
    Icon: FiBarChart,
    imgSrc:
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum eius deserunt quia consectetur aliquid obcaecati voluptatibus quos distinctio natus! Tenetur.",
  },
];