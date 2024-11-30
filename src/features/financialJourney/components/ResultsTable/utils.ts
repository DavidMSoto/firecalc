import { ColumnDefinition } from './types';
import { SimulationRow } from '../../types';

export const exportTableToCsv = (
  columns: ColumnDefinition[],
  rows: SimulationRow[]
) => {
  const headers = columns.map(col => col.label).join(',');
  
  const csvRows = rows.map(row => 
    columns.map(col => {
      const value = col.getValue ? col.getValue(row) : row[col.key as keyof SimulationRow];
      const formattedValue = typeof value === 'number' ? Math.round(value) : value;
      return typeof formattedValue === 'number' ? formattedValue : `"${formattedValue}"`;
    }).join(',')
  );
  
  const csvContent = [headers, ...csvRows].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'financial_simulation.csv';
  link.click();
};