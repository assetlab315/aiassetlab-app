import type { ChatUserContext } from "../../features/chat/types";

function formatYen(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function createFallbackAnswer(message: string, context: ChatUserContext) {
  const lowerMessage = message.toLowerCase();

  if (context.assetCount === 0) {
    return "まずは現在の資産を1つ登録してみましょう。資産が見えるようになると、AIもより具体的に次の一歩を提案できます。\n\n次にやること：資産画面で、現金・投資信託・株式などを1つ登録しましょう。";
  }

  if (lowerMessage.includes("nisa") || message.includes("NISA") || message.includes("新NISA")) {
    return `現在の登録資産は合計 ${formatYen(context.totalAssets)}、毎月の積立は ${formatYen(context.monthlyContribution)} です。新NISAは長期で続けやすい金額を決めることが大切です。無理に満額を狙うより、毎月続けられる金額を優先しましょう。\n\n次にやること：将来のお金を計算する画面で、今の積立額を20年で試してみましょう。`;
  }

  if (message.includes("配分") || message.includes("ポートフォリオ") || message.includes("資産")) {
    return `登録済みの資産は ${context.assetCount} 件、合計 ${formatYen(context.totalAssets)} です。まずは「現金が多すぎないか」「投資に偏りすぎていないか」を確認しましょう。初心者は、生活防衛資金を残したうえで、長期積立を無理なく続ける形が安心です。\n\n次にやること：資産画面で、資産配分を確認しましょう。`;
  }

  if (message.includes("積立") || message.includes("毎月") || message.includes("いくら")) {
    return `現在の毎月積立は ${formatYen(context.monthlyContribution)} です。資産形成では、金額の大きさよりも続けられることが重要です。まずは家計に無理のない範囲で固定し、収入が増えた分を少しずつ積立へ回すのがおすすめです。\n\n次にやること：将来のお金を計算する画面で、今より5,000円増やした場合を試してみましょう。`;
  }

  return `現在の登録資産は ${formatYen(context.totalAssets)}、毎月の積立は ${formatYen(context.monthlyContribution)} です。まずは「資産を見る → 将来のお金を計算する → AIに相談する」の順番で進めると、迷わず資産形成を続けられます。\n\n次にやること：今日できる一歩を1つだけ選びましょう。`;
}
