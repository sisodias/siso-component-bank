import {
  AlertDiamondIcon,
  InformationCircleIcon,
  Tick01Icon,
  Alert02Icon,
} from "@hugeicons/core-free-icons/index";
import { HugeiconsIcon } from "@hugeicons/react";
import { X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  title: string;
  description: string;
  type?: ToastType;
}

interface ToastComponentProps {
  id: string | number;
  title: string;
  description: string;
  type: ToastType;
}

const styleMap: Record<
  ToastType,
  {
    gradient: string;
    iconBg: string;
    iconBgWrapper: string;
    Icon: any;
  }
> = {
  success: {
    gradient: "linear-gradient(to bottom, #4ade80, #22c55e)",
    iconBg: "bg-green-500",
    iconBgWrapper: "bg-green-500/50",
    Icon: Tick01Icon,
  },
  error: {
    gradient: "linear-gradient(to bottom, #f87171, #ef4444)",
    iconBg: "bg-red-500",
    iconBgWrapper: "bg-red-500/50",
    Icon: AlertDiamondIcon,
  },
  info: {
    gradient: "linear-gradient(to bottom, #60a5fa, #3b82f6)",
    iconBg: "bg-blue-500",
    iconBgWrapper: "bg-blue-500/50",
    Icon: InformationCircleIcon,
  },
  warning: {
    gradient: "linear-gradient(to bottom, #fbbf24, #f59e0b)",
    iconBg: "bg-amber-500",
    iconBgWrapper: "bg-amber-500/50",
    Icon: Alert02Icon,
  },
};

export const Component = ({ id, title, description, type }: ToastComponentProps) => {
  const { gradient, iconBg, Icon, iconBgWrapper } =
    styleMap[type] || styleMap.info;

  return (
    <div className="relative flex w-[364px] items-center gap-3 overflow-hidden p-3 shadow-lg rounded-xl bg-[#171717] outline outline-1 outline-[#303031] z-0">
      <div
        className="absolute top-0 -left-8 h-full w-1/3 scale-105 opacity-30 rounded-l-lg blur-3xl -z-[1]"
        style={{ background: gradient }}
      />
      <X
        className="absolute top-2 right-2 size-3.5 cursor-pointer text-white/80 transition-colors hover:text-white/60"
        onClick={() => sonnerToast.dismiss(id)}
      />
      <div className={`rounded-full ${iconBgWrapper} p-1`}>
        <div className={`p-1 ${iconBg} rounded-full text-white`}>
          <HugeiconsIcon icon={Icon} size={14} />
        </div>
      </div>
      <div className="flex flex-1 items-center">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-0.5 text-sm text-white/80 font-normal">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

function Toast({ id, title, description, type }: ToastComponentProps) {
  const { gradient, iconBg, Icon, iconBgWrapper } =
    styleMap[type] || styleMap.info;

  return (
    <div className="relative flex w-[364px] items-center gap-3 overflow-hidden p-3 shadow-lg rounded-xl bg-[#171717] outline outline-1 outline-[#303031] z-0">
      <div
        className="absolute top-0 -left-8 h-full w-1/3 scale-105 opacity-30 rounded-l-lg blur-3xl -z-[1]"
        style={{ background: gradient }}
      />
      <X
        className="absolute top-2 right-2 size-3.5 cursor-pointer text-white/80 transition-colors hover:text-white/60"
        onClick={() => sonnerToast.dismiss(id)}
      />
      <div className={`rounded-full ${iconBgWrapper} p-1`}>
        <div className={`p-1 ${iconBg} rounded-full text-white`}>
          <HugeiconsIcon icon={Icon} size={14} />
        </div>
      </div>
      <div className="flex flex-1 items-center">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-0.5 text-sm text-white/80 font-normal">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
