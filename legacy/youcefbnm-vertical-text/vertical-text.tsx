import { cn } from "../_utils/cn";

type ElementType = React.ElementType;

interface TextVerticalProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export const Component = ({
  as: Component = 'div',
  className,
  style,
  ...props
}: TextVerticalProps) => {

   return (
    <Component
      className={cn('size-min -rotate-180 whitespace-nowrap', className)}
      style={{
        writingMode: 'vertical-rl',
        ...style,
      }}
      {...props}
    />
  );
};
