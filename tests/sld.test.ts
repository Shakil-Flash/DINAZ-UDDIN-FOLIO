import test from "node:test";
import assert from "node:assert/strict";
import { sldEquipmentNodes, sldLegendItems } from "../src/config/sld-data";

test("SLD Explorer Data - Equipment Nodes Coverage", () => {
  assert.ok(sldEquipmentNodes.length >= 6, "Expected at least 6 primary substation equipment nodes");

  const expectedTags = [
    "GRID-11KV",
    "VCB-01",
    "TX-01",
    "ACB-01",
    "BUS-415V",
    "MCCB-FD1",
    "MCCB-FD2",
    "APFC-01",
  ];

  for (const tag of expectedTags) {
    const node = sldEquipmentNodes.find((n) => n.tag === tag);
    assert.ok(node, `Equipment node with tag ${tag} must exist`);
    assert.ok(node.name.length > 0, `Node ${tag} must have a non-empty name`);
    assert.ok(node.generalPurpose.length > 10, `Node ${tag} must have a clear general purpose`);
    assert.ok(node.technicalExplanation.length > 20, `Node ${tag} must have a thorough technical explanation`);
    assert.ok(node.standardReference.length > 0, `Node ${tag} must cite an applicable standard`);
    assert.ok(node.keySpecs.length >= 2, `Node ${tag} must provide at least 2 technical parameter points`);
  }
});

test("SLD Explorer Data - Legend Integrity", () => {
  assert.ok(sldLegendItems.length >= 4, "Expected at least 4 conventional legend items");

  const requiredTypes = ["breaker", "transformer", "busbar", "earth", "capacitor"];
  for (const symType of requiredTypes) {
    const item = sldLegendItems.find((l) => l.symbolType === symType);
    assert.ok(item, `Legend must define symbol type: ${symType}`);
    assert.ok(item.description.length > 10, `Legend item ${symType} must contain a clear description`);
  }
});

test("SLD Explorer Data - Non-Fabrication & Integrity Boundaries", () => {
  for (const node of sldEquipmentNodes) {
    // Assert that the dataset avoids claiming real-site live measurements
    assert.doesNotMatch(node.technicalExplanation, /installed at client/i, "Must not claim certified client site installation");
    assert.doesNotMatch(node.generalPurpose, /verified by certification authority/i, "Must not claim false certification authority");
  }
});
