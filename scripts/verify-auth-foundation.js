const fs = require("fs");
const assert = require("assert");

function read(path) {
  return fs.readFileSync(path, "utf8");
}

const packageJson = JSON.parse(read("package.json"));
assert(packageJson.dependencies["@supabase/supabase-js"], "@supabase/supabase-js is required");
assert(packageJson.dependencies["@supabase/ssr"], "@supabase/ssr is required");

[
  "lib/supabase/client.ts",
  "lib/supabase/server.ts",
  "lib/supabase/middleware.ts",
  "middleware.ts",
  "app/auth/callback/route.ts",
  "app/auth/logout/route.ts",
  "app/login/page.tsx",
  "components/auth/LoginClient.tsx",
  "components/auth/AuthNavItem.tsx",
].forEach((path) => assert(fs.existsSync(path), `${path} should exist`));

assert(!fs.existsSync("proxy.ts"), "Next.js 14 should use middleware.ts, not proxy.ts");

const clientSource = read("lib/supabase/client.ts");
const serverSource = read("lib/supabase/server.ts");
const middlewareSource = read("lib/supabase/middleware.ts");
const callbackSource = read("app/auth/callback/route.ts");
const loginSource = read("components/auth/LoginClient.tsx");
const logoutSource = read("app/auth/logout/route.ts");
const layoutSource = read("app/layout.tsx");

assert(clientSource.includes("createBrowserClient"), "browser client should use @supabase/ssr");
assert(serverSource.includes("createServerClient"), "server client should use @supabase/ssr");
assert(middlewareSource.includes("supabase.auth.getUser()"), "middleware should refresh session with getUser");
assert(callbackSource.includes("exchangeCodeForSession"), "callback should exchange OAuth code");
assert(callbackSource.includes("startsWith(\"/\")"), "callback should only allow internal next paths");
assert(callbackSource.includes("startsWith(\"//\")"), "callback should reject protocol-relative URLs");
assert(!callbackSource.includes("console.log"), "callback should not log tokens or codes");
assert(!callbackSource.includes("console.error"), "callback should not log callback internals");
assert(logoutSource.includes("auth.signOut"), "logout should clear Supabase session");
assert(loginSource.includes("signInWithOAuth"), "Google OAuth should be available");
assert(loginSource.includes("signInWithOtp"), "email auth foundation should be available");
assert(layoutSource.includes("AuthNavItem"), "layout should expose login/account navigation");

const clientFacingSources = [
  "components/auth/LoginClient.tsx",
  "components/auth/AuthNavItem.tsx",
  "components/auth/AccountClient.tsx",
  "lib/supabase/client.ts",
  "lib/portfolio/usePortfolioSync.ts",
].map(read).join("\n");

assert(!clientFacingSources.includes("SERVICE_ROLE"), "client source must not mention service role keys");
assert(!clientFacingSources.includes("service_role"), "client source must not mention service_role keys");
assert(!clientFacingSources.includes("SUPABASE_SERVICE_ROLE_KEY"), "service role env must not be used");

const envSource = read("lib/supabase/config.ts");
assert(envSource.includes("NEXT_PUBLIC_SUPABASE_URL"));
assert(envSource.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
assert(!envSource.includes("NEXT_PUBLIC_SUPABASE_SERVICE"), "secret key must not be public");

console.log("Auth foundation checks passed.");
console.log(
  JSON.stringify(
    {
      nextVersion: packageJson.dependencies.next,
      reactVersion: packageJson.dependencies.react,
      supabaseJs: packageJson.dependencies["@supabase/supabase-js"],
      supabaseSsr: packageJson.dependencies["@supabase/ssr"],
      sessionRefresh: "middleware.ts + @supabase/ssr getUser",
      openRedirectGuard: "internal paths only",
      serviceRoleClientExposure: false,
    },
    null,
    2,
  ),
);
