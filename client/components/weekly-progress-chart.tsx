import { useDashboard } from '@/app/(auth)/student/layout';
import {
  CategoryScale,
  Chart,
  // plugins,
  ChartData,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  ScriptableContext,
  Title,
  Tooltip
} from 'chart.js';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.register(ChartDataLabels);

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

Chart.defaults.font.family = 'Montserrat, sans-serif';
Chart.defaults.font.size = 12;

const createImageFromSVG = (svgString: string) => {
  const img = new Image();
  img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
  return img;
};

const bluePointSVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="8.9101" y="8.33246" width="1.5689" height="0.581911" fill="url(#paint0_linear_1932_8362)"/>
  <rect x="8.9101" y="8.33246" width="1.5689" height="0.581911" stroke="#005A9C80" strokeWidth="0.581911"/>
  <path opacity="0.25" d="M8.61914 0.0415039L16.6191 8.0415L8.61914 16.0415L0.619141 8.0415L8.61914 0.0415039Z" fill="#005A9C80"/>
  <path d="M12.9121 8.0415L8.61914 12.3345L4.32617 8.0415L8.61914 3.74854L12.9121 8.0415Z" fill="#005A9C80" stroke="white"/>
  <defs>
    <linearGradient id="paint0_linear_1932_8362" x1="9.74748" y1="8.0415" x2="9.74748" y2="9.20533" gradientUnits="userSpaceOnUse">
      <stop stop-color="#005A9C80" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#005A9C80" stop-opacity="0.05"/>
    </linearGradient>
  </defs>
</svg>`;

const redPointSVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="8.9101" y="8.33246" width="1.5689" height="0.581911" fill="url(#paint0_linear_1932_8362)"/>
  <rect x="8.9101" y="8.33246" width="1.5689" height="0.581911" stroke="#FF383C80" strokeWidth="0.581911"/>
  <path opacity="0.25" d="M8.61914 0.0415039L16.6191 8.0415L8.61914 16.0415L0.619141 8.0415L8.61914 0.0415039Z" fill="#FF383C80"/>
  <path d="M12.9121 8.0415L8.61914 12.3345L4.32617 8.0415L8.61914 3.74854L12.9121 8.0415Z" fill="#FF383C80" stroke="white"/>
  <defs>
    <linearGradient id="paint0_linear_1932_8362" x1="9.74748" y1="8.0415" x2="9.74748" y2="9.20533" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF383C80" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#FF383C80" stop-opacity="0.05"/>
    </linearGradient>
  </defs>
</svg>`;

const purplePointSVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="8.9101" y="8.33246" width="1.5689" height="0.581911" fill="url(#paint0_linear_1932_8362)"/>
  <rect x="8.9101" y="8.33246" width="1.5689" height="0.581911" stroke="#80506C80" strokeWidth="0.581911"/>
  <path opacity="0.25" d="M8.61914 0.0415039L16.6191 8.0415L8.61914 16.0415L0.619141 8.0415L8.61914 0.0415039Z" fill="#80506C80"/>
  <path d="M12.9121 8.0415L8.61914 12.3345L4.32617 8.0415L8.61914 3.74854L12.9121 8.0415Z" fill="#80506C80" stroke="white"/>
  <defs>
    <linearGradient id="paint0_linear_1932_8362" x1="9.74748" y1="8.0415" x2="9.74748" y2="9.20533" gradientUnits="userSpaceOnUse">
      <stop stop-color="#80506C80" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#80506C80" stop-opacity="0.05"/>
    </linearGradient>
  </defs>
