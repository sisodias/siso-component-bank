"use client";

import * as React from "react";

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFnOption,
  PaginationState,
  Row,
  SortingState,
  Table as TableData,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  addHours,
  addMinutes,
  format,
  getYear,
  isSameYear,
  isWithinInterval,
} from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import {
  CalendarIcon,
  CalendarRangeIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CircleCheckIcon,
  FilterIcon,
  ListFilterIcon,
  LucideIcon,
  SearchIcon,
  SquareCheckIcon,
  XIcon,
} from "lucide-react";

// --------------- TYPES DEFINITION --------------- //
interface Controls {
  pagination?: boolean;
  sorting?: boolean;
}

interface DataTable<Data, Value> {
  columns: ColumnDef<Data, Value>[];
  data: Data[];
  controls?: Controls;
  globalFilter?: FilterFnOption<Data>;
  children?:
    | React.ReactNode
    | ((props: { table: TableData<Data> }) => React.ReactNode);
}

// Data Table Controls Type Definition
export interface DataTableControls<T> extends React.ComponentProps<"div"> {
  table: TableData<T>;
  search?: boolean;
}

// Data Table Filter Type Definition
export type FilterVariant = keyof typeof customFilterFns;

export type FilterMap<T> = Record<FilterVariant, FilterMapItem<T>>;

export interface FilterComponent<T> extends React.ComponentProps<"button"> {
  column: Column<T>;
  data?: string[];
  label?: string;
  standalone?: boolean;
}

export interface FilterMapItem<T> {
  icon: LucideIcon;
  component: (
    props: FilterComponent<T> & React.ComponentProps<"button">,
  ) => React.ReactNode;
}

export interface FilterContext<T> {
  state: keyof T | undefined;
  setState: React.Dispatch<React.SetStateAction<keyof T | undefined>>;
  filters: FilterVariant[];
  clearFilter: (column: Column<T>) => void;
  isFilterActive: (column: Column<T>) => boolean;
  formatFilterName: (column: Column<T>) => FilterVariant;
}

export interface DataFilterExtended<T> {
  id: keyof T;
  label?: string;
  data?: string[];
  detached?: boolean;
}

export interface GroupedFilter<T> {
  extend?: DataFilterExtended<T>[];
}

export interface StandaloneFilter<T> {
  filter: keyof T;
  label?: string;
  data?: string[];
}

export interface BaseFilter<T> extends React.ComponentProps<"button"> {
  table: TableData<T>;
  standalone?: boolean;
}

export type DataTableFilter<T> = BaseFilter<T> &
  (GroupedFilter<T> | StandaloneFilter<T>);


// --------------- CUSTOM FILTER FUNCTIONS --------------- //

/**
 * Custom filter functions list.
 *
 * @description
 * - define filter name as key with it's filterFn as value.
 * - pass in `filterFns` at useReactTable options.
 */
export const customFilterFns = {
  checkbox: checkboxFilter,
  radio: radioFilter,
  "date-range": dateRangeFilter,
  "date-year": dateYearFilter,
};

function checkboxFilter<T>(
  row: Row<T>,
  columnId: string,
  filterValue: string[],
): boolean {
  if (!filterValue?.length) return true;
  const column = row.getValue(columnId) as string;
  return filterValue.includes(column);
}

function radioFilter<T>(row: Row<T>, columnId: string, filterValue: string): boolean {
  if (!filterValue) return true;
  const column = String(row.getValue(columnId));
  return String(filterValue) === column;
}

function dateRangeFilter<T>(
  row: Row<T>,
  columnId: string,
  filterValue: string[],
): boolean {
  if (!filterValue || filterValue.length !== 2) return true;

  const rowDate = new Date(row.getValue(columnId) as string);
  const from = new Date(filterValue[0]);
  const to = new Date(filterValue[1]);

  return isWithinInterval(rowDate, { start: from, end: to });
}

