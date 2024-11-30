import React, { useState } from 'react';
import { Container } from '@mui/material';
import { UserInputs, SimulationResult } from './types';
import { simulateFinancialJourney } from './utils/calculations';
import { useFormValidation, useInputChange } from './hooks/useFormValidation';
import { InputForm } from './components/InputForm';
import { ResultsTable } from './components/ResultsTable';
import { Charts } from './components/Charts';
import { SimulationResultMessage } from './components/SimulationResult';
import { useOptimization } from './context/OptimizationContext';
import { useProgression } from './context/ProgressionContext';
import {
  DEFAULT_BIRTH_YEAR,
  DEFAULT_BIRTH_MONTH,
  DEFAULT_BIRTH_DAY,
  DEFAULT_DEATH_AGE,
  DEFAULT_RETIREMENT_AGE,
  DEFAULT_INITIAL_SAVINGS,
  DEFAULT_SALARY,
  DEFAULT_EXPENSES,
  DEFAULT_MORTGAGE,
  DEFAULT_MORTGAGE_PAYMENT,
  DEFAULT_NI_YEARS,
  DEFAULT_PENSION_RATE,
} from './constants';

const initialInputs: UserInputs = {
  birthDate: new Date(DEFAULT_BIRTH_YEAR, DEFAULT_BIRTH_MONTH, DEFAULT_BIRTH_DAY),
  expectedDeathAge: DEFAULT_DEATH_AGE,
  retirementAge: DEFAULT_RETIREMENT_AGE,
  initialSavings: DEFAULT_INITIAL_SAVINGS,
  salary: DEFAULT_SALARY,
  additionalIncome: 0,
  livingExpenses: DEFAULT_EXPENSES,
  mortgageRemainingLiability: DEFAULT_MORTGAGE,
  annualMortgageRepayment: DEFAULT_MORTGAGE_PAYMENT,
  currentNIYears: DEFAULT_NI_YEARS,
  pensionContributionRate: DEFAULT_PENSION_RATE,
};

export const FinancialJourney: React.FC = () => {
  const [inputs, setInputs] = useState<UserInputs>(initialInputs);
  const { errors, validate } = useFormValidation();
  const [result, setResult] = useState<SimulationResult | null>(null);
  const { clearOptimizations } = useOptimization();
  const { updateRatStage } = useProgression();
  
  const handleInputChange = useInputChange(setInputs);

  const handleSimulate = () => {
    if (validate(inputs)) {
      clearOptimizations();
      const simulationResult = simulateFinancialJourney(inputs);
      setResult(simulationResult);

      // Update rat stage based on net worth
      const netWorth = simulationResult.rows[simulationResult.rows.length - 1].netWorth;
      if (netWorth > 1000000) {
        updateRatStage('wealthy');
      } else if (netWorth > 100000) {
        updateRatStage('working');
      } else {
        updateRatStage('poor');
      }
    }
  };

  const handleUpdateInputs = (updates: Partial<UserInputs>) => {
    setInputs(prev => {
      const newInputs = { ...prev, ...updates };
      const simulationResult = simulateFinancialJourney(newInputs);
      setResult(simulationResult);
      return newInputs;
    });
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <InputForm
        inputs={inputs}
        onInputChange={handleInputChange}
        errors={errors}
        onSimulate={handleSimulate}
      />

      {result && (
        <>
          <SimulationResultMessage
            result={result}
            onUpdateInputs={handleUpdateInputs}
          />
          <Charts data={result.rows} />
          <ResultsTable rows={result.rows} />
        </>
      )}
    </Container>
  );
};