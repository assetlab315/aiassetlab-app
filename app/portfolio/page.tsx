import { AllocationBar } from '../../components/portfolio/AllocationBar';
import { AssetList } from '../../components/portfolio/AssetList';
import { EmptyPortfolio } from '../../components/portfolio/EmptyPortfolio';
import { PortfolioActionCard } from '../../components/portfolio/PortfolioActionCard';
import { PortfolioDashboardLink } from '../../components/portfolio/PortfolioDashboardLink';
import { PortfolioHeader } from '../../components/portfolio/PortfolioHeader';
import { PortfolioSummaryCards } from '../../components/portfolio/PortfolioSummaryCards';
import { mockPortfolioAssets } from '../../features/portfolio/mockPortfolio';
import { getPortfolioAllocation, getPortfolioSummary } from '../../lib/portfolio/calcPortfolio';

export default function PortfolioPage() {
  const assets = mockPortfolioAssets;
  const summary = getPortfolioSummary(assets);
  const allocations = getPortfolioAllocation(assets);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <PortfolioHeader />
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
          </>
        )}
      </div>
    </main>
  );
}
