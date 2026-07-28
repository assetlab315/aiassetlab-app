"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AssetForm from "./AssetForm";
import AssetTable from "./AssetTable";
import AllocationChart from "./AllocationChart";
import EmptyPortfolio from "./EmptyPortfolio";
import PortfolioNextActions from "./PortfolioNextActions";
import PortfolioSummaryCards from "./PortfolioSummaryCards";
import type { AssetFormInput, PortfolioAsset } from "../../features/portfolio/types";
import {
  calculateAssetAllocation,
  calculatePortfolioSummary,
} from "../../lib/portfolio/calculatePortfolio";
import { loadPortfolioAssets, savePortfolioAssets } from "../../lib/portfolio/storage";
import { createPortfolioSnapshotFromAssets } from "../../lib/portfolio-history/createPortfolioSnapshot";
import { savePortfolioSnapshot } from "../../lib/portfolio-history/portfolioSnapshotStorage";

const emptyInput: AssetFormInput = {
  name: "",
  category: "fund",
  amount: "",
  monthlyContribution: "",
  memo: "",
};

function toAsset(input: AssetFormInput, existingId?: string): PortfolioAsset {
  return {
    id: existingId ?? `asset-${Date.now()}`,
    name: input.name.trim(),
    category: input.category,
    amount: Math.max(Number(input.amount), 0),
    monthlyContribution: Math.max(Number(input.monthlyContribution), 0),
    memo: input.memo.trim(),
    updatedAt: new Date().toISOString(),
  };
}

function toInput(asset: PortfolioAsset): AssetFormInput {
  return {
    name: asset.name,
    category: asset.category,
    amount: String(asset.amount),
    monthlyContribution: String(asset.monthlyContribution),
    memo: asset.memo ?? "",
  };
}

function savePortfolioChangeSnapshot(assets: PortfolioAsset[]) {
  try {
    savePortfolioSnapshot(createPortfolioSnapshotFromAssets(assets));
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Portfolio change snapshot failed.");
    }
  }
}

function savePortfolioChange(assets: PortfolioAsset[]) {
  savePortfolioAssets(assets);
  savePortfolioChangeSnapshot(assets);
}

export default function PortfolioClient() {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [input, setInput] = useState<AssetFormInput>(emptyInput);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setAssets(loadPortfolioAssets());
    setIsReady(true);
  }, []);

  const summary = useMemo(() => calculatePortfolioSummary(assets), [assets]);
  const allocations = useMemo(() => calculateAssetAllocation(assets), [assets]);

  const handleSubmit = () => {
    if (!input.name.trim()) return;

    if (editingId) {
      setAssets((current) => {
        const nextAssets = current.map((asset) =>
          asset.id === editingId ? toAsset(input, editingId) : asset,
        );
        savePortfolioChange(nextAssets);
        return nextAssets;
      });
      setEditingId(null);
      setInput(emptyInput);
      return;
    }

    setAssets((current) => {
      const nextAssets = [toAsset(input), ...current];
      savePortfolioChange(nextAssets);
      return nextAssets;
    });
    setInput(emptyInput);
  };

  const handleEdit = (asset: PortfolioAsset) => {
    setEditingId(asset.id);
    setInput(toInput(asset));
  };

  const handleCancel = () => {
    setEditingId(null);
    setInput(emptyInput);
  };

  const handleDelete = (assetId: string) => {
    setAssets((current) => {
      const nextAssets = current.filter((asset) => asset.id !== assetId);
      savePortfolioChange(nextAssets);
      return nextAssets;
    });
    if (editingId === assetId) handleCancel();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-sm md:p-8">
          <p className="text-sm font-bold text-blue-100">AI Asset Lab</p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black md:text-4xl">資産を登録・確認する</h1>
              <p className="mt-3 max-w-2xl leading-7 text-blue-50">
                いま持っている資産と毎月の積立を登録すると、DashboardとAI相談があなた向けになります。
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Dashboardを見る
            </Link>
          </div>
        </section>

        <PortfolioSummaryCards summary={summary} />

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <AssetForm
            input={input}
            isEditing={Boolean(editingId)}
            onCancel={handleCancel}
            onChange={setInput}
            onSubmit={handleSubmit}
          />

          <div className="space-y-6">
            {assets.length === 0 ? (
              <EmptyPortfolio />
            ) : (
              <>
                <AllocationChart allocations={allocations} />
                <AssetTable
                  assets={assets}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </>
            )}
          </div>
        </div>

        <PortfolioNextActions />

      </div>
    </main>
  );
}
