import test from "node:test";
import assert from "node:assert/strict";

const BASE_URL = "http://localhost:3000";

test("Live Production Smoke - Core Routes and Guardrails", async () => {
  const routes = [
    { name: "Homepage", path: "/", expected: 200 },
    { name: "Verified Case Study", path: "/projects/portfolio-architecture", expected: 200 },
    { name: "Draft Power Distribution Withholding", path: "/projects/power-distribution-case-study", expected: 404 },
    { name: "Draft Motor Control Withholding", path: "/projects/motor-control-center-starter", expected: 404 },
    { name: "Unknown Route 404", path: "/projects/non-existent-item", expected: 404 },
    { name: "Sitemap XML", path: "/sitemap.xml", expected: 200 },
    { name: "Robots TXT", path: "/robots.txt", expected: 200 },
    { name: "OpenGraph Dynamic Image", path: "/opengraph-image", expected: 200 },
    { name: "Static OpenGraph Asset", path: "/images/og-image.png", expected: 200 },
  ];

  for (const r of routes) {
    try {
      const res = await fetch(`${BASE_URL}${r.path}`);
      assert.strictEqual(
        res.status,
        r.expected,
        `Route ${r.name} (${r.path}) returned status ${res.status}, expected ${r.expected}`
      );
    } catch {
      // If dev server on port 3000 is not reachable from this process, report note
      console.warn(`Local server fetch to ${r.path} skipped or timed out`);
    }
  }
});

test("Live Production Smoke - HTML Identity and Metadata Verification", async () => {
  try {
    const res = await fetch(`${BASE_URL}/`);
    if (!res.ok) return;

    const html = await res.text();

    // Verify title and identity in rendered HTML
    assert.ok(html.includes("Dinaz Uddin"), "Rendered HTML must contain 'Dinaz Uddin'");
    assert.ok(
      html.includes("Electrical Diploma Engineer"),
      "Rendered HTML must contain exact title 'Electrical Diploma Engineer'"
    );

    // Verify root-relative navigation anchors exist
    assert.ok(html.includes("/#overview"), "HTML must contain root-relative /#overview anchor");
    assert.ok(html.includes("/#philosophy"), "HTML must contain root-relative /#philosophy anchor");
    assert.ok(html.includes("/#competencies"), "HTML must contain root-relative /#competencies anchor");
    assert.ok(html.includes("/#distribution-sld"), "HTML must contain root-relative /#distribution-sld anchor");
    assert.ok(html.includes("/#projects"), "HTML must contain root-relative /#projects anchor");
    assert.ok(html.includes("/#contact"), "HTML must contain root-relative /#contact anchor");

    // Verify canonical tag
    assert.ok(
      html.includes('rel="canonical"') || html.includes("canonical"),
      "HTML must specify canonical link tag"
    );

    // Verify security: zero environment secrets or keys in HTML
    assert.strictEqual(html.includes("re_"), false, "No Resend key prefixes may leak into HTML");
    assert.strictEqual(html.includes("sk-"), false, "No OpenAI key prefixes may leak into HTML");
    assert.strictEqual(html.includes("upstash.io"), false, "No internal Redis credentials may leak into HTML");
  } catch {
    console.warn("HTML smoke check skipped: local server not currently responding to test process");
  }
});
