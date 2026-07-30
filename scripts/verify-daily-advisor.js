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
const { createActionAdvisor } = require("../features/dashboard/createActionAdvisor.ts");

function insights(assets) {
  return createPortfolioInsights(assets);
}

function assertShort(advisor, label) {
  assert(
    advisor.messages.length >= 2 && advisor.messages.length <= 4,
    `${label}: expected 2 to 4 messages`,
  );
  advisor.messages.forEach((message) => {
    assert(message.length <= 60, `${label}: message is too long: ${message}`);
  });
}

function assertAction(advisor, portfolioInsights, label) {
  const actionAdvisor = createActionAdvisor(advisor, portfolioInsights);
  assert(actionAdvisor.reason.length > 0, `${label}: reason is required`);
  assert(actionAdvisor.currentStatus.length > 0, `${label}: current status is required`);
  assert(
    actionAdvisor.recommendations.length > 0 && actionAdvisor.recommendations.length <= 3,
    `${label}: recommendations should be 1 to 3`,
  );
  assert(actionAdvisor.chatPrompt.includes(advisor.messages[0]), `${label}: prompt should reference Daily Advisor`);
  assert(actionAdvisor.chatPrompt.includes("今日のAIでは"), `${label}: prompt should include Daily Advisor intro`);
  assert(actionAdvisor.chatPrompt.includes("私のポートフォリオなら"), `${label}: prompt should ask about portfolio`);
  return actionAdvisor;
}

const empty = createDailyAdvisor(null);
assert.strictEqual(empty.priority, "empty");
assertShort(empty, "empty");
const emptyAction = assertAction(empty, null, "empty action");
assert(emptyAction.currentStatus.length > 0, "empty action should describe current status");

const cashOnlyInsights = insights([
  { name: "cash", category: "cash", amount: 1000000, monthlyContribution: 0 },
]);
const cashOnly = createDailyAdvisor(cashOnlyInsights);
assert.strictEqual(cashOnly.priority, "cash");
assertShort(cashOnly, "cash 100%");
const cashAction = assertAction(cashOnly, cashOnlyInsights, "cash action");
assert(cashAction.recommendations.length <= 3, "cash action should be compact");

const noMonthlyInsights = insights([
  { name: "cash", category: "cash", amount: 400000, monthlyContribution: 0 },
  { name: "fund", category: "fund", amount: 600000, monthlyContribution: 0 },
]);
const noMonthly = createDailyAdvisor(noMonthlyInsights);
assert.strictEqual(noMonthly.priority, "monthly-investment");
assertShort(noMonthly, "no monthly");
const noMonthlyAction = assertAction(noMonthly, noMonthlyInsights, "no monthly action");
assert(noMonthlyAction.recommendations.length <= 3, "no monthly action should be compact");

const diversifiedInsights = insights([
  { name: "cash", category: "cash", amount: 250000, monthlyContribution: 5000 },
  { name: "fund", category: "fund", amount: 300000, monthlyContribution: 20000 },
  { name: "stock", category: "stock", amount: 250000, monthlyContribution: 5000 },
  { name: "bond", category: "other", amount: 200000, monthlyContribution: 5000 },
]);
const diversified = createDailyAdvisor(diversifiedInsights);
assert.strictEqual(diversified.priority, "positive");
assertShort(diversified, "diversified");
const diversifiedAction = assertAction(diversified, diversifiedInsights, "diversified action");
assert(diversifiedAction.recommendations.length <= 3, "diversified action should be compact");

const componentSource = fs.readFileSync("components/dashboard/DashboardClient.tsx", "utf8");
assert(
  componentSource.includes("DailyAdvisorCard") &&
    componentSource.indexOf("<DailyAdvisorCard") < componentSource.indexOf("<section"),
  "DailyAdvisorCard should be rendered at the top of Dashboard",
);
assert(
  componentSource.includes("createActionAdvisor") &&
    componentSource.includes("actionAdvisor={actionAdvisor}"),
  "Dashboard should pass Action Advisor into DailyAdvisorCard",
);
assert(
  !componentSource.includes("DashboardTodayAiCard") &&
    !componentSource.includes("createDashboardTodayAi"),
  "Dashboard should avoid duplicate Today AI cards",
);

const cardSource = fs.readFileSync("components/dashboard/DailyAdvisorCard.tsx", "utf8");
assert(cardSource.includes("aria-expanded"), "Details button should expose expanded state");
assert(cardSource.includes("DailyAdvisorDetails"), "Details component should be rendered");
assert(cardSource.includes("encodeURIComponent(actionAdvisor.chatPrompt)"), "Chat prompt should be encoded");
assert(cardSource.includes("/chat?prompt="), "AI consultation should navigate to Chat with prompt");

const detailsSource = fs.readFileSync("components/dashboard/DailyAdvisorDetails.tsx", "utf8");
assert(detailsSource.includes("actionAdvisor.reason"), "Details should show reason");
assert(detailsSource.includes("actionAdvisor.currentStatus"), "Details should show current status");
assert(detailsSource.includes("actionAdvisor.recommendations.map"), "Details should show recommendations");

const chatClientSource = fs.readFileSync("components/chat/ChatClient.tsx", "utf8");
assert(chatClientSource.includes('get("prompt")'), "ChatClient should read prompt query");
assert(chatClientSource.includes("setInput(prompt.slice"), "ChatClient should set initial input");
assert(
  !chatClientSource.includes("sendMessage(prompt"),
  "ChatClient should not auto-send the initial prompt",
);

console.log("Daily advisor checks passed.");
console.log(
  JSON.stringify(
    {
      empty,
      emptyAction,
      cashOnly,
      cashAction,
      noMonthly,
      noMonthlyAction,
      diversified,
      diversifiedAction,
    },
    null,
    2,
  ),
);
