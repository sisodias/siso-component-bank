"use client";
import React from "react";


type SimpleNavbarProps = {
  title: string;
  userName?: string;
  userImage?: string;
};

export function SimpleNavbar({ title, userName, userImage }: SimpleNavbarProps) {
  return (
    <nav className="relative border-b h-16 flex items-center justify-between px-4 overflow-hidden bg-background/50 backdrop-blur-md">
          <div className="min-h-full -z-10 w-full bg-transparent absolute top-0 left-0">
      {/* Diagonal Fade Grid Background - Top Left */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, var(--muted) 1px, transparent 1px),
        linear-gradient(to bottom, var(--muted) 1px, transparent 1px)
      `,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
        }}
      />
      {/* Your Content/Components */}
    </div>

      <div className="z-10 flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tighter uppercase italic">
          {title}
        </h1>
      </div>

      <div className="z-10 flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-foreground font-semibold uppercase">
              {userName}
            </span>
            <span className="text-[0.6rem] text-muted-foreground uppercase opacity-70 tracking-widest">
              Active Now
            </span>
          </div>
        <div className="size-10 border rounded-full overflow-hidden p-0.5 bg-background">
          <img
            src={
              userImage ||
              "https://m.media-amazon.com/images/I/31sDQI7yfDL._AC_UF894,1000_QL80_.jpg"
            }
            alt="profile"
            className="size-full rounded-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
}

type Link = {
  name: string;
  href: string;
};

type SecondaryNavbarProps = {
  links: Link[];
  currentType: string;
  onTypeChange: (type: string) => void;
};

export function SecondaryNavbar({
  links,
  currentType,
  onTypeChange,
}: SecondaryNavbarProps) {
  return (
    <div className="relative border-b bg-muted/30 group">
      <div className="flex items-center">
        <div className="flex flex-1 overflow-x-auto no-scrollbar scroll-smooth">
          {links.map((l, index) => {
            const isActive = currentType === l.href;

            return (
              <div
                key={index}
                onClick={() => onTypeChange(l.href)}
                className={
                  "text-[0.65rem] md:text-xs p-3 px-5 md:px-7 cursor-pointer border-r font-extrabold uppercase tracking-widest transition-colors shrink-0 flex items-center justify-center min-w-fit " +
                  (isActive
                    ? "bg-accent/20 text-primary border-b-2 border-b-primary"
                    : "text-muted-foreground hover:bg-accent/10")
                }
              >
                {l.name}
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-background/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
