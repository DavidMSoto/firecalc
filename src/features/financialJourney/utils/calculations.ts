import { differenceInYears } from 'date-fns';
import { UserInputs, SimulationRow, SimulationResult } from '../types';
import {
  INFLATION_RATE,
  PENSION_GROWTH_RATE,
  STATE_PENSION_AGE,
  FULL_STATE_PENSION_WEEKLY,
  MIN_NI_YEARS,
  FULL_NI_YEARS,
  MORTGAGE_INTEREST_RATE,
  PERSONAL_ALLOWANCE,
  BASIC_RATE_THRESHOLD,
  HIGHER_RATE_THRESHOLD,
  PERSONAL_ALLOWANCE_TAPER_THRESHOLD,
  BASIC_RATE,
  HIGHER_RATE,
  ADDITIONAL_RATE,
  NI_BASIC_RATE,
  NI_HIGHER_RATE
} from '../constants';

export const calculateIncomeTax = (income: number): number => {
  let tax = 0;
  let remainingIncome = income;
  
  // Personal allowance reduction
  let personalAllowance = PERSONAL_ALLOWANCE;
  if (income > PERSONAL_ALLOWANCE_TAPER_THRESHOLD) {
    const reduction = Math.min(personalAllowance, Math.floor((income - PERSONAL_ALLOWANCE_TAPER_THRESHOLD) / 2));
    personalAllowance -= reduction;
  }

  // Personal allowance
  remainingIncome -= personalAllowance;
  
  // Basic rate (20%)
  if (remainingIncome > 0) {
    const basicRateAmount = Math.min(remainingIncome, BASIC_RATE_THRESHOLD - PERSONAL_ALLOWANCE);
    tax += basicRateAmount * BASIC_RATE;
    remainingIncome -= basicRateAmount;
  }

  // Higher rate (40%)
  if (remainingIncome > 0) {
    const higherRateAmount = Math.min(remainingIncome, HIGHER_RATE_THRESHOLD - BASIC_RATE_THRESHOLD);
    tax += higherRateAmount * HIGHER_RATE;
    remainingIncome -= higherRateAmount;
  }

  // Additional rate (45%)
  if (remainingIncome > 0) {
    tax += remainingIncome * ADDITIONAL_RATE;
  }

  return Math.round(tax);
};

export const calculateNI = (income: number, isRetired: boolean): number => {
  if (isRetired) return 0;

  let ni = 0;
  let remainingIncome = income;

  if (remainingIncome <= PERSONAL_ALLOWANCE) return 0;

  if (remainingIncome > PERSONAL_ALLOWANCE) {
    const basicAmount = Math.min(remainingIncome - PERSONAL_ALLOWANCE, BASIC_RATE_THRESHOLD - PERSONAL_ALLOWANCE);
    ni += basicAmount * NI_BASIC_RATE;
    remainingIncome -= basicAmount;
  }

  if (remainingIncome > BASIC_RATE_THRESHOLD) {
    ni += (remainingIncome - BASIC_RATE_THRESHOLD) * NI_HIGHER_RATE;
  }

  return Math.round(ni);
};

export const calculateStatePension = (
  age: number,
  niYears: number,
  yearIndex: number
): number => {
  if (age < STATE_PENSION_AGE || niYears < MIN_NI_YEARS) return 0;

  const niYearsRatio = Math.min(1, niYears / FULL_NI_YEARS);
  const baseWeeklyAmount = FULL_STATE_PENSION_WEEKLY * niYearsRatio;
  const baseAnnualAmount = baseWeeklyAmount * 52;
  const inflationMultiplier = Math.pow(1 + INFLATION_RATE, yearIndex);
  
  return Math.round(baseAnnualAmount * inflationMultiplier);
};

export const calculateMortgageBalance = (
  previousBalance: number,
  annualPayment: number
): number => {
  if (previousBalance <= 0) return 0;
  
  const interest = previousBalance * MORTGAGE_INTEREST_RATE;
  const newBalance = previousBalance + interest - annualPayment;
  
  return Math.max(0, newBalance);
};

