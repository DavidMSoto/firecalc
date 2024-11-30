import { UserInputs, SimulationRow, OptimizationSuggestions } from '../types';
import { formatCurrency } from '../../../common/utils/formatting';
import { 
  INFLATION_RATE,
  ISA_ANNUAL_LIMIT,
  HIGHER_RATE_THRESHOLD,
  TARGET_EXPENSE_REDUCTION,
  MAX_PENSION_CONTRIBUTION,
  PENSION_EMPLOYER_CONTRIBUTION,
  MAX_SALARY_PENSION_CONTRIBUTION,
  BASIC_RATE,
  HIGHER_RATE
} from '../constants';

const calculatePensionOptimization = (salary: number, currentPensionRate: number) => {
  const currentEmployeeContribution = salary * (currentPensionRate / 100);
  const employerContribution = salary * PENSION_EMPLOYER_CONTRIBUTION;
  const totalCurrentContribution = currentEmployeeContribution + employerContribution;

  if (salary > HIGHER_RATE_THRESHOLD) {
    const additionalContribution = Math.min(
      MAX_PENSION_CONTRIBUTION - totalCurrentContribution,
      (salary - HIGHER_RATE_THRESHOLD) * MAX_SALARY_PENSION_CONTRIBUTION
    );

    if (additionalContribution > 0) {
      const taxSaving = additionalContribution * (HIGHER_RATE - BASIC_RATE);
      return {
        additionalContribution,
        taxSaving,
        message: `Increasing your pension contribution by ${formatCurrency(additionalContribution)} 
          could save you ${formatCurrency(taxSaving)} in tax through salary sacrifice.`
      };
    }
  }
  return null;
};

const calculateIsaOptimization = (rows: SimulationRow[]) => {
  const averageMonthlySurplus = rows
    .slice(0, 12)
    .reduce((sum, row) => sum + Math.max(0, row.cashFlow), 0) / 12;

  if (averageMonthlySurplus > 100) {
    const annualContribution = Math.min(averageMonthlySurplus * 12, ISA_ANNUAL_LIMIT);
    const fiveYearGrowth = annualContribution * 5 * Math.pow(1.05, 5);
    
    return {
      recommendedContribution: annualContribution,
      projectedGrowth: fiveYearGrowth,
      message: `With your monthly surplus of ${formatCurrency(averageMonthlySurplus)}, 
        you could contribute ${formatCurrency(annualContribution)} annually to an ISA. 
        This could grow to ${formatCurrency(fiveYearGrowth)} in 5 years with 5% annual returns.`
    };
  }
  return null;
};

const calculateExpenseOptimization = (livingExpenses: number) => {
  const monthlyReduction = TARGET_EXPENSE_REDUCTION / 12;
  const tenYearSavings = Array.from({ length: 10 })
    .reduce((acc, _, i) => acc + TARGET_EXPENSE_REDUCTION * Math.pow(1 + INFLATION_RATE, i), 0);

  return {
    recommendedReduction: TARGET_EXPENSE_REDUCTION,
    impact: TARGET_EXPENSE_REDUCTION * 12,
    message: `Reducing your monthly expenses by ${formatCurrency(monthlyReduction)} could save you 
      ${formatCurrency(TARGET_EXPENSE_REDUCTION)} annually. Over 10 years, this could add up to 
      ${formatCurrency(tenYearSavings)} with inflation adjustments.`,
    categories: [
      {
        name: 'Utilities',
        amount: monthlyReduction * 0.3,
        description: 'Switch providers and improve energy efficiency'
      },
      {
        name: 'Groceries',
        amount: monthlyReduction * 0.3,
        description: 'Meal planning and bulk buying'
      },
      {
        name: 'Subscriptions',
        amount: monthlyReduction * 0.2,
        description: 'Review and optimize monthly subscriptions'
      },
      {
        name: 'Transportation',
        amount: monthlyReduction * 0.2,
        description: 'Optimize commuting costs and fuel efficiency'
      }
    ]
  };
};

export const optimizeFinancialPlan = (
  inputs: UserInputs,
  simulationRows: SimulationRow[]
): OptimizationSuggestions => {
  try {
    return {
      pensionOptimization: calculatePensionOptimization(inputs.salary, inputs.pensionContributionRate),
      isaOptimization: calculateIsaOptimization(simulationRows),
      expenseOptimization: calculateExpenseOptimization(inputs.livingExpenses)
    };
  } catch (error) {
    console.error('Error calculating optimizations:', error);
    return {
      pensionOptimization: null,
      isaOptimization: null,
      expenseOptimization: null
    };
  }
};