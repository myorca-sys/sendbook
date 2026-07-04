import { create } from "zustand";
import { MangaEngine } from "../manga/engine";
import { getMangaSourceById } from "../manga/sources";

interface MangaState {
  images: string[];
  isLoading: boolean;
  error: string | null;
  fetchImages: (sourceId: string, link: string) => Promise<void>;
  clearImages: () => void;
}

export const useMangaStore = create<MangaState>((set) => ({
  images: [],
  isLoading: true,
  error: null,
  fetchImages: async (sourceId: string, link: string) => {
    set({ isLoading: true, error: null });
    try {
      const rules = await getMangaSourceById(sourceId);
      if (!rules) throw new Error("Manga source not supported.");
      const targetLink = decodeURIComponent(link);
      const imgs = await MangaEngine.getChapterImages(rules, targetLink);
      set({ images: imgs, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },
  clearImages: () => set({ images: [], isLoading: true, error: null }),
}));
