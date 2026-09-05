'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type AnchorOrButton =
  | ({
      href: string;
      onClick?: never;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({
      href?: undefined;
      onClick?: React.MouseEventHandler<HTMLButtonElement>;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>);

type Tone = 'pink' | 'blue' | 'amber' | 'emerald' | 'zinc';

export type PricingFeature = {
  label: React.ReactNode;
  included?: boolean; // default true
};

export type PricingCardTwoProps = {
  icon?: React.ReactNode;
  name: string;
  subtitle?: string;

  price: number | string;
  currency?: string;
  periodLabel?: string;

  features: PricingFeature[];

  cta?: AnchorOrButton & { label?: string; 'aria-label'?: string };

  /** Visuals */
  tone?: Tone;
  className?: string;

  /** Slot overrides */
  iconClassName?: string;
  nameClassName?: string;
  subtitleClassName?: string;
  priceClassName?: string;
  periodClassName?: string;
  featureListClassName?: string;
  featureItemClassName?: string;
  ctaClassName?: string;
};

const toneMap: Record<
  Tone,
  {
    /** gradient frame */
    frame: string;
    /** accent text (icon + price) */
    accent: string;
    /** CTA */
    btn: string;
    btnHover: string;
    /** tick / cross badges */
    okBg: string;
    okRing: string;
    okFg: string;
    noBg: string;
    noRing: string;
    noFg: string;
  }
> = {
  pink: {
    frame: 'bg-gradient-to-b from-pink-400 to-fuchsia-600',
    accent: 'text-pink-600',
    btn: 'bg-pink-600 text-white',
    btnHover: 'hover:bg-pink-700',
    okBg: 'bg-pink-50 dark:bg-pink-950/40',
    okRing: 'ring-pink-200 dark:ring-pink-900/50',
    okFg: 'text-pink-600 dark:text-pink-400',
    noBg: 'bg-amber-50 dark:bg-amber-950/40',
    noRing: 'ring-amber-200 dark:ring-amber-900/40',
    noFg: 'text-amber-500',
  },
  blue: {
    frame: 'bg-gradient-to-b from-blue-400 to-indigo-600',
    accent: 'text-blue-600',
    btn: 'bg-blue-600 text-white',
    btnHover: 'hover:bg-blue-700',
    okBg: 'bg-blue-50 dark:bg-blue-950/40',
    okRing: 'ring-blue-200 dark:ring-blue-900/50',
    okFg: 'text-blue-600 dark:text-blue-400',
    noBg: 'bg-amber-50 dark:bg-amber-950/40',
    noRing: 'ring-amber-200 dark:ring-amber-900/40',
    noFg: 'text-amber-500',
  },
  amber: {
    frame: 'bg-gradient-to-b from-amber-400 to-orange-500',
    accent: 'text-amber-600',
    btn: 'bg-amber-500 text-white',
    btnHover: 'hover:bg-amber-600',
    okBg: 'bg-amber-50 dark:bg-amber-950/40',
    okRing: 'ring-amber-200 dark:ring-amber-900/50',
    okFg: 'text-amber-600 dark:text-amber-400',
    noBg: 'bg-rose-50 dark:bg-rose-950/40',
    noRing: 'ring-rose-200 dark:ring-rose-900/40',
    noFg: 'text-rose-500',
  },
  emerald: {
    frame: 'bg-gradient-to-b from-emerald-400 to-teal-600',
    accent: 'text-emerald-600',
    btn: 'bg-emerald-600 text-white',
    btnHover: 'hover:bg-emerald-700',
    okBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    okRing: 'ring-emerald-200 dark:ring-emerald-900/50',
    okFg: 'text-emerald-600 dark:text-emerald-400',
    noBg: 'bg-amber-50 dark:bg-amber-950/40',
    noRing: 'ring-amber-200 dark:ring-amber-900/40',
    noFg: 'text-amber-500',
  },
  zinc: {
    frame: 'bg-gradient-to-b from-zinc-300 to-zinc-500',
    accent: 'text-zinc-900 dark:text-zinc-50',
    btn: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900',
    btnHover: 'hover:bg-black/80 dark:hover:bg-white',
    okBg: 'bg-zinc-100 dark:bg-zinc-800/60',
    okRing: 'ring-zinc-200 dark:ring-zinc-700',
    okFg: 'text-zinc-700 dark:text-zinc-300',
    noBg: 'bg-amber-50 dark:bg-amber-950/40',
    noRing: 'ring-amber-200 dark:ring-amber-900/40',
    noFg: 'text-amber-500',
  },
};

function priceParts(price: number | string, currency?: string) {
  if (typeof price === 'number')
    return { main: `${currency ?? '$'}${price}`, raw: price };
  return { main: price, raw: price };
}

export default function PricingCardTwo({
  icon,
  name,
  subtitle = 'the starter choise',
  price,
  currency = '$',
  periodLabel = '/month',
  features,
  cta,
  tone = 'blue',
  className,
  iconClassName,
  nameClassName,
  subtitleClassName,
  priceClassName,
  periodClassName,
  featureListClassName,
  featureItemClassName,
  ctaClassName,
}: PricingCardTwoProps) {
  const t = toneMap[tone];
  const pp = priceParts(price, currency);

  return (
    <section aria-label={`${name} plan`} className={cn('relative', className)}>
      {/* colored frame */}
      <div className={cn('rounded-3xl p-[3px]', t.frame)}>
        {/* card surface */}
        <div className='rounded-[22px] bg-zinc-50 px-8 pb-8 pt-10 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800'>
          {/* icon */}
          {icon && (
            <div
              className={cn(
                'mb-3 grid place-items-center text-5xl',
                t.accent,
                iconClassName
              )}
              aria-hidden
            >
              {icon}
            </div>
          )}

          {/* title + subtitle */}
          <h3
            className={cn(
              'text-center text-xl font-semibold text-zinc-900 dark:text-zinc-50',
              nameClassName
            )}
          >
            {name}
          </h3>
          {subtitle && (
            <p
              className={cn(
                'mt-1 text-center text-sm text-zinc-500 dark:text-zinc-400',
                subtitleClassName
              )}
            >
              {subtitle}
            </p>
          )}

          {/* price */}
          <div className={cn('mt-6 text-center', t.accent, priceClassName)}>
            <span className='text-5xl font-bold leading-none'>{pp.main}</span>
            <span
              className={cn(
                'ml-1 text-zinc-500 dark:text-zinc-400',
                periodClassName
              )}
            >
              {periodLabel}
            </span>
          </div>

          {/* features */}
          <ul className={cn('mt-8 space-y-4', featureListClassName)}>
            {features.map((f, i) => {
              const ok = f.included !== false;
              return (
                <li
                  key={i}
                  className={cn(
                    'flex items-start gap-3 text-zinc-700 dark:text-zinc-300',
                    featureItemClassName
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 inline-grid h-6 w-6 place-items-center rounded-full ring-1',
                      ok ? `${t.okBg} ${t.okRing}` : `${t.noBg} ${t.noRing}`
                    )}
                    aria-hidden
                  >
                    {ok ? (
                      <svg
                        viewBox='0 0 20 20'
                        className={cn('h-3.5 w-3.5', t.okFg)}
                        fill='currentColor'
                      >
                        <path d='M16.7 6.3a1 1 0 0 0-1.4-1.4L8 12.2 4.7 8.9a1 1 0 1 0-1.4 1.4L7.3 14a1 1 0 0 0 1.4 0l8-8Z' />
                      </svg>
                    ) : (
                      <svg
                        viewBox='0 0 20 20'
                        className={cn('h-3.5 w-3.5', t.noFg)}
                        fill='currentColor'
                      >
                        <path d='M6.2 5 5 6.2 8.8 10 5 13.8 6.2 15 10 11.2 13.8 15 15 13.8 11.2 10 15 6.2 13.8 5 10 8.8z' />
                      </svg>
                    )}
                  </span>
                  <span className='text-sm'>{f.label}</span>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          {cta && (
            <>
              {cta.href ? (
                <a
                  href={cta.href}
                  aria-label={cta['aria-label'] ?? `Choose ${name}`}
                  className={cn(
                    'mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition',
                    t.btn,
                    t.btnHover,
                    ctaClassName
                  )}
                  {...(cta as any)}
                >
                  {cta.label ?? 'Choose Plan'}
                </a>
              ) : (
                <button
                  type='button'
                  onClick={(cta as any).onClick}
                  aria-label={cta['aria-label'] ?? `Choose ${name}`}
                  className={cn(
                    'mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition',
                    t.btn,
                    t.btnHover,
                    ctaClassName
                  )}
                >
                  {cta.label ?? 'Choose Plan'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
