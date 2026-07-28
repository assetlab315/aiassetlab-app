import type { PortfolioAsset } from "../../features/portfolio/types";
import type { PortfolioSnapshot } from "../../features/portfolio-history/types";

export type SyncStatus =
  | "idle"
  | "loading"
  | "saving"
  | "saved"
  | "error"
  | "migration_required"
  | "conflict";

export interface PortfolioRepository {
  loadAssets(): Promise<PortfolioAsset[]>;
  saveAssets(assets: PortfolioAsset[]): Promise<void>;
  loadSnapshots(): Promise<PortfolioSnapshot[]>;
  saveSnapshots(snapshots: PortfolioSnapshot[]): Promise<void>;
}

export type PortfolioMigrationDecision =
  | "empty"
  | "use_local"
  | "use_cloud"
  | "conflict"
  | "same";