function dateYearFilter<T>(
  row: Row<T>,
  columnId: string,
  filterValue: string | undefined,
) {
  if (!filterValue) return true;
  const rowYear = new Date(row.getValue(columnId) as string);
  const selectedYear = new Date(Number(filterValue), 1, 1);
  return isSameYear(rowYear, selectedYear);
}

// --------------- UTILS --------------- //
export function camelToKebab(str: string | undefined) {
  return str
    ? str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    : "";
}

// --------------- FILTER CONTEXT --------------- //

const FilterContext = React.createContext<FilterContext<any> | null>(null);

/**
 * @function hooks for filter context
 *
 * @property
 * - `state` current active filter for grouped filter
 * - `filters` list of filter variant based on `utils.ts`
 * - `clearFilter` reset filter value column
 * - `isFilterActive` check if column is filtering
 * - `formatFilterName` format column filter name to match custom `filters`
 */
export function useFilter<T>() {
  const context = React.useContext(FilterContext);

  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider.");
  }

  return context as FilterContext<T>;
}

/** FilterContext provider */
export function FilterProvider<T>({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<keyof T>();

  // Get all filter variant based on `utils.ts`
  const filters = React.useMemo<FilterVariant[]>(() => {
    return Object.keys(customFilterFns) as FilterVariant[];
  }, []);

  // Check if column is filtering
  const isFilterActive = React.useCallback((column: Column<T>) => {
    return column.getFilterValue() !== undefined;
  }, []);

  // Format column filter name to match custom `filters`
  const formatFilterName = React.useCallback((column: Column<T>) => {
    const filterFnName = column?.getFilterFn()?.name ?? "unknown";
    const formatName = camelToKebab(filterFnName) as FilterVariant;
    return formatName;
  }, []);

  // Reset filter value column
  const clearFilter = React.useCallback((column: Column<T>) => {
    setState(undefined);
    column.setFilterValue(undefined);
  }, []);

  const contextValue = React.useMemo<FilterContext<T>>(
    () => ({
      state,
      setState,
      filters,
      clearFilter,
      isFilterActive,
      formatFilterName,
    }),
    [state, setState, filters, clearFilter, isFilterActive, formatFilterName],
  );

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}


// --------------- FILTER COMPONENTS --------------- //
// based on filter function definitions.

export function DateYearFilter<T>(props: FilterComponent<T>) {
  const { column, label, data, standalone, className, ...rest } = props;

  const { setState, clearFilter, isFilterActive } = useFilter<T>();
  const [open, setOpen] = React.useState(false);

  // check is filter active
  const isFiltering = isFilterActive(column);

  // get unique year values from exist data
  const facetedUniqueValues = column.getFacetedUniqueValues();
  const uniqueValues = React.useMemo(() => {
    if (!facetedUniqueValues) return [];

    const years = Array.from(facetedUniqueValues.keys()).map((date) => {
      return getYear(new Date(date));
    });

    const uniqueYears = [...new Set(years)];
    return uniqueYears.sort((a, b) => b - a);
  }, [facetedUniqueValues]);

  // use custom data if exist
  const mapData = data ?? uniqueValues;

  function Filter<T>({
    column,
    data,
  }: {
    column: Column<T>;
    data: string[] | number[];
  }) {
    return (
      <RadioGroup
        value={column.getFilterValue() as string}
        onValueChange={(value: string) => column.setFilterValue(value)}
        data-large={data.length >= 10}
        className="grid gap-2 data-[large=true]:grid-cols-2"
      >
        {data.map((item, key) => (
          <Label
            key={key}
            htmlFor={key.toString()}
            className="flex select-none gap-2 capitalize"
          >
            <RadioGroupItem value={item.toString()} id={key.toString()} />
            <span>{item}</span>
          </Label>
        ))}
      </RadioGroup>
    );
  }

  if (standalone) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("capitalize", className)}
            {...rest}
          >
            <div
              data-active={isFiltering}
              className="after:bg-primary relative after:absolute after:-end-px after:top-px after:size-1.5 after:rounded-full data-[active=false]:after:hidden dark:after:bg-teal-600"
            >
              <CalendarIcon className="text-muted-foreground" />
            </div>
            <span>{label ?? column.id}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="group !w-fit !min-w-32 !gap-2 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-foreground/90 text-xs">Filter</span>
            <button
              onClick={() => {
                clearFilter(column);
                setOpen(false);
              }}
              disabled={!isFiltering}
              className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:cursor-pointer not-disabled:hover:underline text-xs underline-offset-2"
            >
              Reset
            </button>
          </div>
          <Separator className="my-1" />
          <Filter column={column} data={mapData} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-fit gap-1 rounded-sm py-0.5 !pe-2 !ps-0.5"
          onClick={() => setState(undefined)}
        >
          <ChevronLeftIcon className="size-3" />
          <span className="text-xs capitalize">Tahun</span>
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={() => clearFilter(column)}
          disabled={!isFiltering}
          className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:hover:underline not-disabled:cursor-pointer h-5 rounded-sm px-1 py-0 text-xs underline-offset-2"
        >
          Reset
        </Button>
      </div>
      <Separator className="mb-1" />
      <Filter column={column} data={mapData} />
    </>
  );
}

