import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc?: string;
  title?: string;
  description?: string;
}

export default function CardWithThumbnail({
  className,
  imageSrc = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  title = "Card with thumbnail",
  description = "This is a card with a thumbnail image on top.",
 ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "group relative w-[320px] overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
        className
      )}
      {...props}
    >
      {/* Thumbnail Container with Padding */}
      <div className="p-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
          <img
            src={imageSrc}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-2">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button className="rounded-lg bg-secondary px-6 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export {CardWithThumbnail as Component};