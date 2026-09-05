// Reshaped Text area — https://www.reshaped.so/docs/components/text-area
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { TextArea } from "reshaped/bundle";
import type { TextAreaProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { TextAreaProps };
export { TextArea };
export default TextArea;
