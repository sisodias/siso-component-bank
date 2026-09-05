import React from "react";

const AnimatedPath = ({
  width = 500,
  height = 500,
  values,          // строка "M…;M…;M…" — кадры анимации
  dur = "1s",
  repeatCount = "indefinite",
  stroke = "black",
  fill = "transparent",
}) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    <path stroke={stroke} fill={fill}>
      <animate
        attributeName="d"
        dur={dur}
        repeatCount={repeatCount}
        values={values} // сюда свои кадры
      />
    </path>
  </svg>
);

export default AnimatedPath;
