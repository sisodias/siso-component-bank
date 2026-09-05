'use client'

import * as React from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { cn } from "../_utils/cn"
import { Button, type ButtonProps } from "./button"

interface AnimatedFeatureSpotlight3DProps extends React.HTMLAttributes<HTMLElement> {
  preheaderIcon?: React.ReactNode
  preheaderText: string
  heading: React.ReactNode
  description: string
  buttonText: string
  buttonProps?: ButtonProps
  imageUrl: string
  imageAlt?: string
}

export const AnimatedFeatureSpotlight3D = React.forwardRef<
  HTMLElement,
  AnimatedFeatureSpotlight3DProps
>(
  (
    {
      className,
      preheaderIcon,
      preheaderText,
      heading,
      description,
      buttonText,
      buttonProps,
      imageUrl,
      imageAlt = 'Feature image',
      ...props
    },
    ref
  ) => {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useTransform(y, [-100, 100], [15, -15])
    const rotateY = useTransform(x, [-100, 100], [-15, 15])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const offsetX = e.clientX - rect.left - rect.width / 2
      const offsetY = e.clientY - rect.top - rect.height / 2
      x.set(offsetX)
      y.set(offsetY)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    return (
      <section
        ref={ref}
        className={cn(
          'w-full max-w-6xl mx-auto p-8 md:p-12 rounded-2xl bg-background border overflow-hidden',
          className
        )}
        aria-labelledby="feature-spotlight-heading"
        {...props}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-6 text-center md:text-left items-center md:items-start"
          >
            <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
              {preheaderIcon}
              <span>{preheaderText}</span>
            </div>
            <motion.h2
              id="feature-spotlight-heading"
              className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {heading}
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Button size="lg" {...buttonProps}>
                {buttonText}
              </Button>
            </motion.div>
          </motion.div>

          {/* Image Section with 3D Hover */}
          <motion.div
            className="relative w-full min-h-[250px] md:min-h-[320px] flex items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1000 }}
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                x,
                y,
                transformStyle: 'preserve-3d',
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-full max-w-md relative"
            >
              <motion.img
                src={imageUrl}
                alt={imageAlt}
                className="w-full object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    )
  }
)

AnimatedFeatureSpotlight3D.displayName = 'AnimatedFeatureSpotlight3D'
