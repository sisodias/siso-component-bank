// Reshaped Dropdown menu — https://www.reshaped.so/docs/components/dropdown-menu
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { DropdownMenu } from "reshaped/bundle";
import type { DropdownMenuProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { DropdownMenuProps };
export { DropdownMenu };
export default DropdownMenu;
