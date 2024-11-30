import React from 'react';
import { Grid, TextField, Typography, InputAdornment } from '@mui/material';
import { FormSectionProps } from '../../types/forms';
import { STRINGS } from '../../config/strings';

export const PensionForm: React.FC<FormSectionProps> = ({
  inputs,
  onInputChange,
  errors,
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" className="mb-4 mt-4 text-gray-700">
          {STRINGS.FORM.SECTIONS.PENSION_INFO}
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={STRINGS.FORM.LABELS.NI_YEARS}
          type="number"
          value={inputs.currentNIYears}
          onChange={(e) => onInputChange('currentNIYears', Number(e.target.value))}
          error={!!errors.currentNIYears}
          helperText={errors.currentNIYears || STRINGS.FORM.HELP_TEXT.NI_YEARS}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={STRINGS.FORM.LABELS.PENSION_RATE}
          type="number"
          value={inputs.pensionContributionRate}
          onChange={(e) => onInputChange('pensionContributionRate', Number(e.target.value))}
          error={!!errors.pensionContributionRate}
          helperText={errors.pensionContributionRate || STRINGS.FORM.HELP_TEXT.PENSION_RATE}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
      </Grid>
    </>
  );
};