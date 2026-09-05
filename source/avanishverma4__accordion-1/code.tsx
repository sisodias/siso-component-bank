"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sun, Moon } from 'lucide-react'

interface AccordionItem {
  id: string
  title: string
  content: string
}

interface VintageAccordionProps {
  items?: AccordionItem[]
  className?: string
}

// Custom Button Component
const Button: React.FC<{
  onClick?: () => void
  variant?: 'outline'
  size?: 'icon'
  className?: string
  children: React.ReactNode
}> = ({ onClick, className = '', children }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    >
      {children}
    </button>
  )
}

// Custom Card Component
const Card: React.FC<{
  className?: string
  children: React.ReactNode
}> = ({ className = '', children }) => {
  return (
    <div className={`rounded-lg ${className}`}>
      {children}
    </div>
  )
}

const VintageAccordion: React.FC<VintageAccordionProps> = ({
  items = [
    {
      id: '1',
      title: 'The Golden Age of Typography',
      content: 'Discover the timeless elegance of classic typefaces that have shaped the world of design for centuries. From the ornate scripts of the Victorian era to the clean lines of Art Deco, typography tells the story of human creativity and expression.'
    },
    {
      id: '2',
      title: 'Vintage Color Palettes',
      content: 'Explore the warm, muted tones that define vintage aesthetics. Sepia browns, dusty roses, and faded golds create an atmosphere of nostalgia and sophistication that transcends time and trends.'
    },
    {
      id: '3',
      title: 'Craftsmanship & Detail',
      content: 'In an age of mass production, vintage design reminds us of the beauty found in handcrafted details. Every curve, every ornament, and every flourish was carefully considered and lovingly executed by skilled artisans.'
    },
    {
      id: '4',
      title: 'Timeless Design Principles',
      content: 'The enduring appeal of vintage design lies in its adherence to fundamental principles of balance, proportion, and harmony. These elements create compositions that feel both familiar and eternally fresh.'
    }
  ],
  className = ''
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [isDark, setIsDark] = useState(false)

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <div className={`w-full min-h-screen transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900' 
        : 'bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100'
    } ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${
              isDark ? 'text-amber-100' : 'text-amber-900'
            }`}>
              Vintage Collection
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-amber-200/80' : 'text-amber-800/80'
            }`}>
              Timeless elegance meets modern functionality
            </p>
          </div>
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className={`${
              isDark 
                ? 'border border-amber-700 bg-amber-900/50 hover:bg-amber-800/50 text-amber-200 focus:ring-amber-600' 
                : 'border border-amber-300 bg-amber-100/50 hover:bg-amber-200/50 text-amber-800 focus:ring-amber-400'
            }`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Accordion */}
        <Card className={`${
          isDark 
            ? 'bg-amber-900/30 border border-amber-700/50 backdrop-blur-sm' 
            : 'bg-amber-50/50 border border-amber-200/50 backdrop-blur-sm'
        } shadow-2xl`}>
          <div className="p-6">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg overflow-hidden ${
                    isDark 
                      ? 'border-amber-700/30 bg-amber-800/20' 
                      : 'border-amber-200/50 bg-white/30'
                  } backdrop-blur-sm`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-full px-6 py-4 text-left flex justify-between items-center transition-colors duration-200 ${
                      isDark 
                        ? 'hover:bg-amber-800/30 text-amber-100' 
                        : 'hover:bg-amber-100/50 text-amber-900'
                    }`}
                  >
                    <span className="text-lg font-semibold">{item.title}</span>
                    <motion.div
                      animate={{ rotate: openItems.has(item.id) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className={`h-5 w-5 ${
                        isDark ? 'text-amber-300' : 'text-amber-700'
                      }`} />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openItems.has(item.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className={`px-6 pb-4 ${
                          isDark ? 'text-amber-200/90' : 'text-amber-800/90'
                        }`}>
                          <motion.p
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="leading-relaxed"
                          >
                            {item.content}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${
            isDark ? 'text-amber-300/60' : 'text-amber-700/60'
          }`}>
            Crafted with attention to detail and timeless design principles
          </p>
        </div>
      </div>
    </div>
  )
}

export default VintageAccordion