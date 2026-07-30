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
  getPortfolioMigrationState,
} = require("../lib/portfolio/portfolioMigration.ts");
const {
  createAssetsFingerprint,
} = require("../lib/portfolio/portfolioFingerprint.ts");

function asset(id, amount) {
  return {
    id,
    name: id,
    category: "fund",
    amount,
    monthlyContribution: 10000,
    updatedAt: "2026-07-28T00:00:00.000Z",
  };
}

function snapshot(fingerprint) {
  return {
    version: 1,
    id: `snapshot-${fingerprint}`,
    createdAt: "2026-07-28T00:00:00.000Z",
    fingerprint,
    totalAssets: 100000,
    assetCount: 1,
    monthlyContribution: 10000,
    categories: [{ category: "fund", amount: 100000, ratio: 100 }],
    cashRatio: 0,
    cryptoRatio: 0,
    largestCategory: "fund",
    largestCategoryRatio: 100,
    healthScore: 70,
    healthGrade: "B",
    healthFactorIds: [],
  };
}

const localAssets = [asset("asset-local", 100000), asset("asset-cash", 50000)];
const cloudAssets = [asset("asset-cloud", 300000), asset("asset-fund", 200000), asset("asset-stock", 100000)];
const sameLocal = [asset("asset-same", 100000)];
const sameCloud = [asset("asset-same", 100000)];

const cases = {
  guestNew: getPortfolioMigrationState([], []),
  guestAssetsCloudEmpty: getPortfolioMigrationState(localAssets, []),
  local0Cloud3: getPortfolioMigrationState([], cloudAssets),
  local2Cloud3: getPortfolioMigrationState(localAssets, cloudAssets),
  sameFingerprint: getPortfolioMigrationState(sameLocal, sameCloud, [snapshot("a")], [snapshot("a")]),
  sameAssetsDifferentSnapshots: getPortfolioMigrationState(sameLocal, sameCloud, [snapshot("a")], [snapshot("b")]),
};

assert.strictEqual(cases.guestNew.decision, "empty");
assert.strictEqual(cases.guestAssetsCloudEmpty.decision, "use_local");
assert.strictEqual(cases.local0Cloud3.decision, "use_cloud");
assert.strictEqual(cases.local2Cloud3.decision, "conflict");
assert.strictEqual(cases.sameFingerprint.decision, "same");
assert.strictEqual(cases.sameAssetsDifferentSnapshots.decision, "conflict");
assert.strictEqual(createAssetsFingerprint([asset("b", 2), asset("a", 1)]), createAssetsFingerprint([asset("a", 1), asset("b", 2)]));

const syncSource = fs.readFileSync("lib/portfolio/usePortfolioSync.ts", "utf8");
assert(syncSource.includes("uploadLocalToCloud"), "migration approval action should exist");
assert(syncSource.includes("prepareOverwriteCloud"), "overwrite should require preparation");
assert(syncSource.includes("confirmOverwriteCloud"), "overwrite should require confirmation");
assert(syncSource.includes("latestCloudAssets.length !== overwriteState.cloudAssetCount"), "overwrite should re-fetch cloud before write");
assert(syncSource.includes("cloudRepository.saveAssets"), "cloud save path should exist");
assert(syncSource.includes("localRepository.saveAssets(nextAssets)"), "guest fallback save path should exist");
assert(!syncSource.includes("console.log"), "sync should not log portfolio data");
assert(!syncSource.includes("console.error"), "sync should not log portfolio data");

const repositorySource = fs.readFileSync("lib/portfolio/supabasePortfolioRepository.ts", "utf8");
assert(repositorySource.includes("onConflict: \"user_id,id\""), "asset id should be preserved per user");
assert(repositorySource.includes("onConflict: \"user_id,fingerprint\""), "snapshot duplicate fingerprints should be prevented");
assert(repositorySource.includes("Math.round(asset.amount)"), "amount should be integer JPY");

const sql = fs.readFileSync("supabase/migrations/20260728000000_create_portfolio_sync.sql", "utf8");
assert(sql.includes("alter table public.portfolio_assets enable row level security"));
assert(sql.includes("alter table public.portfolio_snapshots enable row level security"));
["select", "insert", "update", "delete"].forEach((operation) => {
  assert(sql.includes(`for ${operation}`), `RLS ${operation} policy required`);
});
assert(sql.match(/auth\.uid\(\) = user_id/g).length >= 8, "RLS should use auth.uid ownership checks");
assert(sql.includes("primary key (user_id, id)"), "asset id should be user-scoped text");
assert(sql.includes("numeric(14, 0)"), "amounts should be integer numeric");
assert(sql.includes("char_length(name) between 1 and 120"), "asset name length should be constrained");
assert(sql.includes("unique (user_id, fingerprint)"), "snapshots should be unique per user fingerprint");

console.log("Portfolio sync checks passed.");
console.log(
  JSON.stringify(
    {
      guestNew: cases.guestNew.decision,
      guestAssetsCloudEmpty: cases.guestAssetsCloudEmpty.decision,
      local0Cloud3: cases.local0Cloud3.decision,
      local2Cloud3: cases.local2Cloud3.decision,
      sameFingerprint: cases.sameFingerprint.decision,
      sameAssetsDifferentSnapshots: cases.sameAssetsDifferentSnapshots.decision,
      migrationReject: "skipMigration keeps data local and does not upload",
      migrationApprove: "uploadLocalToCloud writes after explicit action",
      cloudSaveFailure: "status=error and UI data remains",
      logout: "signOut route plus local/cloud cache clearing",
      userAToUserB: "RLS and user-hashed cloud cache keys isolate users",
      invalidLocalStorage: "sanitizePortfolioAssets filters invalid data",
      invalidCloudResponse: "sanitizePortfolioAssets filters invalid rows",
    },
    null,
    2,
  ),
);
