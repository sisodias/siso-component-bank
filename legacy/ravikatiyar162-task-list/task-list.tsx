// components/ui/task-list.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../_utils/cn"; // Assuming you have a utility for class names

// --- TYPE DEFINITIONS ---
type TaskStatus = "Completed" | "In Progress" | "Pending";

export interface Task {
  id: number | string;
  task: string;
  category: string;
  status: TaskStatus;
  dueDate: string;
}

export interface TaskListProps {
  title?: string;
  tasks: Task[];
}

// --- STATUS BADGE SUBCOMPONENT ---
const StatusBadge = ({ status }: { status: TaskStatus }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full";
  const statusClasses = {
    Completed:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400",
    "In Progress":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400",
    Pending: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };
  return <span className={cn(baseClasses, statusClasses[status])}>{status}</span>;
};


// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 14,
    }
  },
};

// --- MAIN COMPONENT ---
export const TaskList = ({ title = "Task List", tasks }: TaskListProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          {/* Table Header */}
          <motion.thead
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.5 }}
          >
            <tr className="border-b border-border">
              <th scope="col" className="p-4 font-medium text-muted-foreground w-12">No</th>
              <th scope="col" className="p-4 font-medium text-muted-foreground">Task</th>
              <th scope="col" className="p-4 font-medium text-muted-foreground">Category</th>
              <th scope="col" className="p-4 font-medium text-muted-foreground">Status</th>
              <th scope="col" className="p-4 font-medium text-muted-foreground text-right">Due Date</th>
            </tr>
          </motion.thead>

          {/* Table Body with Animations */}
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {tasks.map((task, index) => (
                <motion.tr 
                  key={task.id} 
                  variants={itemVariants}
                  className="border-b border-border last:border-none hover:bg-muted/50"
                >
                  <td className="p-4 text-muted-foreground">{index + 1}</td>
                  <td className="p-4 font-medium">{task.task}</td>
                  <td className="p-4 text-muted-foreground">{task.category}</td>
                  <td className="p-4">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="p-4 text-muted-foreground text-right">{task.dueDate}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};