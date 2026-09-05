import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Star } from "lucide-react"


export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 px-4 py-16 md:py-24 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.02] to-transparent"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24 items-center">
          {/* Left Column - CTA Content */}
          <div className="space-y-8">
            {/* Main Headline */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
                Shape Your Digital <span className="block">Fortune Today</span>
              </h2>

              <p className="text-lg text-gray-300 sm:text-xl lg:text-2xl max-w-2xl leading-relaxed">
                Hundreds of merchants have already made the move, what are you waiting on?
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button
                size="lg"
                variant="secondary"
                className="bg-gray-700/80 text-white hover:bg-gray-600/80 px-8 py-4 text-lg font-medium rounded-2xl backdrop-blur-sm border border-gray-600/50 transition-all duration-200"
              >
                <Play className="mr-3 h-5 w-5 fill-current" />
                Demo
              </Button>
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Sign up
              </Button>
            </div>
          </div>

          {/* Right Column - Testimonial Card */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md bg-gray-800/60 border-gray-700/50 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-8 space-y-6">
                {/* Star Rating */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-300 text-base leading-relaxed">
                  "Egestas nullam nulla pellentesque tempor est cursus. Auctor ante aenean amet dictumst quam. Tincidunt
                  sit eget neque viverra. Vitae et id in justo odio eget fermentum et facilisi. Eu in aliquet placerat
                  tincidunt. Tempus morbi ornare elementum"
                </blockquote>

                {/* User Profile */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-700/50">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face"
                    alt="James Cooper"
                    className="rounded-full ring-2 ring-gray-600/50 size-12"
                  />
                  <div>
                    <div className="text-white font-semibold text-lg">James Cooper</div>
                    <div className="text-gray-400 text-sm">Chief Marketing Officer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none"></div>
    </section>
  )
}
