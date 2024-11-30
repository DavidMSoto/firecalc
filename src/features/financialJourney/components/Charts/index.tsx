import React, { useState } from 'react';
import { Paper, Typography, Grid, Box, Tabs, Tab } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { SimulationRow } from '../../types';
import { MultiLineChart } from './MultiLineChart';
import { NetWorthChart } from './NetWorthChart';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { StackedAreaChart } from './StackedAreaChart';
import { PensionFundChart } from './PensionFundChart';
import { STRINGS } from '../../config/strings';

interface ChartsProps {
  data: SimulationRow[];
}

type ChartType = 'overview' | 'netWorth' | 'incomeExpense' | 'stackedArea' | 'pension';

export const Charts: React.FC<ChartsProps> = ({ data }) => {
  const [selectedChart, setSelectedChart] = useState<ChartType>('overview');

  const handleChartChange = (_event: React.SyntheticEvent, newValue: ChartType) => {
    setSelectedChart(newValue);
  };

  return (
    <Grid container spacing={3} className="mt-4">
      <Grid item xs={12}>
        <Paper className="p-4">
          <Box className="mb-4">
            <Typography variant="h6" className="mb-2">
              Financial Journey Visualization
            </Typography>
            <Tabs
              value={selectedChart}
              onChange={handleChartChange}
              aria-label="chart type selection"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                label="Complete Overview"
                value="overview"
                id="chart-tab-0"
                aria-controls="chart-tabpanel-0"
              />
              <Tab
                label="Net Worth Projection"
                value="netWorth"
                id="chart-tab-1"
                aria-controls="chart-tabpanel-1"
              />
              <Tab
                label="Income vs Expenses"
                value="incomeExpense"
                id="chart-tab-2"
                aria-controls="chart-tabpanel-2"
              />
              <Tab
                label="Income Breakdown"
                value="stackedArea"
                id="chart-tab-3"
                aria-controls="chart-tabpanel-3"
              />
              <Tab
                label="Pension Fund"
                value="pension"
                id="chart-tab-4"
                aria-controls="chart-tabpanel-4"
              />
            </Tabs>
          </Box>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedChart}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedChart === 'overview' && <MultiLineChart data={data} />}
              {selectedChart === 'netWorth' && <NetWorthChart data={data} />}
              {selectedChart === 'incomeExpense' && <IncomeExpenseChart data={data} />}
              {selectedChart === 'stackedArea' && <StackedAreaChart data={data} />}
              {selectedChart === 'pension' && <PensionFundChart data={data} />}
            </motion.div>
          </AnimatePresence>
        </Paper>
      </Grid>
    </Grid>
  );
};