const calculateRequiredPensionWithdrawal = (
  expenses: number,
  statePension: number,
  additionalIncome: number,
  pensionBalance: number
): number => {
  const totalExpenses = expenses;
  const otherIncome = statePension + additionalIncome;
  const requiredWithdrawal = Math.max(0, totalExpenses - otherIncome);
  
  return Math.min(requiredWithdrawal, pensionBalance);
};

export const simulateFinancialJourney = (inputs: UserInputs): SimulationResult => {
  const currentAge = differenceInYears(new Date(), inputs.birthDate);
  const yearsToSimulate = inputs.expectedDeathAge - currentAge;
  
  const rows: SimulationRow[] = [];
  let totalSavings = inputs.initialSavings;
  let pensionBalance = 0;
  let mortgageBalance = inputs.mortgageRemainingLiability;
  let currentNIYears = inputs.currentNIYears;

  for (let i = 0; i <= yearsToSimulate; i++) {
    const age = currentAge + i;
    const year = new Date().getFullYear() + i;
    const isRetired = age >= inputs.retirementAge;

    if (!isRetired && currentNIYears < FULL_NI_YEARS) {
      currentNIYears++;
    }

    const inflationMultiplier = Math.pow(1 + INFLATION_RATE, i);
    const livingExpenses = inputs.livingExpenses * inflationMultiplier;
    const additionalIncome = inputs.additionalIncome * inflationMultiplier;
    const statePension = calculateStatePension(age, currentNIYears, i);

    let salary = 0;
    let pensionContributions = 0;
    let pensionWithdrawals = 0;

    if (!isRetired) {
      salary = inputs.salary * inflationMultiplier;
      const employerContribution = salary * 0.08;
      const employeeContribution = salary * (inputs.pensionContributionRate / 100);
      pensionContributions = employerContribution + employeeContribution;
      pensionBalance = (pensionBalance + pensionContributions) * (1 + PENSION_GROWTH_RATE);
    } else {
      pensionWithdrawals = calculateRequiredPensionWithdrawal(
        livingExpenses,
        statePension,
        additionalIncome,
        pensionBalance
      );
      pensionBalance = (pensionBalance - pensionWithdrawals) * (1 + PENSION_GROWTH_RATE);
    }

    const totalIncome = salary + additionalIncome + statePension + pensionWithdrawals;
    const incomeTax = calculateIncomeTax(totalIncome);
    const nationalInsurance = calculateNI(salary, isRetired);
    const netIncoming = totalIncome - incomeTax - nationalInsurance;

    const mortgageRepayment = mortgageBalance > 0 ? inputs.annualMortgageRepayment : 0;
    mortgageBalance = calculateMortgageBalance(mortgageBalance, mortgageRepayment);

    const cashFlow = netIncoming - livingExpenses - mortgageRepayment;
    
    if (cashFlow < 0 && totalSavings > 0) {
      const savingsUsed = Math.min(-cashFlow, totalSavings);
      totalSavings -= savingsUsed;
    } else {
      totalSavings = (totalSavings + cashFlow) * (1 + INFLATION_RATE);
    }

    const netWorth = totalSavings + pensionBalance - mortgageBalance;

    rows.push({
      year,
      age,
      totalIncome,
      additionalIncome,
      incomeTax,
      nationalInsurance,
      netIncoming,
      pensionContributions,
      pensionWithdrawals,
      pensionFundBalance: pensionBalance,
      statePension,
      livingExpenses,
      mortgageRepayment,
      mortgageRemainingBalance: mortgageBalance,
      cashFlow,
      totalSavings,
      netWorth
    });

    if (totalSavings < 0 && pensionBalance < livingExpenses) {
      return {
        rows,
        hasWon: false,
        failureAge: age
      };
    }
  }

  return {
    rows,
    hasWon: true
  };
};