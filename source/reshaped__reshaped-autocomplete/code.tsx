// Reshaped Autocomplete — https://www.reshaped.so/docs/components/autocomplete
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Autocomplete } from "reshaped/bundle";
import type { AutocompleteProps, AutocompleteInstance } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { AutocompleteProps, AutocompleteInstance };
export { Autocomplete };
export default Autocomplete;
