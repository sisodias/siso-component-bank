// Reshaped Menu item — https://www.reshaped.so/docs/components/menu-item
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { MenuItem } from "reshaped/bundle";
import type { MenuItemProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { MenuItemProps };
export { MenuItem };
export default MenuItem;
