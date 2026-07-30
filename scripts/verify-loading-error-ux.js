const fs = require("fs");
const assert = require("assert");

const feedbackFiles = [
  "components/feedback/LoadingSkeleton.tsx",
  "components/feedback/ErrorState.tsx",
  "components/feedback/InlineError.tsx",
  "components/feedback/LoadingButton.tsx",
];
const feedbackSource = feedbackFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const dashboardSource = fs.readFileSync("components/dashboard/DashboardClient.tsx", "utf8");
const portfolioSource = fs.readFileSync("components/portfolio/PortfolioClient.tsx", "utf8");
const hookSource = fs.readFileSync("lib/portfolio/usePortfolioSync.ts", "utf8");
const chatSource = fs.readFileSync("components/chat/ChatClient.tsx", "utf8");
const chatListSource = fs.readFileSync("components/chat/ChatMessageList.tsx", "utf8");

assert(feedbackSource.includes('aria-busy="true"'), "Loading skeletons should expose busy state");
assert(feedbackSource.includes('role="alert"'), "Error components should use alert role");
assert(feedbackSource.includes("aria-live"), "Feedback components should use aria-live");
assert(feedbackSource.includes("motion-reduce:animate-none"), "Skeletons should respect reduced motion");
assert(feedbackSource.includes("isLoading"), "LoadingButton should support loading state");
assert(feedbackSource.includes("disabled || isLoading"), "LoadingButton should prevent retry double clicks");

assert(
  dashboardSource.includes("!isReady || syncStatus === \"loading\"") &&
    dashboardSource.indexOf("!isReady || syncStatus === \"loading\"") <
      dashboardSource.indexOf("assets.length === 0 ? <EmptyDashboard"),
  "Dashboard should prioritize loading before empty state",
);
assert(
  dashboardSource.includes("syncStatus === \"error\"") &&
    dashboardSource.includes("資産情報を読み込めませんでした"),
  "Dashboard should show ErrorState on load failure",
);
assert(
  dashboardSource.includes("syncStatus !== \"loading\"") &&
    dashboardSource.includes("syncStatus !== \"error\""),
  "Onboarding should wait until loading/error is resolved",
);

assert(
  portfolioSource.includes("isInitialLoading") &&
    portfolioSource.indexOf("LoadingSkeleton") < portfolioSource.indexOf("<EmptyPortfolio"),
  "Portfolio should show loading before empty state",
);
assert(
  portfolioSource.includes("status === \"error\" && assets.length === 0") &&
    portfolioSource.includes("資産情報を取得できませんでした。"),
  "Portfolio should show fetch error instead of empty state",
);
assert(
  portfolioSource.includes("保存できませんでした。もう一度お試しください。") &&
    portfolioSource.includes("削除できませんでした。データは変更されていません。"),
  "Portfolio should distinguish save and delete failures",
);
assert(
  hookSource.includes("const previousAssets = assets") &&
    hookSource.includes("setAssets(previousAssets)"),
  "Portfolio save failures should restore the previous visible assets",
);
assert(
  portfolioSource.includes("isSaving") &&
    portfolioSource.includes("isBusy={isSaving}") &&
    portfolioSource.includes("operation: \"delete\""),
  "Portfolio should prevent double save/delete actions",
);

assert(chatListSource.includes("AIが回答を作成しています…"), "Chat should show answer loading text");
assert(
  chatSource.includes("isSendingRef.current") &&
    chatSource.includes("!isSending") &&
    chatSource.includes("isRetrying={isSending}"),
  "Chat should prevent double send and double retry",
);
assert(
  chatSource.includes("回答を取得できませんでした") &&
    chatSource.includes("もう一度送信") &&
    chatSource.includes("lastFailedQuestion"),
  "Chat should expose retry using the previous question",
);
assert(
  chatSource.includes("setInput(trimmed)") &&
    !chatSource.includes("500 Internal Server Error") &&
    !chatSource.includes("fetch failed") &&
    !chatSource.includes("SupabaseError") &&
    !chatSource.includes("stack trace"),
  "Chat should keep the failed input and hide technical errors",
);

console.log("Loading and error UX checks passed.");
