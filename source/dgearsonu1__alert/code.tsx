import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Mail, Check, Bell, X, AlertTriangle, Settings, FileText } from 'lucide-react';

// Note: This component requires 'framer-motion'.

// --- Internal Data Structure ---
export interface NotificationItem {
  /** Unique ID for the notification. */
  id: string;
  /** The icon representing the notification type. */
  icon: React.ElementType;
  /** The main message/title of the notification. */
  title: string;
  /** The time the notification occurred (formatted string). */
  timestamp: string;
  /** Whether the notification has been read. */
  isRead: boolean;
  /** Optional color class for the icon. */
  iconColorClass?: string;
}

// --- 📦 API (Props) Definition ---
export interface NotificationCenterProps {
  /** Array of notification items. */
  notifications: NotificationItem[];
  /** Callback when an item's read status is toggled. */
  onToggleRead: (id: string, isRead: boolean) => void;
  /** Callback to clear all notifications (or all read ones). */
  onClearAll: () => void;
  /** Optional class name for the main card container. */
  className?: string;
  /** Maximum height for the scrollable notification list. */
  maxHeightClass?: string;
}

/**
 * An animated, tabbed notification center for displaying and managing system alerts.
 * Uses Framer Motion for dynamic list updates.
 */
const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onToggleRead,
  onClearAll,
  className,
  maxHeightClass = "h-[450px]",
}) => {
  const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread');

  const filteredNotifications = useMemo(() => {
    return activeTab === 'unread'
      ? notifications.filter(n => !n.isRead)
      : notifications;
  }, [notifications, activeTab]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Framer Motion variants for individual list items
  const itemVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center space-x-2">
          <Bell className="h-5 w-5 text-primary" />
          <span>Alerts ({unreadCount})</span>
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearAll} 
          disabled={notifications.length === 0}
          className="transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive"
        >
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'unread' | 'all')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b h-auto p-0">
            <TabsTrigger value="unread" className="rounded-none font-semibold text-sm">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="all" className="rounded-none font-semibold text-sm">
              All
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0 pt-0">
            <ScrollArea className={cn("w-full", maxHeightClass)}>
              <motion.div layout className="divide-y divide-border">
                <AnimatePresence initial={false}>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => {
                      const IconComponent = notification.icon;
                      return (
                        <motion.div
                          key={notification.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          className={cn(
                            "flex items-start gap-3 p-4 transition-colors duration-200",
                            notification.isRead ? "bg-muted/10 text-muted-foreground" : "hover:bg-muted/30"
                          )}
                        >
                          {/* Icon */}
                          <div className={cn(
                            "flex-shrink-0 p-1 rounded-full mt-0.5",
                            notification.iconColorClass || (notification.isRead ? "text-muted-foreground" : "text-primary/80")
                          )}>
                            <IconComponent className="h-4 w-4" aria-hidden="true" />
                          </div>
                          
                          {/* Message and Timestamp */}
                          <div className="flex-grow flex flex-col min-w-0">
                            <p className={cn(
                                "text-sm font-medium leading-tight",
                                notification.isRead ? "text-muted-foreground" : "text-foreground"
                            )}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {notification.timestamp}
                            </p>
                          </div>
                          
                          {/* Action Button */}
                          <div className="flex-shrink-0 ml-auto pt-0.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onToggleRead(notification.id, !notification.isRead)}
                              className={cn(
                                "h-6 w-6 text-muted-foreground/70 transition-colors duration-150 p-0",
                                !notification.isRead && "text-primary hover:text-primary/80"
                              )}
                              aria-label={notification.isRead ? "Mark as unread" : "Mark as read"}
                            >
                              {notification.isRead ? <Mail className="h-3.5 w-3.5" /> : <Check className="h-4 w-4" />}
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-muted-foreground text-sm">
                      {activeTab === 'unread' ? "All caught up! No unread notifications." : "The notification list is empty."}
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};


const initialNotifications: NotificationItem[] = [
  { id: "n1", icon: AlertTriangle, title: "Critical: Database connection lost.", timestamp: "5 min ago", isRead: false, iconColorClass: "text-red-500" },
  { id: "n2", icon: Check, title: "Deployment v2.3 completed successfully.", timestamp: "1 hour ago", isRead: false, iconColorClass: "text-green-500" },
  { id: "n3", icon: Settings, title: "Security policy updated by Admin.", timestamp: "3 hours ago", isRead: true },
  { id: "n4", icon: FileText, title: "New report 'Q4 Projections' generated.", timestamp: "1 day ago", isRead: false },
];

const ExampleUsage = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const handleToggleRead = (id: string, isRead: boolean) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleAddNotification = () => {
    const newId = (Date.now()).toString();
    const newNotif: NotificationItem = {
      id: newId,
      icon: Bell,
      title: "System status check initiated.",
      timestamp: "Just now",
      isRead: false,
      iconColorClass: "text-blue-500"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <div className="p-8 bg-background border rounded-lg max-w-xl mx-auto shadow-md">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNotification} size="sm" variant="outline">
          Simulate New Alert
        </Button>
      </div>
      
      <NotificationCenter
        notifications={notifications}
        onToggleRead={handleToggleRead}
        onClearAll={handleClearAll}
      />
      
      <p className="mt-4 text-sm text-muted-foreground">
        Note: Use the toggle button on each item to mark as read/unread, and switch tabs to see items disappear/reappear with smooth animations.
      </p>
    </div>
  );
};

export default ExampleUsage;