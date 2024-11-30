import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { SimulationRow } from '../../types';
import { formatCurrency } from '../../../../utils/formatting';
import { STRINGS } from '../../config/strings';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StackedAreaChartProps {
  data: SimulationRow[];
}

export const StackedAreaChart: React.FC<StackedAreaChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(row => row.age),
    datasets: [
      {
        label: 'Salary',
        data: data.map(row => row.totalIncome - row.additionalIncome),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        fill: true,
        order: 1,
      },
      {
        label: 'Additional Income',
        data: data.map(row => row.additionalIncome),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        fill: true,
        order: 2,
      },
      {
        label: 'State Pension',
        data: data.map(row => row.statePension),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        fill: true,
        order: 3,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `${context.dataset.label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        stacked: true,
        ticks: {
          callback: (value) => formatCurrency(Number(value)).replace('£', ''),
        },
      },
      x: {
        title: {
          display: true,
          text: STRINGS.CHARTS.LABELS.AGE,
        },
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <div style={{ height: '400px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};