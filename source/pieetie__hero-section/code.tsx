import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Sparkles, Users, Zap } from "lucide-react"

export const Component = () => {
  return (
    <section className="relative min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge
            variant="secondary"
            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="mr-1">💫</span>
            For Creative Teams
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
            Turn Ideas into{" "}
            <span className="bg-gradient-to-r from-gray-600 to-gray-800 dark:from-yellow-300 dark:to-yellow-500 bg-clip-text text-transparent">Reality</span>{" "}
            with AI-Powered Design
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            Generate, iterate, and perfect your creative vision 10x faster with intelligent design assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Start Creating Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-8 py-4 text-lg font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>
          <div className="pt-12 space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Trusted by 50,000+ creative professionals</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">50K+ Users</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">1M+ Designs</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}