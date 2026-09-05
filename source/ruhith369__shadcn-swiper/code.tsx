'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface CardData {
  id: number
  imageUrl: string
  title: string
  description: string
}

interface ShadcnSwiperProps {
  cards: CardData[]
  cardWidth?: number
  cardHeight?: number
  className?: string
}

export const ShadcnSwiper: React.FC<ShadcnSwiperProps> = ({
  cards,
  cardWidth = 300,
  cardHeight = 400,
  className = '',
}) => {
  const cardStackRef = useRef<HTMLDivElement>(null)
  const isSwiping = useRef(false)
  const startX = useRef(0)
  const currentX = useRef(0)
  const animationFrameId = useRef<number | null>(null)
  const [cardOrder, setCardOrder] = useState<number[]>(() =>
    Array.from({ length: cards.length }, (_, i) => i)
  )

  const getCards = useCallback((): HTMLElement[] => {
    if (!cardStackRef.current) return []
    return Array.from(cardStackRef.current.querySelectorAll('.swiper-card'))
  }, [])

  const getActiveCard = useCallback((): HTMLElement | null => {
    return getCards()[0] || null
  }, [getCards])

  const updateCardPositions = useCallback(() => {
    getCards().forEach((card, i) => {
      card.style.setProperty('--i', i.toString())
      card.style.setProperty('--swipe-x', '0px')
      card.style.setProperty('--swipe-rotate', '0deg')
      card.style.opacity = '1'
      card.style.transition = 'transform 0.5s ease, opacity 0.5s ease'
    })
  }, [getCards])

  const applySwipeStyles = useCallback(
    (deltaX: number) => {
      const card = getActiveCard()
      if (!card) return
      const rotation = deltaX * 0.08
      const opacity = 1 - Math.abs(deltaX) / (cardWidth * 1.5)
      card.style.setProperty('--swipe-x', `${deltaX}px`)
      card.style.setProperty('--swipe-rotate', `${rotation}deg`)
      card.style.opacity = opacity.toString()
    },
    [getActiveCard, cardWidth]
  )

  const handleStart = useCallback(
    (clientX: number) => {
      if (isSwiping.current) return
      isSwiping.current = true
      startX.current = clientX
      currentX.current = clientX
      const card = getActiveCard()
      if (card) card.style.transition = 'none'
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    },
    [getActiveCard]
  )

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isSwiping.current) return
      currentX.current = clientX
      animationFrameId.current = requestAnimationFrame(() => {
        const deltaX = currentX.current - startX.current
        applySwipeStyles(deltaX)
      })
    },
    [applySwipeStyles]
  )

  const handleEnd = useCallback(() => {
    if (!isSwiping.current) return
    isSwiping.current = false
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    const deltaX = currentX.current - startX.current
    const threshold = cardWidth / 3
    const card = getActiveCard()
    if (!card) return

    card.style.transition = 'transform 0.3s ease, opacity 0.3s ease'

    if (Math.abs(deltaX) > threshold) {
      const direction = Math.sign(deltaX)
      const swipeOutX = direction * (cardWidth * 1.5)
      card.style.setProperty('--swipe-x', `${swipeOutX}px`)
      card.style.setProperty('--swipe-rotate', `${direction * 15}deg`)
      card.style.opacity = '0'
      setTimeout(() => {
        setCardOrder(prev => [...prev.slice(1), prev[0]])
      }, 300)
    } else {
      applySwipeStyles(0)
    }
  }, [getActiveCard, applySwipeStyles, cardWidth])

  useEffect(() => {
    const el = cardStackRef.current
    if (!el) return
    const onDown = (e: PointerEvent) => handleStart(e.clientX)
    const onMove = (e: PointerEvent) => handleMove(e.clientX)
    const onUp = () => handleEnd()
    const onLeave = () => handleEnd()

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointerleave', onLeave)

    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [handleStart, handleMove, handleEnd])

  useEffect(() => {
    updateCardPositions()
  }, [cardOrder, updateCardPositions])

  return (
    <section
      ref={cardStackRef}
      className={`relative grid place-content-center select-none ${className}`}
      style={{
        width: cardWidth + 40,
        height: cardHeight + 40,
        perspective: '1000px',
        touchAction: 'none',
      }}
    >
      {cardOrder.map((originalIndex, displayIndex) => {
        const card = cards[originalIndex]
        return (
          <Card
            key={card.id}
            className={`swiper-card absolute place-self-center overflow-hidden rounded-3xl 
              shadow-lg border border-border/50 bg-gradient-to-br 
              from-background/80 to-muted/60 backdrop-blur-md transition-transform`}
            style={{
              '--i': displayIndex.toString(),
              '--swipe-x': '0px',
              '--swipe-rotate': '0deg',
              width: cardWidth,
              height: cardHeight,
              zIndex: cards.length - displayIndex,
              transform: `
                translateY(calc(var(--i) * 14px))
                translateZ(calc(var(--i) * -45px))
                translateX(var(--swipe-x))
                rotate(var(--swipe-rotate))
              `,
            } as React.CSSProperties}
          >
            <img
              src={card.imageUrl}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <CardContent className="absolute bottom-0 left-0 right-0 p-5 text-white space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight">{card.title}</h3>
              <p className="text-sm text-slate-200/90">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
