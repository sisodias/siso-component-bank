"use client";

import {
  ArrowLeft,
  Bot,
  Check,
  FileText,
  Headphones,
  Loader2,
  Mail,
  MessageCircle,
  Mic,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

type WidgetScreen = "loading" | "error" | "auth" | "selection" | "inbox" | "chat" | "voice" | "contact";

type ResolvrWidgetSystemProps = {
  screen?: WidgetScreen;
  logoSrc?: string;
  organizationName?: string;
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function WidgetHeader({
  logoSrc = "/resolvr-favicon.png",
  title = "Resolvr",
  onBack,
}: {
  logoSrc?: string;
  title?: string;
  onBack?: boolean;
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" type="button">
            <ArrowLeft className="size-4" />
          </button>
        ) : null}
        <img alt="" className="size-7 rounded-md object-contain" src={logoSrc} />
        <div>
          <div className="text-sm font-semibold text-slate-950">{title}</div>
          <div className="text-xs text-emerald-600">Online</div>
        </div>
      </div>
      <Sparkles className="size-4 text-[#f84256]" />
    </header>
  );
}

function WidgetFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-2 text-center text-[11px] font-medium text-slate-400">
      Powered by Resolvr
    </footer>
  );
}

function WidgetLoadingScreen({ organizationName = "Resolvr" }: { organizationName?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white p-8 text-center">
      <Loader2 className="mb-4 size-8 animate-spin text-[#f84256]" />
      <h3 className="text-base font-semibold text-slate-950">{organizationName} laden</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">We halen je supportkanalen en instellingen op.</p>
    </div>
  );
}

function WidgetErrorScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white p-8 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#fff4f2] text-[#f84256]">
        !
      </div>
      <h3 className="text-base font-semibold text-slate-950">Widget niet beschikbaar</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">Controleer de organisatiecode of probeer het later opnieuw.</p>
    </div>
  );
}

