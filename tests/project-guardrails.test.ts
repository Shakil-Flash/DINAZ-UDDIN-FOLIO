import test from "node:test";
import assert from "node:assert/strict";
import { projectRecords } from "../src/config/projects";

test("Project Guardrails - Published Projects Integrity", () => {
  const publishedProjects = projectRecords.filter((p) => p.status === "published");

  assert.ok(publishedProjects.length >= 1, "At least one published project must exist");

  for (const project of publishedProjects) {
    assert.strictEqual(
      project.verificationStatus,
      "verified",
      `Published project ${project.id} must have verificationStatus: 'verified'`
    );
    assert.ok(project.slug.length > 0, `Project ${project.id} must have a valid slug`);
    assert.ok(project.title.length > 0, `Project ${project.id} must have a title`);
    assert.ok(project.problem.length > 20, `Project ${project.id} must define a concrete engineering problem`);
    assert.ok(project.approach.length > 20, `Project ${project.id} must define an engineering approach`);
    assert.ok(project.outcome && project.outcome.length > 20, `Published project ${project.id} must have a verified outcome`);
    assert.ok(project.toolsAndEquipment.length >= 3, `Project ${project.id} must list tools/equipment used`);
  }
});

test("Project Guardrails - Draft Templates Withholding", () => {
  const draftProjects = projectRecords.filter((p) => p.status === "draft");

  assert.ok(draftProjects.length >= 2, "Expected at least 2 draft templates for Dinaz to populate");

  for (const draft of draftProjects) {
    assert.strictEqual(
      draft.verificationStatus,
      "sample_template",
      `Draft ${draft.id} must be explicitly tagged as sample_template`
    );
    // Crucial integrity rule: Draft templates must NOT fabricate outcomes
    assert.strictEqual(
      draft.outcome,
      undefined,
      `Draft template ${draft.id} must not have a fabricated outcome before field verification`
    );
  }
});
