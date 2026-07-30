"use client";

import { useEffect, useRef, useState } from "react";
import OnboardingStep, { type OnboardingStepItem } from "./OnboardingStep";

const steps: OnboardingStepItem[] = [
  {
    icon: "✨",
    title: "AI Asset Labへようこそ",
    description: "資産形成を、毎日少しずつ見直せる場所です。",
  },
  {
    icon: "💴",
    title: "資産を登録",
    description: "まずは現金だけでも登録しましょう。",
  },
  {
    icon: "📊",
    title: "AIが分析",
    description: "登録した資産をAIが分析します。",
  },
  {
    icon: "🤖",
    title: "毎日のAI",
    description: "Dashboardで毎日のアドバイスを受けられます。",
  },
];

type Props = {
  isOpen: boolean;
  onComplete: () => void;
};

export default function OnboardingModal({ isOpen, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }
    nextButtonRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  function handleNext() {
    if (isLastStep) {
      onComplete();
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  }

  return (
    <div
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-description"
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 py-6"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <OnboardingStep
          step={steps[currentStep]}
          currentStep={currentStep}
          totalSteps={steps.length}
        />

        <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
          {steps.map((step, index) => (
            <span
              key={step.title}
              className={`h-2 w-2 rounded-full ${
                index === currentStep ? "bg-blue-600" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onComplete}
            className="min-h-11 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
          >
            Skip
          </button>
          <button
            ref={nextButtonRef}
            type="button"
            onClick={handleNext}
            className="min-h-11 rounded-2xl bg-blue-600 px-5 py-2 text-sm font-black text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            {isLastStep ? "開始する" : "次へ"}
          </button>
        </div>
      </div>
    </div>
  );
}
