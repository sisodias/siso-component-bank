import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

export default function IntegrationsSection() {
  return (
    <section>
      <div className="py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Integrate with your favorite tools
            </h2>
            <p className="text-muted-foreground mt-6">
              Connect seamlessly with popular platforms and services to enhance your workflow.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <IntegrationCard
              title="GitHub"
              description="Version control and collaboration platform for developers.">
              <GitHubLogo />
            </IntegrationCard>

            <IntegrationCard
              title="Slack"
              description="Team communication and collaboration hub.">
              <SlackLogo />
            </IntegrationCard>

            <IntegrationCard
              title="Notion"
              description="All-in-one workspace for notes, tasks, and projects.">
              <NotionLogo />
            </IntegrationCard>

            <IntegrationCard
              title="Figma"
              description="Collaborative design and prototyping platform.">
              <FigmaLogo />
            </IntegrationCard>

            <IntegrationCard
              title="Discord"
              description="Voice, video, and text chat platform for communities.">
              <DiscordLogo />
            </IntegrationCard>

            <IntegrationCard
              title="VS Code"
              description="Lightweight but powerful source code editor.">
              <VSCodeLogo />
            </IntegrationCard>
          </div>
        </div>
      </div>
    </section>
  )
}

const IntegrationCard = ({
  title,
  description,
  children,
  link = 'https://github.com/meschacirung/cnblocks',
}: {
  title: string
  description: string
  children: React.ReactNode
  link?: string
}) => {
  return (
    <Card className="p-6">
      <div className="relative">
        <div className="*:size-10">{children}</div>

        <div className="space-y-2 py-6">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
        </div>

        <div className="flex gap-3 border-t border-dashed pt-6">
          <Button asChild variant="secondary" size="sm" className="gap-1 pr-2 shadow-none">
            <Link href={link}>
              Learn More
              <ChevronRight className="ml-0 !size-3.5 opacity-50" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}

// --- Logos (inline SVG) ---
const GitHubLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-black">
    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577 
    0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 
    1.204.085 1.838 1.237 1.838 1.237 1.07 1.835 2.807 1.304 3.492.997.108-.775.42-1.304.763-1.604-2.665-.3-5.466-1.333-5.466-5.93 
    0-1.31.47-2.38 1.236-3.22-.124-.303-.536-1.52.117-3.167 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3-.404c1.02.004 2.045.137 
    3 .404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.647.243 2.864.12 3.167.77.84 1.235 1.91 1.235 3.22 
    0 4.61-2.803 5.625-5.475 5.92.431.372.816 1.102.816 2.222 0 1.606-.015 2.9-.015 3.293 
    0 .32.19.694.8.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)

const SlackLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-purple-600">
    <path d="M5.2 15.7a2.6 2.6 0 1 1 0 5.2H2.6a2.6 2.6 0 1 1 0-5.2H5.2zm1.3-1.3a2.6 2.6 0 1 1 0-5.2h2.6v5.2H6.5zm6.5-6.5a2.6 2.6 0 1 1 5.2 0v2.6h-5.2V7.9zm-1.3 1.3a2.6 2.6 0 1 1 0 5.2H9.1V9.2h2.6zm8.4 0a2.6 2.6 0 1 1 0 5.2h-2.6V9.2h2.6zM15.7 5.2a2.6 2.6 0 1 1 0 5.2h-2.6V5.2h2.6zM9.2 2.6a2.6 2.6 0 1 1 0 5.2H6.6V2.6h2.6z" />
  </svg>
)

const NotionLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-900">
    <path d="M4 3.5l16-1.5 0 19-16 1.5V3.5zm2 3.7v9.6l8 .6v-9.6l-8-.6z" />
  </svg>
)

const FigmaLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-pink-500">
    <path d="M12 4a4 4 0 100 8 4 4 0 000-8zM12 12a4 4 0 100 8 4 4 0 000-8zM4 4a4 4 0 100 8 4 4 0 000-8zM20 4a4 4 0 100 8 4 4 0 000-8zM12 20a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
)

const DiscordLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-indigo-500">
    <path d="M20 0H4C1.79 0 0 1.79 0 4v16c0 2.21 1.79 4 4 4h12l-1-3h5l1 3c2.21 0 4-1.79 4-4V4c0-2.21-1.79-4-4-4z" />
  </svg>
)

const VSCodeLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
    <path d="M4 3l16 9-16 9V3zm4 5v8l6-4-6-4z" />
  </svg>
)
