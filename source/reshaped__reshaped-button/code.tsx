// Reshaped Button — https://www.reshaped.so/docs/components/button
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Button } from "reshaped/bundle";
import type {
  ButtonProps,
  ButtonAlignerProps,
  ButtonGroupProps,
} from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { ButtonProps, ButtonAlignerProps, ButtonGroupProps };
export { Button };
export default Button;
