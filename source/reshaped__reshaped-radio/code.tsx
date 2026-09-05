// Reshaped Radio — https://www.reshaped.so/docs/components/radio
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Radio, RadioGroup } from "reshaped/bundle";
import type { RadioProps, RadioGroupProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { RadioProps, RadioGroupProps };
export { Radio, RadioGroup };
export default Radio;
