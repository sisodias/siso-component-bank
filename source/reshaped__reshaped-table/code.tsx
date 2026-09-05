// Reshaped Table — https://www.reshaped.so/docs/components/table
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Table } from "reshaped/bundle";
import type { TableProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { TableProps };
export { Table };
export default Table;
