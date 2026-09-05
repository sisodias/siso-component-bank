import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

interface AccordionItem {
  id: string | number;
  title: string;
  icon: React.ComponentType<any>;
  image: string;
  description: string;
}

interface VerticalAccordionProps {
  items: AccordionItem[];
  defaultOpen?: string | number;
  className?: string;
  panelHeight?: string;
}

const VerticalAccordion: React.FC<VerticalAccordionProps> = ({
  items,
  defaultOpen,
  className,
  panelHeight = "450px",
}) => {
  const [open, setOpen] = useState(defaultOpen || items[0]?.id);

  return (
    <section className={cn("p-4 bg-background", className)}>
      <div 
        className="flex flex-col lg:flex-row h-fit w-full max-w-6xl mx-auto shadow-lg overflow-hidden rounded-lg border"
        style={{ height: `fit-content`, "--panel-height": panelHeight } as React.CSSProperties}
      >
        {items.map((item) => (
          <Panel
            key={item.id}
            open={open}
            setOpen={setOpen}
            id={item.id}
            icon={item.icon}
            title={item.title}
            image={item.image}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
};

interface PanelProps {
  open: string | number;
  setOpen: (id: string | number) => void;
  id: string | number;
  icon: React.ComponentType<any>;
  title: string;
  image: string;
  description: string;
}

const Panel: React.FC<PanelProps> = ({
  open,
  setOpen,
  id,
  icon: Icon,
  title,
  image,
  description,
}) => {
  const { width } = useWindowSize();
  const isOpen = open === id;

  return (
    <>
      <button
        className="bg-card hover:bg-accent/50 transition-colors p-3 border-r border-b border-border flex flex-row-reverse lg:flex-col justify-end items-center gap-4 relative group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={() => setOpen(id)}
      >
        <span
          style={{
            writingMode: "vertical-lr",
          }}
          className="hidden lg:block text-xl font-light rotate-180 text-foreground"
        >
          {title}
        </span>
        <span className="block lg:hidden text-xl font-light text-foreground">
          {title}
        </span>
        <div className="w-6 lg:w-full aspect-square bg-primary text-primary-foreground grid place-items-center rounded-sm">
          <Icon className="w-4 h-4" />
        </div>
        <span className="w-4 h-4 bg-card group-hover:bg-accent/50 transition-colors border-r border-b lg:border-b-0 lg:border-t border-border rotate-45 absolute bottom-0 lg:bottom-[50%] right-[50%] lg:right-0 translate-y-[50%] translate-x-[50%] z-20" />
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
              backgroundImage: `url(${image})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            className="w-full h-full overflow-hidden relative flex items-end"
          >
            <div className="absolute inset-0 bg-black/20" />
            <motion.div
              variants={descriptionVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="relative px-4 py-3 bg-black/60 backdrop-blur-sm text-white w-full"
            >
              <p className="text-sm leading-relaxed">{description}</p>
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
    height: "450px",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  closed: {
    width: "0%",
    height: "450px",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

const panelVariantsSm = {
  open: {
    width: "100%",
    height: "200px",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  closed: {
    width: "100%",
    height: "0px",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

const descriptionVariants = {
  open: {
    opacity: 1,
    y: "0%",
    transition: {
      delay: 0.15,
      duration: 0.3,
    },
  },
  closed: { 
    opacity: 0, 
    y: "100%",
    transition: {
      duration: 0.2,
    },
  },
};

export { VerticalAccordion, type AccordionItem };