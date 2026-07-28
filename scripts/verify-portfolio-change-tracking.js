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

const {
  createPortfolioSnapshotFromAssets,
} = require("../lib/portfolio-history/createPortfolioSnapshot.ts");
const {
  clearPortfolioSnapshots,
  getLatestSnapshot,
  getPreviousDistinctSnapshot,
  loadPortfolioSnapshots,
  portfolioSnapshotStorageRules,
  savePortfolioSnapshot,
} = require("../lib/portfolio-history/portfolioSnapshotStorage.ts");
const {
  comparePortfolioSnapshots,
} = require("../lib/portfolio-history/comparePortfolioSnapshots.ts");
const {
  createDashboardChangeSummary,
} = require("../lib/dashboard/createDashboardChangeSummary.ts");
const { createDashboardInsights } = require("../lib/dashboard/createDashboardInsights.ts");
const { createAssetHealthScore } = require("../lib/dashboard/createAssetHealthScore.ts");
const { createPortfolioInsights } = require("../lib/chat/createPortfolioInsights.ts");

function createMemoryStorage(initialValue) {
  const map = new Map();
  if (initialValue !== undefined) {
    map.set(portfolioSnapshotStorageRules.storageKey, initialValue);
  }

  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}

function createThrowingStorage() {
  return {
    getItem: () => {
      throw new Error("read failed");
    },
    setItem: () => {
      throw new Error("write failed");
    },
    removeItem: () => {
      throw new Error("remove failed");
    },
  };
}

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

function snapshot(assets, date = "2026-07-28T00:00:00.000Z") {
  return createPortfolioSnapshotFromAssets(assets, new Date(date));
}

function dashboardContext(assets) {
  const portfolioInsights = createPortfolioInsights(assets);
  return {
    currentDashboardInsights: createDashboardInsights({ portfolioInsights }),
    currentHealthScore: createAssetHealthScore({ portfolioInsights }),
  };
}

function summary(previousAssets, currentAssets) {
  const comparison = comparePortfolioSnapshots(snapshot(previousAssets), snapshot(currentAssets));
  return createDashboardChangeSummary({
    comparison,
    ...dashboardContext(currentAssets),
  });
}

function assertSerializable(value, label) {
  assert.doesNotThrow(() => JSON.parse(JSON.stringify(value)), `${label}: should serialize`);
}

function assertNoForbiddenCopy(value, label) {
  const text = JSON.stringify(value);
  assert(!text.includes("先月比"), `${label}: should not say 先月比`);
  assert(!text.includes("前月"), `${label}: should not say 前月`);
  assert(!text.includes("昨日"), `${label}: should not say 昨日`);
  assert(!text.includes("運用益"), `${label}: should not infer investment gains`);
}

const diversifiedMonthly = [
  asset("現金", "cash", 200000, 5000),
  asset("全世界株式", "fund", 300000, 20000),
  asset("日本株", "stock", 250000, 5000),
  asset("債券", "other", 250000, 5000),
];
const diversifiedNoMonthly = diversifiedMonthly.map((item) => ({
  ...item,
  monthlyContribution: 0,
}));
const cashHeavyNoMonthly = [
  asset("現金", "cash", 900000, 0),
  asset("日本株", "stock", 100000, 0),
];
const cryptoHeavyMonthly = [
  asset("暗号資産", "crypto", 700000, 30000),
  asset("現金", "cash", 300000, 0),
];
const cryptoLowMonthly = [
  asset("暗号資産", "crypto", 200000, 10000),
  asset("現金", "cash", 300000, 10000),
  asset("全世界株式", "fund", 500000, 10000),
];
const singleStockNoMonthly = [asset("個別株A", "stock", 1000000, 0)];
const diversifiedNoMonthlyFromSingle = [
  asset("国内株式", "stock", 300000, 0),
  asset("海外株式", "fund", 300000, 0),
  asset("債券", "other", 200000, 0),
  asset("現金", "cash", 200000, 0),
];
const smallChangePrevious = [
  asset("現金", "cash", 200000, 10000),
  asset("海外株式", "fund", 300000, 10000),
  asset("国内株式", "stock", 200000, 10000),
  asset("債券", "other", 200000, 10000),
  asset("その他", "other", 100000, 10000),
];
const smallChangeCurrent = [
  asset("現金", "cash", 195000, 10000),
  asset("海外株式", "fund", 305000, 10000),
  asset("国内株式", "stock", 200000, 10000),
  asset("債券", "other", 200000, 10000),
  asset("その他", "other", 100000, 10000),
];

