"use client";

import { useEffect, useMemo, useState } from "react";
import ActionCard from "../common/ActionCard";
import DailyAdvisorCard from "./DailyAdvisorCard";
import ErrorState from "../feedback/ErrorState";
import LoadingSkeleton from "../feedback/LoadingSkeleton";
import OnboardingModal from "../onboarding/OnboardingModal";
import SectionHeader from "../common/SectionHeader";
import PageContainer from "../layout/PageContainer";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { createActionAdvisor } from "../../features/dashboard/createActionAdvisor";
import { createDailyAdvisor } from "../../features/dashboard/createDailyAdvisor";
import { calculatePortfolioSummary } from "../../lib/portfolio/calculatePortfolio";
import { formatCurrency } from "../../lib/portfolio/formatPortfolio";
import { usePortfolioSync } from "../../lib/portfolio/usePortfolioSync";
import { useOnboarding } from "../../hooks/useOnboarding";
import { createPortfolioInsights } from "../../lib/chat/createPortfolioInsights";
import { createDashboardTasks } from "../../lib/dashboard/createDashboardInsights";

function shouldLogDashboardPortfolio() {
  if (typeof window === "undefined") return false;
  return !["aiassetlab.jp", "www.aiassetlab.jp"].includes(window.location.hostname);
}

function logDashboardPortfolioEvent(
  event: string,
  details: Record<string, string | number | boolean | null> = {},
) {
  if (!shouldLogDashboardPortfolio()) return;
  console.info("[dashboard-portfolio]", event, details);
}

function getDateLabel() {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date());
}

export default function DashboardClient() {
  const { assets, isReady, status: syncStatus, reload } = usePortfolioSync();
  const onboarding = useOnboarding();
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    setDateLabel(getDateLabel());
  }, []);

  useEffect(() => {
    logDashboardPortfolioEvent("load source", {
      source: syncStatus === "saved" ? "sync completed" : "waiting for sync",
    });
    logDashboardPortfolioEvent("asset count", { assetCount: assets.length });
    logDashboardPortfolioEvent(isReady ? "sync completed" : "waiting for sync", {
      assetCount: assets.length,
    });
  }, [assets.length, isReady, syncStatus]);

  const summary = useMemo(() => calculatePortfolioSummary(assets), [assets]);
  const portfolioInsights = useMemo(
    () => (isReady ? createPortfolioInsights(assets) : null),
    [assets, isReady],
  );
  const dailyAdvisor = useMemo(
    () => (isReady ? createDailyAdvisor(portfolioInsights) : createDailyAdvisor(null)),
    [isReady, portfolioInsights],
  );
  const actionAdvisor = useMemo(
    () => createActionAdvisor(dailyAdvisor, isReady ? portfolioInsights : null),
    [dailyAdvisor, isReady, portfolioInsights],
  );
  const tasks = useMemo(() => createDashboardTasks(assets, summary), [assets, summary]);
  const lastUpdated = useMemo(() => {
    if (assets.length === 0) return "未登録";
    const latest = assets
      .map((asset) => new Date(asset.updatedAt).getTime())
      .filter((time) => Number.isFinite(time))
      .sort((a, b) => b - a)[0];
    if (!latest) return dateLabel || "今日";
    return new Intl.DateTimeFormat("ja-JP", {
      month: "long",
      day: "numeric",
    }).format(new Date(latest));
  }, [assets, dateLabel]);

  return (
    <PageContainer size="xl">
      <OnboardingModal
        isOpen={
          onboarding.isReady &&
          onboarding.isOpen &&
          isReady &&
          syncStatus !== "loading" &&
          syncStatus !== "error"
        }
        onComplete={onboarding.complete}
      />

      {!isReady || syncStatus === "loading" ? (
        <>
          <LoadingSkeleton variant="dashboard-card" label="Dashboardを読み込み中" />
          <LoadingSkeleton variant="dashboard-card" label="資産情報を読み込み中" />
        </>
      ) : syncStatus === "error" ? (
        <ErrorState
          title="資産情報を読み込めませんでした"
          description="通信状態を確認して、もう一度お試しください。"
          actionLabel="再試行"
          loadingLabel="再試行中…"
          isRetrying={false}
          onRetry={reload}
        />
      ) : (
        <div className="space-y-6" data-dashboard-main-blocks="3">
          <DailyAdvisorCard advisor={dailyAdvisor} actionAdvisor={actionAdvisor} />

          <Card variant="soft" className="bg-slate-50" data-dashboard-block="asset-status">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black text-blue-600">資産の状況</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                  今日見る数字だけ。
                </h1>
              </div>
              <Button href="/portfolio" variant={assets.length === 0 ? "primary" : "outline"}>
                {assets.length === 0 ? "資産を登録" : "Portfolioで詳しく見る"}
              </Button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black text-slate-500">総資産</p>
                <p className="mt-2 text-2xl font-black text-slate-900">
                  {formatCurrency(summary.totalAmount)}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black text-slate-500">毎月の積立</p>
                <p className="mt-2 text-2xl font-black text-blue-600">
                  {formatCurrency(summary.totalMonthlyContribution)}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black text-slate-500">最終更新</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{lastUpdated}</p>
              </div>
            </div>
          </Card>

          <section className="space-y-4" data-dashboard-block="next-actions">
            <SectionHeader
              eyebrow="次にやること"
              title="今日の行動を3つに絞りました"
            />
            <div className="grid gap-4 lg:grid-cols-3">
              {tasks.slice(0, 3).map((task) => (
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
        </div>
      )}
    </PageContainer>
  );
}
