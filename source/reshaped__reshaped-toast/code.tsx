// Reshaped Toast — https://www.reshaped.so/docs/components/toast
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { useToast, ToastProvider } from "reshaped/bundle";
import type {
  ToastProps,
  ToastProviderProps,
  ToastShowProps,
} from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { ToastProps, ToastProviderProps, ToastShowProps };
export { useToast, ToastProvider };
export default useToast;
