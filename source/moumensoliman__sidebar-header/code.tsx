
  import { cn } from "@/lib/utils";
  import { Button } from "@/components/ui/button";
  import { Separator } from "@/components/ui/separator";
  import { SidebarTrigger } from "@/components/blocks/sidebar";
  import {
    AppBreadcrumbs,   
    type AppBreadcrumbPage,
  } from "@/components/ui/breadcrumb-efferdui";
  import { SearchIcon, BellIcon, HeadsetIcon } from "lucide-react";
  
  type AppHeaderProps = {
    currentPage?: AppBreadcrumbPage | null;
  };

  export function AppHeader({ currentPage }: AppHeaderProps) {
    return (
      <header
        className={cn(
          "sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 bg-background px-4 md:px-6"
        )}
      >
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden size-8 [&_svg]:size-4"  />
          <Separator
            className="mr-2 data-[orientation=vertical]:h-4 md:hidden"
            orientation="vertical"
          />
          <AppBreadcrumbs page={currentPage} />
        </div>
        <div className="flex items-center gap-2">
          <Button aria-label="Search" size="icon" variant="ghost">
            <SearchIcon className="size-4" />
          </Button>
          <Button aria-label="Notifications" size="icon" variant="ghost">
            <BellIcon className="size-4" />
          </Button>
          <Button aria-label="Support" size="icon" variant="ghost">
            <HeadsetIcon className="size-4" />
          </Button>   
        </div>
      </header>
    );
  }

 export default AppHeader;