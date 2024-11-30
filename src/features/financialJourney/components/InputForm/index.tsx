import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { UserInputs } from '../../types';
import { PersonalInfoForm } from './PersonalInfoForm';
import { IncomeForm } from './IncomeForm';
import { PensionForm } from './PensionForm';
import { STRINGS } from '../../config/strings';

interface InputFormProps {
  inputs: UserInputs;
  onInputChange: (field: keyof UserInputs, value: number | Date) => void;
  errors: Partial<Record<keyof UserInputs, string>>;
  onSimulate: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  inputs,
  onInputChange,
  errors,
  onSimulate,
}) => {
  return (
    <Paper className="p-6">
      <Typography variant="h5" className="mb-6 text-center">
        {STRINGS.APP.TITLE}
      </Typography>

      <Alert severity="info" className="mb-6">
        {STRINGS.APP.INFO_MESSAGE}
      </Alert>

      <Grid container spacing={4}>
        <PersonalInfoForm
          inputs={inputs}
          onInputChange={onInputChange}
          errors={errors}
        />
        
        <IncomeForm
          inputs={inputs}
          onInputChange={onInputChange}
          errors={errors}
        />

        <PensionForm
          inputs={inputs}
          onInputChange={onInputChange}
          errors={errors}
        />
      </Grid>

      <Box className="mt-8 text-center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onSimulate}
          className="px-8 py-3"
        >
          {STRINGS.FORM.BUTTONS.CALCULATE}
        </Button>
      </Box>
    </Paper>
  );
};