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

export default function PortfolioClient() {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [input, setInput] = useState<AssetFormInput>(emptyInput);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setAssets(loadPortfolioAssets());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    savePortfolioAssets(assets);
  }, [assets, isReady]);

  const summary = useMemo(() => calculatePortfolioSummary(assets), [assets]);
  const allocations = useMemo(() => calculateAssetAllocation(assets), [assets]);

  const handleSubmit = () => {
    if (!input.name.trim()) return;

    if (editingId) {
      setAssets((current) =>
        current.map((asset) =>
          asset.id === editingId ? toAsset(input, editingId) : asset,
        ),
      );
      setEditingId(null);
      setInput(emptyInput);
      return;
    }

    setAssets((current) => [toAsset(input), ...current]);
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
    setAssets((current) => current.filter((asset) => asset.id !== assetId));
    if (editingId === assetId) handleCancel();
  };

  const handleResetDemo = () => {
    window.localStorage.removeItem("aiassetlab_portfolio_assets_v1");
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-sm md:p-8">
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
              className="rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              ホームで確認する
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

        <button
          type="button"
          onClick={handleResetDemo}
          className="self-start text-sm font-semibold text-slate-400 hover:text-slate-600"
        >
          デモ状態に戻す
        </button>
      </div>
    </main>
  );
}
