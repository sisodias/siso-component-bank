 import { SidebarInset, SidebarProvider } from "@/components/blocks/sidebar";
  import { AppHeader } from "@/components/ui/sidebar-header";
  import { AppSidebar } from "@/components/ui/sidebar-one";
  import type { AppBreadcrumbPage } from "@/components/ui/breadcrumb-efferdui";

  type AppShellProps = {
    children: React.ReactNode;
    currentPage?: AppBreadcrumbPage | null;
  };
  
  export function AppShell({ children, currentPage }: AppShellProps) {
    return (
      <SidebarProvider className="w-screen">
        <AppSidebar />
        <div className="hidden w-36 shrink-0 md:block" aria-hidden />
        <SidebarInset>
          <AppHeader currentPage={currentPage} />
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  export default AppShell;