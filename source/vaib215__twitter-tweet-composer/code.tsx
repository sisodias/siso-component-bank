"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Image, 
  Smile, 
  Calendar, 
  MapPin, 
  Plus,
  X,
  Globe,
  Users,
  Lock
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Tweet {
  id: string
  content: string
  characterCount: number
}

export interface TweetComposerProps {
  className?: string
  placeholder?: string
  maxCharacters?: number
  userAvatar?: string
  userName?: string
  userHandle?: string
  onTweet?: (tweets: Tweet[]) => void
  onCancel?: () => void
}

export const TweetComposer: React.FC<TweetComposerProps> = ({
  className,
  placeholder = "What's happening?",
  maxCharacters = 280,
  userAvatar,
  userName = "User",
  userHandle = "@user",
  onTweet,
  onCancel
}) => {
  const [tweets, setTweets] = useState<Tweet[]>([
    { id: '1', content: '', characterCount: 0 }
  ])
  const [isExpanded, setIsExpanded] = useState(false)
  const [privacy, setPrivacy] = useState<'everyone' | 'followers' | 'mentioned'>('everyone')
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([])

  // Auto-resize textarea
  const adjustTextareaHeight = (index: number) => {
    const textarea = textareaRefs.current[index]
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }

  // Handle content change
  const handleContentChange = (index: number, content: string) => {
    const newTweets = [...tweets]
    newTweets[index] = {
      ...newTweets[index],
      content,
      characterCount: content.length
    }
    setTweets(newTweets)
    adjustTextareaHeight(index)
  }

  // Add new thread tweet
  const addTweetToThread = () => {
    const newTweet: Tweet = {
      id: (tweets.length + 1).toString(),
      content: '',
      characterCount: 0
    }
    setTweets([...tweets, newTweet])
  }

  // Remove tweet from thread
  const removeTweetFromThread = (index: number) => {
    if (tweets.length > 1) {
      const newTweets = tweets.filter((_, i) => i !== index)
      setTweets(newTweets)
    }
  }

  // Handle focus
  const handleFocus = () => {
    setIsExpanded(true)
  }

  // Handle tweet submission
  const handleTweet = () => {
    const validTweets = tweets.filter(tweet => tweet.content.trim().length > 0)
    if (validTweets.length > 0) {
      onTweet?.(validTweets)
      setTweets([{ id: '1', content: '', characterCount: 0 }])
      setIsExpanded(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setTweets([{ id: '1', content: '', characterCount: 0 }])
    setIsExpanded(false)
    onCancel?.()
  }

  // Check if any tweet is over limit
  const hasOverLimit = tweets.some(tweet => tweet.characterCount > maxCharacters)
  
  // Check if there's valid content
  const hasValidContent = tweets.some(tweet => tweet.content.trim().length > 0)

  const privacyOptions = [
    { value: 'everyone', label: 'Everyone', icon: Globe },
    { value: 'followers', label: 'Your followers', icon: Users },
    { value: 'mentioned', label: 'Only people you mention', icon: Lock }
  ]

  const currentPrivacy = privacyOptions.find(p => p.value === privacy)

  useEffect(() => {
    textareaRefs.current = textareaRefs.current.slice(0, tweets.length)
  }, [tweets.length])

  return (
    <Card className={cn("w-full max-w-2xl p-4 space-y-4 transition-all duration-200", className)}>
      {/* Privacy Selector */}
      {isExpanded && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-top-1 duration-200">
          <currentPrivacy.icon className="w-4 h-4" />
          <span>{currentPrivacy.label} can reply</span>
        </div>
      )}

      {/* Tweet Thread */}
      <div className="space-y-3">
        {tweets.map((tweet, index) => (
          <div key={tweet.id} className="flex gap-3">
            {/* Avatar - only show for first tweet */}
            {index === 0 && (
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            
            {/* Thread line for subsequent tweets */}
            {index > 0 && (
              <div className="w-10 flex justify-center shrink-0">
                <div className="w-0.5 h-6 bg-muted-foreground/20" />
              </div>
            )}

            {/* Tweet Content */}
            <div className="flex-1 space-y-3">
              {/* User info - only for first tweet */}
              {index === 0 && isExpanded && (
                <div className="text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-top-1 duration-200">
                  {userName} {userHandle}
                </div>
              )}

              {/* Textarea */}
              <div className="relative">
                <Textarea
                  ref={(el) => textareaRefs.current[index] = el}
                  value={tweet.content}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  onFocus={handleFocus}
                  placeholder={index === 0 ? placeholder : "Add another tweet"}
                  className={cn(
                    "min-h-[60px] resize-none border-none shadow-none focus-visible:ring-0 text-base placeholder:text-muted-foreground/60 p-2",
                    tweet.characterCount > maxCharacters && "text-destructive"
                  )}
                  style={{ height: 'auto' }}
                />
                
                {/* Character count */}
                {isExpanded && tweet.content.length > maxCharacters * 0.8 && (
                  <div className="absolute -bottom-6 right-0">
                    <Badge 
                      variant={tweet.characterCount > maxCharacters ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {maxCharacters - tweet.characterCount}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Remove thread tweet button */}
              {index > 0 && isExpanded && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTweetFromThread(index)}
                  className="w-fit text-muted-foreground hover:text-destructive animate-in fade-in-0 slide-in-from-right-1 duration-200"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Add thread button */}
        {isExpanded && hasValidContent && (
          <div className="flex gap-3">
            <div className="w-10 flex justify-center shrink-0">
              <div className="w-0.5 h-6 bg-muted-foreground/20" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={addTweetToThread}
              className="w-fit text-primary hover:bg-primary/10 animate-in fade-in-0 slide-in-from-bottom-1 duration-200"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add tweet
            </Button>
          </div>
        )}
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <Separator />
          
          {/* Media and Options */}
          <div className="flex items-center gap-4 text-primary">
            <Button variant="ghost" size="sm" className="p-2">
              <Image className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Smile className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Calendar className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <MapPin className="w-5 h-5" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {tweets.length > 1 && (
                <Badge variant="secondary" className="text-xs">
                  {tweets.length} tweets
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancel}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleTweet}
                disabled={!hasValidContent || hasOverLimit}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 transition-all duration-200"
              >
                {tweets.length > 1 ? 'Tweet all' : 'Tweet'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}