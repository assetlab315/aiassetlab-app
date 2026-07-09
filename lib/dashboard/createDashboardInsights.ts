import { ASSET_CATEGORY_LABELS } from "../../features/portfolio/constants";
import type { PortfolioAsset, PortfolioSummary } from "../../features/portfolio/types";
import type {
  DashboardAdvice,
  DashboardAssetImpact,
  DashboardDailyCheck,
  DashboardHabit,
  DashboardInsight,
  DashboardPremiumPreview,
  DashboardTask,
} from "../../features/dashboard/types";

const minimumMonthlyContribution = 10000;

function getMainAssetCategory(assets: PortfolioAsset[], summary: PortfolioSummary) {
  const grouped = assets.reduce<Record<PortfolioAsset["category"], number>>(
    (acc, asset) => {
      acc[asset.category] += asset.amount;
      return acc;
    },
    {
      cash: 0,
      stock: 0,
      fund: 0,
      crypto: 0,
      pension: 0,
      other: 0,
    },
  );

  const [category, amount] = Object.entries(grouped).sort((a, b) => b[1] - a[1])[0] ?? [
    "other",
    0,
  ];

  return {
    category: category as PortfolioAsset["category"],
    amount,
    rate: summary.totalAmount === 0 ? 0 : (amount / summary.totalAmount) * 100,
  };
}


export function createDashboardDailyCheck(
  assets: PortfolioAsset[],
  summary: PortfolioSummary,
): DashboardDailyCheck {
  if (assets.length === 0 || summary.totalAmount === 0) {
    return {
      greeting: "おはようございます。",
      title: "まずは資産を1つ登録して、今日の確認を始めましょう。",
      description:
        "AI Asset Labは、毎朝30秒で資産形成の現在地を確認するためのホーム画面です。最初は預金やNISAなど、分かるものを1つ入れるだけで大丈夫です。",
      checkedTitle: "今日の確認を始めました。",
      checkedDescription:
        "次は資産を1つ登録しましょう。登録すると、明日からAIインサイトと今日やることがあなた向けになります。",
      statusLabel: "未登録",
      focusItems: ["資産を1つ登録", "金額はざっくりでOK", "完璧さより継続"],
      ctaLabel: "資産を登録する",
      ctaHref: "/portfolio",
    };
  }

  if (summary.totalMonthlyContribution === 0) {
    return {
      greeting: "おはようございます。",
      title: "資産は見えています。今日は積立額だけ確認しましょう。",
      description:
        "保有資産は登録できています。毎朝見る画面として使うために、次は毎月の積立額を入れて、続けられる資産形成か確認できる状態にしましょう。",
      checkedTitle: "今日の資産確認は完了です。",
      checkedDescription:
        "次に時間があるとき、毎月の積立額を1つ追加してください。AIの提案がさらに具体的になります。",
      statusLabel: "あと1歩",
      focusItems: ["総資産を確認", "積立額を入力", "AIインサイトを読む"],
      ctaLabel: "積立額を入力する",
      ctaHref: "/portfolio",
    };
  }

  return {
    greeting: "おはようございます。",
    title: "今日は大きく変えず、続けることを確認しましょう。",
    description:
      "資産と積立が見えています。毎朝やることは、資産状況・AIインサイト・今日やることを上から確認するだけです。必要なときだけAIに相談しましょう。",
    checkedTitle: "今日の確認は完了です。",
    checkedDescription:
      "資産と積立の状態を確認できました。今日は無理に動かず、必要なときだけAIに相談すれば大丈夫です。",
    statusLabel: "今日の確認",
    focusItems: ["資産サマリー", "AIインサイト", "今日やること"],
    ctaLabel: "詳しくAIに聞く",
    ctaHref: "/chat",
  };
}

