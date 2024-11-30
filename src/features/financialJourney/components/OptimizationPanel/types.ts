import { OptimizationSuggestions } from '../../types';

export interface OptimizationPanelProps {
  suggestions: OptimizationSuggestions;
  startYear: number;
  currentYear: number;
  deathYear: number;
  failureAge?: number;
  netWorthByYear: { year: number; amount: number }[];
  onApplyPensionOptimization?: () => void;
  onApplyIsaOptimization?: () => void;
  onApplyExpenseOptimization?: () => void;
}