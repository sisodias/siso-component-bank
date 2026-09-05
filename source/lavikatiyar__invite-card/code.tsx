// components/ui/invite-card.tsx
"use client";

import * as React from "react";
import { Copy, Check, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Type definition for a user object
interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

// Props for the InviteCard component
interface InviteCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: React.ReactNode;
  users: User[];
  totalJoined: number;
  inviteLink: string;
  onCopyLink?: () => void;
  onShareLinkedIn?: () => void;
}

export const InviteCard = React.forwardRef<HTMLDivElement, InviteCardProps>(
  ({ className, title, description, users = [], totalJoined, inviteLink, onCopyLink, onShareLinkedIn, ...props }, ref) => {
    const [isCopied, setIsCopied] = React.useState(false);

    // Handles the copy-to-clipboard functionality
    const handleCopy = () => {
      navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);
      onCopyLink?.();
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    };

    // Animation variants for framer-motion
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
        },
      },
    };

    return (
      <Card className={cn("w-full max-w-md overflow-hidden", className)} ref={ref} {...props}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              {/* Animated avatar list */}
              <motion.div
                className="flex -space-x-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {users.slice(0, 5).map((user, index) => (
                  <motion.div key={user.id} variants={itemVariants}>
                    <Avatar
                      className="border-2 border-background"
                      style={{ zIndex: users.length - index }}
                    >
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            {totalJoined > 0 && (
              <p className="text-sm text-muted-foreground">
                +{totalJoined} more people already joined
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center gap-2">
          <Button onClick={handleCopy} className="w-full sm:w-auto flex-grow">
            {isCopied ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            {isCopied ? "Copied!" : "Copy link"}
          </Button>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="w-full sm:w-auto" onClick={onShareLinkedIn} aria-label="Share on LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share on LinkedIn</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
    );
  }
);
InviteCard.displayName = "InviteCard";