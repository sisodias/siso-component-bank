
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sun, 
  Moon, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';

// --- Types ---
export interface Data {
  id: number;
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

export type Order = 'asc' | 'desc';

export interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
  disablePadding: boolean;
}

// --- Data ---
const rows: Data[] = [
  { id: 1, name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
  { id: 2, name: 'Donut', calories: 452, fat: 25.0, carbs: 51, protein: 4.9 },
  { id: 3, name: 'Eclair', calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
  { id: 4, name: 'Frozen yoghurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0 },
  { id: 5, name: 'Gingerbread', calories: 356, fat: 16.0, carbs: 49, protein: 3.9 },
  { id: 6, name: 'Honeycomb', calories: 408, fat: 3.2, carbs: 87, protein: 6.5 },
  { id: 7, name: 'Ice cream sandwich', calories: 237, fat: 9.0, carbs: 37, protein: 4.3 },
  { id: 8, name: 'Jelly Bean', calories: 375, fat: 0.0, carbs: 94, protein: 0.0 },
  { id: 9, name: 'KitKat', calories: 518, fat: 26.0, carbs: 65, protein: 7.0 },
  { id: 10, name: 'Lollipop', calories: 392, fat: 0.2, carbs: 98, protein: 0.0 },
  { id: 11, name: 'Marshmallow', calories: 318, fat: 0, carbs: 81, protein: 2.0 },
  { id: 12, name: 'Nougat', calories: 360, fat: 19.0, carbs: 9, protein: 37.0 },
  { id: 13, name: 'Oreo', calories: 437, fat: 18.0, carbs: 63, protein: 4.0 },
];

const headCells: HeadCell[] = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
  { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
  { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
  { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
  { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
];

// --- Helpers ---
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<T>(
  order: Order,
  orderBy: keyof T,
): (a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// --- Sub-components ---
const MonochromeCheckbox: React.FC<{
  checked: boolean;
  indeterminate?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inverted?: boolean;
}> = ({ checked, indeterminate, onChange, inverted }) => (
  <input
    type="checkbox"
    className={`h-4 w-4 rounded border-2 cursor-pointer transition-all focus:ring-offset-2
      ${inverted 
        ? 'border-white bg-transparent text-white focus:ring-white ring-offset-black dark:ring-offset-white' 
        : 'border-black dark:border-white text-black dark:text-white bg-transparent focus:ring-black dark:focus:ring-white ring-offset-white dark:ring-offset-black'
      }`}
    checked={checked}
    ref={el => {
      if (el) el.indeterminate = !!indeterminate;
    }}
    onChange={onChange}
    onClick={(e) => e.stopPropagation()}
  />
);

const MonochromeSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="group flex items-center space-x-3 focus:outline-none"
  >
    <div
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-black dark:border-white transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-black dark:bg-white' : 'bg-white dark:bg-black'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full ring-0 transition duration-200 ease-in-out ${
          checked 
            ? 'translate-x-4 bg-white dark:bg-black' 
            : 'translate-x-0 bg-black dark:bg-white'
        }`}
      />
    </div>
    <span className="text-xs font-black uppercase tracking-tighter text-black dark:text-white group-hover:underline">
      {label}
    </span>
  </button>
);

// --- Main Table Component ---
const EnhancedTable: React.FC = () => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('calories');
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }
    setSelected(newSelected);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator<Data>(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  );

  const isSelected = (id: number) => selected.indexOf(id) !== -1;
  const numSelected = selected.length;
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const startRange = page * rowsPerPage + 1;
  const endRange = Math.min((page + 1) * rowsPerPage, rows.length);

  return (
    <div className="bg-white dark:bg-[#0a0a0a] shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-lg overflow-hidden border-2 border-black dark:border-white transition-colors duration-300">
      {/* Toolbar */}
      <div className={`px-6 py-6 flex items-center justify-between transition-all duration-300 ${numSelected > 0 ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white text-black dark:bg-[#0a0a0a] dark:text-white'}`}>
        {numSelected > 0 ? (
          <h2 className="text-xl font-bold uppercase tracking-widest">{numSelected} Items Selected</h2>
        ) : (
          <h2 className="text-xl font-bold uppercase tracking-widest">Dessert Menu</h2>
        )}
        <div className="flex items-center space-x-3">
          {numSelected > 0 ? (
            <button className="p-2 hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white rounded-full transition-all border border-transparent hover:border-black dark:hover:border-white" title="Delete">
              <Trash2 className="w-5 h-5" />
            </button>
          ) : (
            <button className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-full transition-all border border-transparent hover:border-black dark:hover:border-white" title="Filter">
              <Filter className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-black dark:divide-white transition-colors duration-300">
          <thead className="bg-white dark:bg-[#0a0a0a] border-b-2 border-black dark:border-white">
            <tr>
              <th className="px-6 py-4 text-left">
                <MonochromeCheckbox
                  indeterminate={numSelected > 0 && numSelected < rows.length}
                  checked={rows.length > 0 && numSelected === rows.length}
                  onChange={handleSelectAllClick}
                />
              </th>
              {headCells.map((headCell) => (
                <th
                  key={headCell.id}
                  className={`px-6 py-4 text-xs font-black uppercase tracking-widest text-black dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 group transition-all ${headCell.numeric ? 'text-right' : 'text-left'}`}
                  onClick={() => handleRequestSort(headCell.id)}
                >
                  <div className={`flex items-center ${headCell.numeric ? 'justify-end' : 'justify-start'}`}>
                    <span>{headCell.label}</span>
                    <span className="ml-2">
                      {orderBy === headCell.id ? (
                        order === 'desc' ? <ChevronDown className="w-4 h-4 stroke-[3]" /> : <ChevronUp className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 opacity-10 group-hover:opacity-100 transition-opacity" />
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#0a0a0a] divide-y divide-gray-200 dark:divide-zinc-800 transition-colors duration-300">
            {visibleRows.map((row) => {
              const selectedItem = isSelected(row.id);
              return (
                <tr
                  key={row.id}
                  onClick={() => handleClick(row.id)}
                  className={`hover:bg-gray-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-all border-l-4 ${selectedItem ? 'bg-gray-100 dark:bg-zinc-800 border-black dark:border-white' : 'border-transparent'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <MonochromeCheckbox
                      checked={selectedItem}
                      onChange={() => handleClick(row.id)}
                    />
                  </td>
                  <td className={`px-6 text-sm font-bold text-black dark:text-white ${dense ? 'py-2' : 'py-5'}`}>
                    {row.name}
                  </td>
                  <td className={`px-6 text-sm font-medium text-gray-900 dark:text-zinc-100 text-right ${dense ? 'py-2' : 'py-5'}`}>{row.calories}</td>
                  <td className={`px-6 text-sm font-medium text-gray-900 dark:text-zinc-100 text-right ${dense ? 'py-2' : 'py-5'}`}>{row.fat}</td>
                  <td className={`px-6 text-sm font-medium text-gray-900 dark:text-zinc-100 text-right ${dense ? 'py-2' : 'py-5'}`}>{row.carbs}</td>
                  <td className={`px-6 text-sm font-medium text-gray-900 dark:text-zinc-100 text-right ${dense ? 'py-2' : 'py-5'}`}>{row.protein}</td>
                </tr>
              );
            })}
            {visibleRows.length < rowsPerPage && (
               <tr style={{ height: (dense ? 40 : 64) * (rowsPerPage - visibleRows.length) }}>
                  <td colSpan={6} className="border-none" />
               </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Controls */}
      <div className="px-6 py-6 flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-[#0a0a0a] border-t-2 border-black dark:border-white space-y-4 sm:space-y-0 transition-colors duration-300">
        <div className="flex items-center space-x-8">
          <MonochromeSwitch
            checked={dense}
            onChange={setDense}
            label="Dense Rows"
          />
          <div className="flex items-center space-x-3">
            <span className="text-xs font-black uppercase tracking-tighter text-black dark:text-white">Display</span>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="text-xs font-bold border-2 border-black dark:border-white rounded-none py-1.5 px-3 focus:bg-black dark:focus:bg-white focus:text-white dark:focus:text-black transition-all bg-white dark:bg-black text-black dark:text-white"
            >
              {[5, 10, 25].map((opt) => (
                <option key={opt} value={opt} className="bg-white dark:bg-black text-black dark:text-white">{opt} Rows</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em]">
            {startRange} <span className="mx-1.5 text-black dark:text-white">—</span> {endRange} <span className="mx-2 text-gray-400 dark:text-zinc-500">OF</span> {rows.length}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleChangePage(0)}
              disabled={page === 0}
              className="p-2 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-20 disabled:hover:bg-transparent rounded-none transition-all border border-transparent hover:border-black dark:hover:border-white"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              className="p-2 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-20 disabled:hover:bg-transparent rounded-none transition-all border border-transparent hover:border-black dark:hover:border-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= totalPages - 1}
              className="p-2 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-20 disabled:hover:bg-transparent rounded-none transition-all border border-transparent hover:border-black dark:hover:border-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleChangePage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              className="p-2 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-20 disabled:hover:bg-transparent rounded-none transition-all border border-transparent hover:border-black dark:hover:border-white"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- App Component ---
const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-transparent border-t-8 border-black dark:border-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-black dark:text-white uppercase">Nutrition.</h1>
            <p className="mt-2 text-gray-500 dark:text-zinc-400 font-medium text-lg">Core analytical dessert data management.</p>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="flex items-center space-x-2 px-4 py-2 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-black uppercase text-xs tracking-widest"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4" />
                <span>Switch Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span>Switch Dark</span>
              </>
            )}
          </button>
        </div>
        <EnhancedTable />
      </div>
    </div>
  );
};

export default App;
