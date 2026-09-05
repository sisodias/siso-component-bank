type OrderStatus =
  | "pending"
  | "pending_payment"
  | "awaiting_details"
  | "generating"
  | "generated"
  | "failed"
  | "delivered";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  pending_payment: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  awaiting_details: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  generating: "bg-sky-50 text-sky-800 ring-1 ring-sky-200",
  generated: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
  failed: "bg-red-50 text-red-800 ring-1 ring-red-200",
  delivered: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

interface Props {
  status: OrderStatus;
  /** When true, overrides the displayed label to "delivered" regardless of status. */
  delivered?: boolean;
}

/**
 * Order/process status pill. Soft tint + matching ring + readable foreground.
 * snake_case statuses are rendered with spaces. Designed for order tables and
 * detail headers — flat, no gradient, no glow. Tailwind v3.4 compatible.
 */
export default function StatusBadge({ status, delivered }: Props) {
  const label = delivered ? "delivered" : status;
  const tone = STYLES[label as OrderStatus] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${tone}`}
    >
      {label.replace(/_/g, " ")}
    </span>
  );
}

export { StatusBadge };
