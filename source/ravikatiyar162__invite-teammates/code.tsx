import * as React from "react";
import { X, Link, MoreHorizontal, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils"; // Assuming you have a cn utility from shadcn

// --- Prop Types ---
interface Teammate {
  name: string;
  email: string;
  avatarUrl: string;
  status: "Online" | "Away" | "Inactive";
  lastActive: string;
}

interface InviteTeammatesProps {
  teammates: Teammate[];
  onInvite: (emails: string[]) => void;
  onGetLink: () => void;
}

// --- Helper Components ---
const Avatar: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img src={src} alt={alt} className="h-8 w-8 rounded-full object-cover" />
);

const statusVariants = cva("flex items-center gap-1.5 text-xs font-medium", {
  variants: {
    status: {
      Online: "text-green-500",
      Away: "text-amber-500",
      Inactive: "text-red-500",
    },
  },
  defaultVariants: {
    status: "Away",
  },
});

const StatusIndicator: React.FC<{ status: Teammate["status"]; lastActive: string }> = ({ status, lastActive }) => {
  const Icon = {
    Online: CheckCircle,
    Away: Clock,
    Inactive: AlertCircle,
  }[status];

  return (
    <div className={cn(statusVariants({ status }))}>
      <Icon className="h-3.5 w-3.5" />
      <span>
        {status} {status !== "Online" && `(${lastActive})`}
      </span>
    </div>
  );
};

// --- Main Component ---
const InviteTeammates = React.forwardRef<HTMLDivElement, InviteTeammatesProps>(
  ({ teammates, onInvite, onGetLink, ...props }, ref) => {
    const [emails, setEmails] = React.useState<string[]>(["Richard Winson"]);
    const [inputValue, setInputValue] = React.useState<string>("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
        e.preventDefault();
        if (!emails.includes(inputValue.trim())) {
          setEmails([...emails, inputValue.trim()]);
        }
        setInputValue("");
      } else if (e.key === "Backspace" && !inputValue) {
        setEmails(emails.slice(0, -1));
      }
    };

    const removeEmail = (emailToRemove: string) => {
      setEmails(emails.filter((email) => email !== emailToRemove));
    };

    const handleInvite = () => {
        onInvite(emails);
        setEmails([]);
    }

    return (
      <div
        ref={ref}
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 font-sans text-card-foreground shadow-lg"
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Invite Teammates</h2>
          <button className="text-muted-foreground transition-colors hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Email Input Area */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex w-full flex-wrap items-center gap-2 rounded-lg border border-input p-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
            {emails.map((email) => (
              <span
                key={email}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground"
              >
                {email === "Richard Winson" && (
                  <Avatar src="https://i.pravatar.cc/150?u=richard" alt="Richard Winson" />
                )}
                {email}
                <button
                  onClick={() => removeEmail(email)}
                  className="rounded-full transition-colors hover:bg-muted-foreground/20"
                  aria-label={`Remove ${email}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
            <input
              type="email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={emails.length === 0 ? "Enter teammate emails..." : ""}
              className="min-w-[100px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button onClick={handleInvite} className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Invite
          </button>
        </div>

        {/* Shareable Link Section */}
        <div className="mt-6 flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border relative">
                    <Link className="h-5 w-5 text-muted-foreground"/>
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-muted/50"></span>
                </div>
                <div>
                    <p className="font-semibold">Shareable Link is now Live!</p>
                    <p className="text-xs text-muted-foreground">Create and get shareable link for this file.</p>
                </div>
            </div>
            <button onClick={onGetLink} className="shrink-0 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                Get Link
            </button>
        </div>

        {/* Teammates List */}
        <div className="mt-4 space-y-2">
          <AnimatePresence>
            {teammates.map((teammate, index) => (
              <motion.div
                key={teammate.email}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                exit={{ opacity: 0, x: -20 }}
                layout
                className="flex items-center justify-between p-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={teammate.avatarUrl} alt={teammate.name} />
                  <div>
                    <p className="font-semibold">{teammate.name}</p>
                    <p className="text-sm text-muted-foreground">{teammate.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                    <StatusIndicator status={teammate.status} lastActive={teammate.lastActive} />
                    <button className="text-muted-foreground transition-colors hover:text-foreground">
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

InviteTeammates.displayName = "InviteTeammates";

export { InviteTeammates };