// component.tsx
import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ChevronDown, X } from "lucide-react";

export interface PostSchedulerProps extends React.HTMLAttributes<HTMLDivElement> {}

const PostScheduler = React.forwardRef<HTMLDivElement, PostSchedulerProps>(
  ({ className, ...props }, ref) => {
    const [open, setOpen] = useState(false);

    return (
      <div ref={ref} className={`relative ${className}`} {...props}>
        <div
          className="relative z-10 w-80 border border-slate-200 bg-white text-slate-900 dark:border-slate-200 dark:bg-white dark:text-slate-900"
          style={{ borderRadius: 25 }}
        >
          <div className="p-2">
            <textarea
              placeholder="What's happening?"
              className="w-full resize-none bg-white p-2 outline-none placeholder:text-slate-400 dark:bg-white dark:placeholder:text-slate-400"
            />
          </div>
          <div className="relative pt-10">
            <AnimatePresence>
              {open && (
                <motion.div
                  className="absolute top-0 size-full px-2"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                >
                  <div className="relative flex h-10 items-center justify-between overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-200 dark:bg-slate-100">
                    <div className="flex w-[90%] items-center justify-between rounded-full bg-white dark:bg-white">
                      <div className="flex h-10 w-full items-center justify-between border-r border-slate-200 p-2 dark:border-slate-200">
                        <span className="text-sm">01, Jan 2025</span>
                        <ChevronDown size={20} />
                      </div>
                      <div className="flex h-10 w-full items-center justify-between p-2">
                        <span className="text-sm">12:00 AM</span>
                        <ChevronDown size={20} />
                      </div>
                    </div>
                    <button
                      className="flex h-10 w-10 items-center justify-center"
                      onClick={() => setOpen(false)}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative flex items-center justify-end gap-2 p-2">
              <motion.button
                className="flex size-10 items-center justify-center border border-slate-200 bg-slate-100 transition-opacity duration-300 dark:border-slate-200 dark:bg-slate-100"
                style={{
                  borderRadius: 25,
                  opacity: open ? 0 : 1,
                }}
                onClick={() => setOpen(true)}
              >
                <CalendarDays />
              </motion.button>
              <motion.button
                className="bg-zinc-900 py-2 px-8 text-white dark:bg-zinc-900"
                layoutId="schedule"
                style={{ borderRadius: 25 }}
              >
                Post
              </motion.button>
              <AnimatePresence>
                {open && (
                  <div className="absolute inset-0 flex size-full items-center justify-center p-2">
                    <motion.button
                      layoutId="schedule"
                      className="h-10 w-full bg-zinc-900 py-2 px-8 text-white dark:bg-zinc-900"
                      style={{ borderRadius: 25 }}
                    >
                      Schedule
                    </motion.button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -62 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -62 }}
              className="absolute -bottom-10 flex w-full items-center justify-center rounded-b-[25px] border border-slate-200 bg-slate-100 p-3 pt-8 dark:border-slate-200 dark:bg-slate-100"
            >
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                Will be posted on 01 Jan 2025 at 12:00 AM
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

PostScheduler.displayName = "PostScheduler";

export default PostScheduler;