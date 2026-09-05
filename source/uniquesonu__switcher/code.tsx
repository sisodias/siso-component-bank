import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Globe, Check, AlertTriangle, ChevronDown, Server } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Note: This component requires 'framer-motion'.

// --- Internal Data Structure ---
export interface Environment {
  /** The unique key for the environment (e.g., 'prod', 'staging'). */
  key: string;
  /** The display name. */
  name: string;
  /** The status level ('safe' for production, 'warning' for others). */
  status: 'safe' | 'warning' | 'danger';
}

// --- Internal Configuration ---
const STATUS_MAP: Record<Environment['status'], { icon: React.ElementType, classNames: string }> = {
  safe: {
    icon: Check,
    classNames: "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20",
  },
  warning: {
    icon: AlertTriangle,
    classNames: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  },
  danger: {
    icon: AlertTriangle,
    classNames: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
  },
};

// --- 📦 API (Props) Definition ---
export interface EnvironmentSwitcherProps {
  /** Array of available environments. */
  environments: Environment[];
  /** The key of the currently active environment. */
  activeKey: string;
  /** Callback when a new environment is selected. */
  onSwitch: (key: string) => void;
  /** Optional class name for the trigger container. */
  className?: string;
}

/**
 * An animated component for switching between different application environments (Prod, Staging, Dev).
 * Provides clear visual warnings for non-production environments.
 */
const EnvironmentSwitcher: React.FC<EnvironmentSwitcherProps> = ({
  environments,
  activeKey,
  onSwitch,
  className,
}) => {
  const activeEnv = useMemo(() => 
    environments.find(e => e.key === activeKey) || environments[0], 
    [environments, activeKey]
  );
  
  const statusConfig = STATUS_MAP[activeEnv?.status || 'safe'];
  const StatusIcon = statusConfig.icon;
  const isProd = activeEnv.key === 'prod' || activeEnv.key === 'production';

  // Framer Motion variants for the trigger button
  const triggerVariants = {
    hover: { scale: 1.01 },
    tap: { scale: 0.98 },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          variants={triggerVariants}
          whileHover="hover"
          whileTap="tap"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all duration-150 shadow-sm",
            isProd ? "bg-card hover:bg-muted/50" : "bg-red-500/10 border-red-500/30 hover:bg-red-500/20", // Prominent warning for non-prod
            className
          )}
          aria-label={`Current environment: ${activeEnv.name}. Click to switch.`}
        >
          <Globe className={cn("h-4 w-4 shrink-0", isProd ? "text-primary" : statusConfig.classNames)} aria-hidden="true" />
          
          <span className={cn(
            "text-sm font-semibold truncate",
            isProd ? "text-foreground" : "text-red-600 dark:text-red-400"
          )}>
            {activeEnv.name}
          </span>
          
          <ChevronDown className={cn("h-3 w-3 shrink-0 ml-1 text-muted-foreground", !isProd && "text-red-500")} aria-hidden="true" />
        </motion.div>
      </DropdownMenuTrigger>
      
      {/* Framer Motion is inherited by the DropdownMenuContent for subtle fade-in */}
      <DropdownMenuContent align="end" className="w-64 p-1">
        <DropdownMenuLabel className="text-sm font-semibold text-muted-foreground">
          Select Environment
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {environments.map((env) => {
          const envStatusConfig = STATUS_MAP[env.status];
          const EnvIcon = envStatusConfig.icon;
          const isActive = env.key === activeKey;

          return (
            <DropdownMenuItem
              key={env.key}
              onClick={() => onSwitch(env.key)}
              className={cn(
                "flex items-center justify-between cursor-pointer transition-colors duration-100 p-2",
                isActive && "bg-accent text-accent-foreground",
                env.status === 'danger' && "text-red-600 dark:text-red-400"
              )}
            >
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="font-medium">{env.name}</span>
              </div>
              
              <Badge
                variant="outline"
                className={cn("text-xs font-medium border", envStatusConfig.classNames)}
              >
                <EnvIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                {env.status.charAt(0).toUpperCase() + env.status.slice(1)}
              </Badge>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};



const mockEnvironments: Environment[] = [
  { key: 'prod', name: 'Production', status: 'safe' },
  { key: 'staging', name: 'Staging (QA)', status: 'warning' },
  { key: 'dev', name: 'Development', status: 'danger' },
  { key: 'sandbox', name: 'Sandbox', status: 'warning' },
];

const ExampleUsage = () => {
  const [activeEnvKey, setActiveEnvKey] = useState('prod');

  const handleSwitch = (key: string) => {
    setActiveEnvKey(key);
    console.log(`Switched to environment: ${key}`);
    // In a real application, you would re-initialize data or redirect based on the new environment key
  };

  return (
    <div className="p-8 bg-background border rounded-lg max-w-5xl mx-auto shadow-md">
      <h3 className="text-xl font-semibold text-foreground mb-6">Environment Switcher Demo (Dashboard Header Element)</h3>
      
      <div className="flex justify-center">
        <EnvironmentSwitcher
          environments={mockEnvironments}
          activeKey={activeEnvKey}
          onSwitch={handleSwitch}
        />
      </div>

      <p className="mt-8 text-sm text-muted-foreground text-center">
        Current Active Environment: <strong className="text-foreground font-bold">{activeEnvKey.toUpperCase()}</strong>.
        <br/> (Note the visual warning when switching to Staging, Dev, or Sandbox.)
      </p>
    </div>
  );
};

export default ExampleUsage; 