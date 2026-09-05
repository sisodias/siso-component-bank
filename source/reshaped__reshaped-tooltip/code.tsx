// Reshaped Tooltip — https://www.reshaped.so/docs/components/tooltip
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Tooltip } from "reshaped/bundle";
import type { TooltipProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { TooltipProps };
export { Tooltip };
export default Tooltip;
