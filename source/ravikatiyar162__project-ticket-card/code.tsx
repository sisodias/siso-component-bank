import * as React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Link2,
  Paperclip,
  Copy,
  Image as ImageIcon,
  FilePenLine,
  MoreHorizontal,
  Trash2,
  Calendar,
  MessageSquare,
  FileText,
  Paperclip as AttachmentIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Define TypeScript types for props for reusability and type safety
type User = {
  name: string;
  avatarUrl: string;
  role?: string;
};

type Comment = {
  id: number;
  user: User;
  timestamp: string;
  message: string;
};

type ProjectTicketCardProps = {
  projectName: string;
  projectManager: User;
  assignedTo: User[];
  timeline: {
    startDate: string;
    endDate: string;
  };
  status: string;
  comments: Comment[];
  isDraft?: boolean;
};

// A small, reusable component for detail items to keep the main component clean
const DetailItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2">{children}</div>
  </div>
);

// Main component export
export function ProjectTicketCard({
  projectName,
  projectManager,
  assignedTo,
  timeline,
  status,
  comments,
  isDraft = true,
}: ProjectTicketCardProps) {
  const toolbarIcons = [
    Link2,
    Paperclip,
    Copy,
    ImageIcon,
    FilePenLine,
    MoreHorizontal,
    Trash2,
  ];

  const initialAnimation = { opacity: 0, y: 30 };
  const animateState = { opacity: 1, y: 0 };
  const transition = { duration: 0.5, ease: "easeInOut" };

  return (
    <motion.div
      initial={initialAnimation}
      animate={animateState}
      transition={transition}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden rounded-xl border-border/60 shadow-sm">
        {/* Card Header */}
        <CardHeader className="flex flex-row items-center justify-between bg-muted/30 p-4">
          <CardTitle className="text-lg font-semibold">
            Project Ticket
          </CardTitle>
          <div className="flex items-center gap-2">
            {isDraft && <Badge variant="outline">Draft</Badge>}
            <Button size="sm">Save Ticket</Button>
          </div>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="p-4 md:p-6">
          {/* Status and Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <Badge
              variant="outline"
              className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {status}
            </Badge>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              {toolbarIcons.map((Icon, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={`Toolbar icon ${index + 1}`}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <DetailItem label="Project name">
              <p className="font-medium text-foreground">{projectName}</p>
            </DetailItem>
            <DetailItem label="Project Manager">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={projectManager.avatarUrl}
                  alt={projectManager.name}
                />
                <AvatarFallback>
                  {projectManager.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">
                {projectManager.name}
              </span>
            </DetailItem>
            <DetailItem label="Assigned to">
              <div className="flex -space-x-2">
                {assignedTo.map((user) => (
                  <Avatar
                    key={user.name}
                    className="h-7 w-7 border-2 border-background"
                  >
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </DetailItem>
            <DetailItem label="Timeline">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {timeline.startDate} - {timeline.endDate}
              </span>
            </DetailItem>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="comments">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
              <TabsTrigger value="comments">
                <MessageSquare className="mr-2 h-4 w-4" />
                Comments
                <Badge className="ml-2 rounded-full px-1.5 py-0.5 text-[10px]">
                  {comments.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="details">
                <FileText className="mr-2 h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="attachment">
                <AttachmentIcon className="mr-2 h-4 w-4" />
                Attachment
              </TabsTrigger>
            </TabsList>

            {/* Comments Content */}
            <TabsContent value="comments" className="mt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={comment.user.avatarUrl}
                        alt={comment.user.name}
                      />
                      <AvatarFallback>
                        {comment.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{comment.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {comment.user.role} &bull; {comment.timestamp}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 rounded-lg bg-muted/50 p-3 text-sm">
                        <p>{comment.message}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-muted-foreground"
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                ))}
              </motion.div>
            </TabsContent>
            {/* Placeholder for other tabs */}
            <TabsContent value="details" className="mt-4">
              <p>Detailed project information goes here.</p>
            </TabsContent>
            <TabsContent value="attachment" className="mt-4">
              <p>Project attachments and files will be listed here.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}