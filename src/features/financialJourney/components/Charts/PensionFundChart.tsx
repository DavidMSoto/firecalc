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

interface PensionFundChartProps {
  data: SimulationRow[];
}

export const PensionFundChart: React.FC<PensionFundChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(row => row.age),
    datasets: [
      {
        label: 'Total Pension Fund',
        data: data.map(row => row.pensionFundBalance),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        order: 1,
      },
      {
        label: 'Contributions',
        data: data.map(row => row.pensionContributions),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        order: 2,
      },
      {
        label: 'Withdrawals',
        data: data.map(row => -row.pensionWithdrawals),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
            const value = Math.abs(context.raw as number);
            return `${context.dataset.label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
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