const fs = require("fs");
const path = require("path");

const root = process.cwd();

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    console.error(`Diagnosis guest save check failed: ${message}`);
    process.exit(1);
  }
}

const diagnosisPage = read("app/diagnosis/page.tsx");
const resultClient = read("app/result/ResultClient.tsx");
const storage = read("lib/diagnosis/storage.ts");

assert(
  diagnosisPage.includes("saveLocalDiagnosisResult(resultInput)"),
  "diagnosis should save to localStorage before any cloud attempt",
);
assert(
  diagnosisPage.indexOf("saveLocalDiagnosisResult(resultInput)") <
    diagnosisPage.indexOf("saveCloudDiagnosisResult(resultInput)"),
  "local save should run before cloud save",
);
assert(
  diagnosisPage.includes("if (!userId) return null;"),
  "cloud save should be skipped when no authenticated user exists",
);
assert(
  diagnosisPage.includes("if (saving) return;"),
  "diagnosis result button should guard against double submit",
);
assert(
  diagnosisPage.includes("router.push(`/result?id=${cloudResultId ?? localResult.id}`)"),
  "diagnosis should route to local result when cloud save fails",
);
assert(
  !diagnosisPage.includes('alert("保存に失敗しました。")') &&
    !diagnosisPage.includes('alert("保存中にエラーが発生しました。")'),
  "guest save failures should not show technical save alerts",
);

assert(
  storage.includes("DIAGNOSIS_STORAGE_KEY"),
  "diagnosis localStorage key should be centralized",
);
assert(
  storage.includes("JSON.stringify(nextResults)") &&
    storage.includes("JSON.parse(raw)"),
  "diagnosis results should serialize and deserialize JSON",
);
assert(
  storage.includes("try") && storage.includes("catch"),
  "diagnosis storage should handle Firefox/private-mode storage errors",
);
assert(
  storage.includes("createInlineDiagnosisUrl"),
  "diagnosis should have a fallback URL when localStorage is unavailable",
);

assert(
  resultClient.includes("loadLocalDiagnosisResult(resultId)"),
  "result page should load local diagnosis results",
);
assert(
  resultClient.indexOf("loadLocalDiagnosisResult(resultId)") <
    resultClient.indexOf("fetch(`/api/diagnosis?id=${resultId}`)"),
  "result page should try local diagnosis before API fetch",
);
assert(
  resultClient.includes("createInlineDiagnosisResult(searchParams)"),
  "result page should display inline fallback result",
);
assert(
  resultClient.includes("let isMounted = true") &&
    resultClient.includes("isMounted = false"),
  "result loading should avoid state updates after unmount",
);

console.log("Diagnosis guest save checks passed.");
