import { cn } from "../_utils/cn";

export const Component = ({ 
  className,
  gradientFrom = "#fff",
  gradientTo = "#63e",
  gradientSize = "125% 125%",
  gradientPosition = "50% 10%",
  gradientStop = "40%"
}) => {
  return (
    <div 
      className={cn(
        "absolute inset-0 w-full h-full -z-10 bg-white",
        className
      )}
      style={{
        background: `radial-gradient(${gradientSize} at ${gradientPosition}, ${gradientFrom} ${gradientStop}, ${gradientTo} 100%)`
      }}
    />
  );
};