"use client";

import { useEffect, useMemo, useState } from "react";
import ActionCard from "../common/ActionCard";
import AssetHealthScoreCard from "./AssetHealthScoreCard";
import DashboardAssetImpactCard from "./DashboardAssetImpactCard";
import DashboardDailyCheckCard from "./DashboardDailyCheckCard";
import DashboardInsightCard from "./DashboardInsightCard";
import DashboardHabitCard from "./DashboardHabitCard";
import DashboardPremiumPreviewCard from "./DashboardPremiumPreviewCard";
import DashboardReleaseCheckCard from "./DashboardReleaseCheckCard";
import DashboardTodayAiCard from "./DashboardTodayAiCard";
import PortfolioChangeCard from "./PortfolioChangeCard";
import PortfolioReviewCard from "./PortfolioReviewCard";
import FeatureNavigation from "../common/FeatureNavigation";
import SectionHeader from "../common/SectionHeader";
import PageContainer from "../layout/PageContainer";
import Button from "../ui/Button";
import Card from "../ui/Card";
import type { DashboardChangeSummary } from "../../features/portfolio-history/types";
import { calculatePortfolioSummary } from "../../lib/portfolio/calculatePortfolio";
import { formatCurrency } from "../../lib/portfolio/formatPortfolio";
import { usePortfolioSync } from "../../lib/portfolio/usePortfolioSync";
import { createPortfolioInsights } from "../../lib/chat/createPortfolioInsights";
import { createAssetHealthScore } from "../../lib/dashboard/createAssetHealthScore";
import { createDashboardChangeSummary } from "../../lib/dashboard/createDashboardChangeSummary";
import { createPortfolioReview } from "../../lib/dashboard/createPortfolioReview";
import {
  createDashboardAssetImpact,
  createDashboardDailyCheck,
  createDashboardHabit,
  createDashboardInsights,
  createDashboardPremiumPreview,
  createDashboardTasks,
  createDashboardTodayAi,
} from "../../lib/dashboard/createDashboardInsights";
import { comparePortfolioSnapshots } from "../../lib/portfolio-history/comparePortfolioSnapshots";
import { createPortfolioSnapshotFromAssets } from "../../lib/portfolio-history/createPortfolioSnapshot";
import {
  ensureInitialPortfolioSnapshot,
  getLatestSnapshot,
  getPreviousDistinctSnapshot,
  savePortfolioSnapshot,
} from "../../lib/portfolio-history/portfolioSnapshotStorage";

const dailyCheckStorageKey = "aiassetlab:dashboard-daily-check";

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

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

function getDateLabel() {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date());
}

