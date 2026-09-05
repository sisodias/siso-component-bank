'use client';

const sections = [
  ['Product', ['CLI', 'Developer', 'Enterprise', 'Pricing']],
  ['Resources', ['Blog', 'Changelog', 'Docs', 'Brand', 'Status']],
  ['Legal', ['Terms', 'Privacy']],
  ['Connect', ['X', 'LinkedIn']],
] as const;

export default function AlqemistFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 px-6 py-12 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div>
            <div className="mb-3 flex items-center gap-2 font-medium">
              <span className="grid size-7 place-items-center rounded-sm bg-neutral-950 text-sm text-white dark:bg-white dark:text-neutral-950">A</span>
              Alqemist
            </div>
            <p className="text-sm text-neutral-500">AI workforce infrastructure for companies that ship.</p>
          </div>
          {sections.map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-2 text-sm text-neutral-500">{title}</h3>
              <ul className="space-y-1">
                {links.map((label) => (
                  <li key={label}>
                    <a href="#" className="text-sm hover:underline">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 text-sm text-neutral-500">© {new Date().getFullYear()} Alqemist</div>
      </div>
    </footer>
  );
}
