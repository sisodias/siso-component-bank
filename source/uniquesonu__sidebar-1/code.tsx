import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Home, Users, Settings, BarChart3, ChevronLeft, LayoutDashboard, Database,
} from 'lucide-react';

// Define the icon type.
type IconType = React.ElementType | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

// --- Internal Data Structure ---
export interface NavItem {
  key: string;
  label: string;
  icon: IconType;
  href: string;
  isActive?: boolean;
}

// --- 📦 API (Props) Definition ---
export interface CollapsibleSidebarProps {
  /** Array of navigation links to display in the sidebar. */
  navItems: NavItem[];
  /** Callback for when a navigation item is clicked. */
  onNavigate: (key: string) => void;
  /** Initial state of the sidebar. Defaults to true (open). */
  defaultOpen?: boolean;
  /** Optional header/logo element for the top of the sidebar. */
  headerContent?: React.ReactNode;
  /** Optional footer content (e.g., user info) at the bottom. */
  footerContent?: React.ReactNode;
  /** Optional class name for the main container. */
  className?: string;
}

/**
 * A professional, animated collapsible sidebar for admin dashboards.
 * Uses Framer Motion to smoothly transition between open and collapsed states.
 */
const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  navItems,
  onNavigate,
  defaultOpen = true,
  headerContent,
  footerContent,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Framer Motion configuration for width animation
  const sidebarVariants = useMemo(() => ({
    open: {
      width: 240, // Wide state
      transition: { type: "spring", stiffness: 350, damping: 30 },
    },
    closed: {
      width: 64, // Narrow state (icon width)
      transition: { type: "spring", stiffness: 400, damping: 40 },
    },
  }), []);

  // Framer Motion configuration for text content visibility
  const contentVariants = useMemo(() => ({
    open: { opacity: 1, x: 0, display: "block", transition: { delay: 0.15 } },
    closed: { opacity: 0, x: -20, display: "none", transition: { duration: 0.1 } },
  }), []);


  return (
    <motion.nav
      initial={defaultOpen ? "open" : "closed"}
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className={cn(
        "flex flex-col h-screen border-r bg-card text-card-foreground shadow-xl sticky top-0 z-40 transition-shadow duration-300",
        className
      )}
      role="navigation"
      aria-expanded={isOpen}
      aria-label="Main Dashboard Navigation"
    >
      {/* 1. Header (Logo/Title) */}
      <div className="flex items-center p-4 h-16 shrink-0 border-b">
        {headerContent ? (
          <motion.div variants={contentVariants} className="text-lg font-bold whitespace-nowrap overflow-hidden">
            {headerContent}
          </motion.div>
        ) : (
          <motion.h1 className="text-lg font-bold whitespace-nowrap overflow-hidden" variants={contentVariants}>
            App Dashboard
          </motion.h1>
        )}
        {!isOpen && <LayoutDashboard className="h-6 w-6 text-primary shrink-0" />}
      </div>

      {/* 2. Navigation Links */}
      <div className="flex-grow overflow-y-auto pt-2 space-y-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={item.key}
              className="px-2"
              // No animation here, let the parent layout handle it
            >
              <Button
                variant={item.isActive ? "secondary" : "ghost"}
                size="lg"
                onClick={() => onNavigate(item.key)}
                className={cn(
                  "w-full h-10 justify-start transition-colors duration-150 rounded-lg",
                  item.isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50",
                  !isOpen && "justify-center px-0 w-10 mx-auto"
                )}
                aria-current={item.isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <IconComponent className="h-5 w-5 shrink-0" aria-hidden="true" />
                <motion.span
                  variants={contentVariants}
                  className="ml-3 font-medium whitespace-nowrap overflow-hidden text-sm"
                >
                  {item.label}
                </motion.span>
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Footer (Toggle Button & User Info) */}
      <div className="p-2 border-t shrink-0">
        {footerContent && (
          <motion.div variants={contentVariants} className="px-2 py-1 text-sm text-muted-foreground whitespace-nowrap overflow-hidden">
            {footerContent}
          </motion.div>
        )}
        <Separator className="my-2" />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full h-10 transition-transform duration-300 rounded-lg",
            isOpen ? "w-full" : "w-10"
          )}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-5 w-5 transition-transform duration-300",
              !isOpen && "rotate-180" // Rotate the icon when closed
            )}
            aria-hidden="true"
          />
          <motion.span
            variants={contentVariants}
            className="ml-2 font-medium text-sm"
          >
            Collapse
          </motion.span>
        </Button>
      </div>
    </motion.nav>
  );
};


const mockNavItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: '#dashboard', isActive: true },
  { key: 'analytics', label: 'Analytics', icon: BarChart3, href: '#analytics' },
  { key: 'users', label: 'User Management', icon: Users, href: '#users' },
  { key: 'data', label: 'Database Status', icon: Database, href: '#data' },
  { key: 'settings', label: 'Settings', icon: Settings, href: '#settings' },
];

const ExampleLayout = () => {
  const [activeKey, setActiveKey] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNavigate = (key: string) => {
    setActiveKey(key);
    console.log(`Navigating to: ${key}`);
  };
  
  // Update the isActive state for the navigation items
  const itemsWithActive = mockNavItems.map(item => ({
    ...item,
    isActive: item.key === activeKey,
  }));

  return (
    <div className="flex bg-background min-h-screen">
      {/* Sidebar - Note: We override defaultOpen for better demo control */}
      <CollapsibleSidebar
        navItems={itemsWithActive}
        onNavigate={handleNavigate}
        defaultOpen={sidebarOpen}
        headerContent="Enterprise App"
        footerContent="v2.1.0"
        // The component manages its own open state, but we can manage the default
      />

      {/* Main Content Area - Expands when sidebar collapses */}
      <div className="flex-grow p-8 transition-all duration-300">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Content for: {activeKey.charAt(0).toUpperCase() + activeKey.slice(1)}
        </h1>
        <div className="h-[200vh] bg-muted/50 p-6 rounded-lg text-muted-foreground">
          Your dashboard tables, charts, and content go here.
          Scroll down to see the fixed sidebar in action.
        </div>
      </div>
    </div>
  );
};

export default ExampleLayout;