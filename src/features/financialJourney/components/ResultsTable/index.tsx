import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Button,
} from '@mui/material';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { SimulationRow } from '../../types';
import { useTableColumns } from './useTableColumns';
import { exportTableToCsv } from './utils';
import { ProgressBar } from '../ProgressBar';
import { STRINGS } from '../../config/strings';

interface ResultsTableProps {
  rows: SimulationRow[];
}

const getCellColor = (value: number, type: 'income' | 'expense' | 'balance') => {
  if (type === 'expense' && value > 0) return 'bg-red-50 text-red-700';
  if (type === 'income' && value > 0) return 'bg-green-50 text-green-700';
  
  if (type === 'balance') {
    if (value > 1000000) return 'bg-emerald-50 text-emerald-700';
    if (value > 500000) return 'bg-green-50 text-green-700';
    if (value > 100000) return 'bg-lime-50 text-lime-700';
    if (value > 0) return 'bg-yellow-50 text-yellow-700';
    return 'bg-red-50 text-red-700';
  }

  return '';
};

const getColumnType = (key: string): 'income' | 'expense' | 'balance' => {
  if (['totalIncome', 'netIncoming', 'statePension'].includes(key)) return 'income';
  if (['livingExpenses', 'mortgageRepayment', 'incomeTax'].includes(key)) return 'expense';
  return 'balance';
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ rows }) => {
  const columns = useTableColumns(rows);
  const targetAmount = rows[0].livingExpenses * 25; // 4% rule

  return (
    <Paper className="mt-6">
      <div className="p-4 flex justify-between items-center">
        <Typography variant="h6">Financial Journey Progress</Typography>
        <Button
          variant="outlined"
          startIcon={<Download size={16} />}
          onClick={() => exportTableToCsv(columns, rows)}
        >
          {STRINGS.CHARTS.LABELS.EXPORT}
        </Button>
      </div>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <Tooltip
                    title={
                      <Typography style={{ whiteSpace: 'pre-line' }}>
                        {typeof column.tooltip === 'function'
                          ? column.tooltip(rows[0], 0, rows)
                          : column.tooltip}
                      </Typography>
                    }
                    arrow
                    placement="top"
                  >
                    <span className="font-semibold cursor-help">
                      {column.label}
                    </span>
                  </Tooltip>
                </TableCell>
              ))}
              <TableCell>FIRE Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const isRetired = row.pensionWithdrawals > 0;
              return (
                <motion.tr
                  key={row.year}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`
                    transition-all duration-300 ease-in-out
                    hover:bg-gray-100
                    ${index % 2 === 0 ? 'bg-gray-50' : ''}
                    ${isRetired ? 'bg-orange-50' : ''}
                  `}
                >
                  {columns.map((column) => {
                    const value = column.getValue ? column.getValue(row) : row[column.key as keyof SimulationRow];
                    const columnType = getColumnType(column.key);
                    const colorClass = typeof value === 'number' ? getCellColor(value, columnType) : '';
                    const formattedValue = column.format
                      ? column.format(value as number)
                      : value;

                    return (
                      <TableCell
                        key={column.key}
                        className={`
                          transition-all duration-300 ease-in-out
                          ${colorClass}
                        `}
                      >
                        <Tooltip
                          title={
                            <Typography style={{ whiteSpace: 'pre-line' }}>
                              {typeof column.tooltip === 'function'
                                ? column.tooltip(row, index, rows)
                                : column.tooltip}
                            </Typography>
                          }
                          arrow
                          placement="top"
                        >
                          <span className="cursor-help">
                            {formattedValue}
                          </span>
                        </Tooltip>
                      </TableCell>
                    );
                  })}
                  <TableCell className="min-w-[200px]">
                    <ProgressBar
                      progress={row.netWorth / targetAmount}
                      targetAmount={targetAmount}
                      currentAmount={row.netWorth}
                    />
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};