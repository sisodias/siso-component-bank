// Reshaped Alert — https://www.reshaped.so/docs/components/alert
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Alert } from "reshaped/bundle";
import type { AlertProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { AlertProps };
export { Alert };
export default Alert;
