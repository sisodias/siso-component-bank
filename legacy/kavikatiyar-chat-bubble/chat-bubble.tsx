"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ChevronRight } from "lucide-react";
import Image from "next/image";

import { cn } from "../_utils/cn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { Button } from "./button";

// Define the type for a single user
interface User {
  id: string;
  name: string;
  avatarUrl: string;
  isSpeaking?: boolean;
}

// Define the props for the main VoiceChat component
interface VoiceChatProps {
  /** An array of user objects to display. */
  users: User[];
  /** Maximum number of avatars to show in the collapsed state. @default 4 */
  maxVisibleAvatars?: number;
  /** Callback function triggered when the "Join Now" button is clicked. */
  onJoin: () => void;
  /** Optional class name for custom styling of the trigger element. */
  className?: string;
}

/** An animated speaking indicator component. */
const SpeakingIndicator = () => (
  <div className="absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-card p-0.5">
    <div className="flex h-full w-full items-end justify-center gap-0.5 rounded-full bg-primary p-1">
      {[0.5, 0.8, 0.3].map((h, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-primary-foreground"
          initial={{ height: `${h * 100}%` }}
          animate={{ height: `${Math.random() * 80 + 20}%` }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      ))}
    </div>
  </div>
);

/**
 * A responsive and animated voice chat component with an "extending" animation.
 */
export const VoiceChat = ({
  users,
  maxVisibleAvatars = 4,
  onJoin,
  className,
}: VoiceChatProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const visibleUsers = users.slice(0, maxVisibleAvatars);
  const hiddenUsersCount = Math.max(0, users.length - maxVisibleAvatars);
  const firstSpeaker = visibleUsers.find((user) => user.isSpeaking);

  // Animation variants for the popover content
  const popoverVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      {/* Collapsed Trigger Button */}
      <PopoverTrigger asChild>
        <button
          className={cn(
            "group relative flex h-14 cursor-pointer items-center justify-center rounded-full border bg-card p-2 pr-4 shadow-sm transition-all hover:border-primary/50",
            className
          )}
          aria-label={`Open voice chat with ${users.length} participants`}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Mic className="h-5 w-5 text-muted-foreground" />
            {firstSpeaker && <SpeakingIndicator />}
          </div>
          <div className="ml-2 flex -space-x-4">
            {visibleUsers.map((user, index) => (
              <div key={user.id} className="relative">
                <Image
                  width={40}
                  height={40}
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-10 w-10 rounded-full border-2 border-card object-cover"
                  style={{ zIndex: visibleUsers.length - index }}
                />
                {user.isSpeaking && !firstSpeaker && index !== 0 && <SpeakingIndicator />}
              </div>
            ))}
          </div>
          {hiddenUsersCount > 0 && (
            <span className="ml-3 text-sm font-medium text-muted-foreground">
              +{hiddenUsersCount}
            </span>
          )}
          <ChevronRight className="ml-1 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </button>
      </PopoverTrigger>

      {/* Expanded Popover Content with Custom Animation */}
      <AnimatePresence>
        {isOpen && (
          <PopoverContent
            // FIX: Removed the `asChild` prop here to resolve the error.
            sideOffset={12}
            align="start"
            className="w-80 rounded-2xl border-none bg-transparent p-0 shadow-2xl"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={popoverVariants}
              className="flex flex-col overflow-hidden rounded-2xl border bg-card"
              style={{ transformOrigin: "top left" }}
            >
              <div className="p-6 pb-4">
                <h3 className="text-center text-lg font-semibold">Voice Chat</h3>
              </div>
              <div className="grid grid-cols-4 gap-y-6 p-6 pt-0">
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                  >
                    <div className="relative">
                      <Image
                        width={56}
                        height={56}
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                      {user.isSpeaking && <SpeakingIndicator />}
                    </div>
                    <span className="truncate text-xs font-medium text-foreground">
                      {user.name}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col gap-2 border-t bg-muted/50 p-6">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    onJoin();
                    setIsOpen(false);
                  }}
                >
                  Join Now
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Mic will be muted initially.
                </p>
              </div>
            </motion.div>
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
};