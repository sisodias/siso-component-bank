"use client";
import React, { useState, useMemo } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Pending" | "Banned";
  createdAt: string;
};

const generateMockData = (count: number): User[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: ["Active", "Pending", "Banned"][Math.floor(Math.random() * 3)] as
      | "Active"
      | "Pending"
      | "Banned",
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 1e10)
    )
      .toISOString()
      .split("T")[0],
  }));

export function UltraQualityDataTable() {
  const [data] = useState<User[]>(() => generateMockData(125));
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    if (!search) return data;
    const term = search.toLowerCase();
    return data.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );
  }, [data, search]);

  const sorted = useMemo(() => {
    if (!sortConfig) return filtered;
    const { key, direction } = sortConfig;
    return [...filtered].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortConfig]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage]);

  const totalPages = Math.ceil(sorted.length / pageSize);

  const requestSort = (key: keyof User) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof User) => {
    if (!sortConfig || sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full sm:w-64 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 dark:border-gray-700"
          aria-label="Search users"
        />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {paginated.length} of {filtered.length} entries
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {["name", "email", "status", "createdAt"].map((col) => (
                <th
                  key={col}
                  scope="col"
                  onClick={() => requestSort(col as keyof User)}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                >
                  <span className="inline-flex items-center">
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                    <span className="ml-1 text-xs">
                      {getSortIndicator(col as keyof User)}
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginated.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {user.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : user.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() =>
            setCurrentPage((p) => Math.max(1, p - 1))
          }
          disabled={currentPage === 1}
          className="px-3 py-1 bg-indigo-500 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((p) => Math.min(totalPages, p + 1))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-indigo-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
