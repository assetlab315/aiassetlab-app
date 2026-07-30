const fs = require("fs");
const assert = require("assert");

const dashboardEmpty = fs.readFileSync("components/empty/EmptyDashboard.tsx", "utf8");
const chatEmpty = fs.readFileSync("components/empty/EmptyChat.tsx", "utf8");
const portfolioEmpty = fs.readFileSync("components/empty/EmptyPortfolio.tsx", "utf8");
const dashboardClient = fs.readFileSync("components/dashboard/DashboardClient.tsx", "utf8");
const chatClient = fs.readFileSync("components/chat/ChatClient.tsx", "utf8");
const portfolioClient = fs.readFileSync("components/portfolio/PortfolioClient.tsx", "utf8");

assert(dashboardEmpty.includes("資産を登録しましょう"), "Dashboard empty title is required");
assert(dashboardEmpty.includes("AIによる分析を始められます"), "Dashboard empty should explain next value");
assert(dashboardEmpty.includes('href="/portfolio"'), "Dashboard empty should link to Portfolio");
assert(dashboardEmpty.includes("aria-labelledby"), "Dashboard empty should be accessible");
assert(
  dashboardClient.includes("assets.length === 0 ? <EmptyDashboard /> : null") &&
    dashboardClient.indexOf("syncStatus === \"error\"") <
      dashboardClient.indexOf("assets.length === 0 ? <EmptyDashboard"),
  "Dashboard empty should show only when there are no assets",
);

assert(chatEmpty.includes("AIに相談してみましょう"), "Chat empty title is required");
["新NISAを始めたい", "家計を見直したい", "投資割合を相談したい"].forEach((text) => {
  assert(chatEmpty.includes(text), `Chat empty missing chip: ${text}`);
});
assert(chatEmpty.includes("onClick={() => onSelect(suggestion)}"), "Chat chips should only set input");
assert(chatEmpty.includes("aria-label=\"相談例\""), "Chat chips should have an accessible label");
assert(
  chatClient.includes("!hasUserMessages ? <EmptyChat onSelect={setInput} /> : null"),
  "Chat empty should show only before user messages",
);
assert(!chatEmpty.includes("onSend"), "Chat chips should not auto-send");

assert(portfolioEmpty.includes("資産はまだ登録されていません"), "Portfolio empty title is required");
assert(portfolioEmpty.includes("現金"), "Portfolio empty should mention cash");
assert(portfolioEmpty.includes("銀行預金"), "Portfolio empty should mention bank deposits");
assert(portfolioEmpty.includes("資産を追加"), "Portfolio empty should include add button");
assert(portfolioEmpty.includes("aria-labelledby"), "Portfolio empty should be accessible");
assert(
  portfolioClient.includes("assets.length === 0 ?") &&
    portfolioClient.includes("<EmptyPortfolio onAddAsset={handleAddAssetFocus} />"),
  "Portfolio empty should show only when there are no assets",
);
assert(
  portfolioClient.includes("<AssetTable") && portfolioClient.includes("<AllocationChart"),
  "Portfolio should still show asset views after assets are registered",
);

console.log("Empty state checks passed.");
