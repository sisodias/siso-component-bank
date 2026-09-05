"use client"

import React from 'react'
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Video, VideoOff, PhoneMissed, PhoneIncoming, PhoneOutgoing, Minimize2, Maximize2, X } from 'lucide-react'
import Image from 'next/image'
import { cn, getCallStatusText, getCallStatusIcon, formatCallDuration, getParticleStyles, getAudioBarStyles, useVideoRefs } from '@/lib/utils'
import type { CallState, CallActions } from '@/lib/utils'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CallingCardProps {
  callerName: string
  callerNumber: string
  callerImage: string
  state: CallState
  actions: CallActions
  className?: string
  showLocalVideo?: boolean
  ringtoneUrl?: string
  particleCount?: number
  audioBarCount?: number
}

// ============================================================================
// PARTICLE BACKGROUND COMPONENT
// ============================================================================

interface ParticleBackgroundProps {
  particleCount?: number
}

function ParticleBackground({ particleCount = 30 }: ParticleBackgroundProps) {
  const particles = React.useMemo(() => getParticleStyles(particleCount), [particleCount])
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.key}
          className="calling-particle absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/30 sm:bg-white/50 rounded-full"
          style={particle.style}
        />
      ))}
    </div>
  )
}

// ============================================================================
// MINIMIZED VIEW COMPONENT
// ============================================================================

interface MinimizedViewProps {
  callerName: string
  callerImage: string
  state: CallState
  actions: CallActions
}

