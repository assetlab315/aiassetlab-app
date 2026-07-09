import PageContainer from "../components/layout/PageContainer";
import EmptyState from "../components/ui/EmptyState";

export default function NotFound() {
  return (
    <PageContainer size="md">
      <EmptyState
        title="ページが見つかりません"
        description="URLが間違っているか、ページが移動した可能性があります。迷ったらDashboardへ戻りましょう。"
        actionLabel="Dashboardへ戻る"
        actionHref="/dashboard"
      />
    </PageContainer>
  );
}
