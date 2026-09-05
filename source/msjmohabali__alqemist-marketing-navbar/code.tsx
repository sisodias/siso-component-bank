'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = ['Product', 'How it works', 'Security', 'Pricing'];

function Brand() {
  return (
    <a href="/" className="flex items-center gap-2 font-medium tracking-tight">
      <span className="grid size-7 place-items-center rounded-sm border border-neutral-300 bg-neutral-950 text-sm text-white dark:border-neutral-700 dark:bg-white dark:text-neutral-950">
        A
      </span>
      <span>Alqemist</span>
    </a>
  );
}

export default function AlqemistMarketingNavbar({ ctaHref = '/auth' }: { ctaHref?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-white/85 px-5 py-3 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/85">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between">
        <div className="flex items-center gap-8">
          <Brand />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((label) => (
              <a
                key={label}
                href={label === 'Pricing' ? '/pricing' : `#${label.toLowerCase().replaceAll(' ', '-')}`}
                className="rounded-sm px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/enterprise"
            className="hidden rounded-sm px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900 sm:inline-flex"
          >
            Request demo
          </a>
          <a
            href={ctaHref}
            className="rounded-sm bg-neutral-950 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-950"
          >
            Get started
          </a>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
            className="grid size-9 place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mx-auto mt-2 max-w-6xl rounded-sm border border-neutral-200 p-2 dark:border-neutral-800 md:hidden">
          {links.map((label) => (
            <a key={label} href="#" className="block rounded-sm px-3 py-3 text-lg text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900">
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
