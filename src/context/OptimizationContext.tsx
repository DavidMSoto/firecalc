import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { OptimizationSuggestions, SimulationRow, UserInputs } from '../types';
import { optimizeFinancialPlan } from '../utils/optimizations';

interface OptimizationState {
  suggestions: OptimizationSuggestions | null;
  isOptimizing: boolean;
}

type OptimizationAction =
  | { type: 'SET_SUGGESTIONS'; payload: OptimizationSuggestions }
  | { type: 'CLEAR_SUGGESTIONS' }
  | { type: 'SET_OPTIMIZING'; payload: boolean };

interface OptimizationContextType {
  state: OptimizationState;
  calculateOptimizations: (inputs: UserInputs, simulationRows: SimulationRow[]) => void;
  clearOptimizations: () => void;
}

const OptimizationContext = createContext<OptimizationContextType | undefined>(undefined);

const optimizationReducer = (state: OptimizationState, action: OptimizationAction): OptimizationState => {
  switch (action.type) {
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload, isOptimizing: false };
    case 'CLEAR_SUGGESTIONS':
      return { ...state, suggestions: null, isOptimizing: false };
    case 'SET_OPTIMIZING':
      return { ...state, isOptimizing: action.payload };
    default:
      return state;
  }
};

export const OptimizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(optimizationReducer, {
    suggestions: null,
    isOptimizing: false,
  });

  const calculateOptimizations = (inputs: UserInputs, simulationRows: SimulationRow[]) => {
    dispatch({ type: 'SET_OPTIMIZING', payload: true });
    try {
      const suggestions = optimizeFinancialPlan(inputs, simulationRows);
      dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });
    } catch (error) {
      console.error('Error calculating optimizations:', error);
      dispatch({ type: 'CLEAR_SUGGESTIONS' });
    }
  };

  const clearOptimizations = () => {
    dispatch({ type: 'CLEAR_SUGGESTIONS' });
  };

  return (
    <OptimizationContext.Provider
      value={{
        state,
        calculateOptimizations,
        clearOptimizations,
      }}
    >
      {children}
    </OptimizationContext.Provider>
  );
};

export const useOptimization = () => {
  const context = useContext(OptimizationContext);
  if (context === undefined) {
    throw new Error('useOptimization must be used within an OptimizationProvider');
  }
  return context;
};