import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Button } from "@/components/ui/button";
import { User, Shield, LogOut, Search, Ban } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

// Note: This component requires 'framer-motion'.

// --- 📦 API (Props) Definition ---
export interface UserImpersonationToggleProps {
  /** The currently logged-in admin's name. */
  adminName: string;
  /** The ID or name of the currently impersonated user (null/undefined if not active). */
  impersonatedUser?: string | null;
  /** Callback to start impersonation (receives the user ID/name to impersonate). */
  onStartImpersonation: (userId: string) => void;
  /** Callback to stop impersonation. */
  onStopImpersonation: () => void;
  /** Optional class name for the container. */
  className?: string;
}

/**
 * An essential admin component for safely toggling user impersonation mode.
 * Uses prominent red styling and Framer Motion for emphasis and smooth transitions.
 */
const UserImpersonationToggle: React.FC<UserImpersonationToggleProps> = ({
  adminName,
  impersonatedUser,
  onStartImpersonation,
  onStopImpersonation,
  className,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isActive = !!impersonatedUser;
  const isSearchValid = searchQuery.trim().length > 0;

  // Framer Motion variants for the main toggle button (prominent wiggle when active)
  const buttonVariants = {
    active: {
      scale: [1, 1.05, 1], // Subtle scale change on active
      rotate: [0, -1, 1, -1, 0], // Subtle wiggle
      transition: { duration: 0.8, repeat: Infinity, type: 'tween', ease: 'easeInOut' },
    },
    inactive: { scale: 1, rotate: 0, transition: { duration: 0.1 } },
    hover: { scale: 1.02 },
  };
  
  const handleStart = () => {
    if (isSearchValid) {
      onStartImpersonation(searchQuery.trim());
      setIsPopoverOpen(false);
      setSearchQuery('');
    }
  };

  const handleStop = () => {
    onStopImpersonation();
  };
  
  // Display content for the main button
  const buttonContent = useMemo(() => {
    if (isActive) {
      return (
        <span className="flex items-center space-x-2">
          <Ban className="h-5 w-5 shrink-0" />
          <span className="font-semibold truncate">Stop Impersonating</span>
        </span>
      );
    }
    return (
      <span className="flex items-center space-x-2">
        <Search className="h-5 w-5 shrink-0" />
        <span className="font-semibold">Impersonate User</span>
      </span>
    );
  }, [isActive]);

  return (
    <div className={cn("flex items-center", className)}>
      {/* Active State Indicator (Outside the button for emphasis) */}
      <div>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center text-sm font-medium text-red-500 dark:text-red-400 mr-4"
          >
            <Shield className="h-4 w-4 mr-2 shrink-0" />
            <span className="truncate">
                Viewing as: <strong className="font-bold">{impersonatedUser}</strong>
            </span>
          </motion.div>
        )}
      </div>

      {/* Main Action Button */}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={true}>
        <PopoverTrigger asChild>
          <motion.div
            variants={buttonVariants}
            initial={isActive ? "active" : "inactive"}
            animate={isActive ? "active" : "inactive"}
            whileHover="hover"
            className="rounded-lg shadow-lg cursor-pointer transition-shadow duration-200"
          >
            <Button
              variant={isActive ? "destructive" : "default"}
              size="lg"
              onClick={isActive ? handleStop : undefined} // Only trigger stop on click if active
              className={cn(
                "h-12 w-full transition-all duration-200",
                isActive ? "shadow-red-500/50 hover:shadow-red-500/70" : "shadow-primary/50 hover:shadow-primary/70"
              )}
              aria-label={isActive ? `Stop impersonating ${impersonatedUser}` : "Open impersonation menu"}
            >
              {buttonContent}
            </Button>
          </motion.div>
        </PopoverTrigger>
        
        {/* Popover Content (Search/Start Impersonation) */}
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-foreground flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Start Impersonation
            </h4>
            <p className="text-sm text-muted-foreground">
              Enter the User ID or Email to view the application through their lens.
            </p>

            <Separator />
            
            <Input
              type="text"
              placeholder="Enter User ID or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              className="h-10 transition-shadow duration-150"
            />
            
            <Button
              onClick={handleStart}
              disabled={!isSearchValid}
              className="w-full h-10 transition-shadow duration-150"
            >
              Start Viewing as User
            </Button>
            
            <p className="text-xs text-muted-foreground pt-1">
              Currently signed in as: {adminName}
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};


const ExampleUsage = () => {
  const [impersonatedUser, setImpersonatedUser] = useState<string | null>(null);

  const handleStart = (userId: string) => {
    setImpersonatedUser(userId);
    console.log(`Starting impersonation for: ${userId}`);
    // In a real app, this would set a session cookie/token
  };

  const handleStop = () => {
    setImpersonatedUser(null);
    console.log("Stopping impersonation.");
    // In a real app, this would clear the session token
  };

  return (
    <div className="p-8 bg-background border rounded-lg max-w-5xl mx-auto shadow-md">
      <h3 className="text-xl font-semibold text-foreground mb-6">User Impersonation Demo</h3>
      
      <div className="flex justify-center">
        <UserImpersonationToggle
          adminName="SuperAdmin@corp.com"
          impersonatedUser={impersonatedUser}
          onStartImpersonation={handleStart}
          onStopImpersonation={handleStop}
        />
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <p>
          **Impersonation Status:** <strong className={cn("ml-2 font-bold", impersonatedUser ? "text-red-500" : "text-green-500")}>
            {impersonatedUser ? `ACTIVE (${impersonatedUser})` : "INACTIVE"}
          </strong>
        </p>
        <p className="mt-2">
            Click the button, type a user (e.g., 'john.doe@test.com'), and hit 'Start Viewing as User'.
            The main button will turn red and animate, and the status will update.
        </p>
      </div>
    </div>
  );
};

export default ExampleUsage;