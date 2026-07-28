import type { SupabaseClient } from "@supabase/supabase-js";
import type { PortfolioAsset } from "../../features/portfolio/types";
import type { PortfolioSnapshot } from "../../features/portfolio-history/types";
import type { PortfolioRepository } from "./repository";
import { sanitizePortfolioAssets } from "./portfolioValidation";
import { portfolioSnapshotStorageRules } from "../portfolio-history/portfolioSnapshotStorage";

type PortfolioAssetRow = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  amount: number | string;
  monthly_contribution: number | string;
  memo: string | null;
  updated_at: string;
};

function toNumber(value: number | string) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function toAsset(row: PortfolioAssetRow): PortfolioAsset {
  return {
    id: row.id,
    name: row.name,
    category: row.category as PortfolioAsset["category"],
    amount: toNumber(row.amount),
    monthlyContribution: toNumber(row.monthly_contribution),
    memo: row.memo ?? undefined,
    updatedAt: row.updated_at,
  };
}

function toAssetRow(asset: PortfolioAsset, userId: string) {
  return {
    id: asset.id,
    user_id: userId,
    name: asset.name,
    category: asset.category,
    amount: Math.round(asset.amount),
    monthly_contribution: Math.round(asset.monthlyContribution),
    memo: asset.memo ?? null,
    updated_at: asset.updatedAt,
  };
}

export function createSupabasePortfolioRepository(
  supabase: SupabaseClient,
  userId: string,
): PortfolioRepository {
  return {
    async loadAssets() {
      const { data, error } = await supabase
        .from("portfolio_assets")
        .select("id,user_id,name,category,amount,monthly_contribution,memo,updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) throw new Error("portfolio_assets_load_failed");
      return sanitizePortfolioAssets((data ?? []).map((row) => toAsset(row as PortfolioAssetRow)));
    },

    async saveAssets(assets) {
      const safeAssets = sanitizePortfolioAssets(assets);
      const { data: currentRows, error: loadError } = await supabase
        .from("portfolio_assets")
        .select("id")
        .eq("user_id", userId);

      if (loadError) throw new Error("portfolio_assets_save_failed");

      const nextIds = new Set(safeAssets.map((asset) => asset.id));
      const deleteIds = (currentRows ?? [])
        .map((row) => String(row.id))
        .filter((id) => !nextIds.has(id));

      if (deleteIds.length > 0) {
        const { error } = await supabase
          .from("portfolio_assets")
          .delete()
          .eq("user_id", userId)
          .in("id", deleteIds);
        if (error) throw new Error("portfolio_assets_save_failed");
      }

      if (safeAssets.length > 0) {
        const { error } = await supabase
          .from("portfolio_assets")
          .upsert(safeAssets.map((asset) => toAssetRow(asset, userId)), {
            onConflict: "user_id,id",
          });
        if (error) throw new Error("portfolio_assets_save_failed");
      }
    },

    async loadSnapshots() {
      const { data, error } = await supabase
        .from("portfolio_snapshots")
        .select("snapshot_data")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })
        .limit(portfolioSnapshotStorageRules.maxSnapshotCount);

      if (error) throw new Error("portfolio_snapshots_load_failed");
      return (data ?? [])
        .map((row) => row.snapshot_data as PortfolioSnapshot)
        .filter((snapshot) => snapshot && snapshot.version === 1)
        .slice(-portfolioSnapshotStorageRules.maxSnapshotCount);
    },

    async saveSnapshots(snapshots) {
      const safeSnapshots = snapshots
        .filter((snapshot) => snapshot && snapshot.version === 1 && snapshot.totalAssets > 0)
        .slice(-portfolioSnapshotStorageRules.maxSnapshotCount);

      const { data: currentRows, error: loadError } = await supabase
        .from("portfolio_snapshots")
        .select("fingerprint")
        .eq("user_id", userId);

      if (loadError) throw new Error("portfolio_snapshots_save_failed");

      const nextFingerprints = new Set(safeSnapshots.map((snapshot) => snapshot.fingerprint));
      const deleteFingerprints = (currentRows ?? [])
        .map((row) => String(row.fingerprint))
        .filter((fingerprint) => !nextFingerprints.has(fingerprint));

      if (deleteFingerprints.length > 0) {
        const { error } = await supabase
          .from("portfolio_snapshots")
          .delete()
          .eq("user_id", userId)
          .in("fingerprint", deleteFingerprints);
        if (error) throw new Error("portfolio_snapshots_save_failed");
      }

      if (safeSnapshots.length > 0) {
        const { error } = await supabase.from("portfolio_snapshots").upsert(
          safeSnapshots.map((snapshot) => ({
            user_id: userId,
            fingerprint: snapshot.fingerprint,
            snapshot_data: snapshot,
            created_at: snapshot.createdAt,
          })),
          { onConflict: "user_id,fingerprint" },
        );
        if (error) throw new Error("portfolio_snapshots_save_failed");
      }
    },
  };
}
