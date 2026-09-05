// Reshaped Text field — https://www.reshaped.so/docs/components/text-field
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { TextField } from "reshaped/bundle";
import type { TextFieldProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { TextFieldProps };
export { TextField };
export default TextField;