export function DateRangeFilter<T>(props: FilterComponent<T>) {
  const { column, label, standalone } = props;
  const { setState, clearFilter, isFilterActive } = useFilter<T>();

  const [date, setDate] = React.useState<DateRange | undefined>();

  // check is filter active
  const isFiltering = isFilterActive(column);

  const filterValue = column.getFilterValue() as string[];

  // get date range from filter value
  const from = filterValue?.[0] ? new Date(filterValue[0]) : undefined;
  const to = filterValue?.[1] ? new Date(filterValue[1]) : undefined;

  // get date range object
  const formatDate = {
    from: isNaN(from?.getTime() || NaN) ? undefined : from,
    to: isNaN(to?.getTime() || NaN) ? undefined : to,
  };

  function handleDateChange(selectedDate: DateRange | undefined) {
    column.setFilterValue(
      selectedDate?.from && selectedDate?.to
        ? [selectedDate.from, addMinutes(addHours(selectedDate.to, 23), 59)]
        : undefined,
    );
  }

  if (standalone) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="capitalize">
            <div
              data-active={isFiltering}
              className="after:bg-primary relative after:absolute after:-end-px after:top-px after:size-1.5 after:rounded-full data-[active=false]:after:hidden dark:after:bg-teal-600"
            >
              <CalendarRangeIcon className="text-muted-foreground" />
            </div>
            <span className="truncate">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                (label ?? "Tanggal")
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-3">
          <div className="flex items-center justify-between">
            <span className="text-foreground/90 text-xs">Filter</span>
            <button
              onClick={() => {
                clearFilter(column);
                setDate(undefined);
              }}
              disabled={!isFiltering}
              className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:cursor-pointer not-disabled:hover:underline text-xs underline-offset-2"
            >
              Reset
            </button>
          </div>
          <Separator className="my-1" />
          <Calendar
            mode="range"
            selected={date}
            onSelect={(e) => {
              setDate(e);
              handleDateChange(e);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-fit gap-1 rounded-sm py-0.5 !pe-2 !ps-0.5"
          onClick={() => setState(undefined)}
        >
          <ChevronLeftIcon className="size-3" />
          <span className="text-xs capitalize">Tanggal</span>
        </Button>

        <Button
          variant="link"
          size="sm"
          onClick={() => clearFilter(column)}
          disabled={!from && !to}
          className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:hover:underline not-disabled:cursor-pointer h-5 rounded-sm px-1 py-0 text-xs underline-offset-2"
        >
          Reset
        </Button>
      </div>
      <Separator />
      <Calendar
        mode="range"
        selected={date}
        onSelect={(e) => handleDateChange(e)}
        defaultMonth={formatDate.from ?? formatDate.to ?? new Date()}
      />
    </>
  );
}

export function RadioFilter<T>(props: FilterComponent<T>) {
  const { column, data, label, standalone, className, ...rest } = props;
  const { setState, clearFilter, isFilterActive } = useFilter<T>();

  const [open, setOpen] = React.useState(false);

  // check is filter active
  const isFiltering = isFilterActive(column);

  // get unique values from exist data
  const facetedUniqueValues = column.getFacetedUniqueValues();
  const uniqueValues = React.useMemo(() => {
    if (!facetedUniqueValues) return [];
    const values = Array.from(facetedUniqueValues.keys());
    return values.sort();
  }, [facetedUniqueValues]);

  // use custom data if exist
  const mapData = data ?? uniqueValues;

  function Filter<T>({ column, data }: { column: Column<T>; data: string[] }) {
    return (
      <RadioGroup
        value={column.getFilterValue() as string}
        onValueChange={(value: string) => column.setFilterValue(value)}
        data-large={data.length >= 10}
        className="grid gap-2.5 data-[large=true]:grid-cols-2"
      >
        {data.map((item, key) => (
          <Label
            key={key}
            htmlFor={key.toString()}
            className="flex select-none gap-2 capitalize"
          >
            <RadioGroupItem value={item} id={key.toString()} />
            <span>{item}</span>
          </Label>
        ))}
      </RadioGroup>
    );
  }

  if (standalone) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("capitalize", className)}
            {...rest}
          >
            <div
              data-active={isFiltering}
              className="after:bg-primary relative after:absolute after:-end-px after:top-px after:size-1.5 after:rounded-full data-[active=false]:after:hidden dark:after:bg-teal-600"
            >
              <FilterIcon className="text-muted-foreground" />
            </div>
            <span>{label ?? column.id}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="group !w-fit !min-w-32 !gap-2 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-foreground/90 text-xs">Filter</span>
            <button
              onClick={() => {
                clearFilter(column);
                setOpen(false);
              }}
              disabled={!isFiltering}
              className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:cursor-pointer not-disabled:hover:underline text-xs underline-offset-2"
            >
              Reset
            </button>
          </div>
          <Separator className="my-1" />
          <Filter column={column} data={mapData} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-fit gap-1 rounded-sm py-0.5 !pe-2 !ps-0.5"
          onClick={() => setState(undefined)}
        >
          <ChevronLeftIcon className="size-3" />
          <span className="text-xs capitalize">{label ?? column.id}</span>
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={() => clearFilter(column)}
          disabled={column.getFilterValue() === undefined}
          className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:hover:underline not-disabled:cursor-pointer h-5 rounded-sm px-1 py-0 text-xs underline-offset-2"
        >
          Reset
        </Button>
      </div>
      <Separator className="mb-1" />
      <Filter column={column} data={mapData} />
    </>
  );
}

