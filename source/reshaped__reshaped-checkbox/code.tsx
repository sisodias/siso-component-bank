// Reshaped Checkbox — https://www.reshaped.so/docs/components/checkbox
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Checkbox, CheckboxGroup } from "reshaped/bundle";
import type { CheckboxProps, CheckboxGroupProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { CheckboxProps, CheckboxGroupProps };
export { Checkbox, CheckboxGroup };
export default Checkbox;
