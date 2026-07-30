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

require.extensions[".tsx"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  module._compile(output.outputText, filename);
};

const { createPortfolioInsights } = require("../lib/chat/createPortfolioInsights.ts");
const { createDailyAdvisor } = require("../features/dashboard/createDailyAdvisor.ts");

function insights(assets) {
  return createPortfolioInsights(assets);
}

function assertShort(advisor, label) {
  assert(
    advisor.messages.length >= 2 && advisor.messages.length <= 4,
    `${label}: expected 2 to 4 messages`,
  );
  advisor.messages.forEach((message) => {
    assert(message.length <= 45, `${label}: message is too long: ${message}`);
    assert(/[。]$/.test(message), `${label}: message should end naturally: ${message}`);
  });
}

function assertIncludes(advisor, expected, label) {
  const text = advisor.messages.join("");
  assert(text.includes(expected), `${label}: expected "${text}" to include "${expected}"`);
}

const empty = createDailyAdvisor(null);
assert.strictEqual(empty.priority, "empty");
assertIncludes(empty, "資産情報が登録されていません", "empty");
assertShort(empty, "empty");

const cashOnly = createDailyAdvisor(
  insights([{ name: "現金", category: "cash", amount: 1000000, monthlyContribution: 0 }]),
);
assert.strictEqual(cashOnly.priority, "cash");
assertIncludes(cashOnly, "現金比率が高め", "cash 100%");
assertIncludes(cashOnly, "積立", "cash 100%");
assertShort(cashOnly, "cash 100%");

const noMonthly = createDailyAdvisor(
  insights([
    { name: "現金", category: "cash", amount: 400000, monthlyContribution: 0 },
    { name: "投資信託", category: "fund", amount: 600000, monthlyContribution: 0 },
  ]),
);
assert.strictEqual(noMonthly.priority, "monthly-investment");
assertIncludes(noMonthly, "積立設定がまだありません", "no monthly");
assertShort(noMonthly, "no monthly");

const diversified = createDailyAdvisor(
  insights([
    { name: "現金", category: "cash", amount: 250000, monthlyContribution: 5000 },
    { name: "投資信託", category: "fund", amount: 300000, monthlyContribution: 20000 },
    { name: "株式", category: "stock", amount: 250000, monthlyContribution: 5000 },
    { name: "債券", category: "other", amount: 200000, monthlyContribution: 5000 },
  ]),
);
assert.strictEqual(diversified.priority, "positive");
assertIncludes(diversified, "おおむね整っています", "diversified");
assertShort(diversified, "diversified");

const componentSource = fs.readFileSync("components/dashboard/DashboardClient.tsx", "utf8");
assert(
  componentSource.includes("DailyAdvisorCard") &&
    componentSource.indexOf("<DailyAdvisorCard") < componentSource.indexOf("<section"),
  "DailyAdvisorCard should be rendered at the top of Dashboard",
);
assert(
  !componentSource.includes("DashboardTodayAiCard") &&
    !componentSource.includes("createDashboardTodayAi"),
  "Dashboard should avoid duplicate Today AI cards",
);

console.log("Daily advisor checks passed.");
console.log(
  JSON.stringify(
    {
      empty,
      cashOnly,
      noMonthly,
      diversified,
    },
    null,
    2,
  ),
);
