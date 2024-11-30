import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../../../common/utils/formatting';

interface ProgressBarProps {
  progress: number; // 0 to 1
  targetAmount: number;
  currentAmount: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  targetAmount,
  currentAmount,
}) => {
  const getProgressColor = (value: number) => {
    if (value >= 1) return 'bg-green-500';
    if (value >= 0.75) return 'bg-lime-500';
    if (value >= 0.5) return 'bg-yellow-500';
    if (value >= 0.25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Progress to FIRE</span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress * 100, 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${getProgressColor(progress)}`}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{formatCurrency(currentAmount)}</span>
        <span>Target: {formatCurrency(targetAmount)}</span>
      </div>
    </div>
  );
};