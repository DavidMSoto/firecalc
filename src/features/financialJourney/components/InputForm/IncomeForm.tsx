import React from 'react';
import { Grid, TextField, Typography, InputAdornment } from '@mui/material';
import { FormSectionProps } from '../../types/forms';
import { STRINGS } from '../../config/strings';

export const IncomeForm: React.FC<FormSectionProps> = ({
  inputs,
  onInputChange,
  errors,
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" className="mb-4 mt-4 text-gray-700">
          {STRINGS.FORM.SECTIONS.INCOME_SAVINGS}
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={STRINGS.FORM.LABELS.SALARY}
          type="number"
          value={inputs.salary}
          onChange={(e) => onInputChange('salary', Number(e.target.value))}
          error={!!errors.salary}
          helperText={errors.salary}
          InputProps={{
            startAdornment: <InputAdornment position="start">£</InputAdornment>,
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={STRINGS.FORM.LABELS.ADDITIONAL_INCOME}
          type="number"
          value={inputs.additionalIncome}
          onChange={(e) => onInputChange('additionalIncome', Number(e.target.value))}
          error={!!errors.additionalIncome}
          helperText={errors.additionalIncome || STRINGS.FORM.HELP_TEXT.ADDITIONAL_INCOME}
          InputProps={{
            startAdornment: <InputAdornment position="start">£</InputAdornment>,
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={STRINGS.FORM.LABELS.INITIAL_SAVINGS}
          type="number"
          value={inputs.initialSavings}
          onChange={(e) => onInputChange('initialSavings', Number(e.target.value))}
          error={!!errors.initialSavings}
          helperText={errors.initialSavings || STRINGS.FORM.HELP_TEXT.SAVINGS}
          InputProps={{
            startAdornment: <InputAdornment position="start">£</InputAdornment>,
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={STRINGS.FORM.LABELS.LIVING_EXPENSES}
          type="number"
          value={inputs.livingExpenses}
          onChange={(e) => onInputChange('livingExpenses', Number(e.target.value))}
          error={!!errors.livingExpenses}
          helperText={errors.livingExpenses || STRINGS.FORM.HELP_TEXT.EXPENSES}
          InputProps={{
            startAdornment: <InputAdornment position="start">£</InputAdornment>,
          }}
        />
      </Grid>
    </>
  );
};