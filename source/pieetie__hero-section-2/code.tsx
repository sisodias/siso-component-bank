import { Button } from './button'

interface ComponentProps {
    title: string;
    highlightedText: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
}

export function Component({ 
    title, 
    highlightedText, 
    description, 
    primaryButtonText, 
    secondaryButtonText 
}: ComponentProps) {
    return (
        <main className="h-screen w-full bg-background text-foreground flex items-center justify-center relative overflow-hidden">
            {/* Enhanced Lightning/Beam effects */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Full screen base glow */}
                <div className="absolute inset-0 bg-gradient-radial from-blue-500/15 via-blue-600/3 to-transparent opacity-60"></div>
                
                {/* Main central glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[1200px] opacity-8 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-blue-600/5 to-transparent blur-3xl"></div>
                </div>
                
                {/* Animated beams */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-full opacity-12 animate-pulse" style={{animationDelay: '1s', animationDuration: '4s'}}>
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-400/15 via-blue-500/8 to-transparent blur-2xl"></div>
                </div>
                
                {/* Side beams with smooth animation */}
                <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[400px] h-full opacity-10 rotate-12 animate-pulse" style={{animationDelay: '0.5s', animationDuration: '3s'}}>
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-300/20 via-blue-400/10 to-transparent blur-xl"></div>
                </div>
                <div className="absolute top-0 right-1/3 translate-x-1/2 w-[400px] h-full opacity-10 -rotate-12 animate-pulse" style={{animationDelay: '1.5s', animationDuration: '3s'}}>
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-300/20 via-blue-400/10 to-transparent blur-xl"></div>
                </div>
                
                {/* Corner coverage beams */}
                <div className="absolute top-0 left-0 w-[600px] h-[800px] opacity-8 rotate-45 animate-pulse" style={{animationDelay: '2.5s', animationDuration: '4s'}}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200/15 via-blue-300/8 to-transparent blur-xl"></div>
                </div>
                <div className="absolute top-0 right-0 w-[600px] h-[800px] opacity-8 -rotate-45 animate-pulse" style={{animationDelay: '3s', animationDuration: '4s'}}>
                    <div className="absolute inset-0 bg-gradient-to-bl from-blue-200/15 via-blue-300/8 to-transparent blur-xl"></div>
                </div>
                
                {/* Subtle accent beams */}
                <div className="absolute top-0 left-1/4 w-[200px] h-full opacity-8 rotate-6 animate-pulse" style={{animationDelay: '2s', animationDuration: '5s'}}>
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-200/25 via-blue-300/12 to-transparent blur-lg"></div>
                </div>
                <div className="absolute top-0 right-1/4 w-[200px] h-full opacity-8 -rotate-6 animate-pulse" style={{animationDelay: '0.8s', animationDuration: '5s'}}>
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-200/25 via-blue-300/12 to-transparent blur-lg"></div>
                </div>
                
                {/* Central intense beam */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-full opacity-15 animate-pulse" style={{animationDelay: '1.2s', animationDuration: '2.5s'}}>
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-100/40 via-blue-200/20 to-transparent blur-sm"></div>
                </div>
                
                {/* Ambient glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/5 via-transparent to-transparent"></div>
            </div>

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="text-center">
                    <div className="space-y-8">
                        <h1 className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-bold drop-shadow-lg">
                            {title} <span className="italic underline drop-shadow-md">{highlightedText}</span>
                        </h1>
                        <p className="mx-auto mt-8 max-w-2xl text-balance text-xl text-muted-foreground drop-shadow-sm">
                            {description}
                        </p>
                    </div>

                    <div className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
                        <Button
                            size="lg"
                            className="rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-400/15 transition-all duration-300 backdrop-blur-sm">
                            <span className="text-nowrap">{primaryButtonText}</span>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-2xl px-8 py-6 text-lg font-semibold border-2 hover:bg-accent/50 transition-all duration-300 backdrop-blur-sm">
                            <span className="text-nowrap">{secondaryButtonText}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    )
}