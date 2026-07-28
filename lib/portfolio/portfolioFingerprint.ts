import type { PortfolioAsset } from "../../features/portfolio/types";
import type { PortfolioSnapshot } from "../../features/portfolio-history/types";

export function createAssetsFingerprint(assets: PortfolioAsset[]) {
  return JSON.stringify(
    assets
      .map((asset) => ({
        id: asset.id,
        name: asset.name,
        category: asset.category,
        amount: asset.amount,
        monthlyContribution: asset.monthlyContribution,
        memo: asset.memo ?? "",
      }))
      .sort((a, b) => a.id.localeCompare(b.id)),
  );
}

export function createSnapshotsFingerprint(snapshots: PortfolioSnapshot[]) {
  return snapshots.map((snapshot) => snapshot.fingerprint).join("|");
}
