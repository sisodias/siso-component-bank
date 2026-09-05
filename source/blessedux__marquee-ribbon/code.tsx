const defaultItems = [
  "WEB, PRODUCT & BRAND DESIGN",
  "DEVELOPMENT, UI/UX & PROTOTYPING",
  "CONTENT, VIDEO & PHOTOGRAPHY",
  "SOCIAL & DIGITAL PRESENCE — FULLY MANAGED",
  "ALL YOUR DESIGN NEEDS, ONE SUBSCRIPTION",
  "NO FREELANCERS. NO BACK-AND-FORTH.",
  "ONGOING UPDATES & IMPROVEMENTS",
  "DESIGN, FULLY HANDLED",
] as const;

export function Component() {
  const loop = [...defaultItems, ...defaultItems, ...defaultItems, ...defaultItems];

  return (
    <section className="py-8 overflow-hidden">
      <div className="bg-blue-600 py-4 -rotate-1 scale-105">
        <div className="flex animate-marquee whitespace-nowrap">
          {loop.map((item, index) => (
            <div key={index} className="flex items-center mx-8">
              <span className="mr-6 h-2 w-2 rounded-full bg-white" />
              <span className="text-sm font-semibold uppercase tracking-wide text-white">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="-mt-2 bg-zinc-900 py-4 rotate-1 scale-105">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {loop.map((item, index) => (
            <div key={index} className="flex items-center mx-8">
              <span className="mr-6 h-2 w-2 rounded-full bg-zinc-500" />
              <span className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}