"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { AspectRatio } from "./aspect-ratio";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "./dialog";
import { Button } from "./button";
import { Play, X } from "lucide-react";
import Image from "next/image";

export interface Testimonial {
  name: string;
  designation: string;
  title?: string;
  profile?: string;
  content: string;
  mediaUrl?: string;
  thumbnail?: string;
}

export function TestimonialCard({
  testimonial,
}: {
  testimonial?: Testimonial;
}) {
  const [hydrated, setHydrated] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [open, setOpen] = React.useState(false);

  // Run once on mount
  React.useEffect(() => setHydrated(true), []);

  // Control video playback
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (open) v.play().catch(() => {});
    else {
      v.pause();
      v.currentTime = 0;
    }
  }, [open]);

  // Guard missing data (no conditional hook calls!)
  if (!testimonial) {
    return (
      <Card className="border border-border shadow-sm bg-background">
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading testimonial...
        </CardContent>
      </Card>
    );
  }

  const {
    name = "Anonymous",
    profile = "",
    title = "",
    designation = "Customer",
    content = "No testimonial available.",
    mediaUrl,
    thumbnail,
  } = testimonial;

  // render skeleton until hydrated
  if (!hydrated) {
    return (
      <Card className="border border-border shadow-sm bg-background">
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="break-inside-avoid border p-3 rounded-3xl my-4 border-border bg-background shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0 mt-3 space-y-4">
        <ScrollArea className="max-h-[500px] rounded-md">
          <div className="space-y-4">
            {/* --- Video Section --- */}
            {mediaUrl && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="relative w-full cursor-pointer group outline-none"
                    aria-label="Play testimonial video"
                    onClick={() => setOpen(true)}
                  >
                    <AspectRatio
                      ratio={16 / 9}
                      className="overflow-hidden rounded-xl border"
                    >
                      <Image
                        src={thumbnail || mediaUrl || "/placeholder-video.jpg"}
                        alt={name}
                        fill
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </AspectRatio>
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-black/30 p-3 backdrop-blur-sm">
                        <Play className="h-10 w-10 text-white drop-shadow" />
                      </div>
                    </div>
                  </button>
                </DialogTrigger>

                {open && (
                  <DialogContent
                    className="sm:max-w-5xl w-full p-0 overflow-hidden bg-black text-white border-0"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <DialogClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 z-50 rounded-full text-white hover:bg-white/10"
                        aria-label="Close video"
                        onClick={() => setOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </DialogClose>

                    <AspectRatio ratio={16 / 9} className="bg-black">
                      <video
                        ref={videoRef}
                        controls
                        playsInline
                        preload="metadata"
                        poster={thumbnail}
                        className="h-full w-full"
                      >
                        <source src={mediaUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </AspectRatio>
                  </DialogContent>
                )}
              </Dialog>
            )}

            {/* --- Image Section --- */}
            {!mediaUrl && thumbnail && (
              <AspectRatio
                ratio={16 / 9}
                className="overflow-hidden rounded-xl border relative"
              >
                <Image
                  src={thumbnail}
                  alt={name}
                  fill
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </AspectRatio>
            )}

            {/* --- Text Section --- */}
            {content && (
              <p className="text-muted-foreground leading-relaxed">{content}</p>
            )}
          </div>
        </ScrollArea>

        <Separator />

        {/* --- Profile Section --- */}
        <div className="flex items-center space-x-3 pt-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">{designation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TestimonialCard;
