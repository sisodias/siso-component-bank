"use client";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { FlipHorizontal, RotateCw, X } from "lucide-react";

// --- Types ---
interface CardData {
  id: number;
  text: string;
  rotation: number;
  color: string;
  zIndex: number;
  // 1. New state property
  isFlipped: boolean;
}

interface CardProps {
  data: CardData;
  containerRef: React.RefObject<HTMLDivElement>;
  updateZIndex: (id: number) => void;
  onContextMenu: (e: React.MouseEvent, id: number) => void;
}

// --- The Card Component (Refactored for 3D Flip) ---
const Card = ({
  data,
  containerRef,
  updateZIndex,
  onContextMenu,
}: CardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // The subtle tilt based on drag position
  const tiltX = useTransform(y, [-500, 500], [15, -15]);
  const tiltY = useTransform(x, [-500, 500], [-15, 15]);

  return (
    // --- OUTER CONTAINER: Handles Dragging & Subtle Tilt ---
    <motion.div
      style={{
        x,
        y,
        rotateX: tiltX, // Apply subtle tilt here
        rotateY: tiltY, // Apply subtle tilt here
        zIndex: data.zIndex,
      }}
      drag
      dragConstraints={containerRef}
      dragElastic={0.2}
      dragMomentum={false}
      onPointerDown={() => updateZIndex(data.id)}
      onContextMenu={(e) => onContextMenu(e, data.id)}
      whileHover={{ scale: 1.05, cursor: "grab" }}
      whileTap={{ scale: 1.1, cursor: "grabbing" }}
      // IMPORTANT: Perspective is needed for 3D effects to look right
      className="absolute w-64 h-80 [perspective:1000px]"
    >
      {/* --- INNER CONTAINER: Handles the main Rotation & Flip animation --- */}
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        // Animate both the 2D rotation AND the 3D flip here
        animate={{
          rotate: data.rotation,
          rotateY: data.isFlipped ? 180 : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* --- FRONT FACE --- */}
        <div
          className={`absolute inset-0 border-[3px] border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${data.color}`}
          // Hides this face when rotated away
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Hole on the LEFT */}
          <div className="w-8 h-8 rounded-full border-2 border-black bg-white" />
          <h3 className="text-3xl font-black uppercase leading-none pointer-events-none select-none">
            {data.text}
          </h3>
          <div className="text-xs font-mono font-bold border-t-2 border-black pt-2 pointer-events-none select-none">
            RIGHT CLICK ME
          </div>
        </div>

        {/* --- BACK FACE --- */}
        <div
          className={`absolute inset-0 border-[3px] border-black p-6 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${data.color}`}
          style={{
            backfaceVisibility: "hidden",
            // Pre-rotate the back face so it faces backwards initially
            transform: "rotateY(180deg)",
          }}
        >
          {/* Hole on the RIGHT (using ml-auto) */}
          <div className="w-8 h-8 rounded-full border-2 border-black bg-white ml-auto" />

          <div className="flex-1 flex items-center justify-center pointer-events-none select-none opacity-50">
            
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main Canvas Component ---
export default function FreeDraggableDeck  ()  {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Initialize state with isFlipped: false
  const [cards, setCards] = useState<CardData[]>([
    {
      id: 0,
      text: "Back End",
      rotation: -6,
      color: "bg-blue-300",
      zIndex: 1,
      isFlipped: false,
    },
    {
      id: 1,
      text: "Design",
      rotation: 6,
      color: "bg-green-300",
      zIndex: 2,
      isFlipped: false,
    },
    {
      id: 2,
      text: "Front End",
      rotation: 0,
      color: "bg-red-300",
      zIndex: 3,
      isFlipped: false,
    },
  ]);

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    cardId: number | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    cardId: null,
  });

  const bringToFront = (id: number) => {
    setCards((prev) => {
      const maxZ = Math.max(...prev.map((c) => c.zIndex));
      return prev.map((c) => (c.id === id ? { ...c, zIndex: maxZ + 1 } : c));
    });
  };

  const handleContextMenu = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      cardId: id,
    });
  };

  const handleRotate = () => {
    if (contextMenu.cardId === null) return;
    setCards((prev) =>
      prev.map((card) =>
        card.id === contextMenu.cardId
          ? { ...card, rotation: card.rotation + 45 }
          : card
      )
    );
    closeMenu();
  };

  // 2. Implement handleFlip
  const handleFlip = () => {
    if (contextMenu.cardId === null) return;
    setCards((prev) =>
      prev.map((card) =>
        card.id === contextMenu.cardId
          ? { ...card, isFlipped: !card.isFlipped } // Toggle boolean
          : card
      )
    );
    closeMenu();
  };

  const closeMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  useEffect(() => {
    const handleClick = () => closeMenu();
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-zinc-100 overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: "radial-gradient(#ccc 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          data={card}
          containerRef={containerRef}
          updateZIndex={bringToFront}
          onContextMenu={handleContextMenu}
        />
      ))}

      <AnimatePresence>
        {contextMenu.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "fixed",
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 9999,
            }}
            className="min-w-[160px] bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col p-2 gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[10px] uppercase font-bold text-gray-400 px-2 pb-2 border-b-2 border-gray-100 mb-1">
              Actions
            </div>

            <button
              onClick={handleRotate}
              className="flex items-center gap-3 px-3 py-2 hover:bg-black hover:text-white transition-colors text-left font-bold uppercase text-sm group"
            >
              <RotateCw size={16} />
              Rotate 45°
            </button>

            {/* Connected handleFlip */}
            <button
              onClick={handleFlip}
              className="flex items-center gap-3 px-3 py-2 hover:bg-black hover:text-white transition-colors text-left font-bold uppercase text-sm group"
            >
              <FlipHorizontal size={16} />
              Flip Card
            </button>

            <button
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2 hover:bg-red-500 hover:text-white transition-colors text-left font-bold uppercase text-sm"
            >
              <X size={16} />
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-10 text-center pointer-events-none">
        <p className="font-black uppercase tracking-widest bg-black text-white px-4 py-1">
          Right Click to Interact
        </p>
      </div>
    </div>
  );
};
