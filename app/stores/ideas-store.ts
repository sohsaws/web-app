"use client";

import { create } from "zustand";
import type { IdeaSaveRequest } from "@/lib/types/ideas/types";

export interface IdeasStore {
  ideas: IdeaSaveRequest[] | null;
  previousCard: IdeaSaveRequest | null;
  setIdeas: (ideas: IdeaSaveRequest[]) => void;
  addIdeas: (ideas: IdeaSaveRequest[]) => void;
  updateIdeaImage: (ideaId: string, image: string) => void;
  removeIdea: (ideaId: string) => void;
  restorePreviousCard: () => void;
  clearIdeas: () => void;
}

export const useIdeasStore = create<IdeasStore>((set) => ({
  ideas: null,
  previousCard: null,
  setIdeas: (ideas): void => {
    set({ ideas, previousCard: null });
  },
  addIdeas: (ideas): void => {
    set((state) => ({
      ideas: state.ideas ? [...state.ideas, ...ideas] : state.ideas,
    }));
  },
  updateIdeaImage: (ideaId, image): void => {
    set((state) => {
      const ideas = state.ideas;
      const idea = ideas?.find((item) => item.id === ideaId);
      if (!ideas || !idea || idea.image === image) return state;

      return {
        ideas: ideas.map((item) =>
          item.id === ideaId ? { ...item, image } : item,
        ),
      };
    });
  },
  removeIdea: (ideaId): void => {
    set((state) => {
      const previousCard = state.ideas?.find((idea) => idea.id === ideaId);
      if (!previousCard || !state.ideas) return state;

      return {
        ideas: state.ideas.filter((idea) => idea.id !== ideaId),
        previousCard,
      };
    });
  },
  restorePreviousCard: (): void => {
    set((state) => {
      const previousCard = state.previousCard;
      if (!previousCard) return state;

      return {
        ideas: [
          previousCard,
          ...(state.ideas ?? []).filter((idea) => idea.id !== previousCard.id),
        ],
        previousCard: null,
      };
    });
  },
  clearIdeas: (): void => {
    set({ ideas: [], previousCard: null });
  },
}));