export function CheckboxFilter<T>(props: FilterComponent<T>) {
  const { column, data, label, standalone, className, ...rest } = props;
  const { setState, clearFilter, isFilterActive } = useFilter<T>();

  const [open, setOpen] = React.useState(false);

  // check is filter active
  const isFiltering = isFilterActive(column);

  // get current filter value
  const filterValue = column.getFilterValue() as string[];

  // get unique values from exist data
  const facetedUniqueValues = column.getFacetedUniqueValues();
  const uniqueValues = React.useMemo(() => {
    if (!facetedUniqueValues) return [];
    const values = Array.from(facetedUniqueValues.keys());
    return values.sort();
  }, [facetedUniqueValues]);

  // get current selected filter value
  const selectedValue = React.useMemo(() => {
    return filterValue ?? [];
  }, [filterValue]);

  // use custom data if exist
  const mapData = data ?? uniqueValues;

  function Filter<T>({
    column,
    data,
    selected,
  }: {
    column: Column<T>;
    data: string[];
    selected: string[];
  }) {
    const handleCheckboxChange = (checked: boolean, value: string) => {
      const filterValue = column.getFilterValue() as string[];
      const newFilterValue = Array.isArray(filterValue) ? [...filterValue] : [];

      if (checked) {
        newFilterValue.push(value);
      } else {
        const index = newFilterValue.indexOf(value);
        newFilterValue.splice(index, 1);
      }

      column.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
    };

    return (
      <div
        data-large={data.length >= 10}
        className="grid gap-2 data-[large=true]:grid-cols-2"
      >
        {data.map((item, key) => (
          <Label
            key={key}
            htmlFor={item}
            className="flex select-none gap-2 capitalize"
          >
            <Checkbox
              id={item}
              checked={selected.includes(item)}
              onCheckedChange={(checked: boolean) => {
                handleCheckboxChange(checked, item);
              }}
            />
            <span>{item}</span>
          </Label>
        ))}
      </div>
    );
  }

  if (standalone) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("capitalize", className)}
            {...rest}
          >
            <div
              data-active={isFiltering}
              className="after:bg-primary relative after:absolute after:-end-px after:top-px after:size-1.5 after:rounded-full data-[active=false]:after:hidden dark:after:bg-teal-600"
            >
              <FilterIcon className="text-muted-foreground" />
            </div>
            <span>{label ?? column.id}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="group !w-fit !min-w-32 !gap-2 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-foreground/90 text-xs">Filter</span>
            <button
              onClick={() => {
                clearFilter(column);
                setOpen(false);
              }}
              disabled={!isFiltering}
              className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:cursor-pointer not-disabled:hover:underline text-xs underline-offset-2"
            >
              Reset
            </button>
          </div>
          <Separator className="my-1" />
          <Filter column={column} data={mapData} selected={selectedValue} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 gap-1 rounded-sm py-0.5 !pe-2 !ps-0.5"
          onClick={() => setState(undefined)}
        >
          <ChevronLeftIcon className="size-3" />
          <span className="text-xs capitalize">{label ?? column.id}</span>
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={() => clearFilter(column)}
          disabled={selectedValue.length === 0}
          className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:hover:underline not-disabled:cursor-pointer h-5 rounded-sm px-1 py-0 text-xs underline-offset-2"
        >
          Reset
        </Button>
      </div>
      <Separator className="mb-1" />
      <Filter column={column} data={mapData} selected={selectedValue} />
    </>
  );
}

