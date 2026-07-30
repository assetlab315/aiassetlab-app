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

const { getSafeAuthRedirectPath } = require("../lib/auth/redirect.ts");

const cases = [
  { input: null, expected: "/dashboard", label: "null" },
  { input: "", expected: "/dashboard", label: "empty" },
  { input: "/dashboard", expected: "/dashboard", label: "dashboard" },
  { input: "/portfolio?from=login", expected: "/portfolio?from=login", label: "internal query" },
  { input: "//evil.example", expected: "/dashboard", label: "protocol relative" },
  { input: "https://evil.example", expected: "/dashboard", label: "absolute external" },
  { input: "javascript:alert(1)", expected: "/dashboard", label: "bad protocol" },
  { input: "https%3A%2F%2Fevil.example", expected: "/dashboard", label: "encoded external raw" },
  { input: "/\\evil.example", expected: "/dashboard", label: "slash backslash" },
  { input: "\\evil.example", expected: "/dashboard", label: "backslash" },
  { input: "/dashboard\u0000", expected: "/dashboard", label: "control char" },
];

cases.forEach((item) => {
  assert.strictEqual(getSafeAuthRedirectPath(item.input), item.expected, item.label);
});

const callbackSource = fs.readFileSync("app/auth/callback/route.ts", "utf8");
assert(callbackSource.includes("getSafeAuthRedirectPath"));
assert(callbackSource.includes("exchangeCodeForSession"));
assert(!callbackSource.includes("console.log"));
assert(!callbackSource.includes("console.error"));
assert(!callbackSource.includes("error_description"));

console.log("Auth redirect checks passed.");
console.log(
  JSON.stringify(
    {
      protocolRelative: getSafeAuthRedirectPath("//evil.example"),
      absoluteExternal: getSafeAuthRedirectPath("https://evil.example"),
      encodedExternal: getSafeAuthRedirectPath("https%3A%2F%2Fevil.example"),
      backslash: getSafeAuthRedirectPath("/\\evil.example"),
      validInternal: getSafeAuthRedirectPath("/portfolio?from=login"),
    },
    null,
    2,
  ),
);
