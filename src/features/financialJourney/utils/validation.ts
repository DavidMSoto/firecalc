import { UserInputs } from '../types';
import { FULL_NI_YEARS } from '../constants';
import { STRINGS } from '../config/strings';

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof UserInputs, string>>;
}

export const validateInputs = (inputs: UserInputs): ValidationResult => {
  const errors: Partial<Record<keyof UserInputs, string>> = {};

  if (!inputs.birthDate) {
    errors.birthDate = STRINGS.ERRORS.VALIDATION.REQUIRED.replace('{field}', STRINGS.FORM.LABELS.BIRTH_DATE);
  }

  if (inputs.expectedDeathAge <= 0) {
    errors.expectedDeathAge = STRINGS.ERRORS.VALIDATION.POSITIVE.replace('{field}', STRINGS.FORM.LABELS.DEATH_AGE);
  }

  if (inputs.retirementAge <= 0) {
    errors.retirementAge = STRINGS.ERRORS.VALIDATION.POSITIVE.replace('{field}', STRINGS.FORM.LABELS.RETIREMENT_AGE);
  }

  if (inputs.retirementAge >= inputs.expectedDeathAge) {
    errors.retirementAge = STRINGS.ERRORS.VALIDATION.RETIREMENT_AGE;
  }

  if (inputs.salary < 0) {
    errors.salary = STRINGS.ERRORS.VALIDATION.NO_NEGATIVE.replace('{field}', STRINGS.FORM.LABELS.SALARY);
  }

  if (inputs.additionalIncome < 0) {
    errors.additionalIncome = STRINGS.ERRORS.VALIDATION.NO_NEGATIVE.replace('{field}', STRINGS.FORM.LABELS.ADDITIONAL_INCOME);
  }

  if (inputs.livingExpenses < 0) {
    errors.livingExpenses = STRINGS.ERRORS.VALIDATION.NO_NEGATIVE.replace('{field}', STRINGS.FORM.LABELS.LIVING_EXPENSES);
  }

  if (inputs.mortgageRemainingLiability < 0) {
    errors.mortgageRemainingLiability = STRINGS.ERRORS.VALIDATION.NO_NEGATIVE.replace('{field}', 'Mortgage balance');
  }

  if (inputs.annualMortgageRepayment < 0) {
    errors.annualMortgageRepayment = STRINGS.ERRORS.VALIDATION.NO_NEGATIVE.replace('{field}', 'Mortgage repayment');
  }

  if (inputs.currentNIYears < 0 || inputs.currentNIYears > FULL_NI_YEARS) {
    errors.currentNIYears = STRINGS.ERRORS.VALIDATION.RANGE
      .replace('{field}', STRINGS.FORM.LABELS.NI_YEARS)
      .replace('{min}', '0')
      .replace('{max}', String(FULL_NI_YEARS));
  }

  if (inputs.pensionContributionRate < 0 || inputs.pensionContributionRate > 100) {
    errors.pensionContributionRate = STRINGS.ERRORS.VALIDATION.RANGE
      .replace('{field}', STRINGS.FORM.LABELS.PENSION_RATE)
      .replace('{min}', '0')
      .replace('{max}', '100');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};