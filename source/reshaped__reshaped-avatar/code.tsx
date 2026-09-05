// Reshaped Avatar — https://www.reshaped.so/docs/components/avatar
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Avatar } from "reshaped/bundle";
import type { AvatarProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { AvatarProps };
export { Avatar };
export default Avatar;
