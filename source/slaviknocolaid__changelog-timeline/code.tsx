"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { MeshGradient, Dithering } from "@paper-design/shaders-react";

/** ---- Data (all text & images rewritten) ---- */
const feed: Array<{
  title: string;
  badge: string;
  date: string;
  author: string;
  role: string;
  avatar: string;
  image: string;
  body: JSX.Element;
}> = [
  {
    title: "Unified Workspace Dashboard",
    badge: "New",
    date: "Apr 12, 2025",
    author: "Jordan Lee",
    role: "Product Architect",
    avatar: "https://placehold.co/96x96/jordan/fff?text=JL",
    image: "https://placehold.co/1280x720/141414/ffffff?text=Workspace+Dashboard",
    body: (
      <div className="prose dark:prose-invert">
        <p>
          A single home for projects, assets, and activity. Track progress,
          surface blockers, and jump into work without context-switching.
        </p>
        <ul>
          <li>Board overview with live status chips</li>
          <li>Quick filters for teams, tags, and milestones</li>
          <li>Presence indicators for real-time collaboration</li>
        </ul>
        <p>Start with prebuilt layouts or design your own dashboard presets.</p>
      </div>
    ),
  },
  {
    title: "Smart Sync Engine 2.0",
    badge: "Improvement",
    date: "Mar 29, 2025",
    author: "Lina Patel",
    role: "Systems Engineer",
    avatar: "https://placehold.co/96x96/lina/fff?text=LP",
    image: "https://placehold.co/1280x720/0f0f0f/ffffff?text=Smart+Sync+2.0",
    body: (
      <div className="prose dark:prose-invert">
        <p>
          Faster indexing, adaptive caching, and near-instant updates even under
          spotty connections.
        </p>
        <ul>
          <li>~60% lower latency on global networks</li>
          <li>Usage-aware local cache for large files</li>
          <li>Predictive conflict resolution</li>
        </ul>
        <p>Work uninterrupted across devices—changes follow you seamlessly.</p>
      </div>
    ),
  },
  {
    title: "AI Revision Companion",
    badge: "Enhancement",
    date: "Mar 18, 2025",
    author: "Felix Nguyen",
    role: "AI Lead",
    avatar: "https://placehold.co/96x96/felix/fff?text=FN",
    image: "https://placehold.co/1280x720/181818/ffffff?text=AI+Revision+Companion",
    body: (
      <div className="prose dark:prose-invert">
        <p>
          See what changed, why it matters, and where to merge—with suggestions
          grounded in your team’s patterns.
        </p>
        <ul>
          <li>Visual diffs for imagery, text, and components</li>
          <li>Summaries of meaningful edits</li>
          <li>Branching tips for multi-editor sessions</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Huddle Mode",
    badge: "Collaboration",
    date: "Mar 10, 2025",
    author: "Iris Navarro",
    role: "Design Director",
    avatar: "https://placehold.co/96x96/iris/fff?text=IN",
    image: "https://placehold.co/1280x720/202020/ffffff?text=Huddle+Mode",
    body: (
      <div className="prose dark:prose-invert">
        <p>
          Micro-meetings right on the canvas. Keep feedback in context with
          sketches, pins, and timestamped voice notes.
        </p>
        <ul>
          <li>On-canvas calls with pointer trails</li>
          <li>Color-coded sticky notes and tasks</li>
          <li>Instant recap export as a page snapshot</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Performance Framework v5",
    badge: "System",
    date: "Feb 28, 2025",
    author: "Diego Campos",
    role: "Infra Engineer",
    avatar: "https://placehold.co/96x96/diego/fff?text=DC",
    image: "https://placehold.co/1280x720/000000/ffffff?text=Framework+v5",
    body: (
      <div className="prose dark:prose-invert">
        <p>
          A lighter runtime with quicker start, smoother motion, and reduced
          memory footprint across modules.
        </p>
        <ul>
          <li>30% faster cold start</li>
          <li>Streamlined animation scheduler</li>
          <li>Lean dependency loader</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Template Gallery Refresh",
    badge: "Content",
    date: "Feb 12, 2025",
    author: "Amira Solis",
    role: "Content Strategist",
    avatar: "https://placehold.co/96x96/amira/fff?text=AS",
    image: "https://placehold.co/1280x720/151515/ffffff?text=Template+Gallery",
    body: (
      <div className="prose dark:prose-invert">
        <p>
          New starter templates curated for marketing sites, internal tools, and
          editorial hubs.
        </p>
        <ul>
          <li>Use-case tags for quicker discovery</li>
          <li>Opinionated typography & spacing presets</li>
          <li>Live examples for every layout</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Accessibility Pass",
    badge: "Quality",
    date: "Jan 30, 2025",
    author: "Noah Briggs",
    role: "QA Lead",
    avatar: "https://placehold.co/96x96/noah/fff?text=NB",
    image: "https://placehold.co/1280x720/1b1b1b/ffffff?text=Accessibility+Pass",
    body: (
      <div className="prose dark:prose-invert">
        <p>
          A11y audits across the app: higher contrast defaults, keyboard loops,
          and improved screen reader flows.
        </p>
        <ul>
          <li>WCAG-aligned semantics & labels</li>
          <li>Focusable regions + skip links</li>
          <li>Reduced motion option for animations</li>
        </ul>
      </div>
    ),
  },
];

/** ---- Custom avatar (no shadcn) ---- */
const Avatar = ({ src, alt }: { src: string; alt: string }) => (
  <div className="size-10 rounded-full overflow-hidden ring-1 ring-border bg-muted/30">
    <img src={src} alt={alt} className="h-full w-full object-cover" />
  </div>
);

/** ---- Component ---- */
export const Component = () => {
  // abstracted names to avoid grep collisions
  const [at, setAt] = useState<string | null>(null);
  const anchors = useRef<Record<string, HTMLElement>>({});

  useEffect(() => {
    const ids = Object.keys(anchors.current);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setAt(e.target.id));
      },
      { threshold: 0.5 }
    );
    ids.forEach((k) => anchors.current[k] && io.observe(anchors.current[k]));
    return () => io.disconnect();
  }, []);

  const bind = (id: string) => (node: HTMLElement | null) => {
    if (node) anchors.current[id] = node;
  };

  return (
    <section className="w-full h-full">
      {/* Header: shader background + top->bottom transparent->black overlay */}
      <div className="relative overflow-hidden py-20 lg:py-28 px-6 lg:px-10">
        <MeshGradient
          colors={["#5b00ff", "#00ffa3", "#ff9a00", "#ea00ff"]}
          swirl={0.55}
          distortion={0.85}
          speed={0.16}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
        <Dithering
          colors={["#ffffff", "#f2f2f2", "#e9e9e9"]}
          intensity={0.22}
          shape="simplex"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
        {/* global overlay: transparent at top → black at bottom */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />

        <div className="relative z-10 container">
          <div className="flex flex-col items-start gap-4 lg:flex-row">
            <span className="flex w-[16%] items-center gap-3 pt-1 text-sm">
              <span className="bg-primary size-2 shrink-0 rounded-full" />
              Updates
            </span>
            <div>
              <h2 className="text-4xl">
                Recent releases & platform polish <br />
                <span className="text-muted-foreground">Cycle 2025</span>
              </h2>
              <div className="mt-8 flex items-center gap-4 text-sm">
                <a href="#" className="group flex items-center gap-1 underline">
                  Subscribe
                  <ArrowUpRight className="size-4 transition-all group-hover:rotate-45" />
                </a>
                <a href="#" className="group flex items-center gap-1 underline">
                  Follow updates
                  <ArrowUpRight className="size-4 transition-all group-hover:rotate-45" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body: EXACT original layout pattern (sticky timeline inside container) */}
      <div className="container p-10">
        <div className="relative flex">
          {/* Left: sticky timeline that never scrolls past its own container (matches original) */}
          <div className="sticky top-10 hidden h-fit w-[16%] text-sm lg:block">
            <p className="mb-2">Timeline</p>
            <ul className="flex flex-col gap-2">
              {feed.map((item, i) => {
                const id = `section-${i + 1}`;
                return (
                  <li key={item.title}>
                    <a
                      href={`#${id}`}
                      className={cn(
                        "transition-colors duration-200",
                        at === id
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-primary"
                      )}
                    >
                      {item.date}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-auto data-[orientation=vertical]:h-auto lg:block"
          />

          {/* Right: entries */}
          <div className="mx-auto flex max-w-prose flex-col gap-16 lg:gap-24">
            {feed.map((item, i) => {
              const id = `section-${i + 1}`;
              return (
                <div
                  key={id}
                  id={id}
                  ref={bind(id)}
                  className="scroll-m-20"
                >
                  {/* media with per-card overlay (transparent -> black) */}
                  <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
                  </div>

                  <span className="flex items-center gap-2">
                    <span className="border-muted-foreground size-2 shrink-0 rounded-full border" />
                    <p className="text-muted-foreground text-sm">{item.badge}</p>
                  </span>

                  <h3 className="mb-6 mt-2 text-3xl">{item.title}</h3>

                  {item.body}

                  <div className="border-border mt-6 flex items-end justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <Avatar src={item.avatar} alt={item.author} />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{item.author}</p>
                        <p className="text-muted-foreground text-sm">{item.role}</p>
                      </div>
                    </div>
                    <time className="text-muted-foreground text-sm">{item.date}</time>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
