"use client";

  import {
      Avatar,
      AvatarFallback,
      AvatarImage,
  } from "@/components/ui/avatar";
  import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuGroup,
      DropdownMenuItem,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
      SidebarMenu,
      SidebarMenuButton,
      SidebarMenuItem,
      useSidebar,
  } from "@/components/blocks/sidebar";
  import {
      ChevronsUpDownIcon,
      SparklesIcon,
      UserIcon,
      BellIcon,
      CreditCardIcon,
      SettingsIcon,   
      LifeBuoyIcon,
      LogOutIcon,
  } from "lucide-react";

  type UserType = {
      name: string;
      email: string;
      avatar: string;
  };

  const user: UserType = {
      name: "Shaban Haider",
      email: "shaban@efferd.com",
      avatar: "https://github.com/shabanhr.png",
  };

  export function NavUser() {
      const { isMobile } = useSidebar();

      return (
          <SidebarMenu className="border-t p-2">
              <SidebarMenuItem>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <SidebarMenuButton className="text-muted-foreground">
                              <Avatar className="size-5">
                                  <AvatarImage alt={user.name} src={user.avatar}
  />

  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">
                                  {user.name.split(" ")[0]}
                              </span>
                              <ChevronsUpDownIcon className="ml-auto size-3!" />
                          </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                          align="end"
                          className="min-w-48"
                          side={isMobile ? "bottom" : "right"}
                          sideOffset={4}
                      >
                          <DropdownMenuGroup>
                              <DropdownMenuItem className="text-sm">
                                  <SparklesIcon className="size-4" />
                                  Upgrade to Pro
                              </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                              <DropdownMenuItem className="text-sm">
                                  <UserIcon className="size-4" />
                                  Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-sm">
                                  <BellIcon className="size-4" />
                                  Notifications
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-sm">
                                  <CreditCardIcon className="size-4" />
                                  Billing
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-sm">
                                  <SettingsIcon className="size-4" />
                                  Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-sm">
                                  <LifeBuoyIcon className="size-4" />
                                  Help Center
                              </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" 
  className="text-sm">
                              <LogOutIcon className="size-4" />
                              Log out
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              </SidebarMenuItem>
          </SidebarMenu>
      );
  }

  export default NavUser;