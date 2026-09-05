import { Bot, MoreVertical, Paperclip, Phone, Search, Send } from 'lucide-react';

type Chat = {
  name: string;
  message: string;
  time: string;
  unread?: number;
  active?: boolean;
};

type WhatSaaSChatInboxProps = {
  chats?: Chat[];
};

const defaultChats: Chat[] = [
  { name: 'Alice Freeman', message: 'Can you send pricing?', time: '10:23', active: true },
  { name: 'Tech Solutions', message: 'Webhook payload received', time: '09:45', unread: 2 },
  { name: 'Sarah Smith', message: 'Appointment confirmed', time: 'Yesterday' },
];

export default function WhatSaaSChatInbox({ chats = defaultChats }: WhatSaaSChatInboxProps) {
  const active = chats.find((chat) => chat.active) || chats[0];

  return (
    <div className="grid min-h-[680px] overflow-hidden rounded-xl border bg-background text-foreground lg:grid-cols-[22rem_1fr_18rem]">
      <aside className="border-r">
        <div className="border-b p-4">
          <h2 className="font-semibold">Inbox</h2>
          <div className="mt-4 flex h-10 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            Search conversations
          </div>
        </div>
        <div className="space-y-2 p-2">
          {chats.map((chat) => (
            <button key={chat.name} className={`flex w-full gap-3 rounded-lg border p-3 text-left ${chat.active ? 'border-primary/20 bg-primary/10' : 'border-transparent hover:bg-muted/40'}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {chat.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{chat.name}</p>
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{chat.message}</p>
              </div>
              {chat.unread ? <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">{chat.unread}</span> : null}
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {active.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{active.name}</p>
              <p className="text-xs text-emerald-600">online</p>
            </div>
          </div>
          <div className="flex gap-2 text-muted-foreground">
            <Phone className="h-5 w-5" />
            <MoreVertical className="h-5 w-5" />
          </div>
        </header>
        <div className="flex-1 space-y-4 bg-muted/20 p-5">
          <div className="max-w-[78%] rounded-xl rounded-tl-sm bg-card px-4 py-3 text-sm shadow-sm">Can you send the growth plan and book a call?</div>
          <div className="ml-auto max-w-[78%] rounded-xl rounded-tr-sm border border-primary/20 bg-primary/10 px-4 py-3 text-sm">
            <div className="mb-2 flex items-center gap-1 text-xs font-semibold text-primary">
              <Bot className="h-3 w-3" />
              AI assistant
            </div>
            I can send pricing and reserve a 30-minute consultation this afternoon.
          </div>
        </div>
        <footer className="border-t p-4">
          <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2">
            <input className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" placeholder="Type a message..." />
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <button className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </section>

      <aside className="hidden border-l p-5 lg:block">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {active.name.slice(0, 2).toUpperCase()}
          </div>
          <h3 className="mt-3 font-semibold">{active.name}</h3>
          <p className="text-sm text-muted-foreground">+1 555 012 3456</p>
        </div>
        <div className="mt-6 space-y-4">
          <Info label="Stage" value="Negotiation" />
          <Info label="Owner" value="Sales team" />
          <Info label="Tags" value="Hot lead, Voice enabled" />
        </div>
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}
