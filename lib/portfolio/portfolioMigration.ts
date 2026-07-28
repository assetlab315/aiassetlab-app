import type { PortfolioAsset } from "../../features/portfolio/types";
import type { PortfolioSnapshot } from "../../features/portfolio-history/types";
import type { PortfolioMigrationDecision } from "./repository";
import { createAssetsFingerprint, createSnapshotsFingerprint } from "./portfolioFingerprint";

export type PortfolioMigrationState = {
  decision: PortfolioMigrationDecision;
  localAssetCount: number;
  cloudAssetCount: number;
  localSnapshotCount: number;
  cloudSnapshotCount: number;
};

export function getPortfolioMigrationState(
  localAssets: PortfolioAsset[],
  cloudAssets: PortfolioAsset[],
  localSnapshots: PortfolioSnapshot[] = [],
  cloudSnapshots: PortfolioSnapshot[] = [],
): PortfolioMigrationState {
  const localAssetCount = localAssets.length;
  const cloudAssetCount = cloudAssets.length;
  const localSnapshotCount = localSnapshots.length;
  const cloudSnapshotCount = cloudSnapshots.length;

  if (localAssetCount === 0 && cloudAssetCount === 0) {
    return { decision: "empty", localAssetCount, cloudAssetCount, localSnapshotCount, cloudSnapshotCount };
  }

  if (localAssetCount > 0 && cloudAssetCount === 0) {
    return { decision: "use_local", localAssetCount, cloudAssetCount, localSnapshotCount, cloudSnapshotCount };
  }

  if (localAssetCount === 0 && cloudAssetCount > 0) {
    return { decision: "use_cloud", localAssetCount, cloudAssetCount, localSnapshotCount, cloudSnapshotCount };
  }

  const sameAssets = createAssetsFingerprint(localAssets) === createAssetsFingerprint(cloudAssets);
  const sameSnapshots =
    createSnapshotsFingerprint(localSnapshots) === createSnapshotsFingerprint(cloudSnapshots);

  if (sameAssets && sameSnapshots) {
    return { decision: "same", localAssetCount, cloudAssetCount, localSnapshotCount, cloudSnapshotCount };
  }

  return { decision: "conflict", localAssetCount, cloudAssetCount, localSnapshotCount, cloudSnapshotCount };
}
