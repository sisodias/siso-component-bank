// Reshaped Breadcrumbs — https://www.reshaped.so/docs/components/breadcrumbs
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Breadcrumbs } from "reshaped/bundle";
import type { BreadcrumbsProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { BreadcrumbsProps };
export { Breadcrumbs };
export default Breadcrumbs;
