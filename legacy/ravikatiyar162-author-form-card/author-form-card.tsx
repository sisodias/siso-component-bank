import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Info, X } from "lucide-react";
import { cn } from "../_utils/cn";

// --- Required shadcn/ui components ---
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

// --- Component Props Interface ---
interface AuthorFormCardProps {
  initialData?: {
    name: string;
    title: string;
    imageUrl?: string;
  };
  onSubmit: (data: { name: string; title:string; imageUrl?: string }) => void;
  onCancel: () => void;
  className?: string;
}

// --- Main Component ---
export const AuthorFormCard: React.FC<AuthorFormCardProps> = ({
  initialData,
  onSubmit,
  onCancel,
  className,
}) => {
  const [name, setName] = React.useState(initialData?.name || "");
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [imageUrl, setImageUrl] = React.useState<string | undefined>(initialData?.imageUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, title, imageUrl });
  };

  // --- Animation Variants for Framer Motion ---
  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className={cn(
        "relative w-full max-w-lg rounded-xl bg-background p-6 shadow-xl",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <motion.h3 variants={FADE_IN_VARIANTS} className="text-xl font-semibold text-foreground">
          Add a writer
        </motion.h3>
        <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* --- Image Upload Section --- */}
        <motion.div variants={FADE_IN_VARIANTS} className="flex flex-col items-center gap-3 md:col-span-1">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-dashed border-border">
              <AvatarImage src={imageUrl} alt={name || "Author"} />
              <AvatarFallback className="bg-muted">
                <span className="text-xs text-muted-foreground">Image</span>
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border bg-background transition-colors hover:bg-muted"
              aria-label="Upload Image"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Upload Image</p>
            <p className="text-xs text-muted-foreground">Max file size: 1MB</p>
          </div>
          <Button type="button" variant="outline" size="sm" className="w-full">
            Add Image
          </Button>
        </motion.div>

        {/* --- Form Fields Section --- */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
            <Label htmlFor="author-name">
              Author name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="author-name"
              placeholder="James Brown"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </motion.div>
          <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
            <div className="flex items-center gap-1">
              <Label htmlFor="title">Title</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 cursor-pointer text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The author's role or position.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="text"
              id="title"
              placeholder="Marketing Manager"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </motion.div>
        </div>

        {/* --- Form Actions --- */}
        <motion.div variants={FADE_IN_VARIANTS} className="flex justify-end gap-3 md:col-span-3">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </motion.div>
      </form>
    </motion.div>
  );
};