"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
import { usePortfolioSync } from "../../lib/portfolio/usePortfolioSync";

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
  const [input, setInput] = useState<AssetFormInput>(emptyInput);
  const [editingId, setEditingId] = useState<string | null>(null);
  const {
    assets,
    user,
    isReady,
    status,
    message,
    migrationState,
    overwriteState,
    saveAssets,
    skipMigration,
    uploadLocalToCloud,
    useCloudData,
    prepareOverwriteCloud,
    confirmOverwriteCloud,
    cancelOverwrite,
  } = usePortfolioSync();

  const summary = useMemo(() => calculatePortfolioSummary(assets), [assets]);
  const allocations = useMemo(() => calculateAssetAllocation(assets), [assets]);

  const handleSubmit = async () => {
    if (!input.name.trim()) return;

    if (editingId) {
      const nextAssets = assets.map((asset) =>
        asset.id === editingId ? toAsset(input, editingId) : asset,
      );
      await saveAssets(nextAssets);
      setEditingId(null);
      setInput(emptyInput);
      return;
    }

    await saveAssets([toAsset(input), ...assets]);
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

  const handleDelete = async (assetId: string) => {
    await saveAssets(assets.filter((asset) => asset.id !== assetId));
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

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black text-blue-600">
                {user ? "アカウント同期" : "ゲスト保存"}
              </p>
              <p className="mt-1 text-sm font-bold leading-6 text-slate-600" aria-live="polite">
                {message}
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
              {status === "saving"
                ? "保存中…"
                : status === "saved"
                  ? "保存しました"
                  : status === "error"
                    ? "保存できませんでした"
                    : status === "conflict"
                      ? "選択が必要"
                      : status === "migration_required"
                        ? "移行確認"
                        : "待機中"}
            </span>
          </div>

          {migrationState?.decision === "use_local" ? (
            <div className="mt-4 rounded-2xl bg-blue-50 p-4" role="region" aria-labelledby="portfolio-migration-title">
              <p id="portfolio-migration-title" className="font-black text-blue-900">
                このブラウザに登録されている資産{migrationState.localAssetCount}件をアカウントへ保存しますか？
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-blue-800">
                アカウントへ保存すると、別の端末でも確認できるようになります。
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={skipMigration}
                  disabled={status === "saving"}
                  className="min-h-11 rounded-full border border-blue-200 bg-white px-4 text-sm font-black text-blue-700"
                >
                  今回は保存しない
                </button>
                <button
                  type="button"
                  onClick={uploadLocalToCloud}
                  disabled={status === "saving"}
                  className="min-h-11 rounded-full bg-blue-600 px-4 text-sm font-black text-white"
                >
                  アカウントへ保存
                </button>
              </div>
            </div>
          ) : null}

          {migrationState?.decision === "conflict" ? (
            <div className="mt-4 rounded-2xl bg-amber-50 p-4" role="region" aria-labelledby="portfolio-conflict-title">
              <p id="portfolio-conflict-title" className="font-black text-amber-900">保存済みデータが見つかりました</p>
              <p className="mt-2 text-sm font-bold leading-6 text-amber-800">
                この端末のデータ: {migrationState.localAssetCount}件 / アカウントのデータ: {migrationState.cloudAssetCount}件
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={useCloudData}
                  disabled={status === "saving"}
                  className="min-h-11 rounded-full bg-slate-900 px-4 text-sm font-black text-white"
                >
                  アカウントのデータを使用
                </button>
                <button
                  type="button"
                  onClick={prepareOverwriteCloud}
                  disabled={status === "saving"}
                  className="min-h-11 rounded-full border border-amber-300 bg-white px-4 text-sm font-black text-amber-800"
                >
                  この端末のデータで置き換える
                </button>
                <button
                  type="button"
                  onClick={skipMigration}
                  disabled={status === "saving"}
                  className="min-h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-black text-slate-700"
                >
                  後で決める
                </button>
              </div>
            </div>
          ) : null}

          {overwriteState ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4" role="region" aria-labelledby="portfolio-overwrite-title">
              <p id="portfolio-overwrite-title" className="font-black text-red-900">
                アカウントに保存されている資産{overwriteState.cloudAssetCount}件が、この端末の資産{overwriteState.localAssets.length}件で置き換えられます。
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={cancelOverwrite}
                  disabled={status === "saving"}
                  className="min-h-11 rounded-full border border-red-200 bg-white px-4 text-sm font-black text-red-800"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={confirmOverwriteCloud}
                  disabled={status === "saving"}
                  className="min-h-11 rounded-full bg-red-600 px-4 text-sm font-black text-white"
                >
                  置き換える
                </button>
              </div>
            </div>
          ) : null}
        </section>

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
