import { cn } from "@/lib/utils";
import { useState, useEffect } from "react"
import { Mail, CheckCircle2, Clock } from "lucide-react"
import { Button } from "./button"

export const Component = () => {
  const [displayText, setDisplayText] = useState("")
  const [progress, setProgress] = useState(0)
  const fullText = "We're Under Maintenance"
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return prev + Math.random() * 15
      })
    }, 800)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-foreground overflow-hidden flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="p-12 md:p-16">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 dark:bg-blue-950 rounded-full blur-xl opacity-50" />
              <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-full border border-blue-200 dark:border-blue-800">
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-center mb-6 tracking-tight text-slate-900 dark:text-slate-50">
            <span>{displayText}</span>
            <span className="animate-pulse ml-1 text-blue-600 dark:text-blue-400">_</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-slate-600 dark:text-slate-400 text-center mb-10 leading-relaxed font-light">
            We're making improvements to serve you better. Our team is working hard to bring you an enhanced experience.
          </p>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Maintenance Progress</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{Math.round(progress)}%</span>
            </div>
            <div className="relative h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-50">In Progress</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Expected
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-50">2-4 Hours</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Updates
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-50">Real-time</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white border-0 font-semibold px-8 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={() => setIsLoading(!isLoading)}
            >
              <Mail className="w-4 h-4 mr-2" />
              {isLoading ? "Subscribing..." : "Notify Me"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold px-8 bg-transparent"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Check Status
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-6">
            <p className="mb-2">Need assistance?</p>
            <a
              href="mailto:support@example.com"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
            >
              support@example.com
            </a>
          </div>
        </div>
      </div>
    </main>
    </>
  );
};
