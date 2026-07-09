import MvpHeader from "../../components/mvp/MvpHeader";
import MvpFeatureGrid from "../../components/mvp/MvpFeatureGrid";
import MvpProgressCard from "../../components/mvp/MvpProgressCard";
import MvpNextAction from "../../components/mvp/MvpNextAction";

export default function MvpPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <MvpHeader />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <MvpFeatureGrid />

          <div className="space-y-6">
            <MvpProgressCard />
            <MvpNextAction />
          </div>
        </div>
      </div>
    </main>
  );
}