</svg>`;

export default function WeeklyProgressChart() {
  const { stats } = useDashboard();
    const [bluePoint] = useState<HTMLImageElement | null>(
      createImageFromSVG(bluePointSVG)
    );
      const [redPoint] = useState<HTMLImageElement | null>(
        createImageFromSVG(redPointSVG)
      );
      const [purplePoint] = useState<HTMLImageElement | null>(
        createImageFromSVG(purplePointSVG)
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

  const data: ChartData<'line', number[], string> = {
    labels: stats?.weeklyProgress.map((i) => i.day) || [],
    datasets: [
      {
        label: 'Correct',
        data: stats?.weeklyProgress.map((i) => i.correct) || [],
        borderColor: '#005A9C80',
                borderWidth: 1,
                fill: 'start' as const,
                backgroundColor: (ctx: ScriptableContext<'line'>) =>
                  createGradient(ctx.chart, '#005A9C00', '#005A9C40'),
                cubicInterpolationMode: 'monotone' as const,
                pointStyle: bluePoint as unknown as string,
        // barPercentage: 0.8,
        // categoryPercentage: 0.7,
        // stack: 'correct-stack',
      },
      {
        label: 'Incorrect',
        data: stats?.weeklyProgress.map((i) => i.incorrect) || [],
        borderColor: '#FF383C80',
                borderWidth: 1,
                fill: 'start' as const,
                backgroundColor: (ctx: ScriptableContext<'line'>) =>
                  createGradient(ctx.chart, '#FF383C00', '#FF383C40'),
                cubicInterpolationMode: 'monotone' as const,
                pointStyle: redPoint as unknown as string,
      },
      {
        label: 'Accuracy',
        data: stats?.weeklyProgress.map((i) => (i.correct + i.incorrect === 0 ? 0 : (i.correct / (i.correct + i.incorrect) * 100))) || [],
        borderColor: '#80506C80',
                borderWidth: 1,
                fill: 'start' as const,
                backgroundColor: (ctx: ScriptableContext<'line'>) =>
                  createGradient(ctx.chart, '#80506C00', '#80506C40'),
                cubicInterpolationMode: 'monotone' as const,
                pointStyle: purplePoint as unknown as string,
      },
    ],
  };
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      //   datalabels: { display: false },
    },
    scales: {
      x: {title: {
          display: true,
          text: 'Questions',
        },
        grid: {
          display: false,
        },
      },
      y: {
        suggestedMax: 100,
        // beginAtZero: true,
        // max: 100,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 10,
        },
      },
    },
  };
  return (
    <div className='h-80'>
      <Line options={options} data={data} />
    </div>
  );
}



// import { useDashboard } from '@/app/(auth)/student/layout';
// import {
//   BarElement,
//   CategoryScale,
//   Chart,
//   // plugins,
//   ChartData,
//   ChartOptions,
//   Legend,
//   LinearScale,
//   Title,
//   Tooltip,
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// // import ChartDataLabels from 'chartjs-plugin-datalabels';

// // Chart.register(ChartDataLabels);

// Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Chart.defaults.font.family = 'Montserrat, sans-serif';
// Chart.defaults.font.size = 12;

// export default function WeeklyProgressChart() {
//   const { stats } = useDashboard();
//   const data: ChartData<'bar', number[], string> = {
//     labels: stats?.weeklyProgress.map((i) => i.day) || [],
//     datasets: [
//       {
//         label: 'Correct',
//         data: stats?.weeklyProgress.map((i) => i.correct) || [],
//         backgroundColor: '#005A9C',
//         barPercentage: 0.8,
//         categoryPercentage: 0.7,
//         stack: 'correct-stack',
//       },
//       {
//         label: 'Incorrect',
//         data: stats?.weeklyProgress.map((i) => i.incorrect) || [],
//         backgroundColor: '#FF383C',
//         barPercentage: 0.8,
//         categoryPercentage: 0.7,
//         stack: 'incorrect-stack',
//       },
//     ],
//   };
//   const options: ChartOptions<'bar'> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: true,
//         position: 'bottom' as const,
//         labels: {
//           boxWidth: 10,
//           boxHeight: 10,
//         },
//       },
//       //   datalabels: { display: false },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//       },
//       y: {
//         beginAtZero: true,
//         // max: 100,
//         grid: {
//           display: false,
//         },
//         ticks: {
//           stepSize: 5,
//         },
//       },
//     },
//   };
//   return (
//     <div className='h-80'>
//       <Bar options={options} data={data} />
//     </div>
//   );
// }
