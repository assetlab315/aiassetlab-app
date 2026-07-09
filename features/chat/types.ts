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
};
