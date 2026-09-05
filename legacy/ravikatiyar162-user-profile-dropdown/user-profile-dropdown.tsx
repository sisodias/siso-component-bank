import * as React from 'react';
import {
  MessageSquare,
  Phone,
  ExternalLink,
  Edit,
  Share2,
  Trash2,
  Move,
  CheckSquare,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from "../_utils/cn"; // Make sure to have a cn utility from shadcn
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

// Define the types for the props
interface UserProfile {
  name: string;
  handle: string;
  avatarUrl: string;
}

interface ActionItem {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

interface MenuItem {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  isDestructive?: boolean;
  hasArrow?: boolean;
}

interface UserProfileDropdownProps {
  user: UserProfile;
  actions: ActionItem[];
  menuItems: MenuItem[];
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ user, actions, menuItems }) => {
  const [isOpen, setIsOpen] = React.useState(true); // Default to open for storybook/demo
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  // Animation variants for the dropdown content
  const contentVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
        staggerChildren: 0.05,
      },
    },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
  };

  // Animation variants for each menu item
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      {/* The trigger for the dropdown, in a real app this might be the avatar itself */}
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer">
           <Avatar className="h-9 w-9">
             <AvatarImage src={user.avatarUrl} alt={user.name} />
             <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
           </Avatar>
           <div>
             <p className="text-sm font-medium text-foreground">{user.name}</p>
             <p className="text-xs text-muted-foreground">{user.handle}</p>
           </div>
        </div>
      </DropdownMenuTrigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent
            asChild
            forceMount
            className="w-64 p-2"
            align="start"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}
            >
              {/* Top section with user info */}
              <DropdownMenuLabel className="flex items-center gap-2 p-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.handle}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="mx-2" />
              
              {/* Quick actions section */}
              <DropdownMenuGroup>
                <div className="grid grid-cols-3 gap-1 p-1">
                  {actions.map((action) => (
                    <Button
                      key={action.label}
                      variant="ghost"
                      className="flex flex-col h-16 items-center justify-center gap-1 text-muted-foreground"
                      onClick={action.onClick}
                    >
                      <action.icon className="h-5 w-5" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="mx-2 mb-1" />

              {/* Main menu items section */}
              <DropdownMenuGroup>
                {menuItems.map((item) => (
                  <motion.div variants={itemVariants} key={item.label}>
                    <DropdownMenuItem
                      onMouseEnter={() => setHoveredItem(item.label)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={cn(
                        'flex items-center justify-between p-2 text-sm relative',
                        item.isDestructive && 'text-destructive focus:text-destructive-foreground focus:bg-destructive'
                      )}
                      onClick={item.onClick}
                    >
                      {hoveredItem === item.label && (
                         <motion.div
                          layoutId="dropdown-hover-bg"
                          className={cn(
                              "absolute inset-0 rounded-md -z-10",
                              item.isDestructive ? "bg-destructive/10" : "bg-muted"
                          )}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                         />
                      )}
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.hasArrow && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </DropdownMenuItem>
                  </motion.div>
                ))}
              </DropdownMenuGroup>
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
};