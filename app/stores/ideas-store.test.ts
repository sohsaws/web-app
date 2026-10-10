import { beforeEach, describe, expect, it } from "vitest";
import type { IdeaSaveRequest } from "@/lib/types/ideas/types";
import { useIdeasStore } from "./ideas-store";

function makeIdea(id: string): IdeaSaveRequest {
  return {
    id,
    title: `Idea ${id}`,
    description: "A short description.",
    categories: ["Travel"],
    createdAt: new Date("2026-10-10T10:00:00.000Z"),
  };
}

function deckIds(): string[] | null {
  return useIdeasStore.getState().ideas?.map((idea) => idea.id) ?? null;
}

// The store is a module-level singleton, so every test starts from scratch.
beforeEach(() => {
  useIdeasStore.setState({ ideas: null, previousCard: null });
});

describe("ideas store", () => {
  it("setIdeas starts a deck and forgets the previous card", () => {
    useIdeasStore.setState({ previousCard: makeIdea("old") });
    useIdeasStore.getState().setIdeas([makeIdea("a"), makeIdea("b")]);

    expect(deckIds()).toEqual(["a", "b"]);
    expect(useIdeasStore.getState().previousCard).toBeNull();
  });

  it("addIdeas appends to an existing deck", () => {
    useIdeasStore.getState().setIdeas([makeIdea("a")]);
    useIdeasStore.getState().addIdeas([makeIdea("b"), makeIdea("c")]);

    expect(deckIds()).toEqual(["a", "b", "c"]);
  });

  // Current behavior, kept explicit on purpose: the first batch must go
  // through setIdeas; addIdeas before that is ignored.
  it("addIdeas does nothing before the first deck is set", () => {
    useIdeasStore.getState().addIdeas([makeIdea("a")]);

    expect(deckIds()).toBeNull();
  });

  describe("removing and restoring a card", () => {
    beforeEach(() => {
      useIdeasStore
        .getState()
        .setIdeas([makeIdea("a"), makeIdea("b"), makeIdea("c")]);
    });

    it("removeIdea drops the card and remembers it", () => {
      useIdeasStore.getState().removeIdea("a");

      expect(deckIds()).toEqual(["b", "c"]);
      expect(useIdeasStore.getState().previousCard?.id).toBe("a");
    });

    it("removeIdea ignores an unknown id", () => {
      useIdeasStore.getState().removeIdea("missing");

      expect(deckIds()).toEqual(["a", "b", "c"]);
      expect(useIdeasStore.getState().previousCard).toBeNull();
    });

    it("restorePreviousCard puts the card back on top once", () => {
      useIdeasStore.getState().removeIdea("a");
      useIdeasStore.getState().restorePreviousCard();

      expect(deckIds()).toEqual(["a", "b", "c"]);
      expect(useIdeasStore.getState().previousCard).toBeNull();

      useIdeasStore.getState().restorePreviousCard();
      expect(deckIds()).toEqual(["a", "b", "c"]);
    });

    it("only the last removed card can be restored", () => {
      useIdeasStore.getState().removeIdea("a");
      useIdeasStore.getState().removeIdea("b");
      useIdeasStore.getState().restorePreviousCard();

      expect(deckIds()).toEqual(["b", "c"]);
    });
  });

  describe("updateIdeaImage", () => {
    beforeEach(() => {
      useIdeasStore.getState().setIdeas([makeIdea("a"), makeIdea("b")]);
    });

    it("sets the image of one card only", () => {
      useIdeasStore
        .getState()
        .updateIdeaImage("a", "data:image/png;base64,AAAA");

      const [first, second] = useIdeasStore.getState().ideas ?? [];
      expect(first?.image).toBe("data:image/png;base64,AAAA");
      expect(second?.image).toBeUndefined();
    });

    it("keeps the same state when the image did not change", () => {
      useIdeasStore
        .getState()
        .updateIdeaImage("a", "data:image/png;base64,AAAA");
      const before = useIdeasStore.getState().ideas;

      useIdeasStore
        .getState()
        .updateIdeaImage("a", "data:image/png;base64,AAAA");
      expect(useIdeasStore.getState().ideas).toBe(before);
    });
  });

  it("clearIdeas empties the deck and the undo history", () => {
    useIdeasStore.getState().setIdeas([makeIdea("a")]);
    useIdeasStore.getState().removeIdea("a");
    useIdeasStore.getState().clearIdeas();

    expect(deckIds()).toEqual([]);
    expect(useIdeasStore.getState().previousCard).toBeNull();
  });
});
