import React, { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface AnimatedModalProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  trigger,
  title,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && triggerRef.current) {
      // Store the trigger button's position when opening
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
    setOpen(isOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          {trigger}
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && triggerRect && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setOpen(false)}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6"
                  initial={{
                    opacity: 0,
                    scale: 0.5, // Start from a smaller size
                    x:
                      triggerRect.left +
                      triggerRect.width / 2 -
                      window.innerWidth / 2,
                    y:
                      triggerRect.top +
                      triggerRect.height / 2 -
                      window.innerHeight / 2,
                    rotateX: 15,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1, // Scale up to full size
                    x: 0,
                    y: 0,
                    rotateX: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5, // Shrink back to smaller size when closing
                    x:
                      triggerRect.left +
                      triggerRect.width / 2 -
                      window.innerWidth / 2,
                    y:
                      triggerRect.top +
                      triggerRect.height / 2 -
                      window.innerHeight / 2,
                    rotateX: -15,
                  }}
                  transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 300,
                    duration: 0.25,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-medium text-gray-900">
                      {title}
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="rounded-full p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Close"
                      >
                        <X size={18} />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="mt-2">{children}</div>
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