function MinimizedView({ callerName, callerImage, state, actions }: MinimizedViewProps) {
  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 max-w-sm mx-auto sm:mx-0">
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12">
          <Image
            src={callerImage}
            alt={callerName}
            fill
            className="rounded-full object-cover border-2 border-white/30"
          />
        </div>
        <div className="text-white flex-1 min-w-0">
          <p className="font-semibold text-sm sm:text-base truncate">{callerName}</p>
          <p className="text-xs sm:text-sm opacity-80">
            {getCallStatusText(state.callStatus, state.callDuration)}
          </p>
        </div>
        <button
          onClick={actions.maximize}
          className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </button>
        {state.callStatus === 'connected' && (
          <button
            onClick={actions.end}
            className="p-2 sm:p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
          >
            <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// STATUS ICON COMPONENT
// ============================================================================

interface StatusIconProps {
  status: ReturnType<typeof getCallStatusIcon>
}

function StatusIcon({ status }: StatusIconProps) {
  if (!status) return null
  
  const icons = {
    incoming: <PhoneIncoming className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />,
    outgoing: <PhoneOutgoing className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />,
    missed: <PhoneMissed className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
  }
  
  return icons[status]
}

// ============================================================================
// AUDIO LEVEL INDICATOR COMPONENT
// ============================================================================

interface AudioLevelIndicatorProps {
  audioLevel: number
  barCount?: number
}

function AudioLevelIndicator({ audioLevel, barCount = 5 }: AudioLevelIndicatorProps) {
  const bars = getAudioBarStyles(audioLevel, barCount)
  
  return (
    <div className="flex items-center gap-1">
      {bars.map(bar => (
        <div
          key={bar.key}
          className={cn(
            "w-1 bg-green-400 rounded-full transition-all duration-100",
            bar.isActive ? "opacity-100" : "opacity-20"
          )}
          style={{ height: `${bar.height}px` }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// CALL HEADER COMPONENT
// ============================================================================

interface CallHeaderProps {
  state: CallState
  actions: CallActions
  audioBarCount?: number
}

function CallHeader({ state, actions, audioBarCount = 5 }: CallHeaderProps) {
  if (state.callStatus !== 'connected') return null
  
  return (
    <div className="flex items-center justify-between p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-2 h-2 rounded-full animate-pulse",
          state.isMuted ? "bg-red-500" : "bg-green-500"
        )} />
        <span className="text-white/70 text-xs sm:text-sm">
          {state.isMuted ? 'Muted' : 'Active'}
        </span>
        {!state.isMuted && state.audioLevel > 0 && (
          <AudioLevelIndicator audioLevel={state.audioLevel} barCount={audioBarCount} />
        )}
      </div>
      <button
        onClick={actions.minimize}
        className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
      </button>
    </div>
  )
}

// ============================================================================
// SOUND WAVES COMPONENT
// ============================================================================

interface SoundWavesProps {
  isVisible: boolean
}

function SoundWaves({ isVisible }: SoundWavesProps) {
  if (!isVisible) return null
  
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1 opacity-30">
      {[1, 2, 3, 4, 5].map(i => (
        <div 
          key={i} 
          className={cn(
            "calling-wave w-0.5 sm:w-1 h-6 sm:h-8 bg-white/50 rounded",
            `calling-wave-${i}`
          )} 
        />
      ))}
    </div>
  )
}

// ============================================================================
// AVATAR COMPONENT
// ============================================================================

interface AvatarProps {
  image: string
  name: string
  status: CallState['callStatus']
  size?: 'sm' | 'md' | 'lg'
}

function Avatar({ image, name, status, size = 'md' }: AvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10 sm:w-12 sm:h-12",
    md: "w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40",
    lg: "w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
  }
  
  return (
    <div className={cn("calling-avatar-wrapper relative", sizeClasses[size])}>
      {status === 'incoming' && (
        <>
          <div className="calling-ripple absolute inset-0 rounded-full border-2 border-white/50" />
          <div className="calling-ripple calling-ripple-delayed absolute inset-0 rounded-full border-2 border-white/50" />
        </>
      )}
      <Image
        src={image}
        alt={name}
        fill
        className="rounded-full object-cover border-4 border-white/30 shadow-2xl"
      />
      {status === 'connected' && (
        <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 p-1.5 sm:p-2 rounded-full bg-green-500 shadow-lg">
          <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// CALLER INFO COMPONENT
// ============================================================================

interface CallerInfoProps {
  name: string
  number: string
  status: CallState['callStatus']
  duration: number
}

function CallerInfo({ name, number, status, duration }: CallerInfoProps) {
  return (
    <div className="text-center text-white">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 drop-shadow-lg">
        {name}
      </h2>
      <div className="flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg opacity-90">
        <span className="truncate max-w-[200px] sm:max-w-none">{number}</span>
        {status === 'connected' && (
          <span className="calling-status-dot w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full" />
        )}
      </div>
      <div className="flex items-center justify-center gap-2 text-base sm:text-lg md:text-xl text-white/80 calling-status-text mt-4">
        <StatusIcon status={getCallStatusIcon(status)} />
        <span>{getCallStatusText(status, duration)}</span>
      </div>
    </div>
  )
}

// ============================================================================
// PROFILE SECTION COMPONENT
// ============================================================================

interface ProfileSectionProps {
  callerImage: string
  callerName: string
  callerNumber: string
  state: CallState
}

function ProfileSection({ callerImage, callerName, callerNumber, state }: ProfileSectionProps) {
  if (state.isVideoOn && state.callStatus === 'connected') return null
  
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 z-10">
      <Avatar 
        image={callerImage} 
        name={callerName} 
        status={state.callStatus}
      />
      <CallerInfo
        name={callerName}
        number={callerNumber}
        status={state.callStatus}
        duration={state.callDuration}
      />
    </div>
  )
}

// ============================================================================
// LOCAL VIDEO COMPONENT
// ============================================================================

interface LocalVideoProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  isVisible: boolean
  onClose: () => void
}

function LocalVideo({ videoRef, isVisible, onClose }: LocalVideoProps) {
  if (!isVisible) return null
  
  return (
    <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-24 h-32 sm:w-32 sm:h-44 md:w-36 md:h-48 rounded-lg sm:rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-cover scale-x-[-1]"
        autoPlay
        playsInline
        muted
      />
      <button
        onClick={onClose}
        className="absolute top-1 right-1 p-0.5 rounded-full bg-black/50 hover:bg-black/70"
      >
        <X className="w-3 h-3 text-white" />
      </button>
    </div>
  )
}

// ============================================================================
// REMOTE VIDEO COMPONENT
// ============================================================================

interface RemoteVideoProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  callerImage: string
  callerName: string
  hasStream: boolean
}

function RemoteVideo({ videoRef, callerImage, callerName, hasStream }: RemoteVideoProps) {
  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <div className="absolute inset-0">
        <Image 
          src={callerImage} 
          alt={callerName}
          fill
          className="object-cover opacity-30 blur-lg"
        />
      </div>
      <div className="absolute inset-0 bg-black/40" />
      {hasStream ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          playsInline
        />
      ) : (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/50 text-center">
          <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center mb-4 mx-auto">
            <Video className="w-10 h-10" />
          </div>
          <p className="text-sm sm:text-base">Waiting for {callerName}&apos;s video...</p>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// VIDEO SECTION COMPONENT
// ============================================================================

interface VideoSectionProps {
  state: CallState
  callerImage: string
  callerName: string
  localVideoRef: React.RefObject<HTMLVideoElement | null>
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>
  showLocalVideo: boolean
  onCloseLocalVideo: () => void
}

function VideoSection({ 
  state, 
  callerImage, 
  callerName, 
  localVideoRef, 
  remoteVideoRef,
  showLocalVideo,
  onCloseLocalVideo
}: VideoSectionProps) {
  if (!state.isVideoOn || state.callStatus !== 'connected') return null
  
  return (
    <div className="absolute inset-4 sm:inset-6 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      <RemoteVideo
        videoRef={remoteVideoRef}
        callerImage={callerImage}
        callerName={callerName}
        hasStream={!!state.remoteStream}
      />
      {showLocalVideo && state.localStream && state.localStream.getVideoTracks().length > 0 && (
        <LocalVideo
          videoRef={localVideoRef}
          isVisible={true}
          onClose={onCloseLocalVideo}
        />
      )}
    </div>
  )
}

// ============================================================================
// VIDEO TIMER OVERLAY COMPONENT
// ============================================================================

interface VideoTimerProps {
  isVisible: boolean
  duration: number
}

function VideoTimer({ isVisible, duration }: VideoTimerProps) {
  if (!isVisible) return null
  
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-black/60 backdrop-blur-md rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-white text-xs sm:text-sm font-medium">
          {formatCallDuration(duration)}
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// ACTION BUTTON COMPONENT
// ============================================================================

interface ActionButtonProps {
  onClick: () => void
  icon: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'danger' | 'success' | 'info' | 'muted'
  isActive?: boolean
  badge?: string | number
}

function ActionButton({ 
  onClick, 
  icon, 
  size = 'md', 
  variant = 'muted',
  isActive = false,
  badge
}: ActionButtonProps) {
  const sizeClasses = {
    sm: "w-12 h-12 sm:w-14 sm:h-14",
    md: "w-14 h-14 sm:w-16 sm:h-16",
    lg: "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
  }
  
  const variantClasses = {
    primary: "bg-gradient-to-br from-blue-500 to-blue-600",
    danger: "bg-gradient-to-br from-red-500 to-red-600",
    success: "bg-gradient-to-br from-green-500 to-green-600",
    info: isActive ? "border-blue-500/50 bg-blue-500/20" : "border-white/30 bg-white/10",
    muted: isActive ? "border-green-500/50 bg-green-500/20" : "border-white/30 bg-white/10"
  }
  
  const needsBorder = variant === 'info' || variant === 'muted'
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-full shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center",
        sizeClasses[size],
        variantClasses[variant],
        needsBorder && "border-2 backdrop-blur-md",
        variant === 'danger' && "hover:-rotate-6",
        variant === 'success' && "hover:rotate-6"
      )}
    >
      {icon}
      {badge && (
        <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
          {badge}
        </div>
      )}
    </button>
  )
}

// ============================================================================
// ACTION BUTTONS GROUP COMPONENT
// ============================================================================

interface ActionButtonsProps {
  state: CallState
  actions: CallActions
}

function ActionButtons({ state, actions }: ActionButtonsProps) {
  if (state.callStatus === 'incoming') {
    return (
      <>
        <ActionButton
          onClick={actions.decline}
          icon={<PhoneOff className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />}
          size="lg"
          variant="danger"
        />
        <ActionButton
          onClick={actions.answer}
          icon={<Phone className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />}
          size="lg"
          variant="success"
          badge="1"
        />
      </>
    )
  }

  if (state.callStatus === 'connecting' || state.callStatus === 'outgoing') {
    return (
      <ActionButton
        onClick={actions.end}
        icon={<PhoneOff className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />}
        size="lg"
        variant="danger"
      />
    )
  }

  if (state.callStatus === 'connected') {
    return (
      <>
        <ActionButton
          onClick={actions.toggleMute}
          icon={state.isMuted ? 
            <MicOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : 
            <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          }
          size="sm"
          variant="muted"
          isActive={state.isMuted}
        />
        <ActionButton
          onClick={actions.toggleSpeaker}
          icon={state.isSpeakerOn ? 
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : 
            <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          }
          size="sm"
          variant="info"
          isActive={state.isSpeakerOn}
        />
        <ActionButton
          onClick={actions.end}
          icon={<PhoneOff className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />}
          size="lg"
          variant="danger"
        />
        <ActionButton
          onClick={actions.toggleVideo}
          icon={state.isVideoOn ? 
            <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : 
            <VideoOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          }
          size="sm"
          variant="muted"
          isActive={state.isVideoOn}
        />
      </>
    )
  }

  return null
}

// ============================================================================
// ACTION BAR COMPONENT
// ============================================================================

interface ActionBarProps {
  state: CallState
  actions: CallActions
}

function ActionBar({ state, actions }: ActionBarProps) {
  return (
    <div className={cn(
      "p-4 sm:p-6",
      state.isVideoOn && "bg-black/40 backdrop-blur-md"
    )}>
      <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
        <ActionButtons state={state} actions={actions} />
      </div>
    </div>
  )
}

// ============================================================================
// MAIN CALLING CARD COMPONENT
// ============================================================================

export default function CallingCard({
  callerName,
  callerNumber,
  callerImage,
  state,
  actions,
  className,
  showLocalVideo = true,
  ringtoneUrl,
  particleCount = 30,
  audioBarCount = 5
}: CallingCardProps) {
  const { refs, actions: videoActions } = useVideoRefs()
  const [isLocalVideoVisible, setIsLocalVideoVisible] = React.useState(showLocalVideo)

  // Handle ringtone
  React.useEffect(() => {
    if (state.callStatus === 'incoming') {
      videoActions.playRingtone()
    } else {
      videoActions.stopRingtone()
    }
  }, [state.callStatus, videoActions])

  // Set video streams
  React.useEffect(() => {
    if (state.localStream) {
      videoActions.setLocalVideoStream(state.localStream)
    } else {
      videoActions.setLocalVideoStream(null)
    }
  }, [state.localStream, videoActions])

  React.useEffect(() => {
    if (state.remoteStream) {
      videoActions.setRemoteVideoStream(state.remoteStream)
    }
  }, [state.remoteStream, videoActions])

  // Render minimized view
  if (state.isMinimized) {
    return (
      <MinimizedView 
        callerName={callerName} 
        callerImage={callerImage} 
        state={state} 
        actions={actions} 
      />
    )
  }

  // Render full view
  return (
    <div className={cn(
      "calling-card-container min-h-screen flex items-center w-full justify-center",
      "bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800",
      "relative overflow-hidden p-4 sm:p-6 lg:p-8",
      className
    )}>
      {/* Hidden audio element */}
      {ringtoneUrl && (
        <audio ref={refs.ringtoneRef} loop>
          <source src={ringtoneUrl} type="audio/wav" />
        </audio>
      )}

      {/* Animated particles background */}
      <ParticleBackground particleCount={particleCount} />

      {/* Main card */}
      <div className={cn(
        "calling-card relative w-full max-w-[95vw] sm:max-w-md lg:max-w-lg",
        state.isVideoOn && "md:max-w-2xl lg:max-w-4xl xl:max-w-5xl",
        state.isVideoOn ? "h-[85vh] sm:h-[80vh] md:h-[75vh]" : "h-auto min-h-[500px] sm:min-h-[550px] md:min-h-[600px]",
        "bg-black/60 backdrop-blur-2xl rounded-2xl sm:rounded-3xl",
        "border border-white/20 shadow-2xl",
        "flex flex-col justify-between z-10 transition-all duration-500",
        state.callStatus === 'incoming' && "calling-vibrate",
        state.callStatus !== 'connected' && "py-8 sm:py-10"
      )}>
        
        {/* Header */}
        <CallHeader 
          state={state} 
          actions={actions} 
          audioBarCount={audioBarCount} 
        />

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative">
          
          {/* Video Section */}
          <VideoSection
            state={state}
            callerImage={callerImage}
            callerName={callerName}
            localVideoRef={refs.localVideoRef}
            remoteVideoRef={refs.remoteVideoRef}
            showLocalVideo={isLocalVideoVisible}
            onCloseLocalVideo={() => setIsLocalVideoVisible(false)}
          />

          {/* Sound Waves */}
          <SoundWaves isVisible={state.callStatus === 'connected' && !state.isVideoOn} />

          {/* Profile Section */}
          <ProfileSection
            callerImage={callerImage}
            callerName={callerName}
            callerNumber={callerNumber}
            state={state}
          />

          {/* Video Timer Overlay */}
          <VideoTimer 
            isVisible={state.isVideoOn && state.callStatus === 'connected'} 
            duration={state.callDuration} 
          />
        </div>

        {/* Action Bar */}
        <ActionBar state={state} actions={actions} />
      </div>
    </div>
  )
}