import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, User, Settings, Lock, FileText, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Note: This component requires 'framer-motion'.

// --- Internal Configuration ---
type LogLevel = 'info' | 'warning' | 'error' | 'success';

interface LogIconMap {
  icon: React.ElementType;
  colorClass: string;
}

const LOG_ICON_MAP: Record<LogLevel, LogIconMap> = {
  info: { icon: ArrowRight, colorClass: "text-blue-500" },
  warning: { icon: AlertCircle, colorClass: "text-yellow-500" },
  error: { icon: Lock, colorClass: "text-red-500" },
  success: { icon: CheckCircle, colorClass: "text-green-500" },
};

// --- 📦 API (Props) Definition ---
export interface LogEntry {
  /** Unique ID for the log entry. */
  id: string;
  /** The descriptive message of the action (e.g., "User credentials updated"). */
  message: string;
  /** The user or system component responsible for the action. */
  actor: string;
  /** The time the action occurred (formatted string). */
  timestamp: string;
  /** The severity or type of the log entry. */
  level: LogLevel;
}

export interface AuditLogViewerProps {
  /** Array of log entries to display. */
  logs: LogEntry[];
  /** Optional class name for the main card container. */
  className?: string;
}

/**
 * An animated audit log viewer that displays system activities in a clean, chronological feed.
 * Uses Framer Motion for subtle entry/exit animations of individual log items.
 */
const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  logs,
  className,
}) => {
  // Framer Motion variants for individual list items
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05, // Stagger effect on mount
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    }),
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Audit Log</CardTitle>
        <CardDescription>Chronological feed of all system and user actions.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {logs.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-sm">
            No recent audit events recorded.
          </div>
        ) : (
          <motion.div layout className="divide-y divide-border">
            <AnimatePresence initial={true}>
              {logs.map((log, index) => {
                const { icon: LogIcon, colorClass } = LOG_ICON_MAP[log.level] || LOG_ICON_MAP.info;

                return (
                  <motion.div
                    key={log.id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors duration-200"
                  >
                    {/* Icon/Timeline Dot */}
                    <div className={cn("mt-1 flex-shrink-0", colorClass)}>
                      <LogIcon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    
                    {/* Log Details */}
                    <div className="flex-grow flex flex-col">
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {log.message}
                      </p>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {log.actor}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {log.timestamp}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </CardContent>
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full">Load More Logs</Button>
      </div>
    </Card>
  );
};


const initialLogs: LogEntry[] = [
  { id: "a1", message: "User John Doe logged in successfully.", actor: "User: JohnDoe", timestamp: "3 minutes ago", level: 'success' },
  { id: "a2", message: "Database sync job failed due to connection timeout.", actor: "System: Cron", timestamp: "10 minutes ago", level: 'error' },
  { id: "a3", message: "Global settings updated.", actor: "Admin: Alice", timestamp: "25 minutes ago", level: 'warning' },
  { id: "a4", message: "New report 'Q3 Financials' created.", actor: "User: JohnDoe", timestamp: "1 hour ago", level: 'info' },
  { id: "a5", message: "Password policy changed by Root user.", actor: "System: Auth", timestamp: "3 hours ago", level: 'error' },
];

const ExampleUsage = () => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);

  // Simulate adding a new log entry
  const addLog = () => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      message: "API key regenerated successfully.",
      actor: "Admin: Alice",
      timestamp: "Just now",
      level: 'success',
    };
    // Add to the top of the feed
    setLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="p-8 bg-background border rounded-lg max-w-lg mx-auto shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-foreground">Audit Feed Demo</h3>
        <Button onClick={addLog} size="sm">
            Add New Event
        </Button>
      </div>
      
      <AuditLogViewer logs={logs} />
      
      <p className="mt-4 text-sm text-muted-foreground">
        (Click "Add New Event" to see a new log item animate in at the top.)
      </p>
    </div>
  );
};

export default ExampleUsage; 