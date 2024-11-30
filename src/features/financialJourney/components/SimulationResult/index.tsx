import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { SimulationResult, UserInputs } from '../../types';
import { OptimizationPanel } from '../OptimizationPanel';
import { useOptimization } from '../../context/OptimizationContext';
import { useProgression } from '../../context/ProgressionContext';
import { RatIcon } from '../RatIcon';
import { STRINGS } from '../../config/strings';

interface SimulationResultProps {
  result: SimulationResult;
  onUpdateInputs: (updates: Partial<UserInputs>) => void;
}

export const SimulationResultMessage: React.FC<SimulationResultProps> = ({
  result,
  onUpdateInputs,
}) => {
  const { state: optimizationState, calculateOptimizations } = useOptimization();
  const { state: progressionState } = useProgression();
  const { hasWon, failureAge, rows } = result;

  const startYear = rows[0].year;
  const currentYear = new Date().getFullYear();
  const deathYear = rows[rows.length - 1].year;
  const netWorthByYear = rows.map(row => ({
    year: row.year,
    amount: row.netWorth,
  }));

  const handleOptimize = () => {
    calculateOptimizations(
      {
        birthDate: new Date(),
        expectedDeathAge: rows[rows.length - 1].age,
        retirementAge: rows.find(row => row.pensionWithdrawals > 0)?.age || 65,
        initialSavings: rows[0].totalSavings,
        salary: rows[0].totalIncome - rows[0].additionalIncome,
        additionalIncome: rows[0].additionalIncome,
        livingExpenses: rows[0].livingExpenses,
        mortgageRemainingLiability: rows[0].mortgageRemainingBalance,
        annualMortgageRepayment: rows[0].mortgageRepayment,
        currentNIYears: Math.min(rows[0].age - 18, 35),
        pensionContributionRate: (rows[0].pensionContributions / rows[0].totalIncome) * 100,
      },
      rows
    );
  };

  const handleApplyPensionOptimization = () => {
    if (optimizationState.suggestions?.pensionOptimization) {
      const { additionalContribution } = optimizationState.suggestions.pensionOptimization;
      onUpdateInputs({
        pensionContributionRate: additionalContribution / rows[0].totalIncome * 100,
      });
    }
  };

  const handleApplyExpenseOptimization = () => {
    if (optimizationState.suggestions?.expenseOptimization) {
      const { recommendedReduction } = optimizationState.suggestions.expenseOptimization;
      onUpdateInputs({
        livingExpenses: rows[0].livingExpenses - recommendedReduction,
      });
    }
  };

  const handleApplyIsaOptimization = () => {
    if (optimizationState.suggestions?.isaOptimization) {
      const { recommendedContribution } = optimizationState.suggestions.isaOptimization;
      onUpdateInputs({
        initialSavings: rows[0].totalSavings + recommendedContribution,
      });
    }
  };

  return (
    <>
      <Paper
        className={`p-6 mt-6 flex items-center gap-4 transition-all duration-500 ease-in-out ${
          hasWon ? 'bg-green-50' : 'bg-red-50'
        }`}
      >
        <RatIcon stage={progressionState.ratStage} className="w-16 h-16" />
        <div className="flex-grow">
          <Typography variant="h5" className={hasWon ? 'text-green-700' : 'text-red-700'}>
            {hasWon
              ? STRINGS.SIMULATION.SUCCESS.TITLE
              : STRINGS.SIMULATION.FAILURE.TITLE.replace('{age}', String(failureAge))}
          </Typography>
          <Typography className={hasWon ? 'text-green-600' : 'text-red-600'}>
            {hasWon
              ? STRINGS.SIMULATION.SUCCESS.MESSAGE
              : STRINGS.SIMULATION.FAILURE.MESSAGE}
          </Typography>
        </div>
        {!hasWon && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleOptimize}
            className="ml-4 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {STRINGS.FORM.BUTTONS.OPTIMIZE}
          </Button>
        )}
      </Paper>
      {optimizationState.suggestions && (
        <OptimizationPanel
          suggestions={optimizationState.suggestions}
          startYear={startYear}
          currentYear={currentYear}
          deathYear={deathYear}
          failureAge={failureAge}
          netWorthByYear={netWorthByYear}
          onApplyPensionOptimization={handleApplyPensionOptimization}
          onApplyIsaOptimization={handleApplyIsaOptimization}
          onApplyExpenseOptimization={handleApplyExpenseOptimization}
        />
      )}
    </>
  );
};