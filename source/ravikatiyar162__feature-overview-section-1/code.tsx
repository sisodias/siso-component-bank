import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, Eye, AlertCircle } from 'lucide-react';

// --- Static Data ---
const staticViewsData = [
  { name: 'Jul 19', Views: 1250 },
  { name: 'Jul 20', Views: 2100 },
  { name: 'Jul 21', Views: 1800 },
  { name: 'Jul 22', Views: 2400 },
];

const staticIncomeData = [
  { name: 'Jul 19', 'Projected Income': 150.50 },
  { name: 'Jul 20', 'Projected Income': 220.75 },
  { name: 'Jul 21', 'Projected Income': 190.00 },
  { name: 'Jul 22', 'Projected Income': 275.25 },
];


// --- Main App Component ---
export function Component() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dataType, setDataType] = useState('Views'); // 'Views' or 'Projected Income'
  const [timeframe, setTimeframe] = useState('July 2025');
  const [isIncomeTooltipVisible, setIsIncomeTooltipVisible] = useState(false);

  // --- Data Management ---
  // Use the static data arrays.
  const viewsData = staticViewsData;
  const incomeData = staticIncomeData;

  // Select the correct data to display based on the current dataType state
  const chartData = useMemo(() => {
    return dataType === 'Views' ? viewsData : incomeData;
  }, [dataType, viewsData, incomeData]);


  /**
   * ---- Theme Adaptation ----
   * The component automatically adapts to the user's system theme (light/dark mode).
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    const handler = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value);
  };

  // --- Custom Tooltip for Chart ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const name = payload[0].name;
      const formattedValue = name === 'Projected Income' ? `$${value.toFixed(2)}` : value.toLocaleString();

      return (
        <div className= "bg-white dark:bg-gray-900 p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl" >
        <p className="label text-sm text-gray-600 dark:text-gray-400" > {`${label}`
    } </p>
      < p className = "intro text-md font-bold text-gray-900 dark:text-white" > {`${name}: ${formattedValue}`
  }</p>
    < /div>
      );
}
return null;
  };

// --- Dynamic values based on dataType ---
const formattedProjectedIncomeTotal = useMemo(() => {
  const total = incomeData.reduce((sum, item) => sum + item['Projected Income'], 0);
  return `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}, [incomeData]);

const formattedViewsTotal = useMemo(() => {
  const total = viewsData.reduce((sum, item) => sum + item.Views, 0);
  return total.toLocaleString();
}, [viewsData]);


return (

  <div className= "min-h-screen bg-gray-100 w-full dark:bg-gray-900 flex items-center justify-center p-4 font-sans transition-colors duration-300" >
  <motion.div 
          initial={ { opacity: 0, scale: 0.95 } }
animate = {{ opacity: 1, scale: 1 }}
transition = {{ duration: 0.5, ease: "easeOut" }}
className = "w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6"
  >
  {/* --- Header Section (Clickable Cards) --- */ }
  < div className = "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" >
    <motion.div
              whileTap={ { scale: 0.98 } }
onClick = {() => setDataType('Projected Income')}
className = {`p-4 rounded-lg cursor-pointer transition-all duration-200 ${dataType === 'Projected Income' ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/50' : 'bg-gray-50 dark:bg-gray-700/50'}`}
            >
  <div className="relative flex items-center text-gray-500 dark:text-gray-400 text-sm mb-1" >
    <span>Projected Income < /span>
      < div
className = "ml-1"
onMouseEnter = {() => setIsIncomeTooltipVisible(true)}
onMouseLeave = {() => setIsIncomeTooltipVisible(false)}
                >
  <AlertCircle className="w-4 h-4" />
    </div>
    <AnimatePresence>
{
  isIncomeTooltipVisible && (
    <motion.div
                      initial={ { opacity: 0, y: -10 } }
  animate = {{ opacity: 1, y: 0 }
}
exit = {{ opacity: 0, y: -10 }}
className = "absolute left-0 top-6 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10"
  >
  This is an estimated projection.
                    < /motion.div>
                  )}
</AnimatePresence>
  < /div>
  < p className = "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" > { formattedProjectedIncomeTotal } < /p>
    < /motion.div>
    < motion.div
whileTap = {{ scale: 0.98 }}
onClick = {() => setDataType('Views')}
className = {`p-4 rounded-lg cursor-pointer transition-all duration-200 ${dataType === 'Views' ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/50' : 'bg-gray-50 dark:bg-gray-700/50'}`}
            >
  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1" > Stats < /p>
    < div className = "flex items-center" >
      <Eye className="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400" />
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" > { formattedViewsTotal } < /p>
          < /div>
          < /motion.div>
          < /div>

{/* --- Controls Section --- */ }
<div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-end" >
  <div className="relative" >
    <select 
                  value={ timeframe }
onChange = { handleTimeframeChange }
className = "appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2 px-4 pr-8 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
  <option>July 2025 < /option>
    < option > June 2025 < /option>
      < option > May 2025 < /option>
        < /select>
        < ChevronDown className = "w-5 h-5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          < /div>

{/* --- Chart Section --- */ }
<div className="h-80 w-full" >
  <ResponsiveContainer width="100%" height = "100%" >
    <BarChart
                data={ chartData }
margin = {{ top: 5, right: 30, left: 20, bottom: 5 }}
key = { dataType } // Re-renders the chart when dataType changes
  >
  <CartesianGrid strokeDasharray="3 3" stroke = { isDarkMode? "#374151": "#E5E7EB" } vertical = { false} />
    <XAxis dataKey="name" tick = {{ fill: isDarkMode ? '#A0AEC0' : '#4A5568' }} tickLine = { false} axisLine = { false} dy = { 10} />
      <YAxis 
                  tick={ { fill: isDarkMode ? '#A0AEC0' : '#4A5568' } }
tickLine = { false}
axisLine = { false}
tickFormatter = {(value) => {
  if (dataType === 'Projected Income') return `$${value}`;
  if (value >= 1000) return `${value / 1000}k`;
  return value;
}}
/>
  < Tooltip content = {< CustomTooltip />} cursor = {{ fill: isDarkMode ? 'rgba(113, 128, 150, 0.1)' : 'rgba(200, 210, 220, 0.3)' }} />
    < Bar
dataKey = { dataType }
fill = { dataType === 'Views' ? '#3B82F6' : '#10B981'}
radius = { [4, 4, 0, 0]}
barSize = { 80}
  >
  </Bar>
  < /BarChart>
  < /ResponsiveContainer>
  < /div>

{/* --- Legend --- */ }
<div className="flex justify-center items-center mt-4" >
  <div className={ `w-3 h-3 rounded-sm mr-2` } style = {{ backgroundColor: dataType === 'Views' ? '#3B82F6' : '#10B981' }}> </div>
    < span className = "text-sm text-gray-600 dark:text-gray-400" > { dataType } < /span>
      < /div>

      < /motion.div>
      < /div>
  );
}
