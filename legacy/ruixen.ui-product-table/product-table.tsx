"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  VisibilityState,
} from "@tanstack/react-table";

import { Button } from "./button";
import { Input } from "./input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  brand: string;
  model: string;
  weight: string;
  color: string;
  sku: string;
};

const generateDummyData = (): Product[] => {
  return Array.from({ length: 40 }, (_, i) => ({
    id: `P-${i + 1}`,
    name: `Product ${i + 1}`,
    category: ["Electronics", "Clothing", "Books", "Home"][i % 4],
    price: parseFloat((Math.random() * 500).toFixed(2)),
    stock: Math.floor(Math.random() * 100),
    brand: ["Sony", "Samsung", "Apple", "Dell"][i % 4],
    model: `Model-${1000 + i}`,
    weight: `${Math.floor(Math.random() * 5) + 1} kg`,
    color: ["Black", "White", "Gray"][i % 3],
    sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
  }));
};

const columns: ColumnDef<Product>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "brand", header: "Brand" },
  { accessorKey: "model", header: "Model" },
  { accessorKey: "color", header: "Color" },
  { accessorKey: "weight", header: "Weight" },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return `$${price.toFixed(2)}`;
    },
  },
  { accessorKey: "stock", header: "Stock" },
  { accessorKey: "sku", header: "SKU" },
];

export default function ProductTable() {
  const [data, setData] = useState<Product[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    setData(generateDummyData());
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-black">Product Table</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="border border-gray-300 bg-white text-black placeholder-gray-500"
            />
            <Button
              variant="outline"
              onClick={() => {
                const keys = table.getAllLeafColumns().map((col) => col.id);
                setColumnVisibility((prev) =>
                  keys.reduce((acc, key) => {
                    acc[key] = !prev[key];
                    return acc;
                  }, {} as VisibilityState)
                );
              }}
              className="border border-gray-500 text-gray-800"
            >
              Toggle Columns
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto border border-gray-300 rounded">
          <Table className="w-full table-fixed text-sm text-black">
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap px-2 py-3 border-r border-gray-200">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-2 py-2 border-t border-gray-200 truncate">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-4">
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="text-gray-800 border-gray-400"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="text-gray-800 border-gray-400"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
