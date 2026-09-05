import * as React from "react";
import { useState } from "react";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import {
  Users,
  Link2,
  ChevronDown,
  MoreHorizontal,
  X,
  Copy,
  Check,
  UserPlus,
  Trash2,
} from "lucide-react";

import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Input } from "./input";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Separator } from "./separator";

// Define types for component props
type Role = "owner" | "editor" | "viewer";
type AccessLevel = "private" | "link";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
}

interface ManageAccessProps {
  users: User[];
  fileUrl: string;
  onInvite: (email: string, role: Role) => void;
  onRoleChange: (userId: string, newRole: Role) => void;
  onRemoveUser: (userId: string) => void;
  onAccessChange: (level: AccessLevel) => void;
  className?: string;
}

// Main component
export const ManageAccess = ({
  users,
  fileUrl,
  onInvite,
  onRoleChange,
  onRemoveUser,
  onAccessChange,
  className,
}: ManageAccessProps) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("viewer");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("private");
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const owner = users.find((user) => user.role === "owner");

  const handleInvite = () => {
    if (inviteEmail) {
      onInvite(inviteEmail, inviteRole);
      setInviteEmail("");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader>
        <CardTitle>Share & Access</CardTitle>
        <CardDescription>
          Invite others or share a link to collaborate.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invite Section */}
        <div className="flex items-center space-x-2">
          <Input
            type="email"
            placeholder="Email, name..."
            className="flex-1"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[120px] justify-between">
                {inviteRole === "viewer" && "Can view"}
                {inviteRole === "editor" && "Can edit"}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setInviteRole("viewer")}>
                Can view
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setInviteRole("editor")}>
                Can edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleInvite} disabled={!inviteEmail}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
        </div>
        <Separator />
        {/* General Access Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">General access</h3>
          <div
            className={cn(
              "flex items-center p-3 rounded-md border cursor-pointer transition-colors",
              accessLevel === "private" && "bg-muted border-primary"
            )}
            onClick={() => {
              setAccessLevel("private");
              onAccessChange("private");
            }}
          >
            <Users className="h-8 w-8 mr-4 text-muted-foreground" />
            <div>
              <p className="font-semibold">Only those invited</p>
              <p className="text-sm text-muted-foreground">
                {users.length} people
              </p>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center p-3 rounded-md border cursor-pointer transition-colors",
              accessLevel === "link" && "bg-muted border-primary"
            )}
            onClick={() => {
              setAccessLevel("link");
              onAccessChange("link");
            }}
          >
            <Link2 className="h-8 w-8 mr-4 text-muted-foreground" />
            <div>
              <p className="font-semibold">Link access</p>
              <p className="text-sm text-muted-foreground">
                Anyone with the link can view
              </p>
            </div>
          </div>
        </div>
        <Separator />
        {/* People with Access Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">
            People with access
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {user.role === "owner" ? (
                    <div className="flex items-center text-sm text-muted-foreground">
                      Owner <Check className="h-4 w-4 ml-2 text-primary" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                       <AnimatePresence mode="wait">
                        {removingUserId === user.id ? (
                           <motion.div
                             key="remove"
                             initial={{ opacity: 0, width: 0 }}
                             animate={{ opacity: 1, width: 'auto' }}
                             exit={{ opacity: 0, width: 0 }}
                             className="flex items-center space-x-1"
                           >
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                onRemoveUser(user.id)
                                setRemovingUserId(null);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1"/>
                              Remove
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRemovingUserId(null)}>
                               <X className="h-4 w-4"/>
                            </Button>
                           </motion.div>
                        ) : (
                           <motion.div
                            key="actions"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             className="flex items-center"
                           >
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="w-[110px] justify-between text-muted-foreground">
                                    {user.role === "viewer" && "Can view"}
                                    {user.role === "editor" && "Can edit"}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onSelect={() => onRoleChange(user.id, 'viewer')}>
                                    Can view
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onSelect={() => onRoleChange(user.id, 'editor')}>
                                    Can edit
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRemovingUserId(user.id)}>
                                 <X className="h-4 w-4"/>
                               </Button>
                           </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex items-center justify-between rounded-b-lg">
        <div className="flex items-center space-x-2 overflow-hidden">
          <Link2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground truncate">{fileUrl}</p>
        </div>
        <Button variant="secondary" onClick={handleCopyLink}>
          {copied ? (
            <Check className="h-4 w-4 mr-2 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? "Copied!" : "Copy link"}
        </Button>
      </CardFooter>
    </Card>
  );
};