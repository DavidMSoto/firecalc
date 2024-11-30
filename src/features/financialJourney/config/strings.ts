export const STRINGS = {
  APP: {
    TITLE: 'UK Financial Independence Calculator',
    INFO_MESSAGE: 'Enter your financial details below to simulate your journey to financial independence. All calculations include inflation adjustments and follow current UK tax rules.',
  },

  FORM: {
    SECTIONS: {
      PERSONAL_INFO: 'Personal Information',
      INCOME_SAVINGS: 'Income & Savings',
      PENSION_INFO: 'Pension Information',
    },
    LABELS: {
      BIRTH_DATE: 'Birth Date',
      DEATH_AGE: 'Expected Death Age',
      RETIREMENT_AGE: 'Target Retirement Age',
      SALARY: 'Annual Salary',
      ADDITIONAL_INCOME: 'Additional Annual Income',
      INITIAL_SAVINGS: 'Current Savings',
      LIVING_EXPENSES: 'Annual Living Expenses',
      NI_YEARS: 'Current NI Years',
      PENSION_RATE: 'Pension Contribution Rate',
    },
    HELP_TEXT: {
      LIFE_EXPECTANCY: 'Average UK life expectancy is 81',
      STATE_PENSION: 'State Pension age is 67',
      ADDITIONAL_INCOME: 'Rental income, dividends, etc.',
      SAVINGS: 'Total amount in savings accounts',
      EXPENSES: 'Total yearly spending excluding mortgage',
      NI_YEARS: '35 years needed for full State Pension',
      PENSION_RATE: 'Your contribution as % of salary',
    },
    BUTTONS: {
      CALCULATE: 'Calculate Financial Journey',
      OPTIMIZE: 'Let Me Help You',
    },
  },

  CHARTS: {
    TITLES: {
      NET_WORTH: 'Net Worth Over Time',
      INCOME_EXPENSES: 'Income vs Expenses',
      PENSION_BALANCE: 'Pension Fund Balance',
    },
    LABELS: {
      YEAR: 'Year',
      AGE: 'Age',
      TOTAL_INCOME: 'Total Income',
      TAX: 'Tax',
      NET_INCOME: 'Net Income',
      PENSION_CONTRIBUTIONS: 'Pension Contributions',
      PENSION_BALANCE: 'Pension Balance',
      STATE_PENSION: 'State Pension',
      LIVING_EXPENSES: 'Living Expenses',
      MORTGAGE_PAYMENT: 'Mortgage Payment',
      MORTGAGE_BALANCE: 'Mortgage Balance',
      CASH_FLOW: 'Cash Flow',
      TOTAL_SAVINGS: 'Total Savings',
      NET_WORTH: 'Net Worth',
      EXPORT: 'Export to CSV',
    },
    SERIES: {
      NET_WORTH: 'Net Worth',
      NET_INCOME: 'Net Income',
      LIVING_EXPENSES: 'Living Expenses',
      PENSION_BALANCE: 'Pension Balance',
    },
  },

  SIMULATION: {
    SUCCESS: {
      TITLE: "Congratulations! You've beaten the rat race!",
      MESSAGE: "You've secured financial independence and will leave a legacy.",
    },
    FAILURE: {
      TITLE: "You ran out of money at age {age}",
      MESSAGE: "Consider adjusting your plan to ensure long-term financial stability.",
    },
  },

  OPTIMIZATION: {
    TITLE: 'Financial Optimization Suggestions',
    APPLIED: 'Applied',
    BUTTONS: {
      APPLY: 'Apply',
    },
    EXPENSE: {
      TITLE: 'Expense Reduction',
      MONTHLY_SAVINGS: 'Suggested Monthly Savings:',
      PER_MONTH: 'per month',
      REDUCTION_TARGET: 'Total monthly reduction target',
    },
    PENSION: {
      TITLE: 'Pension Optimization',
    },
    ISA: {
      TITLE: 'ISA Investment Opportunity',
    },
  },

  TOOLTIPS: {
    YEAR: 'The current year in the simulation timeline',
    AGE: 'Your age during this simulation year',
    TOTAL_INCOME: 'Total income from all sources',
    TAX: 'Total tax paid (Income Tax + NI)',
    NET_INCOME: 'Income after all taxes',
    PENSION: 'Current pension fund balance',
    EXPENSES: 'Total annual living expenses',
    CASH_FLOW: 'Net income minus expenses',
    NET_WORTH: 'Total assets minus liabilities',
  },

  ERRORS: {
    VALIDATION: {
      REQUIRED: '{field} is required',
      POSITIVE: '{field} must be positive',
      NO_NEGATIVE: '{field} cannot be negative',
      RANGE: '{field} must be between {min} and {max}',
      RETIREMENT_AGE: 'Retirement age must be less than expected death age',
    },
  },
};