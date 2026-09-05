import { cn } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import Image from "next/image";

interface CinematicItemProps {
  id: string;
  title: string;
  location: string;
  src: string;
  alt: string;
}

function CinematicListItem({
  id,
  title,
  location,
  src,
  alt,
}: CinematicItemProps) {
  return (
    <div
      className={cn(
        "group relative flex w-full cursor-pointer flex-col justify-center overflow-hidden border-b border-neutral-200 dark:border-neutral-800",
        // Height Transition: fast start, slow end (Quartz ease)
        "transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
        // Mobile: fixed height / Desktop: starts small, expands on hover
        "h-24 md:hover:h-[400px]"
      )}
    >
      {/* --- Background Image Layer --- */}
      <div className="absolute inset-0 z-0 h-full w-full opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-100 scale-110"
        />
        {/* Gradient Overlay: Stronger at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* --- Content Layer --- */}
      <div className="relative z-10 flex w-full items-center justify-between px-4 sm:px-8 md:px-12">
        {/* Left Side: ID & Title */}
        <div className="flex items-center gap-6 md:gap-12">
          <span className="font-mono text-sm font-medium text-neutral-400 transition-colors duration-500 group-hover:text-white/70">
            {id}
          </span>

          <div className="flex flex-col">
            <h2
              className={cn(
                "text-2xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white md:text-5xl",
                "transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                // On hover, title slides up slightly to make room
                "group-hover:-translate-y-2 group-hover:text-white"
              )}
            >
              {title}
            </h2>
            {/* Reveal Location underneath title on Mobile, hide on Desktop (since it's on the right) */}
            <span className="block text-xs font-medium uppercase tracking-widest text-neutral-400 md:hidden">
              {location}
            </span>
          </div>
        </div>

        {/* Right Side: Metadata & Action */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Location: Slides in from bottom on desktop hover */}
          <span className="hidden translate-y-8 text-sm font-bold uppercase tracking-widest text-transparent opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:text-white group-hover:opacity-100 md:block">
            {location}
          </span>

          {/* Icon Circle */}
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500",
              "border-neutral-300 text-neutral-400", // Default Light
              "dark:border-neutral-700 dark:text-neutral-500", // Default Dark
              "group-hover:border-white group-hover:bg-white group-hover:text-black", // Hover state
              "group-hover:scale-110" // Subtle pop
            )}
          >
            <MoveRight className="h-5 w-5 transition-transform duration-500 group-hover:-rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CinematicList() {
  const items: CinematicItemProps[] = [
    {
      id: "01",
      title: "Alpine Lodge",
      location: "Switzerland",
      src: "https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg",
      alt: "Snowy mountains",
    },
    {
      id: "02",
      title: "Desert Oasis",
      location: "Morocco",
      src: "https://images.pexels.com/photos/1509582/pexels-photo-1509582.jpeg",
      alt: "Desert dunes",
    },
    {
      id: "03",
      title: "Coastal Villa",
      location: "Amalfi Coast",
      src: "https://images.pexels.com/photos/2225218/pexels-photo-2225218.jpeg",
      alt: "Coastal view",
    },
    {
      id: "04",
      title: "Urban Loft",
      location: "New York",
      src: "https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg",
      alt: "City skyline",
    },
  ];

  return (
    <div className="w-full py-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-12 flex items-end justify-between px-4 md:px-8">
          <h2 className="text-3xl font-bold uppercase tracking-tighter text-neutral-900 dark:text-white">
            Exclusive Destinations
          </h2>
          <span className="hidden text-sm font-medium text-neutral-500 dark:text-neutral-400 md:block">
            Explore the collection
          </span>
        </div>

        <div className="flex flex-col border-t border-neutral-200 dark:border-neutral-800">
          {items.map((item) => (
            <CinematicListItem key={item.id} {...item} />
          ))}
          <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

export { CinematicList };
