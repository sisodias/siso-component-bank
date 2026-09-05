'use client';

// REACT & EXTERNAL LIBRARIES
import * as React from 'react';
import { createContext, ReactNode, useContext, CSSProperties, Fragment, HTMLAttributes, useId } from 'react';
import {
  ColumnFiltersState,
  RowData,
  SortingState,
  Table,
  Cell,
  Column,
  flexRender,
  Header,
  HeaderGroup,
  Row,
} from '@tanstack/react-table';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDown,
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
  ArrowUp,
  Check,
  ChevronsUpDown,
  PinOff,
  Settings2,
  CirclePlus,
  GripVertical,
  GripHorizontal,
} from 'lucide-react';

// PROJECT UI COMPONENTS & UTILS
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button-1';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge-2';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

// =================================================================
// 1. CORE: CONTEXT, PROVIDER, TYPES (from data-grid)
// =================================================================

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    headerTitle?: string;
    headerClassName?: string;
    cellClassName?: string;
    skeleton?: ReactNode;
    expandedContent?: (row: TData) => ReactNode;
  }
}

export type DataGridApiFetchParams = {
  pageIndex: number;
  pageSize: number;
  sorting?: SortingState;
  filters?: ColumnFiltersState;
  searchQuery?: string;
};

export type DataGridApiResponse<T> = {
  data: T[];
  empty: boolean;
  pagination: {
    total: number;
    page: number;
  };
};

export interface DataGridContextProps<TData extends object> {
  props: DataGridProps<TData>;
  table: Table<TData>;
  recordCount: number;
  isLoading: boolean;
}

export type DataGridRequestParams = {
  pageIndex: number;
  pageSize: number;
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
};

export interface DataGridProps<TData extends object> {
  className?: string;
  table?: Table<TData>;
  recordCount: number;
  children?: ReactNode;
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  loadingMode?: 'skeleton' | 'spinner';
  loadingMessage?: ReactNode | string;
  emptyMessage?: ReactNode | string;
  tableLayout?: {
    dense?: boolean;
    cellBorder?: boolean;
    rowBorder?: boolean;
    rowRounded?: boolean;
    stripped?: boolean;
    headerBackground?: boolean;
    headerBorder?: boolean;
    headerSticky?: boolean;
    width?: 'auto' | 'fixed';
    columnsVisibility?: boolean;
    columnsResizable?: boolean;
    columnsPinnable?: boolean;
    columnsMovable?: boolean;
    columnsDraggable?: boolean;
    rowsDraggable?: boolean;
  };
  tableClassNames?: {
    base?: string;
    header?: string;
    headerRow?: string;
    headerSticky?: string;
    body?: string;
    bodyRow?: string;
    footer?: string;
    edgeCell?: string;
  };
}

const DataGridContext = createContext<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DataGridContextProps<any> | undefined
>(undefined);

function useDataGrid() {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error('useDataGrid must be used within a DataGridProvider');
  }
  return context;
}

function DataGridProvider<TData extends object>({
  children,
  table,
  ...props
}: DataGridProps<TData> & { table: Table<TData> }) {
  return (
    <DataGridContext.Provider
      value={{
        props,
        table,
        recordCount: props.recordCount,
        isLoading: props.isLoading || false,
      }}
    >
      {children}
    </DataGridContext.Provider>
  );
}

function DataGrid<TData extends object>({ children, table, ...props }: DataGridProps<TData>) {
  const defaultProps: Partial<DataGridProps<TData>> = {
    loadingMode: 'skeleton',
    tableLayout: {
      dense: false,
      cellBorder: false,
      rowBorder: true,
      rowRounded: false,
      stripped: false,
      headerSticky: false,
      headerBackground: true,
      headerBorder: true,
      width: 'fixed',
      columnsVisibility: false,
      columnsResizable: false,
      columnsPinnable: false,
      columnsMovable: false,
      columnsDraggable: false,
      rowsDraggable: false,
    },
    tableClassNames: {
      base: '',
      header: '',
      headerRow: '',
      headerSticky: 'sticky top-0 z-10 bg-background/90 backdrop-blur-xs',
      body: '',
      bodyRow: '',
      footer: '',
      edgeCell: '',
    },
  };

  const mergedProps: DataGridProps<TData> = {
    ...defaultProps,
    ...props,
    tableLayout: {
      ...defaultProps.tableLayout,
      ...(props.tableLayout || {}),
    },
    tableClassNames: {
      ...defaultProps.tableClassNames,
      ...(props.tableClassNames || {}),
    },
  };

  if (!table) {
    throw new Error('DataGrid requires a "table" prop');
  }

  return (
    <DataGridProvider table={table} {...mergedProps}>
      {children}
    </DataGridProvider>
  );
}

