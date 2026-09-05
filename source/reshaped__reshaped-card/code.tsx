// Reshaped Card — https://www.reshaped.so/docs/components/card
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Card } from "reshaped/bundle";
import type { CardProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { CardProps };
export { Card };
export default Card;
