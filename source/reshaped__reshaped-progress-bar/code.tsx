// Reshaped Progress bar — https://www.reshaped.so/docs/components/progress-bar
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { ProgressBar } from "reshaped/bundle";
import type { ProgressBarProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { ProgressBarProps };
export { ProgressBar };
export default ProgressBar;
