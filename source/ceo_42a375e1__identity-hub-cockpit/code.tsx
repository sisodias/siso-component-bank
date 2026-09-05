import * as React from "react";

type Tone = "green" | "blue" | "yellow" | "red" | "muted";

type Wave = {
  n: string;
  title: string;
  detail: string;
  label: string;
  tone: Tone;
};

type Lane = {
  title: string;
  icon: string;
  count: number;
  tone: Tone;
  items: Array<{ title: string; detail: string; tag?: string }>;
};

type Risk = {
  risk: string;
  surface: string;
  mitigation: string;
  severity: "alto" | "médio";
};

const waves: Wave[] = [
  { n: "✓", title: "Discovery", detail: "Nexus, LinkedIn, Instagram e Infra mapeados", label: "feito", tone: "green" },
  { n: "✓", title: "Foundation", detail: "DB schema, Python harness e Logto scaffold", label: "feito", tone: "green" },
  { n: "3", title: "Nexus SDK", detail: "Adapter Logto em AUTH_PROVIDER=hybrid", label: "agora", tone: "yellow" },
  { n: "4", title: "Nexus piloto", detail: "Login, tenant isolation e teste cross-tenant", label: "próximo", tone: "muted" },
  { n: "5", title: "Prospectors", detail: "LinkedIn + Instagram com IdentityContext", label: "próximo", tone: "muted" },
  { n: "6", title: "Billing / Partner", detail: "Planos, M2M e white-label", label: "bloqueado", tone: "red" },
];

const lanes: Lane[] = [
  {
    title: "Pronto",
    icon: "✓",
    count: 4,
    tone: "green",
    items: [
      { title: "Identity DB", detail: "Schema 1→N org/location + rollback + canary", tag: "SQL" },
      { title: "Python Auth Harness", detail: "Contrato compartilhado p/ LinkedIn e Instagram", tag: "10 passed" },
      { title: "Logto Infra", detail: "Compose, runbook Coolify, scopes M2M", tag: "validated" },
      { title: "Nexus Adapter", detail: "Harness 401/403/200 + build TypeScript", tag: "build OK" },
    ],
  },
  {
    title: "Agora",
    icon: "⚡",
    count: 2,
    tone: "yellow",
    items: [
      { title: "21st Registry", detail: "Primeiro componente real do venture stack", tag: "unlisted" },
      { title: "Impeccable pass", detail: "Rascunho → cockpit product-grade", tag: "taste" },
    ],
  },
  {
    title: "Próximo",
    icon: "•",
    count: 3,
    tone: "muted",
    items: [
      { title: "Nexus login preview", detail: "Tela real contra Logto staging/mock" },
      { title: "Tenant switch", detail: "Org → locations permitidas" },
      { title: "Audit trail", detail: "Eventos allow/deny visíveis" },
    ],
  },
  {
    title: "Bloqueios",
    icon: "⌘",
    count: 3,
    tone: "red",
    items: [
      { title: "Coolify real", detail: "Precisa autorização p/ criar stack", tag: "aprovação" },
      { title: "DNS", detail: "auth-staging.mottivme.com.br", tag: "infra" },
      { title: "SMTP", detail: "Provider transacional aprovado", tag: "infra" },
    ],
  },
];

const risks: Risk[] = [
  { risk: "location_id vindo do cliente", surface: "?loc= em LinkedIn / Radar", mitigation: "Validar contra allowed_location_ids da org — nunca confiar no request", severity: "alto" },
  { risk: "Endpoints públicos Nexus/GHL", surface: "rotas por locationId, scripts, webhooks", mitigation: "Bearer Logto obrigatório; service-role sempre filtrado por tenant", severity: "alto" },
  { risk: "Side effects no Radar", surface: "/ui/radar/campaign e CLIs --execute", mitigation: "Rotas de efeito separadas por permissão; dry-run como default", severity: "alto" },
  { risk: "Unipile / DM anti-ban", surface: "convite, DM, import, exports", mitigation: "Ação crítica exige permissão + location ativa resolvida pela org", severity: "médio" },
  { risk: "M2M workers e webhooks", surface: "automações fora do fluxo humano", mitigation: "Token M2M com scope; worker carrega tenant, não bypassa", severity: "médio" },
];

