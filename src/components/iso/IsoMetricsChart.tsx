'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

// Dynamically import Chart to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface IsoMetricsChartProps {
  series: number[];
  labels: string[];
}

const IsoMetricsChart: React.FC<IsoMetricsChartProps> = ({ series, labels }) => {
  const options: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: labels,
    colors: ['#E5E7EB', '#FBBF24', '#10B981'], // Gray, Yellow, Green (Tailwind colors approximation)
    legend: {
      position: 'bottom',
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        },
      },
    },
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[380px]">
        <ReactApexChart options={options} series={series} type="donut" height={350} />
      </div>
    </div>
  );
};

export default IsoMetricsChart;
