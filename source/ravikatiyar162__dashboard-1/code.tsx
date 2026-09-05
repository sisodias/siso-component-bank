import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Filter, Users, Clock, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils"; // Your utility for merging class names
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Type definitions for component props
interface ActivityStat {
  label: string;
  value: number; // Represents percentage
  color: string; // Tailwind color class e.g., 'bg-green-400'
}

interface TeamMember {
  id: string;
  name: string;
  avatarUrl: string;
}

interface MarketingDashboardProps {
  title?: string;
  teamActivities: {
    totalHours: number;
    stats: ActivityStat[];
  };
  team: {
    memberCount: number;
    members: TeamMember[];
  };
  cta: {
    text: string;
    buttonText: string;
    onButtonClick: () => void;
  };
  onFilterClick?: () => void;
  className?: string;
}

// Sub-component for animating numbers
const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest * 10) / 10); // Format to one decimal place

  React.useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

// Main Component
export const MarketingDashboard = React.forwardRef<
  HTMLDivElement,
  MarketingDashboardProps
>(({ 
  title = "Marketing Activities",
  teamActivities,
  team,
  cta,
  onFilterClick,
  className 
}, ref) => {
  
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const hoverTransition = { type: "spring", stiffness: 300, damping: 15 };

  return (
    <motion.div
      ref={ref}
      className={cn("w-full max-w-2xl p-6 bg-card text-card-foreground rounded-2xl border", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button variant="ghost" size="icon" onClick={onFilterClick} aria-label="Filter activities">
          <Filter className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Team Activities Card */}
        <motion.div 
          variants={itemVariants} 
          whileHover={{ scale: 1.03, y: -5 }} // Added for hover effect
          transition={hoverTransition} // Added for hover effect
        >
          <Card className="h-full p-4 overflow-hidden rounded-xl">
            <CardContent className="p-2">
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium text-muted-foreground">Team Activities</p>
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold">
                  <AnimatedNumber value={teamActivities.totalHours} />
                </span>
                <span className="ml-1 text-muted-foreground">hours</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 mb-2 overflow-hidden rounded-full bg-muted flex">
                {teamActivities.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className={cn("h-full", stat.color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {teamActivities.stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-1.5">
                    <span className={cn("w-2 h-2 rounded-full", stat.color)}></span>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Members Card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.03, y: -5 }} // Added for hover effect
          transition={hoverTransition} // Added for hover effect
        >
          <Card className="h-full p-4 overflow-hidden rounded-xl bg-lime-50 dark:bg-lime-900/30 border-lime-200 dark:border-lime-800">
            <CardContent className="p-2">
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium text-lime-900 dark:text-lime-200">Team</p>
                <Users className="w-5 h-5 text-lime-900 dark:text-lime-200" />
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-lime-950 dark:text-lime-50">
                   <AnimatedNumber value={team.memberCount} />
                </span>
                <span className="ml-1 text-lime-800 dark:text-lime-300">members</span>
              </div>
              {/* Avatar Stack */}
              <div className="flex -space-x-2">
                {team.members.slice(0, 4).map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.2, zIndex: 10, y: -2 }} // Added for hover effect
                  >
                    <Avatar className="border-2 border-lime-100 dark:border-lime-900">
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* CTA Banner */}
      <motion.div 
        variants={itemVariants} 
        whileHover={{ scale: 1.02 }} // Added for hover effect
        transition={hoverTransition} // Added for hover effect
        className="mt-4"
      >
         <div className="flex items-center justify-between p-4 rounded-xl bg-muted/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-background">
                  <Zap className="w-5 h-5 text-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{cta.text}</p>
            </div>
            <Button onClick={cta.onButtonClick} className="shrink-0">
                {cta.buttonText}
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
         </div>
      </motion.div>
    </motion.div>
  );
});

MarketingDashboard.displayName = "MarketingDashboard";