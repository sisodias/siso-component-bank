import * as React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Figma,
  Calendar,
  Tag,
  Paperclip,
  Users,
  MoreHorizontal,
  Download,
  Plus,
  ArrowRight,
  Edit2,
  X,
  Share2
} from "lucide-react";

import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility from shadcn
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardHeader,
} from "./card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

// Type Definitions for Props
type Assignee = {
  name: string;
  avatarUrl: string;
};

type ProjectTag = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
};

type Attachment = {
  name: string;
  size: string;
  type: "pdf" | "figma";
};

type SubTask = {
  id: number;
  task: string;
  category: string;
  status: "Completed" | "In Progress" | "Pending";
  dueDate: string;
};

export type ProjectDetailViewProps = {
  breadcrumbs: { label: string; href: string }[];
  title: string;
  status: string;
  assignees: Assignee[];
  dateRange: {
    start: string;
    end: string;
  };
  tags: ProjectTag[];
  description: string;
  attachments: Attachment[];
  subTasks: SubTask[];
};

// Helper component for status badges
const StatusBadge = ({ status }: { status: SubTask["status"] }) => {
  const statusStyles = {
    Completed: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-700/60",
    "In Progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/60",
    Pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-400 border-gray-200 dark:border-gray-700/60",
  };
  return <Badge variant="outline" className={cn("font-medium", statusStyles[status])}>{status}</Badge>;
};

// Helper to get file icon
const FileIcon = ({ type }: { type: Attachment["type"] }) => {
  if (type === "pdf") return <FileText className="h-6 w-6 text-red-500" />;
  if (type === "figma") return <Figma className="h-6 w-6 text-purple-500" />;
  return <Paperclip className="h-6 w-6 text-muted-foreground" />;
};


export function ProjectDetailView({
  breadcrumbs,
  title,
  status,
  assignees,
  dateRange,
  tags,
  description,
  attachments,
  subTasks,
}: ProjectDetailViewProps) {
  
  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      }
    },
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden border-none shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        {/* Header Section */}
        <CardHeader className="p-4 border-b bg-muted/30">
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={index}>
                  <span>{breadcrumb.label}</span>
                  {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><X className="h-4 w-4" /></Button>
            </div>
          </motion.div>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8 space-y-8">
            {/* Title Section */}
            <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight text-foreground">{title}</motion.h1>

            {/* Meta Info Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                <div className="flex items-start gap-3">
                    <MoreHorizontal className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge variant="outline" className="mt-1 font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/60">
                            <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
                            {status}
                        </Badge>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Assignee</p>
                        <div className="flex items-center gap-2 mt-1">
                          {assignees.map(assignee => (
                              <div key={assignee.name} className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                                    <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{assignee.name}</span>
                              </div>
                          ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium flex items-center gap-2 mt-1">
                            {dateRange.start} <ArrowRight className="h-4 w-4 text-muted-foreground" /> {dateRange.end}
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Tags</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {tags.map((tag) => <Badge key={tag.label} variant={tag.variant}>{tag.label}</Badge>)}
                        </div>
                    </div>
                </div>
                 <div className="flex items-start gap-3 col-span-1 md:col-span-2">
                    <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Description</p>
                        <p className="mt-1 text-foreground/80">{description}</p>
                    </div>
                </div>
            </motion.div>

            {/* Attachments Section */}
            <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold flex items-center gap-2"><Paperclip className="h-5 w-5 text-muted-foreground"/>Attachment <Badge variant="secondary">2</Badge></h3>
                    <Button variant="ghost" size="sm" className="text-primary"><Download className="h-4 w-4 mr-2" />Download All</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {attachments.map(file => (
                        <div key={file.name} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/40">
                            <FileIcon type={file.type} />
                            <div className="flex-1">
                                <p className="font-medium text-sm truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.size}</p>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center justify-center p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/40 transition-colors">
                        <Plus className="h-6 w-6 text-muted-foreground"/>
                    </div>
                </div>
            </motion.div>
            
            {/* Task List Section */}
            <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="font-semibold">Task List</h3>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">No</TableHead>
                                <TableHead>Task</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Due Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subTasks.map((task) => (
                                <motion.tr variants={itemVariants} key={task.id}>
                                    <TableCell className="text-muted-foreground">{task.id}</TableCell>
                                    <TableCell className="font-medium">{task.task}</TableCell>
                                    <TableCell>{task.category}</TableCell>
                                    <TableCell><StatusBadge status={task.status} /></TableCell>
                                    <TableCell className="text-right text-muted-foreground">{task.dueDate}</TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </motion.div>
        </CardContent>
      </motion.div>
    </Card>
  );
}