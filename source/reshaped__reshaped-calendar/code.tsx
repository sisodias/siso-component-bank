// Reshaped Calendar — https://www.reshaped.so/docs/components/calendar
// Re-exports the real `reshaped` package (precompiled bundle build, so no
// custom PostCSS setup is needed). Wrap your app in <Reshaped theme="slate">.
import { Calendar } from "reshaped/bundle";
import type { CalendarProps } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";

export type { CalendarProps };
export { Calendar };
export default Calendar;
