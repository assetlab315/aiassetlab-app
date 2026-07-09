import type { PortfolioAsset } from './types';

export const mockPortfolioAssets: PortfolioAsset[] = [
  {
    id: 'cash-001',
    name: '生活防衛資金',
    category: 'cash',
    amount: 800000,
    targetRate: 25,
    memo: '急な出費に備えるための現金です。',
  },
  {
    id: 'fund-001',
    name: '全世界株式インデックス',
    category: 'fund',
    amount: 1200000,
    targetRate: 45,
    memo: '長期資産形成の中心です。',
  },
  {
    id: 'stock-001',
    name: '日本高配当株',
    category: 'stock',
    amount: 500000,
    targetRate: 20,
    memo: '配当収入を増やすための資産です。',
  },
  {
    id: 'other-001',
    name: '自己投資予算',
    category: 'other',
    amount: 200000,
    targetRate: 10,
    memo: 'AI学習や副業準備に使うお金です。',
  },
];
