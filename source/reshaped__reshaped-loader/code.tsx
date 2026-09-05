// Reshaped Loader — https://www.reshaped.so/docs/components/loader
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Loader } from "reshaped/bundle";
import type { LoaderProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { LoaderProps };
export { Loader };
export default Loader;
