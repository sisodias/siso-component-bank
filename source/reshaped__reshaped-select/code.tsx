// Reshaped Select — https://www.reshaped.so/docs/components/select
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Select, SelectTrigger } from "reshaped/bundle";
import type { SelectProps, SelectTriggerProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { SelectProps, SelectTriggerProps };
export { Select, SelectTrigger };
export default Select;
