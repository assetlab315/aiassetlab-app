const fs = require("fs");
const assert = require("assert");

const layout = fs.readFileSync("app/layout.tsx", "utf8");
const dashboard = fs.readFileSync("components/dashboard/DashboardClient.tsx", "utf8");
const portfolio = fs.readFileSync("components/portfolio/PortfolioClient.tsx", "utf8");
const allocation = fs.readFileSync("components/portfolio/AllocationChart.tsx", "utf8");
const assetTable = fs.readFileSync("components/portfolio/AssetTable.tsx", "utf8");

assert(!layout.includes("Webサイトへ"), "Header should not include the Webサイトへ button");
assert(layout.includes("<AuthNavItem />"), "Header should keep auth navigation");

assert(
  dashboard.includes('data-dashboard-main-blocks="3"'),
  "Dashboard should declare the simplified 3-block structure",
);
["DailyAdvisorCard", "data-dashboard-block=\"asset-status\"", "data-dashboard-block=\"next-actions\""].forEach(
  (token) => {
    assert(dashboard.includes(token), `Dashboard block is missing: ${token}`);
  },
);
[
  "DashboardInsightCard",
  "AssetHealthScoreCard",
  "PortfolioChangeCard",
  "PortfolioReviewCard",
  "DashboardAssetImpactCard",
  "DashboardPremiumPreviewCard",
  "DashboardReleaseCheckCard",
  "FeatureNavigation",
].forEach((token) => {
  assert(!dashboard.includes(token), `Dashboard should not render detailed duplicate block: ${token}`);
});
assert(dashboard.includes("tasks.slice(0, 3)"), "Dashboard next actions should be capped at 3");
assert(!dashboard.includes("largestAssetName"), "Dashboard should not show Portfolio-level detail");

assert(
  portfolio.includes('data-portfolio-card="summary"') &&
    portfolio.includes('data-portfolio-card="breakdown"'),
  "Portfolio should have summary and breakdown cards",
);
assert(
  portfolio.indexOf('data-portfolio-card="summary"') <
    portfolio.indexOf('data-portfolio-card="breakdown"'),
  "Portfolio summary should come before breakdown",
);
assert(portfolio.includes("総資産"), "Portfolio summary should include total assets");
assert(portfolio.includes("毎月の積立"), "Portfolio summary should include monthly contribution");
assert(portfolio.includes("登録資産数"), "Portfolio summary should include asset count");
assert(portfolio.includes("<AllocationChart") && portfolio.includes("<AssetTable"), "Portfolio should keep chart and list");
assert(
  portfolio.indexOf("<AllocationChart") < portfolio.indexOf("<AssetTable") &&
    portfolio.indexOf('data-portfolio-card="breakdown"') < portfolio.indexOf("<AllocationChart"),
  "Portfolio chart and list should be inside the breakdown card",
);
assert(
  allocation.trim().startsWith("import") && !allocation.includes("rounded-3xl bg-white p-6 shadow-sm"),
  "AllocationChart should not create a separate card shell",
);
assert(
  !assetTable.includes("rounded-3xl bg-white p-6 shadow-sm"),
  "AssetTable should not create a separate card shell",
);
assert(!portfolio.includes("PortfolioNextActions"), "Portfolio should remove extra next-action card");
assert(!portfolio.includes("PortfolioSummaryCards"), "Portfolio should not split summary into multiple cards");

console.log("Information architecture checks passed.");