function WidgetAuthScreen() {
  return (
    <div className="flex flex-1 flex-col justify-center bg-white p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-950">Welkom terug</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">Laat je e-mailadres achter zodat we je gesprek kunnen terugvinden.</p>
      </div>
      <div className="space-y-3">
        <input className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-[#f84256]" placeholder="jij@bedrijf.nl" />
        <button className="h-11 w-full rounded-md bg-gradient-to-b from-[#f84256] to-[#fd803b] text-sm font-semibold text-white" type="button">
          Ga verder
        </button>
      </div>
    </div>
  );
}

function WidgetSelectionScreen() {
  const options = [
    { title: "Chat met support", text: "Krijg direct hulp van AI en team.", icon: MessageCircle },
    { title: "Bel de assistant", text: "Start een voicegesprek.", icon: Phone },
    { title: "Stuur contactverzoek", text: "Wij nemen contact met je op.", icon: Mail },
  ];

  return (
    <div className="flex-1 bg-slate-50 p-4">
      <div className="mb-4 rounded-lg bg-gradient-to-b from-[#f84256] to-[#fd803b] p-5 text-white">
        <h3 className="text-lg font-semibold">Waar kunnen we mee helpen?</h3>
        <p className="mt-2 text-sm leading-6 text-white/85">Kies het kanaal dat bij je vraag past.</p>
      </div>
      <div className="space-y-2">
        {options.map((option) => (
          <button className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-xs" key={option.title} type="button">
            <div className="flex size-10 items-center justify-center rounded-md bg-[#fff4f2] text-[#f84256]">
              <option.icon className="size-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-950">{option.title}</div>
              <div className="text-xs text-slate-500">{option.text}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function WidgetInboxScreen() {
  return (
    <div className="flex-1 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-950">Je gesprekken</h3>
      {["Factuur klopt niet", "Kan niet inloggen", "Upgrade aanvraag"].map((subject, index) => (
        <article className="mb-2 rounded-lg border border-slate-200 bg-white p-4" key={subject}>
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-slate-950">{subject}</h4>
            <span className={cx("size-2 rounded-full", index === 0 ? "bg-[#f84256]" : "bg-emerald-500")} />
          </div>
          <p className="mt-1 text-xs text-slate-500">{index === 0 ? "AI concept klaar" : "Opgelost"}</p>
        </article>
      ))}
    </div>
  );
}

function WidgetChatScreen() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <div className="flex-1 space-y-3 overflow-hidden p-4">
        <div className="max-w-[82%] rounded-lg bg-white p-3 text-sm leading-6 text-slate-700 shadow-xs">
          Hoi, ik ben de Resolvr assistant. Waar kan ik mee helpen?
        </div>
        <div className="ml-auto max-w-[82%] rounded-lg bg-gradient-to-b from-[#f84256] to-[#fd803b] p-3 text-sm leading-6 text-white">
          Mijn factuur lijkt dubbel gefactureerd.
        </div>
        <div className="max-w-[82%] rounded-lg bg-white p-3 text-sm leading-6 text-slate-700 shadow-xs">
          Ik kijk met je mee. Ik heb je abonnement en laatste factuur gevonden.
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white p-3">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
          <input className="min-w-0 flex-1 text-sm outline-none" placeholder="Typ je bericht..." />
          <button className="flex size-8 items-center justify-center rounded-md bg-[#f84256] text-white" type="button">
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function WidgetVoiceScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-slate-950 p-8 text-center text-white">
      <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-gradient-to-b from-[#f84256] to-[#fd803b] shadow-[0_0_40px_rgba(248,66,86,0.35)]">
        <Mic className="size-9" />
      </div>
      <h3 className="text-xl font-semibold">Voice assistant luistert</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">Stel je vraag. We zetten het gesprek daarna om naar een supportcase.</p>
    </div>
  );
}

function WidgetContactScreen() {
  return (
    <div className="flex-1 bg-white p-6">
      <h3 className="text-xl font-semibold text-slate-950">Contactverzoek</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">Laat je gegevens achter, dan komt het team erop terug.</p>
      <div className="mt-6 space-y-3">
        <input className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-[#f84256]" placeholder="Naam" />
        <input className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-[#f84256]" placeholder="E-mail" />
        <textarea className="min-h-28 w-full rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-[#f84256]" placeholder="Waar kunnen we mee helpen?" />
        <button className="h-11 w-full rounded-md bg-gradient-to-b from-[#f84256] to-[#fd803b] text-sm font-semibold text-white" type="button">
          Versturen
        </button>
      </div>
    </div>
  );
}

export function ResolvrWidgetTrustBar() {
  return (
    <div className="grid grid-cols-3 gap-2 border-t border-slate-200 bg-white p-3 text-center text-[11px] font-medium text-slate-500">
      <div className="flex items-center justify-center gap-1"><ShieldCheck className="size-3 text-emerald-500" /> Veilig</div>
      <div className="flex items-center justify-center gap-1"><FileText className="size-3 text-[#f84256]" /> Bronnen</div>
      <div className="flex items-center justify-center gap-1"><Headphones className="size-3 text-[#fd803b]" /> Support</div>
    </div>
  );
}

export function ResolvrWidgetLauncher() {
  return (
    <button className="flex size-14 items-center justify-center rounded-full bg-gradient-to-b from-[#f84256] to-[#fd803b] text-white shadow-[0_16px_36px_rgba(248,66,86,0.35)]" type="button">
      <MessageCircle className="size-6" />
    </button>
  );
}

export default function ResolvrWidgetSystem({
  screen = "selection",
  logoSrc = "/resolvr-favicon.png",
  organizationName = "Resolvr",
}: ResolvrWidgetSystemProps) {
  const screens: Record<WidgetScreen, React.ReactNode> = {
    loading: <WidgetLoadingScreen organizationName={organizationName} />,
    error: <WidgetErrorScreen />,
    auth: <WidgetAuthScreen />,
    selection: <WidgetSelectionScreen />,
    inbox: <WidgetInboxScreen />,
    chat: <WidgetChatScreen />,
    voice: <WidgetVoiceScreen />,
    contact: <WidgetContactScreen />,
  };

  return (
    <div className="flex h-[640px] w-full max-w-[390px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-2xl">
      <WidgetHeader logoSrc={logoSrc} onBack={screen !== "selection"} title={organizationName} />
      {screens[screen]}
      <ResolvrWidgetTrustBar />
      <WidgetFooter />
    </div>
  );
}