export default function DashboardClient() {
  const { assets, isReady, status: syncStatus } = usePortfolioSync();
  const [isDailyChecked, setIsDailyChecked] = useState(false);
  const [dateLabel, setDateLabel] = useState("");
  const [changeSummary, setChangeSummary] = useState<DashboardChangeSummary | null>(null);

  useEffect(() => {
    setIsDailyChecked(localStorage.getItem(dailyCheckStorageKey) === getTodayKey());
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
  const dailyCheck = useMemo(
    () => createDashboardDailyCheck(assets, summary),
    [assets, summary],
  );
  const assetImpact = useMemo(
    () => createDashboardAssetImpact(assets, summary),
    [assets, summary],
  );
  const todayAi = useMemo(
    () => createDashboardTodayAi(assets, summary),
    [assets, summary],
  );
  const portfolioInsights = useMemo(
    () => (isReady ? createPortfolioInsights(assets) : null),
    [assets, isReady],
  );
  const dashboardInsights = useMemo(
    () => (isReady ? createDashboardInsights({ portfolioInsights }) : null),
    [isReady, portfolioInsights],
  );
  const assetHealthScore = useMemo(
    () => (isReady ? createAssetHealthScore({ portfolioInsights }) : null),
    [isReady, portfolioInsights],
  );
  const tasks = useMemo(() => createDashboardTasks(assets, summary), [assets, summary]);
  const habit = useMemo(() => createDashboardHabit(assets, summary), [assets, summary]);
  const premiumPreview = useMemo(
    () => createDashboardPremiumPreview(assets, summary),
    [assets, summary],
  );
  const portfolioReview = useMemo(
    () =>
      isReady && dashboardInsights && (!portfolioInsights || changeSummary)
        ? createPortfolioReview({
            portfolioInsights,
            dashboardInsights,
            assetHealthScore,
            portfolioChangeSummary: changeSummary,
          })
        : null,
    [assetHealthScore, changeSummary, dashboardInsights, isReady, portfolioInsights],
  );

  useEffect(() => {
    if (!isReady || !portfolioInsights || !assetHealthScore || !dashboardInsights) {
      setChangeSummary(null);
      return;
    }

    const currentSnapshot = createPortfolioSnapshotFromAssets(assets);
    if (!currentSnapshot) {
      setChangeSummary(null);
      return;
    }

    const latestSnapshot = getLatestSnapshot();
    if (!latestSnapshot) {
      ensureInitialPortfolioSnapshot(currentSnapshot);
      setChangeSummary(
        createDashboardChangeSummary({
          comparison: null,
          currentDashboardInsights: dashboardInsights,
          currentHealthScore: assetHealthScore,
        }),
      );
      return;
    }

    const previousSnapshot =
      latestSnapshot.fingerprint === currentSnapshot.fingerprint
        ? getPreviousDistinctSnapshot()
        : latestSnapshot;

    if (!previousSnapshot || previousSnapshot.fingerprint === currentSnapshot.fingerprint) {
      setChangeSummary(
        createDashboardChangeSummary({
          comparison: null,
          currentDashboardInsights: dashboardInsights,
          currentHealthScore: assetHealthScore,
        }),
      );
      return;
    }

    const comparison = comparePortfolioSnapshots(previousSnapshot, currentSnapshot);
    if (latestSnapshot.fingerprint !== currentSnapshot.fingerprint) {
      savePortfolioSnapshot(currentSnapshot);
    }

    setChangeSummary(
      createDashboardChangeSummary({
        comparison,
        currentDashboardInsights: dashboardInsights,
        currentHealthScore: assetHealthScore,
      }),
    );
  }, [assetHealthScore, assets, dashboardInsights, isReady, portfolioInsights]);

  function handleDailyCheck() {
    localStorage.setItem(dailyCheckStorageKey, getTodayKey());
    setIsDailyChecked(true);
  }

  return (
    <PageContainer size="xl">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <p className="mb-3 text-sm font-black text-blue-600">AI Dashboard</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          未来の資産を、
          <br />
          今日少し前へ。
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          資産を見て、必要なときだけAIに相談できます。
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href="/portfolio">資産を見る</Button>
          <Button href="/chat" variant="outline">
            AIに相談する
          </Button>
        </div>
      </section>

      <DashboardTodayAiCard todayAi={todayAi} />

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

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
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

      <DashboardDailyCheckCard
        dailyCheck={dailyCheck}
        dateLabel={dateLabel || "今日"}
        isChecked={isDailyChecked}
        onCheck={handleDailyCheck}
      />

      <DashboardInsightCard insight={dashboardInsights} />

      <AssetHealthScoreCard healthScore={assetHealthScore} />

      {!isReady || portfolioInsights ? (
        <PortfolioChangeCard changeSummary={changeSummary} />
      ) : null}

      <PortfolioReviewCard review={portfolioReview} />

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

      <DashboardAssetImpactCard impact={assetImpact} />

      <DashboardHabitCard habit={habit} isChecked={isDailyChecked} />

      <DashboardReleaseCheckCard />

      <DashboardPremiumPreviewCard preview={premiumPreview} />

      <FeatureNavigation currentPath="/dashboard" title="次に進む場所" />
    </PageContainer>
  );
}
