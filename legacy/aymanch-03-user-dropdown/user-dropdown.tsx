import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "../_utils/cn"
import { Icon } from "@iconify/react";

const MENU_ITEMS = {
  status: [
    { value: "focus", icon: "solar:emoji-funny-circle-line-duotone", label: "Focus" },
    { value: "offline", icon: "solar:moon-sleep-line-duotone", label: "Appear Offline" }
  ],
  profile: [
    { icon: "solar:user-circle-line-duotone", label: "Your profile", action: "profile" },
    { icon: "solar:sun-line-duotone", label: "Appearance", action: "appearance" },
    { icon: "solar:settings-line-duotone", label: "Settings", action: "settings" },
    { icon: "solar:bell-line-duotone", label: "Notifications", action: "notifications" }
  ],
  premium: [
    { 
      icon: "solar:star-bold", 
      label: "Upgrade to Pro", 
      action: "upgrade",
      iconClass: "text-amber-600",
      badge: { text: "20% off", className: "bg-amber-600 text-white text-[11px]" }
    },
    { icon: "solar:gift-line-duotone", label: "Referrals", action: "referrals" }
  ],
  support: [
    { icon: "solar:download-line-duotone", label: "Download app", action: "download" },
    { 
      icon: "solar:letter-unread-line-duotone", 
      label: "What's new?", 
      action: "whats-new",
      rightIcon: "solar:square-top-down-line-duotone"
    },
    { 
      icon: "solar:question-circle-line-duotone", 
      label: "Get help?", 
      action: "help",
      rightIcon: "solar:square-top-down-line-duotone"
    }
  ],
  account: [
    { 
      icon: "solar:users-group-rounded-bold-duotone", 
      label: "Switch account", 
      action: "switch",
      showAvatar: false
    },
    { icon: "solar:logout-2-bold-duotone", label: "Log out", action: "logout" }
  ]
};

export const UserDropdown = ({ 
  user = {
    name: "Ayman Echakar",
    username: "@aymanch-03",
    avatar: "https://avatars.githubusercontent.com/u/126724835?v=4",
    initials: "AE",
    status: "online"
  },
  onAction = () => {},
  onStatusChange = () => {},
  selectedStatus = "online",
  promoDiscount = "20% off",
  accounts = []
}) => {
  const renderMenuItem = (item, index) => (
    <DropdownMenuItem 
      key={index}
      className={cn(item.badge || item.showAvatar || item.rightIcon ? "justify-between" : "", "p-2 rounded-lg cursor-pointer")}
      onClick={() => onAction(item.action)}
    >
      <span className="flex items-center gap-1.5 font-medium">
        <Icon
          icon={item.icon}
          className={`size-5 ${item.iconClass || "text-gray-500 dark:text-gray-400"}`}
        />
        {item.label}
      </span>
      {item.badge && (
        <Badge className={item.badge.className}>
          {promoDiscount || item.badge.text}
        </Badge>
      )}
      {item.rightIcon && (
        <Icon
          icon={item.rightIcon}
          className="size-4 text-gray-500 dark:text-gray-400"
        />
      )}
      {item.showAvatar && (
        <Avatar className="cursor-pointer size-6 shadow border border-white dark:border-gray-700">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
      )}
    </DropdownMenuItem>
  );

  const getStatusColor = (status) => {
    const colors = {
      online: "text-green-600 bg-green-100 border-green-300 dark:text-green-400 dark:bg-green-900/30 dark:border-green-500/50",
      offline: "text-gray-600 bg-gray-100 border-gray-300 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600",
      busy: "text-red-600 bg-red-100 border-red-300 dark:text-red-400 dark:bg-red-900/30 dark:border-red-500/50"
    };
    return colors[status.toLowerCase()] || colors.online;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer size-10 border border-white dark:border-gray-700">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="no-scrollbar w-[310px] rounded-2xl bg-gray-50 dark:bg-black/90 p-0" align="end">
        <section className="bg-white dark:bg-gray-100/10 backdrop-blur-lg rounded-2xl p-1 shadow border border-gray-200 dark:border-gray-700/20">
          <div className="flex items-center p-2">
            <div className="flex-1 flex items-center gap-2">
              <Avatar className="cursor-pointer size-10 border border-white dark:border-gray-700">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{user.name}</h3>
                <p className="text-muted-foreground text-xs">{user.username}</p>
              </div>
            </div>
            <Badge className={`${getStatusColor(user.status)} border-[0.5px] text-[11px] rounded-sm capitalize`}>
              {user.status}
            </Badge>
          </div>

          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer p-2 rounded-lg">
                <span className="flex items-center gap-1.5 font-medium text-gray-500 dark:text-gray-400">
                  <Icon icon="solar:smile-circle-line-duotone" className="size-5 text-gray-500 dark:text-gray-400" />
                  Update status
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-white dark:bg-white/10 backdrop-blur-lg">
                  <DropdownMenuRadioGroup value={selectedStatus} onValueChange={onStatusChange}>
                    {MENU_ITEMS.status.map((status, index) => (
                      <DropdownMenuRadioItem className="gap-2" key={index} value={status.value}>
                        <Icon icon={status.icon} className="size-5 text-gray-500 dark:text-gray-400" />
                        {status.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {MENU_ITEMS.profile.map(renderMenuItem)}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {MENU_ITEMS.premium.map(renderMenuItem)}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {MENU_ITEMS.support.map(renderMenuItem)}
          </DropdownMenuGroup>
        </section>

        <section className="mt-1 p-1 rounded-2xl">
          <DropdownMenuGroup>
            {MENU_ITEMS.account.map(renderMenuItem)}
          </DropdownMenuGroup>
        </section>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;