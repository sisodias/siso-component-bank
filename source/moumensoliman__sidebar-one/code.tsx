"use client";

  import {
    LayoutGridIcon,
    BarChart3Icon,
    BriefcaseIcon,
    UsersIcon,
    PlugIcon,
    KeyRoundIcon,
    SettingsIcon,
    SendIcon,
    HelpCircleIcon,
    BookOpenIcon,
  } from "lucide-react";
  import { Logo } from "@/components/ui/efferd-ui-logo";
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/blocks/sidebar";
  import { NavUser } from "@/components/ui/nav-user";

  type SidebarNavItem = {
    title: string;
    url: string;
    icon: React.ReactNode;
    isActive?: boolean;
  };

  type SidebarNavGroup = {
    label?: string;
    items: SidebarNavItem[];
  };

  const navGroups: SidebarNavGroup[] = [
    {
      label: "Product",
      items: [
        { title: "Dashboard",    url: "#/overview",     icon: <LayoutGridIcon />, isActive: true
  },
        { title: "Analytics",    url: "#/analytics",    icon: <BarChart3Icon /> },
        { title: "Projects",     url: "#/projects",     icon: <BriefcaseIcon /> },
        { title: "Team",         url: "#/team",         icon: <UsersIcon /> },
        { title: "Integrations", url: "#/integrations", icon: <PlugIcon /> },
        { title: "API Keys",     url: "#/api-keys",     icon: <KeyRoundIcon /> },
      ],
    },
    {
      label: "Administration",
      items: [
        { title: "Settings", url: "#/settings", icon: <SettingsIcon /> },
      ],
    },
  ];

  const footerNavLinks: SidebarNavItem[] = [
    { title: "Feedback",      url: "#/feedback",      icon: <SendIcon /> },
    { title: "Help Center",   url: "#/help",          icon: <HelpCircleIcon /> },
    { title: "Documentation", url: "#/documentation", icon: <BookOpenIcon /> },
  ];
  
  export function AppSidebar() {
    return (
      <Sidebar
        className="min-h-full *:data-[slot=sidebar-inner]:bg-background"
        collapsible="icon"
        variant="sidebar"
      >
        <SidebarHeader className="relative h-14 justify-center px-2 py-0">
          <a
            className="rounded-lg flex h-10 w-max items-center justify-center px-3 hover:bg-muted
   dark:hover:bg-muted/50"
            href="#link"
          >
            <Logo className="h-4" />
            <span className="sr-only">Efferd</span>
          </a> 
        </SidebarHeader>
        <SidebarContent>
          {navGroups.map((group, index) => (
            <SidebarGroup key={`sidebar-group-${index}`}>
              {group.label && ( 
                <SidebarGroupLabel className="font-normal">{group.label}</SidebarGroupLabel>
              )}
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                      <a href={item.url}>
                        {item.icon}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="gap-0 p-0">
          <SidebarMenu className="border-t p-2">
            {footerNavLinks.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  className="text-muted-foreground"
                  isActive={item.isActive}
                  size="sm"
                >
                  <a href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    );
  }

  export default AppSidebar;