"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./avatar";
import { Button } from "./button";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { cn } from "../_utils/cn";
import { Users, FolderIcon } from "lucide-react";

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "Owner" | "Editor" | "Viewer";
}

export interface AccessManagerCardProps {
  title?: string;
  description?: string;
  folderIcon?: React.ReactNode;
  folderName: string;
  itemCount?: number;
  members: Member[];
  onInvite: (email: string, role: Omit<Member["role"], "Owner">) => void;
  onRoleChange: (id: string, newRole: Omit<Member["role"], "Owner">) => void;
  invitePlaceholder?: string;
  showInviteSection?: boolean;
  showHeaderIcon?: boolean;
  className?: string;
}

export const AccessManagerCard = ({
  title = "Access Manager",
  description = "Manage who can view or edit this folder.",
  folderIcon = <FolderIcon className="h-5 w-5 text-primary" />,
  folderName,
  itemCount,
  members,
  onInvite,
  onRoleChange,
  invitePlaceholder = "Add an email to invite",
  showInviteSection = true,
  showHeaderIcon = true,
  className,
}: AccessManagerCardProps) => {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<Omit<Member["role"], "Owner">>("Viewer");

  const handleInvite = () => {
    if (!email) return;
    onInvite(email, role);
    setEmail("");
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "w-full max-w-lg rounded-2xl border bg-card p-6 shadow-sm text-card-foreground space-y-6",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showHeaderIcon && <div>{folderIcon}</div>}
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-xs">{members.length} members</span>
          </div>
        </div>

        {/* Folder Info */}
        <div className="flex items-center gap-3">
          <img
            src="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-MiDb47ywhTDoylCD2HHmWzangEHtY8.png&w=320&q=75"
            alt="Folder Thumbnail"
            className="h-12 w-12 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium">{folderName}</p>
            {itemCount !== undefined && (
              <p className="text-sm text-muted-foreground">{itemCount} items</p>
            )}
          </div>
        </div>

        {/* Invite Section */}
        {showInviteSection && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Invite People</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder={invitePlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow"
              />
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="sm:w-[120px] whitespace-nowrap truncate">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Viewer">Can view</SelectItem>
                  <SelectItem value="Editor">Can edit</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleInvite}>Invite</Button>
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Members</h3>
          <motion.ul
            className="space-y-3"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {members.map((user) => (
                <motion.li
                  key={user.id}
                  variants={itemVariants}
                  layout
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      {user.role === "Owner" ? (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          Owner
                        </span>
                      ) : (
                        <Select
                          value={user.role}
                          onValueChange={(val: Omit<Member["role"], "Owner">) =>
                            onRoleChange(user.id, val)
                          }
                        >
                          <SelectTrigger className="w-[120px] text-xs whitespace-nowrap truncate">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="Viewer"
                              className="whitespace-nowrap"
                            >
                              Can view
                            </SelectItem>
                            <SelectItem
                              value="Editor"
                              className="whitespace-nowrap"
                            >
                              Can edit
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      Change or view this user’s access level
                    </TooltipContent>
                  </Tooltip>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </div>
    </TooltipProvider>
  );
};
