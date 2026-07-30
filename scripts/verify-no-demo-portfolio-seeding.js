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

const { PORTFOLIO_STORAGE_KEY } = require("../features/portfolio/constants.ts");
const {
  loadPortfolioAssets,
  savePortfolioAssets,
} = require("../lib/portfolio/storage.ts");
const {
  createPortfolioSnapshotFromAssets,
} = require("../lib/portfolio-history/createPortfolioSnapshot.ts");
const {
  ensureInitialPortfolioSnapshot,
  loadPortfolioSnapshots,
  portfolioSnapshotStorageRules,
} = require("../lib/portfolio-history/portfolioSnapshotStorage.ts");

function createStorage(initialEntries = {}) {
  const map = new Map(Object.entries(initialEntries));
  const writes = [];

  return {
    localStorage: {
      getItem: (key) => (map.has(key) ? map.get(key) : null),
      setItem: (key, value) => {
        writes.push({ key, value });
        map.set(key, value);
      },
      removeItem: (key) => {
        map.delete(key);
      },
    },
    map,
    writes,
  };
}

function withWindow(storage, callback) {
  const previousWindow = global.window;
  global.window = { localStorage: storage.localStorage };
  try {
    return callback();
  } finally {
    global.window = previousWindow;
  }
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

function assertNoDemoAssets(assets, label) {
  const text = JSON.stringify(assets);
  assert(!text.includes("生活防衛資金"), `${label}: should not include demo cash`);
  assert(!text.includes("新NISA 全世界株式"), `${label}: should not include demo fund`);
  assert.strictEqual(assets.length, 0, `${label}: should be empty`);
}

const keyless = createStorage();
withWindow(keyless, () => {
  assertNoDemoAssets(loadPortfolioAssets(), "keyless");
});
assert.strictEqual(keyless.writes.length, 0, "keyless should not write localStorage");

const privateBrowserLike = createStorage();
withWindow(privateBrowserLike, () => {
  assert.deepStrictEqual(loadPortfolioAssets(), []);
});
assert.strictEqual(privateBrowserLike.writes.length, 0);

const emptyString = createStorage({ [PORTFOLIO_STORAGE_KEY]: "" });
withWindow(emptyString, () => {
  assert.deepStrictEqual(loadPortfolioAssets(), []);
});

const invalidJson = createStorage({ [PORTFOLIO_STORAGE_KEY]: "{bad json" });
withWindow(invalidJson, () => {
  assert.deepStrictEqual(loadPortfolioAssets(), []);
});
assert.strictEqual(invalidJson.writes.length, 0, "parse failure should not write fallback assets");

const emptyArray = createStorage({ [PORTFOLIO_STORAGE_KEY]: "[]" });
withWindow(emptyArray, () => {
  assert.deepStrictEqual(loadPortfolioAssets(), []);
});

const existingAssets = [
  asset("現金", "cash", 100000, 0),
  asset("投資信託", "fund", 200000, 30000),
];
const existingStorage = createStorage({
  [PORTFOLIO_STORAGE_KEY]: JSON.stringify(existingAssets),
});
withWindow(existingStorage, () => {
  assert.deepStrictEqual(loadPortfolioAssets(), existingAssets);
});

const invalidAssetStorage = createStorage({
  [PORTFOLIO_STORAGE_KEY]: JSON.stringify([
    asset("現金", "cash", 100000, 0),
    { id: "bad", name: "bad", category: "unknown", amount: Number.NaN },
  ]),
});
withWindow(invalidAssetStorage, () => {
  assert.deepStrictEqual(loadPortfolioAssets(), [asset("現金", "cash", 100000, 0)]);
});

const saveStorage = createStorage();
withWindow(saveStorage, () => {
  savePortfolioAssets(existingAssets);
});
assert.strictEqual(saveStorage.writes.length, 1);
assert.deepStrictEqual(JSON.parse(saveStorage.map.get(PORTFOLIO_STORAGE_KEY)), existingAssets);

const noAssetSnapshotStorage = createStorage();
const emptySnapshot = createPortfolioSnapshotFromAssets([]);
assert.strictEqual(emptySnapshot, null);
ensureInitialPortfolioSnapshot(emptySnapshot, noAssetSnapshotStorage.localStorage);
assert.strictEqual(loadPortfolioSnapshots(noAssetSnapshotStorage.localStorage).length, 0);
assert(!noAssetSnapshotStorage.map.has(portfolioSnapshotStorageRules.storageKey));

const firstAssetSnapshotStorage = createStorage();
const firstSnapshot = createPortfolioSnapshotFromAssets([asset("現金", "cash", 100000, 0)]);
ensureInitialPortfolioSnapshot(firstSnapshot, firstAssetSnapshotStorage.localStorage);
assert.strictEqual(loadPortfolioSnapshots(firstAssetSnapshotStorage.localStorage).length, 1);

const sourceChecks = [
  "lib/portfolio/storage.ts",
  "components/portfolio/PortfolioClient.tsx",
  "components/dashboard/DashboardClient.tsx",
  "features/portfolio/constants.ts",
].map((file) => ({
  file,
  source: fs.readFileSync(file, "utf8"),
}));

const forbiddenPatterns = [
  /return\s+DEMO_ASSETS/,
  /return\s+SAMPLE_ASSETS/,
  /return\s+DEFAULT_ASSETS/,
  /useState\s*\(\s*DEMO_ASSETS\s*\)/,
  /useState\s*\(\s*DEFAULT_ASSETS\s*\)/,
  /savePortfolioAssets\s*\(\s*DEMO_ASSETS\s*\)/,
  /savePortfolioAssets\s*\(\s*DEFAULT_ASSETS\s*\)/,
  /デモ状態に戻す/,
];

sourceChecks.forEach(({ file, source }) => {
  forbiddenPatterns.forEach((pattern) => {
    assert(!pattern.test(source), `${file}: forbidden pattern ${pattern}`);
  });
});

assert(
  /useState<PortfolioAsset\[\]>\(\[\]\)/.test(
    fs.readFileSync("lib/portfolio/usePortfolioSync.ts", "utf8"),
  ),
  "Portfolio sync hook should initialize with empty assets",
);
assert(
  /usePortfolioSync\(\)/.test(fs.readFileSync("components/dashboard/DashboardClient.tsx", "utf8")),
  "DashboardClient should use the portfolio sync hook initialized with empty assets",
);
assert(
  /isReady \? createPortfolioInsights\(assets\) : null/.test(
    fs.readFileSync("components/dashboard/DashboardClient.tsx", "utf8"),
  ),
  "Dashboard should not analyze assets before hydration",
);

console.log("No demo portfolio seeding checks passed.");
console.log(
  JSON.stringify(
    {
      keyless: loadWith(keyless),
      privateBrowserLike: loadWith(privateBrowserLike),
      existingAssets: loadWith(existingStorage).length,
      invalidJson: loadWith(invalidJson),
      firstAssetSnapshotCount: loadPortfolioSnapshots(firstAssetSnapshotStorage.localStorage).length,
      reloadAssetCount: loadWith(existingStorage).length,
      zeroAssetSnapshot: emptySnapshot,
    },
    null,
    2,
  ),
);

function loadWith(storage) {
  return withWindow(storage, () => loadPortfolioAssets());
}
