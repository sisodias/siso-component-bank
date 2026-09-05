import { cn } from "@/lib/utils";

export function GradientButton({ text, onClick }: { text: string; onClick: () => void; }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-[#60a7dc] hover:bg-gradient-to-r from-[#60a7dc] to-[#02243d] text-white px-6 py-2 rounded-lg transition-all duration-200"
      )}
    >
      {text}
    </button>
  );
}
