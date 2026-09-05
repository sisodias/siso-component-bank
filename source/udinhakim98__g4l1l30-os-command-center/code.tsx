"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bot,
  Brain,
  CheckCircle2,
  ChevronDown,
  Circle,
  ClipboardList,
  Command,
  DollarSign,
  FileText,
  ImageIcon,
  Inbox,
  Mic,
  Network,
  PenLine,
  Radio,
  RefreshCcw,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Video,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";

type AgentStatus = "completed" | "in-progress" | "pending" | "need-help" | "failed";
type Priority = "P0" | "P1" | "P2";
type CaptureRoute = "inbox" | "decision-log" | "agent-task";
type RiskTier = "safe" | "write" | "money" | "public";

type AgentNode = {
  id: string;
  name: string;
  role: string;
  currentTask: string;
  status: AgentStatus;
  progress: number;
  toolLane: string;
  nextOutput: string;
  connectedTo: string[];
  lastUpdate: string;
};

type MissionAnswer = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "copper" | "amber" | "green" | "red" | "stone";
};

type PlanTask = {
  id: string;
  title: string;
  owner: string;
  priority: Priority;
  status: AgentStatus;
  progress: number;
  dependencies: string[];
  subtasks: Array<{
    id: string;
    title: string;
    status: AgentStatus;
    detail: string;
  }>;
};

type CommandItem = {
  title: string;
  owner: string;
  priority: Priority;
  risk: RiskTier;
  approval: string;
  status: AgentStatus;
};

type BrainItem = {
  label: string;
  path: string;
  status: string;
  updated?: string;
  detail?: string;
};

type BrainHandoff = {
  from: string;
  to: string;
  summary: string;
  status: string;
  time: string;
  path?: string;
};

type MoneyState = {
  realClientPaymentsRm: number;
  seedTestPaymentsRm: number;
  adSpendRm: number;
  mrrRm: number;
  goalMrrRm: number;
};

type ValidationGate = {
  label: string;
  current: number;
  target: number;
  evidence: string;
};

type GenerationCard = {
  id: "image" | "video" | "avatar";
  label: string;
  prompt: string;
  model: string;
  status: string;
  nextAction: string;
  icon: React.ComponentType<{ className?: string }>;
};

type SystemSignal = {
  label: string;
  value: string;
  status: AgentStatus;
};

export type CommandCenterData = {
  osName: string;
  mode: string;
  businessFocus: string;
  currentMission: string;
  currentStage: string;
  topPriority: string;
  lastSync: string;
  autonomyMode: string;
  approvalMode: string;
  systemStatus: string;
  mission: MissionAnswer[];
  agents: AgentNode[];
  plan: PlanTask[];
  commands: CommandItem[];
  brain: {
    vaultSync: string;
    sourceNotes: BrainItem[];
    handoffs: BrainHandoff[];
    logs: BrainItem[];
    decisions: BrainItem[];
    inboxCaptures: BrainItem[];
  };
  money: MoneyState;
  validation: ValidationGate[];
  generation: GenerationCard[];
  systemSignals: SystemSignal[];
};

type Props = {
  data?: Partial<CommandCenterData>;
  title?: string;
  onPrimaryAction?: () => void;
};

