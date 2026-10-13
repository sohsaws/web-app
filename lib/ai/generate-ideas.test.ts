import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { IDEA_CATEGORIES } from "@/lib/config/categories-array";
import {
  assignIdeaCategories,
  generateIdeas,
  generateImages,
} from "./generate-ideas";

const { parse, generate } = vi.hoisted(() => ({
  parse: vi.fn(),
  generate: vi.fn(),
}));

vi.mock("@/lib/ai/deepinfra", () => ({
  IDEA_TEXT_MODEL_ID: "text-model",
  IDEA_IMAGE_MODEL_ID: "image-model",
  createDeepInfraClient: () => ({
    chat: { completions: { parse } },
    images: { generate },
  }),
}));

const PNG_BASE64 = "iVBORw0KGgo=";

const idea = { title: "Night hike", description: "Walk a trail at dusk." };

const categoryRequestSchema = z.object({
  response_format: z.object({
    json_schema: z.object({
      schema: z.object({
        properties: z.object({
          category: z.object({ enum: z.array(z.string()) }),
        }),
      }),
    }),
  }),
});

// The category options the model was allowed to choose from in one call.
function categoryOptions(request: unknown): string[] {
  return categoryRequestSchema.parse(request).response_format.json_schema.schema
    .properties.category.enum;
}

function completion(parsed: unknown) {
  return { choices: [{ message: { parsed } }] };
}

describe("generateIdeas", () => {
  it("returns the parsed idea pack and sends the bio as data", async () => {
    const pack = { ideas: [idea] };
    parse.mockResolvedValue(completion(pack));

    await expect(generateIdeas("I like hiking")).resolves.toEqual(pack);
    expect(parse).toHaveBeenCalledTimes(1);
    expect(parse).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "text-model",
        messages: expect.arrayContaining([
          { role: "user", content: "User bio: I like hiking" },
        ]),
      }),
    );
  });

  it.each([
    ["no parsed result", completion(null)],
    ["no choices", { choices: [] }],
  ])("throws when the model returns %s", async (_case, response) => {
    parse.mockResolvedValue(response);

    await expect(generateIdeas("bio")).rejects.toThrow(
      "Model returned no structured idea pack",
    );
  });
});

describe("assignIdeaCategories", () => {
  beforeEach(() => {
    // Picks "Travel" whenever it is offered, otherwise "Hiking".
    parse.mockImplementation(async (request: unknown) =>
      completion({
        category: categoryOptions(request).includes("Travel")
          ? "Travel"
          : "Hiking",
      }),
    );
  });

  it("asks twice per idea and never offers the first category again", async () => {
    const ideas = [idea, { title: "Beach day", description: "Swim." }];

    const result = await assignIdeaCategories(ideas);

    expect(result).toEqual(
      ideas.map((item) => ({ ...item, categories: ["Travel", "Hiking"] })),
    );
    expect(parse).toHaveBeenCalledTimes(ideas.length * 2);

    const offered = parse.mock.calls.map(([request]) =>
      categoryOptions(request),
    );
    const firstChoices = offered.filter((options) =>
      options.includes("Travel"),
    );
    const secondChoices = offered.filter(
      (options) => !options.includes("Travel"),
    );
    expect(firstChoices).toHaveLength(ideas.length);
    expect(secondChoices).toHaveLength(ideas.length);
    for (const options of firstChoices) {
      expect(options).toHaveLength(IDEA_CATEGORIES.length);
    }
    for (const options of secondChoices) {
      expect(options).toHaveLength(IDEA_CATEGORIES.length - 1);
    }
  });

  it("makes no calls for an empty list", async () => {
    await expect(assignIdeaCategories([])).resolves.toEqual([]);
    expect(parse).not.toHaveBeenCalled();
  });

  it("throws when the model returns no category", async () => {
    parse.mockResolvedValue(completion(null));

    await expect(assignIdeaCategories([idea])).rejects.toThrow(
      "Model returned no structured category",
    );
  });
});

describe("generateImages", () => {
  const scene = "A hiker on a ridge at dusk, warm light on the trail.";

  beforeEach(() => {
    parse.mockResolvedValue(completion({ scene }));
  });

  it("turns the description into a scene and returns the base64 image", async () => {
    generate.mockResolvedValue({ data: [{ b64_json: PNG_BASE64 }] });

    await expect(generateImages(idea.description)).resolves.toEqual({
      image: PNG_BASE64,
    });
    expect(generate).toHaveBeenCalledTimes(1);
    expect(generate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "image-model",
        n: 1,
        response_format: "b64_json",
        prompt: expect.stringContaining(scene),
      }),
    );
  });

  it("rejects an over-long prompt with a ZodError cause before paying for an image", async () => {
    parse.mockResolvedValue(completion({ scene: "a".repeat(2048) }));

    const error = await generateImages(idea.description).catch(
      (caught: unknown) => caught,
    );

    // The image route maps this cause to a 400 instead of a 502.
    expect(error).toBeInstanceOf(Error);
    expect(error instanceof Error && error.cause).toBeInstanceOf(z.ZodError);
    expect(generate).not.toHaveBeenCalled();
  });

  it("throws when the scene model returns nothing", async () => {
    parse.mockResolvedValue(completion(null));

    await expect(generateImages(idea.description)).rejects.toThrow(
      "Model returned no image scene",
    );
    expect(generate).not.toHaveBeenCalled();
  });

  it.each([
    ["no data", {}],
    ["an empty list", { data: [] }],
    ["no base64 field", { data: [{ url: "https://example.com/a.png" }] }],
  ])("throws when DeepInfra returns %s", async (_case, response) => {
    generate.mockResolvedValue(response);

    await expect(generateImages(idea.description)).rejects.toThrow(
      "DeepInfra returned no image",
    );
  });

  it("rejects an image that is not valid base64", async () => {
    generate.mockResolvedValue({ data: [{ b64_json: "not base64!" }] });

    await expect(generateImages(idea.description)).rejects.toThrow(z.ZodError);
  });
});
