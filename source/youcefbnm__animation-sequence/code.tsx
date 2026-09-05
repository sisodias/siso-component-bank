import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { FileTextIcon, SparklesIcon } from "lucide-react";
import { Badge } from "./badge";

import { cn } from "@/lib/utils";

export function CardMockup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative  border p-4 shadow-2xl overflow-hidden",
        "before:absolute before:pointer-events-none before:z-0 before:inset-0 before:bg-[url('https://grainy-gradients.vercel.app/noise.svg')] before:opacity-20",
        "after:absolute after:inset-0 after:bg-linear-to-br after:from-blue-50/50 after:via-transparent after:to-purple-50/50 dark:after:from-blue-950/30 dark:after:to-purple-950/30 after:pointer-events-none",
        className
      )}
      {...props}
    />
  );
}

export function CardMockupBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "size-full relative z-2 flex flex-col bg-background overflow-hidden border shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function BrowserHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "h-10 border-b bg-muted/30 flex items-center px-4 space-x-2",
        className
      )}
      {...props}
    >
      <div className="size-3 rounded-full bg-red-500/20" />
      <div className="size-3 rounded-full bg-yellow-500/20" />
      <div className="size-3 rounded-full bg-green-500/20" />
      {children}
    </div>
  );
}

export function UserMessage({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex bg-secondary text-secondary-foreground px-4 py-2 rounded-2xl rounded-tr-none text-sm shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function AiAvatar({
  imageUrl,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { imageUrl?: string }) {
  return (
    <Avatar className={cn("size-8 border bg-background", className)} {...props}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
        {children}
      </AvatarFallback>
    </Avatar>
  );
}
export function AiStatus() {
  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        <SparklesIcon className="size-3 text-primary animate-pulse" />
        <span>Scanning Knowledge Base...</span>
      </div>
    </div>
  );
}
export function AiSource() {
  return (
    <div className="flex gap-2 mb-2">
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border px-3 py-1.5 rounded-lg text-xs text-muted-foreground shadow-sm">
        <FileTextIcon className="size-3 text-orange-500" />
        Docs: SSO Setup
      </div>
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border px-3 py-1.5 rounded-lg text-xs text-muted-foreground shadow-sm">
        <FileTextIcon className="size-3 text-blue-500" />
        Guide: Enterprise
      </div>
    </div>
  );
}
export function AiAnswer() {
  return (
    <div className="overflow-hidden">
      <div className="bg-white dark:bg-slate-900 border px-4 py-3 rounded-2xl rounded-tl-none text-sm shadow-sm text-slate-700 dark:text-slate-300">
        <p className="leading-relaxed">
          To configure SSO for your enterprise team, navigate to
          <span className="font-semibold text-primary mx-1">
            Settings &gt; Security
          </span>
          . You&apos;ll need your Identity Provider (IdP) metadata XML file.
        </p>
        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Confidence: 98%</span>
          <Badge
            variant="outline"
            className="text-[10px] h-5 text-green-600 border-green-200 bg-green-50"
          >
            Verified Source
          </Badge>
        </div>
      </div>
    </div>
  );
}
