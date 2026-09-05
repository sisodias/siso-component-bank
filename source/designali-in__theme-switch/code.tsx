import { cn } from "@/lib/utils";
import { Theme } from "@/components/ui/theme"

export const Component = () => {  
  return (
    <div className="flex items-center gap-3">
      <Theme variant="switch" size="sm" />
      <Theme variant="switch" size="md" />
      <Theme variant="switch" size="lg" />
    </div>
  )
};
