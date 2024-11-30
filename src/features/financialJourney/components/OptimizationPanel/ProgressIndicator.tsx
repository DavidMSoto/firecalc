import React, { useMemo } from 'react';
import { Box, LinearProgress, Typography, Tooltip } from '@mui/material';
import { formatCurrency } from '../../../../common/utils/formatting';

interface ProgressIndicatorProps {
  startYear: number;
  currentYear: number;
  deathYear: number;
  failureAge?: number;
  netWorthByYear: { year: number; amount: number }[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  startYear,
  currentYear,
  deathYear,
  failureAge,
  netWorthByYear = [],
}) => {
  const totalYears = deathYear - startYear;
  const survivableYears = failureAge 
    ? failureAge - startYear 
    : deathYear - startYear;
  const survivalProgress = (survivableYears / totalYears) * 100;
  const timeProgress = ((currentYear - startYear) / totalYears) * 100;

  const currentNetWorth = useMemo(() => {
    const currentYearData = netWorthByYear.find(y => y.year === currentYear);
    if (!currentYearData) {
      const nearestYear = netWorthByYear
        .reduce((prev, curr) => 
          Math.abs(curr.year - currentYear) < Math.abs(prev.year - currentYear) ? curr : prev
        );
      return nearestYear?.amount ?? 0;
    }
    return currentYearData.amount;
  }, [netWorthByYear, currentYear]);

  const getProgressColor = (value: number) => {
    if (value >= 90) return 'success';
    if (value >= 70) return 'info';
    if (value >= 50) return 'warning';
    return 'error';
  };

  const formatYearRange = (start: number, end: number) => {
    return `${end - start} years (${start} → ${end})`;
  };

  return (
    <Box className="space-y-4">
      {/* Financial Survival Progress */}
      <Box>
        <Box className="flex justify-between mb-1">
          <Typography variant="body2" className="font-medium">
            Financial Independence Progress
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {Math.round(survivalProgress)}%
          </Typography>
        </Box>
        <Tooltip
          title={
            failureAge
              ? `Financial resources depleted at age ${failureAge}`
              : 'Successfully funded through expected lifespan'
          }
          arrow
        >
          <LinearProgress
            variant="determinate"
            value={Math.min(100, Math.max(0, survivalProgress))}
            color={getProgressColor(survivalProgress)}
            className="h-3 rounded-full"
          />
        </Tooltip>
        <Box className="flex justify-between mt-1">
          <Typography variant="caption" color="textSecondary">
            Survivable: {formatYearRange(startYear, startYear + survivableYears)}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Expected: {formatYearRange(startYear, deathYear)}
          </Typography>
        </Box>
      </Box>

      {/* Time Progress */}
      <Box>
        <Box className="flex justify-between mb-1">
          <Typography variant="body2" className="font-medium">
            Journey Timeline
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {Math.round(timeProgress)}%
          </Typography>
        </Box>
        <Tooltip
          title={`Current net worth: ${formatCurrency(currentNetWorth)}`}
          arrow
        >
          <LinearProgress
            variant="determinate"
            value={Math.min(100, Math.max(0, timeProgress))}
            color="info"
            className="h-2 rounded-full"
          />
        </Tooltip>
        <Typography variant="caption" color="textSecondary" className="mt-1 block">
          {deathYear - currentYear} years remaining in simulation
        </Typography>
      </Box>
    </Box>
  );
};