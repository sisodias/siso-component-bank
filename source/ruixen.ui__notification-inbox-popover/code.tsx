"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  GitMerge,
  FileText,
  ClipboardCheck,
  Mail,
  MessageSquareQuote,
  AlertCircle,
  LucideIcon,
} from "lucide-react";

interface Notification {
  id: number;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  unread: boolean;
  icon: LucideIcon;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    user: "Alicia Keys",
    action: "merged",
    target: "PR #105: Dark mode support",
    timestamp: "10 minutes ago",
    unread: true,
    icon: GitMerge,
  },
  {
    id: 2,
    user: "Daniel Green",
    action: "shared file",
    target: "Quarterly Report.pdf",
    timestamp: "30 minutes ago",
    unread: true,
    icon: FileText,
  },
  {
    id: 3,
    user: "Sophia Turner",
    action: "assigned you a task",
    target: "Marketing campaign brief",
    timestamp: "2 hours ago",
    unread: false,
    icon: ClipboardCheck,
  },
  {
    id: 4,
    user: "Michael Ross",
    action: "sent you a message",
    target: "Project feedback discussion",
    timestamp: "5 hours ago",
    unread: false,
    icon: Mail,
  },
  {
    id: 5,
    user: "Priya Sharma",
    action: "added a comment",
    target: "UX Review Notes",
    timestamp: "1 day ago",
    unread: false,
    icon: MessageSquareQuote,
  },
  {
    id: 6,
    user: "System",
    action: "alert",
    target: "Server downtime scheduled",
    timestamp: "3 days ago",
    unread: false,
    icon: AlertCircle,
  },
];

function NotificationInboxPopover() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;
  const [tab, setTab] = useState("all");

  const filtered = tab === "unread" ? notifications.filter((n) => n.unread) : notifications;

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline" className="relative" aria-label="Open notifications">
          <Bell size={16} strokeWidth={2} aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0">
        {/* Header with Tabs + Mark All */}
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between border-b px-3 py-2">
            <TabsList className="bg-transparent">
              <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
              <TabsTrigger value="unread" className="text-sm">
                Unread {unreadCount > 0 && <Badge className="ml-1">{unreadCount}</Badge>}
              </TabsTrigger>
            </TabsList>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-muted-foreground hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              filtered.map((n) => {
                const Icon = n.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className="flex w-full items-start gap-3 border-b px-3 py-3 text-left hover:bg-accent"
                  >
                    <div className="mt-1 text-muted-foreground">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p
                        className={`text-sm ${
                          n.unread ? "font-semibold text-foreground" : "text-foreground/80"
                        }`}
                      >
                        {n.user} {n.action}{" "}
                        <span className="font-medium">{n.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{n.timestamp}</p>
                    </div>
                    {n.unread && (
                      <span className="mt-1 inline-block size-2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </Tabs>

        {/* Footer */}
        <div className="px-3 py-2 text-center">
          <Button variant="ghost" size="sm" className="w-full">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { NotificationInboxPopover };
