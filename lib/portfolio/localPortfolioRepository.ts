import type { PortfolioRepository } from "./repository";
import { loadPortfolioAssets, savePortfolioAssets } from "./storage";
import {
  loadPortfolioSnapshots,
  savePortfolioSnapshots,
} from "../portfolio-history/portfolioSnapshotStorage";

export function createLocalPortfolioRepository(): PortfolioRepository {
  return {
    async loadAssets() {
      return loadPortfolioAssets();
    },
    async saveAssets(assets) {
      savePortfolioAssets(assets);
    },
    async loadSnapshots() {
      return loadPortfolioSnapshots();
    },
    async saveSnapshots(snapshots) {
      savePortfolioSnapshots(snapshots);
    },
  };
}