// --------------- CORE --------------- //

/**
 * Define each filter component based on filter variant
 * @returns components, icon
 */
function filterMap<T>(variant?: FilterVariant) {
  const filterComponents: FilterMap<T> = {
    checkbox: { component: CheckboxFilter, icon: SquareCheckIcon },
    radio: { component: RadioFilter, icon: CircleCheckIcon },
    "date-range": { component: DateRangeFilter, icon: CalendarRangeIcon },
    "date-year": { component: DateYearFilter, icon: CalendarIcon },
  };

  return variant ? filterComponents[variant] : filterComponents;
}

/**
 * @function Filter list for grouped filter
 * @description Manage filter state to show active filter component on popover
 */
function GroupedFilter<T>(props: FilterComponent<T>) {
  const { column, data, label } = props;
  const { state, setState, isFilterActive, formatFilterName } = useFilter<T>();

  // get current filter value
  const filterValue = column.getFilterValue();
  const isFiltering = isFilterActive(column);

  const selectedValue = React.useMemo(() => {
    return Array.isArray(filterValue) ? filterValue : [];
  }, [filterValue]);

  const filterText: Record<FilterVariant, string> = {
    checkbox: column.id,
    radio: column.id,
    "date-range": "Tanggal",
    "date-year": "Tahun",
  };

  // get and check column filter name match {filters}
  const filterKey = formatFilterName(column);

  // define filter components and icon
  const filterComponents = filterMap<T>() as FilterMap<T>;
  const Icon = filterComponents[filterKey].icon;
  const Component = filterComponents[filterKey].component;

  // active state not match this filter
  if (state && state !== column.id) return null;

  // return active filter component
  if (state === column.id) {
    return <Component column={column} data={data} label={label} />;
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-7 justify-start !ps-2 text-sm"
      onClick={() => setState(column.id as keyof T)}
    >
      <Icon className="text-muted-foreground size-4" />
      <span className="capitalize">{label ?? filterText[filterKey]}</span>

      {isFiltering && (
        <span className="text-primary max-w-18 -me-1 ms-auto line-clamp-1 inline-flex h-5 max-h-full items-center rounded px-1 font-[inherit] text-xs capitalize dark:text-teal-600">
          {filterKey === "checkbox"
            ? `${selectedValue.length} dipilih`
            : "Dipilih"}
        </span>
      )}
    </Button>
  );
}

