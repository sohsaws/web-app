"use client";

import { create } from "zustand";

export interface CarouselStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCarouselStore = create<CarouselStore>((set) => ({
  isOpen: false,
  open: (): void => {
    set({ isOpen: true });
  },
  close: (): void => {
    set({ isOpen: false });
  },
}));
