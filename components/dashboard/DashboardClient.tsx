"use client";

import { useEffect, useMemo, useState } from "react";
import ActionCard from "../common/ActionCard";
import DashboardPremiumPreviewCard from "./DashboardPremiumPreviewCard";
import AIAdviceCard from "../common/AIAdviceCard";
import FeatureNavigation from "../common/FeatureNavigation";
import SectionHeader from "../common/SectionHeader";
import PageContainer from "../layout/PageContainer";
import Button from "../ui/Button";
import Card from "../ui/Card";
import type { PortfolioAsset } from "../../features/portfolio/types";
import { calculatePortfolioSummary } from "../../lib/portfolio/calculatePortfolio";
import { formatCurrency } from "../../lib/portfolio/formatPortfolio";
import { loadPortfolioAssets } from "../../lib/portfolio/storage";
import {
  createDashboardAdvice,
  createDashboardHabit,
  createDashboardPremiumPreview,
  createDashboardTasks,
} from "../../lib/dashboard/createDashboardInsights";

export default function DashboardClient() {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setAssets(loadPortfolioAssets());
    setIsReady(true);
  }, []);

  const summary = useMemo(() => calculatePortfolioSummary(assets), [assets]);
  const advice = useMemo(
    () => createDashboardAdvice(assets, summary),
    [assets, summary],
  );
  const tasks = useMemo(() => createDashboardTasks(assets, summary), [assets, summary]);
  const habit = useMemo(() => createDashboardHabit(assets, summary), [assets, summary]);
  const premiumPreview = useMemo(
    () => createDashboardPremiumPreview(assets, summary),
    [assets, summary],
  );

  return (
    <PageContainer size="xl">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-black text-blue-600">AI Dashboard</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              おかえりなさい。
              <br />
              今日やることを整理しました。
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              登録した資産をもとに、AI Asset Labが今日のおすすめを整理します。迷ったら上から順番に進めれば大丈夫です。
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href={advice.ctaHref}>{advice.ctaLabel}</Button>
              <Button href="/chat" variant="outline">
                AIに相談する
              </Button>
            </div>
          </div>

          <Card variant="soft" className="bg-slate-50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-blue-600">
                  資産サマリー
                </p>
                <p className="mt-3 text-xs font-black text-slate-500">総資産</p>
                <p className="mt-1 text-3xl font-black text-slate-900">
                  {isReady ? formatCurrency(summary.totalAmount) : "確認中"}
                </p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                {habit.statusLabel}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black text-slate-500">毎月積立</p>
                <p className="mt-2 text-xl font-black text-blue-600">
                  {formatCurrency(summary.totalMonthlyContribution)}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black text-slate-500">保有資産</p>
                <p className="mt-2 text-xl font-black text-slate-900">
                  {summary.assetCount}件
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black text-slate-500">最大保有資産</p>
                <p className="mt-2 line-clamp-1 text-xl font-black text-slate-900">
                  {summary.largestAssetName}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <AIAdviceCard
        label={advice.label}
        title={advice.title}
        description={advice.description}
        ctaLabel={advice.ctaLabel}
        ctaHref={advice.ctaHref}
      />

      <section className="space-y-4">
        <SectionHeader
          eyebrow="今日やること"
          title="あなたの状態に合わせた3ステップです"
          description="資産の登録状況に合わせて、次に進める行動を自動で出し分けます。"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {tasks.map((task) => (
            <ActionCard
              key={task.step}
              step={task.step}
              title={task.title}
              description={task.description}
              href={task.href}
              actionLabel={task.actionLabel}
              tone={task.tone}
            />
          ))}
        </div>
      </section>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black text-blue-600">習慣化の土台</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">{habit.title}</h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">{habit.description}</p>
          </div>
          <Button href="/dashboard" variant="secondary">
            今日の状態を確認する
          </Button>
        </div>
      </Card>

      <DashboardPremiumPreviewCard preview={premiumPreview} />

      <FeatureNavigation currentPath="/dashboard" title="ほかの機能へ移動する" />
    </PageContainer>
  );
}
