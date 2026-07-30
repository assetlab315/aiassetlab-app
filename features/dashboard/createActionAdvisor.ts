import type { PortfolioInsights } from "../chat/types";
import type { ActionAdvisor, DailyAdvisor } from "./types";

function firstMessage(advisor: DailyAdvisor) {
  return advisor.messages[0] ?? "今日のAIで資産形成のヒントを表示しました。";
}

function createChatPrompt(advisor: DailyAdvisor) {
  return [
    "今日のAIでは",
    firstMessage(advisor),
    "と表示されました。",
    "",
    "私のポートフォリオなら",
    "どう改善すると良いですか？",
  ].join("\n");
}

function actionAdvisor(
  advisor: DailyAdvisor,
  reason: string,
  currentStatus: string,
  recommendations: string[],
): ActionAdvisor {
  return {
    reason,
    currentStatus,
    recommendations: recommendations.slice(0, 3),
    chatPrompt: createChatPrompt(advisor),
  };
}

export function createActionAdvisor(
  dailyAdvisor: DailyAdvisor,
  portfolioInsights: PortfolioInsights | null,
): ActionAdvisor {
  if (!portfolioInsights) {
    return actionAdvisor(
      dailyAdvisor,
      "資産情報がないため、個別の配分判断はまだできません。",
      "Portfolioは未登録です。",
      ["まずは現金や投資信託などを1件登録する", "金額は概算で入力する"],
    );
  }

  if (dailyAdvisor.priority === "cash" && portfolioInsights.cashLevel === "high") {
    return actionAdvisor(
      dailyAdvisor,
      "現金の比率が高いと、長期の資産形成に回る資金が少なくなりやすいためです。",
      "現金比率が高めで、投資比率は控えめです。",
      ["生活防衛資金を確認する", "少額の積立額を決める", "新NISAの枠も候補にする"],
    );
  }

  if (dailyAdvisor.priority === "cash" && portfolioInsights.cashLevel === "low") {
    return actionAdvisor(
      dailyAdvisor,
      "現金が少ないと、急な支出時に投資資産を崩す可能性があるためです。",
      "現金比率が低めです。",
      ["生活防衛資金を確認する", "積立額を無理のない範囲にする", "短期資金を分ける"],
    );
  }

  if (dailyAdvisor.priority === "monthly-investment") {
    return actionAdvisor(
      dailyAdvisor,
      "積立がないと、継続的な資産形成のペースを作りにくいためです。",
      "資産は登録済みですが、毎月の積立額は未設定です。",
      ["月1,000円など小さく始める", "続けやすい日を決める", "無理なら登録だけで止める"],
    );
  }

  if (dailyAdvisor.priority === "nisa") {
    return actionAdvisor(
      dailyAdvisor,
      "投資比率が控えめな状態では、長期積立の検討余地があるためです。",
      "現金を残しながら、投資比率はまだ低めです。",
      ["新NISAのつみたて投資枠を確認する", "毎月の上限額を決める", "分散型商品を候補にする"],
    );
  }

  if (dailyAdvisor.priority === "diversification") {
    return actionAdvisor(
      dailyAdvisor,
      "偏りが大きいと、特定資産の値動きが全体に影響しやすいためです。",
      "分散または集中度に確認したい点があります。",
      ["次の積立先を分散する", "暗号資産や単一資産の比率を見る", "一度に大きく動かさない"],
    );
  }

  return actionAdvisor(
    dailyAdvisor,
    "今の配分と積立が大きく崩れていないためです。",
    "資産配分と積立状況はおおむね整っています。",
    ["積立を継続する", "月1回だけ配分を確認する", "大きな変更は急がない"],
  );
}
