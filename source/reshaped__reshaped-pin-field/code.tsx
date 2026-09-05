// Reshaped Pin field — https://www.reshaped.so/docs/components/pin-field
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { PinField } from "reshaped/bundle";
import type { PinFieldProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { PinFieldProps };
export { PinField };
export default PinField;
