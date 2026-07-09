import type { AssetCategory } from './types';

export const assetCategoryLabels: Record<AssetCategory, string> = {
  cash: '現金',
  stock: '株式',
  fund: '投資信託',
  crypto: '暗号資産',
  other: 'その他',
};

export const portfolioActions = {
  rebalance: '今月は投資信託の割合を少し増やし、現金比率を下げることを検討しましょう。',
  keep: '現在の配分は安定しています。今月は積立を継続しましょう。',
};
