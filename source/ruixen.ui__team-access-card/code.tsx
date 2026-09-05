"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "Admin" | "Editor" | "Viewer";
}

export interface TeamAccessCardProps {
  title: string;
  description?: string;
  members: Member[];
  onInvite: (email: string, role: Member["role"]) => void;
  onRoleChange: (memberId: string, newRole: Member["role"]) => void;
  onDelete: (memberId: string) => void;
  className?: string;
}

export const TeamAccessCard = ({
  title,
  description,
  members,
  onInvite,
  onRoleChange,
  onDelete,
  className,
}: TeamAccessCardProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<Member["role"]>("Viewer");

  const handleInvite = () => {
    if (inviteEmail) {
      onInvite(inviteEmail, inviteRole);
      setInviteEmail("");
      setIsOpen(false);
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <Card className={cn("max-w-lg w-full p-5 shadow-sm", className)}>
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4 p-0 mb-4">
        <AnimatePresence>
          {members.map((m, i) => (
            <motion.div
              key={m.id}
              custom={i}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="flex items-center justify-between border-b pb-3"
            >
              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={m.avatar} alt={m.name} />
                  <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
              </div>

              {/* Right: Role Selector + Delete */}
              <div className="flex items-center gap-2">
                <Select
                  value={m.role}
                  onValueChange={(role: Member["role"]) => onRoleChange(m.id, role)}
                >
                  <SelectTrigger className="w-[110px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-red-500"
                  onClick={() => onDelete(m.id)}
                  aria-label={`Remove ${m.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>

      <CardFooter className="p-0">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full">
              + Invite Member
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-6">
            <DrawerHeader>
              <DrawerTitle>Invite a new member</DrawerTitle>
            </DrawerHeader>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Select
                value={inviteRole}
                onValueChange={(role: Member["role"]) => setInviteRole(role)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DrawerFooter className="pt-4">
              <Button onClick={handleInvite} className="w-full">
                Send Invite
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardFooter>
    </Card>
  );
};
