const fs = require("fs");
const assert = require("assert");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  module._compile(output.outputText, filename);
};

const { createPortfolioInsights } = require("../lib/chat/createPortfolioInsights.ts");
const {
  assetHealthScoreRules,
  createAssetHealthScore,
} = require("../lib/dashboard/createAssetHealthScore.ts");
const {
  createDashboardInsights,
} = require("../lib/dashboard/createDashboardInsights.ts");

function getScore(assets) {
  const portfolioInsights = createPortfolioInsights(assets);
  return createAssetHealthScore({ portfolioInsights });
}

function getDashboardInsight(assets) {
  const portfolioInsights = createPortfolioInsights(assets);
  return createDashboardInsights({ portfolioInsights });
}

function assertIncludes(value, expected, label) {
  assert(
    value.includes(expected),
    `${label}: expected "${value}" to include "${expected}"`,
  );
}

function assertScoreIntegrity(score, label) {
  if (score.score === null) {
    assert.strictEqual(score.grade, null, `${label}: empty grade should be null`);
    return;
  }

  assert(Number.isInteger(score.score), `${label}: score should be integer`);
  assert(score.score >= 0 && score.score <= 100, `${label}: score should be 0-100`);

  const impactTotal = score.factors.reduce((sum, factor) => sum + factor.impact, 0);
  const expectedScore = Math.max(
    0,
    Math.min(100, Math.round(assetHealthScoreRules.baseScore + impactTotal)),
  );
  assert.strictEqual(score.score, expectedScore, `${label}: factor impacts should explain score`);

  const negativeTotal = score.factors
    .filter((factor) => factor.type === "negative")
    .reduce((sum, factor) => sum + Math.abs(factor.impact), 0);
  assert.strictEqual(
    score.improvementPotential,
    negativeTotal,
    `${label}: improvementPotential should match negative impacts`,
  );
}

const empty = getScore([]);
assert.strictEqual(empty.score, null);
assert.strictEqual(empty.grade, null);
assert.strictEqual(empty.state, "empty");
assertScoreIntegrity(empty, "empty");

const cashHeavyNoMonthly = getScore([
  { name: "現金", category: "cash", amount: 900000, monthlyContribution: 0 },
  { name: "日本株", category: "stock", amount: 100000, monthlyContribution: 0 },
]);
assert.strictEqual(cashHeavyNoMonthly.score, 45);
assertIncludes(cashHeavyNoMonthly.factors.map((factor) => factor.label).join(","), "現金比率", "cash heavy");
assertIncludes(cashHeavyNoMonthly.factors.map((factor) => factor.label).join(","), "積立が未設定", "cash heavy");
assert(!cashHeavyNoMonthly.factors.some((factor) => factor.id === "crypto-concentration"));
assert(!cashHeavyNoMonthly.factors.some((factor) => factor.id === "single-asset-concentration"));
assertScoreIntegrity(cashHeavyNoMonthly, "cash heavy no monthly");

const cashHeavyMonthly = getScore([
  { name: "現金", category: "cash", amount: 900000, monthlyContribution: 10000 },
  { name: "日本株", category: "stock", amount: 100000, monthlyContribution: 10000 },
]);
assert.strictEqual(cashHeavyMonthly.score, 60);
assert(cashHeavyMonthly.score > cashHeavyNoMonthly.score);
assertScoreIntegrity(cashHeavyMonthly, "cash heavy monthly");

const cryptoHeavy = getScore([
  { name: "暗号資産", category: "crypto", amount: 700000, monthlyContribution: 0 },
  { name: "現金", category: "cash", amount: 300000, monthlyContribution: 0 },
]);
assert(cryptoHeavy.score <= cashHeavyNoMonthly.score);
assert.strictEqual(cryptoHeavy.score, 40);
assert.strictEqual(
  cryptoHeavy.factors.filter((factor) => factor.id === "crypto-concentration").length,
  1,
);
assert(!cryptoHeavy.factors.some((factor) => factor.id === "asset-concentration"));
assertIncludes(getDashboardInsight([
  { name: "暗号資産", category: "crypto", amount: 700000, monthlyContribution: 0 },
  { name: "現金", category: "cash", amount: 300000, monthlyContribution: 0 },
]).todayAction, "分散型資産", "crypto today action");
assertScoreIntegrity(cryptoHeavy, "crypto heavy");

const singleStock = getScore([
  { name: "個別株A", category: "stock", amount: 1000000, monthlyContribution: 0 },
]);
assert.strictEqual(singleStock.score, 35);
assert(singleStock.factors.some((factor) => factor.id === "single-asset-concentration"));
assert(!singleStock.factors.some((factor) => factor.id === "crypto-concentration"));
assert(!singleStock.factors.some((factor) => factor.id === "cash-ratio"));
assertIncludes(getDashboardInsight([
  { name: "個別株A", category: "stock", amount: 1000000, monthlyContribution: 0 },
]).todayAction, "異なる資産", "single stock today action");
assertScoreIntegrity(singleStock, "single stock");

const diversifiedMonthlyAssets = [
  { name: "現金", category: "cash", amount: 200000, monthlyContribution: 5000 },
  { name: "全世界株式", category: "fund", amount: 300000, monthlyContribution: 20000 },
  { name: "日本株", category: "stock", amount: 250000, monthlyContribution: 5000 },
  { name: "債券", category: "other", amount: 250000, monthlyContribution: 5000 },
];
const diversifiedMonthly = getScore(diversifiedMonthlyAssets);
assert.strictEqual(diversifiedMonthly.score, 85);
assert.strictEqual(diversifiedMonthly.grade, "A");
assert(diversifiedMonthly.factors.some((factor) => factor.id === "diversification"));
assert(diversifiedMonthly.factors.every((factor) => factor.type !== "negative"));
assert(diversifiedMonthly.score < 100);
assertIncludes(getDashboardInsight(diversifiedMonthlyAssets).todayAction, "継続", "diversified today action");
assertScoreIntegrity(diversifiedMonthly, "diversified monthly");

const diversifiedNoMonthly = getScore(
  diversifiedMonthlyAssets.map((asset) => ({ ...asset, monthlyContribution: 0 })),
);
assert.strictEqual(diversifiedNoMonthly.score, 70);
assert.strictEqual(diversifiedNoMonthly.grade, "B");
assert.strictEqual(diversifiedMonthly.score - diversifiedNoMonthly.score, 15);
assert(diversifiedNoMonthly.factors.some((factor) => factor.id === "monthly-investment"));
assertIncludes(
  getDashboardInsight(
    diversifiedMonthlyAssets.map((asset) => ({ ...asset, monthlyContribution: 0 })),
  ).todayAction,
  "積立額",
  "diversified no monthly today action",
);
assertScoreIntegrity(diversifiedNoMonthly, "diversified no monthly");

const repeated = getScore(diversifiedMonthlyAssets);
assert.deepStrictEqual(repeated, diversifiedMonthly);

console.log("Asset health score checks passed.");
