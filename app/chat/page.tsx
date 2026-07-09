import ChatClient from "../../components/chat/ChatClient";
import FeatureNavigation from "../../components/navigation/FeatureNavigation";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <section>
          <p className="mb-2 text-sm font-semibold text-blue-600">
            AI Asset Lab
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            AI資産形成チャット
          </h1>
          <p className="mt-3 text-slate-600">
            資産形成やAI活用について、今すぐできる行動に絞って相談できます。
          </p>
        </section>

        <ChatClient />
        <FeatureNavigation currentPath="/chat" title="Chatから次へ進む" />
      </div>
    </main>
  );
}
