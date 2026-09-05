import { Card } from '@/components/ui/card'

type Stat = {
  value: string
  label: string
}

const STATS: Stat[] = [
  { value: '+1200', label: 'Stars on GitHub' },
  { value: '56%', label: 'Conversion rate' },
  { value: '+500', label: 'Powered Apps' },
]

export default function StatsSection() {
  return (
    <section className="bg-muted py-12 md:py-20">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <Card
          role="list"
          aria-label="Key product stats"
          className={[
            // Always 3 columns, never wrap
            "grid grid-cols-3",
            // Equal width and spacing
            "gap-2 sm:gap-4 md:gap-6",
            "p-3 sm:p-4 md:p-6",
            // Vertical dividers between items
            "divide-x",
          ].join(' ')}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              role="listitem"
              className="flex flex-col items-center justify-center px-3 text-center"
            >
              <div
                className={[
                  "text-foreground font-semibold tracking-tight whitespace-nowrap",
                  // Fluid font size
                  "text-[clamp(1.75rem,5vw,2.5rem)] leading-none",
                ].join(' ')}
              >
                {s.value}
              </div>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                {s.label}
              </p>
            </div>
          ))}
        </Card>
      </div>
    </section>
  )
}
