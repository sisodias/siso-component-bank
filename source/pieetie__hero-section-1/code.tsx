import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export const Component = () => {
  return (
    <section className="min-h-screen bg-background text-foreground flex items-center relative overflow-hidden">

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-8xl font-black leading-none text-foreground tracking-tighter">
                AI THAT
                <br />
                <span className="bg-foreground text-background px-4 py-2 inline-block transform -rotate-1">AMPLIFIES</span>
                <br />
                YOUR VISION
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
                Transform ideas into stunning visuals in seconds, not hours. <br></br>
                <strong className="text-foreground"> No design experience required.</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-foreground hover:bg-foreground/90 text-background px-8 py-6 text-xl font-bold rounded-none transition-all duration-200 hover:scale-105 shadow-lg"
              >
                START CREATING FOR FREE
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-foreground text-foreground hover:bg-foreground hover:text-background px-8 py-6 text-xl font-bold rounded-none transition-all duration-200 bg-transparent"
              >
                <Play className="mr-3 h-6 w-6" />
                WATCH DEMO
              </Button>
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-6 font-bold uppercase tracking-wider">
              ⚡ TRUSTED BY 50,000+ CREATIVE TEAMS
              </p>
              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-black text-foreground">50K+</div>
                  <div className="text-sm text-muted-foreground font-medium">USERS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-foreground">10M+</div>
                  <div className="text-sm text-muted-foreground font-medium">CREATIONS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-foreground">4.9/5</div>
                  <div className="text-sm text-muted-foreground font-medium">RATING</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}