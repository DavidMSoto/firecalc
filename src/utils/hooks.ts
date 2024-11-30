import { useState, useCallback } from 'react';
import { UserInputs } from '../types';
import { validateInputs } from '../services/validation';

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Partial<Record<keyof UserInputs, string>>>({});

  const validate = useCallback((inputs: UserInputs) => {
    const validation = validateInputs(inputs);
    setErrors(validation.errors);
    return validation.isValid;
  }, []);

  return { errors, validate, setErrors };
};

export const useInputChange = (
  setInputs: React.Dispatch<React.SetStateAction<UserInputs>>
) => {
  return useCallback((field: keyof UserInputs, value: number | Date) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  }, [setInputs]);
};