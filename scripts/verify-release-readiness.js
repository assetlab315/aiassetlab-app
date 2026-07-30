const fs = require("fs");
const path = require("path");

const root = process.cwd();

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    console.error(`Release readiness check failed: ${message}`);
    process.exit(1);
  }
}

const layout = read("app/layout.tsx");
const errorPage = read("app/error.tsx");
const globalError = read("app/global-error.tsx");
const notFound = read("app/not-found.tsx");
const manifest = read("app/manifest.ts");
const robots = read("app/robots.ts");
const sitemap = read("app/sitemap.ts");
const onboarding = read("components/onboarding/OnboardingModal.tsx");
const feedbackError = read("components/feedback/ErrorState.tsx");
const checklist = read("docs/RELEASE_CHECKLIST_RC.md");

assert(layout.includes("metadataBase"), "metadataBase is missing");
assert(layout.includes("openGraph"), "Open Graph metadata is missing");
assert(layout.includes("twitter"), "Twitter metadata is missing");
assert(layout.includes("manifest: \"/manifest.webmanifest\""), "manifest metadata is missing");
assert(layout.includes("icons:"), "icon metadata is missing");
assert(layout.includes("export const viewport"), "viewport export is missing");
assert(layout.includes("themeColor"), "theme-color is missing");
assert(layout.includes("shouldEnableGa"), "GA4 production guard is missing");
assert(layout.includes("shouldEnableClarity"), "Clarity production guard is missing");

assert(manifest.includes("theme_color"), "manifest theme_color is missing");
assert(manifest.includes("icons"), "manifest icons are missing");
assert(robots.includes("sitemap"), "robots sitemap reference is missing");
assert(sitemap.includes("/privacy"), "privacy page is missing from sitemap");
assert(sitemap.includes("/terms"), "terms page is missing from sitemap");

assert(errorPage.includes("問題が発生しました"), "runtime error title is missing");
assert(errorPage.includes("ページを再読み込みしてください。"), "runtime error description is missing");
assert(errorPage.includes("process.env.NODE_ENV !== \"production\""), "development-only error logging guard is missing");
assert(!errorPage.includes("error.message"), "runtime error details should not be rendered");
assert(!errorPage.includes("digest"), "runtime error digest should not be rendered");

assert(globalError.includes("一時的な問題が発生しています"), "global error title is missing");
assert(globalError.includes("ホームへ戻る"), "global error home action is missing");
assert(globalError.includes("role=\"alert\""), "global error alert role is missing");
assert(globalError.includes("process.env.NODE_ENV !== \"production\""), "global error logging guard is missing");

assert(notFound.includes("ページが見つかりません"), "404 title is missing");
assert(notFound.includes("Dashboardへ戻る"), "404 dashboard action is missing");
assert(notFound.includes("href=\"/dashboard\""), "404 dashboard link is missing");

assert(onboarding.includes("role=\"dialog\""), "onboarding dialog role is missing");
assert(onboarding.includes("aria-modal=\"true\""), "onboarding aria-modal is missing");
assert(onboarding.includes("handleKeyDown"), "onboarding keyboard trap is missing");
assert(!onboarding.includes("event.key === \"Escape\""), "onboarding must not close on Escape");
assert(feedbackError.includes("role=\"alert\""), "ErrorState alert role is missing");
assert(feedbackError.includes("aria-live=\"assertive\""), "ErrorState aria-live is missing");

[
  "Google Login",
  "Cloud Sync",
  "Portfolio",
  "AI Chat",
  "Onboarding",
  "Daily Advisor",
  "Action Advisor",
  "Empty State",
  "Loading",
  "Error",
  "Mobile",
  "Tablet",
  "Desktop",
  "Privacy Policy",
  "Terms",
  "Lighthouse",
  "SEO",
  "Accessibility",
].forEach((item) => {
  assert(checklist.includes(`- [ ] ${item}`), `${item} checklist item is missing`);
});

console.log("Release readiness checks passed.");
