import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { SimulationRow } from '../../types';
import { formatCurrency } from '../../../../utils/formatting';
import { STRINGS } from '../../config/strings';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface IncomeExpenseChartProps {
  data: SimulationRow[];
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(row => row.age),
    datasets: [
      {
        label: STRINGS.CHARTS.SERIES.NET_INCOME,
        data: data.map(row => row.netIncoming),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
        stack: 'stack0',
      },
      {
        label: STRINGS.CHARTS.SERIES.LIVING_EXPENSES,
        data: data.map(row => -row.livingExpenses),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        stack: 'stack1',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
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
      x: {
        stacked: true,
        title: {
          display: true,
          text: STRINGS.CHARTS.LABELS.AGE,
        },
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => formatCurrency(Math.abs(Number(value))).replace('£', ''),
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
      <Bar data={chartData} options={options} />
    </div>
  );
};