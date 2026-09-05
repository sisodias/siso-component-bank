// Reshaped Progress indicator — https://www.reshaped.so/docs/components/progress-indicator
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { ProgressIndicator } from "reshaped/bundle";
import type { ProgressIndicatorProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { ProgressIndicatorProps };
export { ProgressIndicator };
export default ProgressIndicator;
