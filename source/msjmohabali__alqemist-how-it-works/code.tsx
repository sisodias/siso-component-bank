'use client';

const steps = [
  ['01', 'Create a project', 'Start from a repo or let Alqemist provision one with the right sandbox and runtime.'],
  ['02', 'Connect tools', 'Attach models, GitHub, Slack, credentials, and app integrations through one control plane.'],
  ['03', 'Build skills', 'Turn repeated work into shared instructions every agent can reuse.'],
  ['04', 'Ship safely', 'Review diffs, previews, logs, and approvals before work lands.'],
  ['05', 'Run continuously', 'Schedule recurring agents or trigger them from app events.'],
  ['06', 'Own the stack', 'Self-host when needed and keep runtime contracts under your control.'],
];

export default function AlqemistHowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="mb-14 max-w-2xl">
        <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">How Alqemist works</h2>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">From first repo to autonomous operations, each layer is designed to stay visible and controllable.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {steps.map(([number, title, body]) => (
          <article key={number} className="rounded-sm border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <span className="rounded-sm bg-neutral-950 px-2 py-1 font-mono text-xs text-white dark:bg-white dark:text-neutral-950">{number}</span>
            <h3 className="mt-5 text-xl font-medium">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
