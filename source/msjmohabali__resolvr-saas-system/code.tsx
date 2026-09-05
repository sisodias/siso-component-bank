"use client";

import {
  Bot,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  Inbox,
  LayoutDashboard,
  LibraryBig,
  Mic,
  Palette,
  Plug,
  Upload,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";

type NavItem = { title: string; url: string; icon: LucideIcon };
type Conversation = {
  customer: string;
  subject: string;
  status: string;
  priority: "low" | "medium" | "high";
};
type Integration = { name: string; description: string; status: "connected" | "available" };

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const supportItems: NavItem[] = [
  { title: "Conversations", url: "/conversations", icon: Inbox },
  { title: "Knowledge Base", url: "/files", icon: LibraryBig },
];

const configItems: NavItem[] = [
  { title: "Widget Customization", url: "/customization", icon: Palette },
  { title: "Integrations", url: "/integrations", icon: LayoutDashboard },
  { title: "Voice Assistant", url: "/plugins/vapi", icon: Mic },
];

const accountItems: NavItem[] = [
  { title: "Plans & Billing", url: "/billing", icon: CreditCard },
];

const conversations: Conversation[] = [
  { customer: "Nora van Dijk", subject: "Factuur klopt niet", status: "AI concept klaar", priority: "low" },
  { customer: "Jules Smit", subject: "Kan niet inloggen", status: "Wacht op klant", priority: "medium" },
  { customer: "Mila Chen", subject: "Upgrade aanvraag", status: "Opgelost", priority: "high" },
];

const integrations: Integration[] = [
  { name: "Stripe", description: "Koppel billing events aan supportcases.", status: "connected" },
  { name: "Vapi", description: "Zet voicegesprekken om naar opvolgbare cases.", status: "available" },
  { name: "Knowledge Base", description: "Gebruik docs en policy's als bronmateriaal.", status: "connected" },
];

function SidebarSection({ title, items, activeUrl }: { title: string; items: NavItem[]; activeUrl: string }) {
  return (
    <section className="space-y-2">
      <div className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</div>
      <div className="space-y-1">
        {items.map((item) => (
          <a
            className={cx(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
              activeUrl === item.url
                ? "bg-gradient-to-b from-[#f84256] to-[#fd803b] text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            )}
            href={item.url}
            key={item.title}
          >
            <item.icon className="size-4" />
            <span>{item.title}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function ResolvrDashboardSidebar({
  activeUrl = "/conversations",
  logoSrc = "/resolvr.nl.png",
}: {
  activeUrl?: string;
  logoSrc?: string;
}) {
  return (
    <aside className="flex min-h-[720px] w-72 flex-col border-r border-slate-200 bg-white p-3">
      <a className="mb-4 flex h-11 items-center rounded-md px-2 hover:bg-slate-50" href="/conversations">
        <img alt="Resolvr" className="h-7 w-auto" src={logoSrc} />
      </a>
      <div className="mb-4 rounded-md border border-slate-200 p-3">
        <div className="text-sm font-semibold text-slate-950">Path to Resilience</div>
        <div className="mt-1 text-xs text-slate-500">Organization workspace</div>
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <SidebarSection activeUrl={activeUrl} items={supportItems} title="Customer Support" />
        <SidebarSection activeUrl={activeUrl} items={configItems} title="Configuration" />
        <SidebarSection activeUrl={activeUrl} items={accountItems} title="Account" />
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-md border border-slate-200 p-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-slate-100">
          <UserRound className="size-4 text-slate-500" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-950">Jason</div>
          <div className="text-xs text-slate-500">Admin</div>
        </div>
      </div>
    </aside>
  );
}

export function ResolvrConversationPanel() {
  return (
    <section className="w-full max-w-sm border-r border-slate-200 bg-slate-50/80 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Conversations</h2>
          <p className="text-sm text-slate-500">12 nieuwe gesprekken</p>
        </div>
        <span className="rounded-md bg-[#fff4f2] px-2.5 py-1 text-xs font-semibold text-[#f84256]">
          AI triage
        </span>
      </div>
      <div className="space-y-2">
        {conversations.map((conversation, index) => (
          <article
            className={cx(
              "rounded-lg border bg-white p-4 shadow-xs",
              index === 0 ? "border-[#f84256]/30" : "border-slate-200"
            )}
            key={conversation.customer}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-semibold text-slate-950">{conversation.customer}</h3>
              <span
                className={cx(
                  "size-2 rounded-full",
                  conversation.priority === "high" && "bg-[#f84256]",
                  conversation.priority === "medium" && "bg-amber-500",
                  conversation.priority === "low" && "bg-emerald-500"
                )}
              />
            </div>
            <p className="mt-1 text-sm text-slate-500">{conversation.subject}</p>
            <p className="mt-3 text-xs font-semibold text-[#f84256]">{conversation.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ResolvrConversationDetail() {
  return (
    <section className="flex-1 bg-white p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Factuur klopt niet</h2>
          <p className="mt-1 text-sm text-slate-500">AI heeft 4 bronnen en 2 eerdere cases gevonden.</p>
        </div>
        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          laag risico
        </span>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-950">
          <Bot className="size-4 text-[#f84256]" />
          AI samenvatting
        </div>
        <p className="text-sm leading-6 text-slate-600">
          Klant is dubbel belast na planwijziging. Abonnement staat goed, maar
          creditnota ontbreekt. Stel terugbetaling voor en bevestig nieuwe factuurdatum.
        </p>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="text-xs font-semibold uppercase text-slate-400">Bronnen</div>
          <div className="mt-3 space-y-2 text-sm font-medium text-slate-700">
            <div className="flex items-center gap-2"><FileText className="size-4 text-slate-400" /> Billing policy</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-slate-400" /> Stripe event</div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="text-xs font-semibold uppercase text-slate-400">Actie</div>
          <div className="mt-3 text-sm font-semibold text-slate-950">Creditnota maken</div>
          <p className="mt-1 text-sm text-slate-500">Conceptantwoord staat klaar.</p>
        </div>
      </div>
    </section>
  );
}

export function ResolvrContactPanel() {
  return (
    <aside className="w-full max-w-xs border-l border-slate-200 bg-slate-50 p-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#fff4f2] font-semibold text-[#f84256]">
            Nv
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-950">Nora van Dijk</h3>
            <p className="text-xs text-slate-500">nora@example.com</p>
          </div>
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Plan</dt><dd className="font-medium text-slate-950">Scale</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500">MRR</dt><dd className="font-medium text-slate-950">€149</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Status</dt><dd className="font-medium text-emerald-600">Active</dd></div>
        </dl>
      </div>
    </aside>
  );
}

export function ResolvrIntegrationsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {integrations.map((integration) => (
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs" key={integration.name}>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-md bg-slate-950 text-white">
              <Plug className="size-5" />
            </div>
            <span
              className={cx(
                "rounded-md px-2 py-1 text-xs font-semibold",
                integration.status === "connected"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              {integration.status === "connected" ? "Connected" : "Available"}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-950">{integration.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{integration.description}</p>
        </article>
      ))}
    </div>
  );
}

export function ResolvrUploadDialogMock() {
  return (
    <div className="max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Upload knowledge</h3>
          <p className="text-sm text-slate-500">Voeg policy's, FAQ's en docs toe.</p>
        </div>
        <button className="rounded-md p-2 text-slate-400 hover:bg-slate-100" type="button">
          <X className="size-4" />
        </button>
      </div>
      <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <Upload className="mb-3 size-8 text-[#f84256]" />
        <div className="text-sm font-semibold text-slate-950">Sleep bestanden hierheen</div>
        <p className="mt-1 text-xs text-slate-500">PDF, Markdown, TXT of DOCX</p>
      </div>
    </div>
  );
}

export function ResolvrPremiumOverlay() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6">
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
      <div className="relative mx-auto max-w-sm rounded-lg border border-[#f84256]/20 bg-[#fff4f2] p-5 text-center shadow-sm">
        <Mic className="mx-auto size-8 text-[#f84256]" />
        <h3 className="mt-4 text-lg font-semibold text-slate-950">Voice assistant vereist Scale</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Upgrade om voicegesprekken automatisch te verwerken als supportcases.
        </p>
        <a className="mt-5 inline-flex rounded-md bg-gradient-to-b from-[#f84256] to-[#fd803b] px-4 py-2 text-sm font-semibold text-white" href="/billing">
          Bekijk plannen
        </a>
      </div>
    </div>
  );
}

export default function ResolvrSaasSystem({ logoSrc = "/resolvr.nl.png" }: { logoSrc?: string }) {
  return (
    <div className="flex min-h-[720px] overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm">
      <ResolvrDashboardSidebar logoSrc={logoSrc} />
      <ResolvrConversationPanel />
      <ResolvrConversationDetail />
      <ResolvrContactPanel />
    </div>
  );
}
