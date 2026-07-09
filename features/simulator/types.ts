export type SimulatorInput = {
  monthlyAmount: number;
  years: number;
  annualRate: number;
  initialAmount: number;
};

export type SimulatorResult = {
  futureValue: number;
  principal: number;
  profit: number;
};
