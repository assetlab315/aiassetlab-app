import type {
  SimulatorInput,
  SimulatorResult,
} from "../../features/simulator/types";

export function calculateSimulator(input: SimulatorInput): SimulatorResult {
  const monthlyAmount = Math.max(input.monthlyAmount, 0);
  const years = Math.max(input.years, 0);
  const annualRate = Math.max(input.annualRate, 0);
  const initialAmount = Math.max(input.initialAmount, 0);

  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;

  let futureValue = initialAmount * Math.pow(1 + monthlyRate, months);

  if (monthlyRate === 0) {
    futureValue += monthlyAmount * months;
  } else {
    futureValue +=
      monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  }

  const principal = initialAmount + monthlyAmount * months;
  const profit = futureValue - principal;

  return {
    futureValue: Math.round(futureValue),
    principal: Math.round(principal),
    profit: Math.round(profit),
  };
}
