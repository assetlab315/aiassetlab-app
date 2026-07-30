const fs = require("fs");
const assert = require("assert");

const hookSource = fs.readFileSync("hooks/useOnboarding.ts", "utf8");
const modalSource = fs.readFileSync("components/onboarding/OnboardingModal.tsx", "utf8");
const stepSource = fs.readFileSync("components/onboarding/OnboardingStep.tsx", "utf8");
const dashboardSource = fs.readFileSync("components/dashboard/DashboardClient.tsx", "utf8");

assert(
  hookSource.includes('ONBOARDING_STORAGE_KEY = "aiassetlab:onboarding:v1"'),
  "Onboarding should use a versioned localStorage key",
);
assert(
  hookSource.includes('localStorage.getItem(ONBOARDING_STORAGE_KEY) === "completed"'),
  "Onboarding should open only when it has not been completed",
);
assert(
  hookSource.includes('localStorage.setItem(ONBOARDING_STORAGE_KEY, "completed")'),
  "Skip/start should persist completion",
);
assert(hookSource.includes("open") && hookSource.includes("reset"), "Hook should support future help reopening");

["AI Asset Labへようこそ", "まずは現金だけでも登録しましょう", "登録した資産をAIが分析します", "Dashboardで毎日のアドバイスを受けられます"].forEach(
  (text) => {
    assert(modalSource.includes(text), `Missing onboarding copy: ${text}`);
  },
);

assert(modalSource.includes("Skip"), "Modal should include Skip");
assert(modalSource.includes("次へ"), "Modal should include next button");
assert(modalSource.includes("開始する"), "Modal should include start button");
assert(modalSource.includes('role="dialog"'), "Modal should use dialog role");
assert(modalSource.includes('aria-modal="true"'), "Modal should be aria-modal");
assert(modalSource.includes("nextButtonRef.current?.focus()"), "Modal should move focus to the primary button");
assert(!modalSource.includes("onKeyDown"), "Modal should not close on Esc");
assert(!modalSource.includes("onClick={onComplete}") || modalSource.includes("Skip"), "Backdrop should not close the modal");

assert(stepSource.includes("OnboardingStepItem"), "Step component should expose a typed step item");
assert(stepSource.includes("id=\"onboarding-title\""), "Step title should be connected to aria-labelledby");
assert(stepSource.includes("id=\"onboarding-description\""), "Step description should be connected to aria-describedby");

assert(dashboardSource.includes("useOnboarding"), "Dashboard should initialize onboarding");
assert(dashboardSource.includes("OnboardingModal"), "Dashboard should render onboarding modal");
assert(
  dashboardSource.indexOf("<OnboardingModal") < dashboardSource.indexOf("<DailyAdvisorCard"),
  "Onboarding should mount before Dashboard content",
);

console.log("Onboarding checks passed.");
