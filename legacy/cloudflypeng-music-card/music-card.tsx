'use client'
import { useState, useEffect, useRef } from 'react'

import { Howl } from 'howler'
import { CirclePlay, CirclePause, SkipForward, SkipBack } from 'lucide-react'

interface MusicCardProps {
  src: string;
  poster: string;
  autoPlay?: boolean;
  mainColor?: string;
  title?: string;
  artist?: string;
}

export function MusicCard ({ src, poster, autoPlay = false, mainColor = '#3b82f6', title = 'Unknown Title', artist = 'Unknown Artist' }: MusicCardProps){

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const howler = useRef<Howl | null>(null)
  const progressInterval = useRef<NodeJS.Timer>()

  useEffect(() => {
    if (howler.current) {
      howler.current.stop()
      clearInterval(progressInterval.current)
    }

    const sound = new Howl({
      src,
      onpause: () => {
        setIsPlaying(false)
        clearInterval(progressInterval.current)
      },
      onplay: () => {
        setIsPlaying(true)
        updateProgress()
      },
      onend: () => {
        setIsPlaying(false)
        clearInterval(progressInterval.current)
        setProgress(0)
      },
      onstop: () => {
        setIsPlaying(false)
        clearInterval(progressInterval.current)
        setProgress(0)
      },
      onload: () => {
        setDuration(sound.duration())
      }
    })

    howler.current = sound

    if (autoPlay) {
      sound.play()
    }

    return () => {
      clearInterval(progressInterval.current)
    }
  }, [src])

  const updateProgress = () => {
    if (!howler.current) return

    progressInterval.current = setInterval(() => {
      const seek = howler.current?.seek() || 0
      setProgress(seek)
    }, 1000)
  }

  const handlePlayPause = () => {
    if (!howler.current) return

    setIsPlaying(!isPlaying)

    if (isPlaying) {
      howler.current.pause()
    } else {
      howler.current.play()
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!howler.current) return

    const container = e.currentTarget
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newPosition = percentage * duration

    howler.current.seek(newPosition)
    setProgress(newPosition)
  }

  const handleSkip = (direction: 'forward' | 'backward') => {
    if (!howler.current) return

    const currentTime = howler.current.seek() as number
    const skipAmount = 10 // 10秒
    const newTime = direction === 'forward'
      ? Math.min(currentTime + skipAmount, duration)
      : Math.max(currentTime - skipAmount, 0)

    howler.current.seek(newTime)
    setProgress(newTime)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const cardStyle = {
    '--main-color': mainColor,
    '--hover-color': `${mainColor}33`, // 添加透明度为0.2的主题色
  } as React.CSSProperties

  return (
    <section
      className="w-[20rem] bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl p-4 
        shadow-xl hover:shadow-2xl transition-all duration-300 
        hover:bg-white/20 dark:hover:bg-black/30"
      style={cardStyle}
    >
      {/* 海报图片容器 */}
      <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden group bg-gray-100">
        <img
          src={poster}
          alt="music poster"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* 音乐信息 */}
      <div className="mb-4 px-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {artist}
        </p>
      </div>

      {/* 进度条 */}
      <div className="mb-4 px-2">
        <div
          className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer group"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-[var(--main-color)] rounded-full relative"
            style={{ width: `${(progress / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 
              bg-[var(--main-color)] rounded-full shadow-md transform scale-0 
              group-hover:scale-100 transition-transform"
            />
          </div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-between px-4">
        <button
          onClick={() => handleSkip('backward')}
          className="p-2 text-gray-600 dark:text-gray-400 
            hover:text-[var(--main-color)] dark:hover:text-[var(--main-color)] 
            transition-colors"
          title="后退 10 秒"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        <button
          onClick={handlePlayPause}
          className="p-2 text-[var(--main-color)] hover:opacity-80 transition-colors"
        >
          {isPlaying ?
            <CirclePause className="w-8 h-8" /> :
            <CirclePlay className="w-8 h-8" />
          }
        </button>
        <button
          onClick={() => handleSkip('forward')}
          className="p-2 text-gray-600 dark:text-gray-400 
            hover:text-[var(--main-color)] dark:hover:text-[var(--main-color)] 
            transition-colors"
          title="前进 10 秒"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>
    </section>
  )
}
