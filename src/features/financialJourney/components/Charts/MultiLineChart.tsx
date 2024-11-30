import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
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
  Legend
);

interface MultiLineChartProps {
  data: SimulationRow[];
}

interface DataSeries {
  id: string;
  label: string;
  color: string;
  getValue: (row: SimulationRow) => number;
}

const dataSeries: DataSeries[] = [
  {
    id: 'totalIncome',
    label: STRINGS.CHARTS.LABELS.TOTAL_INCOME,
    color: 'rgb(59, 130, 246)',
    getValue: (row) => row.totalIncome,
  },
  {
    id: 'tax',
    label: STRINGS.CHARTS.LABELS.TAX,
    color: 'rgb(239, 68, 68)',
    getValue: (row) => row.incomeTax + row.nationalInsurance,
  },
  {
    id: 'netIncome',
    label: STRINGS.CHARTS.LABELS.NET_INCOME,
    color: 'rgb(34, 197, 94)',
    getValue: (row) => row.netIncoming,
  },
  {
    id: 'livingExpenses',
    label: STRINGS.CHARTS.LABELS.LIVING_EXPENSES,
    color: 'rgb(245, 158, 11)',
    getValue: (row) => row.livingExpenses,
  },
  {
    id: 'cashFlow',
    label: STRINGS.CHARTS.LABELS.CASH_FLOW,
    color: 'rgb(168, 85, 247)',
    getValue: (row) => row.cashFlow,
  },
  {
    id: 'netWorth',
    label: STRINGS.CHARTS.LABELS.NET_WORTH,
    color: 'rgb(99, 102, 241)',
    getValue: (row) => row.netWorth,
  },
  {
    id: 'pensionBalance',
    label: STRINGS.CHARTS.LABELS.PENSION_BALANCE,
    color: 'rgb(14, 165, 233)',
    getValue: (row) => row.pensionFundBalance,
  },
];

export const MultiLineChart: React.FC<MultiLineChartProps> = ({ data }) => {
  const [visibleSeries, setVisibleSeries] = useState<Set<string>>(
    new Set(['totalIncome', 'netIncome', 'livingExpenses', 'netWorth'])
  );

  const handleSeriesToggle = (seriesId: string) => {
    setVisibleSeries((prev) => {
      const next = new Set(prev);
      if (next.has(seriesId)) {
        next.delete(seriesId);
      } else {
        next.add(seriesId);
      }
      return next;
    });
  };

  const chartData = {
    labels: data.map(row => row.age),
    datasets: dataSeries
      .filter(series => visibleSeries.has(series.id))
      .map(series => ({
        label: series.label,
        data: data.map(row => series.getValue(row)),
        borderColor: series.color,
        backgroundColor: `${series.color.replace('rgb', 'rgba').replace(')', ', 0.1)')}`,
        tension: 0.4,
        borderWidth: series.id === 'netWorth' ? 2 : 1,
      })),
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
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
        ticks: {
          callback: (value) => formatCurrency(Number(value)).replace('£', ''),
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        title: {
          display: true,
          text: STRINGS.CHARTS.LABELS.AGE,
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <Box>
      <Box className="mb-4">
        <Typography variant="subtitle2" className="mb-2">
          Select metrics to display:
        </Typography>
        <FormGroup row>
          {dataSeries.map(series => (
            <FormControlLabel
              key={series.id}
              control={
                <Checkbox
                  checked={visibleSeries.has(series.id)}
                  onChange={() => handleSeriesToggle(series.id)}
                  sx={{
                    color: series.color,
                    '&.Mui-checked': {
                      color: series.color,
                    },
                  }}
                />
              }
              label={series.label}
            />
          ))}
        </FormGroup>
      </Box>
      <div style={{ height: '400px' }}>
        <Line data={chartData} options={options} />
      </div>
    </Box>
  );
};