const toneStyles: Record<Tone, string> = {
  green: "border-emerald-400/35 bg-emerald-400/10 text-emerald-200",
  blue: "border-blue-500/40 bg-blue-500/10 text-blue-200",
  yellow: "border-amber-300/35 bg-amber-300/10 text-amber-200",
  red: "border-rose-400/35 bg-rose-400/10 text-rose-200",
  muted: "border-slate-700 bg-slate-900/45 text-slate-300",
};

function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${toneStyles[tone]}`}>{children}</span>;
}

function Dot({ tone }: { tone: Tone }) {
  const color = tone === "green" ? "bg-emerald-300" : tone === "yellow" ? "bg-amber-300" : tone === "red" ? "bg-rose-300" : "bg-blue-500";
  return <span className={`h-1.5 w-1.5 rounded-full ${color}`} />;
}

export function IdentityHubCockpit() {
  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:64px_64px]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-slate-800 bg-[#0a0f1a]/95 px-4 py-5 lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-2xl border border-blue-500/55 bg-blue-600/15 text-blue-300">◇</div>
          <div>
            <div className="text-sm font-black tracking-[-0.02em]">Identity Hub</div>
            <div className="font-mono text-[11px] text-slate-500">cockpit · MOTTIVME</div>
          </div>
        </div>
        <nav className="space-y-1 text-sm font-semibold text-slate-400">
          {[
            ["01", "Visão geral", "#overview"],
            ["02", "Ondas", "#waves"],
            ["03", "Execução", "#board"],
            ["04", "Autorização", "#auth"],
            ["05", "Riscos", "#risks"],
            ["06", "Estado real", "#state"],
          ].map(([n, label, href], index) => (
            <a key={label} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-slate-900 hover:text-white ${index === 0 ? "bg-slate-900 text-white" : ""}`}>
              <span className="font-mono text-xs text-slate-500">{n}</span>
              <span>{label}</span>
              {index === 0 ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500" /> : null}
            </a>
          ))}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 rounded-2xl border border-slate-800 bg-black/25 p-3 font-mono text-[11px]">
          <div className="flex justify-between py-1"><span className="text-slate-500">ambiente</span><span className="text-amber-200">staging</span></div>
          <div className="flex justify-between py-1"><span className="text-slate-500">AUTH_PROVIDER</span><span className="text-blue-200">hybrid</span></div>
          <div className="flex justify-between py-1"><span className="text-slate-500">produção</span><span className="text-emerald-200">intocada</span></div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-slate-800 bg-[#05070d]/88 backdrop-blur lg:ml-[248px]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="font-mono text-xs uppercase tracking-[.22em] text-slate-500">MOTTIVME <span className="text-slate-300">/ Identity Hub</span></div>
          <div className="hidden gap-2 md:flex">
            <Badge tone="green">wave 2 · foundation</Badge>
            <Badge tone="yellow">env staging</Badge>
            <Badge tone="blue">prod 0 tocada</Badge>
          </div>
        </div>
      </header>

      <main className="lg:ml-[248px]">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          <section id="overview" className="grid gap-8 md:grid-cols-[1.25fr_.75fr] md:items-start">
            <div>
              <Badge tone="blue">◇ Identity Hub · Wave 2 · Foundation pronta</Badge>
              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[.94] tracking-[-.075em] md:text-7xl">Um controle de acesso para todos os produtos.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">Logto identifica. O backend autoriza. A organização resolve locations, tenant e permissões antes de qualquer produto tocar dados — Nexus, LinkedIn e Instagram sob o mesmo contrato.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#auth" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500">Ver fluxo de autorização →</a>
                <a href="#state" className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-slate-600">Estado real</a>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-[#080d16]/95 p-5 shadow-2xl shadow-black/30">
              <div className="mb-5 flex items-center justify-between"><h2 className="font-black">Posture</h2><span className="font-mono text-xs text-slate-500">live · staging</span></div>
              <dl className="divide-y divide-slate-800 font-mono text-sm">
                {[
                  ["Ambiente", "staging / mock", "yellow"],
                  ["AUTH_PROVIDER", "hybrid", "blue"],
                  ["Foundation", "4 / 4 artefatos", "green"],
                  ["Org → locations", "1 → N", "blue"],
                  ["Cross-tenant test", "pendente (gate Nexus)", "yellow"],
                  ["Produção tocada", "0", "green"],
                ].map(([k, v, tone]) => (
                  <div key={k} className="flex items-center justify-between gap-4 py-3"><dt className="flex items-center gap-3 text-slate-400"><Dot tone={tone as Tone} />{k}</dt><dd className={tone === "green" ? "text-emerald-200" : tone === "yellow" ? "text-amber-200" : "text-blue-200"}>{v}</dd></div>
                ))}
              </dl>
            </div>
          </section>

          <section id="waves" className="mt-16 scroll-mt-20">
            <div className="mb-7 flex items-end justify-between border-b border-slate-800 pb-5">
              <div><h2 className="text-3xl font-black tracking-[-.05em]">Ondas do rollout</h2><p className="mt-3 max-w-2xl text-slate-400">Sem big bang. Cada onda só abre quando a anterior está provada. A ordem carrega a estratégia.</p></div>
              <div className="hidden font-mono text-sm text-slate-500 md:block">2 feitas · 1 agora · 3 na fila</div>
            </div>
            <ol className="grid gap-4 md:grid-cols-6">
              {waves.map((wave) => (
                <li key={wave.title} className="relative">
                  <div className={`mb-4 grid h-8 w-8 place-items-center rounded-full border font-mono text-sm ${toneStyles[wave.tone]}`}>{wave.n}</div>
                  <h3 className="font-black tracking-[-.02em]">{wave.title}</h3>
                  <p className="mt-2 min-h-[54px] text-sm leading-6 text-slate-400">{wave.detail}</p>
                  <div className={`mt-2 text-xs font-semibold ${wave.tone === "green" ? "text-emerald-200" : wave.tone === "yellow" ? "text-amber-200" : wave.tone === "red" ? "text-rose-200" : "text-slate-400"}`}>{wave.label}</div>
                </li>
              ))}
            </ol>
          </section>

          <section id="board" className="mt-16 scroll-mt-20">
            <div className="mb-7 flex items-end justify-between border-b border-slate-800 pb-5">
              <div><h2 className="text-3xl font-black tracking-[-.05em]">Quadro de execução</h2><p className="mt-3 max-w-2xl text-slate-400">Foundation → Nexus → prospectors. O que está pronto, o que roda agora, o que vem e o que trava.</p></div>
              <div className="hidden font-mono text-sm text-slate-500 md:block">foundation → nexus → prospectors</div>
            </div>
            <div className="grid gap-4 lg:grid-cols-4">
              {lanes.map((lane) => (
                <section key={lane.title} className="rounded-2xl border border-slate-800 bg-[#080d16]/88 p-4">
                  <header className="mb-4 flex items-center justify-between"><h3 className="flex items-center gap-3 font-black"><span className={lane.tone === "green" ? "text-emerald-200" : lane.tone === "yellow" ? "text-amber-200" : lane.tone === "red" ? "text-rose-200" : "text-slate-400"}>{lane.icon}</span>{lane.title}</h3><span className="grid h-6 w-6 place-items-center rounded-full border border-slate-700 font-mono text-xs text-slate-400">{lane.count}</span></header>
                  <div className="space-y-2">
                    {lane.items.map((item) => (
                      <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/65 p-3">
                        <div className="flex items-start justify-between gap-2"><h4 className="font-black leading-tight tracking-[-.015em]">{item.title}</h4>{item.tag ? <span className="rounded-md border border-slate-700 px-2 py-1 font-mono text-[11px] text-slate-300">{item.tag}</span> : null}</div>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section id="auth" className="mt-16 scroll-mt-20">
            <div className="mb-7 flex items-end justify-between border-b border-slate-800 pb-5"><div><h2 className="text-3xl font-black tracking-[-.05em]">Como a autorização funciona</h2><p className="mt-3 max-w-2xl text-slate-400">Token entra, identidade vira tenant. O location_id nunca é autoridade — é uma seleção validada pela org.</p></div><div className="hidden font-mono text-sm text-slate-500 md:block">Bearer → tenant</div></div>
            <div className="grid gap-3 md:grid-cols-5">
              {[
                ["Logto JWT", "OIDC · JWKS · M2M", "Authorization: Bearer <token>", "blue"],
                ["identity_org_map", "logto_org → org_id / tenant", "org_id · tenant_type · status", "muted"],
                ["allowed_location_ids", "1 org → N locations validadas", "identity_org_locations[]", "muted"],
                ["IdentityContext / req", "contrato TS + Python", "req.tenantId · req.user", "muted"],
                ["App feature gates", "Nexus · LinkedIn · Radar", "appAccess · permissions", "blue"],
              ].map(([title, detail, code, tone]) => (
                <article key={title} className={`rounded-2xl border p-4 ${toneStyles[tone as Tone]}`}><h3 className="font-black">{title}</h3><p className="mt-2 text-xs text-slate-400">{detail}</p><code className="mt-4 block rounded-lg bg-black/35 p-2 font-mono text-[11px] text-blue-100">{code}</code></article>
              ))}
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.25fr]">
              <article className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-5"><h3 className="text-xl font-black">Garantia anti cross-tenant</h3><p className="mt-4 leading-7 text-slate-400">O teste que destrava o piloto: provar que o token da org A nunca resolve para o tenant B.</p><div className="mt-5 space-y-2 font-mono text-sm"><div className="flex justify-between rounded-lg border border-emerald-400/25 bg-black/25 px-3 py-2"><span>✓ org A → map → tenant A</span><span className="text-emerald-200">permitido</span></div><div className="flex justify-between rounded-lg border border-rose-400/25 bg-black/25 px-3 py-2"><span>⌘ org A → tenant B</span><span className="text-rose-200">negado</span></div></div></article>
              <div className="grid gap-4 md:grid-cols-2"><pre className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-blue-100"><span className="text-slate-500">TypeScript · Nexus</span>{`\n\nreq.identity = {\n  userId, logtoUserId,\n  orgId, logtoOrgId,\n  roles, permissions,\n  allowedLocationIds,\n  appAccess,\n}\nreq.tenantId = mappedTenantId\nreq.user = legacyCompatibleUser`}</pre><pre className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-blue-100"><span className="text-slate-500">Python · Prospectors</span>{`\n\nIdentityContext(\n  user_id=...,\n  logto_user_id=...,\n  org_id=...,\n  logto_org_id=...,\n  roles=[...], permissions=[...],\n  allowed_location_ids=[...],\n  app_access={...},\n)`}</pre></div>
            </div>
          </section>

          <section id="risks" className="mt-16 scroll-mt-20">
            <div className="mb-7 flex items-end justify-between border-b border-slate-800 pb-5"><div><h2 className="text-3xl font-black tracking-[-.05em]">Riscos reais</h2><p className="mt-3 max-w-2xl text-slate-400">Logto resolve identidade, não ownership de dados. Estes são os pontos onde um tenant ainda pode vazar.</p></div><div className="hidden font-mono text-sm text-slate-500 md:block">5 mapeados</div></div>
            <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#080d16]/90"><table className="w-full text-left text-sm"><thead className="bg-slate-950/55 font-mono text-xs uppercase text-slate-500"><tr><th className="p-4">Risco</th><th className="p-4">Superfície</th><th className="p-4">Mitigação</th><th className="p-4">Sev.</th></tr></thead><tbody className="divide-y divide-slate-800">{risks.map((risk) => (<tr key={risk.risk}><td className="p-4 font-black">{risk.risk}</td><td className="p-4 font-mono text-xs leading-5 text-slate-400">{risk.surface}</td><td className="p-4 leading-6 text-slate-400">{risk.mitigation}</td><td className="p-4"><Badge tone={risk.severity === "alto" ? "red" : "yellow"}>{risk.severity}</Badge></td></tr>))}</tbody></table></div>
              <aside className="rounded-2xl border border-slate-800 bg-[#080d16]/90 p-5"><h3 className="text-xl font-black">Riscos de 2ª ordem</h3><ol className="mt-5 space-y-4 text-sm leading-6 text-slate-400">{["Manter location_id como autoridade = falsa segurança.", "Big bang em todos os produtos quebra login e operação comercial.", "Sem 1 org → N locations, trava partner/white-label depois.", "Esquecer workers/webhooks deixa automações bypassando tenant.", "Migrar UI sem teste de backend esconde vazamento cross-tenant."].map((item, i) => (<li key={item} className="flex gap-3"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border border-slate-700 font-mono text-[11px] text-slate-400">{i + 1}</span><span>{item}</span></li>))}</ol></aside>
            </div>
          </section>

          <section id="state" className="mt-16 scroll-mt-20">
            <div className="mb-7 flex items-end justify-between border-b border-slate-800 pb-5"><div><h2 className="text-3xl font-black tracking-[-.05em]">Estado real, hoje</h2><p className="mt-3 max-w-2xl text-slate-400">Tudo abaixo roda e foi validado. Nenhum bit em produção, Coolify, DNS ou secrets foi tocado.</p></div><div className="hidden font-mono text-sm text-slate-500 md:block">2026-06-30 · 0 prod</div></div>
            <div className="grid gap-5 lg:grid-cols-2">
              <article className="rounded-2xl border border-slate-800 bg-[#080d16]/90 p-5"><div className="mb-5 flex items-center justify-between"><h3 className="font-black">Foundation validada</h3><span className="font-mono text-sm text-emerald-200">4 / 4 OK</span></div>{[["Python Auth Harness", "Contrato LinkedIn + Instagram", "10 passed"], ["Nexus TS Adapter", "Spike middleware Logto", "401 / 403 / 200 · build OK"], ["Logto Infra", "Compose + runbook Coolify", "config validada"], ["Identity DB", "schema 1→N + rollback", "canary criado"]].map(([title, detail, tag]) => (<div key={title} className="flex items-center justify-between gap-4 border-t border-slate-800 py-4"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg border border-emerald-400/35 bg-emerald-400/10 text-emerald-200">✓</span><div><div className="font-black">{title}</div><div className="text-sm text-slate-500">{detail}</div></div></div><span className="rounded-md border border-slate-700 px-2 py-1 font-mono text-[11px] text-emerald-200">{tag}</span></div>))}</article>
              <article className="rounded-2xl border border-blue-500/35 bg-blue-500/5 p-5"><h3 className="text-xl font-black">Próxima ação concreta</h3><p className="mt-4 leading-7 text-slate-400">Nexus piloto em staging/local com AUTH_PROVIDER=hybrid, usando Logto mock/staging — provando que token da org A nunca vira tenant B antes de qualquer produção.</p><div className="mt-5 space-y-3 text-sm text-slate-400">{["Logto staging ou mock local definido", "Identity tables/mapping acordados", "SDK TypeScript validado", "Teste prova org A ≠ tenant B", "Rollback AUTH_PROVIDER=legacy documentado"].map((item) => (<label key={item} className="flex items-center gap-3"><span className="h-4 w-4 rounded border border-slate-700" />{item}</label>))}</div></article>
            </div>
          </section>

          <footer className="mt-20 border-t border-slate-800 py-8 font-mono text-xs text-slate-500">Preview local · não toca produção, Coolify, DNS ou secrets · estado real em 2026-06-30 BRT. <span className="float-right hidden md:inline">21st: identity-hub-cockpit</span></footer>
        </div>
      </main>
    </div>
  );
}

export default IdentityHubCockpit;
