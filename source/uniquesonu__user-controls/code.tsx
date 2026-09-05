import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, LayoutDashboard, Briefcase, Mail } from 'lucide-react';

// Note: This component requires 'framer-motion'.

// --- Internal Data Structure ---
export interface ProfileAction {
  /** Unique key for the action. */
  key: string;
  /** The label displayed in the menu. */
  label: string;
  /** Icon for the menu item. */
  icon: React.ElementType;
  /** If true, the action is destructive (e.g., logout). */
  isDestructive?: boolean;
}

// --- 📦 API (Props) Definition ---
export interface ProfileDropdownMenuProps {
  /** The user's full name. */
  userName: string;
  /** The user's email or role. */
  userRole: string;
  /** Optional URL for the user's profile image. */
  avatarUrl?: string;
  /** Fallback initials for the avatar. */
  avatarFallback: string;
  /** Array of menu actions. */
  actions: ProfileAction[];
  /** Callback when a menu action is selected. */
  onActionSelect: (key: string) => void;
  /** Optional class name for the trigger button container. */
  className?: string;
}

/**
 * An animated profile dropdown menu for the admin dashboard, providing quick access to
 * user information and key actions.
 */
const ProfileDropdownMenu: React.FC<ProfileDropdownMenuProps> = ({
  userName,
  userRole,
  avatarUrl,
  avatarFallback,
  actions,
  onActionSelect,
  className,
}) => {
  // Framer Motion variants for the dropdown menu content
  // Note: We wrap shadcn/ui DropdownMenuContent with motion.div using its portal for animation
  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={cn("cursor-pointer", className)}>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-10 px-2 rounded-lg transition-colors duration-150 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Open user profile menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start min-w-0 pr-1">
            <span className="text-sm font-semibold truncate text-foreground leading-none">{userName}</span>
            <span className="text-xs truncate text-muted-foreground leading-none mt-1">{userRole}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      {/* Custom Animated Content Wrapper */}
      <AnimatePresence>
        <DropdownMenuContent
          align="end"
          className="w-64 p-0 overflow-hidden" // Remove default shadcn padding/shadow to let motion handle it
          asChild // Important for applying Framer Motion to the content wrapper
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            {/* User Info Header */}
            <DropdownMenuLabel className="p-4 flex flex-col items-start bg-muted/50 border-b">
                <span className="text-base font-bold text-foreground">{userName}</span>
                <span className="text-sm font-normal text-muted-foreground mt-0.5">{userRole}</span>
            </DropdownMenuLabel>
            <Separator />
            
            {/* Action Items */}
            <div className="p-1">
                {actions.map((action) => {
                const ActionIcon = action.icon;
                return (
                    <DropdownMenuItem
                    key={action.key}
                    onClick={() => onActionSelect(action.key)}
                    className={cn(
                        "flex items-center cursor-pointer p-2 transition-colors duration-100",
                        action.isDestructive ? "text-red-600 focus:bg-red-500/10 focus:text-red-700 dark:text-red-400 dark:focus:text-red-300" : ""
                    )}
                    >
                    <ActionIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                    {action.label}
                    </DropdownMenuItem>
                );
                })}
            </div>
          </motion.div>
        </DropdownMenuContent>
      </AnimatePresence>
    </DropdownMenu>
  );
};


const mockActions: ProfileAction[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'profile', label: 'My Profile', icon: User },
  { key: 'settings', label: 'Account Settings', icon: Settings },
  { key: 'separator_1', label: '', icon: Separator as React.ElementType }, // Using Separator placeholder
  { key: 'logout', label: 'Log Out', icon: LogOut, isDestructive: true },
];

const ExampleUsage = () => {
  const [userStatus, setUserStatus] = useState("Online");

  const handleAction = (key: string) => {
    if (key === 'logout') {
        alert("Logging out...");
    } else if (key !== 'separator_1') {
        alert(`Navigating to: ${key}`);
    }
    // In a real app, you would handle navigation here
  };

  return (
    <div className="p-8 bg-background border rounded-lg max-w-lg mx-auto shadow-md flex justify-end item-center">
      <h3 className="text-xl font-semibold text-foreground mr-auto ">User Controls</h3>
      
      <ProfileDropdownMenu
        userName="Alexandra Ray"
        userRole="Administrator"
        avatarUrl="https://i.pravatar.cc/150?img=1" // Placeholder URL
        avatarFallback="AR"
        actions={mockActions.filter(a => a.key !== 'separator_1')} // Filter out placeholder in final render
        onActionSelect={handleAction}
      />
      
      <p className="fixed bottom-4 right-4 text-xs text-muted-foreground">
        Current Status: {userStatus}
      </p>
    </div>
  );
};

export default ExampleUsage;