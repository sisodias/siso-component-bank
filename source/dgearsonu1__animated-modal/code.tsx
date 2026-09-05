import React, { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Utility function for class names
const cn = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Modal Context
interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

// Hook to detect clicks outside of a component
export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: Function
) => {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};

// Modal Components
export function Modal({ children }: { children: ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}

export const ModalTrigger = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { setOpen } = useModal();
  return (
    <button
      className={cn(
        "relative overflow-hidden px-8 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 active:scale-95",
        "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700",
        "shadow-lg hover:shadow-purple-500/25",
        className
      )}
      onClick={() => setOpen(true)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      {children}
    </button>
  );
};

export const ModalBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { open } = useModal();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const modalRef = useRef(null);
  const { setOpen } = useModal();
  useOutsideClick(modalRef, () => setOpen(false));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 h-full w-full flex items-center justify-center z-50 p-4"
          style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
        >
          <Overlay />
          <motion.div
            ref={modalRef}
            className={cn(
              "relative z-50 w-full max-w-4xl max-h-[90vh] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
              "rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50",
              "flex flex-col overflow-hidden",
              className
            )}
            initial={{ opacity: 0, scale: 0.3, rotateX: 45, y: 100 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 15, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.6 
            }}
          >
            <CloseIcon />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col flex-1 p-8 md:p-12 overflow-y-auto", className)}>
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(
      "flex justify-end gap-4 p-6 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50",
      className
    )}>
      {children}
    </div>
  );
};

const Overlay = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 z-40",
        className
      )}
    />
  );
};

const CloseIcon = () => {
  const { setOpen } = useModal();
  return (
    <button
      onClick={() => setOpen(false)}
      className="absolute top-6 right-6 z-50 group p-2 rounded-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white group-hover:scale-110 group-hover:rotate-90 transition-all duration-200"
      >
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
};

// Enhanced Demo Component
export function EnhancedAnimatedModalDemo() {
  const images = [
    "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
      </div>

      <Modal>
        <ModalTrigger className="group relative">
          <span className="group-hover:translate-x-12 text-center transition-transform duration-500 flex items-center gap-3">
            <span className="text-2xl">✈️</span>
            Book Your Dream Vacation
          </span>
          <div className="-translate-x-12 group-hover:translate-x-0 flex items-center justify-center absolute inset-0 transition-transform duration-500 text-white z-20">
            <span className="text-3xl animate-bounce">🌴</span>
          </div>
        </ModalTrigger>
        
        <ModalBody>
          <ModalContent>
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
              >
                Escape to Paradise
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 dark:text-gray-300"
              >
                Book your magical trip to{" "}
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-800 dark:to-blue-800 text-purple-700 dark:text-purple-300 font-semibold">
                  Bali
                </span>{" "}
                ✨
              </motion.p>
            </div>

            {/* Image Gallery */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center items-center mb-8 flex-wrap gap-4"
            >
              {images.map((image, idx) => (
                <motion.div
                  key={"images" + idx}
                  initial={{ opacity: 0, scale: 0.8, rotate: Math.random() * 20 - 10 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  style={{ rotate: Math.random() * 15 - 7.5 }}
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: 0, 
                    zIndex: 100,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 1.05 }}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300" />
                  <div className="relative p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 border-2 border-white/50 dark:border-gray-700/50">
                    <img
                      src={image}
                      alt="Bali destination"
                      className="rounded-xl h-20 w-20 md:h-32 md:w-32 object-cover"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
            >
              {[
                { icon: <PlaneIcon />, text: "5 connecting flights", color: "from-blue-500 to-cyan-500" },
                { icon: <ElevatorIcon />, text: "12 luxury hotels", color: "from-purple-500 to-pink-500" },
                { icon: <VacationIcon />, text: "69 visiting spots", color: "from-green-500 to-emerald-500" },
                { icon: <FoodIcon />, text: "Gourmet dining", color: "from-orange-500 to-red-500" },
                { icon: <MicIcon />, text: "Live entertainment", color: "from-indigo-500 to-purple-500" },
                { icon: <ParachuteIcon />, text: "Adventure sports", color: "from-teal-500 to-blue-500" },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-xl",
                    `bg-gradient-to-br ${feature.color}`
                  )} />
                  <div className="relative flex items-center justify-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/30 dark:border-gray-700/30 group-hover:border-white/50 dark:group-hover:border-gray-600/50 transition-all duration-300">
                    <div className={cn(
                      "mr-3 p-2 rounded-lg bg-gradient-to-br text-white shadow-lg group-hover:shadow-xl transition-all duration-300",
                      feature.color
                    )}>
                      {feature.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                      {feature.text}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Starting from $1,299
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">per person • 7 days 6 nights</p>
            </motion.div>
          </ModalContent>
          
          <ModalFooter>
            <button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95">
              Maybe Later
            </button>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300">
              Book Now 🚀
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}

// Icon Components
const PlaneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
  </svg>
);

const VacationIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17.553 16.75a7.5 7.5 0 0 0 -10.606 0" />
    <path d="M18 3.804a6 6 0 0 0 -8.196 2.196l10.392 6a6 6 0 0 0 -2.196 -8.196z" />
    <path d="M16.732 10c1.658 -2.87 2.225 -5.644 1.268 -6.196c-.957 -.552 -3.075 1.326 -4.732 4.196" />
    <path d="M15 9l-3 5.196" />
    <path d="M3 19.25a2.4 2.4 0 0 1 1 -.25a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 1 .25" />
  </svg>
);

const ElevatorIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 4m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
    <path d="M10 10l2 -2l2 2" />
    <path d="M10 14l2 2l2 -2" />
  </svg>
);

const FoodIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 20c0 -3.952 -.966 -16 -4.038 -16s-3.962 9.087 -3.962 14.756c0 -5.669 -.896 -14.756 -3.962 -14.756c-3.065 0 -4.038 12.048 -4.038 16" />
  </svg>
);

const MicIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 12.9a5 5 0 1 0 -3.902 -3.9" />
    <path d="M15 12.9l-3.902 -3.899l-7.513 8.584a2 2 0 1 0 2.827 2.83l8.588 -7.515z" />
  </svg>
);

const ParachuteIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 12a10 10 0 1 0 -20 0" />
    <path d="M22 12c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3c0 -1.66 -1.57 -3 -3.5 -3s-3.5 1.34 -3.5 3c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3" />
    <path d="M2 12l10 10l-3.5 -10" />
    <path d="M15.5 12l-3.5 10l10 -10" />
  </svg>
);

