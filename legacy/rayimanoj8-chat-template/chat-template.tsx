"use client"

// ** Imports: React & Hooks **
import React, { useState } from "react"

// ** UI Components **
import {
  SidebarInset,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/blocks/sidebar"
import { Button } from "./button"
import { Input } from "./input"
import { ScrollArea } from "./scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { CardDescription, CardTitle } from "./card"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable"

// ** Dropdown Menu Components **
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"

// ** Icons **
import {
  Brush,
  Camera,
  ChartBarIncreasing,
  ChevronUp,
  CircleFadingPlus,
  CircleOff,
  CircleUserRound,
  File,
  Image,
  ListFilter,
  Menu,
  MessageCircle,
  MessageSquareDashed,
  MessageSquareDot,
  Mic,
  Paperclip,
  Phone,
  Search,
  Send,
  Settings,
  Smile,
  SquarePen,
  Star,
  User,
  User2,
  UserRound,
  Users,
  Video,
} from "lucide-react"

// ** Contact List **
const contactList = [
  {
    name: "Manoj Rayi",
    message: "Your Last Message Here",
    image: "https://github.com/rayimanoj8.png",
  },
  {
    name: "Anjali Kumar",
    message: "Hello, how are you?",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Ravi Teja",
    message: "Looking forward to the meeting.",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Sneha Reddy",
    message: "Can you send the report?",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    name: "Arjun Das",
    message: "Thank you for your help!",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "Priya Sharma",
    message: "Let's catch up soon.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    name: "Vikram Singh",
    message: "I will call you later.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    name: "Kavya Rao",
    message: "Did you receive my email?",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    name: "Rahul Verma",
    message: "Meeting rescheduled to tomorrow.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    name: "Deepika Nair",
    message: "Happy birthday! Have a great day!",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
  },
  {
    name: "Rohit Malhotra",
    message: "What's the update?",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    name: "Neha Gupta",
    message: "Hope you're doing well!",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    name: "Amit Yadav",
    message: "Let's finalize the project.",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    name: "Simran Kaur",
    message: "Good morning!",
    image: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    name: "Varun Chopra",
    message: "I'll send the documents soon.",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    name: "Meera Joshi",
    message: "How was your weekend?",
    image: "https://randomuser.me/api/portraits/women/16.jpg",
  },
  {
    name: "Karthik Reddy",
    message: "Please confirm the time.",
    image: "https://randomuser.me/api/portraits/men/17.jpg",
  },
  {
    name: "Pooja Sharma",
    message: "See you at the event!",
    image: "https://randomuser.me/api/portraits/women/18.jpg",
  },
  {
    name: "Sandeep Kumar",
    message: "Just checking in.",
    image: "https://randomuser.me/api/portraits/men/19.jpg",
  },
  {
    name: "Lavanya Patel",
    message: "Don't forget the meeting.",
    image: "https://randomuser.me/api/portraits/women/20.jpg",
  },
]

// ** Sidebar Menu Items **
const menuItems = [
  { title: "Messages", url: "#", icon: MessageCircle },
  { title: "Phone", url: "#", icon: Phone },
  { title: "Status", url: "#", icon: CircleFadingPlus },
]

// ** Home Component **
export const Home = () => {
  const { toggleSidebar } = useSidebar()
  const [currentChat, setCurrentChat] = useState(contactList[0])

  return (
    <>
      {/* Sidebar */}
      <Sidebar variant="floating" collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigate</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={toggleSidebar} asChild>
                    <span>
                      <Menu />
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings /> Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Manoj Rayi
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <a href="https://github.com/rayimanoj8/">Account</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Back Up</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <SidebarInset>
        <ResizablePanelGroup direction="horizontal" className="h-screen">
          {/* Left Panel - Chat List */}
          <ResizablePanel defaultSize={25} minSize={20} className="flex-grow">
            <div className="flex flex-col h-screen border ml-1">
              <div className="h-10 px-2 py-4 flex items-center">
                <p className="ml-1">Chats</p>
                <div className="flex justify-end w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon">
                        <SquarePen />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <User /> New Contact
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users /> New Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ListFilter />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Filter Chats By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <MessageSquareDot /> Unread
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star /> Favorites
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CircleUserRound /> Contacts
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CircleOff /> Non Contacts
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Users /> Groups
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquareDashed /> Drafts
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative px-2 py-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" />
                <Input
                  placeholder="Search or start new chat"
                  className="pl-10"
                />
              </div>

              {/* Contact List */}
              <ScrollArea className="flex-grow">
                {contactList.map((contact, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentChat(contact)}
                    className="px-4 w-full py-2 hover:bg-secondary cursor-pointer text-left"
                  >
                    <div className="flex flex-row gap-2">
                      <Avatar className="size-12">
                        <AvatarImage src={contact.image} />
                        <AvatarFallback>{contact.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <CardTitle>{contact.name}</CardTitle>
                        <CardDescription>{contact.message}</CardDescription>
                      </div>
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Chat Window */}
          <ResizablePanel defaultSize={75} minSize={40}>
            <div className="flex flex-col justify-between h-screen ml-1 pb-2">
              {/* Chat Header */}
              <div className="h-16 border-b flex items-center px-3">
                <Avatar className="size-12">
                  <AvatarImage src={currentChat?.image} />
                  <AvatarFallback>PR</AvatarFallback>
                </Avatar>
                <div className="space-y-1 ml-2">
                  <CardTitle>{currentChat?.name}</CardTitle>
                  <CardDescription>Contact Info</CardDescription>
                </div>
                <div className="flex-grow flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Video />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Phone />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Search />
                  </Button>
                </div>
              </div>

              {/* Chat Input */}
              <div className="flex h-10 pt-2 border-t">
                <Button variant="ghost" size="icon">
                  <Smile />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon">
                      <Paperclip />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Image /> Photos & Videos
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Camera /> Camera
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <File /> Document
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserRound /> Contact
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ChartBarIncreasing /> Poll
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Brush /> Drawing
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input
                  className="flex-grow border-0"
                  placeholder="Type a message"
                />
                <Button variant="ghost" size="icon">
                  <Send />
                </Button>
                <Button variant="ghost" size="icon">
                  <Mic />
                </Button>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarInset>
    </>
  )
}
