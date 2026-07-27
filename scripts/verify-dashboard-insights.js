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
const { createDashboardInsights } = require("../lib/dashboard/createDashboardInsights.ts");

function getDashboardInsights(assets) {
  return createDashboardInsights({
    portfolioInsights: createPortfolioInsights(assets),
  });
}

function assertIncludes(value, expected, label) {
  assert(
    value.includes(expected),
    `${label}: expected "${value}" to include "${expected}"`,
  );
}

const empty = getDashboardInsights([]);
assert.strictEqual(empty.state, "empty");
assertIncludes(empty.summary, "登録されていません", "empty summary");
assertIncludes(empty.todayAction, "資産を登録", "empty action");
assert.strictEqual(empty.actionHref, "/portfolio");

const cashHeavy = getDashboardInsights([
  { name: "現金", category: "cash", amount: 900000, monthlyContribution: 0 },
  { name: "日本株", category: "stock", amount: 100000, monthlyContribution: 10000 },
]);
assertIncludes(cashHeavy.summary, "現金の比率が高め", "cash heavy summary");
assertIncludes(cashHeavy.strength ?? "", "急な支出", "cash heavy strength");
assertIncludes(cashHeavy.todayAction, "積立額", "cash heavy action");

const cryptoHeavy = getDashboardInsights([
  { name: "暗号資産", category: "crypto", amount: 700000, monthlyContribution: 0 },
  { name: "現金", category: "cash", amount: 300000, monthlyContribution: 0 },
]);
assert.strictEqual(cryptoHeavy.state, "warning");
assertIncludes(cryptoHeavy.summary, "暗号資産", "crypto summary");
assertIncludes(cryptoHeavy.warning ?? "", "集中", "crypto warning");
assertIncludes(cryptoHeavy.todayAction, "分散型資産", "crypto action");

const singleAsset = getDashboardInsights([
  { name: "個別株A", category: "stock", amount: 1000000, monthlyContribution: 10000 },
]);
assert.strictEqual(singleAsset.state, "warning");
assertIncludes(singleAsset.summary, "1つの資産", "single asset summary");
assertIncludes(singleAsset.warning ?? "", "集中", "single asset warning");
assertIncludes(singleAsset.todayAction, "異なる資産", "single asset action");

const diversified = getDashboardInsights([
  { name: "現金", category: "cash", amount: 200000, monthlyContribution: 5000 },
  { name: "全世界株式", category: "fund", amount: 300000, monthlyContribution: 20000 },
  { name: "日本株", category: "stock", amount: 250000, monthlyContribution: 5000 },
  { name: "債券", category: "other", amount: 250000, monthlyContribution: 5000 },
]);
assert.strictEqual(diversified.state, "positive");
assertIncludes(diversified.summary, "分散", "diversified summary");
assertIncludes(diversified.todayAction, "継続", "diversified action");
assert(!diversified.todayAction.includes("変更"), "diversified action should not force change");

const noMonthly = getDashboardInsights([
  { name: "現金", category: "cash", amount: 300000, monthlyContribution: 0 },
  { name: "全世界株式", category: "fund", amount: 350000, monthlyContribution: 0 },
  { name: "日本株", category: "stock", amount: 350000, monthlyContribution: 0 },
]);
assert.strictEqual(noMonthly.state, "neutral");
assertIncludes(noMonthly.todayAction, "積立額", "no monthly action");

console.log("Dashboard insights checks passed.");
