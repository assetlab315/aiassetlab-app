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
const { createAssetHealthScore } = require("../lib/dashboard/createAssetHealthScore.ts");
const { createDashboardInsights } = require("../lib/dashboard/createDashboardInsights.ts");
const { createPortfolioReview } = require("../lib/dashboard/createPortfolioReview.ts");
const {
  createDashboardChangeSummary,
} = require("../lib/dashboard/createDashboardChangeSummary.ts");
const {
  comparePortfolioSnapshots,
} = require("../lib/portfolio-history/comparePortfolioSnapshots.ts");
const {
  createPortfolioSnapshotFromAssets,
} = require("../lib/portfolio-history/createPortfolioSnapshot.ts");

const forbiddenWords = ["絶対", "必ず", "失敗", "危険", "儲かる", "買うべき", "売るべき", "あなたは"];

function asset(name, category, amount, monthlyContribution = 0) {
  return {
    id: `asset-${name}`,
    name,
    category,
    amount,
    monthlyContribution,
    updatedAt: "2026-07-28T00:00:00.000Z",
  };
}

function context(assets, previousAssets = null) {
  const portfolioInsights = createPortfolioInsights(assets);
  const dashboardInsights = createDashboardInsights({ portfolioInsights });
  const assetHealthScore = createAssetHealthScore({ portfolioInsights });
  const portfolioChangeSummary = previousAssets
    ? createDashboardChangeSummary({
        comparison: comparePortfolioSnapshots(
          createPortfolioSnapshotFromAssets(previousAssets),
          createPortfolioSnapshotFromAssets(assets),
        ),
        currentDashboardInsights: dashboardInsights,
        currentHealthScore: assetHealthScore,
      })
    : null;

  return {
    portfolioInsights,
    dashboardInsights,
    assetHealthScore,
    portfolioChangeSummary,
  };
}

function review(assets, previousAssets = null) {
  return createPortfolioReview(context(assets, previousAssets));
}

function sentenceCount(text) {
  return text.split("。").filter(Boolean).length;
}

function assertReviewShape(value, label) {
  assert(value.title.length > 0, `${label}: title`);
  assert(value.summary.length > 0, `${label}: summary`);
  assert(sentenceCount(value.summary) <= 2, `${label}: summary should be 2 sentences or less`);
  assert(value.highlights.length <= 3, `${label}: highlights max 3`);
  assert(value.nextAction && value.nextAction.length > 0, `${label}: nextAction`);

  const text = JSON.stringify(value);
  forbiddenWords.forEach((word) => {
    assert(!text.includes(word), `${label}: forbidden word ${word}`);
  });
}

function assertNoContradiction(value, label) {
  const text = JSON.stringify(value);
  if (text.includes("暗号資産への偏り")) {
    assert(!text.includes("非常に良好"), `${label}: crypto caution contradiction`);
  }
  if (text.includes("配分の偏り")) {
    assert(!text.includes("非常に健全"), `${label}: health contradiction`);
  }
  if (text.includes("現金比率がやや高め")) {
    assert(!text.includes("現金比率は理想的"), `${label}: cash contradiction`);
  }
}

const noAssetsReview = review([]);
assertReviewShape(noAssetsReview, "no assets");
assert(noAssetsReview.summary.includes("資産が登録されると"));
assert.strictEqual(noAssetsReview.confidence, "medium");

const diversifiedNoHistory = [
  asset("現金", "cash", 200000, 5000),
  asset("全世界株式", "fund", 300000, 20000),
  asset("日本株", "stock", 250000, 5000),
  asset("債券", "other", 250000, 5000),
];
const noHistoryReview = review(diversifiedNoHistory);
assertReviewShape(noHistoryReview, "no history");
assert(noHistoryReview.summary.includes("次回から変化"));

const diversifiedNoMonthly = diversifiedNoHistory.map((item) => ({
  ...item,
  monthlyContribution: 0,
}));
const improvedReview = review(diversifiedNoHistory, diversifiedNoMonthly);
assertReviewShape(improvedReview, "improved");
assert(improvedReview.summary.includes("改善"));
assert(JSON.stringify(improvedReview).includes("毎月の積立"));

const cashHeavyNoMonthly = [
  asset("現金", "cash", 900000, 0),
  asset("日本株", "stock", 100000, 0),
];
const cryptoHeavyMonthly = [
  asset("暗号資産", "crypto", 700000, 30000),
  asset("現金", "cash", 300000, 0),
];
const mixedReview = review(cryptoHeavyMonthly, cashHeavyNoMonthly);
assertReviewShape(mixedReview, "mixed");
assert(mixedReview.summary.includes("改善した点"));
assert(JSON.stringify(mixedReview).includes("暗号資産への偏り"));
assert(JSON.stringify(mixedReview).includes("毎月の積立"));
assertNoContradiction(mixedReview, "mixed");

const cryptoLowMonthly = [
  asset("暗号資産", "crypto", 200000, 10000),
  asset("現金", "cash", 300000, 10000),
  asset("全世界株式", "fund", 500000, 10000),
];
const attentionReview = review(cryptoHeavyMonthly, cryptoLowMonthly);
assertReviewShape(attentionReview, "needs_attention");
assert(attentionReview.summary.includes("配分の偏り"));
assert(JSON.stringify(attentionReview).includes("分散"));
assertNoContradiction(attentionReview, "needs_attention");

const noChangeReview = review(
  diversifiedNoHistory,
  diversifiedNoHistory.map((item) => ({ ...item })),
);
assertReviewShape(noChangeReview, "no_change");
assert(noChangeReview.summary.includes("大きな変化はありません"));

[noAssetsReview, noHistoryReview, improvedReview, mixedReview, attentionReview, noChangeReview].forEach(
  (item, index) => {
    assertNoContradiction(item, `review ${index}`);
  },
);

assert(!fs.readFileSync("lib/dashboard/createPortfolioReview.ts", "utf8").includes("fetch("));
assert(!fs.readFileSync("lib/dashboard/createPortfolioReview.ts", "utf8").includes("openai"));

console.log("Portfolio review checks passed.");
console.log(
  JSON.stringify(
    {
      noAssets: noAssetsReview,
      noHistory: noHistoryReview,
      improved: improvedReview,
      mixed: mixedReview,
      needsAttention: attentionReview,
      noChange: noChangeReview,
    },
    null,
    2,
  ),
);
