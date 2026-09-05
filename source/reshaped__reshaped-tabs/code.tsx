// Reshaped Tabs — https://www.reshaped.so/docs/components/tabs
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Tabs } from "reshaped/bundle";
import type { TabsProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { TabsProps };
export { Tabs };
export default Tabs;
