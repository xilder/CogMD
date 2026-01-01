import { useDashboard } from '@/app/(auth)/student/layout';
import {
  CategoryScale,
  Chart,
  ChartData,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  ScriptableContext,
  Title,
  Tooltip,
} from 'chart.js';
import { getDate } from 'date-fns';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

Chart.defaults.font.family = 'Montserrat';
Chart.defaults.font.size = 12;

const createImageFromSVG = (svgString: string) => {
  const img = new Image();
  img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
  return img;
};

const greenPointSVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="8.9101" y="8.33246" width="1.5689" height="0.581911" fill="url(#paint0_linear_1932_8362)"/>
  <rect x="8.9101" y="8.33246" width="1.5689" height="0.581911" stroke="#005A9C" strokeWidth="0.581911"/>
  <path opacity="0.25" d="M8.61914 0.0415039L16.6191 8.0415L8.61914 16.0415L0.619141 8.0415L8.61914 0.0415039Z" fill="#005A9C"/>
  <path d="M12.9121 8.0415L8.61914 12.3345L4.32617 8.0415L8.61914 3.74854L12.9121 8.0415Z" fill="#005A9C" stroke="white"/>
  <defs>
    <linearGradient id="paint0_linear_1932_8362" x1="9.74748" y1="8.0415" x2="9.74748" y2="9.20533" gradientUnits="userSpaceOnUse">
      <stop stop-color="#005A9C" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#005A9C" stop-opacity="0.05"/>
    </linearGradient>
  </defs>
</svg>`;

export default function WeeklyAccuracyChart() {
  const { stats } = useDashboard();
  const [greenPoint] = useState<HTMLImageElement | null>(
    createImageFromSVG(greenPointSVG)
  );

  const createGradient = (chart: Chart, color1: string, color2: string) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.bottom,
      0,
      chartArea.top
    );
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  };

  const getDateLabels = () => {
    return stats?.weeklyAccuracy.map(
      (i) =>
        `${new Date(i.date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })}`
    );
  };

  const data: ChartData<'line', number[], string> = {
    labels: getDateLabels() || [],
    datasets: [
      {
        data: stats?.weeklyAccuracy.map((i) => i.accuracy as number) || [],
        borderColor: '#005A9C',
        borderWidth: 1,
        fill: 'start' as const,
        backgroundColor: (ctx: ScriptableContext<'line'>) =>
          createGradient(ctx.chart, '#005A9C00', '#005A9CDD'),
        cubicInterpolationMode: 'monotone' as const,
        pointStyle: greenPoint as unknown as string,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    font: {
      family: 'Montserrat',
    },
    plugins: {
      legend: {
        display: false,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          boxHeight: 10,
        },
      },
    },
    scales: {
      y: {
        suggestedMax: 100,
        ticks: {
          stepSize: 10,
        },
        // grid: {display: false},
        title: {
          display: true,
          text: 'Accuracy (%)',
          position: 'top' as const,
        },
      },
      x: {
        // ticks: {
        //   callback: function (
        //     this: Scale,
        //     value: string | number,
        //     index: number
        //   ): string | null {
        //     return index % 2 === 1
        //       ? this.getLabelForValue(Number(value))
        //       : null;
        //   },
        // },
        title: {
          display: true,
          text: 'Dates',
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className='h-80'>
      <Line options={options} data={data} />
    </div>
  );
}
