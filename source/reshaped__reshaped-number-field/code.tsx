// Reshaped Number field — https://www.reshaped.so/docs/components/number-field
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { NumberField } from "reshaped/bundle";
import type { NumberFieldProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { NumberFieldProps };
export { NumberField };
export default NumberField;
