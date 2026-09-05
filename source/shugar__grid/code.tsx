import React, { createContext, useContext } from "react";
import clsx from "clsx";
import { useResponsive } from "@/components/ui/use-responsive";

const GridContext = createContext<{
  debug: boolean;
  guideWidth: number;
} | null>(null);

interface ResponsiveProp<T> {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

interface GridProps {
  columns: number | ResponsiveProp<number>;
  rows: number | ResponsiveProp<number>;
  height?: "preserve-aspect-ratio" | "auto";
  hideGuides?: "row" | "column";
  children?: React.ReactNode;
}

export const Grid = ({
  columns,
  rows,
  height = "auto",
  hideGuides,
  children
}: GridProps) => {
  const context = useContext(GridContext);
  const _columns = useResponsive(columns) || 1;
  const _rows = useResponsive(rows) || 1;

  return (
    <section
      className="grid relative"
      style={{
        gridTemplateColumns: `repeat(${_columns}, 1fr)`,
        gridTemplateRows: `repeat(${_rows}, 1fr)`,
        height: (children || height === "preserve-aspect-ratio") ? "fit-content" : `calc(100cqw/${_columns}*${_rows})`,
        aspectRatio: height === "preserve-aspect-ratio" ? _columns / _rows : undefined
      }}
    >
      {children}
      <div className="pointer-events-none contents">
        {Array(_columns * _rows).fill(1).map((_, index) => {
          const currentColumn = 1 + index % _columns;
          const currentRow = 1 + Math.floor(index / _columns);

          return (
            <div
              key={index}
              className={clsx(
                "inset-0 absolute",
                context?.debug ? "border-grid-debug" : "border-gray-400"
              )}
              style={{
                gridColumnStart: currentColumn,
                gridColumnEnd: currentColumn,
                gridRowStart: currentRow,
                gridRowEnd: currentRow,
                borderTopWidth: (hideGuides !== "row" || currentRow === 1) ? context?.guideWidth : undefined,
                borderRightWidth: currentColumn === _columns ? context?.guideWidth : undefined,
                borderBottomWidth: currentRow === _rows ? context?.guideWidth : undefined,
                borderLeftWidth: (hideGuides !== "column" || currentColumn === 1) ? context?.guideWidth : undefined,
                aspectRatio: height === "preserve-aspect-ratio" ? 1 : undefined
              }}
            />
          );
        })}
      </div>
    </section>
  );
};

interface GridSystemProps {
  debug?: boolean;
  guideWidth?: number;
  unstable_useContainer?: boolean;
  children: React.ReactNode;
}

const GridSystem = ({
  debug = false,
  guideWidth = 1,
  unstable_useContainer = false,
  children
}: GridSystemProps) => {
  if (unstable_useContainer) {
    return (
      <GridContext value={{ debug, guideWidth }}>
        <div className="w-full contain-inline-size">
          <div>
            {children}
          </div>
        </div>
      </GridContext>
    );
  }

  return (
    <GridContext value={{ debug, guideWidth }}>
      <div>
        {children}
      </div>
    </GridContext>
  );
};

interface GridCellProps {
  column?: number | string | ResponsiveProp<number | string>;
  row?: number | string | ResponsiveProp<number | string>;
  children?: React.ReactNode;
}

const GridCell = ({
  column,
  row,
  children
}: GridCellProps) => {
  const _column = useResponsive(column);
  const _row = useResponsive(row);

  return (
    <div
      className={clsx("overflow-hidden p-6 min-[601px]:p-10 min-[961px]:p-12")}
      style={{ gridColumn: _column, gridRow: _row }}
    >
      {children}
    </div>
  );
};

Grid.System = GridSystem;
Grid.Cell = GridCell;