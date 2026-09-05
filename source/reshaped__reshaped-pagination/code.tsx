// Reshaped Pagination — https://www.reshaped.so/docs/components/pagination
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Pagination } from "reshaped/bundle";
import type { PaginationProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { PaginationProps };
export { Pagination };
export default Pagination;
