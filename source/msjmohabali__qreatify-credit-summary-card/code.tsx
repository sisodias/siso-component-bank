"use client";

import { CreditCardIcon, ZapIcon } from "lucide-react";

import { cn } from "./qreatify-credit-summary-card-utils/utils";

export type QreatifyCreditBalance = {
  label: string;
  remainingLabel: string;
  percentage: number;
};

export type QreatifyCreditSummaryCardProps = {
  planLabel?: string;
  balances?: QreatifyCreditBalance[];
  liveProjects?: number;
  totalChats?: number;
  onPlansClick?: () => void;
  onUpgradeClick?: () => void;
  className?: string;
};

export default function QreatifyCreditSummaryCard({
  planLabel = "Spark",
  balances = [
    { label: "AI", remainingLabel: "420 left", percentage: 84 },
    { label: "Integrations", remainingLabel: "96 left", percentage: 48 },
  ],
  liveProjects = 0,
  totalChats = 0,
  onPlansClick,
  onUpgradeClick,
  className,
}: QreatifyCreditSummaryCardProps) {
  return (
    <section
      className={cn(
        "w-full max-w-xs rounded-2xl border border-border/70 bg-background/95 p-4 text-xs shadow-xl",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-muted-foreground">Credits</span>
        <span className="max-w-32 truncate font-semibold text-foreground">
          {planLabel}
        </span>
      </div>

      <div className="space-y-2">
        {balances.map((balance) => (
          <div key={balance.label} className="rounded-lg border p-2.5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-foreground">
                {balance.label}
              </span>
              <span className="text-muted-foreground">
                {balance.remainingLabel}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-600"
                style={{
                  width: `${Math.max(0, Math.min(100, balance.percentage))}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onPlansClick}
          className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ZapIcon className="size-3.5" />
          Plans
        </button>
        <button
          type="button"
          onClick={onUpgradeClick}
          className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <CreditCardIcon className="size-3.5" />
          Upgrade
        </button>
      </div>

      <p className="mt-3 text-xs leading-4 text-muted-foreground">
        {liveProjects} live / {totalChats} chat{totalChats === 1 ? "" : "s"}
      </p>
    </section>
  );
}
