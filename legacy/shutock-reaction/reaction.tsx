import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Props = Omit<
  React.ComponentPropsWithoutRef<"button"> & {
    symbol?: string;
    scale?: number;
    y?: string;
    x?: string | number | (() => string | number);
    rotate?: string | number | (() => string | number);
  },
  "children"
>;

export const Reaction: React.FC<Props> = ({
  symbol,
  onClick: callback,
  ...props
}) => {
  const [flyingSymbols, setFlyingSymbols] = useState<
    { id: number; symbol: string }[]
  >([]);

  const onClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      callback?.(e);
      if (!symbol) return;

      const id = Date.now();
      setFlyingSymbols((flyingSymbols) => [...flyingSymbols, { id, symbol }]);
      setTimeout(() => {
        setFlyingSymbols((flyingSymbols) =>
          flyingSymbols.filter((e) => e.id !== id)
        );
      }, 1000);
    },
    [callback, symbol]
  );

  return (
    <button {...{ onClick, ...props }}>
      <AnimatePresence>
        {flyingSymbols.map(({ id, symbol }) => (
          <FlyingSymbol key={id} {...{ symbol }} />
        ))}
      </AnimatePresence>

      {symbol}
    </button>
  );
};

const FlyingSymbol: React.FC<Props> = ({
  symbol,
  rotate = () => Math.random() * 90 - 45,
  x = () => `${Math.random() * 200 - 100}%`,
  y = "-500%",
  scale = 2,
}) => {
  const animate = useMemo(
    () => ({
      rotate: typeof rotate === "function" ? rotate() : rotate,
      x: typeof x === "function" ? x() : x,
    }),
    [rotate, x]
  );

  return (
    <motion.div
      initial={{ y: 0, opacity: 1, scale: 1, rotate: 0, x: 0 }}
      animate={{ y, opacity: 0, scale, ...animate }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="absolute pointer-events-none"
    >
      {symbol}
    </motion.div>
  );
};