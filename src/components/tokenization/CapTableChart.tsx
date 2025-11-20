"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Importación dinámica para evitar errores de SSR con ApexCharts
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Shareholder {
  name: string;
  percentage: number;
}

interface CapTableChartProps {
  data: Shareholder[];
}

export default function CapTableChart({ data }: CapTableChartProps) {
  const series = data.map((item) => item.percentage);
  const labels = data.map((item) => item.name);

  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    colors: ["#3C50E0", "#80CAEE", "#10B981", "#FFBA00", "#FF6766"],
    labels: labels,
    legend: {
      show: true,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Total Emitido",
              fontSize: "16px",
              fontWeight: "600",
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return total.toFixed(1) + "%";
              }
            },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: "bold",
              formatter: function (val) {
                return parseFloat(val).toFixed(1) + "%";
              }
            }
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 280,
          },
        },
      },
    ],
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Distribución Accionaria
          </h5>
          <p className="text-sm font-medium text-gray-500">Cap Table Digital en Tiempo Real</p>
        </div>
      </div>

      <div className="mb-2">
        <div id="capTableChart" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>
    </div>
  );
}
