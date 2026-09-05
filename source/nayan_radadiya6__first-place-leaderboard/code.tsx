'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Crown } from 'lucide-react';

type Tone = 'emerald' | 'blue' | 'zinc';
type Size = 'sm' | 'md' | 'lg';

export type LeaderboardCardProps = {
  name: string;
  amount?: number | string; // e.g. 8034 or "$8,034"
  amountPrefix?: string; // e.g. "$"
  avatarSrc?: string;
  avatarAlt?: string;
  rank?: number; // 1..n (shows small badge)
  score?: number; // 0..100 -> progress + right-aligned %
  label?: string; // left label under pill (default "Score")
  showCrown?: boolean; // show crown for #1
  tone?: Tone; // background + bar color
  size?: Size; // paddings/fonts
  className?: string;
  /** Optional custom avatar ring class (e.g., gradient ring) */
  avatarRingClassName?: string;
  /** Optional custom progress color class (overrides tone) */
  progressClassName?: string;
  /** Optional custom pill class */
  pillClassName?: string;
};

const toneMap: Record<
  Tone,
  {
    card: string;
    pill: string;
    progressTrack: string;
    progressFill: string;
    name: string;
  }
> = {
  emerald: {
    card: 'bg-emerald-50/70 dark:bg-emerald-900/20 ring-1 ring-emerald-100 dark:ring-emerald-800',
    pill: 'bg-emerald-600/90 text-emerald-50',
    progressTrack: 'bg-emerald-200/60 dark:bg-emerald-900/50',
    progressFill: 'bg-emerald-500',
    name: 'text-emerald-900 dark:text-emerald-100',
  },
  blue: {
    card: 'bg-blue-50/80 dark:bg-blue-900/20 ring-1 ring-blue-100 dark:ring-blue-800',
    pill: 'bg-blue-600/90 text-blue-50',
    progressTrack: 'bg-blue-200/60 dark:bg-blue-900/50',
    progressFill: 'bg-blue-600',
    name: 'text-blue-900 dark:text-blue-100',
  },
  zinc: {
    card: 'bg-zinc-100/70 dark:bg-zinc-900/30 ring-1 ring-zinc-200 dark:ring-zinc-800',
    pill: 'bg-zinc-800 text-zinc-50',
    progressTrack: 'bg-zinc-200/60 dark:bg-zinc-800',
    progressFill: 'bg-zinc-600',
    name: 'text-zinc-900 dark:text-zinc-100',
  },
};

const sizeMap: Record<
  Size,
  { pad: string; name: string; pill: string; caption: string; avatar: string }
> = {
  sm: {
    pad: 'p-4',
    name: 'text-base',
    pill: 'text-[11px] px-2.5 py-1',
    caption: 'text-xs',
    avatar: 'h-14 w-14',
  },
  md: {
    pad: 'p-6',
    name: 'text-lg',
    pill: 'text-xs px-3 py-1.5',
    caption: 'text-sm',
    avatar: 'h-16 w-16',
  },
  lg: {
    pad: 'p-8',
    name: 'text-xl',
    pill: 'text-sm px-3.5 py-1.5',
    caption: 'text-sm',
    avatar: 'h-20 w-20',
  },
};

function formatAmount(amount?: number | string, prefix?: string) {
  if (amount == null) return undefined;
  if (typeof amount === 'string') return amount;
  try {
    return `${prefix ?? ''}${amount.toLocaleString()}`;
  } catch {
    return `${prefix ?? ''}${amount}`;
  }
}

export function LeaderboardCard({
  name,
  amount,
  amountPrefix = '$',
  avatarSrc,
  avatarAlt = name,
  rank,
  score = 0,
  label = 'Score',
  showCrown = rank === 1,
  tone = 'emerald',
  size = 'md',
  className,
  avatarRingClassName,
  progressClassName,
  pillClassName,
}: LeaderboardCardProps) {
  const t = toneMap[tone];
  const s = sizeMap[size];
  const pct = Math.max(0, Math.min(100, score));
  const amountLabel = formatAmount(amount, amountPrefix);

  return (
    <div
      className={cn(
        'relative w-full rounded-xl shadow-sm',
        t.card,
        s.pad,
        className
      )}
    >
      {/* avatar */}
      <div className='flex w-full flex-col items-center gap-3'>
        <div className='relative -mt-12'>
          <div
            className={cn(
              'relative inline-flex items-center justify-center rounded-full ring-4 ring-white dark:ring-zinc-900',
              s.avatar,
              avatarRingClassName ?? 'outline outline-4 outline-yellow-300/80'
            )}
          >
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarSrc}
                alt={avatarAlt}
                className='h-full w-full rounded-full object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800'>
                <span className='text-zinc-500 dark:text-zinc-400'>
                  {name?.[0] ?? '?'}
                </span>
              </div>
            )}
            {showCrown && (
              <Crown className='absolute -top-4 left-1/2 h-5 w-5 -translate-x-1/2 text-yellow-400 drop-shadow' />
            )}
          </div>
          {typeof rank === 'number' && (
            <span className='absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-[11px] font-bold text-yellow-950 ring-2 ring-white dark:ring-zinc-900'>
              {rank}
            </span>
          )}
        </div>

        {/* name + amount pill */}
        <div className={cn('text-center font-semibold', t.name, s.name)}>
          {name}
        </div>
        {amountLabel && (
          <span
            className={cn(
              'rounded-full font-semibold',
              t.pill,
              s.pill,
              pillClassName
            )}
          >
            {amountLabel}
          </span>
        )}
      </div>

      {/* score bar */}
      <div className='mt-6'>
        <div className='mb-2 flex items-center justify-between text-zinc-600 dark:text-zinc-300'>
          <span className={s.caption}>{label}</span>
          <span className={s.caption}>{pct}%</span>
        </div>
        <div
          className={cn(
            'h-2 w-full overflow-hidden rounded-full',
            t.progressTrack
          )}
        >
          <div
            className={cn(
              'h-full rounded-full',
              progressClassName ?? t.progressFill
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