const baseData: CommandCenterData = {
  osName: "g4l1l30 OS",
  mode: "AI Agent Command Center",
  businessFocus: "Private founder OS for AI offer validation and agent execution.",
  currentMission: "Command the AI team, keep the company brain in sync, and move the next validation action without turning the dashboard into a sales page.",
  currentStage: "Stage 3 Validation Lab",
  topPriority: "Ship the local command center, verify both routes, then publish the component as unlisted.",
  lastSync: "2026-06-16 21:10 MYT",
  autonomyMode: "Autonomy: safe local execution",
  approvalMode: "Approval: quote before spend",
  systemStatus: "System: local build pending",
  mission: [
    {
      label: "Mission now",
      value: "Run the private company OS from one screen: agents, vault, approvals, money truth, and next move.",
      icon: Target,
      tone: "copper",
    },
    {
      label: "Next critical move",
      value: "Finish the command center build, run acceptance checks, then push an unlisted registry update.",
      icon: Zap,
      tone: "amber",
    },
    {
      label: "Blocked",
      value: "Founder validation list and verified live-payment evidence are still pending.",
      icon: AlertTriangle,
      tone: "red",
    },
    {
      label: "Founder approval",
      value: "Money spend, public publishing, credential changes, customer messages, and production actions.",
      icon: ShieldCheck,
      tone: "stone",
    },
    {
      label: "Autonomous",
      value: "Local UI edits, vault reading, build checks, non-public notes, and unlisted component updates.",
      icon: CheckCircle2,
      tone: "green",
    },
  ],
  agents: [
    {
      id: "hermes",
      name: "Hermes",
      role: "Operator",
      currentTask: "Sync vault context, logs, Telegram captures, and operational handoffs.",
      status: "in-progress",
      progress: 86,
      toolLane: "Vault / Telegram / cron",
      nextOutput: "Latest handoff and shared-brain update.",
      connectedTo: ["codex", "cfo", "growth"],
      lastUpdate: "21:10 MYT",
    },
    {
      id: "claude",
      name: "Claude Code",
      role: "Builder",
      currentTask: "Keep implementation handoffs clean and ready for product buildout.",
      status: "pending",
      progress: 58,
      toolLane: "Repo / app / review",
      nextOutput: "Builder pass after current Codex run.",
      connectedTo: ["hermes", "codex"],
      lastUpdate: "13:55 MYT",
    },
    {
      id: "codex",
      name: "Codex",
      role: "Engineer",
      currentTask: "Refine the command center component and verify local routes.",
      status: "in-progress",
      progress: 78,
      toolLane: "Next.js / TypeScript / registry",
      nextOutput: "Build result, route checks, security scan.",
      connectedTo: ["hermes", "claude", "creative"],
      lastUpdate: "now",
    },
    {
      id: "cfo",
      name: "CFO",
      role: "Money",
      currentTask: "Separate real client payments from seed and test numbers.",
      status: "need-help",
      progress: 34,
      toolLane: "Finance notes / evidence",
      nextOutput: "Real-cash proof table once live evidence exists.",
      connectedTo: ["hermes", "growth"],
      lastUpdate: "waiting",
    },
    {
      id: "growth",
      name: "Growth",
      role: "Demand",
      currentTask: "Build validation contact queue, scripts, objections, and follow-ups.",
      status: "need-help",
      progress: 41,
      toolLane: "Leads / WhatsApp / scorecard",
      nextOutput: "15-person validation list and outreach queue.",
      connectedTo: ["hermes", "cfo", "creative"],
      lastUpdate: "pending founder",
    },
    {
      id: "creative",
      name: "Creative",
      role: "Marketing AI",
      currentTask: "Prepare internal image, video, and avatar asset prompts for approval.",
      status: "pending",
      progress: 52,
      toolLane: "Image / video / avatar",
      nextOutput: "Approved asset batch with cost guardrails.",
      connectedTo: ["codex", "growth"],
      lastUpdate: "queued",
    },
  ],
  plan: [
    {
      id: "ship-os",
      title: "Ship command center shell",
      owner: "Codex",
      priority: "P0",
      status: "in-progress",
      progress: 82,
      dependencies: ["Vault manual", "21st auth", "existing Next app"],
      subtasks: [
        { id: "ship-os-1", title: "Read TXT and source notes", status: "completed", detail: "Instruction file, vault manual, handoffs, and product brief loaded." },
        { id: "ship-os-2", title: "Refine dashboard modules", status: "in-progress", detail: "Mission, agents, plan tree, brain, money, capture, and generation docks." },
        { id: "ship-os-3", title: "Verify routes and scan", status: "pending", detail: "Build, route content checks, banned-copy scan, and secret scan." },
      ],
    },
    {
      id: "founder-validation",
      title: "Create validation queue",
      owner: "Growth",
      priority: "P0",
      status: "need-help",
      progress: 22,
      dependencies: ["Founder contact list"],
      subtasks: [
        { id: "founder-validation-1", title: "List 15 target people", status: "need-help", detail: "Founder supplies names or segments." },
        { id: "founder-validation-2", title: "Route conversations", status: "pending", detail: "Agent logs objections, intent, and paid commitment signals." },
      ],
    },
    {
      id: "money-truth",
      title: "Lock money truth layer",
      owner: "CFO",
      priority: "P1",
      status: "need-help",
      progress: 30,
      dependencies: ["Payment evidence", "expense source"],
      subtasks: [
        { id: "money-truth-1", title: "Mark real client cash", status: "pending", detail: "Only verified payments count as revenue." },
        { id: "money-truth-2", title: "Keep seed and test numbers separate", status: "in-progress", detail: "Sample values stay visibly labeled as internal or test." },
      ],
    },
    {
      id: "brain-loop",
      title: "Keep Company Brain current",
      owner: "Hermes",
      priority: "P1",
      status: "in-progress",
      progress: 66,
      dependencies: ["Obsidian vault"],
      subtasks: [
        { id: "brain-loop-1", title: "Surface source notes", status: "completed", detail: "Manual, command center note, profile, program, and handoffs indexed." },
        { id: "brain-loop-2", title: "Write durable work log", status: "pending", detail: "Codex log after implementation and verification." },
      ],
    },
    {
      id: "creative-dock",
      title: "Prepare internal generation lane",
      owner: "Creative",
      priority: "P2",
      status: "pending",
      progress: 18,
      dependencies: ["Founder approval", "cost quote"],
      subtasks: [
        { id: "creative-dock-1", title: "Image prompt card", status: "pending", detail: "Static prompt for ad or dashboard visual draft." },
        { id: "creative-dock-2", title: "Video prompt card", status: "pending", detail: "Motion prompt stays gated before paid generation." },
        { id: "creative-dock-3", title: "Avatar prompt card", status: "pending", detail: "Founder-facing avatar concept only after review." },
      ],
    },
  ],
  commands: [
    {
      title: "Approve unlisted component publish",
      owner: "Codex",
      priority: "P0",
      risk: "public",
      approval: "Allowed if unlisted and no secrets",
      status: "in-progress",
    },
    {
      title: "Supply validation contact list",
      owner: "Founder",
      priority: "P0",
      risk: "safe",
      approval: "Founder input needed",
      status: "need-help",
    },
    {
      title: "Confirm paid-tool budget rule",
      owner: "Founder",
      priority: "P1",
      risk: "money",
      approval: "Quote before spend",
      status: "completed",
    },
    {
      title: "Generate agent handoff after build",
      owner: "Codex",
      priority: "P1",
      risk: "write",
      approval: "Safe vault note",
      status: "pending",
    },
  ],
  brain: {
    vaultSync: "Vault reachable. Inbox currently clear. Latest handoffs loaded.",
    sourceNotes: [
      { label: "Vault operating manual", path: "CLAUDE.md", status: "read" },
      { label: "Founder profile", path: "founder/founder-profile.md", status: "read" },
      { label: "Business launch program", path: "founder/business-launch-program.md", status: "read" },
      { label: "Command center source", path: "founder/command-center.md", status: "read" },
      { label: "OS product brief", path: "product/g4l1l30-os-command-center-brief.md", status: "read" },
    ],
    handoffs: [
      { from: "Codex", to: "Codex", summary: "21st.dev command center continuation note", status: "loaded", time: "13:58" },
      { from: "Codex", to: "Hermes", summary: "Command center implementation requirements", status: "loaded", time: "13:55" },
      { from: "Hermes", to: "Codex", summary: "v2 integration notes and pattern map", status: "loaded", time: "21:10" },
    ],
    logs: [
      { label: "g4l1l30 OS command center v2", path: "ai-logs/hermes/2026-06-16-2110-g4l1l30-os-command-center-v2.md", status: "fallback" },
      { label: "Founder OS command center", path: "ai-logs/codex/2026-06-16-0456-founder-os-command-center.md", status: "fallback" },
    ],
    decisions: [
      { label: "Shared brain is source of truth", path: "founder/decisions/ADR-001-shared-brain-setup.md", status: "accepted" },
      { label: "Current offer direction locked", path: "founder/decisions/current-offer.md", status: "accepted" },
      { label: "Founder approval gates", path: "founder/command-center.md", status: "active" },
    ],
    inboxCaptures: [
      { label: "dashboard smoke test", path: "inbox/2026-06-16-command-center-capture.md", status: "captured" },
      { label: "colour hitam oren je", path: "inbox/2026-06-16-command-center-capture.md", status: "captured" },
    ],
  },
  money: {
    realClientPaymentsRm: 0,
    seedTestPaymentsRm: 0,
    adSpendRm: 0,
    mrrRm: 0,
    goalMrrRm: 5000,
  },
  validation: [
    { label: "Scorecard leads", current: 0, target: 50, evidence: "source: vault metrics" },
    { label: "Human conversations", current: 0, target: 15, evidence: "source: interview notes" },
    { label: "Paid buyers", current: 0, target: 20, evidence: "source: payment evidence" },
    { label: "Upsell calls", current: 0, target: 3, evidence: "source: call log" },
  ],
  generation: [
    {
      id: "image",
      label: "Image",
      prompt: "Copper command-room visual with founder desk, agent monitors, and readable AI ops panels.",
      model: "Image model, approval gated",
      status: "draft prompt",
      nextAction: "Quote cost, then generate preview.",
      icon: ImageIcon,
    },
    {
      id: "video",
      label: "Video",
      prompt: "Short screen-led execution clip: command center opens, agents update, founder approves next move.",
      model: "Video model, approval gated",
      status: "waiting approval",
      nextAction: "Founder approves budget before render.",
      icon: Video,
    },
    {
      id: "avatar",
      label: "Avatar",
      prompt: "Founder operator avatar speaking concise BM/English update from the command center.",
      model: "Avatar model, approval gated",
      status: "queued",
      nextAction: "Pick voice and tone after script review.",
      icon: UserRound,
    },
  ],
  systemSignals: [
    { label: "Obsidian vault", value: "reachable", status: "completed" },
    { label: "21st registry", value: "auth ok", status: "completed" },
    { label: "Local app", value: "editing", status: "in-progress" },
    { label: "Secret hygiene", value: "scan pending", status: "pending" },
  ],
};

