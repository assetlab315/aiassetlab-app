import type { PortfolioInsights } from "../chat/types";
import type { DailyAdvisor } from "./types";

const title = "今日のAI";

function advisor(priority: DailyAdvisor["priority"], messages: string[]): DailyAdvisor {
  return {
    title,
    priority,
    messages: messages.slice(0, 4),
  };
}

export function createDailyAdvisor(
  portfolioInsights: PortfolioInsights | null,
): DailyAdvisor {
  if (!portfolioInsights) {
    return advisor("empty", [
      "まだ資産情報が登録されていません。",
      "まずはPortfolioに1件だけ登録して、今日の提案を表示しましょう。",
    ]);
  }

  if (portfolioInsights.cashLevel === "high") {
    return advisor("cash", [
      "現金比率が高めです。",
      "生活防衛資金を残しつつ、少額の積立を検討してみましょう。",
    ]);
  }

  if (portfolioInsights.cashLevel === "low") {
    return advisor("cash", [
      "現金比率が低めです。",
      "今日は生活防衛資金を確認して、無理な投資を避けましょう。",
    ]);
  }

  if (portfolioInsights.monthlyInvestment <= 0) {
    return advisor("monthly-investment", [
      "積立設定がまだありません。",
      "毎月続けられる金額から、資産形成の習慣を作りましょう。",
    ]);
  }

  if (
    portfolioInsights.stockLevel === "low" &&
    portfolioInsights.cryptoLevel !== "high"
  ) {
    return advisor("nisa", [
      "投資比率はまだ控えめです。",
      "新NISAのつみたて投資枠も候補に、長期積立を検討してみましょう。",
    ]);
  }

  if (
    portfolioInsights.diversification === "Poor" ||
    portfolioInsights.diversification === "Moderate" ||
    portfolioInsights.concentration !== "none" ||
    portfolioInsights.cryptoLevel === "high"
  ) {
    return advisor("diversification", [
      "資産配分に偏りがあります。",
      "次の積立では、異なる資産カテゴリへ分散することを検討しましょう。",
    ]);
  }

  return advisor("positive", [
    "資産配分はおおむね整っています。",
    "今日は大きく動かず、積立の継続を確認しましょう。",
  ]);
}