function DataGridContainer({
  children,
  className,
  border = true,
}: {
  children: ReactNode;
  className?: string;
  border?: boolean;
}) {
  return (
    <div data-slot="data-grid" className={cn('grid w-full', border && 'border border-border rounded-lg', className)}>
      {children}
    </div>
  );
}

// =================================================================
// 2. TABLE COMPONENTS (from data-grid-table)
// =================================================================

const headerCellSpacingVariants = cva('', {
  variants: {
    size: {
      dense: 'px-2.5 h-8',
      default: 'px-4',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const bodyCellSpacingVariants = cva('', {
  variants: {
    size: {
      dense: 'px-2.5 py-2',
      default: 'px-4 py-3',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

function getPinningStyles<TData>(column: Column<TData>): CSSProperties {
  const isPinned = column.getIsPinned();

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
}

function DataGridTableBase({ children }: { children: ReactNode }) {
  const { props } = useDataGrid();

  return (
    <table
      data-slot="data-grid-table"
      className={cn(
        'w-full align-middle caption-bottom text-left rtl:text-right text-foreground font-normal text-sm',
        !props.tableLayout?.columnsDraggable && 'border-separate border-spacing-0',
        props.tableLayout?.width === 'fixed' ? 'table-fixed' : 'table-auto',
        props.tableClassNames?.base,
      )}
    >
      {children}
    </table>
  );
}

function DataGridTableHead({ children }: { children: ReactNode }) {
  const { props } = useDataGrid();

  return (
    <thead
      className={cn(
        props.tableClassNames?.header,
        props.tableLayout?.headerSticky && props.tableClassNames?.headerSticky,
      )}
    >
      {children}
    </thead>
  );
}

function DataGridTableHeadRow<TData>({
  children,
  headerGroup,
}: {
  children: ReactNode;
  headerGroup: HeaderGroup<TData>;
}) {
  const { props } = useDataGrid();

  return (
    <tr
      key={headerGroup.id}
      className={cn(
        'bg-muted/40',
        props.tableLayout?.headerBorder && '[&>th]:border-b',
        props.tableLayout?.cellBorder && '[&_>:last-child]:border-e-0',
        props.tableLayout?.stripped && 'bg-transparent',
        props.tableLayout?.headerBackground === false && 'bg-transparent',
        props.tableClassNames?.headerRow,
      )}
    >
      {children}
    </tr>
  );
}

function DataGridTableHeadRowCell<TData>({
  children,
  header,
  dndRef,
  dndStyle,
}: {
  children: ReactNode;
  header: Header<TData, unknown>;
  dndRef?: React.Ref<HTMLTableCellElement>;
  dndStyle?: CSSProperties;
}) {
  const { props } = useDataGrid();

  const { column } = header;
  const isPinned = column.getIsPinned();
  const isLastLeftPinned = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinned = isPinned === 'right' && column.getIsFirstColumn('right');
  const headerCellSpacing = headerCellSpacingVariants({
    size: props.tableLayout?.dense ? 'dense' : 'default',
  });

  return (
    <th
      key={header.id}
      ref={dndRef}
      style={{
        ...(props.tableLayout?.width === 'fixed' && {
          width: `${header.getSize()}px`,
        }),
        ...(props.tableLayout?.columnsPinnable && column.getCanPin() && getPinningStyles(column)),
        ...(dndStyle ? dndStyle : null),
      }}
      data-pinned={isPinned || undefined}
      data-last-col={isLastLeftPinned ? 'left' : isFirstRightPinned ? 'right' : undefined}
      className={cn(
        'relative h-10 text-left rtl:text-right align-middle font-normal text-accent-foreground [&:has([role=checkbox])]:pe-0',
        headerCellSpacing,
        props.tableLayout?.cellBorder && 'border-e',
        props.tableLayout?.columnsResizable && column.getCanResize() && 'truncate',
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          '[&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-s! [&[data-pinned][data-last-col]]:border-border data-pinned:bg-muted/90 data-pinned:backdrop-blur-xs',
        header.column.columnDef.meta?.headerClassName,
        column.getIndex() === 0 || column.getIndex() === header.headerGroup.headers.length - 1
          ? props.tableClassNames?.edgeCell
          : '',
      )}
    >
      {children}
    </th>
  );
}

function DataGridTableHeadRowCellResize<TData>({ header }: { header: Header<TData, unknown> }) {
  const { column } = header;

  return (
    <div
      {...{
        onDoubleClick: () => column.resetSize(),
        onMouseDown: header.getResizeHandler(),
        onTouchStart: header.getResizeHandler(),
        className:
          'absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -end-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px',
      }}
    />
  );
}

function DataGridTableRowSpacer() {
  return <tbody aria-hidden="true" className="h-2"></tbody>;
}

function DataGridTableBody({ children }: { children: ReactNode }) {
  const { props } = useDataGrid();

  return (
    <tbody
      className={cn(
        '[&_tr:last-child]:border-0',
        props.tableLayout?.rowRounded && '[&_td:first-child]:rounded-s-lg [&_td:last-child]:rounded-e-lg',
        props.tableClassNames?.body,
      )}
    >
      {children}
    </tbody>
  );
}

function DataGridTableBodyRowSkeleton({ children }: { children: ReactNode }) {
  const { table, props } = useDataGrid();

  return (
    <tr
      className={cn(
        'hover:bg-muted/40 data-[state=selected]:bg-muted/50',
        props.onRowClick && 'cursor-pointer',
        !props.tableLayout?.stripped &&
          props.tableLayout?.rowBorder &&
          'border-b border-border [&:not(:last-child)>td]:border-b',
        props.tableLayout?.cellBorder && '[&_>:last-child]:border-e-0',
        props.tableLayout?.stripped && 'odd:bg-muted/90 hover:bg-transparent odd:hover:bg-muted',
        table.options.enableRowSelection && '[&_>:first-child]:relative',
        props.tableClassNames?.bodyRow,
      )}
    >
      {children}
    </tr>
  );
}

function DataGridTableBodyRowSkeletonCell<TData>({ children, column }: { children: ReactNode; column: Column<TData> }) {
  const { props, table } = useDataGrid();
  const bodyCellSpacing = bodyCellSpacingVariants({
    size: props.tableLayout?.dense ? 'dense' : 'default',
  });

  return (
    <td
      className={cn(
        'align-middle',
        bodyCellSpacing,
        props.tableLayout?.cellBorder && 'border-e',
        props.tableLayout?.columnsResizable && column.getCanResize() && 'truncate',
        column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          '[&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right][data-last-col=right]]:border-s! [&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/90 data-pinned:backdrop-blur-xs"',
        column.getIndex() === 0 || column.getIndex() === table.getVisibleFlatColumns().length - 1
          ? props.tableClassNames?.edgeCell
          : '',
      )}
    >
      {children}
    </td>
  );
}

function DataGridTableBodyRow<TData>({
  children,
  row,
  dndRef,
  dndStyle,
}: {
  children: ReactNode;
  row: Row<TData>;
  dndRef?: React.Ref<HTMLTableRowElement>;
  dndStyle?: CSSProperties;
}) {
  const { props, table } = useDataGrid();

  return (
    <tr
      ref={dndRef}
      style={{ ...(dndStyle ? dndStyle : null) }}
      data-state={table.options.enableRowSelection && row.getIsSelected() ? 'selected' : undefined}
      onClick={() => props.onRowClick && props.onRowClick(row.original)}
      className={cn(
        'hover:bg-muted/40 data-[state=selected]:bg-muted/50',
        props.onRowClick && 'cursor-pointer',
        !props.tableLayout?.stripped &&
          props.tableLayout?.rowBorder &&
          'border-b border-border [&:not(:last-child)>td]:border-b',
        props.tableLayout?.cellBorder && '[&_>:last-child]:border-e-0',
        props.tableLayout?.stripped && 'odd:bg-muted/90 hover:bg-transparent odd:hover:bg-muted',
        table.options.enableRowSelection && '[&_>:first-child]:relative',
        props.tableClassNames?.bodyRow,
      )}
    >
      {children}
    </tr>
  );
}

function DataGridTableBodyRowExpandded<TData>({ row }: { row: Row<TData> }) {
  const { props, table } = useDataGrid();

  return (
    <tr className={cn(props.tableLayout?.rowBorder && '[&:not(:last-child)>td]:border-b')}>
      <td colSpan={row.getVisibleCells().length}>
        {table
          .getAllColumns()
          .find((column) => column.columnDef.meta?.expandedContent)
          ?.columnDef.meta?.expandedContent?.(row.original)}
      </td>
    </tr>
  );
}

function DataGridTableBodyRowCell<TData>({
  children,
  cell,
  dndRef,
  dndStyle,
}: {
  children: ReactNode;
  cell: Cell<TData, unknown>;
  dndRef?: React.Ref<HTMLTableCellElement>;
  dndStyle?: CSSProperties;
}) {
  const { props } = useDataGrid();

  const { column, row } = cell;
  const isPinned = column.getIsPinned();
  const isLastLeftPinned = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinned = isPinned === 'right' && column.getIsFirstColumn('right');
  const bodyCellSpacing = bodyCellSpacingVariants({
    size: props.tableLayout?.dense ? 'dense' : 'default',
  });

  return (
    <td
      key={cell.id}
      ref={dndRef}
      {...(props.tableLayout?.columnsDraggable && !isPinned ? { cell } : {})}
      style={{
        ...(props.tableLayout?.columnsPinnable && column.getCanPin() && getPinningStyles(column)),
        ...(dndStyle ? dndStyle : null),
      }}
      data-pinned={isPinned || undefined}
      data-last-col={isLastLeftPinned ? 'left' : isFirstRightPinned ? 'right' : undefined}
      className={cn(
        'align-middle',
        bodyCellSpacing,
        props.tableLayout?.cellBorder && 'border-e',
        props.tableLayout?.columnsResizable && column.getCanResize() && 'truncate',
        cell.column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          '[&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right][data-last-col=right]]:border-s! [&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/90 data-pinned:backdrop-blur-xs"',
        column.getIndex() === 0 || column.getIndex() === row.getVisibleCells().length - 1
          ? props.tableClassNames?.edgeCell
          : '',
      )}
    >
      {children}
    </td>
  );
}

function DataGridTableEmpty() {
  const { table, props } = useDataGrid();
  const totalColumns = table.getAllColumns().length;

  return (
    <tr>
      <td colSpan={totalColumns} className="text-center text-muted-foreground py-6">
        {props.emptyMessage || 'No data available'}
      </td>
    </tr>
  );
}

function DataGridTableLoader() {
  const { props } = useDataGrid();

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="text-muted-foreground bg-card  flex items-center gap-2 px-4 py-2 font-medium leading-none text-sm border shadow-xs rounded-md">
        <svg
          className="animate-spin -ml-1 h-5 w-5 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {props.loadingMessage || 'Loading...'}
      </div>
    </div>
  );
}

function DataGridTableRowSelect<TData>({ row, size }: { row: Row<TData>; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <>
      <div
        className={cn('hidden absolute top-0 bottom-0 start-0 w-[2px] bg-primary', row.getIsSelected() && 'block')}
      ></div>
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        size={size ?? 'sm'}
        className="align-[inherit]"
      />
    </>
  );
}

function DataGridTableRowSelectAll({ size }: { size?: 'sm' | 'md' | 'lg' }) {
  const { table, recordCount, isLoading } = useDataGrid();

  return (
    <Checkbox
      checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
      disabled={isLoading || recordCount === 0}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      size={size}
      className="align-[inherit]"
    />
  );
}

function DataGridTable<TData>() {
  const { table, isLoading, props } = useDataGrid();
  const pagination = table.getState().pagination;

  return (
    <DataGridTableBase>
      <DataGridTableHead>
        {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>, index) => {
          return (
            <DataGridTableHeadRow headerGroup={headerGroup} key={index}>
              {headerGroup.headers.map((header, index) => {
                const { column } = header;

                return (
                  <DataGridTableHeadRowCell header={header} key={index}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {props.tableLayout?.columnsResizable && column.getCanResize() && (
                      <DataGridTableHeadRowCellResize header={header} />
                    )}
                  </DataGridTableHeadRowCell>
                );
              })}
            </DataGridTableHeadRow>
          );
        })}
      </DataGridTableHead>

      {(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && <DataGridTableRowSpacer />}

      <DataGridTableBody>
        {props.loadingMode === 'skeleton' && isLoading && pagination?.pageSize ? (
          Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
            <DataGridTableBodyRowSkeleton key={rowIndex}>
              {table.getVisibleFlatColumns().map((column, colIndex) => {
                return (
                  <DataGridTableBodyRowSkeletonCell column={column} key={colIndex}>
                    {column.columnDef.meta?.skeleton}
                  </DataGridTableBodyRowSkeletonCell>
                );
              })}
            </DataGridTableBodyRowSkeleton>
          ))
        ) : table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row: Row<TData>, index) => {
            return (
              <Fragment key={row.id}>
                <DataGridTableBodyRow row={row} key={index}>
                  {row.getVisibleCells().map((cell: Cell<TData, unknown>, colIndex) => {
                    return (
                      <DataGridTableBodyRowCell cell={cell} key={colIndex}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </DataGridTableBodyRowCell>
                    );
                  })}
                </DataGridTableBodyRow>
                {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
              </Fragment>
            );
          })
        ) : (
          <DataGridTableEmpty />
        )}
      </DataGridTableBody>
    </DataGridTableBase>
  );
}

// =================================================================
// 3. PAGINATION COMPONENT (from data-grid-pagination)
// =================================================================

export interface DataGridPaginationProps {
  sizes?: number[];
  sizesInfo?: string;
  sizesLabel?: string;
  sizesDescription?: string;
  sizesSkeleton?: ReactNode;
  more?: boolean;
  moreLimit?: number;
  info?: string;
  infoSkeleton?: ReactNode;
  className?: string;
}

function DataGridPagination(props: DataGridPaginationProps) {
  const { table, recordCount, isLoading } = useDataGrid();

  const defaultProps: Partial<DataGridPaginationProps> = {
    sizes: [5, 10, 25, 50, 100],
    sizesLabel: 'Show',
    sizesDescription: 'per page',
    sizesSkeleton: <Skeleton className="h-8 w-44" />,
    moreLimit: 5,
    more: false,
    info: '{from} - {to} of {count}',
    infoSkeleton: <Skeleton className="h-8 w-60" />,
  };

  const mergedProps: DataGridPaginationProps = { ...defaultProps, ...props };

  const btnBaseClasses = 'size-7 p-0 text-sm';
  const btnArrowClasses = btnBaseClasses + ' rtl:transform rtl:rotate-180';
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, recordCount);
  const pageCount = table.getPageCount();

  const paginationInfo = mergedProps?.info
    ? mergedProps.info
        .replace('{from}', from.toString())
        .replace('{to}', to.toString())
        .replace('{count}', recordCount.toString())
    : `${from} - ${to} of ${recordCount}`;

  const paginationMoreLimit = mergedProps?.moreLimit || 5;
  const currentGroupStart = Math.floor(pageIndex / paginationMoreLimit) * paginationMoreLimit;
  const currentGroupEnd = Math.min(currentGroupStart + paginationMoreLimit, pageCount);

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = currentGroupStart; i < currentGroupEnd; i++) {
      buttons.push(
        <Button
          key={i}
          size="sm"
          mode="icon"
          variant="ghost"
          className={cn(btnBaseClasses, 'text-muted-foreground', {
            'bg-accent text-accent-foreground': pageIndex === i,
          })}
          onClick={() => {
            if (pageIndex !== i) {
              table.setPageIndex(i);
            }
          }}
        >
          {i + 1}
        </Button>,
      );
    }
    return buttons;
  };

  const renderEllipsisPrevButton = () => {
    if (currentGroupStart > 0) {
      return (
        <Button
          size="sm"
          mode="icon"
          className={btnBaseClasses}
          variant="ghost"
          onClick={() => table.setPageIndex(currentGroupStart - 1)}
        >
          ...
        </Button>
      );
    }
    return null;
  };

  const renderEllipsisNextButton = () => {
    if (currentGroupEnd < pageCount) {
      return (
        <Button
          className={btnBaseClasses}
          variant="ghost"
          size="sm"
          mode="icon"
          onClick={() => table.setPageIndex(currentGroupEnd)}
        >
          ...
        </Button>
      );
    }
    return null;
  };

  return (
    <div
      data-slot="data-grid-pagination"
      className={cn(
        'flex flex-wrap flex-col sm:flex-row justify-between items-center gap-2.5 py-2.5 sm:py-0 grow',
        mergedProps?.className,
      )}
    >
      <div className="flex flex-wrap items-center space-x-2.5 pb-2.5 sm:pb-0 order-2 sm:order-1">
        {isLoading ? (
          mergedProps?.sizesSkeleton
        ) : (
          <>
            <div className="text-sm text-muted-foreground">Rows per page</div>
            <Select
              value={`${pageSize}`}
              indicatorPosition="right"
              onValueChange={(value) => {
                const newPageSize = Number(value);
                table.setPageSize(newPageSize);
              }}
            >
              <SelectTrigger className="w-fit" size="sm">
                <SelectValue placeholder={`${pageSize}`} />
              </SelectTrigger>
              <SelectContent side="top" className="min-w-[50px]">
                {mergedProps?.sizes?.map((size: number) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-2.5 pt-2.5 sm:pt-0 order-1 sm:order-2">
        {isLoading ? (
          mergedProps?.infoSkeleton
        ) : (
          <>
            <div className="text-sm text-muted-foreground text-nowrap order-2 sm:order-1">{paginationInfo}</div>
            {pageCount > 1 && (
              <div className="flex items-center space-x-1 order-1 sm:order-2">
                <Button
                  size="sm"
                  mode="icon"
                  variant="ghost"
                  className={btnArrowClasses}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="size-4" />
                </Button>

                {renderEllipsisPrevButton()}
                {renderPageButtons()}
                {renderEllipsisNextButton()}

                <Button
                  size="sm"
                  mode="icon"
                  variant="ghost"
                  className={btnArrowClasses}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// =================================================================
// 4. COLUMN HEADER COMPONENT (from data-grid-column-header)
// =================================================================

export interface DataGridColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title?: string;
  icon?: ReactNode;
  pinnable?: boolean;
  filter?: ReactNode;
  visibility?: boolean;
}

function DataGridColumnHeader<TData, TValue>({
  column,
  title = '',
  icon,
  className,
  filter,
  visibility = false,
}: DataGridColumnHeaderProps<TData, TValue>) {
  const { isLoading, table, props, recordCount } = useDataGrid();

  const moveColumn = (direction: 'left' | 'right') => {
    const currentOrder = [...table.getState().columnOrder];
    const currentIndex = currentOrder.indexOf(column.id);

    if (direction === 'left' && currentIndex > 0) {
      const newOrder = [...currentOrder];
      const [movedColumn] = newOrder.splice(currentIndex, 1);
      newOrder.splice(currentIndex - 1, 0, movedColumn);
      table.setColumnOrder(newOrder);
    }

    if (direction === 'right' && currentIndex < currentOrder.length - 1) {
      const newOrder = [...currentOrder];
      const [movedColumn] = newOrder.splice(currentIndex, 1);
      newOrder.splice(currentIndex + 1, 0, movedColumn);
      table.setColumnOrder(newOrder);
    }
  };

  const canMove = (direction: 'left' | 'right'): boolean => {
    const currentOrder = table.getState().columnOrder;
    const currentIndex = currentOrder.indexOf(column.id);
    if (direction === 'left') {
      return currentIndex > 0;
    } else {
      return currentIndex < currentOrder.length - 1;
    }
  };

  const headerLabel = () => {
    return (
      <div
        className={cn(
          'text-accent-foreground font-normal inline-flex h-full items-center gap-1.5 text-[0.8125rem] leading-[calc(1.125/0.8125)] [&_svg]:size-3.5 [&_svg]:opacity-60',
          className,
        )}
      >
        {icon && icon}
        {title}
      </div>
    );
  };

  const headerButton = () => {
    return (
      <Button
        variant="ghost"
        className={cn(
          'text-secondary-foreground rounded-md font-normal -ms-2 px-2 h-7 hover:bg-secondary data-[state=open]:bg-secondary hover:text-foreground data-[state=open]:text-foreground',
          className,
        )}
        disabled={isLoading || recordCount === 0}
        onClick={() => {
          const isSorted = column.getIsSorted();
          if (isSorted === 'asc') {
            column.toggleSorting(true);
          } else if (isSorted === 'desc') {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        }}
      >
        {icon && icon}
        {title}

        {column.getCanSort() &&
          (column.getIsSorted() === 'desc' ? (
            <ArrowDown className="size-[0.7rem]! mt-px" />
          ) : column.getIsSorted() === 'asc' ? (
            <ArrowUp className="size-[0.7rem]! mt-px" />
          ) : (
            <ChevronsUpDown className="size-[0.7rem]! mt-px" />
          ))}
      </Button>
    );
  };

  const headerPin = () => {
    return (
      <Button
        mode="icon"
        size="sm"
        variant="ghost"
        className="-me-1 size-7 rounded-md"
        onClick={() => column.pin(false)}
        aria-label={`Unpin ${title} column`}
        title={`Unpin ${title} column`}
      >
        <PinOff className="size-3.5! opacity-50!" aria-hidden="true" />
      </Button>
    );
  };

  const headerControls = () => {
    return (
      <div className="flex items-center h-full gap-1.5 justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{headerButton()}</DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="start">
            {filter && <DropdownMenuLabel>{filter}</DropdownMenuLabel>}
            {filter && (column.getCanSort() || column.getCanPin() || visibility) && <DropdownMenuSeparator />}
            {column.getCanSort() && (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    if (column.getIsSorted() === 'asc') {
                      column.clearSorting();
                    } else {
                      column.toggleSorting(false);
                    }
                  }}
                  disabled={!column.getCanSort()}
                >
                  <ArrowUp className="size-3.5!" />
                  <span className="grow">Asc</span>
                  {column.getIsSorted() === 'asc' && <Check className="size-4 opacity-100! text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (column.getIsSorted() === 'desc') {
                      column.clearSorting();
                    } else {
                      column.toggleSorting(true);
                    }
                  }}
                  disabled={!column.getCanSort()}
                >
                  <ArrowDown className="size-3.5!" />
                  <span className="grow">Desc</span>
                  {column.getIsSorted() === 'desc' && <Check className="size-4 opacity-100! text-primary" />}
                </DropdownMenuItem>
              </>
            )}
            {(filter || column.getCanSort()) && (column.getCanSort() || column.getCanPin() || visibility) && (
              <DropdownMenuSeparator />
            )}
            {props.tableLayout?.columnsPinnable && column.getCanPin() && (
              <>
                <DropdownMenuItem onClick={() => column.pin(column.getIsPinned() === 'left' ? false : 'left')}>
                  <ArrowLeftToLine className="size-3.5!" aria-hidden="true" />
                  <span className="grow">Pin to left</span>
                  {column.getIsPinned() === 'left' && <Check className="size-4 opacity-100! text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.pin(column.getIsPinned() === 'right' ? false : 'right')}>
                  <ArrowRightToLine className="size-3.5!" aria-hidden="true" />
                  <span className="grow">Pin to right</span>
                  {column.getIsPinned() === 'right' && <Check className="size-4 opacity-100! text-primary" />}
                </DropdownMenuItem>
              </>
            )}
            {props.tableLayout?.columnsMovable && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => moveColumn('left')}
                  disabled={!canMove('left') || column.getIsPinned() !== false}
                >
                  <ArrowLeft className="size-3.5!" aria-hidden="true" />
                  <span>Move to Left</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => moveColumn('right')}
                  disabled={!canMove('right') || column.getIsPinned() !== false}
                >
                  <ArrowRight className="size-3.5!" aria-hidden="true" />
                  <span>Move to Right</span>
                </DropdownMenuItem>
              </>
            )}
            {props.tableLayout?.columnsVisibility &&
              visibility &&
              (column.getCanSort() || column.getCanPin() || filter) && <DropdownMenuSeparator />}
            {props.tableLayout?.columnsVisibility && visibility && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Settings2 className="size-3.5!" />
                  <span>Columns</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {table
                      .getAllColumns()
                      .filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide())
                      .map((col) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={col.id}
                            checked={col.getIsVisible()}
                            onSelect={(event) => event.preventDefault()}
                            onCheckedChange={(value) => col.toggleVisibility(!!value)}
                            className="capitalize"
                          >
                            {col.columnDef.meta?.headerTitle || col.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {props.tableLayout?.columnsPinnable && column.getCanPin() && column.getIsPinned() && headerPin()}
      </div>
    );
  };

  if (
    props.tableLayout?.columnsMovable ||
    (props.tableLayout?.columnsVisibility && visibility) ||
    (props.tableLayout?.columnsPinnable && column.getCanPin()) ||
    filter
  ) {
    return headerControls();
  }

  if (column.getCanSort() || (props.tableLayout?.columnsResizable && column.getCanResize())) {
    return <div className="flex items-center h-full">{headerButton()}</div>;
  }

  return headerLabel();
}

// =================================================================
// 5. COLUMN FILTER COMPONENT (from data-grid-column-filter)
// =================================================================

export interface DataGridColumnFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

function DataGridColumnFilter<TData, TValue>({ column, title, options }: DataGridColumnFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <CirclePlus className="size-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal">
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(filterValues.length ? filterValues : undefined);
                    }}
                  >
                    <div
                      className={cn(
                        'me-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <Check className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ms-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// =================================================================
// 6. COLUMN VISIBILITY COMPONENT (from data-grid-column-visibility)
// =================================================================

function DataGridColumnVisibility<TData>({ table, trigger }: { table: Table<TData>; trigger: ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        <DropdownMenuLabel className="font-medium">Toggle Columns</DropdownMenuLabel>
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onSelect={(event) => event.preventDefault()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.columnDef.meta?.headerTitle || column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// =================================================================
// 7. DND COLUMN TABLE (from data-grid-table-dnd)
// =================================================================

function DataGridTableDndHeader<TData>({ header }: { header: Header<TData, unknown> }) {
  const { props } = useDataGrid();
  const { column } = header;

  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: header.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform),
    transition,
    whiteSpace: 'nowrap',
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <DataGridTableHeadRowCell header={header} dndStyle={style} dndRef={setNodeRef}>
      <div className="flex items-center justify-start gap-0.5">
        <Button
          mode="icon"
          size="sm"
          variant="dim"
          className="-ms-2 size-6"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="opacity-50" aria-hidden="true" />
        </Button>
        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
        {props.tableLayout?.columnsResizable && column.getCanResize() && (
          <DataGridTableHeadRowCellResize header={header} />
        )}
      </div>
    </DataGridTableHeadRowCell>
  );
}

function DataGridTableDndCell<TData>({ cell }: { cell: Cell<TData, unknown> }) {
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform),
    transition,
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <DataGridTableBodyRowCell cell={cell} dndStyle={style} dndRef={setNodeRef}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </DataGridTableBodyRowCell>
  );
}

function DataGridTableDnd<TData>({ handleDragEnd }: { handleDragEnd: (event: DragEndEvent) => void }) {
  const { table, isLoading, props } = useDataGrid();
  const pagination = table.getState().pagination;

  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

  return (
    <DndContext
      id={useId()}
      collisionDetection={closestCenter}
      modifiers={[restrictToParentElement]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="relative">
        <DataGridTableBase>
          <DataGridTableHead>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>, index) => {
              console.log('table.getState().columnOrder:', table.getState().columnOrder);

              return (
                <DataGridTableHeadRow headerGroup={headerGroup} key={index}>
                  <SortableContext items={table.getState().columnOrder} strategy={horizontalListSortingStrategy}>
                    {headerGroup.headers.map((header, index) => (
                      <DataGridTableDndHeader header={header} key={index} />
                    ))}
                  </SortableContext>
                </DataGridTableHeadRow>
              );
            })}
          </DataGridTableHead>

          {(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && <DataGridTableRowSpacer />}

          <DataGridTableBody>
            {props.loadingMode === 'skeleton' && isLoading && pagination?.pageSize ? (
              Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
                <DataGridTableBodyRowSkeleton key={rowIndex}>
                  {table.getVisibleFlatColumns().map((column, colIndex) => {
                    return (
                      <DataGridTableBodyRowSkeletonCell column={column} key={colIndex}>
                        {column.columnDef.meta?.skeleton}
                      </DataGridTableBodyRowSkeletonCell>
                    );
                  })}
                </DataGridTableBodyRowSkeleton>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row: Row<TData>, index) => {
                return (
                  <Fragment key={row.id}>
                    <DataGridTableBodyRow row={row} key={index}>
                      {row.getVisibleCells().map((cell: Cell<TData, unknown>) => {
                        return (
                          <SortableContext
                            key={cell.id}
                            items={table.getState().columnOrder}
                            strategy={horizontalListSortingStrategy}
                          >
                            <DataGridTableDndCell cell={cell} />
                          </SortableContext>
                        );
                      })}
                    </DataGridTableBodyRow>
                    {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
                  </Fragment>
                );
              })
            ) : (
              <DataGridTableEmpty />
            )}
          </DataGridTableBody>
        </DataGridTableBase>
      </div>
    </DndContext>
  );
}

// =================================================================
// 8. DND ROWS TABLE (from data-grid-dnd-rows)
// =================================================================

function DataGridTableDndRowHandle({ rowId }: { rowId: string }) {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });

  return (
    <Button variant="dim" size="sm" className="size-7" {...attributes} {...listeners}>
      <GripHorizontal />
    </Button>
  );
}

function DataGridTableDndRow<TData>({ row }: { row: Row<TData> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };
  return (
    <DataGridTableBodyRow row={row} dndRef={setNodeRef} dndStyle={style} key={row.id}>
      {row.getVisibleCells().map((cell: Cell<TData, unknown>, colIndex) => {
        return (
          <DataGridTableBodyRowCell cell={cell} key={colIndex}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </DataGridTableBodyRowCell>
        );
      })}
    </DataGridTableBodyRow>
  );
}

function DataGridTableDndRows<TData>({
  handleDragEnd,
  dataIds,
}: {
  handleDragEnd: (event: DragEndEvent) => void;
  dataIds: UniqueIdentifier[];
}) {
  const { table, isLoading, props } = useDataGrid();
  const pagination = table.getState().pagination;

  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

  return (
    <DndContext
      id={useId()}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="relative">
        <DataGridTableBase>
          <DataGridTableHead>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>, index) => {
              return (
                <DataGridTableHeadRow headerGroup={headerGroup} key={index}>
                  {headerGroup.headers.map((header, index) => {
                    const { column } = header;

                    return (
                      <DataGridTableHeadRowCell header={header} key={index}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        {props.tableLayout?.columnsResizable && column.getCanResize() && (
                          <DataGridTableHeadRowCellResize header={header} />
                        )}
                      </DataGridTableHeadRowCell>
                    );
                  })}
                </DataGridTableHeadRow>
              );
            })}
          </DataGridTableHead>

          {(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && <DataGridTableRowSpacer />}

          <DataGridTableBody>
            {props.loadingMode === 'skeleton' && isLoading && pagination?.pageSize ? (
              Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
                <DataGridTableBodyRowSkeleton key={rowIndex}>
                  {table.getVisibleFlatColumns().map((column, colIndex) => {
                    return (
                      <DataGridTableBodyRowSkeletonCell column={column} key={colIndex}>
                        {column.columnDef.meta?.skeleton}
                      </DataGridTableBodyRowSkeletonCell>
                    );
                  })}
                </DataGridTableBodyRowSkeleton>
              ))
            ) : table.getRowModel().rows.length ? (
              <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                {table.getRowModel().rows.map((row: Row<TData>) => {
                  return <DataGridTableDndRow row={row} key={row.id} />;
                })}
              </SortableContext>
            ) : (
              <DataGridTableEmpty />
            )}
          </DataGridTableBody>
        </DataGridTableBase>
      </div>
    </DndContext>
  );
}

// =================================================================
// 9. CONSOLIDATED EXPORTS
// =================================================================
export {
  // Core
  DataGrid,
  DataGridProvider,
  useDataGrid,
  DataGridContainer,
  // Table Components
  DataGridTable,
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableBodyRow,
  DataGridTableBodyRowCell,
  DataGridTableBodyRowExpandded,
  DataGridTableBodyRowSkeleton,
  DataGridTableBodyRowSkeletonCell,
  DataGridTableEmpty,
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableLoader,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
  DataGridTableRowSpacer,
  // UI Components
  DataGridPagination,
  DataGridColumnHeader,
  DataGridColumnFilter,
  DataGridColumnVisibility,
  // DND Variants
  DataGridTableDnd,
  DataGridTableDndRowHandle,
  DataGridTableDndRows,
};