"use client";

import { useState } from "react";
import SimulatorForm from "./SimulatorForm";
import SimulatorResult from "./SimulatorResult";
import AdviceCard from "./AdviceCard";
import { DEFAULT_SIMULATOR_INPUT } from "../../features/simulator/constants";
import type { SimulatorInput } from "../../features/simulator/types";
import { calculateSimulator } from "../../lib/simulator/calculateSimulator";

export default function SimulatorClient() {
  const [input, setInput] = useState<SimulatorInput>(DEFAULT_SIMULATOR_INPUT);
  const result = calculateSimulator(input);

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <SimulatorForm input={input} onChange={setInput} />

      <div className="space-y-6">
        <SimulatorResult result={result} />
        <AdviceCard result={result} />
      </div>
    </div>
  );
}
