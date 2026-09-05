import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function MinimalButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      className={cn(
        className,
        "relative w-30 h-10 p-0 [--pattern:var(--color-accent)] shadow-[0px_10px_30px_10px_#00000024] dark:shadow-[0px_10px_30px_10px_#ffffff10] border-none",
      )}
    >
      <div className="h-full w-full absolute inset-0 bg-[repeating-linear-gradient(315deg,var(--pattern)_0,var(--pattern)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] opacity-5" />
      <span className="relative z-10">{children}</span>
    </Button>
  );
}

export default MinimalButton;