export function createDashboardInsight(
  assets: PortfolioAsset[],
  summary: PortfolioSummary,
): DashboardInsight {
  if (assets.length === 0 || summary.totalAmount === 0) {
    return {
      label: "今日のAIインサイト",
      title: "まずは資産を1つ登録すると、AIがあなた向けに整理できます。",
      description:
        "今はまだ分析する材料がありません。金額はざっくりで大丈夫なので、預金・NISA・投資信託などを1つ登録しましょう。",
      impactLabel: "未分析",
      impactLevel: 0,
      primaryPoint: "最初の目的は、正確さよりも現在地を見える化することです。",
      secondaryPoint: "Portfolioで1つ登録すると、Dashboardの提案があなた向けになります。",
      ctaLabel: "資産を登録する",
      ctaHref: "/portfolio",
    };
  }

  const mainCategory = getMainAssetCategory(assets, summary);
  const mainCategoryLabel = ASSET_CATEGORY_LABELS[mainCategory.category];

  if (summary.totalMonthlyContribution === 0) {
    return {
      label: "今日のAIインサイト",
      title: `${mainCategoryLabel}が中心です。次は毎月の積立を見える化しましょう。`,
      description:
        "資産の登録はできています。次に積立額を入れると、今の資産形成が続けやすい形かどうかを判断しやすくなります。",
      impactLabel: "中",
      impactLevel: 2,
      primaryPoint: `現在は${mainCategoryLabel}の比率が高めです。まずは資産の全体像を把握しましょう。`,
      secondaryPoint: "積立額を入れると、将来の見通しと次の行動が具体化します。",
      ctaLabel: "積立額を入力する",
      ctaHref: "/portfolio",
    };
  }

  if (mainCategory.category === "crypto" || mainCategory.rate >= 70) {
    return {
      label: "今日のAIインサイト",
      title: `${mainCategoryLabel}の比率が高めです。今日は増やすより確認を優先しましょう。`,
      description:
        "特定の資産に寄っている場合、短期の値動きに気持ちが左右されやすくなります。今日は売買判断よりも、積立を続けられる形かを確認しましょう。",
      impactLabel: "高",
      impactLevel: 3,
      primaryPoint: `中心資産は${mainCategoryLabel}です。全体の約${Math.round(mainCategory.rate)}%を占めています。`,
      secondaryPoint: "不安がある場合は、AIにリスクと見直しポイントを聞きましょう。",
      ctaLabel: "詳しく分析する",
      ctaHref: "/chat",
    };
  }

  return {
    label: "今日のAIインサイト",
    title: "資産と積立が見えています。今日は大きく変えず、続けることを優先しましょう。",
    description:
      "資産形成では、毎日大きな判断をする必要はありません。登録内容を確認し、必要なときだけAIに相談できる状態を保ちましょう。",
    impactLabel: "低〜中",
    impactLevel: 1,
    primaryPoint: `中心資産は${mainCategoryLabel}です。全体の約${Math.round(mainCategory.rate)}%です。`,
    secondaryPoint: "将来シミュレーションで、今の積立ペースを一度確認しましょう。",
    ctaLabel: "将来のお金を計算する",
    ctaHref: "/simulator",
  };
}

