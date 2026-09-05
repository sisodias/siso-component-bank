// components/ui/composer-input.tsx

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Trash2,
  Paperclip,
  Mic,
  Image as ImageIcon,
  Wand2,
  MoreHorizontal,
  CornerDownLeft,
  X,
} from "lucide-react"

import { cn } from "../_utils/cn" // Your utility for merging class names
import { Button } from "./button"
import { Textarea } from "./textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

// Define the structure for an attachment
export interface Attachment {
  id: string
  fileName: string
  fileType: "image" | "document"
  thumbnailUrl?: string // URL for image previews
}

// Define props for the component
export interface ComposerInputProps extends React.HTMLAttributes<HTMLDivElement> {
  onSend: (message: string, attachments: Attachment[]) => void
  initialAttachments?: Attachment[]
  placeholder?: string
}

const ComposerInput = React.forwardRef<HTMLDivElement, ComposerInputProps>(
  ({ className, onSend, initialAttachments = [], placeholder = "Type your message...", ...props }, ref) => {
    const [message, setMessage] = React.useState("")
    const [attachments, setAttachments] = React.useState<Attachment[]>(initialAttachments)

    const handleSend = () => {
      if (message.trim() || attachments.length > 0) {
        onSend(message, attachments)
        setMessage("")
        setAttachments([])
      }
    }

    const handleRemoveAttachment = (id: string) => {
      setAttachments((prev) => prev.filter((att) => att.id !== id))
    }
    
    // An array of toolbar items for easier mapping
    const toolbarItems = [
      { icon: Bold, tooltip: "Bold" },
      { icon: Italic, tooltip: "Italic" },
      { icon: Underline, tooltip: "Underline" },
      { icon: List, tooltip: "Bullet List" },
      { icon: ListOrdered, tooltip: "Numbered List" },
      { icon: Quote, tooltip: "Quote" },
      { icon: Code, tooltip: "Code" },
      { icon: Link, tooltip: "Link" },
    ];
    
    // An array of action button items
    const actionItems = [
      { icon: Paperclip, tooltip: "Attach File" },
      { icon: Mic, tooltip: "Voice Message" },
      { icon: ImageIcon, tooltip: "Add Image" },
      { icon: Wand2, tooltip: "AI Assist" },
      { icon: MoreHorizontal, tooltip: "More Options" },
    ];

    return (
      <TooltipProvider>
        <div
          ref={ref}
          className={cn(
            "flex flex-col w-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
            className
          )}
          {...props}
        >
          {/* Top Toolbar */}
          <div className="flex items-center justify-between p-2 border-b">
            <div className="flex items-center gap-1">
              {toolbarItems.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <item.icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Main text area */}
          <div className="p-2 flex-grow">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={placeholder}
              className="w-full min-h-[100px] border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
            />
          </div>

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="px-4 pb-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                <AnimatePresence>
                  {attachments.map((att) => (
                    <motion.div
                      key={att.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="relative group"
                    >
                      <div className="aspect-square w-full rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {att.fileType === "image" && att.thumbnailUrl ? (
                          <img src={att.thumbnailUrl} alt={att.fileName} className="h-full w-full object-cover"/>
                        ) : (
                          <Paperclip className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                       <button
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="absolute -top-1 -right-1 bg-background border rounded-full p-0.5 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove attachment"
                        >
                          <X className="h-3 w-3" />
                        </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between p-2 border-t">
            <div className="flex items-center gap-1">
              {actionItems.map((item, index) => (
                 <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <item.icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleSend} size="sm">
                Send
                <CornerDownLeft className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </TooltipProvider>
    )
  }
)

ComposerInput.displayName = "ComposerInput"

export { ComposerInput }