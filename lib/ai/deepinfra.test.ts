import { describe, expect, it, vi } from "vitest";
import { createDeepInfraClient } from "./deepinfra";

const { openAIConstructor } = vi.hoisted(() => ({
  openAIConstructor: vi.fn(),
}));

vi.mock("openai", () => ({
  default: class {
    constructor(options: unknown) {
      openAIConstructor(options);
    }
  },
}));

describe("createDeepInfraClient", () => {
  it.each([
    ["missing", undefined],
    ["empty", ""],
  ])("throws when the API key is %s", (_case, apiKey) => {
    vi.stubEnv("DEEPINFRA_API_KEY", apiKey);

    expect(() => createDeepInfraClient()).toThrow(
      "DEEPINFRA_API_KEY is not configured",
    );
    expect(openAIConstructor).not.toHaveBeenCalled();
  });

  it("points the OpenAI client at DeepInfra without automatic retries", () => {
    vi.stubEnv("DEEPINFRA_API_KEY", "test-key");

    createDeepInfraClient();

    expect(openAIConstructor).toHaveBeenCalledWith({
      apiKey: "test-key",
      baseURL: "https://api.deepinfra.com/v1/openai",
      // Every retry of a paid call is billed again.
      maxRetries: 0,
    });
  });
});
