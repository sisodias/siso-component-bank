import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, X, ExternalLink } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming shadcn/ui ScrollArea

// Note: This component requires 'framer-motion'.

// --- 📦 API (Props) Definition ---
export interface ContextualHelpSidebarProps {
  /** The title of the help content (e.g., "Dashboard Metrics Guide"). */
  title: string;
  /** The main content to display in the sidebar (can be complex React nodes). */
  children: React.ReactNode;
  /** Optional external link URL for full documentation. */
  externalDocUrl?: string;
  /** Optional class name for the sidebar container. */
  className?: string;
  /** Width of the sidebar when open (Tailwind class, e.g., 'w-80'). */
  openWidthClass?: string;
}

/**
 * An accessible and animated help sidebar for dashboards, providing contextual documentation
 * without requiring the user to leave the page. Uses Framer Motion for slide transition.
 */
const ContextualHelpSidebar: React.FC<ContextualHelpSidebarProps> = ({
  title,
  children,
  externalDocUrl,
  className,
  openWidthClass = 'w-80',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Framer Motion variants for the slide animation
  const sidebarVariants = {
    hidden: { x: '100%', opacity: 0, transition: { type: 'tween', duration: 0.3 } },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <>
      {/* Trigger Button (Fixed position) */}
      <Button
        onClick={() => setIsOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-shadow duration-200 hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-primary/50"
        aria-label="Open contextual help"
      >
        <HelpCircle className="h-6 w-6" aria-hidden="true" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="help-sidebar"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            className={cn(
              "fixed top-0 right-0 h-full bg-card shadow-2xl z-[60] flex flex-col border-l border-border",
              openWidthClass,
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-sidebar-title"
          >
            {/* Header */}
            <header className="p-4 flex items-center justify-between border-b shrink-0">
              <h2 id="help-sidebar-title" className="text-xl font-semibold text-foreground truncate">
                {title}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:bg-muted"
                aria-label="Close help sidebar"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </header>

            {/* Content Area */}
            <ScrollArea className="flex-grow p-4">
              {children}
            </ScrollArea>
            
            {/* Footer / External Link */}
            {externalDocUrl && (
                <footer className="p-4 border-t shrink-0">
                    <Button
                        variant="outline"
                        className="w-full text-sm font-medium"
                        asChild
                    >
                        <a href={externalDocUrl} target="_blank" rel="noopener noreferrer">
                            Full Documentation
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </footer>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};


const DocumentationContent: React.FC = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">
      This sidebar provides context-specific guidance for the current view. Use it to quickly understand metrics, troubleshoot errors, or find best practices.
    </p>
    <ul className="list-disc list-inside space-y-2 text-sm text-foreground/80">
      <li>**Metrics:** All values are refreshed every 60 seconds.</li>
      <li>**Filters:** Filters applied on the table are global to all metric cards.</li>
      <li>**Permissions:** Only Administrators can view the database status panel.</li>
    </ul>
    <h4 className="text-md font-semibold mt-6 text-foreground">Need More Help?</h4>
    <p className="text-xs text-muted-foreground">
      Check the external link below for our comprehensive knowledge base.
    </p>
  </div>
);

const ExampleUsage = () => {
  return (
    <div className="p-8 bg-background min-h-[100vh]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-foreground">
          Admin Dashboard Content Area
        </h1>
        <p className="text-muted-foreground mb-4">
            The help button is fixed to the bottom-right corner. Click the <HelpCircle className="inline h-4 w-4" /> icon to open the contextual sidebar.
        </p>
        <div className="h-[700px] border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            Your main dashboard content goes here (e.g., tables, charts).
        </div>
      </div>
      
      {/* The component is placed at the root level */}
      <ContextualHelpSidebar
        title="Dashboard Overview Guide"
        externalDocUrl="https://docs.yourcompany.com/dashboard-guide"
        openWidthClass="w-96" // Example of customizing width
      >
        <DocumentationContent />
      </ContextualHelpSidebar>
    </div>
  );
};

export default ExampleUsage;