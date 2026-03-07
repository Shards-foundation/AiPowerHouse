import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const MODEL_LABELS = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Grok",
  "Co Pilot",
  "Meta AI",
  "Manus AI",
  "Kimi",
  "Qwen",
  "DeepSeek",
  "Minimax",
  "Genspark",
  "Perplexity",
  "Mistral"
];

const MODEL_CARD_SELECTOR = /<article class="model-card[\s\S]*?<\/article>/g;

/**
 * Loads the UI markup for validation.
 */
const loadMarkup = async (): Promise<string> => {
  return readFile(new URL("../index.html", import.meta.url), "utf8");
};

describe("UI shell", () => {
  it("includes all required model cards", async () => {
    const markup = await loadMarkup();

    for (const label of MODEL_LABELS) {
      expect(markup).toContain(label);
    }
  });

  it("includes searchable and filterable model roster controls", async () => {
    const markup = await loadMarkup();

    expect(markup).toContain('id="model-search"');
    expect(markup).toContain('id="capability-filter"');
    expect(markup).toContain('id="model-result-count"');
    expect(markup).toContain('id="model-empty-state"');
    expect(markup).toContain("searchInput.addEventListener");
    expect(markup).toContain("filterButton.addEventListener");
  });

  it("wires every model card with searchable and filterable metadata", async () => {
    const markup = await loadMarkup();
    const modelCards = markup.match(MODEL_CARD_SELECTOR) ?? [];

    expect(modelCards).toHaveLength(MODEL_LABELS.length);

    for (const cardMarkup of modelCards) {
      expect(cardMarkup).toContain("data-model-name");
      expect(cardMarkup).toContain("model-capability");
    }
  });
});
