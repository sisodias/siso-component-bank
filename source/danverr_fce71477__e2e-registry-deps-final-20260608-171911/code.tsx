import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "./command"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
} from "./sidebar"
import { formatScore } from "./e2e-registry-deps-final-20260608-171911-utils/format"
import { StatusPill } from "./e2e-registry-deps-final-20260608-171911-utils/status-pill"
import { palette } from "./e2e-registry-deps-final-20260608-171911-utils/theme"
import { useCycleState } from "./e2e-registry-deps-final-20260608-171911-utils/use-cycle-state"

export default function E2EComplexCard() {
  const current = useCycleState(["Queued", "Building", "Verified"])

  return (
    <SidebarProvider>
      <div className="grid min-h-[320px] w-full grid-cols-[220px_1fr] overflow-hidden rounded-md border">
        <Sidebar className="border-r">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>E2E Registry</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-2 p-2 text-sm">
                  <StatusPill label={current} />
                  <p className="text-muted-foreground">{formatScore(98.451)}</p>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="space-y-4 p-4" style={{ borderTopColor: palette.accent }}>
          <div>
            <h3 className="text-base font-semibold">Nested dependency check</h3>
            <p className="text-sm text-muted-foreground">
              Local files are published, registry-owned shadcn files are installed from registryDependencies.
            </p>
          </div>
          <Command className="rounded-md border">
            <CommandInput placeholder="Search registry dependency..." />
            <CommandList>
              <CommandEmpty>No dependency found.</CommandEmpty>
              <CommandItem>sidebar.json</CommandItem>
              <CommandItem>command.json</CommandItem>
            </CommandList>
          </Command>
        </div>
      </div>
    </SidebarProvider>
  )
}
