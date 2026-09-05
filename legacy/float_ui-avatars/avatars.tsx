"use client";

import * as Avatar from "@radix-ui/react-avatar";

export default function AvatarDemo() {
  return (
    <div className="flex items-center justify-center gap-x-12">
      <Avatar.Root className="bg-white h-6 w-6 overflow-hidden rounded-full">
        <Avatar.Image
          src="https://randomuser.me/api/portraits/women/79.jpg"
          alt="User avatar"
          className="w-full h-full object-cover"
        />
        <Avatar.Fallback delayMs={600}>CT</Avatar.Fallback>
      </Avatar.Root>

      <Avatar.Root className="bg-white h-8 w-8 overflow-hidden rounded-full">
        <Avatar.Image
          src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg"
          alt="User avatar"
          className="w-full h-full object-cover"
        />
        <Avatar.Fallback delayMs={600}>CT</Avatar.Fallback>
      </Avatar.Root>

      <Avatar.Root className="bg-white h-10 w-10 overflow-hidden rounded-full">
        <Avatar.Image
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f"
          alt="User avatar"
          className="w-full h-full object-cover"
        />
        <Avatar.Fallback delayMs={600}>CT</Avatar.Fallback>
      </Avatar.Root>

      <Avatar.Root className="bg-white h-12 w-12 overflow-hidden rounded-full">
        <Avatar.Image
          src="https://randomuser.me/api/portraits/men/86.jpg"
          alt="User avatar"
          className="w-full h-full object-cover"
        />
        <Avatar.Fallback delayMs={600}>CT</Avatar.Fallback>
      </Avatar.Root>

      <Avatar.Root className="bg-white h-16 w-16 overflow-hidden rounded-full">
        <Avatar.Image
          src="https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e"
          alt="User avatar"
          className="w-full h-full object-cover"
        />
        <Avatar.Fallback delayMs={600}>CT</Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}
