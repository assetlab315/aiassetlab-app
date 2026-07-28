import type { PortfolioSnapshot } from "../../features/portfolio-history/types";

export const PORTFOLIO_SNAPSHOT_STORAGE_KEY = "aiassetlab.portfolioSnapshots.v1";
const MAX_SNAPSHOT_COUNT = 5;

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function getStorage(storage?: StorageLike): StorageLike | null {
  if (storage) return storage;
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isValidSnapshot(value: unknown): value is PortfolioSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as PortfolioSnapshot;

  if (snapshot.version !== 1) return false;
  if (typeof snapshot.id !== "string" || typeof snapshot.fingerprint !== "string") {
    return false;
  }
  if (Number.isNaN(Date.parse(snapshot.createdAt))) return false;
  if (!isFiniteNumber(snapshot.totalAssets) || snapshot.totalAssets <= 0) return false;
  if (!isFiniteNumber(snapshot.assetCount) || snapshot.assetCount <= 0) return false;
  if (!isFiniteNumber(snapshot.monthlyContribution)) return false;
  if (!Array.isArray(snapshot.categories)) return false;
  if (!isFiniteNumber(snapshot.cashRatio) || !isFiniteNumber(snapshot.cryptoRatio)) {
    return false;
  }
  if (
    !isFiniteNumber(snapshot.largestCategoryRatio) ||
    !Array.isArray(snapshot.healthFactorIds)
  ) {
    return false;
  }
  if (snapshot.healthScore !== null && !isFiniteNumber(snapshot.healthScore)) return false;
  if (
    snapshot.healthGrade !== null &&
    !["A", "B", "C", "D"].includes(snapshot.healthGrade)
  ) {
    return false;
  }

  const categories = new Set<string>();
  return snapshot.categories.every((category) => {
    if (!category || typeof category.category !== "string") return false;
    if (categories.has(category.category)) return false;
    categories.add(category.category);
    return (
      isFiniteNumber(category.amount) &&
      category.amount > 0 &&
      isFiniteNumber(category.ratio) &&
      category.ratio >= 0 &&
      category.ratio <= 100
    );
  });
}

export function loadPortfolioSnapshots(storage?: StorageLike): PortfolioSnapshot[] {
  const targetStorage = getStorage(storage);
  if (!targetStorage) return [];

  try {
    const stored = targetStorage.getItem(PORTFOLIO_SNAPSHOT_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidSnapshot).slice(-MAX_SNAPSHOT_COUNT);
  } catch {
    return [];
  }
}

export function savePortfolioSnapshots(
  snapshots: PortfolioSnapshot[],
  storage?: StorageLike,
) {
  const targetStorage = getStorage(storage);
  if (!targetStorage) return;

  const validSnapshots = snapshots.filter(isValidSnapshot).slice(-MAX_SNAPSHOT_COUNT);

  try {
    targetStorage.setItem(
      PORTFOLIO_SNAPSHOT_STORAGE_KEY,
      JSON.stringify(validSnapshots),
    );
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Portfolio snapshot storage failed.");
    }
  }
}

export function savePortfolioSnapshot(
  snapshot: PortfolioSnapshot | null,
  storage?: StorageLike,
) {
  if (!snapshot || !isValidSnapshot(snapshot)) return;

  const snapshots = loadPortfolioSnapshots(storage);
  const latestSnapshot = snapshots[snapshots.length - 1] ?? null;

  if (latestSnapshot?.fingerprint === snapshot.fingerprint) return;
  if (snapshots.some((stored) => stored.fingerprint === snapshot.fingerprint)) return;

  savePortfolioSnapshots([...snapshots, snapshot].slice(-MAX_SNAPSHOT_COUNT), storage);
}

export function ensureInitialPortfolioSnapshot(
  snapshot: PortfolioSnapshot | null,
  storage?: StorageLike,
) {
  if (!snapshot || !isValidSnapshot(snapshot)) return;
  const snapshots = loadPortfolioSnapshots(storage);
  if (snapshots.length > 0) return;
  savePortfolioSnapshots([snapshot], storage);
}

export function getLatestSnapshot(storage?: StorageLike) {
  const snapshots = loadPortfolioSnapshots(storage);
  return snapshots[snapshots.length - 1] ?? null;
}

export function getPreviousDistinctSnapshot(storage?: StorageLike) {
  const snapshots = loadPortfolioSnapshots(storage);
  const latestSnapshot = snapshots[snapshots.length - 1] ?? null;
  if (!latestSnapshot) return null;

  for (let index = snapshots.length - 2; index >= 0; index -= 1) {
    const snapshot = snapshots[index];
    if (snapshot.fingerprint !== latestSnapshot.fingerprint) {
      return snapshot;
    }
  }

  return null;
}

export function getLatestSnapshotPair(storage?: StorageLike) {
  const currentSnapshot = getLatestSnapshot(storage);
  if (!currentSnapshot) {
    return {
      currentSnapshot: null,
      previousSnapshot: null,
    };
  }

  return {
    currentSnapshot,
    previousSnapshot: getPreviousDistinctSnapshot(storage),
  };
}

export function clearPortfolioSnapshots(storage?: StorageLike) {
  const targetStorage = getStorage(storage);
  if (!targetStorage) return;

  try {
    targetStorage.removeItem(PORTFOLIO_SNAPSHOT_STORAGE_KEY);
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Portfolio snapshot clear failed.");
    }
  }
}

export const portfolioSnapshotStorageRules = {
  maxSnapshotCount: MAX_SNAPSHOT_COUNT,
  storageKey: PORTFOLIO_SNAPSHOT_STORAGE_KEY,
};
