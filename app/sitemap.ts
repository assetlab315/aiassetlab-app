import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://aiassetlab.jp").replace(
  /\/$/,
  "",
);

const routes = [
  "",
  "/diagnosis",
  "/portfolio",
  "/dashboard",
  "/chat",
  "/simulator",
  "/terms",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/dashboard" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/dashboard" ? 0.9 : 0.7,
  }));
}
