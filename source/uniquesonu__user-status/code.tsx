import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Power, Settings, Eye, Clock } from 'lucide-react';

// Note: This component requires 'framer-motion'.

// --- Internal Data Structure ---
export type UserStatus = 'online' | 'offline' | 'away';

// --- Internal Configuration ---
const STATUS_COLORS: Record<UserStatus, string> = {
  online: "bg-green-500",
  offline: "bg-gray-500",
  away: "bg-yellow-500",
};

// --- 📦 API (Props) Definition ---
export interface UserStatusCardProps {
  /** The full name of the user. */
  userName: string;
  /** The user's primary role or title. */
  userRole: string;
  /** The current online/offline/away status. */
  status: UserStatus;
  /** The time of their last activity (e.g., "5 minutes ago"). */
  lastActive: string;
  /** Fallback initials for the avatar. */
  avatarFallback: string;
  /** Optional URL for the user's profile image. */
  avatarUrl?: string;
  /** Callback for the primary action (e.g., viewing profile). */
  onViewProfile: () => void;
  /** Callback for the secondary action (e.g., resetting password). */
  onResetPassword: () => void;
  /** Optional class name for the card container. */
  className?: string;
}

/**
 * An animated card component displaying a user's current status and providing quick management actions.
 * Ideal for an admin dashboard's user monitoring section.
 */
const UserStatusCard: React.FC<UserStatusCardProps> = ({
  userName,
  userRole,
  status,
  lastActive,
  avatarFallback,
  avatarUrl,
  onViewProfile,
  onResetPassword,
  className,
}) => {
  const statusColor = STATUS_COLORS[status] || STATUS_COLORS.offline;
  const isOnline = status === 'online';

  // Framer Motion variants for subtle lift on hover
  const cardVariants = {
    initial: { y: 0 },
    hover: { y: -3, boxShadow: "0 8px 10px -5px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.08)" },
    tap: { scale: 0.99 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn("h-full rounded-lg cursor-pointer", className)}
    >
      <Card className="h-full transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          {/* User Info and Status */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback className="bg-muted text-foreground font-semibold">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              {/* Status Indicator Dot */}
              <span 
                className={cn("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card", statusColor)}
                aria-label={`Status: ${status}`}
              />
            </div>
            
            <div className="flex flex-col">
              <CardTitle className="text-lg font-semibold text-foreground truncate">{userName}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{userRole}</CardDescription>
            </div>
          </div>
          
          {/* Main Status Badge */}
          <span className={cn(
            "text-xs font-semibold py-1 px-2 rounded-full border capitalize",
            isOnline 
              ? "bg-green-500/10 text-green-600 border-green-500/20" 
              : "bg-muted text-muted-foreground border-border"
          )}>
            {status}
          </span>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Last Activity */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground border-t pt-4">
            <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="font-medium">Last Active:</span>
            <span className="text-foreground">{lastActive}</span>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="default" 
              size="sm" 
              onClick={onViewProfile}
              className="flex-1 transition-shadow duration-150 shadow-sm hover:shadow-md"
              aria-label={`View profile for ${userName}`}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onResetPassword}
              className="flex-1 transition-colors duration-150 hover:bg-yellow-500/10 hover:text-yellow-600"
              aria-label={`Reset password for ${userName}`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


const ExampleUsage = () => {
  const handleView = (name: string) => alert(`Viewing profile for ${name}`);
  const handleReset = (name: string) => alert(`Requesting password reset for ${name}`);

  return (
    <div className="p-8 bg-background border rounded-lg max-w-7xl mx-auto shadow-md">
      <h3 className="text-xl font-semibold text-foreground mb-6">User Status & Quick Management</h3>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Example 1: Online User */}
        <UserStatusCard
          userName="Alice Johnson"
          userRole="Admin"
          status="online"
          lastActive="Just now"
          avatarFallback="AJ"
          avatarUrl="https://i.pravatar.cc/150?img=3"
          onViewProfile={() => handleView("Alice Johnson")}
          onResetPassword={() => handleReset("Alice Johnson")}
        />
        
        {/* Example 2: Offline User */}
        <UserStatusCard
          userName="Bob Smith"
          userRole="Analyst"
          status="offline"
          lastActive="Yesterday, 4:00 PM"
          avatarFallback="BS"
          avatarUrl="https://i.pravatar.cc/150?img=12"
          onViewProfile={() => handleView("Bob Smith")}
          onResetPassword={() => handleReset("Bob Smith")}
        />

        {/* Example 3: Away User */}
        <UserStatusCard
          userName="Charlie Davis"
          userRole="Support"
          status="away"
          lastActive="1 hour ago"
          avatarFallback="CD"
          onViewProfile={() => handleView("Charlie Davis")}
          onResetPassword={() => handleReset("Charlie Davis")}
        />
      </div>
    </div>
  );
};

export default ExampleUsage;