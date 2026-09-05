// 1. Import Dependencies
import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from "../_utils/cn"; // Make sure you have this utility function

// 2. Define Prop Types
interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isSeparator?: boolean; // Optional separator for grouping items
}

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

interface UserProfileSidebarProps {
  user: UserProfile;
  navItems: NavItem[];
  logoutItem: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  };
  className?: string;
}

// 3. Define Animation Variants
const sidebarVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// 4. Create the Component
export const UserProfileSidebar = React.forwardRef<HTMLDivElement, UserProfileSidebarProps>(
  ({ user, navItems, logoutItem, className }, ref) => {
    return (
      <motion.aside
        ref={ref}
        className={cn(
          'flex h-full w-full max-w-xs flex-col rounded-xl border bg-card p-4 text-card-foreground shadow-sm',
          className
        )}
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        aria-label="User Profile Menu"
      >
        {/* User Info Header */}
        <motion.div variants={itemVariants} className="flex items-center space-x-4 p-2">
          <img
            src={user.avatarUrl}
            alt={`${user.name}'s avatar`}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="flex flex-col truncate">
            <span className="font-semibold text-lg">{user.name}</span>
            <span className="text-sm text-muted-foreground truncate">{user.email}</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="my-4 border-t border-border" />

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1" role="navigation">
          {navItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.isSeparator && <motion.div variants={itemVariants} className="h-6" />}
              <motion.a
                href={item.href}
                variants={itemVariants}
                className="group flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="mr-3 h-5 w-5">{item.icon}</span>
                <span>{item.label}</span>
                <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.a>
            </React.Fragment>
          ))}
        </nav>

        {/* Logout Button */}
        <motion.div variants={itemVariants} className="mt-4">
          <button
            onClick={logoutItem.onClick}
            className="group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <span className="mr-3 h-5 w-5">{logoutItem.icon}</span>
            <span>{logoutItem.label}</span>
          </button>
        </motion.div>
      </motion.aside>
    );
  }
);

UserProfileSidebar.displayName = 'UserProfileSidebar';