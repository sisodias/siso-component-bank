import { cn } from "../_utils/cn";
import { Theme } from "./theme"

export const Component = () => {  
  return (
    <div className="flex items-center gap-3">
      <Theme variant="switch" size="sm" />
      <Theme variant="switch" size="md" />
      <Theme variant="switch" size="lg" />
    </div>
  )
};
