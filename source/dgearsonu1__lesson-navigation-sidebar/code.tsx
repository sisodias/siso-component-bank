import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronDown, Lock, CheckCircle, PlayCircle, Clock } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

// Note: This component requires 'framer-motion'.

// --- Internal Data Structure ---
export type LessonStatus = 'completed' | 'current' | 'locked' | 'unlocked';

export interface LessonItem {
  /** Unique ID for the lesson. */
  id: string;
  /** Title of the lesson. */
  title: string;
  /** Current status of the lesson. */
  status: LessonStatus;
  /** Optional time duration (e.g., "15 min"). */
  duration?: string;
}

export interface ModuleItem {
  /** Unique ID for the module. */
  id: string;
  /** Title of the module. */
  title: string;
  /** Array of nested lessons. */
  lessons: LessonItem[];
}

// --- Internal Component: Lesson Item ---

interface NavLessonProps {
  lesson: LessonItem;
  onSelect: (lessonId: string) => void;
  isCollapsed: boolean;
}

const NavLesson: React.FC<NavLessonProps> = React.memo(({ lesson, onSelect, isCollapsed }) => {
  const isCurrent = lesson.status === 'current';
  const isCompleted = lesson.status === 'completed';
  const isLocked = lesson.status === 'locked';

  const handleClick = () => {
    if (!isLocked) {
      onSelect(lesson.id);
    }
  };

  const statusMap = {
    completed: { icon: CheckCircle, class: "text-green-500" },
    current: { icon: PlayCircle, class: "text-primary" },
    locked: { icon: Lock, class: "text-muted-foreground/60" },
    unlocked: { icon: Clock, class: "text-muted-foreground" },
  };
  
  const { icon: StatusIcon, class: statusClass } = statusMap[lesson.status];

  // Framer Motion variants for fade-in/out during collapse
  const itemVariants = {
    hidden: { opacity: 0, height: 0, padding: '0 1rem' },
    visible: { opacity: 1, height: 'auto', padding: '0.5rem 1rem', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, height: 0, padding: '0 1rem', transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      key={lesson.id}
      variants={itemVariants}
      initial={isCollapsed ? "hidden" : "visible"}
      animate="visible"
      exit="exit"
      layout
      className={cn(
        "flex items-center justify-between py-2 px-4 text-sm rounded-lg transition-colors duration-150 cursor-pointer",
        isLocked ? "opacity-60 cursor-not-allowed" : "hover:bg-muted/70",
        isCurrent && "bg-accent text-accent-foreground font-semibold hover:bg-accent"
      )}
      onClick={handleClick}
      role="listitem"
      aria-current={isCurrent ? "true" : undefined}
      aria-disabled={isLocked}
    >
      <div className="flex items-center min-w-0 pr-2">
        <StatusIcon className={cn("h-4 w-4 mr-2 shrink-0", statusClass)} aria-hidden="true" />
        <span className="truncate">{lesson.title}</span>
      </div>
      
      {lesson.duration && (
        <span className="text-xs text-muted-foreground shrink-0">{lesson.duration}</span>
      )}
    </motion.div>
  );
});

NavLesson.displayName = "NavLesson";

// --- Internal Component: Module Item ---

interface NavModuleProps {
  module: ModuleItem;
  onSelectLesson: (lessonId: string) => void;
  defaultOpen: boolean;
}

const NavModule: React.FC<NavModuleProps> = ({ module, lessons, onSelectLesson, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Determine if any lesson in the module is current/unlocked to keep it visually relevant
  const isModuleActive = lessons.some(l => l.status === 'current' || l.status === 'unlocked');

  return (
    <div className="mt-2" key={module.id} role="list">
      {/* Module Header (Collapsible Trigger) */}
      <motion.div
        whileHover={{ x: isOpen ? 0 : 5 }}
        onClick={toggleOpen}
        className={cn(
          "flex items-center justify-between p-3 text-base font-semibold rounded-lg cursor-pointer transition-colors duration-150",
          isOpen ? "bg-muted/70 text-foreground" : "hover:bg-muted/50 text-muted-foreground",
          isModuleActive && "text-foreground" // Highlight module if active content inside
        )}
        role="button"
        aria-expanded={isOpen}
        aria-controls={`lessons-${module.id}`}
      >
        <span className="truncate">{module.title}</span>
        <ChevronDown 
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0"
          )} 
          aria-hidden="true" 
        />
      </motion.div>
      
      {/* Lesson Content (Animated) */}
      <div id={`lessons-${module.id}`} className="py-1">
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {lessons.map(lesson => (
                <NavLesson 
                  key={lesson.id} 
                  lesson={lesson} 
                  onSelect={onSelectLesson} 
                  isCollapsed={!isOpen}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


// --- Main Component ---
export interface LessonNavigationSidebarProps {
  /** Array of course modules and nested lessons. */
  modules: ModuleItem[];
  /** The title of the entire course. */
  courseTitle: string;
  /** Callback when a lesson is clicked. */
  onLessonSelect: (lessonId: string) => void;
  /** Optional class name for the container. */
  className?: string;
  /** Maximum height for the scrollable list. */
  maxHeightClass?: string;
}

/**
 * A highly interactive and animated sidebar for navigating course lessons and tracking progress.
 */
const LessonNavigationSidebar: React.FC<LessonNavigationSidebarProps> = ({
  modules,
  courseTitle,
  onLessonSelect,
  className,
  maxHeightClass = "h-[80vh]",
}) => {
  // Determine which modules should be open by default (the one containing the current lesson)
  const defaultOpenModules = useMemo(() => {
    return new Set(
      modules.filter(m => m.lessons.some(l => l.status === 'current')).map(m => m.id)
    );
  }, [modules]);

  return (
    <Card className={cn("flex flex-col h-full overflow-hidden", className)}>
      <CardHeader className="p-4 border-b">
        <CardTitle className="text-xl font-bold text-foreground truncate">{courseTitle}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">Course Structure</CardDescription>
      </CardHeader>

      <ScrollArea className={cn("flex-grow px-2 py-3", maxHeightClass)}>
        <div className="space-y-1">
          {modules.map((module) => (
            <NavModule
              key={module.id}
              module={module}
              lessons={module.lessons}
              onSelectLesson={onLessonSelect}
              defaultOpen={defaultOpenModules.has(module.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};



const mockModules: ModuleItem[] = [
  {
    id: "m1",
    title: "Module 1: Introduction to Components",
    lessons: [
      { id: "l1_1", title: "Setup and Environment", status: 'completed', duration: "10 min" },
      { id: "l1_2", title: "What is a React Component?", status: 'completed', duration: "12 min" },
      { id: "l1_3", title: "JSX and Rendering", status: 'current', duration: "25 min" },
    ],
  },
  {
    id: "m2",
    title: "Module 2: Advanced State Management",
    lessons: [
      { id: "l2_1", title: "Hooks: useState and useEffect", status: 'unlocked', duration: "30 min" },
      { id: "l2_2", title: "The Reducer Pattern", status: 'unlocked', duration: "45 min" },
      { id: "l2_3", title: "Global State with Context", status: 'locked', duration: "20 min" },
    ],
  },
  {
    id: "m3",
    title: "Module 3: Testing and Deployment",
    lessons: [
      { id: "l3_1", title: "Writing Unit Tests (Locked)", status: 'locked', duration: "35 min" },
      { id: "l3_2", title: "CI/CD Pipelines", status: 'locked', duration: "20 min" },
    ],
  },
];

const ExampleUsage = () => {
  const [currentLesson, setCurrentLesson] = useState('l1_3');

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLesson(lessonId);
    console.log(`Navigating to lesson: ${lessonId}`);
  };

  // Logic to dynamically update the mock data based on selection
  const updatedModules = mockModules.map(module => ({
    ...module,
    lessons: module.lessons.map(lesson => ({
      ...lesson,
      status: lesson.id === currentLesson ? 'current' : 
              (lesson.status === 'current' && lesson.id !== currentLesson ? 'completed' : lesson.status),
    })),
  }));

  return (
    <div className="p-8 bg-background border rounded-lg max-w-lg mx-auto shadow-md">
      <h3 className="text-xl font-semibold text-foreground mb-4">Lesson Navigation Sidebar Demo</h3>
      
      <LessonNavigationSidebar
        courseTitle="Mastering Enterprise React"
        modules={updatedModules}
        onLessonSelect={handleLessonSelect}
        maxHeightClass="h-[500px]"
      />
      
      <p className="mt-4 text-sm text-muted-foreground">
        Current Lesson: <strong className="text-primary">{currentLesson}</strong>. Click an 'unlocked' lesson to switch and see the sidebar structure update and modules collapse/expand.
      </p>
    </div>
  );
};

export default ExampleUsage;