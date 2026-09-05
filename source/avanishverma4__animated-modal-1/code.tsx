import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Icons ────────────────────────────────────────────────────────────────────
const PlaneIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
  </svg>
);

const VacationIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M17.553 16.75a7.5 7.5 0 0 0 -10.606 0" />
    <path d="M18 3.804a6 6 0 0 0 -8.196 2.196l10.392 6a6 6 0 0 0 -2.196 -8.196z" />
    <path d="M16.732 10c1.658 -2.87 2.225 -5.644 1.268 -6.196c-.957 -.552 -3.075 1.326 -4.732 4.196" />
    <path d="M15 9l-3 5.196" />
    <path d="M3 19.25a2.4 2.4 0 0 1 1 -.25a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 1 .25" />
  </svg>
);

const ElevatorIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 4m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
    <path d="M10 10l2 -2l2 2" />
    <path d="M10 14l2 2l2 -2" />
  </svg>
);

const FoodIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M20 20c0 -3.952 -.966 -16 -4.038 -16s-3.962 9.087 -3.962 14.756c0 -5.669 -.896 -14.756 -3.962 -14.756c-3.065 0 -4.038 12.048 -4.038 16" />
  </svg>
);

const MicIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M15 12.9a5 5 0 1 0 -3.902 -3.9" />
    <path d="M15 12.9l-3.902 -3.899l-7.513 8.584a2 2 0 1 0 2.827 2.83l8.588 -7.515z" />
  </svg>
);

const ParachuteIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M22 12a10 10 0 1 0 -20 0" />
    <path d="M22 12c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3c0 -1.66 -1.57 -3 -3.5 -3s-3.5 1.34 -3.5 3c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3" />
    <path d="M2 12l10 10l-3.5 -10" />
    <path d="M15.5 12l-3.5 10l10 -10" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const images = [
  "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=600&auto=format&fit=crop",
];

const rotations = [-8, 5, -4, 9, -6];

const details = [
  { Icon: PlaneIcon,    label: "5 connecting flights" },
  { Icon: ElevatorIcon, label: "12 hotels" },
  { Icon: VacationIcon, label: "69 visiting spots" },
  { Icon: FoodIcon,     label: "Good food everyday" },
  { Icon: MicIcon,      label: "Open Mic" },
  { Icon: ParachuteIcon,label: "Paragliding" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AnimatedModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-40 flex items-center justify-center">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="group relative overflow-hidden bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-xl font-semibold cursor-pointer w-48 h-12"
      >
        <span className="block transition-transform duration-500 group-hover:translate-x-44 text-center">
          Book your flight
        </span>
        <span className="absolute inset-0 flex items-center justify-center -translate-x-40 group-hover:translate-x-0 transition-transform duration-500 text-white dark:text-black text-xl">
          ✈️
        </span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 32 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-all text-sm z-10"
              >
                ✕
              </button>

              {/* Content */}
              <div className="px-8 pt-8 pb-2">
                <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                  Book your trip to{" "}
                  <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                    Bali
                  </span>{" "}
                  now! ✈️
                </h4>

                {/* Stacked Images */}
                <div className="flex justify-center items-center">
                  {images.map((src, idx) => (
                    <motion.div
                      key={idx}
                      style={{ rotate: rotations[idx] }}
                      whileHover={{ scale: 1.1, rotate: 0, zIndex: 100 }}
                      whileTap={{ scale: 1.1, rotate: 0, zIndex: 100 }}
                      className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 shrink-0 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={src}
                        alt="Bali"
                        width="500"
                        height="500"
                        className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Details Grid */}
                <div className="py-10 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start max-w-sm mx-auto">
                  {details.map(({ Icon, label }) => (
                    <div key={label} className="flex items-center justify-center">
                      <Icon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
                      <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-4 px-8 py-5 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={() => setOpen(false)}
                  className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 hover:bg-gray-300 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28 hover:opacity-80 transition-opacity">
                  Book Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}