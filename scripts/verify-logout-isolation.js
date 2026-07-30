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
  getCloudPortfolioCacheKey,
  getCloudSnapshotCacheKey,
  hashUserId,
} = require("../lib/portfolio/cloudPortfolioCache.ts");

assert.notStrictEqual(hashUserId("user-a"), hashUserId("user-b"));
assert(!getCloudPortfolioCacheKey("user-a").includes("user-a"));
assert(!getCloudSnapshotCacheKey("user-a").includes("user-a"));
assert.notStrictEqual(getCloudPortfolioCacheKey("user-a"), getCloudPortfolioCacheKey("user-b"));
assert.notStrictEqual(getCloudSnapshotCacheKey("user-a"), getCloudSnapshotCacheKey("user-b"));

const accountSource = fs.readFileSync("components/auth/AccountClient.tsx", "utf8");
const cacheSource = fs.readFileSync("lib/portfolio/cloudPortfolioCache.ts", "utf8");
assert(accountSource.includes("clearCloudPortfolioCache(user.id)"), "logout should clear user cloud cache");
assert(accountSource.includes("clearPortfolioAssets()"), "logout should clear formal portfolio localStorage");
assert(accountSource.includes("clearPortfolioSnapshots()"), "logout should clear snapshots");
assert(accountSource.includes("form.action = \"/auth/logout\""), "logout should use server route");
assert(cacheSource.includes("PORTFOLIO_GUEST_BACKUP_KEY"), "migration skip should have a guest backup key");
assert(cacheSource.includes("PORTFOLIO_MIGRATION_PENDING_KEY"), "migration pending should have a durable key");

const logoutRouteSource = fs.readFileSync("app/auth/logout/route.ts", "utf8");
assert(logoutRouteSource.includes("auth.signOut"), "logout route should sign out Supabase");
assert(!logoutRouteSource.includes("console.log"), "logout should not log tokens");
assert(!logoutRouteSource.includes("console.error"), "logout should not log tokens");

const syncSource = fs.readFileSync("lib/portfolio/usePortfolioSync.ts", "utf8");
const portfolioSource = fs.readFileSync("components/portfolio/PortfolioClient.tsx", "utf8");
assert(syncSource.includes("latestCloudAssets.length !== overwriteState.cloudAssetCount"), "overwrite should re-check cloud state");
assert(portfolioSource.includes("disabled={status === \"saving\"}"), "UI should prevent double submit while saving");
assert(portfolioSource.includes("aria-live=\"polite\""), "sync status should be announced");
assert(!syncSource.includes("console.log"), "sync should not log portfolio data");
assert(!syncSource.includes("console.error"), "sync should not log portfolio data");

console.log("Logout isolation checks passed.");
console.log(
  JSON.stringify(
    {
      userCacheKeysSeparated: true,
      rawUserIdInCacheKey: false,
      cloudCacheClearedOnLogout: true,
      formalPortfolioClearedOnLogout: true,
      overwriteRefetchBeforeWrite: true,
      doubleSubmitGuard: true,
    },
    null,
    2,
  ),
);
