import type { ChatMessage, ChatUserContext } from "../../features/chat/types";

function formatYen(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function createChatPrompt(
  message: string,
  history: ChatMessage[],
  context: ChatUserContext,
) {
  const assets = context.assets
    .slice(0, 8)
    .map((asset) => {
      return `- ${asset.name || "資産"} / ${asset.category || "未分類"} / ${formatYen(asset.amount || 0)} / 毎月積立 ${formatYen(asset.monthlyContribution || 0)}`;
    })
    .join("\n");

  const recentHistory = history
    .slice(-6)
    .map((item) => `${item.role === "user" ? "ユーザー" : "AI"}: ${item.content}`)
    .join("\n");

  return `あなたはAI Asset Labの資産形成AIアドバイザーです。

目的:
初心者にも分かる日本語で、資産形成の次の一歩を提案してください。

ルール:
- 断定的な投資助言はしない
- 特定銘柄の売買を強く推奨しない
- 難しい専門用語を避ける
- 回答は短く、行動につながる形にする
- 最後に「次にやること」を1つだけ示す
- 必要に応じて、資産を見る・将来のお金を計算する・AIに相談する、というAI Asset Labの導線に合わせる

ユーザーの現在状況:
- 登録資産数: ${context.assetCount}
- 総資産額: ${formatYen(context.totalAssets)}
- 毎月の積立額: ${formatYen(context.monthlyContribution)}

登録資産:
${assets || "まだ資産登録はありません。"}

直近の会話:
${recentHistory || "まだ会話履歴はありません。"}

今回の質問:
${message}
`;
}
