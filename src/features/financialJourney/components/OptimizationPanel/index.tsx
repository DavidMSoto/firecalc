import React, { useState } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  IconButton,
  Button,
  Box,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { OptimizationSuggestions } from '../../types';
import { OptimizationPanelProps } from './types';
import { ProgressIndicator } from './ProgressIndicator';
import { formatCurrency } from '../../../../common/utils/formatting';
import { STRINGS } from '../../config/strings';

export const OptimizationPanel: React.FC<OptimizationPanelProps> = ({
  suggestions,
  startYear,
  currentYear,
  deathYear,
  failureAge,
  netWorthByYear,
  onApplyPensionOptimization,
  onApplyIsaOptimization,
  onApplyExpenseOptimization,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Record<string, boolean>>({});

  const handleApply = (key: string, callback?: () => void) => {
    if (callback) {
      callback();
      setAppliedSuggestions(prev => ({ ...prev, [key]: true }));
    }
  };

  return (
    <Paper className="p-4 mt-6 bg-blue-50">
      <ProgressIndicator
        startYear={startYear}
        currentYear={currentYear}
        deathYear={deathYear}
        failureAge={failureAge}
        netWorthByYear={netWorthByYear}
      />

      <Box className="flex items-center justify-between mb-4">
        <Typography variant="h6" className="text-blue-900">
          {STRINGS.OPTIMIZATION.TITLE}
        </Typography>
        <IconButton onClick={() => setExpanded(!expanded)} size="small">
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <List>
          {suggestions.expenseOptimization && (
            <ListItem className="bg-white rounded-lg mb-2 shadow-sm">
              <ListItemIcon>
                <Wallet className="text-red-600" />
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" className="font-semibold">
                  {STRINGS.OPTIMIZATION.EXPENSE.TITLE}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {suggestions.expenseOptimization.message}
                </Typography>
                <Box className="mt-2">
                  <Typography variant="subtitle2" className="font-semibold">
                    {STRINGS.OPTIMIZATION.EXPENSE.MONTHLY_SAVINGS}
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      £{(suggestions.expenseOptimization.recommendedReduction / 12).toFixed(2)} {STRINGS.OPTIMIZATION.EXPENSE.PER_MONTH}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {STRINGS.OPTIMIZATION.EXPENSE.REDUCTION_TARGET}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
              <ListItemSecondaryAction>
                {appliedSuggestions.expense ? (
                  <Box className="flex items-center text-green-600">
                    <Check size={16} className="mr-1" />
                    <Typography variant="body2">{STRINGS.OPTIMIZATION.APPLIED}</Typography>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleApply('expense', onApplyExpenseOptimization)}
                  >
                    {STRINGS.OPTIMIZATION.BUTTONS.APPLY}
                  </Button>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          )}

          {suggestions.pensionOptimization && (
            <ListItem className="bg-white rounded-lg mb-2 shadow-sm">
              <ListItemIcon>
                <PiggyBank className="text-blue-600" />
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" className="font-semibold">
                  {STRINGS.OPTIMIZATION.PENSION.TITLE}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {suggestions.pensionOptimization.message}
                </Typography>
              </Box>
              <ListItemSecondaryAction>
                {appliedSuggestions.pension ? (
                  <Box className="flex items-center text-green-600">
                    <Check size={16} className="mr-1" />
                    <Typography variant="body2">{STRINGS.OPTIMIZATION.APPLIED}</Typography>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleApply('pension', onApplyPensionOptimization)}
                  >
                    {STRINGS.OPTIMIZATION.BUTTONS.APPLY}
                  </Button>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          )}

          {suggestions.isaOptimization && (
            <ListItem className="bg-white rounded-lg mb-2 shadow-sm">
              <ListItemIcon>
                <TrendingUp className="text-green-600" />
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" className="font-semibold">
                  {STRINGS.OPTIMIZATION.ISA.TITLE}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {suggestions.isaOptimization.message}
                </Typography>
              </Box>
              <ListItemSecondaryAction>
                {appliedSuggestions.isa ? (
                  <Box className="flex items-center text-green-600">
                    <Check size={16} className="mr-1" />
                    <Typography variant="body2">{STRINGS.OPTIMIZATION.APPLIED}</Typography>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleApply('isa', onApplyIsaOptimization)}
                  >
                    {STRINGS.OPTIMIZATION.BUTTONS.APPLY}
                  </Button>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          )}
        </List>
      </Collapse>
    </Paper>
  );
};