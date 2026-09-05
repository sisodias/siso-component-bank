// Reshaped File upload — https://www.reshaped.so/docs/components/file-upload
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { FileUpload } from "reshaped/bundle";
import type { FileUploadProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { FileUploadProps };
export { FileUpload };
export default FileUpload;