const statusMeta: Record<
  AgentStatus,
  { label: string; dot: string; badge: string; icon: React.ComponentType<{ className?: string }> }
> = {
  completed: {
    label: "completed",
    dot: "bg-emerald-300",
    badge: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
    icon: CheckCircle2,
  },
  "in-progress": {
    label: "in progress",
    dot: "bg-orange-300",
    badge: "border-orange-300/25 bg-orange-300/10 text-orange-100",
    icon: Activity,
  },
  pending: {
    label: "pending",
    dot: "bg-stone-400",
    badge: "border-stone-300/20 bg-stone-300/10 text-stone-200",
    icon: Circle,
  },
  "need-help": {
    label: "need help",
    dot: "bg-yellow-300",
    badge: "border-yellow-300/25 bg-yellow-300/10 text-yellow-100",
    icon: AlertTriangle,
  },
  failed: {
    label: "failed",
    dot: "bg-red-400",
    badge: "border-red-400/25 bg-red-400/10 text-red-100",
    icon: XCircle,
  },
};

const toneClass: Record<MissionAnswer["tone"], string> = {
  copper: "border-orange-300/25 bg-orange-400/10 text-orange-100",
  amber: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  green: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  red: "border-red-300/25 bg-red-300/10 text-red-100",
  stone: "border-stone-300/20 bg-stone-300/10 text-stone-100",
};

