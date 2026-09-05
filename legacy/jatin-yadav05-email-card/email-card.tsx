import { Card } from "./card"
import { Button } from "./button"
import { Input } from "./input"
import { Badge } from "./badge"

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-foreground/20 blur-2xl"></div>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Email Subscription Card</h1>
          <p className="text-muted-foreground">A minimal, polished interface</p>
        </div>

        <div className="gradient-border">
          <Card className="p-6 space-y-4 shadow-lg shadow-primary/5 border-0">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full input-border focus:ring-2 focus:ring-primary/5 focus:border-primary/10 transition-all duration-200"
              />
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs bg-foreground/10 text-foreground border-foreground/20">
                Active
              </Badge>
              <Button size="sm" className="px-6 bg-primary hover:bg-primary/90 transition-all duration-200 shadow-sm">
                Subscribe
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">Simple, clean, and functional design</p>
        </div>
      </div>
    </div>
  )
}