const firstSnapshot = snapshot(diversifiedMonthly);
const sameSnapshotDifferentDate = snapshot(diversifiedMonthly, "2026-07-29T00:00:00.000Z");
const sameSnapshotDifferentOrder = snapshot([...diversifiedMonthly].reverse());
assert(firstSnapshot);
assert.strictEqual(firstSnapshot.fingerprint, sameSnapshotDifferentDate.fingerprint);
assert.strictEqual(firstSnapshot.fingerprint, sameSnapshotDifferentOrder.fingerprint);
assert.notStrictEqual(firstSnapshot.fingerprint, snapshot(diversifiedNoMonthly).fingerprint);
assert.notStrictEqual(firstSnapshot.fingerprint, snapshot([
  asset("現金", "cash", 250000, 5000),
  asset("全世界株式", "fund", 250000, 20000),
  asset("日本株", "stock", 250000, 5000),
  asset("債券", "other", 250000, 5000),
]).fingerprint);
assert.notStrictEqual(firstSnapshot.fingerprint, snapshot([
  asset("現金", "cash", 200000, 5000),
  asset("全世界株式", "crypto", 300000, 20000),
  asset("日本株", "stock", 250000, 5000),
  asset("債券", "other", 250000, 5000),
]).fingerprint);
assertSerializable(firstSnapshot, "snapshot");
assert(firstSnapshot.categories.every((category) => category.ratio >= 0 && category.ratio <= 100));
assert(firstSnapshot.categories.every((category) => Number.isFinite(category.amount)));
assert.strictEqual(snapshot([]), null);

const storage = createMemoryStorage();
clearPortfolioSnapshots(storage);
savePortfolioSnapshot(firstSnapshot, storage);
assert.strictEqual(loadPortfolioSnapshots(storage).length, 1);
savePortfolioSnapshot(sameSnapshotDifferentDate, storage);
assert.strictEqual(loadPortfolioSnapshots(storage).length, 1);
[
  snapshot(cashHeavyNoMonthly),
  snapshot(cryptoHeavyMonthly),
  snapshot(singleStockNoMonthly),
  snapshot(diversifiedNoMonthly),
  snapshot(cryptoLowMonthly),
  snapshot(diversifiedNoMonthlyFromSingle),
].forEach((item) => savePortfolioSnapshot(item, storage));
assert.strictEqual(loadPortfolioSnapshots(storage).length, 5);
assert(getLatestSnapshot(storage));
assert(getPreviousDistinctSnapshot(storage));
assert.deepStrictEqual(loadPortfolioSnapshots(createMemoryStorage("{bad json")), []);
assert.deepStrictEqual(loadPortfolioSnapshots(createMemoryStorage(JSON.stringify([{ version: 0 }]))), []);
const originalNodeEnv = process.env.NODE_ENV;
process.env.NODE_ENV = "production";
assert.doesNotThrow(() => savePortfolioSnapshot(firstSnapshot, createThrowingStorage()));
assert.doesNotThrow(() => loadPortfolioSnapshots(createThrowingStorage()));
process.env.NODE_ENV = originalNodeEnv;

const scoreUpComparison = comparePortfolioSnapshots(
  snapshot(diversifiedNoMonthly),
  snapshot(diversifiedMonthly),
);
assert.strictEqual(scoreUpComparison.healthScoreDelta, 15);
assert(scoreUpComparison.events.some((event) => event.type === "contribution_started"));

const scoreDownComparison = comparePortfolioSnapshots(
  snapshot(diversifiedMonthly),
  snapshot(cryptoHeavyMonthly),
);
assert(scoreDownComparison.healthScoreDelta < 0);
assert(scoreDownComparison.events.some((event) => event.type === "health_score_decreased"));

const unchangedComparison = comparePortfolioSnapshots(firstSnapshot, sameSnapshotDifferentDate);
assert.strictEqual(unchangedComparison.healthScoreDelta, 0);
assert(!unchangedComparison.hasMeaningfulChange);

const stoppedComparison = comparePortfolioSnapshots(
  snapshot(diversifiedMonthly),
  snapshot(diversifiedNoMonthly),
);
assert(stoppedComparison.events.some((event) => event.type === "contribution_stopped"));