export function createDashboardAssetImpact(
  assets: PortfolioAsset[],
  summary: PortfolioSummary,
): DashboardAssetImpact {
  if (assets.length === 0 || summary.totalAmount === 0) {
    return {
      label: "あなたの資産への影響",
      title: "資産を登録すると、今日見るべきポイントが分かります。",
      description:
        "ニュースをそのまま読むのではなく、あなたの資産に関係するポイントだけを確認できるようにします。",
      mainAssetLabel: "未登録",
      mainAssetRate: 0,
      marketTheme: "現在地の確認",
      actionLabel: "1つ登録",
      ctaLabel: "資産を登録する",
      ctaHref: "/portfolio",
    };
  }

  const mainCategory = getMainAssetCategory(assets, summary);
  const mainCategoryLabel = ASSET_CATEGORY_LABELS[mainCategory.category];
  const themeByCategory: Record<PortfolioAsset["category"], string> = {
    cash: "インフレと生活防衛",
    stock: "株式市場の値動き",
    fund: "長期積立の継続",
    crypto: "大きな価格変動",
    pension: "長期運用",
    other: "資産全体の確認",
  };

  const actionByCategory: Record<PortfolioAsset["category"], string> = {
    cash: "投資余力を確認",
    stock: "偏りを確認",
    fund: "積立を継続",
    crypto: "比率を確認",
    pension: "長期で継続",
    other: "内容を整理",
  };

  return {
    label: "あなたの資産への影響",
    title: `${mainCategoryLabel}を中心に、今日見るポイントを整理しました。`,
    description:
      "市場ニュースを全部追う必要はありません。まずは、自分の保有資産に関係するテーマだけを確認しましょう。",
    mainAssetLabel: mainCategoryLabel,
    mainAssetRate: mainCategory.rate,
    marketTheme: themeByCategory[mainCategory.category],
    actionLabel: actionByCategory[mainCategory.category],
    ctaLabel: "AIに詳しく聞く",
    ctaHref: "/chat",
  };
}

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
      title: "まずは1つだけ登録すれば十分です。",
      description:
        "毎日の習慣は、完璧な入力から始める必要はありません。預金やNISAなど、分かる資産を1つ入れるだけでDashboardがあなた向けになります。",
      checkedTitle: "今日の確認を始められました。",
      checkedDescription:
        "次は資産を1つ登録しましょう。明日から、AIインサイトと今日やることがより具体的になります。",
      statusLabel: "未登録",
      ctaLabel: "資産を登録する",
      ctaHref: "/portfolio",
    };
  }

  if (summary.totalMonthlyContribution === 0) {
    return {
      title: "資産は見えています。次は積立だけです。",
      description:
        "保有資産を確認する習慣はでき始めています。毎月の積立額を入れると、将来のお金をより具体的に確認できます。",
      checkedTitle: "今日の資産確認は完了です。",
      checkedDescription:
        "次に進むなら、毎月の積立額を追加しましょう。入力後のAIインサイトがさらに使いやすくなります。",
      statusLabel: "あと1歩",
      ctaLabel: "積立額を入力する",
      ctaHref: "/portfolio",
    };
  }

  return {
    title: "毎朝30秒の確認を続けましょう。",
    description:
      "資産と積立が見えています。毎日やることは、確認して、必要なときだけAIに聞くことです。大きな判断は急がなくて大丈夫です。",
    checkedTitle: "今日の確認は完了です。",
    checkedDescription:
      "今日は無理に動かず、気になる点だけAIに相談しましょう。確認を続けることが、資産形成の土台になります。",
    statusLabel: "確認OK",
    ctaLabel: "気になる点をAIに聞く",
    ctaHref: "/chat",
  };
}


export function createDashboardPremiumPreview(
  assets: PortfolioAsset[],
  summary: PortfolioSummary,
): DashboardPremiumPreview {
  if (assets.length === 0 || summary.totalAmount === 0) {
    return {
      badgeLabel: "まず無料で開始",
      title: "Premiumの前に、まずは無料で現在地を見える化しましょう。",
      description:
        "AI Asset Labは、最初から課金を急がせません。資産を1つ登録すると、無料版でも今日やることが分かる状態になります。",
      ctaLabel: "資産を登録する",
      ctaHref: "/portfolio",
    };
  }

  if (summary.totalMonthlyContribution === 0) {
    return {
      badgeLabel: "価値検証中",
      title: "積立額まで入れると、AI分析の価値が分かりやすくなります。",
      description:
        "有料化の前に、まずは無料版で資産と積立を整理できる体験を強化します。Premiumでは、積立額の見直しや改善案の深掘りを検証します。",
      ctaLabel: "積立額を入力する",
      ctaHref: "/portfolio",
    };
  }

  return {
    badgeLabel: "Premium準備中",
    title: "次は、AIが資産形成の改善ポイントを深掘りできる状態です。",
    description:
      "資産と積立が見えているユーザーには、週次レポート・資産配分の深掘り・将来シミュレーションの比較がAI Premium価値になり得ます。まずは無料のAI相談で反応を見ます。",
    ctaLabel: "将来のお金を計算する",
    ctaHref: "/simulator",
  };
}
