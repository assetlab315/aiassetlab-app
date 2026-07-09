import ChatClient from "../../components/chat/ChatClient";
import FeatureNavigation from "../../components/common/FeatureNavigation";
import PageTitle from "../../components/common/PageTitle";
import PageContainer from "../../components/layout/PageContainer";

export default function ChatPage() {
  return (
    <PageContainer size="md">
      <PageTitle
        title="AI資産形成チャット"
        description="資産形成やAI活用について、今すぐできる行動に絞って相談できます。"
      />

      <ChatClient />
      <FeatureNavigation currentPath="/chat" title="Chatから次へ進む" />
    </PageContainer>
  );
}