const changedComparison = comparePortfolioSnapshots(
  snapshot([
    asset("現金", "cash", 200000, 10000),
    asset("全世界株式", "fund", 800000, 10000),
  ]),
  snapshot([
    asset("現金", "cash", 200000, 20000),
    asset("全世界株式", "fund", 800000, 10000),
  ]),
);
assert(changedComparison.events.some((event) => event.type === "contribution_changed"));

const categoryComparison = comparePortfolioSnapshots(
  snapshot(cryptoLowMonthly),
  snapshot(cryptoHeavyMonthly),
);
assert(categoryComparison.events.some((event) => event.type === "category_increased"));
assert(categoryComparison.events.some((event) => event.type === "health_factor_added"));

const smallChangeComparison = comparePortfolioSnapshots(
  snapshot(smallChangePrevious),
  snapshot(smallChangeCurrent),
);
assert(!smallChangeComparison.hasMeaningfulChange);

const totalOnlyComparison = comparePortfolioSnapshots(
  snapshot([
    asset("現金", "cash", 200000, 10000),
    asset("全世界株式", "fund", 800000, 10000),
  ]),
  snapshot([
    asset("現金", "cash", 220000, 10000),
    asset("全世界株式", "fund", 880000, 10000),
  ]),
);
assert(!totalOnlyComparison.hasMeaningfulChange);

const noHistorySummary = createDashboardChangeSummary({
  comparison: null,
  ...dashboardContext(diversifiedMonthly),
});
assert.strictEqual(noHistorySummary.state, "no_history");
assert(!JSON.stringify(noHistorySummary).includes("85点上昇"));

const startedSummary = summary(diversifiedNoMonthly, diversifiedMonthly);
assert.strictEqual(startedSummary.state, "improved");
assert(startedSummary.scoreDelta > 0);
assert(JSON.stringify(startedSummary).includes("毎月の積立を開始"));

const stoppedSummary = summary(diversifiedMonthly, diversifiedNoMonthly);
assert.strictEqual(stoppedSummary.state, "needs_attention");
assert(JSON.stringify(stoppedSummary).includes("毎月の積立が停止"));

const cryptoSummary = summary(cryptoLowMonthly, cryptoHeavyMonthly);
assert.strictEqual(cryptoSummary.state, "needs_attention");
assert(JSON.stringify(cryptoSummary).includes("暗号資産への偏り"));
assert.strictEqual(
  cryptoSummary.cautionChanges.filter((item) => item.label.includes("暗号資産")).length,
  1,
);

const resolvedSingleSummary = summary(singleStockNoMonthly, diversifiedNoMonthlyFromSingle);
assert.strictEqual(resolvedSingleSummary.state, "improved");
assert(JSON.stringify(resolvedSingleSummary).includes("単一資産への集中が解消"));

const mixedSummary = summary(cashHeavyNoMonthly, cryptoHeavyMonthly);
assert.strictEqual(mixedSummary.state, "mixed");
assert(JSON.stringify(mixedSummary).includes("毎月の積立を開始"));
assert(JSON.stringify(mixedSummary).includes("暗号資産への偏り"));

const noChangeSummary = createDashboardChangeSummary({
  comparison: smallChangeComparison,
  ...dashboardContext(smallChangeCurrent),
});
assert.strictEqual(noChangeSummary.state, "no_change");
assert(JSON.stringify(noChangeSummary).includes("大きな変化はありません"));

[noHistorySummary, startedSummary, stoppedSummary, cryptoSummary, resolvedSingleSummary, mixedSummary, noChangeSummary].forEach((item, index) => {
  const count =
    item.positiveChanges.length + item.cautionChanges.length + item.neutralChanges.length;
  assert(count <= 3, `summary ${index}: should have at most 3 items`);
  assertNoForbiddenCopy(item, `summary ${index}`);
});

console.log("Portfolio change tracking checks passed.");
console.log(
  JSON.stringify(
    {
      noHistory: noHistorySummary.title,
      contributionStarted: startedSummary.title,
      contributionStopped: stoppedSummary.title,
      cryptoConcentration: cryptoSummary.title,
      singleAssetResolved: resolvedSingleSummary.title,
      mixed: mixedSummary.title,
      smallChange: noChangeSummary.title,
      duplicateSaveCount: loadPortfolioSnapshots(storage).length,
      emptySnapshot: snapshot([]),
      invalidStorageCount: loadPortfolioSnapshots(createMemoryStorage("{bad json")).length,
    },
    null,
    2,
  ),
);
