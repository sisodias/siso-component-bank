import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";

const TableContext = createContext<{
  cols: React.ReactNode,
  setCols: React.Dispatch<React.SetStateAction<React.ReactNode>>,
} | null>(null);

export const Table = ({ children }: { children: React.ReactNode }) => {
  const [cols, setCols] = useState<React.ReactNode>();

  return (
    <TableContext.Provider value={{ cols, setCols }}>
      <div className="w-full overflow-auto min-w-[248px] p-6 rounded-lg relative border border-gray-alpha-400 bg-background-100">
        <table className="w-full border-collapse text-sm font-sans text-gray-900">
          {children}
        </table>
      </div>
    </TableContext.Provider>
  );
};

Table.Colgroup = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(TableContext);
  useEffect(() => {
    context?.setCols(children);
  }, [children]);

  return <colgroup>{children}</colgroup>;
};

Table.Col = ({ className }: { className?: string }) => {
  return <col className={className} />;
};

Table.Header = ({ children }: { children: React.ReactNode }) => {
  return <thead className="border-b border-gray-alpha-400">{children}</thead>;
};

const VirtualWrapper = ({
  children,
  striped,
  interactive
}: {
  children: React.ReactNode;
  striped?: boolean;
  interactive?: boolean;
}) => {
  const context = useContext(TableContext);
  const parentRef = useRef<HTMLDivElement>(null);
  const rows = React.Children.toArray(children);
  const [scrollElement, setScrollElement] = useState<any>(null);

  useEffect(() => {
    if (parentRef.current) {
      setScrollElement(parentRef.current);
    }
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 40,
    overscan: 5
  });

  const cols = context?.cols
    //@ts-ignore
    ? (context?.cols as React.ReactNode[]).map((col: React.ReactNode) => col?.props?.className)
    : undefined;

  return (
    <>
      <tbody className="table-row h-3" />
      <tbody
        //@ts-ignore
        ref={parentRef}
        style={{
          position: "relative",
          height: `${rowVirtualizer.getTotalSize()}px`
        }}
        className={clsx(
          striped && "[&_tr:where(:nth-child(odd))]:bg-background-200",
          interactive && " [&_tr:hover]:bg-gray-100"
        )}
      >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => (
        <tr
          key={virtualRow.index}
          data-index={virtualRow.index}
          ref={rowVirtualizer.measureElement}
          className="[&_td:first-child]:rounded-l-[4px] [&_td:last-child]:rounded-r-[4px] transition-colors"
          style={{
            transform: `translateY(${virtualRow.start}px)`,
            position: "absolute",
            width: "100%"
          }}
        >
          {/*@ts-ignore*/}
          {Object.values(rows[virtualRow.index].props.item).map((item: React.ReactNode, index: number) => (
            <Table.Cell
              // @ts-ignore
              {...rows[virtualRow.index].props}
              className={clsx(
                "!pl-0 !pr-4",
                cols !== undefined && cols[index] && cols[index]
              )}
            >
              {item}
            </Table.Cell>
          ))}
        </tr>
      ))}
      </tbody>
    </>
  );
};

Table.Body = ({
  children,
  striped,
  interactive,
  virtualize = false
}: {
  children: React.ReactNode;
  striped?: boolean;
  interactive?: boolean;
  virtualize?: boolean;
}) => {
  if (!virtualize) {
    return (
      <>
        <tbody className="table-row h-3" />
        <tbody
          className={clsx(
            striped && "[&_tr:where(:nth-child(odd))]:bg-background-200",
            interactive && " [&_tr:hover]:bg-gray-100"
          )}
        >
        {children}
        </tbody>
      </>
    );
  }

  return <VirtualWrapper striped={striped} interactive={interactive}>{children}</VirtualWrapper>;
};


Table.Row = ({ children }: { children: React.ReactNode }) => {
  return (
    <tr className="[&_td:first-child]:rounded-l-[4px] [&_td:last-child]:rounded-r-[4px] transition-colors">
      {children}
    </tr>
  );
};

Table.Head = ({ children }: { children: React.ReactNode }) => {
  return (
    <th className="h-10 px-2 align-middle font-medium text-left last:text-right">
      {children}
    </th>
  );
};

Table.Cell = ({
  children,
  className,
  colSpan
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) => {
  return (
    <td
      className={clsx("px-2 py-2.5 align-middle last:text-right", className)}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};

Table.Footer = ({ children }: { children: React.ReactNode }) => {
  return <tfoot className="border-t border-gray-alpha-400">{children}</tfoot>;
};
