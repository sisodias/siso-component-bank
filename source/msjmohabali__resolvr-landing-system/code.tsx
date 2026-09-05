"use client";

import {
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  CircleCheck,
  Database,
  FileText,
  Headphones,
  Inbox,
  Lock,
  MessageSquareText,
  Mic,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

type LinkItem = { label: string; href: string };
type CardItem = { title: string; text: string; icon?: LucideIcon };
type PricingPlan = {
  name: string;
  price: string;
  text: string;
  items: string[];
  highlighted?: boolean;
};

type ResolvrLandingSystemProps = {
  logoSrc?: string;
  whiteLogoSrc?: string;
  signInHref?: string;
  signUpHref?: string;
  navItems?: LinkItem[];
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const brandGradient = "bg-gradient-to-b from-[#f84256] to-[#fd803b]";

const defaultNavItems: LinkItem[] = [
  { label: "Product", href: "#" },
  { label: "Workflows", href: "#" },
  { label: "Integraties", href: "#" },
  { label: "Prijzen", href: "#" },
  { label: "Docs", href: "#" },
];

const conversations = [
  {
    name: "Nora van Dijk",
    subject: "Factuur klopt niet",
    status: "AI concept klaar",
    tone: "bg-emerald-500",
  },
  {
    name: "Jules Smit",
    subject: "Kan niet inloggen",
    status: "Wacht op klant",
    tone: "bg-amber-500",
  },
  {
    name: "Mila Chen",
    subject: "Upgrade aanvraag",
    status: "Opgelost",
    tone: "bg-[#f84256]",
  },
];

const workflowSteps: Required<CardItem>[] = [
  {
    icon: Inbox,
    title: "Alles in een inbox",
    text: "Chat, mail, voice en widgetgesprekken landen in dezelfde rustige wachtrij.",
  },
  {
    icon: Search,
    title: "Context uit je kennisbank",
    text: "Resolvr zoekt beleid, docs, eerdere gesprekken en klantdata bij elkaar.",
  },
  {
    icon: Bot,
    title: "AI stelt de oplossing voor",
    text: "Je team ziet samenvatting, risico, actie en antwoord voordat iets uitgaat.",
  },
  {
    icon: CircleCheck,
    title: "Escalatie alleen als het moet",
    text: "Complexe cases gaan door met volledige context, eigenaar en volgende stap.",
  },
];

const features: Required<CardItem>[] = [
  {
    icon: MessageSquareText,
    title: "AI support inbox",
    text: "Prioriteer gesprekken op urgentie, sentiment en oplossingskans zonder dat je team hoeft te zoeken.",
  },
  {
    icon: FileText,
    title: "Kennis die meewerkt",
    text: "Upload docs, policies en FAQ's. Resolvr citeert bronnen zodat antwoorden controleerbaar blijven.",
  },
  {
    icon: Mic,
    title: "Voice assistant klaar",
    text: "Sluit voice aan en laat telefoongesprekken netjes samenvatten, labelen en opvolgen.",
  },
];

const controlRows: Required<CardItem>[] = [
  {
    title: "Human-in-the-loop",
    text: "Laat AI voorbereiden, maar houd goedkeuring, escalatie en klantgevoelige cases in handen van je team.",
    icon: ShieldCheck,
  },
  {
    title: "Auditbare antwoorden",
    text: "Bronnen, samenvattingen en acties blijven zichtbaar zodat je later kunt begrijpen waarom iets is opgelost.",
    icon: Lock,
  },
  {
    title: "Integraties zonder ruis",
    text: "Koppel supportkanalen, voice en kennisbronnen zonder een tweede werkplek naast je inbox te bouwen.",
    icon: Workflow,
  },
];

const pricing: PricingPlan[] = [
  {
    name: "Start",
    price: "€49",
    text: "Voor teams die hun support inbox slimmer willen maken.",
    items: ["1 workspace", "AI samenvattingen", "Widget + kennisbank"],
  },
  {
    name: "Scale",
    price: "€149",
    text: "Voor groeiende teams met meerdere kanalen en integraties.",
    items: ["Onbeperkte gesprekken", "Voice integratie", "Escalatie workflows"],
    highlighted: true,
  },
  {
    name: "Control",
    price: "Custom",
    text: "Voor organisaties met strakkere security en maatwerkprocessen.",
    items: ["SLA afspraken", "Audit logs", "Private onboarding"],
  },
];

const faqs = [
  {
    q: "Vervangt Resolvr ons supportteam?",
    a: "Nee. Resolvr haalt zoekwerk en herhaling uit de inbox, zodat mensen betere beslissingen nemen bij cases die aandacht vragen.",
  },
  {
    q: "Kunnen we bestaande docs gebruiken?",
    a: "Ja. Gebruik docs, policies en FAQ's als bronnen voor antwoorden en samenvattingen.",
  },
  {
    q: "Werkt dit ook met voice?",
    a: "Ja. Voicegesprekken kunnen terugkomen als opvolgbare supportcases.",
  },
];

function ButtonLink({
  children,
  href,
  variant = "primary",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "outline" | "ghost";
}) {
  return (
    <a
      className={cx(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition active:scale-[0.98]",
        variant === "primary" &&
          `${brandGradient} text-white shadow-sm hover:brightness-105`,
        variant === "outline" &&
          "border border-slate-200 bg-white text-slate-950 hover:bg-slate-50",
        variant === "ghost" && "text-slate-600 hover:text-slate-950"
      )}
      href={href}
    >
      {children}
    </a>
  );
}

export function ResolvrSectionHeader({
  title,
  text,
  align = "center",
}: {
  title: string;
  text: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cx("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      <h2 className="text-3xl font-semibold tracking-normal text-slate-950 md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">{text}</p>
    </div>
  );
}

export function ResolvrNavbar({
  logoSrc = "/resolvr.nl.png",
  navItems = defaultNavItems,
  signInHref = "/sign-in",
  signUpHref = "/sign-up",
}: ResolvrLandingSystemProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a className="flex items-center gap-2" href="/">
          <img alt="Resolvr" className="h-9 w-auto" src={logoSrc} />
        </a>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex">
          {navItems.map((item) => (
            <a className="transition hover:text-slate-950" href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex">
            <ButtonLink href={signInHref} variant="ghost">
              Inloggen
            </ButtonLink>
          </span>
          <ButtonLink href={signUpHref}>
            Start gratis
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

export function ResolvrProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[620px] rounded-lg border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-rose-400" />
          <span className="size-2 rounded-full bg-amber-400" />
          <span className="size-2 rounded-full bg-emerald-400" />
        </div>
        <div className="flex items-center gap-2 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500">
          <Sparkles className="size-3.5 text-[#f84256]" />
          Resolution mode
        </div>
      </div>
      <div className="h-1 bg-slate-100">
        <div className={`h-full w-2/3 ${brandGradient}`} />
      </div>
      <div className="grid min-h-[430px] grid-cols-[0.88fr_1.35fr] max-lg:grid-cols-1">
        <aside className="border-r border-slate-200 bg-slate-50/80 p-3 max-lg:border-r-0 max-lg:border-b">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-950">Inbox</div>
            <span className={`rounded-md ${brandGradient} px-2 py-1 text-xs font-semibold text-white`}>
              12 nieuw
            </span>
          </div>
          <div className="space-y-2">
            {conversations.map((conversation, index) => (
              <div
                className={cx(
                  "rounded-md border bg-white p-3 shadow-xs transition hover:-translate-y-0.5",
                  index === 0 ? "border-[#f84256]/30" : "border-slate-200"
                )}
                key={conversation.name}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-semibold text-slate-950">
                    {conversation.name}
                  </div>
                  <span className={cx("size-2 rounded-full", conversation.tone)} />
                </div>
                <div className="mt-1 truncate text-xs text-slate-500">
                  {conversation.subject}
                </div>
                <div className="mt-3 text-xs font-semibold text-[#f84256]">
                  {conversation.status}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <section className="p-4">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-950">Factuur klopt niet</h3>
              <p className="mt-1 text-sm text-slate-500">
                AI heeft 4 bronnen en 2 eerdere cases gevonden.
              </p>
            </div>
            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              laag risico
            </span>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-950">
              <Bot className="size-4 text-[#f84256]" />
              AI samenvatting
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Klant is dubbel belast na planwijziging. Abonnement staat goed,
              maar creditnota ontbreekt. Stel terugbetaling voor en bevestig
              nieuwe factuurdatum.
            </p>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-slate-200 p-3">
              <div className="text-xs font-semibold uppercase text-slate-400">Bronnen</div>
              <div className="mt-2 space-y-2 text-sm font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-slate-400" />
                  Billing policy
                </div>
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-slate-400" />
                  Stripe event
                </div>
              </div>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <div className="text-xs font-semibold uppercase text-slate-400">Actie</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">Creditnota maken</div>
              <div className="mt-1 text-sm text-slate-500">Conceptantwoord staat klaar.</div>
            </div>
          </div>
          <div className="mt-4 rounded-md border border-[#f84256]/25 bg-[#fff4f2] p-3">
            <div className="mb-2 text-sm font-semibold text-slate-950">Antwoordvoorstel</div>
            <p className="text-sm leading-6 text-slate-700">
              Hoi Nora, je hebt gelijk: er is dubbel gefactureerd na je upgrade.
              Ik heb de creditnota klaargezet en stuur je vandaag de bevestiging.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export function ResolvrWorkflowCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {workflowSteps.map((step, index) => (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs transition hover:-translate-y-1" key={step.title}>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-md bg-[#fff4f2] text-[#f84256]">
              <step.icon className="size-5" />
            </div>
            <span className="font-mono text-sm text-slate-400">0{index + 1}</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-950">{step.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
        </div>
      ))}
    </div>
  );
}

export function ResolvrFeatureRows() {
  return (
    <div className="grid gap-4">
      {features.map((feature) => (
        <div className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-xs transition hover:-translate-y-1" key={feature.title}>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
            <feature.icon className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-950">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ResolvrControlRows() {
  return (
    <div className="grid gap-4">
      {controlRows.map(({ title, text, icon: Icon }) => (
        <div className="grid gap-4 rounded-lg border border-slate-200 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center" key={title}>
          <div className="flex size-11 items-center justify-center rounded-md bg-[#fff4f2] text-[#f84256]">
            <Icon className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
          </div>
          <ChevronRight className="hidden size-5 text-slate-300 sm:block" />
        </div>
      ))}
    </div>
  );
}

export function ResolvrPricingCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {pricing.map((plan) => (
        <div
          className={cx(
            "rounded-lg border p-6 shadow-xs",
            plan.highlighted ? "border-[#f84256]/35 bg-[#fff4f2]" : "border-slate-200 bg-white"
          )}
          key={plan.name}
        >
          <h3 className="text-lg font-semibold text-slate-950">{plan.name}</h3>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-4xl font-semibold text-slate-950">{plan.price}</span>
            {plan.price.startsWith("€") ? (
              <span className="pb-1 text-sm font-medium text-slate-500">/ maand</span>
            ) : null}
          </div>
          <p className="mt-4 min-h-12 text-sm leading-6 text-slate-600">{plan.text}</p>
          <ul className="mt-6 space-y-3">
            {plan.items.map((item) => (
              <li className="flex items-center gap-2 text-sm font-medium text-slate-700" key={item}>
                <Check className="size-4 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
          <ButtonLink href="/sign-up" variant={plan.highlighted ? "primary" : "outline"}>
            Kies {plan.name}
          </ButtonLink>
        </div>
      ))}
    </div>
  );
}

export function ResolvrDarkCta({ whiteLogoSrc = "/resolvr-logo-wit.png" }: ResolvrLandingSystemProps) {
  const outcomes: Required<CardItem>[] = [
    { icon: Zap, title: "Sneller antwoorden", text: "AI schrijft mee met broncontext." },
    { icon: Headphones, title: "Rustigere teams", text: "Urgentie en eigenaar zijn helder." },
    { icon: PhoneCall, title: "Voice erbij", text: "Gesprekken worden opvolgbare cases." },
  ];

  return (
    <section className="border-y border-slate-200 bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <div>
          <img alt="Resolvr" className="mb-7 h-9 w-auto" src={whiteLogoSrc} />
          <h2 className="text-3xl font-semibold tracking-normal md:text-5xl">
            Klaar voor minder escalaties?
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg">
            Start klein met je widget en kennisbank, breid daarna uit naar voice,
            integraties en automatisering.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {outcomes.map(({ icon: Icon, title, text }) => (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5" key={title}>
              <Icon className="size-5 text-[#fd803b]" />
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResolvrFaqSection() {
  return (
    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
      <ResolvrSectionHeader
        align="left"
        text="Een paar praktische antwoorden voordat je je eerste workspace opent."
        title="Veelgestelde vragen"
      />
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs" key={faq.q}>
            <h3 className="text-base font-semibold text-slate-950">{faq.q}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResolvrFooter({ logoSrc = "/resolvr.nl.png" }: ResolvrLandingSystemProps) {
  return (
    <footer className="border-t border-slate-200 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <a className="flex items-center gap-2 font-semibold text-slate-950" href="/">
          <img alt="Resolvr" className="h-8 w-auto" src={logoSrc} />
        </a>
        <div className="flex flex-wrap gap-5">
          <a href="/sign-in">Inloggen</a>
          <a href="/sign-up">Start gratis</a>
          <a href="#">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

export default function ResolvrLandingSystem(props: ResolvrLandingSystemProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <ResolvrNavbar {...props} />
      <section className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fff7f4_62%,#fffaf8_100%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold leading-[1.04] tracking-normal text-slate-950 lg:text-7xl">
              Los klantvragen op voordat ze escaleren
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Resolvr brengt supportgesprekken, kennis en AI-acties samen in een
              rustige workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={props.signUpHref ?? "/sign-up"}>
                Start met oplossen
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href={props.signInHref ?? "/sign-in"} variant="outline">
                Bekijk dashboard
              </ButtonLink>
            </div>
            <div className="mt-8 grid max-w-xl gap-4 border-t border-slate-200 pt-6 lg:grid-cols-3">
              {["AI triage", "Kennisbank", "Voice ready"].map((item) => (
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600" key={item}>
                  <Check className="size-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <ResolvrProductMockup />
        </div>
      </section>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ResolvrSectionHeader
            text="Niet nog een chatbot naast je proces, maar een laag die je team helpt sneller, consistenter en controleerbaar te besluiten."
            title="Van losse tickets naar duidelijke resoluties"
          />
          <div className="mt-12">
            <ResolvrWorkflowCards />
          </div>
        </div>
      </section>
      <section className="border-y border-slate-200 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <ResolvrSectionHeader
            align="left"
            text="Resolvr werkt vanuit dezelfde bouwstenen die al in je dashboard zitten."
            title="Gebouwd rond hoe supportteams echt werken"
          />
          <ResolvrFeatureRows />
        </div>
      </section>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          <ResolvrSectionHeader
            align="left"
            text="Houd snelheid en controle in balans met workflows die duidelijk tonen wat AI doet."
            title="Snel waar het kan, zorgvuldig waar het moet"
          />
          <div className="lg:col-span-2">
            <ResolvrControlRows />
          </div>
        </div>
      </section>
      <ResolvrDarkCta {...props} />
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ResolvrSectionHeader
            text="Kies een startpunt dat past bij je team."
            title="Prijzen die meegroeien met je supportvolume"
          />
          <div className="mt-12">
            <ResolvrPricingCards />
          </div>
        </div>
      </section>
      <section className="border-t border-slate-200 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ResolvrFaqSection />
        </div>
      </section>
      <ResolvrFooter {...props} />
    </main>
  );
}
