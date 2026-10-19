import test from "node:test";
import assert from "node:assert/strict";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";
import { siteConfig } from "../src/config/site";
import { projectRecords } from "../src/config/projects";

test("SEO & Sitemap - Draft Projects Are Strictly Excluded", () => {
  const generatedSitemap = sitemap();

  // Root URL must be present
  const rootEntry = generatedSitemap.find((entry) => entry.url === siteConfig.url.replace(/\/$/, ""));
  assert.ok(rootEntry, "Root homepage URL must exist in sitemap");
  assert.strictEqual(rootEntry.priority, 1.0);

  // Published projects must be present
  const publishedProjects = projectRecords.filter((p) => p.status === "published");
  for (const published of publishedProjects) {
    const entry = generatedSitemap.find((e) => e.url.includes(`/projects/${published.slug}`));
    assert.ok(entry, `Published project ${published.slug} must be indexed in sitemap`);
  }

  // Draft templates must NEVER be in sitemap
  const draftProjects = projectRecords.filter((p) => p.status === "draft");
  for (const draft of draftProjects) {
    const entry = generatedSitemap.find((e) => e.url.includes(`/projects/${draft.slug}`));
    assert.strictEqual(
      entry,
      undefined,
      `Draft template ${draft.slug} MUST NOT be indexed or present in sitemap`
    );
  }
});

test("SEO & Robots - Rules and Sitemap Reference", () => {
  const generatedRobots = robots();

  assert.ok(generatedRobots.rules, "Robots rules must be defined");
  const rules = Array.isArray(generatedRobots.rules) ? generatedRobots.rules : [generatedRobots.rules];

  const mainRule = rules.find((r) => r.userAgent === "*" || (Array.isArray(r.userAgent) && r.userAgent.includes("*")));
  assert.ok(mainRule, "Universal userAgent rule must exist");
  assert.strictEqual(mainRule.allow, "/");

  // API endpoints must be disallowed to prevent web crawler abuse
  assert.ok(
    mainRule.disallow === "/api/" || (Array.isArray(mainRule.disallow) && mainRule.disallow.includes("/api/")),
    "API routes (/api/) must be disallowed in robots.txt"
  );

  assert.ok(
    typeof generatedRobots.sitemap === "string" && generatedRobots.sitemap.includes("/sitemap.xml"),
    "Robots must reference valid /sitemap.xml"
  );
});

test("SEO & Canonical - Domain Consistency", () => {
  assert.ok(
    siteConfig.url.startsWith("https://") || siteConfig.url.startsWith("http://"),
    "Site URL must be a valid absolute protocol URL"
  );
  assert.ok(siteConfig.name.length > 0);
  assert.strictEqual(siteConfig.role, "Electrical Diploma Engineer");
});
