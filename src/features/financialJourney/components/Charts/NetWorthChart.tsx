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
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
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
  Filler,
  annotationPlugin
);

interface NetWorthChartProps {
  data: SimulationRow[];
}

export const NetWorthChart: React.FC<NetWorthChartProps> = ({ data }) => {
  const milestones = [100000, 500000, 1000000];
  const retirementAge = data.find(row => row.pensionWithdrawals > 0)?.age;
  const mortgagePaidAge = data.find(row => 
    row.mortgageRemainingBalance === 0 && 
    data[data.indexOf(row) - 1]?.mortgageRemainingBalance > 0
  )?.age;

  const chartData = {
    labels: data.map(row => row.age),
    datasets: [
      {
        label: 'Pension Balance',
        data: data.map(row => row.pensionFundBalance),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        fill: true,
        order: 2,
      },
      {
        label: 'Total Savings',
        data: data.map(row => row.totalSavings),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        fill: true,
        order: 1,
      },
      {
        label: 'Mortgage Balance',
        data: data.map(row => -row.mortgageRemainingBalance),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.3)',
        fill: true,
        order: 3,
      },
      {
        label: 'Net Worth',
        data: data.map(row => row.netWorth),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        order: 0,
      },
    ],
  };

  const annotations = {
    milestones: milestones.map(milestone => ({
      type: 'line' as const,
      yMin: milestone,
      yMax: milestone,
      borderColor: 'rgba(255, 99, 132, 0.5)',
      borderWidth: 2,
      borderDash: [6, 6],
      label: {
        content: `£${milestone.toLocaleString()} Milestone`,
        enabled: true,
        position: 'left' as const,
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        color: 'white',
        padding: 4,
      },
    })),
    events: [
      retirementAge && {
        type: 'line' as const,
        xMin: retirementAge,
        xMax: retirementAge,
        borderColor: 'rgba(75, 192, 192, 0.5)',
        borderWidth: 2,
        label: {
          content: 'Retirement',
          enabled: true,
          position: 'top' as const,
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          color: 'white',
          padding: 4,
        },
      },
      mortgagePaidAge && {
        type: 'line' as const,
        xMin: mortgagePaidAge,
        xMax: mortgagePaidAge,
        borderColor: 'rgba(153, 102, 255, 0.5)',
        borderWidth: 2,
        label: {
          content: 'Mortgage Paid',
          enabled: true,
          position: 'top' as const,
          backgroundColor: 'rgba(153, 102, 255, 0.8)',
          color: 'white',
          padding: 4,
        },
      },
    ].filter(Boolean),
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
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
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce((sum, item) => {
              const value = item.dataset.label === 'Net Worth' 
                ? 0 
                : (item.raw as number);
              return sum + value;
            }, 0);
            return `\nTotal Net Worth: ${formatCurrency(total)}`;
          },
        },
      },
      annotation: {
        annotations: [...annotations.milestones, ...annotations.events],
      },
    },
    scales: {
      y: {
        stacked: true,
        ticks: {
          callback: (value) => formatCurrency(Number(value)).replace('£', ''),
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
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

  const getLatestValues = () => {
    const latest = data[data.length - 1];
    return {
      pension: latest.pensionFundBalance,
      savings: latest.totalSavings,
      mortgage: latest.mortgageRemainingBalance,
      total: latest.netWorth,
    };
  };

  const latestValues = getLatestValues();

  return (
    <Box>
      <Box className="mb-4 grid grid-cols-4 gap-4">
        {[
          { label: 'Pension', value: latestValues.pension, color: 'text-blue-600' },
          { label: 'Savings', value: latestValues.savings, color: 'text-green-600' },
          { label: 'Mortgage', value: -latestValues.mortgage, color: 'text-red-600' },
          { label: 'Net Worth', value: latestValues.total, color: 'text-indigo-600' },
        ].map(({ label, value, color }) => (
          <Box key={label} className="text-center p-2 bg-white rounded-lg shadow-sm">
            <Typography variant="caption" className="block text-gray-600">
              {label}
            </Typography>
            <Typography variant="subtitle1" className={`font-semibold ${color}`}>
              {formatCurrency(value)}
            </Typography>
          </Box>
        ))}
      </Box>
      <div style={{ height: '400px' }}>
        <Line data={chartData} options={options} />
      </div>
    </Box>
  );
};