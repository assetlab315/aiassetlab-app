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
  const hasNoAssets = context.assetCount === 0;

  if (
    message.includes("パスワード") ||
    message.includes("秘密鍵") ||
    message.includes("カード番号")
  ) {
    return "パスワード、秘密鍵、カード番号などの機密情報はAI相談へ入力しないでください。すでに入力した場合は、該当サービスで変更や利用停止などの手続きを確認しましょう。\n\n次にやること：口座やカードの管理画面で、認証情報の変更が必要か確認しましょう。";
  }

  if (lowerMessage.includes("nisa") || message.includes("NISA") || message.includes("新NISA")) {
    return `新NISAで毎月積み立てるなら、まずはつみたて投資枠で低コストの分散型インデックスファンドを候補にする考え方が一般的です。全世界株式型は広く分散しやすく、米国株式型は米国への比重が高い分、値動きも米国に左右されやすくなります。元本保証ではないため、生活防衛資金を残したうえで続けられる金額を優先しましょう。${
      hasNoAssets ? "資産登録がまだないため、今の余裕資金までは確認できていません。" : `登録資産は合計 ${formatYen(context.totalAssets)} です。`
    }\n\n次にやること：候補ファンドの手数料、投資対象、分散範囲を1つずつ確認しましょう。`;
  }

  if (
    message.includes("借り") ||
    message.includes("借金") ||
    message.includes("ローン") ||
    message.includes("レバレッジ")
  ) {
    return "借入やレバレッジを使った投資はおすすめしません。金利負担と価格下落が重なると、資産形成ではなく返済リスクが先に大きくなります。まずは生活費と返済計画を守り、余裕資金の範囲で少額から検討する方が安全です。\n\n次にやること：借入を増やす前に、返済額と生活費を紙に書き出しましょう。";
  }

  if (message.includes("上がりますか") || message.includes("買えば") || message.includes("銘柄")) {
    return "特定の株が上がるかは断定できません。個別株は業績、財務、競争環境、市場全体の影響で大きく動きます。買うかどうかより先に、失っても生活に影響しない金額か、1銘柄に偏りすぎないかを確認しましょう。\n\n次にやること：その銘柄に投じてもよい上限額を先に決めましょう。";
  }

  if (message.includes("配分") || message.includes("ポートフォリオ") || message.includes("資産")) {
    if (hasNoAssets) {
      return "資産配分を見直すには、まず現在の現金・投資信託・株式などの内訳が必要です。未登録の状態では具体的な偏りは判断できませんが、一般的には生活防衛資金、分散、長期で続けられる積立額を確認します。\n\n次にやること：資産を見る画面で、現金と投資資産を1つずつ登録しましょう。";
    }

    return `登録済みの資産は ${context.assetCount} 件、合計 ${formatYen(context.totalAssets)} です。まずは「現金が多すぎないか」「投資に偏りすぎていないか」を確認しましょう。初心者は、生活防衛資金を残したうえで、長期積立を無理なく続ける形が安心です。\n\n次にやること：資産画面で、資産配分を確認しましょう。`;
  }

  if (message.includes("積立") || message.includes("毎月") || message.includes("いくら")) {
    return `現在の毎月積立は ${formatYen(context.monthlyContribution)} です。資産形成では、金額の大きさよりも続けられることが重要です。まずは家計に無理のない範囲で固定し、収入が増えた分を少しずつ積立へ回すのがおすすめです。\n\n次にやること：将来のお金を計算する画面で、今より5,000円増やした場合を試してみましょう。`;
  }

  if (hasNoAssets) {
    return "まずは現在の資産を1つ登録してみましょう。資産が見えるようになると、AIもより具体的に次の一歩を提案できます。入力前に、パスワードや口座番号などの機密情報は入れないでください。\n\n次にやること：資産を見る画面で、現金・投資信託・株式などを1つ登録しましょう。";
  }

  return `現在の登録資産は ${formatYen(context.totalAssets)}、毎月の積立は ${formatYen(context.monthlyContribution)} です。迷ったときは、生活防衛資金、分散、続けられる積立額の順に確認すると判断しやすくなります。\n\n次にやること：今日できる一歩を1つだけ選びましょう。`;
}
