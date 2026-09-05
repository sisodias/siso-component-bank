import { Button } from './button'

interface ComponentProps {
  title: string
  description: string
  primaryButtonText: string
  primaryButtonHref?: string
  secondaryButtonText: string
  secondaryButtonHref?: string
}

export function Component({ 
  title, 
  description, 
  primaryButtonText, 
  primaryButtonHref, 
  secondaryButtonText, 
  secondaryButtonHref 
}: ComponentProps) {
    return (
        <main className="min-h-screen bg-gradient-to-t from-blue-200 via-blue-50 to-blue-200 dark:bg-gradient-to-t dark:from-background dark:via-background dark:to-background flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 dark:hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(147,197,253,0.1),transparent_60%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(191,219,254,0.1),transparent_60%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_80%)] animate-pulse"></div>
            </div>

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="text-center p-12 md:p-16 lg:p-20">
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <div className="space-y-6 text-center">
                            <h1 className="max-w-4xl mx-auto text-balance text-6xl md:text-7xl xl:text-[5.25rem] font-bold leading-tight text-foreground">
                                {title}
                            </h1>
                            <p className="mx-auto max-w-2xl text-balance text-xl text-muted-foreground">
                                {description}
                            </p>
                        </div>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                size="lg"
                                className="rounded-full px-6 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 dark:bg-white dark:text-black dark:hover:bg-white/90"
                                onClick={() => primaryButtonHref && window.open(primaryButtonHref, '_blank')}>
                                <svg className="w-5 h-5 -mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                <span className="text-nowrap">{primaryButtonText}</span>
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full px-6 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                                onClick={() => secondaryButtonHref && window.open(secondaryButtonHref, '_blank')}>
                                {secondaryButtonText}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}