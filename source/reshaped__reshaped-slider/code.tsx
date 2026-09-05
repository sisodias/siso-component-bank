// Reshaped Slider — https://www.reshaped.so/docs/components/slider
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Slider } from "reshaped/bundle";
import type { SliderProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { SliderProps };
export { Slider };
export default Slider;
