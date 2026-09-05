import { Button } from './button'

export function Component() {
    return (
        <main className="min-h-screen bg-background text-foreground flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse hidden dark:block dark:bg-blue-500/30" 
                     style={{animationDuration: '3s'}}>
                </div>
                <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] animate-pulse hidden dark:block dark:bg-blue-400/20" 
                     style={{animationDuration: '3.5s', animationDelay: '0.8s'}}>
                </div>
                <div className="absolute w-[300px] h-[300px] rounded-full blur-[80px] animate-pulse hidden dark:block dark:bg-blue-300/15" 
                     style={{animationDuration: '4s', animationDelay: '1.5s'}}>
                </div>
            </div>
            
            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="text-center">
                    <div className="space-y-8">
                        <h1 className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-bold">
                            The all-in-one productivity tool
                        </h1>
                        <p className="mx-auto mt-8 max-w-2xl text-balance text-xl text-foreground">
                            Streamline your workflow and collaborate seamlessly. <br></br>
                            Everything your team needs in one intuitive workspace.
                        </p>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <Button
                            size="lg"
                            className="group relative rounded-full px-8 py-6 text-lg font-semibold bg-foreground/10 backdrop-blur-md border border-foreground/20 text-foreground hover:bg-foreground/20 hover:border-foreground/30 transition-all duration-300 shadow-lg hover:shadow-xl dark:hover:shadow-blue-500/20">
                            <span className="flex items-center gap-2">
                                Try it now
                                <svg 
                                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    )
}