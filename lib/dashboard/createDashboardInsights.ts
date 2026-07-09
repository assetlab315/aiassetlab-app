import type { PortfolioAsset, PortfolioSummary } from "../../features/portfolio/types";
import type {
  DashboardAdvice,
  DashboardHabit,
  DashboardTask,
} from "../../features/dashboard/types";

const minimumMonthlyContribution = 10000;

export function createDashboardAdvice(
  assets: PortfolioAsset[],
  summary: PortfolioSummary,
): DashboardAdvice {
  if (assets.length === 0 || summary.totalAmount === 0) {
    return {
      label: "今日のAIアドバイス",
      title: "まずは資産を1つ登録して、現在地を見える化しましょう。",
      description:
        "資産形成は、今の状態を知るところから始まります。金額がざっくりでも大丈夫です。まず1つ登録すると、次の行動が決めやすくなります。",
      ctaLabel: "資産を登録する",
      ctaHref: "/portfolio",
    };
  }

  if (summary.totalMonthlyContribution === 0) {
    return {
      label: "今日のAIアドバイス",
      title: "毎月の積立額を1つ決めると、次の一歩が見えます。",
      description:
        "すでに資産は登録できています。次は無理のない範囲で毎月の積立額を入力し、続けられる形に整えましょう。",
      ctaLabel: "積立額を入力する",
      ctaHref: "/portfolio",
    };
  }

  if (summary.totalMonthlyContribution < minimumMonthlyContribution) {
    return {
      label: "今日のAIアドバイス",
      title: "今の積立を続けることを最優先にしましょう。",
      description:
        "少額でも継続できていることは大きな前進です。増額よりも、まずは続けやすい仕組みを作ることを優先しましょう。",
      ctaLabel: "将来のお金を計算する",
      ctaHref: "/simulator",
    };
  }

  return {
    label: "今日のAIアドバイス",
    title: "登録資産と積立をもとに、将来のお金を一度確認しましょう。",
    description:
      "資産と毎月の積立が見えているので、次は将来いくらになりそうかを確認する段階です。結果を見て、無理なく続けられる金額か見直しましょう。",
    ctaLabel: "将来のお金を計算する",
    ctaHref: "/simulator",
  };
}

export function createDashboardTasks(
  assets: PortfolioAsset[],
  summary: PortfolioSummary,
): DashboardTask[] {
  if (assets.length === 0 || summary.totalAmount === 0) {
    return [
      {
        step: "STEP 1",
        title: "資産を1つ登録する",
        description:
          "まずは預金やNISAなど、分かる範囲で1つだけ登録します。完璧でなくて大丈夫です。",
        href: "/portfolio",
        actionLabel: "資産を登録する",
        tone: "blue",
      },
      {
        step: "STEP 2",
        title: "将来のお金を計算する",
        description:
          "資産を登録したら、毎月いくら積み立てると将来どうなるか確認します。",
        href: "/simulator",
        actionLabel: "計算する",
        tone: "emerald",
      },
      {
        step: "STEP 3",
        title: "迷ったらAIに相談する",
        description:
          "入力する資産や積立額で迷ったら、AIに今の状況を相談できます。",
        href: "/chat",
        actionLabel: "相談する",
        tone: "violet",
      },
    ];
  }

  if (summary.totalMonthlyContribution === 0) {
    return [
      {
        step: "STEP 1",
        title: "毎月の積立額を入れる",
        description:
          "登録済みの資産に、毎月いくら積み立てているかを追加します。",
        href: "/portfolio",
        actionLabel: "積立額を入力する",
        tone: "blue",
      },
      {
        step: "STEP 2",
        title: "将来のお金を計算する",
        description:
          "毎月の積立額をもとに、将来の資産額をざっくり確認します。",
        href: "/simulator",
        actionLabel: "計算する",
        tone: "emerald",
      },
      {
        step: "STEP 3",
        title: "今の資産で相談する",
        description:
          "資産の偏りや次に見直すポイントをAIと一緒に整理します。",
        href: "/chat",
        actionLabel: "相談する",
        tone: "violet",
      },
    ];
  }

  return [
    {
      step: "STEP 1",
      title: "将来のお金を計算する",
      description:
        "登録済みの資産と積立をもとに、将来のイメージを確認します。",
      href: "/simulator",
      actionLabel: "計算する",
      tone: "emerald",
    },
    {
      step: "STEP 2",
      title: "AIに見直しを相談する",
      description:
        "資産配分や積立額について、次に見直すポイントをAIに整理してもらいます。",
      href: "/chat",
      actionLabel: "相談する",
      tone: "violet",
    },
    {
      step: "STEP 3",
      title: "資産を更新する",
      description:
        "金額が変わった資産があれば更新し、Dashboardの提案を新しくします。",
      href: "/portfolio",
      actionLabel: "資産を更新する",
      tone: "blue",
    },
  ];
}

export function createDashboardHabit(
  assets: PortfolioAsset[],
  summary: PortfolioSummary,
): DashboardHabit {
  if (assets.length === 0 || summary.totalAmount === 0) {
    return {
      title: "今日のチェック",
      description: "資産を1つ登録すると、毎日のおすすめがあなた向けになります。",
      statusLabel: "未登録",
    };
  }

  if (summary.totalMonthlyContribution === 0) {
    return {
      title: "今日のチェック",
      description: "資産登録は完了。次は毎月の積立額を入れるだけです。",
      statusLabel: "あと1歩",
    };
  }

  return {
    title: "今日のチェック",
    description: "資産と積立が確認できています。今日は将来のお金を見てみましょう。",
    statusLabel: "確認OK",
  };
}
