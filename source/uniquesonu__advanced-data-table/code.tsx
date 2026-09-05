import React, { useState, useMemo } from 'react';

const DataTable = ({
  data = [],
  columns = [],
  pageSize = 10,
  searchable = true,
  sortable = true,
  selectable = false,
  onRowSelect = () => {},
  onSort = () => {},
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter(row =>
      columns.some(column => {
        const value = row[column.key];
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  }, [data, columns, searchQuery]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      
      if (sortConfig.direction === 'asc') {
        return aString.localeCompare(bString);
      } else {
        return bString.localeCompare(aString);
      }
    });
  }, [filteredData, sortConfig]);

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (columnKey) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === columnKey && sortConfig.direction === 'desc') {
      direction = null;
    }

    const newSortConfig = direction ? { key: columnKey, direction } : { key: null, direction: null };
    setSortConfig(newSortConfig);
    onSort(newSortConfig);
  };

  const handleRowSelect = (rowId, isSelected) => {
    const newSelectedRows = new Set(selectedRows);
    if (isSelected) {
      newSelectedRows.add(rowId);
    } else {
      newSelectedRows.delete(rowId);
    }
    setSelectedRows(newSelectedRows);
    onRowSelect(Array.from(newSelectedRows));
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const allIds = new Set(paginatedData.map((_, index) => index));
      setSelectedRows(allIds);
      onRowSelect(Array.from(allIds));
    } else {
      setSelectedRows(new Set());
      onRowSelect([]);
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortConfig.direction === 'asc') {
      return (
        <svg className="w-3 h-3 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-3 h-3 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  const formatCellValue = (value, column) => {
    if (column.render) {
      return column.render(value);
    }
    
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }
    
    if (column.type === 'currency' && typeof value === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    }
    
    if (column.type === 'number' && typeof value === 'number') {
      return new Intl.NumberFormat().format(value);
    }
    
    return value;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">
            Data Table
          </h3>
          <p className="text-sm text-muted-foreground">
            {sortedData.length} {sortedData.length === 1 ? 'item' : 'items'} total
            {selectedRows.size > 0 && ` • ${selectedRows.size} selected`}
          </p>
        </div>
        
        {searchable && (
          <div className="relative w-64">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {selectable && (
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-input"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-3 text-left">
                    <div
                      className={`flex items-center gap-2 text-sm font-medium text-foreground ${
                        sortable && column.sortable !== false ? 'cursor-pointer hover:text-foreground/80' : ''
                      }`}
                      onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                    >
                      {column.title}
                      {sortable && column.sortable !== false && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="space-y-2">
                      <div className="text-2xl">📊</div>
                      <p className="text-sm">
                        {searchQuery ? `No results found for "${searchQuery}"` : 'No data available'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr key={row.id || index} className="border-t hover:bg-muted/20 transition-colors">
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(index)}
                          onChange={(e) => handleRowSelect(index, e.target.checked)}
                          className="rounded border-input"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-sm text-foreground">
                        {formatCellValue(row[column.key], column)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-8 w-8 ${
                      currentPage === pageNum
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Professional demo component
const DataTableDemo = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({});
  const [theme, setTheme] = useState('light');

  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-15', salary: 75000 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active', lastLogin: '2024-01-14', salary: 65000 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Developer', status: 'Inactive', lastLogin: '2024-01-10', salary: 70000 },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Designer', status: 'Active', lastLogin: '2024-01-16', salary: 60000 },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Developer', status: 'Active', lastLogin: '2024-01-15', salary: 72000 },
    { id: 6, name: 'Diana Miller', email: 'diana@example.com', role: 'Manager', status: 'Active', lastLogin: '2024-01-13', salary: 68000 },
    { id: 7, name: 'Eve Davis', email: 'eve@example.com', role: 'Developer', status: 'Inactive', lastLogin: '2024-01-08', salary: 71000 },
    { id: 8, name: 'Frank Garcia', email: 'frank@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-16', salary: 80000 },
    { id: 9, name: 'Grace Martinez', email: 'grace@example.com', role: 'Designer', status: 'Active', lastLogin: '2024-01-14', salary: 62000 },
    { id: 10, name: 'Henry Rodriguez', email: 'henry@example.com', role: 'Developer', status: 'Active', lastLogin: '2024-01-12', salary: 69000 },
    { id: 11, name: 'Ivy Lopez', email: 'ivy@example.com', role: 'Manager', status: 'Active', lastLogin: '2024-01-15', salary: 67000 },
    { id: 12, name: 'Jack Anderson', email: 'jack@example.com', role: 'Developer', status: 'Inactive', lastLogin: '2024-01-09', salary: 73000 }
  ];

  const columns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { 
      key: 'role', 
      title: 'Role', 
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
          value === 'Manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          value === 'Developer' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'status', 
      title: 'Status', 
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'lastLogin', title: 'Last Login', type: 'date', sortable: true },
    { key: 'salary', title: 'Salary', type: 'currency', sortable: true }
  ];

  const handleRowSelect = (rows) => {
    setSelectedRows(rows);
    console.log('Selected rows:', rows);
  };

  const handleSort = (config) => {
    setSortConfig(config);
    console.log('Sort config:', config);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <style jsx global>{`
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 222.2 84% 4.9%;
          --primary: 222.2 47.4% 11.2%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96%;
          --accent-foreground: 222.2 47.4% 11.2%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 222.2 47.4% 11.2%;
          --radius: 0.5rem;
        }
        
        .dark {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --primary: 210 40% 98%;
          --primary-foreground: 222.2 47.4% 11.2%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 212.7 26.8% 83.9%;
        }
        
        * {
          border-color: hsl(var(--border));
        }
        
        body {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        
        .bg-background { background-color: hsl(var(--background)); }
        .text-foreground { color: hsl(var(--foreground)); }
        .bg-card { background-color: hsl(var(--card)); }
        .text-card-foreground { color: hsl(var(--card-foreground)); }
        .bg-muted { background-color: hsl(var(--muted)); }
        .text-muted-foreground { color: hsl(var(--muted-foreground)); }
        .bg-primary { background-color: hsl(var(--primary)); }
        .text-primary-foreground { color: hsl(var(--primary-foreground)); }
        .border-input { border-color: hsl(var(--input)); }
        .border-border { border-color: hsl(var(--border)); }
        .bg-muted\\/50 { background-color: hsl(var(--muted) / 0.5); }
        .bg-muted\\/20 { background-color: hsl(var(--muted) / 0.2); }
        .hover\\:bg-muted\\/20:hover { background-color: hsl(var(--muted) / 0.2); }
        .hover\\:text-foreground\\/80:hover { color: hsl(var(--foreground) / 0.8); }
        .hover\\:bg-accent:hover { background-color: hsl(var(--accent)); }
        .hover\\:text-accent-foreground:hover { color: hsl(var(--accent-foreground)); }
        .focus\\:ring-ring:focus { --tw-ring-color: hsl(var(--ring)); }
        .focus\\:ring-offset-background:focus { --tw-ring-offset-color: hsl(var(--background)); }
      `}</style>

      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
            <p className="text-muted-foreground mt-2">
              Manage and view employee information with advanced filtering and sorting
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
          >
            {theme === 'light' ? '🌙' : '☀️'}
            <span className="ml-2 text-xs">
              {theme === 'light' ? 'Dark' : 'Light'} Mode
            </span>
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <DataTable
            data={sampleData}
            columns={columns}
            pageSize={8}
            searchable={true}
            sortable={true}
            selectable={true}
            onRowSelect={handleRowSelect}
            onSort={handleSort}
          />
        </div>

        {/* Summary */}
        {selectedRows.length > 0 && (
          <div className="mt-6 p-4 bg-muted/20 border rounded-lg">
            <h3 className="text-sm font-medium mb-2">Selected Rows</h3>
            <p className="text-xs text-muted-foreground">
              {selectedRows.length} row{selectedRows.length !== 1 ? 's' : ''} selected. 
              You can now perform bulk actions on these items.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTableDemo;