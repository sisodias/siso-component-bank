// Reshaped Carousel — https://www.reshaped.so/docs/components/carousel
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Carousel } from "reshaped/bundle";
import type { CarouselProps, CarouselInstance } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { CarouselProps, CarouselInstance };
export { Carousel };
export default Carousel;
