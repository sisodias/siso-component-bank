// Reshaped Popover — https://www.reshaped.so/docs/components/popover
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Popover } from "reshaped/bundle";
import type { PopoverProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { PopoverProps };
export { Popover };
export default Popover;
