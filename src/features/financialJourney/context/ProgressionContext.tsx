import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type RatStage = 'poor' | 'working' | 'wealthy';

interface ProgressionState {
  ratStage: RatStage;
  netWorthMilestones: {
    [key: number]: boolean;
  };
  optimizationsApplied: number;
}

type ProgressionAction =
  | { type: 'UPDATE_RAT_STAGE'; payload: RatStage }
  | { type: 'ADD_MILESTONE'; payload: number }
  | { type: 'INCREMENT_OPTIMIZATIONS' };

interface ProgressionContextType {
  state: ProgressionState;
  updateRatStage: (stage: RatStage) => void;
  addMilestone: (amount: number) => void;
  incrementOptimizations: () => void;
}

const ProgressionContext = createContext<ProgressionContextType | undefined>(undefined);

const progressionReducer = (state: ProgressionState, action: ProgressionAction): ProgressionState => {
  switch (action.type) {
    case 'UPDATE_RAT_STAGE':
      return { ...state, ratStage: action.payload };
    case 'ADD_MILESTONE':
      return {
        ...state,
        netWorthMilestones: {
          ...state.netWorthMilestones,
          [action.payload]: true,
        },
      };
    case 'INCREMENT_OPTIMIZATIONS':
      return {
        ...state,
        optimizationsApplied: state.optimizationsApplied + 1,
      };
    default:
      return state;
  }
};

export const ProgressionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(progressionReducer, {
    ratStage: 'poor',
    netWorthMilestones: {},
    optimizationsApplied: 0,
  });

  const updateRatStage = (stage: RatStage) => {
    dispatch({ type: 'UPDATE_RAT_STAGE', payload: stage });
  };

  const addMilestone = (amount: number) => {
    dispatch({ type: 'ADD_MILESTONE', payload: amount });
  };

  const incrementOptimizations = () => {
    dispatch({ type: 'INCREMENT_OPTIMIZATIONS' });
  };

  return (
    <ProgressionContext.Provider
      value={{
        state,
        updateRatStage,
        addMilestone,
        incrementOptimizations,
      }}
    >
      {children}
    </ProgressionContext.Provider>
  );
};

export const useProgression = () => {
  const context = useContext(ProgressionContext);
  if (context === undefined) {
    throw new Error('useProgression must be used within a ProgressionProvider');
  }
  return context;
};