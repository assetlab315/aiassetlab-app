import type { PortfolioAsset } from "../../features/portfolio/types";
import type { PortfolioSnapshot } from "../../features/portfolio-history/types";
import { sanitizePortfolioAssets } from "./portfolioValidation";
import {
  loadPortfolioSnapshots,
  savePortfolioSnapshots,
} from "../portfolio-history/portfolioSnapshotStorage";

export const PORTFOLIO_SYNC_META_KEY = "aiassetlab.portfolioSyncMeta.v1";

type SyncMeta = {
  lastUserHash: string;
  lastCloudFingerprint: string;
  syncedAt: string;
};

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function getStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function hashUserId(userId: string) {
  let hash = 2166136261;
  for (let index = 0; index < userId.length; index += 1) {
    hash ^= userId.charCodeAt(index);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return `u${(hash >>> 0).toString(16)}`;
}

export function getCloudPortfolioCacheKey(userId: string) {
  return `aiassetlab.cloudPortfolioCache.v1.${hashUserId(userId)}`;
}

export function getCloudSnapshotCacheKey(userId: string) {
  return `aiassetlab.cloudPortfolioSnapshots.v1.${hashUserId(userId)}`;
}

export function loadCloudPortfolioCache(userId: string): PortfolioAsset[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const stored = storage.getItem(getCloudPortfolioCacheKey(userId));
    return stored ? sanitizePortfolioAssets(JSON.parse(stored)) : [];
  } catch {
    return [];
  }
}

export function saveCloudPortfolioCache(userId: string, assets: PortfolioAsset[]) {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(getCloudPortfolioCacheKey(userId), JSON.stringify(sanitizePortfolioAssets(assets)));
}

export function loadCloudSnapshotCache(userId: string): PortfolioSnapshot[] {
  const storage = getStorage();
  if (!storage) return [];

  return loadPortfolioSnapshots({
    getItem: (key) =>
      key === getCloudSnapshotCacheKey(userId) ? storage.getItem(getCloudSnapshotCacheKey(userId)) : null,
    setItem: () => undefined,
    removeItem: () => undefined,
  });
}

export function saveCloudSnapshotCache(userId: string, snapshots: PortfolioSnapshot[]) {
  const storage = getStorage();
  if (!storage) return;

  savePortfolioSnapshots(snapshots, {
    getItem: (key) =>
      key === getCloudSnapshotCacheKey(userId) ? storage.getItem(getCloudSnapshotCacheKey(userId)) : null,
    setItem: (_key, value) => storage.setItem(getCloudSnapshotCacheKey(userId), value),
    removeItem: () => storage.removeItem(getCloudSnapshotCacheKey(userId)),
  });
}

export function clearCloudPortfolioCache(userId: string) {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(getCloudPortfolioCacheKey(userId));
  storage.removeItem(getCloudSnapshotCacheKey(userId));
}

export function getPortfolioSyncMeta(): SyncMeta | null {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const stored = storage.getItem(PORTFOLIO_SYNC_META_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as SyncMeta;
    if (
      typeof parsed.lastUserHash !== "string" ||
      typeof parsed.lastCloudFingerprint !== "string" ||
      typeof parsed.syncedAt !== "string"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function savePortfolioSyncMeta(userId: string, cloudFingerprint: string) {
  const storage = getStorage();
  if (!storage) return;

  const meta: SyncMeta = {
    lastUserHash: hashUserId(userId),
    lastCloudFingerprint: cloudFingerprint,
    syncedAt: new Date().toISOString(),
  };

  storage.setItem(PORTFOLIO_SYNC_META_KEY, JSON.stringify(meta));
}
