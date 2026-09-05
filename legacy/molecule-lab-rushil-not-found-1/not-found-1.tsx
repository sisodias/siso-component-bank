import { Badge } from "./badge";
import { Button } from "./button";
import {
  ArrowLeft,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "../_utils/cn";

export interface NotFoundLink {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  href: string;
}

export interface NotFoundProps {
  /** Custom error code to display */
  errorCode?: string;
  /** Main heading text */
  title?: string;
  /** Subtitle/description text */
  description?: string;
  /** Links to display below the main content */
  links?: NotFoundLink[];
  /** Handler for back button click */
  onBackClick?: () => void;
  /** Handler for home button click */
  onHomeClick?: () => void;
  /** Custom back button text */
  backButtonText?: string;
  /** Custom home button text */
  homeButtonText?: string;
  /** Show the grid background pattern */
  showBackground?: boolean;
  /** Additional CSS classes for the main container */
  className?: string;
  /** Children to render instead of default content */
  children?: ReactNode;
}

export function NotFound({
  errorCode = "404 error",
  title = "We can't find this page",
  description = "The page you are looking for doesn't exist or has been moved.",
  links = [],
  onBackClick,
  onHomeClick,
  backButtonText = "Go back",
  homeButtonText = "Go Home",
  showBackground = true,
  className,
  children,
}: NotFoundProps) {
  return (
    <main
      className={cn(
        "h-screen w-full flex items-start md:items-center justify-center py-16 px-4 md:py-24 md:px-20",
        className
      )}
    >
      {showBackground && (
        <div className="fixed inset-0 z-0 opacity-50 bg-[image:linear-gradient(to_right,var(--muted-foreground),transparent_1px),linear-gradient(to_bottom,var(--muted-foreground),transparent_1px)] [background-size:32px_32px] md:[background-size:48px_48px] [mask-image:radial-gradient(ellipse_60%_30%_at_50%_0%,black_0%,transparent_100%)] md:[mask-image:radial-gradient(ellipse_30%_30%_at_50%_20%,black_0%,transparent_100%)]" />
      )}

      <section className="flex flex-col items-center gap-8 md:gap-16 z-10">
        {children || (
          <>
            <div className="flex flex-col items-center gap-8 md:gap-12">
              <header className="flex flex-col items-center gap-4">
                <div>
                  <Badge
                    variant="outline"
                    className="px-2.5 py-1 text-sm font-medium"
                  >
                    <div className="size-2 bg-primary rounded-full" />
                    {errorCode}
                  </Badge>
                </div>
                <div className="flex flex-col items-center gap-4 md:gap-6">
                  <h1 className="text-center text-4xl md:text-6xl font-semibold">
                    {title}
                  </h1>
                  <p className="text-center text-lg md:text-xl text-muted-foreground">
                    {description}
                  </p>
                </div>
              </header>
              <div className="flex gap-3 flex-col md:flex-row w-full items-center justify-center">
                <Button
                  className="w-full md:w-fit"
                  variant="outline"
                  onClick={onBackClick}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {backButtonText}
                </Button>
                <Button className="w-full md:w-fit" onClick={onHomeClick}>
                  {homeButtonText}
                </Button>
              </div>
            </div>

            {links.length > 0 && (
              <div className="flex flex-col divide-y w-full border-t border-b">
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.title}
                    className="py-5 flex items-start md:items-center gap-4 md:gap-5 flex-col md:flex-row hover:bg-muted/50 transition-colors"
                  >
                    <div className="border p-2.5 md:p-3 rounded-lg bg-card">
                      <link.icon className="size-5 md:size-6" />
                    </div>
                    <div className="flex gap-5 flex-1 w-full">
                      <div className="flex flex-col gap-1">
                        <div className="text-lg font-semibold">
                          {link.title}
                        </div>
                        <div className="text-muted-foreground">
                          {link.subtitle}
                        </div>
                      </div>
                      <div className="self-start ml-auto">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}