import { Button } from './button'

interface ComponentProps {
  title: string
  highlightedText: string
  description: string
  primaryButtonText: string
  secondaryButtonText: string
  primaryButtonIcon?: React.ReactNode
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
}

export function Component({
  title,
  highlightedText,
  description,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonIcon,
  onPrimaryClick,
  onSecondaryClick
}: ComponentProps) {
    return (
        <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center">
                    <div className="space-y-8">
                        <h1 className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-bold drop-shadow-lg leading-tight">
                            {title} <span className="italic drop-shadow-md bg-blue-200 dark:bg-white dark:text-black leading-none">{highlightedText}</span>
                        </h1>
                        <p className="mx-auto mt-8 max-w-2xl text-balance text-xl text-muted-foreground drop-shadow-sm">
                            {description}
                        </p>
                    </div>

                    <div className="mt-12 flex flex-col items-center justify-center gap-4">
                        <Button
                            size="lg"
                            onClick={onPrimaryClick}
                            className="rounded-full px-6 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3">
                            {primaryButtonIcon}
                            <span className="text-nowrap">{primaryButtonText}</span>
                        </Button>
                        
                        <button onClick={onSecondaryClick} className="text-muted-foreground hover:text-foreground transition-colors duration-200 underline text-base bg-transparent border-none cursor-pointer">
                            {secondaryButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}