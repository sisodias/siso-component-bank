// src/components/ui/component.tsx

import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, type CSSProperties } from "react";

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });

  const style: CSSProperties = {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return <motion.span style={{ ...style, y }}>{number}</motion.span>;
}

interface DigitProps {
  place: number;
  value: number;
  height: number;
  digitStyle?: CSSProperties;
}

function Digit({ place, value, height, digitStyle }: DigitProps) {
  let valueRoundedToPlace = Math.floor(value / place);
  let animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  const defaultStyle: CSSProperties = {
    height,
    position: "relative",
    width: "1ch",
    fontVariantNumeric: "tabular-nums",
  };

  return (
    <div style={{ ...defaultStyle, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
}

interface CounterDisplayProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: number[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: CSSProperties["fontWeight"];
  containerStyle?: CSSProperties;
  counterStyle?: CSSProperties;
  digitStyle?: CSSProperties;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: CSSProperties;
  bottomGradientStyle?: CSSProperties;
}

const CounterDisplay = ({
  value,
  fontSize = 100,
  padding = 0,
  places = [100, 10, 1],
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = "white",
  fontWeight = "bold",
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 16,
  gradientFrom = "black",
  gradientTo = "transparent",
  topGradientStyle,
  bottomGradientStyle,
}: CounterDisplayProps) => {
  const height = fontSize + padding;

  const defaultContainerStyle: CSSProperties = {
    position: "relative",
    display: "inline-block",
  };

  const defaultCounterStyle: CSSProperties = {
    fontSize,
    display: "flex",
    gap: gap,
    overflow: "hidden",
    borderRadius: borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    lineHeight: 1,
    color: textColor,
    fontWeight: fontWeight,
    backgroundColor: gradientFrom, // Use gradientFrom as background color for consistent gradients
  };

  const gradientContainerStyle: CSSProperties = {
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  const defaultTopGradientStyle: CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
  };

  const defaultBottomGradientStyle: CSSProperties = {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: gradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
  };

  return (
    <div style={{ ...defaultContainerStyle, ...containerStyle }}>
      <div style={{ ...defaultCounterStyle, ...counterStyle }}>
        {places.map((place) => (
          <Digit
            key={place}
            place={place}
            value={value}
            height={height}
            digitStyle={digitStyle}
          />
        ))}
      </div>
      <div style={gradientContainerStyle}>
        <div
          style={topGradientStyle ? topGradientStyle : defaultTopGradientStyle}
        />
        <div
          style={
            bottomGradientStyle
              ? bottomGradientStyle
              : defaultBottomGradientStyle
          }
        />
      </div>
    </div>
  );
};

interface ComponentPropsWithControls extends CounterDisplayProps {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export const Component = ({
  initialValue = 0,
  min = 0,
  max = Infinity,
  step = 1,
  ...rest
}: ComponentPropsWithControls) => {
  const [count, setCount] = useState(initialValue);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Default to dark theme as in image

  const increment = () => {
    setCount((prev) => Math.min(prev + step, max));
  };

  const decrement = () => {
    setCount((prev) => Math.max(prev - step, min));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const getButtonColors = (currentTheme: 'light' | 'dark') => {
    if (currentTheme === 'dark') {
      return {
        backgroundColor: 'rgb(28, 28, 30)',
        color: 'white',
        borderColor: 'rgb(58, 58, 60)',
      };
    } else {
      return {
        backgroundColor: 'rgb(227, 227, 229)', // Light grey for light theme button background
        color: 'black',
        borderColor: 'rgb(179, 179, 181)', // Darker light grey for light theme button border
      };
    }
  };

  const buttonColors = getButtonColors(theme);

  const buttonStyle: CSSProperties = {
    padding: '0',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '12px',
    width: '44px',
    height: '44px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    ...buttonColors,
    border: `1px solid ${buttonColors.borderColor}`,
  };

  const controlsContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexDirection: 'column',
  };

  const buttonRowStyle: CSSProperties = {
    display: 'flex',
    gap: '10px',
  };

  const themeToggleButtonStyle: CSSProperties = {
    ...buttonStyle,
    marginTop: '20px',
    minWidth: 'unset',
    width: '120px',
  };

  const counterTextColor = theme === 'dark' ? 'white' : 'black';
  const counterGradientFrom = theme === 'dark' ? 'black' : 'white';

  return (
    <div style={controlsContainerStyle}>
      <CounterDisplay
        value={count}
        textColor={counterTextColor}
        gradientFrom={counterGradientFrom}
        borderRadius={16}
        horizontalPadding={12}
        gap={4}
        {...rest}
      />
      <div style={buttonRowStyle}>
        <button onClick={decrement} style={buttonStyle}>-</button>
        <button onClick={increment} style={buttonStyle}>+</button>
      </div>
    </div>
  );
};