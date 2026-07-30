export function getSafeAuthRedirectPath(value: string | null) {
  if (!value) return "/dashboard";

  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return "/dashboard";
  if (trimmed.includes("\\") || /[\u0000-\u001f]/.test(trimmed)) return "/dashboard";

  return trimmed;
}
