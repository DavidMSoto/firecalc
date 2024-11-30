import { useMemo } from 'react';
import { SimulationRow } from '../../types';
import { formatCurrency } from '../../../../common/utils/formatting';
import { ColumnDefinition } from './types';
import { getTooltipContent } from './tooltips';
import { STRINGS } from '../../config/strings';

export const useTableColumns = (rows: SimulationRow[]) => {
  return useMemo(() => {
    const hasNonZeroValues = (key: keyof SimulationRow) => 
      rows.some(row => row[key] !== 0);

    const baseColumns: ColumnDefinition[] = [
      {
        key: 'year',
        label: STRINGS.CHARTS.LABELS.YEAR,
        tooltip: STRINGS.TOOLTIPS.YEAR,
      },
      {
        key: 'age',
        label: STRINGS.CHARTS.LABELS.AGE,
        tooltip: STRINGS.TOOLTIPS.AGE,
      },
      {
        key: 'totalIncome',
        label: STRINGS.CHARTS.LABELS.TOTAL_INCOME,
        tooltip: getTooltipContent.totalIncome,
        format: formatCurrency,
      },
      {
        key: 'totalTax',
        label: STRINGS.CHARTS.LABELS.TAX,
        tooltip: getTooltipContent.totalTax,
        format: formatCurrency,
        getValue: (row) => row.incomeTax + row.nationalInsurance,
      },
      {
        key: 'netIncoming',
        label: STRINGS.CHARTS.LABELS.NET_INCOME,
        tooltip: getTooltipContent.netIncoming,
        format: formatCurrency,
      }
    ];

    const optionalColumns: ColumnDefinition[] = [
      {
        key: 'pensionContributions',
        label: STRINGS.CHARTS.LABELS.PENSION_CONTRIBUTIONS,
        tooltip: getTooltipContent.pensionContributions,
        format: formatCurrency,
      },
      {
        key: 'pensionFundBalance',
        label: STRINGS.CHARTS.LABELS.PENSION_BALANCE,
        tooltip: getTooltipContent.pensionFundBalance,
        format: formatCurrency,
      },
      {
        key: 'statePension',
        label: STRINGS.CHARTS.LABELS.STATE_PENSION,
        tooltip: getTooltipContent.statePension,
        format: formatCurrency,
        alwaysShow: true,
      },
      {
        key: 'livingExpenses',
        label: STRINGS.CHARTS.LABELS.LIVING_EXPENSES,
        tooltip: getTooltipContent.livingExpenses,
        format: formatCurrency,
      },
      {
        key: 'mortgageRepayment',
        label: STRINGS.CHARTS.LABELS.MORTGAGE_PAYMENT,
        tooltip: getTooltipContent.mortgageRepayment,
        format: formatCurrency,
      },
      {
        key: 'mortgageRemainingBalance',
        label: STRINGS.CHARTS.LABELS.MORTGAGE_BALANCE,
        tooltip: getTooltipContent.mortgageRemainingBalance,
        format: formatCurrency,
      },
      {
        key: 'cashFlow',
        label: STRINGS.CHARTS.LABELS.CASH_FLOW,
        tooltip: getTooltipContent.cashFlow,
        format: formatCurrency,
      },
      {
        key: 'totalSavings',
        label: STRINGS.CHARTS.LABELS.TOTAL_SAVINGS,
        tooltip: getTooltipContent.totalSavings,
        format: formatCurrency,
      },
      {
        key: 'netWorth',
        label: STRINGS.CHARTS.LABELS.NET_WORTH,
        tooltip: getTooltipContent.netWorth,
        format: formatCurrency,
      }
    ];

    const filteredColumns = optionalColumns.filter(column => {
      if (column.getValue || column.alwaysShow) return true;
      return hasNonZeroValues(column.key as keyof SimulationRow);
    });

    return [...baseColumns, ...filteredColumns];
  }, [rows]);
};