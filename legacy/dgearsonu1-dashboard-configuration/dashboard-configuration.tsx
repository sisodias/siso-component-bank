import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "../_utils/cn";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./card";
import { Settings, LayoutGrid, RotateCcw } from 'lucide-react';
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";

// Note: This component requires 'framer-motion'.

// --- Internal Data Structure ---
export interface DashboardWidget {
  /** Unique key for the widget (used for toggling). */
  id: string;
  /** Display title of the widget. */
  title: string;
  /** Brief description of the widget. */
  description: string;
  /** If true, the widget cannot be hidden. */
  isPermanent?: boolean;
}

// --- 📦 API (Props) Definition ---
export interface DashboardLayoutConfiguratorProps {
  /** Array of all available widgets. */
  availableWidgets: DashboardWidget[];
  /** Array of IDs of widgets currently visible/selected. */
  visibleWidgetIds: string[];
  /** Callback when widget visibility changes. */
  onVisibilityChange: (newVisibleIds: string[]) => void;
  /** Callback to restore the entire dashboard layout to default. */
  onLayoutReset: () => void;
  /** Optional class name for the card container. */
  className?: string;
}

/**
 * An animated control panel for managing dashboard layout and widget visibility.
 * Ideal for power users who need customization options.
 */
const DashboardLayoutConfigurator: React.FC<DashboardLayoutConfiguratorProps> = ({
  availableWidgets,
  visibleWidgetIds,
  onVisibilityChange,
  onLayoutReset,
  className,
}) => {
  const isWidgetVisible = (id: string) => visibleWidgetIds.includes(id);

  const handleToggleWidget = (widget: DashboardWidget, isChecked: boolean) => {
    if (widget.isPermanent) return;

    const newVisibleIds = isChecked
      ? [...visibleWidgetIds, widget.id]
      : visibleWidgetIds.filter(id => id !== widget.id);

    onVisibilityChange(newVisibleIds);
  };
  
  // Framer Motion variants for widget list items
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  };
  
  // Framer Motion variants for buttons
  const buttonVariants = {
    tap: { scale: 0.98 },
  };

  return (
    <Card className={cn("w-full max-w-lg mx-auto shadow-xl", className)}>
      <CardHeader className="p-6 border-b">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center">
          <LayoutGrid className="h-6 w-6 mr-3 text-primary" />
          Dashboard Configuration
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          Toggle widget visibility and manage your dashboard layout settings.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <h3 className="text-lg font-semibold text-foreground px-6 pt-6 pb-2">
          Widget Visibility
        </h3>
        
        <ScrollArea className="h-[300px] px-6">
          <AnimatePresence initial={false}>
            <motion.div
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                initial="hidden"
                animate="visible"
                className="space-y-4 py-2"
            >
              {availableWidgets.map((widget) => (
                <motion.div
                  key={widget.id}
                  variants={itemVariants}
                  exit="exit"
                  className={cn(
                    "flex items-start space-x-3 p-2 rounded-lg transition-colors duration-150",
                    isWidgetVisible(widget.id) ? "hover:bg-muted/70" : "opacity-70 hover:bg-muted/50"
                  )}
                >
                  <div className="pt-1">
                      <Checkbox
                        id={`widget-${widget.id}`}
                        checked={isWidgetVisible(widget.id)}
                        onCheckedChange={(checked: boolean) => handleToggleWidget(widget, checked)}
                        disabled={widget.isPermanent}
                        className={cn(
                            widget.isPermanent && "bg-primary border-primary",
                            widget.isPermanent ? "opacity-100 cursor-not-allowed" : "cursor-pointer"
                        )}
                      />
                  </div>
                  
                  <label
                    htmlFor={`widget-${widget.id}`}
                    className={cn(
                      "flex flex-col text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                      widget.isPermanent && "text-primary/90"
                    )}
                  >
                    <span className="text-foreground">{widget.title}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{widget.description}</span>
                  </label>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </ScrollArea>
      </CardContent>

      <div className="p-6 pt-4 border-t">
        <motion.div whileTap="tap" variants={buttonVariants}>
            <Button
              onClick={onLayoutReset}
              variant="outline"
              className="w-full text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors duration-150"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Layout to Default
            </Button>
        </motion.div>
      </div>
    </Card>
  );
};



const mockWidgets: DashboardWidget[] = [
  { id: 'metrics', title: 'Key Metrics', description: 'Overall performance indicators.', isPermanent: true },
  { id: 'activity', title: 'Recent Activity', description: 'Chronological feed of user actions.' },
  { id: 'charts', title: 'Usage Charts', description: 'Time-series usage visualization.' },
  { id: 'tasks', title: 'Pending Tasks', description: 'Your assigned open items.' },
  { id: 'config', title: 'Server Configuration', description: 'Low-level server health data.' },
  { id: 'tickets', title: 'Support Tickets', description: 'Live count of open support tickets.' },
];

const ExampleUsage = () => {
  const defaultVisible = mockWidgets.filter(w => w.isPermanent || w.id === 'activity' || w.id === 'charts').map(w => w.id);
  const [visibleIds, setVisibleIds] = useState<string[]>(defaultVisible);

  const handleVisibilityChange = (newIds: string[]) => {
    setVisibleIds(newIds);
    console.log("New Visible Widgets:", newIds);
  };

  const handleLayoutReset = () => {
    const defaultIds = mockWidgets.filter(w => w.isPermanent).map(w => w.id);
    setVisibleIds(defaultIds);
    alert("Layout reset applied! Only permanent widgets are now visible.");
  };

  return (
    <div className="p-8 bg-background border rounded-lg max-w-2xl mx-auto shadow-md">
      <h3 className="text-xl font-semibold text-foreground mb-6">Dashboard Layout Control Demo</h3>
      
      <DashboardLayoutConfigurator
        availableWidgets={mockWidgets}
        visibleWidgetIds={visibleIds}
        onVisibilityChange={handleVisibilityChange}
        onLayoutReset={handleLayoutReset}
      />

      <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <p>
          Currently Visible Widgets ({visibleIds.length}): <strong className="text-foreground">{visibleIds.join(', ')}</strong>
        </p>
        <p className="mt-2 text-xs">
            "Key Metrics" is permanent and cannot be unchecked.
        </p>
      </div>
    </div>
  );
};

export default ExampleUsage;