'use client';
import React from 'react';
import {
  AreaChart,
  AreaSeries,
  Area,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  LinearYAxis,
  LinearYAxisTickSeries,
  GridlineSeries,
  Gridline,
  Gradient,
  GradientStop
} from 'reaviz';

const areaMultiSeriesInterpolationSmoothData = [
  {
    key: 'Series 1',
    data: [
      { key: new Date(2023, 0, 1), data: 10 },
      { key: new Date(2023, 0, 8), data: 15 },
      { key: new Date(2023, 0, 15), data: 12 },
      { key: new Date(2023, 0, 22), data: 18 },
      { key: new Date(2023, 0, 29), data: 20 },
      { key: new Date(2023, 1, 5), data: 22 },
      { key: new Date(2023, 1, 12), data: 19 },
    ]
  },
  {
    key: 'Series 2',
    data: [
      { key: new Date(2023, 0, 1), data: 20 },
      { key: new Date(2023, 0, 8), data: 25 },
      { key: new Date(2023, 0, 15), data: 22 },
      { key: new Date(2023, 0, 22), data: 30 },
      { key: new Date(2023, 0, 29), data: 35 },
      { key: new Date(2023, 1, 5), data: 32 },
      { key: new Date(2023, 1, 12), data: 28 },
    ]
  },
  {
    key: 'Series 3',
    data: [
      { key: new Date(2023, 0, 1), data: 5 },
      { key: new Date(2023, 0, 8), data: 8 },
      { key: new Date(2023, 0, 15), data: 10 },
      { key: new Date(2023, 0, 22), data: 12 },
      { key: new Date(2023, 0, 29), data: 15 },
      { key: new Date(2023, 1, 5), data: 18 },
      { key: new Date(2023, 1, 12), data: 16 },
    ]
  }
];

// Гарантируем, что все значения - числа
areaMultiSeriesInterpolationSmoothData.forEach(series => {
  series.data.forEach(item => {
    item.data = typeof item.data === 'number' && !isNaN(item.data) ? item.data : 0;
  });
});

const IncidentReportCard = () => {
  return (
    <div className="flex flex-col pt-4 pb-4 bg-white dark:bg-black transition-colors duration-300 rounded-3xl shadow-[11px_21px_3px_rgba(0,0,0,0.06),14px_27px_7px_rgba(0,0,0,0.10),19px_38px_14px_rgba(0,0,0,0.13),27px_54px_27px_rgba(0,0,0,0.16),39px_78px_50px_rgba(0,0,0,0.20),55px_110px_86px_rgba(0,0,0,0.26)] w-[300px] h-[386px] overflow-hidden">
      <h3 className="text-3xl text-left p-7 pt-6 pb-8 font-bold text-black dark:text-white transition-colors duration-300">
        Incident Report
      </h3>
      <AreaChart
        id="multi-series-interpolation-smooth"
        data={areaMultiSeriesInterpolationSmoothData}
        height={200}
        xAxis={
          <LinearXAxis
            type="time"
            tickSeries={
              <LinearXAxisTickSeries
                label={
                  <LinearXAxisTickLabel
                    format={(v) =>
                      new Date(v).toLocaleDateString('en-US', {
                        month: 'numeric',
                        day: 'numeric',
                      })
                    }
                    fill="#9A9AAF"
                  />
                }
                tickSize={10}
              />
            }
          />
        }
        yAxis={
          <LinearYAxis
            axisLine={null}
            tickSeries={
              <LinearYAxisTickSeries
                line={null}
                label={null}
                tickSize={20}
              />
            }
          />
        }
        series={
          <AreaSeries
            type="grouped"
            interpolation="smooth"
            area={
              <Area
                gradient={
                  <Gradient
                    stops={[
                      <GradientStop key={1} stopOpacity={0} />,
                      <GradientStop key={2} offset="100%" stopOpacity={0.4} />,
                    ]}
                  />
                }
              />
            }
            colorScheme={['#5B14C5', '#DAC5F9', '#B58BF3']}
          />
        }
        gridlines={
          <GridlineSeries
            line={<Gridline strokeColor="#7E7E8F75" />}
          />
        }
      />
    </div>
  );
};

export default IncidentReportCard;