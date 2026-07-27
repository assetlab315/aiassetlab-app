export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type PortfolioContextAsset = {
  name?: string;
  category?: string;
  amount?: number;
  monthlyContribution?: number;
};

export type PortfolioInsightCategory =
  | "cash"
  | "stock"
  | "fund"
  | "etf"
  | "reit"
  | "bond"
  | "crypto"
  | "gold"
  | "other";

export type PortfolioInsightRatio = {
  category: PortfolioInsightCategory;
  label: string;
  amount: number;
  ratio: number;
  description: string;
};

export type PortfolioInsights = {
  totalAssets: number;
  totalAssetsDescription: string;
  categoryRatios: PortfolioInsightRatio[];
  cashRatio: number;
  cashLevel: "high" | "normal" | "low" | "none";
  stockRatio: number;
  stockLevel: "high" | "normal" | "low" | "none";
  bondRatio: number;
  cryptoRatio: number;
  cryptoLevel: "high" | "normal" | "none";
  diversification: "Excellent" | "Good" | "Moderate" | "Poor";
  concentration: "none" | "over50" | "over70" | "over90";
  largestAssetRatio: number;
  investmentCount: number;
  monthlyInvestment: number;
  monthlyInvestmentDescription: string;
  riskLevel: "low" | "medium" | "high";
  warnings: string[];
  strengths: string[];
  recommendations: string[];
};

export type ChatUserContext = {
  totalAssets: number;
  monthlyContribution: number;
  assetCount: number;
  assets: PortfolioContextAsset[];
};

export type ChatApiRequest = {
  message: string;
  history: ChatMessage[];
  context: ChatUserContext;
};

export type ChatApiResponse = {
  answer: string;
  source: "openai" | "fallback";
  status?: "ok" | "fallback" | "rate_limited" | "validation_error";
};
