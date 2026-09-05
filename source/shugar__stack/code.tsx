import React from "react";
import { Property } from "csstype";
import { useResponsive } from "@/components/ui/use-responsive";

interface ResponsiveProp<T> {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

interface StackProps {
  flex?: Property.Flex;
  direction?: Property.FlexDirection | ResponsiveProp<Property.FlexDirection>;
  align?: Property.AlignItems;
  justify?: Property.JustifyContent;
  gap?: Property.Gap | number | ResponsiveProp<Property.Gap | number>;
  padding?: Property.Padding | number;
  children?: React.ReactNode;
}

export const Stack = ({
  flex = "initial",
  direction = "column",
  align = "stretch",
  justify = "flex-start",
  gap = "0px",
  padding = "0px",
  children
}: StackProps) => {
  const _direction = useResponsive(direction);
  const _gap = useResponsive(gap);

  return (
    <div
      className="flex"
      style={{
        flex,
        flexDirection: _direction,
        justifyContent: justify,
        alignItems: align,
        gap: typeof _gap === "number" ? 4 * _gap : _gap,
        padding: typeof padding === "number" ? 4 * padding : padding
      }}
    >
      {children}
    </div>
  );
};