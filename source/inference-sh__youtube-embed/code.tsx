'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  className?: string
}

export function YouTubeEmbed({ videoId, title, className }: YouTubeEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn(
      'flex flex-col space-y-4 w-full h-full relative rounded-xl overflow-hidden border border-border',
      className
    )}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || 'YouTube video player'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        className={cn(
          'w-full aspect-video h-full bg-transparent transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      />
    </div>
  )
}


export default YouTubeEmbed;
