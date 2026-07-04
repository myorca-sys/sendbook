import { create } from "zustand";
import { AnimeEngine } from "../anime/engine";
import { AnimeSource } from "../anime/types";
import { storage } from "../storage";

interface PlayerState {
  clientSources: AnimeSource[];
  isClientScraping: boolean;
  videoUrl: string | null;
  bestSource: AnimeSource | null;
  requestedSeekTime: number | null;
  currentTimeRef: { current: number } | null;
  currentEpisodeUrl: string | null;
  fetchSources: (episodeUrl: string) => Promise<void>;
  clearSources: () => void;
  seekTo: (seconds: number) => void;
  setCurrentTimeRef: (ref: { current: number } | null) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  clientSources: [],
  isClientScraping: false,
  videoUrl: null,
  bestSource: null,
  requestedSeekTime: null,
  currentTimeRef: null,
  currentEpisodeUrl: null,
  fetchSources: async (episodeUrl: string) => {
    set({
      isClientScraping: true,
      clientSources: [],
      currentEpisodeUrl: episodeUrl,
    });
    try {
      let sc: AnimeSource[] = [];
      if (episodeUrl.includes("idlixku")) {
        sc = await AnimeEngine.getIdlixSources(episodeUrl);
      } else if (episodeUrl.includes("kuronime") || episodeUrl.includes("animeku")) {
        sc = await AnimeEngine.getKuronimeSources(episodeUrl);
      } else if (episodeUrl.includes("samehadaku")) {
        sc = await AnimeEngine.getSamehadakuSources(episodeUrl);
      }

      // Prevent Race Condition: Discard if user navigated away before promise resolved
      if (get().currentEpisodeUrl !== episodeUrl) return;

      const preferredRes = storage.getString("@preferred_resolution") || "720p";
      const best = AnimeEngine.getBestSource(sc, preferredRes);

      set({
        clientSources: sc,
        bestSource: best,
        videoUrl: best?.url || null,
        isClientScraping: false,
      });
    } catch (e) {
      if (get().currentEpisodeUrl !== episodeUrl) return;
      console.warn("Client scraping failed:", e);
      set({ isClientScraping: false });
    }
  },
  seekTo: (seconds: number) => set({ requestedSeekTime: seconds }),
  setCurrentTimeRef: (ref) => set({ currentTimeRef: ref }),
  clearSources: () =>
    set({
      clientSources: [],
      isClientScraping: false,
      videoUrl: null,
      bestSource: null,
      requestedSeekTime: null,
      currentTimeRef: null,
      currentEpisodeUrl: null,
    }),
}));
