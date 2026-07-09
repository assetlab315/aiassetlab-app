import FeatureNavigation from "../../components/common/FeatureNavigation";
import PageTitle from "../../components/common/PageTitle";
import PageContainer from "../../components/layout/PageContainer";
import SimulatorClient from "../../components/simulator/SimulatorClient";

export default function SimulatorPage() {
  return (
    <PageContainer size="lg">
      <PageTitle
        title="積立シミュレーター"
        description="毎月の積立額から、将来の資産額・元本・運用益をかんたんに確認できます。"
      />

      <SimulatorClient />
      <FeatureNavigation currentPath="/simulator" title="Simulatorから次へ進む" />
    </PageContainer>
  );
}
