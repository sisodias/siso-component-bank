import { Button } from "./button"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

const members = [
  { src: 'https://avatars.githubusercontent.com/u/47919550?v=4', name: 'Meschac Irung', role: 'Frontend Engineer' },
  { src: 'https://avatars.githubusercontent.com/u/31113941?v=4', name: 'Bernard Ngandu', role: 'Backend Developer' },
  { src: 'https://avatars.githubusercontent.com/u/68236786?v=4', name: 'Theo Balick', role: 'UI/UX Designer' },
  { src: 'https://avatars.githubusercontent.com/u/99137927?v=4', name: 'Glodie Lukose', role: 'Project Manager' },
  { src: 'https://avatars.githubusercontent.com/u/12345678?v=4', name: 'Sarah Johnson', role: 'DevOps Engineer' },
  { src: 'https://avatars.githubusercontent.com/u/23456789?v=4', name: 'Michael Chen', role: 'QA Specialist' },
  { src: 'https://avatars.githubusercontent.com/u/34567890?v=4', name: 'Aisha Patel', role: 'Data Scientist' },
  { src: 'https://avatars.githubusercontent.com/u/45678901?v=4', name: 'Carlos Rodriguez', role: 'Product Manager' },
  { src: 'https://avatars.githubusercontent.com/u/56789012?v=4', name: 'Emma Wilson', role: 'Content Strategist' },
]

export default function TeamSection() {
  return (
    <section className="bg-muted/50">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 md:py-24">
        {/* Header */}
        <div className="mb-10 md:mb-12">
          <h2 className="text-foreground text-balance text-4xl font-semibold md:text-5xl">
            Meet Our Team
          </h2>
          <p className="text-muted-foreground mt-4 max-w-3xl text-pretty text-lg leading-relaxed">
            Our talented professionals bring diverse expertise and passion to every project. Together,
            we collaborate to deliver exceptional results and innovative solutions for our clients.
          </p>

          <Button asChild variant="outline" className="mt-6 h-9 rounded-full pr-2">
            <Link href="#">
              We&apos;re hiring
              <ChevronRight className="ml-1 size-4 opacity-60" />
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div
          role="list"
          aria-label="Team members"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {members.map((member, i) => (
            <div
              key={i}
              role="listitem"
              className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-(--radius) border bg-background p-3 shadow-sm ring-1 ring-foreground/5"
            >
              <Avatar className="rounded-(--radius) size-12 border border-transparent shadow ring-1 ring-foreground/10">
                <AvatarImage src={member.src} alt={member.name} />
                <AvatarFallback className="rounded-(--radius) text-base">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <span className="text-foreground block truncate text-[15px] font-semibold">
                  {member.name}
                </span>
                <span className="text-muted-foreground block truncate text-sm">
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