function FilterComponent<T>(props: DataTableFilter<T>) {
  const { table, standalone = false, className, ...rest } = props;
  const { state, setState, filters, formatFilterName, isFilterActive } =
    useFilter<T>();

  const [open, setOpen] = React.useState(false);

  // separate props
  const { extend } = props as GroupedFilter<T>;
  const { filter: filterKey, label, data } = props as StandaloneFilter<T>;

  const detachedColumns = extend?.filter((item) => item.detached) ?? [];
  let excludeColumns = ["actions"];

  // exclude columns from detached extend data
  if (extend) {
    excludeColumns = excludeColumns.concat(
      detachedColumns.map((item) => item.id) as string[],
    );
  }

  /**
   * Get all columns from table.
   * except includes in `excludeColumns` and filter name includes in `filters`
   */
  const columns = table
    .getAllColumns()
    .filter((column) => !excludeColumns.includes(column.id))
    .filter((column) => {
      const filterKey = formatFilterName(column);
      return filters.includes(filterKey);
    });

  React.useEffect(() => {
    if (!open) setState(undefined); // back to filter list view if popover closed
  }, [open, setState]);

  // get standalone column
  const standaloneColumn = columns.find((column) => column.id === filterKey);

  if (standalone && standaloneColumn) {
    // get and check column filter name match {filters}
    const filterKey = formatFilterName(standaloneColumn);

    // get filter components
    const filterComponents = filterMap<T>(filterKey) as FilterMapItem<T>;
    const Component = filterComponents.component;

    return (
      <Component
        column={standaloneColumn!}
        data={data}
        label={label}
        className={className}
        standalone
        {...rest}
      />
    );
  }

  // check if some column is filtering
  const isFiltering = columns.some((column) => isFilterActive(column));

  // reset filter columns in used
  function resetColumnsFilter() {
    columns.forEach((column) => column.setFilterValue(undefined));
  }

  // get extend data fn
  function extendItems<T>(column: Column<T>) {
    return extend?.find((item) => item.id === column.id);
  }

  if (columns.length === 0) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className} {...rest}>
          <div
            data-active={isFiltering}
            className="after:bg-primary relative after:absolute after:-end-px after:top-px after:size-1.5 after:rounded-full data-[active=false]:after:hidden dark:after:bg-teal-600"
          >
            <ListFilterIcon className="text-muted-foreground" />
          </div>
          <span className="@2xl:not-sr-only text-foreground sr-only">
            Filter
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="group flex !w-max !min-w-52 flex-col !gap-1 p-2"
      >
        {!state && (
          <>
            <div className="flex items-center justify-between px-1 pt-0.5">
              <div className="text-foreground/90 text-xs">Pilih Filter</div>
              <button
                onClick={resetColumnsFilter}
                disabled={!isFiltering}
                className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:cursor-pointer not-disabled:hover:underline text-xs underline-offset-2"
              >
                Reset
              </button>
            </div>
            <Separator className="my-0.5" />
          </>
        )}
        {columns.map((column, i) => (
          <GroupedFilter
            key={i}
            column={column}
            data={extendItems(column)?.data ?? undefined}
            label={extendItems(column)?.label ?? undefined}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}

export function DataTableFilter<T>(props: DataTableFilter<T>) {
  return (
    <FilterProvider>
      <FilterComponent {...props} />
    </FilterProvider>
  );
}

export function DataTablePaginations<TData>(props: {
  table: TableData<TData>;
}) {
  const { table } = props;
  const pageSizeOpt = [5, 10, 20];

  return (
    <div className="flex items-center justify-between gap-8">
      {/* Results per page */}
      <div className="flex items-center gap-3">
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => {
            localStorage.setItem("pageSize", value);
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="w-fit whitespace-nowrap">
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
            {pageSizeOpt.map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Label className="max-sm:sr-only">Baris per halaman</Label>
      </div>

      {/* Page number information */}
      <div className="text-muted-foreground flex grow justify-end whitespace-nowrap text-sm">
        <p
          className="text-muted-foreground whitespace-nowrap text-sm"
          aria-live="polite"
        >
          <span className="text-foreground">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            {" - "}
            {Math.min(
              Math.max(
                table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  table.getState().pagination.pageSize,
                0,
              ),
              table.getRowCount(),
            )}
          </span>{" "}
          dari{" "}
          <span className="text-foreground">
            {table.getRowCount().toString()}
          </span>
        </p>
      </div>

      {/* Pagination buttons */}
      <div>
        <Pagination>
          <PaginationContent>
            {/* First page button */}
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Go to first page"
              >
                <ChevronsLeftIcon
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
            </PaginationItem>

            {/* Previous page button */}
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Go to previous page"
              >
                <ChevronLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
            </PaginationItem>

            {/* Next page button */}
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Go to next page"
              >
                <ChevronRightIcon
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
            </PaginationItem>

            {/* Last page button */}
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Go to last page"
              >
                <ChevronsRightIcon
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

/**
 * Data Table Toolbar Controls.
 *
 * Include search input for global filtering data.
 * Accept children for additional controls.
 */
export function DataTableControls<T>(props: DataTableControls<T>) {
  const { table, search = true, className, children, ...rest } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);

  const isInputEmpty = inputRef.current
    ? inputRef.current.value.trim() === ""
    : true;

  // reset global filter
  function resetSearch() {
    table.resetGlobalFilter();

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("@container flex w-full gap-3", className)} {...rest}>
      {search && (
        <div className="relative h-full">
          <Input
            ref={inputRef}
            type="search"
            placeholder="Cari data"
            className="@3xl:w-52 bg-card border-border z-10 w-40 pe-6 ps-8"
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          />
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-2.5 flex items-center">
            <SearchIcon className="size-4" />
          </div>
          {!isInputEmpty && (
            <button
              type="button"
              onClick={resetSearch}
              className="text-muted-foreground hover:text-foreground absolute inset-y-0 end-0 flex cursor-pointer items-center px-2"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export function DataTable<Data, Value>(
  props: DataTable<Data, Value> & Omit<React.ComponentProps<"div">, "children">,
) {
  const {
    columns,
    data,
    children,
    controls = { pagination: true, sorting: true },
    className,
    ...rest
  } = props;

  const defaultPageSize = 10;

  const [globalFilter, setGlobalFilter] = React.useState<string>();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [isPageSizeLoaded, setIsPageSizeLoaded] = React.useState(false);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  // load page size from local storage before rendering
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSize = localStorage.getItem("pageSize");
      setPagination((prev) => ({
        ...prev,
        pageSize: storedSize ? Number(storedSize) : defaultPageSize,
      }));
      setIsPageSizeLoaded(true);
    }
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      pagination,
      sorting,
      columnFilters,
      globalFilter,
    },
    filterFns: customFilterFns,
  });

  // don't render if page size is not loaded
  if (!isPageSizeLoaded) return null;

  return (
    <div className="relative w-full space-y-3 overflow-visible">
      {typeof children === "function" ? children({ table }) : children}
      <div
        className={cn(
          "shadow-xs border-border overflow-hidden rounded-lg border",
          className,
        )}
        {...rest}
      >
        <Table className="bg-card">
          <TableHeader className="bg-muted-foreground/10 dark:bg-muted/30 overflow-hidden">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="not-has-[*]:w-14 text-foreground has-[*]:min-w-24"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() &&
                        controls.sorting ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer select-none items-center gap-2",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="px-2">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Data tidak tersedia
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {controls.pagination && <DataTablePaginations table={table} />}
    </div>
  );
}
