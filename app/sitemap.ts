import type { MetadataRoute } from "next";

const siteUrl = "https://aiassetlab.jp";

const routes = [
  "",
  "/diagnosis",
  "/portfolio",
  "/dashboard",
  "/chat",
  "/simulator",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/dashboard" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/dashboard" ? 0.9 : 0.7,
  }));
}
