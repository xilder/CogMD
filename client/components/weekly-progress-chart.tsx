import { useDashboard } from '@/app/(auth)/student/layout';
import {
  BarElement,
  CategoryScale,
  Chart,
  // plugins,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.register(ChartDataLabels);

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

Chart.defaults.font.family = 'Montserrat, sans-serif';
Chart.defaults.font.size = 12;

export default function WeeklyProgressChart() {
  const { stats } = useDashboard();
  const data: ChartData<'bar', number[], string> = {
    labels: stats?.weeklyProgress.map((i) => i.day) || [],
    datasets: [
      {
        label: 'Correct',
        data: stats?.weeklyProgress.map((i) => i.correct) || [],
        backgroundColor: '#005A9C',
        barPercentage: 0.8,
        categoryPercentage: 0.7,
        stack: 'correct-stack',
      },
      {
        label: 'Incorrect',
        data: stats?.weeklyProgress.map((i) => i.incorrect) || [],
        backgroundColor: '#FF383C',
        barPercentage: 0.8,
        categoryPercentage: 0.7,
        stack: 'incorrect-stack',
      },
    ],
  };
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      //   datalabels: { display: false },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        // max: 100,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 5,
        },
      },
    },
  };
  return (
    <div className='h-80'>
      <Bar options={options} data={data} />
    </div>
  );
}
