'use client'

import { create } from "zustand";
import type { IdeaGeneratedResponse } from "@/lib/types/ideas/types";

export interface IdeasStore {
  ideas: IdeaGeneratedResponse[] | null;
  setIdeas: (ideas: IdeaGeneratedResponse[]) => void;
  addIdeas: (ideas: IdeaGeneratedResponse[]) => void;
  removeIdea: (ideaId: string) => void;
  clearIdeas: () => void;
}

export const useIdeasStore = create<IdeasStore>((set) => ({
    ideas: null,
    setIdeas: (ideas): void => {
      set({ ideas });
    },
    addIdeas: (ideas): void => {
      set((state) => ({
        ideas: state.ideas ? [...state.ideas, ...ideas] : state.ideas,
      }));
    },
    removeIdea: (ideaId): void => {
      set((state) => ({
        ideas: state.ideas 
        ? state.ideas.filter((idea) => idea.id !== ideaId)
        : state.ideas
      }));
    },
    clearIdeas: (): void => {
      set({ ideas: [] });
    },
}));
