import { cn } from "../_utils/cn";
import { Theme } from "./theme"

export const Component = () => {
  return (
    <div className="flex items-center gap-3">
      <Theme
        size="sm"
        variant="dropdown"
        themes={["light", "dark", "system"]}
      />
      <Theme
        size="md"
        variant="dropdown"
        themes={["light", "dark", "system"]}
      /> 
      <Theme
        size="sm"
        variant="dropdown"
        showLabel
        themes={["light", "dark", "system"]}
      /> 
      <Theme
        size="lg"
        variant="dropdown"
        showLabel
        themes={["light", "dark", "system"]}
      />
    </div>
  )
};
