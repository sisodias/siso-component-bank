import { cn } from "../_utils/cn";
import { Theme } from "./theme"

export const Component = () => { 

  return (
    <div className="flex items-center gap-3">
      <Theme
        variant="tabs"
        size="sm"
        themes={["light", "dark", "system"]}
      />
      <Theme
        variant="tabs"
        size="md"
        showLabel
        themes={["light", "dark", "system"]}
      />
    </div>
  );
};
