import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { OptimizationProvider } from './features/financialJourney/context/OptimizationContext';
import { ProgressionProvider } from './features/financialJourney/context/ProgressionContext';
import { FinancialJourney } from './features/financialJourney/FinancialJourney';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ProgressionProvider>
        <OptimizationProvider>
          <FinancialJourney />
        </OptimizationProvider>
      </ProgressionProvider>
    </LocalizationProvider>
  );
}

export default App;