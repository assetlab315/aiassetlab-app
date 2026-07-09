import FeatureNavigation from "../../components/common/FeatureNavigation";
import PageTitle from "../../components/common/PageTitle";
import PageContainer from "../../components/layout/PageContainer";
import { AllocationBar } from "../../components/portfolio/AllocationBar";
import { AssetList } from "../../components/portfolio/AssetList";
import { EmptyPortfolio } from "../../components/portfolio/EmptyPortfolio";
import { PortfolioActionCard } from "../../components/portfolio/PortfolioActionCard";
import { PortfolioDashboardLink } from "../../components/portfolio/PortfolioDashboardLink";
import { PortfolioSummaryCards } from "../../components/portfolio/PortfolioSummaryCards";
import { mockPortfolioAssets } from "../../features/portfolio/mockPortfolio";
import {
  getPortfolioAllocation,
  getPortfolioSummary,
} from "../../lib/portfolio/calcPortfolio";

export default function PortfolioPage() {
  const assets = mockPortfolioAssets;
  const summary = getPortfolioSummary(assets);
  const allocations = getPortfolioAllocation(assets);

  return (
    <PageContainer size="lg">
      <PageTitle
        title="Portfolio"
        description="現在の資産状況を確認し、次に見直すべきポイントを整理します。"
      />

      {assets.length === 0 ? (
        <EmptyPortfolio />
      ) : (
        <>
          <PortfolioSummaryCards summary={summary} />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <AssetList assets={assets} />
            <div className="flex flex-col gap-6">
              <AllocationBar allocations={allocations} />
              <PortfolioActionCard action={summary.monthlyAction} />
              <PortfolioDashboardLink />
            </div>
          </div>
          <FeatureNavigation currentPath="/portfolio" title="Portfolioから次へ進む" />
        </>
      )}
    </PageContainer>
  );
}
