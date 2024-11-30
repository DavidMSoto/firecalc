import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormSectionProps } from '../../types/forms';
import { STRINGS } from '../../config/strings';

export const PersonalInfoForm: React.FC<FormSectionProps> = ({
  inputs,
  onInputChange,
  errors,
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" className="mb-4 text-gray-700">
          {STRINGS.FORM.SECTIONS.PERSONAL_INFO}
        </Typography>
      </Grid>

      <Grid item xs={12} md={4}>
        <DatePicker
          label={STRINGS.FORM.LABELS.BIRTH_DATE}
          value={inputs.birthDate}
          onChange={(date) => onInputChange('birthDate', date as Date)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors.birthDate,
              helperText: errors.birthDate,
            },
          }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label={STRINGS.FORM.LABELS.DEATH_AGE}
          type="number"
          value={inputs.expectedDeathAge}
          onChange={(e) => onInputChange('expectedDeathAge', Number(e.target.value))}
          error={!!errors.expectedDeathAge}
          helperText={errors.expectedDeathAge || STRINGS.FORM.HELP_TEXT.LIFE_EXPECTANCY}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label={STRINGS.FORM.LABELS.RETIREMENT_AGE}
          type="number"
          value={inputs.retirementAge}
          onChange={(e) => onInputChange('retirementAge', Number(e.target.value))}
          error={!!errors.retirementAge}
          helperText={errors.retirementAge || STRINGS.FORM.HELP_TEXT.STATE_PENSION}
        />
      </Grid>
    </>
  );
};