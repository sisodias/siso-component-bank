import React from 'react'
import { cn } from "../_utils/cn"
import { Badge } from "./badge"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { Check, Info, X } from 'lucide-react'

interface PricingFeature {
  text: string
  included: boolean
  hasInfo?: boolean
}

interface PricingTier {
  name: string
  subtitle?: string
  price?: string
  period?: string
  description: string
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  features: PricingFeature[]
  buttonText: string
  buttonVariant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  highlighted?: boolean
  footerText?: string
  footerLink?: string
}

interface PricingComponentProps {
  title?: string
  subtitle?: string
  tiers: PricingTier[]
  className?: string
}

const PricingComponent: React.FC<PricingComponentProps> = ({
  title = "Simple pricing.",
  subtitle = "Pay for what matters. Enjoy everything else.",
  tiers,
  className
}) => {
  return (
    <div className={cn("w-full min-h-screen bg-background", className)}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light text-foreground mb-6">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            {subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 max-md:gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <Card 
              key={index}
              className={cn(
                "relative flex flex-col h-full transition-all duration-300 border-border/50",
                tier.highlighted 
                  ? "bg-gradient-to-b from-card/80 to-muted/20 border-border/70 shadow-2xl dark:from-gray-900/80 dark:to-gray-800/60 dark:border-gray-700/70 md:scale-105 md:bottom-4 z-20" 
                  : "bg-card/40 border-border/40 hover:bg-card/60 dark:bg-gray-900/40 dark:border-gray-800/40 dark:hover:bg-gray-900/60"
              )}
              style={{
                backdropFilter: "blur(10px)"
              }}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white dark:text-black text-xs font-bold px-4 py-1.5 rounded-full">
                    {tier.badge.text}
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-12">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] mb-4">
                  {tier.subtitle}
                </div>
                <CardTitle className="mb-6">
                  {tier.price ? (
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-light text-foreground">{tier.price}</span>
                      {tier.period && (
                        <span className="text-lg font-light text-muted-foreground ml-2">
                          {tier.period}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-5xl font-light text-foreground">{tier.name}</div>
                  )}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-base font-light leading-relaxed px-4">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 px-8">
                <div className="mb-8">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] mb-6">
                    PLAN HIGHLIGHTS
                  </h4>
                  <div className="space-y-4">
                    {tier.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className="flex items-start gap-3"
                      >
                        {feature.included ? <Check className="h-4 w-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" /> : <X className="h-4 w-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />}
                        <span className="text-foreground text-sm font-light flex items-center gap-2 leading-relaxed">
                          {feature.text}
                          {feature.hasInfo && (
                            <Info className="h-3 w-3 text-muted-foreground" />
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-8 pb-8">
                <div className="w-full">
                  {tier.highlighted ? (
                    <Button 
                      className="w-full py-4 text-sm font-medium bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white dark:text-black border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {tier.buttonText}
                    </Button>
                  ) : (
                    <Button 
                      className={cn(
                        "w-full py-4 text-sm font-medium transition-all duration-300",
                        "bg-muted/80 hover:bg-muted text-foreground border-border/50",
                        "dark:bg-gray-700/80 dark:hover:bg-gray-600/80 dark:text-white dark:border-gray-600/50"
                      )}
                      variant="secondary"
                    >
                      {tier.buttonText}
                    </Button>
                  )}
                  {tier.footerText && (
                    <div className="text-center mt-6">
                      <p className="text-xs text-muted-foreground font-light">
                        {tier.footerText}{' '}
                        {tier.footerLink && (
                          <button className="text-primary hover:text-primary/80 underline transition-colors">
                            {tier.footerLink}
                          </button>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PricingComponent