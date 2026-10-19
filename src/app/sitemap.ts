import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { projectRecords } from "@/config/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const staticTimestamp = new Date("2026-10-19T00:00:00.000Z");

  // Root landing page
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: staticTimestamp,
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];

  // Strictly include only verified and published project case studies
  // Draft templates remain isolated and are NEVER exposed to search indexes
  const publishedProjects = projectRecords
    .filter((project) => project.status === "published")
    .map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: staticTimestamp,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [...routes, ...publishedProjects];
}
