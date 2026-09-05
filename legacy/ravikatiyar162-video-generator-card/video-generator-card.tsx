import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../_utils/cn"

import { Card, CardContent, CardHeader } from "./card"
import { Button } from "./button"
import { Textarea } from "./textarea"
import { X, Plus, Zap, Image as ImageIcon, Mic, ArrowUp, Loader2 } from "lucide-react"

// Prop types for the component
interface StoryboardImage {
  src: string;
  alt: string;
}

interface VideoGeneratorCardProps {
  storyboardImages: StoryboardImage[];
  initialPrompt?: string;
  onClose?: () => void;
  onGenerate?: (prompt: string) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * A component that provides a user interface for generating video content
 * from a storyboard and a text prompt, inspired by modern AI tools.
 */
const VideoGeneratorCard = React.forwardRef<HTMLDivElement, VideoGeneratorCardProps>(
  ({ storyboardImages, initialPrompt = "", onClose, onGenerate, isLoading = false, className }, ref) => {
    // State to manage the prompt text
    const [prompt, setPrompt] = React.useState(initialPrompt);

    const handleGenerateClick = () => {
      if (onGenerate) {
        onGenerate(prompt);
      }
    };

    return (
      <Card ref={ref} className={cn("w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm border-border/40 overflow-hidden shadow-2xl animate-fade-in", className)}>
        {/* Header with Close button and Drafts label */}
        <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-border/40">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">Drafts</span>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Storyboard Image Thumbnails */}
          <div className="flex items-center gap-2">
            {storyboardImages.map((image, index) => (
              <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer">
                <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Prompt Input Area */}
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Use the storyboard to create a video..."
            className="bg-background/50 border-border/40 min-h-[80px] resize-none focus-visible:ring-primary/50"
          />

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Add content">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Quick edit">
                <Zap className="h-4 w-4" />
              </Button>
              {/* Media Type Toggle */}
              <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
                <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground">
                  <ImageIcon className="h-4 w-4 mr-1.5" />
                  Image
                </Button>
                <Button size="sm" variant="secondary" className="h-7 px-2 shadow-sm">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 mr-1.5"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"></path></svg>
                  Video
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Use microphone">
                <Mic className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-9 w-9 bg-primary hover:bg-primary/90" onClick={handleGenerateClick} disabled={isLoading} aria-label="Generate video">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);
VideoGeneratorCard.displayName = "VideoGeneratorCard";

export { VideoGeneratorCard };