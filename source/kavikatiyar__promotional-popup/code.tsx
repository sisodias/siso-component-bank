import { useState, type ReactNode } from "react"
import { X, Zap } from "lucide-react"

export interface FeatureItem {
  title: string
  description: string
}

export interface PromotionalPopupProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  onCancel?: () => void
  title: string
  subtitle: string
  description: string
  features: FeatureItem[]
  ctaText: string
  cancelText?: string
  rightContent: ReactNode
  iconColor?: string
}

export default function PromotionalPopup({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  subtitle,
  description,
  features,
  ctaText,
  cancelText = "No thanks",
  rightContent,
  iconColor = "text-blue-600",
}: PromotionalPopupProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-accent rounded-lg transition-colors duration-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-hidden">
          {/* Left Content */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 text-white flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
            {/* Icon and Headline */}
            <div className="animate-in slide-in-from-left-8 fade-in duration-500">
              <div
                className={`w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 ${iconColor}`}
              >
                <Zap className="w-6 h-6" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{title}</h1>

              <p className="text-slate-300 text-base md:text-lg mb-8">{description}</p>
            </div>

            {/* Features Timeline */}
            <div className="space-y-6 flex-1 min-h-0">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="animate-in fade-in duration-500"
                  style={{
                    animationDelay: `${(index + 1) * 100}ms`,
                    animationFillMode: "both",
                  }}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  {/* Timeline Connector */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex-shrink-0 ${
                          hoveredFeature === index
                            ? "border-blue-400 bg-blue-500/30 scale-110"
                            : "border-slate-600 bg-transparent"
                        }`}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              hoveredFeature === index ? "bg-blue-400" : "bg-slate-400"
                            }`}
                          />
                        </div>
                      </div>
                      {index < features.length - 1 && (
                        <div className="w-0.5 h-12 bg-gradient-to-b from-slate-600 to-transparent mt-2" />
                      )}
                    </div>

                    <div className="pt-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-slate-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="p-8 md:p-12 bg-background overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-gray-100 dark:scrollbar-track-gray-900 flex flex-col animate-in slide-in-from-right-8 fade-in duration-500">
            {/* Event Preview Section */}
            <div className="flex-1">
              <div className="mb-8 animate-in slide-in-from-right-8 fade-in duration-500 delay-100">
                <h2 className="text-2xl font-bold mb-2 text-balance">{subtitle}</h2>
              </div>

              <div className="mb-8 animate-in slide-in-from-right-8 fade-in duration-500 delay-150">{rightContent}</div>
            </div>

            <div className="flex gap-3 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-200 mt-auto pt-6 border-t border-border">
              <button
                onClick={onCancel || onClose}
                className="flex-1 px-6 py-3 text-foreground font-semibold rounded-lg border border-border hover:bg-accent transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {cancelText}
              </button>

              <button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              >
                {ctaText}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}
