// Reshaped Switch — https://www.reshaped.so/docs/components/switch
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Switch } from "reshaped/bundle";
import type { SwitchProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { SwitchProps };
export { Switch };
export default Switch;
