import * as React from "react"
import { cn } from "@/lib/utils"

// NOTE: This component requires: avatar, badge, card
// Install them first: npx shadcn@latest add "https://21st.dev/r/camp-ui/avatar"
// Or copy the inline versions below

// ============ INLINE DEPENDENCIES (for standalone use) ============

// Avatar
const avatarSizeMap = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 text-lg" }
function Avatar({ src, firstName, lastName, fallback, size = "md", className }: { src?: string | null; firstName?: string; lastName?: string; fallback?: string; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const [hasError, setHasError] = React.useState(false)
  const initials = fallback?.slice(0, 2).toUpperCase() || ((firstName?.charAt(0) || "") + (lastName?.charAt(0) || "")).toUpperCase() || "?"
  return (
    <div className={cn("relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 font-medium text-white", avatarSizeMap[size], className)}>
      {src && !hasError ? <img src={src} alt="" onError={() => setHasError(true)} className="h-full w-full object-cover" /> : <span>{initials}</span>}
    </div>
  )
}

// Badge
function Badge({ children, color = "default", variant = "flat", size = "md", className }: { children: React.ReactNode; color?: "default" | "primary"; variant?: "flat"; size?: "sm" | "md"; className?: string }) {
  const colors = { default: "bg-zinc-100 text-zinc-700", primary: "bg-blue-100 text-blue-700" }
  const sizes = { sm: "px-2 py-0.5 text-[10px]", md: "px-2.5 py-0.5 text-xs" }
  return <span className={cn("inline-flex items-center rounded-full font-medium", colors[color], sizes[size], className)}>{children}</span>
}

// Card
function Card({ children, className, isPressable, onPress }: { children: React.ReactNode; className?: string; isPressable?: boolean; onPress?: () => void }) {
  return (
    <div
      role={isPressable ? "button" : undefined}
      tabIndex={isPressable ? 0 : undefined}
      onClick={isPressable ? onPress : undefined}
      className={cn("rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all", isPressable && "cursor-pointer hover:shadow-md active:scale-[0.99]", className)}
    >
      {children}
    </div>
  )
}

// ============ MAIN COMPONENT ============

export interface Skill { name: string; level?: number }

export interface Profile {
  firstName?: string
  lastName?: string
  middleName?: string
  email?: string
  phone?: string
  city?: string
  avatar?: string
  skills?: Skill[]
}

export interface ProfileCardProps {
  profile: Profile
  onClick?: () => void
  className?: string
  maxSkills?: number
}

const EmailIcon = () => (
  <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
)

export function ProfileCard({ profile, onClick, className, maxSkills = 5 }: ProfileCardProps) {
  const fullName = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ")
  const visibleSkills = profile.skills?.slice(0, maxSkills) ?? []
  const remainingSkills = Math.max(0, (profile.skills?.length ?? 0) - maxSkills)

  return (
    <Card isPressable={!!onClick} onPress={onClick} className={cn("w-full max-w-md", className)}>
      <div className="flex flex-row items-center gap-4 p-4">
        <Avatar src={profile.avatar} firstName={profile.firstName} lastName={profile.lastName} size="lg" />
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="text-lg font-bold text-zinc-900 truncate">{fullName || "No name"}</h3>
          {profile.city && <p className="text-sm text-zinc-500">{profile.city}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 pt-0">
        {profile.email && (
          <div className="flex items-center gap-2 text-sm">
            <EmailIcon />
            <a href={`mailto:${profile.email}`} className="text-zinc-600 truncate hover:text-blue-600 transition-colors" onClick={(e) => e.stopPropagation()}>
              {profile.email}
            </a>
          </div>
        )}
        {profile.phone && (
          <div className="flex items-center gap-2 text-sm">
            <PhoneIcon />
            <a href={`tel:${profile.phone.replace(/\D/g, "")}`} className="text-zinc-600 hover:text-blue-600 transition-colors" onClick={(e) => e.stopPropagation()}>
              {profile.phone}
            </a>
          </div>
        )}
        {visibleSkills.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Skills</span>
            <div className="flex flex-wrap gap-1.5">
              {visibleSkills.map((skill, i) => <Badge key={i} color="primary" size="sm">{skill.name}</Badge>)}
              {remainingSkills > 0 && <Badge size="sm">+{remainingSkills}</Badge>}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
