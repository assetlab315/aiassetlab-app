const fs = require("fs");
const assert = require("assert");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  module._compile(output.outputText, filename);
};

const { createChatPrompt } = require("../lib/chat/createChatPrompt.ts");
const { createOpenAiMessages } = require("../lib/chat/createOpenAiMessages.ts");

function toContext(assets) {
  return {
    totalAssets: assets.reduce((sum, asset) => sum + (asset.amount || 0), 0),
    monthlyContribution: assets.reduce(
      (sum, asset) => sum + (asset.monthlyContribution || 0),
      0,
    ),
    assetCount: assets.length,
    assets,
  };
}

function getPrompt(message, assets) {
  return createChatPrompt(message, [], toContext(assets));
}

function assertIncludes(value, expected, label) {
  assert(
    value.includes(expected),
    `${label}: expected prompt to include "${expected}"`,
  );
}

const noAssetsPrompt = getPrompt("今の資産配分をどう見直せばいいですか？", []);
assertIncludes(noAssetsPrompt, "資産情報未登録", "no assets");
assertIncludes(noAssetsPrompt, "具体的な資産配分分析はできない", "no assets");

const cashHeavyPrompt = getPrompt(
  "毎月3万円を新NISAで積み立てるなら、今の資産状況ではどう考えればいいですか？",
  [
    { name: "現金", category: "cash", amount: 900000, monthlyContribution: 0 },
    { name: "日本株", category: "stock", amount: 100000, monthlyContribution: 30000 },
  ],
);
assertIncludes(cashHeavyPrompt, "現金比率高め", "cash heavy");
assertIncludes(cashHeavyPrompt, "株式系比率低め", "cash heavy");
assertIncludes(cashHeavyPrompt, "積立投資を段階的に検討できます", "cash heavy");

const cryptoHeavyPrompt = getPrompt("今後は何を積み立てればいいですか？", [
  { name: "暗号資産", category: "crypto", amount: 700000, monthlyContribution: 0 },
  { name: "現金", category: "cash", amount: 300000, monthlyContribution: 0 },
]);
assertIncludes(cryptoHeavyPrompt, "暗号資産比率高め", "crypto heavy");
assertIncludes(cryptoHeavyPrompt, "集中投資の傾向があります", "crypto heavy");
assertIncludes(cryptoHeavyPrompt, "新規積立では分散を優先しましょう", "crypto heavy");

const concentratedPrompt = getPrompt("今の資産状況ではどう考えればいいですか？", [
  { name: "個別株A", category: "stock", amount: 1000000, monthlyContribution: 0 },
]);
assertIncludes(concentratedPrompt, "1つの資産にほぼ集中しています", "single asset");

const messages = createOpenAiMessages(cashHeavyPrompt);
assert.strictEqual(messages[0].role, "system");
assert.strictEqual(messages[1].role, "user");
assertIncludes(messages[1].content, "Portfolio Insights:", "openai messages");
assertIncludes(messages[1].content, "現金比率高め", "openai messages");

const nisaPrompt = getPrompt(
  "新NISAで毎月3万円を積み立てるなら何がおすすめですか？",
  [],
);
assertIncludes(nisaPrompt, "年120万円", "nisa knowledge");
assertIncludes(nisaPrompt, "年240万円", "nisa knowledge");
assertIncludes(nisaPrompt, "1800万円", "nisa knowledge");
assert(!nisaPrompt.includes("年間40万円"), "nisa knowledge: should not include old annual 400k");

console.log("Portfolio context delivery checks passed.");
