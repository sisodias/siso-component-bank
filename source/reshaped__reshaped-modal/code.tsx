// Reshaped Modal — https://www.reshaped.so/docs/components/modal
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Modal } from "reshaped/bundle";
import type { ModalProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { ModalProps };
export { Modal };
export default Modal;
