import React from "react";

export const Table = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full overflow-auto min-w-[248px] p-6 rounded-lg relative border border-gray-alpha-400 bg-background-100">
      <table className="w-full border-collapse text-sm font-sans text-gray-900">
        {children}
      </table>
    </div>
  );
};

Table.Colgroup = ({ children }: { children: React.ReactNode }) => {
  return <colgroup>{children}</colgroup>;
};

Table.Col = ({ className }: { className?: string }) => {
  return <col className={className} />;
};

Table.Header = ({ children }: { children: React.ReactNode }) => {
  return <thead className="border-b border-gray-alpha-400">{children}</thead>;
};

Table.Body = ({ children, striped, interactive, virtualize }: {
  children: React.ReactNode,
  striped?: boolean,
  interactive?: boolean,
  virtualize?: boolean
}) => {
  return (
    <>
      <tbody className="table-row h-3" />
      <tbody className={`${striped ? "[&_tr:where(:nth-child(odd))]:bg-background-200" : ""}${interactive ? " [&_tr:hover]:bg-gray-100" : ""}`}>
        {children}
      </tbody>
    </>
  );
};

Table.Row = ({ children }: { children: React.ReactNode }) => {
  return <tr className="[&_td:first-child]:rounded-l-[4px] [&_td:last-child]:rounded-r-[4px] transition-colors">{children}</tr>;
};

Table.Head = ({ children }: { children: React.ReactNode }) => {
  return <th className="h-10 px-2 align-middle font-medium text-left last:text-right">{children}</th>;
};

Table.Cell = ({ children, className, colSpan }: { children: React.ReactNode, className?: string, colSpan?: number }) => {
  return <td className={`px-2 py-2.5 align-middle last:text-right ${className || ""}`} colSpan={colSpan}>{children}</td>;
};

Table.Footer = ({ children }: { children: React.ReactNode }) => {
  return <tfoot className="border-t border-gray-alpha-400">{children}</tfoot>;
};
