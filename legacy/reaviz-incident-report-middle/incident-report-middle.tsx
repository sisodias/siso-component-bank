// components/ui/incident-report-card/component.tsx

import { useState, useMemo } from "react";
import { cn } from "../_utils/cn";
import { motion } from "framer-motion";
import {
  AreaChart,
  AreaSeries,
  Area,
  Gradient,
  GradientStop,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  LinearYAxis,
  LinearYAxisTickSeries,
  GridlineSeries,
  Gridline,
} from "reaviz";
const Count = ({
  className,
  to,
}: {
  className?: string;
  to: number;
}) => {
  return <span className={className}>{to}</span>;
};

const generateChartData = (days: number, maxVal: number = 50) => {
  const data = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      key: date,
      data: Math.floor(Math.random() * maxVal) + 10,
    });
  }
  return data;
};

interface IncidentReportCardProps {
  isDarkMode?: boolean; 
}

export const Component = ({ isDarkMode = false }: IncidentReportCardProps) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("last-7-days");

  const areaSingleSeriesSimpleData = useMemo(() => {
    switch (selectedTimeRange) {
      case "last-7-days": return generateChartData(7);
      case "last-30-days": return generateChartData(30);
      case "last-90-days": return generateChartData(90);
      default: return generateChartData(7);
    }
  }, [selectedTimeRange]);

  const chartColorScheme = isDarkMode ? "#40D3F4" : "#2563EB";
  const axisTickColor = isDarkMode ? "#9A9AAF" : "#6B7280";
  const gridlineColor = isDarkMode ? "#7E7E8F75" : "#D1D5DB75"; 

  const criticalColor = isDarkMode ? "#F08083" : "#DC2626"; 
  const criticalBgOpacity = isDarkMode ? "bg-[rgb(232,64,69)]/40" : "bg-red-100";
  
  const totalColor = isDarkMode ? "#40E5D1" : "#0D9488"; 
  const totalBgOpacity = isDarkMode ? "bg-[rgb(64,229,209)]/40" : "bg-teal-100";

  const metricIconFill = isDarkMode ? "#E84045" : "#EF4444";

  const metricBadgeRectFillRed = isDarkMode ? "rgb(232 64 69)" : "rgb(254 226 226)";
  const metricBadgeRectFillOpacityRed = isDarkMode ? 0.4 : 1;
  const metricBadgeArrowStrokeRed = isDarkMode ? "#F08083" : "rgb(220 38 38)";

  const metricBadgeRectFillTeal = isDarkMode ? "rgb(64 229 209)" : "rgb(204 251 241)";
  const metricBadgeRectFillOpacityTeal = isDarkMode ? 0.4 : 1;
  const metricBadgeArrowStrokeTeal = isDarkMode ? "#40E5D1" : "rgb(13 148 136)";


  return (
    <div
      className={cn(
        "flex flex-col justify-between pt-4 pb-4 rounded-3xl overflow-hidden w-[600px] h-[714px]",
        "bg-white text-gray-900 shadow-xl",
        "dark:bg-black dark:text-white dark:shadow-[11px_21px_3px_rgba(0,0,0,0.06),14px_27px_7px_rgba(0,0,0,0.10),19px_38px_14px_rgba(0,0,0,0.13),27px_54px_27px_rgba(0,0,0,0.16),39px_78px_50px_rgba(0,0,0,0.20),55px_110px_86px_rgba(0,0,0,0.26)]"
      )}
    >
      <div className="flex justify-between items-center p-7 pt-6 pb-8">
        <h3 className="text-3xl text-left font-bold">
          Incident Report
        </h3>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className={cn(
            "p-3 pt-2 pb-2 rounded-md appearance-none focus:outline-none focus:ring-2 cursor-pointer",
            "bg-gray-100 text-gray-800 border border-gray-300 focus:ring-blue-500",
            "dark:bg-[#262631] dark:text-white dark:border-transparent dark:focus:ring-blue-400"
          )}
        >
          <option value="last-7-days">Last 7 Days</option>
          <option value="last-30-days">Last 30 Days</option>
          <option value="last-90-days">Last 90 Days</option>
        </select>
      </div>

      <div className="px-4">
        <AreaChart
          height={200}
          width={560}
          data={areaSingleSeriesSimpleData}
          series={
            <AreaSeries
              area={
                <Area
                  gradient={
                    <Gradient
                      stops={[
                        <GradientStop key="1" stopOpacity={0} />,
                        <GradientStop key="2" offset="100%" stopOpacity={isDarkMode ? 0.4 : 0.2} />, 
                      ]}
                    />
                  }
                />
              }
              colorScheme={chartColorScheme}
            />
          }
          xAxis={
            <LinearXAxis
              type="time"
              tickSeries={
                <LinearXAxisTickSeries
                  label={
                    <LinearXAxisTickLabel
                      format={(v: Date) =>
                        new Date(v).toLocaleDateString("en-US", {
                          month: "numeric",
                          day: "numeric",
                        })
                      }
                      fill={axisTickColor}
                    />
                  }
                  tickSize={30}
                />
              }
            />
          }
          yAxis={
            <LinearYAxis
              axisLine={null}
              tickSeries={
                <LinearYAxisTickSeries line={null} label={null} tickSize={20} />
              }
            />
          }
          gridlines={
            <GridlineSeries line={<Gridline strokeColor={gridlineColor} />} />
          }
        />
      </div>

      <div className="flex w-full pl-8 pr-8 justify-between pb-2 pt-8">
        <div className="flex flex-col gap-2 w-1/2">
          <span className="text-xl text-gray-700 dark:text-white">Critical Incidents</span>
          <div className="flex items-center gap-2">
            <Count
              className="font-mono text-4xl font-semibold" 
              to={321}
            />
            <div className={cn(
                "flex p-1 pl-2 pr-2 items-center rounded-full",
                 criticalBgOpacity,
                 isDarkMode ? 'text-[#F08083]' : 'text-red-700'
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" >
                <path d="M5.50134 9.11119L10.0013 4.66675M10.0013 4.66675L14.5013 9.11119M10.0013 4.66675L10.0013 16.3334" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              </svg>
              12%
            </div>
          </div>
          <span className="text-sm text-gray-500 dark:text-[#9A9AAF]">
            Compared to 293 last week
          </span>
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <span className="text-xl text-gray-700 dark:text-white">Total Incidents</span>
          <div className="flex items-center gap-2">
            <Count
              className="font-mono text-4xl font-semibold"
              to={1120}
            />
            <div className={cn(
                "flex p-1 pl-2 pr-2 items-center rounded-full",
                totalBgOpacity,
                isDarkMode ? 'text-[#40E5D1]' : 'text-teal-700'
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" >
                <path d="M14.4987 11.8888L9.99866 16.3333M9.99866 16.3333L5.49866 11.8888M9.99866 16.3333V4.66658" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              </svg>
              4%
            </div>
          </div>
          <span className="text-sm text-gray-500 dark:text-[#9A9AAF]">
            Compared to 1.06k last week
          </span>
        </div>
      </div>

      <div className="flex flex-col pl-8 pr-8 font-mono divide-y divide-gray-200 dark:divide-[#262631]">
        {[
          { title: "Mean Time to Respond", value: "6 Hours", delay: 0, type: "critical" },
          { title: "Incident Response Time", value: "4 Hours", delay: 0.05, type: "critical" },
          { title: "Incident Escalation Rate", value: "10%", delay: 0.1, type: "improvement" },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item.delay }}
            className="flex w-full pb-4 pt-4 items-center gap-2"
          >
            <div className="flex flex-row gap-2 items-center text-base w-1/2 text-gray-600 dark:text-[#9A9AAF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d={ item.type === "critical" ? 
                            "M9.92844 1.25411C9.32947 1.25895 8.73263 1.49041 8.28293 1.94747L1.92062 8.41475C1.02123 9.32885 1.03336 10.8178 1.94748 11.7172L8.41476 18.0795C9.32886 18.9789 10.8178 18.9667 11.7172 18.0526L18.0795 11.5861C18.0798 11.5859 18.08 11.5856 18.0803 11.5853C18.979 10.6708 18.9667 9.18232 18.0526 8.28291L11.5853 1.92061C11.1283 1.47091 10.5274 1.24926 9.92844 1.25411ZM9.93901 2.49597C10.2155 2.49373 10.4926 2.59892 10.7089 2.81172L17.1762 9.17403C17.6087 9.59962 17.6139 10.2767 17.1884 10.7097L10.8261 17.1761C10.4005 17.6087 9.72379 17.614 9.29123 17.1884L2.82394 10.826C2.39139 10.4005 2.38613 9.72378 2.81174 9.29121L9.17404 2.82393C9.38684 2.60765 9.66256 2.4982 9.93901 2.49597ZM9.99028 5.40775C9.82481 5.41034 9.66711 5.47845 9.55178 5.59714C9.43645 5.71583 9.37289 5.87541 9.37505 6.04089V11.0409C9.37388 11.1237 9.38918 11.2059 9.42006 11.2828C9.45095 11.3596 9.4968 11.4296 9.55495 11.4886C9.6131 11.5476 9.6824 11.5944 9.75881 11.6264C9.83522 11.6583 9.91722 11.6748 10 11.6748C10.0829 11.6748 10.1649 11.6583 10.2413 11.6264C10.3177 11.5944 10.387 11.5476 10.4451 11.4886C10.5033 11.4296 10.5492 11.3596 10.58 11.2828C10.6109 11.2059 10.6262 11.1237 10.625 11.0409V6.04089C10.6261 5.95731 10.6105 5.87435 10.5789 5.79694C10.5474 5.71952 10.5006 5.64922 10.4415 5.59019C10.3823 5.53115 10.3119 5.48459 10.2344 5.45326C10.1569 5.42192 10.0739 5.40645 9.99028 5.40775ZM10 12.9159C9.77904 12.9159 9.56707 13.0037 9.41079 13.16C9.25451 13.3162 9.16672 13.5282 9.16672 13.7492C9.16672 13.9702 9.25451 14.1822 9.41079 14.3385C9.56707 14.4948 9.77904 14.5826 10 14.5826C10.2211 14.5826 10.433 14.4948 10.5893 14.3385C10.7456 14.1822 10.8334 13.9702 10.8334 13.7492C10.8334 13.5282 10.7456 13.3162 10.5893 13.16C10.433 13.0037 10.2211 12.9159 10 12.9159Z"
                            : "M10.0001 2.10535C9.35241 2.10535 8.70472 2.42118 8.35459 3.05343L1.9044 14.7063C1.22414 15.9354 2.14514 17.5 3.5499 17.5H16.4511C17.8559 17.5 18.7769 15.9354 18.0966 14.7063L11.6456 3.05343C11.2955 2.42118 10.6478 2.10535 10.0001 2.10535ZM10.0001 3.31222C10.212 3.31222 10.4237 3.42739 10.5519 3.65889L17.0029 15.3117C17.2501 15.7585 16.9605 16.25 16.4511 16.25H3.5499C3.04051 16.25 2.7509 15.7585 2.99815 15.3117L9.44834 3.65889C9.57655 3.42739 9.78821 3.31222 10.0001 3.31222ZM9.99033 6.65776C9.82472 6.66034 9.6669 6.72856 9.55154 6.84743C9.43618 6.96629 9.37272 7.12609 9.3751 7.29171V11.4584C9.37393 11.5412 9.38923 11.6234 9.42011 11.7003C9.451 11.7771 9.49685 11.8471 9.555 11.9061C9.61315 11.965 9.68245 12.0119 9.75886 12.0438C9.83527 12.0758 9.91727 12.0923 10.0001 12.0923C10.0829 12.0923 10.1649 12.0758 10.2413 12.0438C10.3178 12.0119 10.387 11.965 10.4452 11.9061C10.5034 11.8471 10.5492 11.7771 10.5801 11.7003C10.611 11.6234 10.6263 11.5412 10.6251 11.4584V7.29171C10.6263 7.20806 10.6107 7.12501 10.5792 7.0475C10.5477 6.96999 10.501 6.89959 10.4418 6.84047C10.3826 6.78135 10.3121 6.73472 10.2346 6.70333C10.157 6.67195 10.074 6.65645 9.99033 6.65776ZM10.0001 13.3334C9.77909 13.3334 9.56712 13.4212 9.41084 13.5775C9.25456 13.7337 9.16677 13.9457 9.16677 14.1667C9.16677 14.3877 9.25456 14.5997 9.41084 14.756C9.56712 14.9122 9.77909 15 10.0001 15C10.2211 15 10.4331 14.9122 10.5894 14.756C10.7456 14.5997 10.8334 14.3877 10.8334 14.1667C10.8334 13.9457 10.7456 13.7337 10.5894 13.5775C10.4331 13.4212 10.2211 13.3334 10.0001 13.3334Z"
                           }
                           fill={metricIconFill} />
              </svg>
              <span className="truncate" title={item.title}>
                {item.title}
              </span>
            </div>
            <div className="flex gap-2 w-1/2 justify-end items-center">
              <span className="font-semibold text-xl">
                {item.value}
              </span>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="14" 
                  fill={item.type === "critical" ? metricBadgeRectFillRed : metricBadgeRectFillTeal} 
                  fillOpacity={item.type === "critical" ? metricBadgeRectFillOpacityRed : metricBadgeRectFillOpacityTeal} 
                />
                <path 
                  d={item.type === "critical" ? "M9.50134 12.6111L14.0013 8.16663M14.0013 8.16663L18.5013 12.6111M14.0013 8.16663L14.0013 19.8333" : "M18.4987 15.3889L13.9987 19.8334M13.9987 19.8334L9.49866 15.3889M13.9987 19.8334V8.16671"} 
                  stroke={item.type === "critical" ? metricBadgeArrowStrokeRed : metricBadgeArrowStrokeTeal} 
                  strokeWidth="2" strokeLinecap="square" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};