const riskClass: Record<RiskTier, string> = {
  safe: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  write: "border-orange-300/25 bg-orange-300/10 text-orange-100",
  money: "border-yellow-300/25 bg-yellow-300/10 text-yellow-100",
  public: "border-red-300/25 bg-red-300/10 text-red-100",
};

function mergeData(input?: Partial<CommandCenterData>): CommandCenterData {
  return {
    ...baseData,
    ...input,
    mission: input?.mission ?? baseData.mission,
    agents: input?.agents ?? baseData.agents,
    plan: input?.plan ?? baseData.plan,
    commands: input?.commands ?? baseData.commands,
    brain: {
      ...baseData.brain,
      ...input?.brain,
      sourceNotes: input?.brain?.sourceNotes ?? baseData.brain.sourceNotes,
      handoffs: input?.brain?.handoffs ?? baseData.brain.handoffs,
      logs: input?.brain?.logs ?? baseData.brain.logs,
      decisions: input?.brain?.decisions ?? baseData.brain.decisions,
      inboxCaptures: input?.brain?.inboxCaptures ?? baseData.brain.inboxCaptures,
    },
    money: { ...baseData.money, ...input?.money },
    validation: input?.validation ?? baseData.validation,
    generation: input?.generation ?? baseData.generation,
    systemSignals: input?.systemSignals ?? baseData.systemSignals,
  };
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatRM(value: number) {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function progress(current: number, target: number) {
  if (!target) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border border-orange-300/15 bg-[#14100d]/88 shadow-[0_18px_60px_rgba(0,0,0,.38)] backdrop-blur", className)}>
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase text-orange-200/65">{children}</p>;
}

export default function G4L1L30OSCommandCenter({ data, title, onPrimaryAction }: Props) {
  const d = mergeData(data);
  const reduced = Boolean(useReducedMotion());
  const missionAnswers = d.mission.map((answer) => {
    if (answer.label === "Mission now") return { ...answer, value: d.currentMission };
    if (answer.label === "Next critical move") return { ...answer, value: d.topPriority };
    return answer;
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0b0b0a] text-[#f7f2ea]">
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(217,98,43,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(217,98,43,.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.045),transparent_36%,rgba(217,98,43,.08))]" />

        <div className="relative mx-auto grid w-full max-w-[1500px] gap-4 px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,.88fr)] lg:py-5">
          <CommandHeader data={d} title={title} onPrimaryAction={onPrimaryAction} />

          <div className="grid min-w-0 gap-4">
            <MissionControl answers={missionAnswers} />
            <AgentOrbit agents={d.agents} reduced={reduced} />
            <ExecutionPlan tasks={d.plan} reduced={reduced} />
          </div>

          <div className="grid min-w-0 gap-4">
            <CommandQueue commands={d.commands} />
            <CompanyBrain brain={d.brain} signals={d.systemSignals} />
            <MoneyValidation money={d.money} validation={d.validation} reduced={reduced} />
            <CaptureDock agents={d.agents} />
            <MarketingGenerationDock cards={d.generation} />
          </div>
        </div>
      </div>
    </main>
  );
}

function CommandHeader({ data, title, onPrimaryAction }: { data: CommandCenterData; title?: string; onPrimaryAction?: () => void }) {
  return (
    <Panel className="col-span-full p-4 sm:p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2 text-xs">
            <StatusPill icon={Command}>{data.mode}</StatusPill>
            <StatusPill icon={Radio}>{data.currentStage}</StatusPill>
            <StatusPill icon={ShieldCheck}>{data.approvalMode}</StatusPill>
            <StatusPill icon={Network}>{data.autonomyMode}</StatusPill>
            <StatusPill icon={Activity}>{data.systemStatus}</StatusPill>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.36fr)] lg:items-end">
            <div className="min-w-0">
              <h1 className="text-4xl font-black text-[#fff8ec] sm:text-5xl lg:text-6xl">{title ?? data.osName}</h1>
              <p className="mt-2 text-lg font-semibold text-orange-100">{data.mode}</p>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[#d9c9ba] sm:text-base">{data.currentMission}</p>
            </div>
            <div className="grid gap-2 rounded-lg border border-orange-300/15 bg-black/25 p-3 text-sm">
              <div className="flex items-start gap-2">
                <Target className="mt-0.5 size-4 shrink-0 text-orange-200" />
                <p className="leading-5 text-[#f7f2ea]">{data.topPriority}</p>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-2 text-xs text-[#b9a99a]">
                <span>Last sync</span>
                <span className="font-mono text-orange-100">{data.lastSync}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-orange-200/30 bg-[#d9622b] px-4 py-2 text-sm font-bold text-[#130d08] transition hover:bg-[#ef7a39] focus:outline-none focus:ring-2 focus:ring-orange-100"
          >
            <RefreshCcw className="size-4" />
            Sync brain
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-orange-300/20 bg-orange-300/10 px-4 py-2 text-sm font-bold text-orange-100 transition hover:bg-orange-300/15 focus:outline-none focus:ring-2 focus:ring-orange-100"
          >
            <PenLine className="size-4" />
            Capture
          </button>
        </div>
      </div>
    </Panel>
  );
}

function StatusPill({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-8 items-center gap-2 rounded-md border border-orange-300/15 bg-black/25 px-2.5 py-1 text-orange-100/85">
      <Icon className="size-3.5 text-orange-200" />
      <span>{children}</span>
    </span>
  );
}

function MissionControl({ answers }: { answers: MissionAnswer[] }) {
  return (
    <Panel className="p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <Eyebrow>Mission Control</Eyebrow>
          <h2 className="mt-1 text-2xl font-bold text-[#fff8ec]">Five-second read</h2>
        </div>
        <span className="rounded-md border border-orange-300/20 bg-orange-300/10 px-2.5 py-1 text-xs font-semibold text-orange-100">live brief</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {answers.map((answer) => {
          const Icon = answer.icon;
          return (
            <article key={answer.label} className={cn("min-w-0 rounded-lg border p-3", toneClass[answer.tone])}>
              <div className="flex items-center gap-2">
                <Icon className="size-4 shrink-0" />
                <h3 className="text-sm font-bold">{answer.label}</h3>
              </div>
              <p className="mt-2 text-sm leading-5 text-[#e8dbce]">{answer.value}</p>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}

function AgentOrbit({ agents, reduced }: { agents: AgentNode[]; reduced: boolean }) {
  const [selectedId, setSelectedId] = React.useState(agents[2]?.id ?? agents[0]?.id);
  const [rotation, setRotation] = React.useState(0);
  const selected = agents.find((agent) => agent.id === selectedId) ?? agents[0];

  React.useEffect(() => {
    if (reduced) return;
    const interval = window.setInterval(() => setRotation((value) => (value + 0.18) % 360), 80);
    return () => window.clearInterval(interval);
  }, [reduced]);

  return (
    <Panel className="overflow-hidden p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Eyebrow>Agent Orbital Map</Eyebrow>
          <h2 className="mt-1 text-2xl font-bold text-[#fff8ec]">Command hierarchy</h2>
        </div>
        <span className="rounded-md border border-orange-300/20 bg-black/25 px-2.5 py-1 text-xs text-orange-100">{agents.length} operators</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-orange-300/10 bg-[#0d0907]">
          <div className="pointer-events-none absolute inset-4 rounded-lg border border-orange-300/10" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-200/15" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-200/10" />
          <div className="absolute left-1/2 top-1/2 z-10 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border border-orange-200/25 bg-[#18100b] text-center">
            <div>
              <Bot className="mx-auto size-6 text-orange-200" />
              <p className="mt-2 text-sm font-black text-orange-50">g4l1l30 OS</p>
            </div>
          </div>

          {agents.map((agent, index) => {
            const angle = ((index / agents.length) * 360 + rotation) % 360;
            const radius = 150;
            const radian = (angle * Math.PI) / 180;
            const x = radius * Math.cos(radian);
            const y = radius * Math.sin(radian);
            const isSelected = selected.id === agent.id;
            const isConnected = selected.connectedTo.includes(agent.id);

            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setSelectedId(agent.id)}
                className="absolute left-1/2 top-1/2 z-20 flex w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center transition focus:outline-none focus:ring-2 focus:ring-orange-100"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
                title={`Select ${agent.name}`}
              >
                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-lg border text-sm font-black",
                    isSelected
                      ? "border-orange-100 bg-orange-100 text-[#130d08]"
                      : isConnected
                        ? "border-orange-200/60 bg-orange-300/20 text-orange-50"
                        : "border-orange-300/20 bg-[#17100b] text-orange-100",
                  )}
                >
                  {agent.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="max-w-28 break-words text-xs font-bold text-orange-50/85">{agent.name}</span>
              </button>
            );
          })}
        </div>

        <AgentDetail agent={selected} />
      </div>
    </Panel>
  );
}

function AgentDetail({ agent }: { agent: AgentNode }) {
  return (
    <div className="rounded-lg border border-orange-300/15 bg-black/25 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-orange-200">{agent.role}</p>
          <h3 className="mt-1 text-2xl font-black text-[#fff8ec]">{agent.name}</h3>
        </div>
        <StatusBadge status={agent.status} />
      </div>
      <p className="mt-4 text-sm leading-6 text-[#d9c9ba]">{agent.currentTask}</p>
      <div className="mt-4 grid gap-3 text-sm">
        <DataLine label="Tool lane" value={agent.toolLane} />
        <DataLine label="Next output" value={agent.nextOutput} />
        <DataLine label="Last update" value={agent.lastUpdate} />
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-[#b9a99a]">
          <span>Energy</span>
          <span className="font-mono text-orange-100">{agent.progress}%</span>
        </div>
        <Meter value={agent.progress} />
      </div>
    </div>
  );
}

function ExecutionPlan({ tasks, reduced }: { tasks: PlanTask[]; reduced: boolean }) {
  const [open, setOpen] = React.useState<string[]>([tasks[0]?.id ?? ""]);

  function toggle(id: string) {
    setOpen((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <Panel className="p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Eyebrow>Execution Plan Tree</Eyebrow>
          <h2 className="mt-1 text-2xl font-bold text-[#fff8ec]">P0 to P2 command queue</h2>
        </div>
        <span className="rounded-md border border-orange-300/20 bg-black/25 px-2.5 py-1 text-xs text-orange-100">{tasks.length} active branches</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const isOpen = open.includes(task.id);
          return (
            <article key={task.id} className="rounded-lg border border-orange-300/12 bg-[#0f0a07] p-3">
              <button type="button" onClick={() => toggle(task.id)} className="flex w-full items-start gap-3 text-left focus:outline-none focus:ring-2 focus:ring-orange-100">
                <StatusIcon status={task.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-orange-300/20 bg-orange-300/10 px-2 py-0.5 font-mono text-xs text-orange-100">{task.priority}</span>
                    <h3 className="break-words text-base font-bold text-[#fff8ec]">{task.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-[#b9a99a]">Owner: {task.owner}</p>
                  <div className="mt-3 max-w-md">
                    <Meter value={task.progress} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {task.dependencies.map((dependency) => (
                      <span key={dependency} className="rounded-md border border-white/10 bg-white/[.035] px-2 py-1 text-xs text-[#d9c9ba]">
                        depends: {dependency}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronDown className={cn("mt-1 size-5 shrink-0 text-orange-200 transition", isOpen && "rotate-180")} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduced ? undefined : { height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 grid gap-2 border-l border-orange-300/20 pl-4">
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="rounded-lg border border-white/8 bg-white/[.03] p-3">
                          <div className="flex items-start gap-2">
                            <StatusIcon status={subtask.status} small />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#fff8ec]">{subtask.title}</p>
                              <p className="mt-1 text-sm leading-5 text-[#b9a99a]">{subtask.detail}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}

function CommandQueue({ commands }: { commands: CommandItem[] }) {
  return (
    <Panel className="p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <Eyebrow>Command Queue</Eyebrow>
          <h2 className="mt-1 text-xl font-bold text-[#fff8ec]">Founder attention</h2>
        </div>
        <ClipboardList className="size-5 text-orange-200" />
      </div>
      <div className="grid gap-2">
        {commands.map((item) => (
          <article key={item.title} className="rounded-lg border border-orange-300/12 bg-black/25 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-orange-300/20 bg-orange-300/10 px-2 py-0.5 font-mono text-xs text-orange-100">{item.priority}</span>
              <span className={cn("rounded-md border px-2 py-0.5 text-xs font-semibold", riskClass[item.risk])}>{item.risk}</span>
              <StatusBadge status={item.status} />
            </div>
            <h3 className="mt-3 text-sm font-bold text-[#fff8ec]">{item.title}</h3>
            <div className="mt-2 grid gap-1 text-xs text-[#b9a99a] sm:grid-cols-2">
              <span>Owner: {item.owner}</span>
              <span>Approval: {item.approval}</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function CompanyBrain({ brain, signals }: { brain: CommandCenterData["brain"]; signals: SystemSignal[] }) {
  return (
    <Panel className="p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <Eyebrow>Company Brain</Eyebrow>
          <h2 className="mt-1 text-xl font-bold text-[#fff8ec]">Obsidian source of truth</h2>
        </div>
        <Brain className="size-5 text-orange-200" />
      </div>

      <div className="rounded-lg border border-orange-300/12 bg-black/25 p-3 text-sm leading-5 text-[#d9c9ba]">{brain.vaultSync}</div>

      <div className="mt-3 grid gap-3 2xl:grid-cols-2">
        <BrainList title="Source notes" items={brain.sourceNotes} icon={FileText} />
        <div className="rounded-lg border border-orange-300/12 bg-[#0f0a07] p-3">
          <div className="mb-3 flex items-center gap-2">
            <Route className="size-4 text-orange-200" />
            <h3 className="text-sm font-bold text-[#fff8ec]">Recent handoffs</h3>
          </div>
          <div className="space-y-2">
            {brain.handoffs.map((handoff) => (
              <div key={`${handoff.from}-${handoff.to}-${handoff.time}`} className="rounded-md border border-white/8 bg-white/[.03] p-2">
                <div className="flex items-center justify-between gap-2 text-xs text-orange-100">
                  <span>{handoff.from} to {handoff.to}</span>
                  <span>{handoff.time}</span>
                </div>
                {handoff.path ? <p className="mt-1 break-words font-mono text-[11px] text-[#b9a99a]">{handoff.path}</p> : null}
                <p className="mt-1 text-xs leading-5 text-[#b9a99a]">{handoff.summary}</p>
              </div>
            ))}
          </div>
        </div>
        <BrainList title="Agent logs" items={brain.logs} icon={Activity} />
        <BrainList title="Decision logs" items={brain.decisions} icon={ShieldCheck} />
        <BrainList title="Inbox captures" items={brain.inboxCaptures} icon={Inbox} />
      </div>

      <div className="mt-3 rounded-lg border border-orange-300/12 bg-black/25 p-3">
        <div className="mb-3 flex items-center gap-2">
          <Activity className="size-4 text-orange-200" />
          <h3 className="text-sm font-bold text-[#fff8ec]">System health</h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {signals.map((signal) => (
            <div key={signal.label} className="flex items-center justify-between gap-3 rounded-md border border-white/8 bg-white/[.03] px-2.5 py-2">
              <span className="text-xs text-[#b9a99a]">{signal.label}</span>
              <span className="flex items-center gap-2 text-xs font-semibold text-[#fff8ec]">
                <span className={cn("size-2 rounded-full", statusMeta[signal.status].dot)} />
                {signal.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function BrainList({ title, items, icon: Icon }: { title: string; items: BrainItem[]; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-lg border border-orange-300/12 bg-[#0f0a07] p-3">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-4 text-orange-200" />
        <h3 className="text-sm font-bold text-[#fff8ec]">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.length ? items.map((item) => (
          <div key={`${title}-${item.label}`} className="rounded-md border border-white/8 bg-white/[.03] p-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#fff8ec]">{item.label}</p>
                <p className="mt-1 break-words font-mono text-[11px] text-[#b9a99a]">{item.path}</p>
                {item.detail ? <p className="mt-1 text-xs leading-5 text-[#b9a99a]">{item.detail}</p> : null}
                {item.updated ? <p className="mt-1 font-mono text-[11px] text-orange-100/70">{item.updated}</p> : null}
              </div>
              <span className="shrink-0 rounded-md border border-orange-300/15 px-1.5 py-0.5 text-[11px] text-orange-100">{item.status}</span>
            </div>
          </div>
        )) : (
          <div className="rounded-md border border-white/8 bg-white/[.03] p-2 text-xs text-[#b9a99a]">missing / not configured</div>
        )}
      </div>
    </div>
  );
}

function MoneyValidation({ money, validation, reduced }: { money: MoneyState; validation: ValidationGate[]; reduced: boolean }) {
  const moneyCards = [
    { label: "Real client payments", value: formatRM(money.realClientPaymentsRm), note: "Verified cash only", icon: Wallet },
    { label: "Seed/test payments", value: formatRM(money.seedTestPaymentsRm), note: "Excluded from revenue", icon: Circle },
    { label: "Ad spend", value: formatRM(money.adSpendRm), note: "Actual spend only", icon: DollarSign },
    { label: "MRR", value: `${formatRM(money.mrrRm)} / ${formatRM(money.goalMrrRm)}`, note: "Goal tracker", icon: Target },
  ];

  return (
    <Panel className="p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <Eyebrow>Money And Validation</Eyebrow>
          <h2 className="mt-1 text-xl font-bold text-[#fff8ec]">No fake revenue</h2>
        </div>
        <span className="rounded-md border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-100">static internal data</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {moneyCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-lg border border-orange-300/12 bg-black/25 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#b9a99a]">{card.label}</p>
                  <p className="mt-2 text-2xl font-black text-[#fff8ec]">{card.value}</p>
                  <p className="mt-1 text-xs text-[#b9a99a]">{card.note}</p>
                </div>
                <Icon className="size-5 text-orange-200" />
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-3 grid gap-2">
        {validation.map((gate, index) => {
          const pct = progress(gate.current, gate.target);
          return (
            <article key={gate.label} className="rounded-lg border border-orange-300/12 bg-[#0f0a07] p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#fff8ec]">{gate.label}</p>
                  <p className="mt-1 text-xs text-[#b9a99a]">{gate.evidence}</p>
                </div>
                <span className="font-mono text-sm text-orange-100">
                  {gate.current}/{gate.target}
                </span>
              </div>
              <div className="mt-3">
                <Meter value={pct} delay={reduced ? 0 : 0.08 * index} />
              </div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}

function CaptureDock({ agents }: { agents: AgentNode[] }) {
  const [route, setRoute] = React.useState<CaptureRoute>("inbox");
  const [draft, setDraft] = React.useState("");
  const [queued, setQueued] = React.useState<string | null>(null);

  const routeMeta: Array<{ id: CaptureRoute; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "inbox", label: "Inbox", icon: Inbox },
    { id: "decision-log", label: "Decision log", icon: ShieldCheck },
    { id: "agent-task", label: "Agent task", icon: Bot },
  ];

  function stageCapture() {
    const text = draft.trim();
    if (!text) return;
    setQueued(`${routeMeta.find((item) => item.id === route)?.label}: ${text}`);
    setDraft("");
  }

  return (
    <Panel className="p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <Eyebrow>Voice Command And Inbox</Eyebrow>
          <h2 className="mt-1 text-xl font-bold text-[#fff8ec]">Founder capture dock</h2>
        </div>
        <Mic className="size-5 text-orange-200" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {routeMeta.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setRoute(item.id)}
              className={cn(
                "flex min-h-10 items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-orange-100",
                route === item.id ? "border-orange-100 bg-orange-100 text-[#130d08]" : "border-orange-300/15 bg-black/25 text-orange-100",
              )}
            >
              <Icon className="size-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid gap-2">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          className="min-h-24 resize-none rounded-lg border border-orange-300/15 bg-black/30 p-3 text-sm leading-6 text-[#fff8ec] outline-none placeholder:text-[#8f8174] focus:ring-2 focus:ring-orange-100"
          placeholder="Speak or type: what should the agents do next?"
        />
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <select className="min-h-10 rounded-md border border-orange-300/15 bg-[#100b08] px-3 text-sm text-[#fff8ec] outline-none focus:ring-2 focus:ring-orange-100" defaultValue="codex">
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={stageCapture}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-orange-200/30 bg-orange-300/15 px-4 py-2 text-sm font-bold text-orange-100 transition hover:bg-orange-300/20 focus:outline-none focus:ring-2 focus:ring-orange-100"
          >
            <Command className="size-4" />
            Stage command
          </button>
        </div>
        {queued ? <p className="rounded-md border border-emerald-300/20 bg-emerald-300/10 p-2 text-xs leading-5 text-emerald-100">{queued}</p> : null}
      </div>
    </Panel>
  );
}

function MarketingGenerationDock({ cards }: { cards: GenerationCard[] }) {
  return (
    <Panel className="p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <Eyebrow>Marketing Generation Dock</Eyebrow>
          <h2 className="mt-1 text-xl font-bold text-[#fff8ec]">Internal operator tools</h2>
        </div>
        <Sparkles className="size-5 text-orange-200" />
      </div>

      <div className="grid gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.id} className="rounded-lg border border-orange-300/12 bg-black/25 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md border border-orange-300/20 bg-orange-300/10 text-orange-100">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-black text-[#fff8ec]">{card.label}</h3>
                    <p className="text-xs text-[#b9a99a]">{card.model}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-md border border-yellow-300/25 bg-yellow-300/10 px-2 py-1 text-xs font-semibold text-yellow-100">{card.status}</span>
              </div>
              <div className="mt-3 rounded-md border border-white/8 bg-white/[.03] p-2">
                <p className="text-xs font-semibold uppercase text-orange-200/70">Prompt</p>
                <p className="mt-1 text-sm leading-5 text-[#d9c9ba]">{card.prompt}</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-[#b9a99a]">Next: {card.nextAction}</p>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}

function StatusBadge({ status }: { status: AgentStatus }) {
  const meta = statusMeta[status];
  return <span className={cn("rounded-md border px-2 py-0.5 text-xs font-semibold", meta.badge)}>{meta.label}</span>;
}

function StatusIcon({ status, small = false }: { status: AgentStatus; small?: boolean }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-md border border-white/10 bg-white/[.04] text-[#130d08]", small ? "size-6" : "size-8")}>
      <span className={cn("grid place-items-center rounded-sm", meta.dot, small ? "size-4" : "size-5")}>
        <Icon className={cn("text-[#130d08]", small ? "size-3" : "size-3.5")} />
      </span>
    </span>
  );
}

function DataLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-md border border-white/8 bg-white/[.03] p-2">
      <span className="text-xs font-semibold uppercase text-[#b9a99a]">{label}</span>
      <span className="text-sm leading-5 text-[#fff8ec]">{value}</span>
    </div>
  );
}

function Meter({ value, delay = 0 }: { value: number; delay?: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-sm bg-[#2a1a10]">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ duration: 0.55, delay }}
        className="h-full rounded-sm bg-gradient-to-r from-[#b0552f] via-[#d9622b] to-[#d9a05b]"
      />
    </div>
  );
}
