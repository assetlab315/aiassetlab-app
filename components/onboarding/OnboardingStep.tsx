export type OnboardingStepItem = {
  icon: string;
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
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl"
      >
        {step.icon}
      </div>
      <p className="mt-5 text-xs font-black uppercase tracking-wide text-blue-600">
        Step {currentStep + 1} / {totalSteps}
      </p>
      <h2 id="onboarding-title" className="mt-2 text-2xl font-black text-slate-900">
        {step.title}
      </h2>
      <p id="onboarding-description" className="mt-3 leading-7 text-slate-600">
        {step.description}
      </p>
    </div>
  );
}
