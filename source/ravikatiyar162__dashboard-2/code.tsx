import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assumes shadcn's utility function

// Import required shadcn/ui components and lucide-react icons
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Copy, Plus } from 'lucide-react';

// --- TYPE DEFINITIONS ---

/** Represents a user in the invitation list. */
export interface InvitedUser {
  id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  status: 'sent' | 'accepted';
}

/** Props for the ShareDashboard component. */
export interface ShareDashboardProps {
  /** The URL of the dashboard to be shared. */
  dashboardUrl: string;
  /** The source URL for the QR code image. */
  qrCodeSrc: string;
  /** An array of users who have been invited. */
  invitedUsers: InvitedUser[];
  /** The current and total number of team seats. */
  teamSeats: {
    used: number;
    total: number;
  };
  /** Callback function when the "Copy" button is clicked. */
  onCopyUrl?: () => void;
  /** Callback function when the "Add custom domain" link is clicked. */
  onAddCustomDomain?: () => void;
  /** Callback function to handle sending an invitation. */
  onInviteUser?: (email: string) => void;
  /** Callback function when the "Manage" button is clicked. */
  onManageTeam?: () => void;
  /** Optional class name for custom styling. */
  className?: string;
}

// --- HELPER FUNCTION ---

/** Generates initials from a name for avatar fallbacks. */
const getInitials = (name?: string) => {
  if (!name) return '??';
  const names = name.trim().split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// --- MAIN COMPONENT ---

export const ShareDashboard = React.forwardRef<HTMLDivElement, ShareDashboardProps>(
  (
    {
      dashboardUrl,
      qrCodeSrc,
      invitedUsers,
      teamSeats,
      onCopyUrl,
      onAddCustomDomain,
      onInviteUser,
      onManageTeam,
      className,
    },
    ref
  ) => {
    const [inviteEmail, setInviteEmail] = useState('');

    const handleInviteSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (inviteEmail.trim() && onInviteUser) {
        onInviteUser(inviteEmail.trim());
        setInviteEmail(''); // Clear input after submission
      }
    };

    const progressValue = (teamSeats.used / teamSeats.total) * 100;

    // Animation variants for the list and its items
    const listVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.08, // Controls the delay between each item animation
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <Card
        ref={ref}
        className={cn(
          'w-full max-w-4xl overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm',
          className
        )}
      >
        <CardContent className="grid grid-cols-1 p-0 md:grid-cols-2">
          {/* Left Panel: Publishing Info */}
          <div className="flex flex-col gap-6 p-6 md:p-8">
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold">Your dashboard is published</h2>
              <p className="text-sm text-muted-foreground">
                Future changes will be published automatically.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <Input type="text" value={dashboardUrl} readOnly className="rounded-r-none focus-visible:ring-0" aria-label="Dashboard link" />
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-l-none border-l-0"
                  onClick={onCopyUrl}
                  aria-label="Copy dashboard link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="link" className="h-auto p-0 text-sm" onClick={onAddCustomDomain}>
                <Plus className="mr-2 h-4 w-4" />
                Add custom domain
              </Button>
            </div>
            <div className="mt-auto flex flex-col items-center gap-4 rounded-lg border bg-muted p-4 text-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-md bg-background p-2">
                <img src={qrCodeSrc} alt="Dashboard QR Code" className="h-full w-full object-contain" />
              </div>
              <p className="text-sm text-muted-foreground">Scan this code with your phone to open your dashboard in the app.</p>
            </div>
          </div>

          {/* Right Panel: Invitations */}
          <div className="flex flex-col gap-6 border-t p-6 md:border-l md:border-t-0 md:p-8">
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold">Invite people to your dashboard</h2>
              <p className="text-sm text-muted-foreground">
                We'll email them instructions and a link to create an account.
              </p>
            </div>
            <form onSubmit={handleInviteSubmit} className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-grow"
                aria-label="Email address to invite"
              />
              <Button type="submit">Send invite</Button>
            </form>

            <motion.ul
              className="flex flex-1 flex-col gap-4"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {invitedUsers.map((user) => (
                  <motion.li key={user.id} className="flex items-center gap-3" variants={itemVariants} layout>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl} alt={user.name || user.email} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow overflow-hidden">
                      <p className="truncate text-sm font-medium leading-none">{user.name || user.email}</p>
                      {user.name && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
                    </div>
                    <Badge variant={user.status === 'accepted' ? 'default' : 'secondary'} className="shrink-0">
                      {user.status === 'accepted' ? 'Accepted' : 'Invite sent'}
                    </Badge>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>

            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">{teamSeats.used}</span> / {teamSeats.total} team seats used
                </p>
                <Button variant="link" className="h-auto p-0 text-sm" onClick={onManageTeam}>
                  Manage
                </Button>
              </div>
              <Progress value={progressValue} aria-label={`${teamSeats.used} of ${teamSeats.total} seats used`} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);
ShareDashboard.displayName = 'ShareDashboard';