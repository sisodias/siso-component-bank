"use client";

import React from "react";
import { MoreHorizontal, Star, Plus, Edit2, Trash } from "lucide-react";

interface TableData {
  name: string;
  email: string;
  role: string;
  roleVariant: "default" | "secondary" | "destructive" | "outline";
}

const roleStyles: Record<string, string> = {
  Engineering: "bg-[#DBEAFE] text-[#1E40AF]",
  Design: "bg-[#FEF9C3] text-[#854D0E]",
  Product: "bg-[#DCFCE7] text-[#166534]",
};

const tableData: TableData[] = [
  {
    name: "John Walton",
    email: "john.walton@example.com",
    role: "Engineering",
    roleVariant: "default",
  },
  {
    name: "Sarah Chandler",
    email: "sarah.chandler@example.com",
    role: "Design",
    roleVariant: "secondary",
  },
  {
    name: "Susan Best",
    email: "susan.best@example.com",
    role: "Product",
    roleVariant: "outline",
  },
];

export default function TableExample() {
  return (
    <div className="px-4 w-full rounded-lg border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
            <th className="w-[50px] px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">
                <span className="whitespace-nowrap font-semibold text-[#374151]">
                  {row.name}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="whitespace-nowrap text-[#737373]">
                  {row.email}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${roleStyles[row.role]}`}>
                  {row.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end">
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}