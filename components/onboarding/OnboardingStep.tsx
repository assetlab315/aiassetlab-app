import type { ReactNode } from "react";

export type OnboardingStepItem = {
  icon: ReactNode;
  title: string;
  description: string;
};

type Props = {
  step: OnboardingStepItem;
  currentStep: number;
  totalSteps: number;
};

export default function OnboardingStep({ step, currentStep, totalSteps }: Props) {
  return (
    <div className="text-center">
      <div
        aria-hidden="true"
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"
      >
        {step.icon}
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-wide text-blue-600">
        Step {currentStep + 1} / {totalSteps}
      </p>
      <h2 id="onboarding-title" className="mt-2 text-2xl font-black leading-tight text-slate-900">
        {step.title}
      </h2>
      <p id="onboarding-description" className="mt-3 text-sm leading-7 text-slate-600">
        {step.description}
      </p>
    </div>
  );
}
