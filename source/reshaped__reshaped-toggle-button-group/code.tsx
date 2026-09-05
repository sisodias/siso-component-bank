// Reshaped Toggle button group — https://www.reshaped.so/docs/components/toggle-button-group
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { ToggleButtonGroup, ToggleButton } from "reshaped/bundle";
import type { ToggleButtonGroupProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { ToggleButtonGroupProps };
export { ToggleButtonGroup, ToggleButton };
export default ToggleButtonGroup;
