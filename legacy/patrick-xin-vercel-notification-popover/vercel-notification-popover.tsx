import * as React from "react"
import {
  ArchiveIcon,
  BellIcon,
  CalendarIcon,
  MessageCircleDashed,
  MessageCircleIcon,
  PlusIcon,
  Settings,
  TypeIcon,
  UserIcon,
  FilterIcon,
  XIcon,
} from "lucide-react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

type TabValue = "all" | "unread" | "archived"

interface NotificationContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  onClose: () => void
}

const NotificationContext = React.createContext<NotificationContextValue | undefined>(undefined)

function useNotification() {
  const ctx = React.useContext(NotificationContext)
  if (!ctx) throw new Error("useNotification must be within provider")
  return ctx
}

export function VercelNotificationPopover() {
  const [open, setOpen] = React.useState(false)
  const handleClose = () => setOpen(false)

  return (
    <NotificationContext.Provider value={{ open, setOpen, onClose: handleClose }}>
      <NotificationContent />
    </NotificationContext.Provider>
  )
}

function NotificationContent() {
  const isMobile = useIsMobile()
  if (isMobile) return <NotificationSheet />
  return <NotificationPopover />
}

// ─── Desktop Popover ───
function NotificationPopover() {
  const { open, setOpen } = useNotification()
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <TriggerButton />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={8}
          className="z-50 w-96 rounded-lg border border-border bg-background shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 overflow-hidden flex flex-col"
          style={{ maxHeight: "50dvh" }}
        >
          <UnderLineTabs />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

// ─── Mobile Sheet ───
function NotificationSheet() {
  const { open, setOpen, onClose } = useNotification()

  return (
    <>
      <TriggerButton onClick={() => setOpen(true)} />
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div
            className="absolute bottom-0 left-0 right-0 bg-background rounded-t-xl border-t border-border overflow-hidden flex flex-col animate-in slide-in-from-bottom"
            style={{ height: "50dvh", maxHeight: "50dvh" }}
          >
            <UnderLineTabs />
          </div>
        </div>
      )}
    </>
  )
}

// ─── Trigger Button ───
const TriggerButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => (
    <button
      ref={ref}
      {...props}
      className="relative inline-flex items-center justify-center rounded-md border border-border bg-background p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Notifications"
    >
      <BellIcon className="h-4 w-4" />
      <span className="absolute -top-1 -right-1 pointer-events-none">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
      </span>
    </button>
  )
)
TriggerButton.displayName = "TriggerButton"

// ─── Tabs ───
function UnderLineTabs() {
  const { onClose } = useNotification()
  const [tab, setTab] = React.useState<TabValue>("all")

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex justify-between items-center h-12 border-b border-border px-1 flex-shrink-0">
        <div className="flex h-full">
          {(["all", "unread", "archived"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 h-full text-sm capitalize relative transition-colors hover:text-foreground",
                tab === t ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t}
              {tab === t && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-foreground rounded-full" />
              )}
            </button>
          ))}
        </div>
        <button className="p-2 hover:bg-accent rounded-md mr-1" aria-label="Settings">
          <Settings className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Panels */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {tab === "all" && <AllNotifications onClose={onClose} />}
        {tab === "unread" && <UnreadNotifications onClose={onClose} />}
        {tab === "archived" && <ArchivedPanel />}
      </div>

      {tab === "all" && (
        <div className="flex-shrink-0 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            View All
          </button>
        </div>
      )}
    </div>
  )
}

function AllNotifications({ onClose }: { onClose: () => void }) {
  return (
    <ol className="list-none">
      {Array.from({ length: 25 }).map((_, i) => (
        <li
          key={i}
          className="group border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
        >
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onClose() }}
            className="flex items-center gap-3 p-3.5"
          >
            <MessageCircleDashed className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm">New notification {i + 1}</span>
              <span className="text-xs text-muted-foreground">{i + 1} min ago</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault() }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-accent transition-opacity"
              title="Archive"
            >
              <ArchiveIcon className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </a>
        </li>
      ))}
    </ol>
  )
}

function UnreadNotifications({ onClose }: { onClose: () => void }) {
  return (
    <ol className="list-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <li
          key={i}
          className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
        >
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onClose() }}
            className="flex items-center gap-3 p-3.5"
          >
            <MessageCircleIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm">Unread notification {i + 1}</span>
              <span className="text-xs text-muted-foreground">{i + 1} min ago</span>
            </div>
          </a>
        </li>
      ))}
    </ol>
  )
}

function ArchivedPanel() {
  const [filterOpen, setFilterOpen] = React.useState(false)
  return (
    <div className="flex flex-col h-full relative">
      <div className="flex gap-2 p-3 items-center">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 h-8 rounded-md bg-transparent border-none px-2 text-sm placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 h-8 text-sm hover:bg-accent"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Filter
          </button>
          {filterOpen && (
            <>
              <div className="fixed inset-0" onClick={() => setFilterOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-36 rounded-md border border-border bg-popover shadow-md z-10 py-1">
                {[
                  { icon: UserIcon, label: "Author" },
                  { icon: CalendarIcon, label: "Date" },
                  { icon: TypeIcon, label: "Type" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => setFilterOpen(false)}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <span className="text-muted-foreground flex flex-col items-center gap-2">
          <span className="bg-muted rounded-full p-3">
            <ArchiveIcon className="h-5 w-5" />
          </span>
          No archived notifications
        </span>
      </div>
    </div>
  )
}
