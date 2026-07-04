import { useEffect, useState, useMemo } from "react";
import { API_URL } from "../config";
import { storage } from "../storage";
import * as SplashScreen from "expo-splash-screen";

const FALLBACK_TRIVIA = [
  "One Piece sudah tayang sejak tahun 1999.",
  "Film anime pertama yang memenangkan Oscar adalah Spirited Away.",
  "Demon Slayer: Mugen Train adalah film anime terlaris sepanjang masa.",
  "Kualitas 1080p di Orca dioptimalkan untuk kuota hemat.",
];

export function useAppInitialization() {
  const [appReady, setAppReady] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);

  const activeTrivia = useMemo(() => {
    const cached = storage.getString("trivia_list");
    const list = cached ? JSON.parse(cached) : FALLBACK_TRIVIA;
    return list[Math.floor(Math.random() * list.length)];
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        const trivRes = await fetch(`${API_URL}/api/trivia`);
        if (trivRes.ok) {
          const json = await trivRes.json();
          if (json.success && json.data)
            storage.set("trivia_list", JSON.stringify(json.data));
        }
      } catch (e) {}

      try {
        const res = await fetch(`${API_URL}/api/v2/stats`, { method: "GET" });
        const text = await res.text();

        if (
          text.includes("Preparing Space") ||
          text.includes("Hugging Face") ||
          text.includes("Space is sleeping")
        ) {
          setIsWakingUp(true);
          let ready = false;
          while (!ready) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const retry = await fetch(`${API_URL}/api/v2/stats`, {
              method: "GET",
            });
            const retryText = await retry.text();
            if (
              !retryText.includes("Preparing Space") &&
              !retryText.includes("Hugging Face") &&
              !retryText.includes("Space is sleeping")
            )
              ready = true;
          }
        }
      } catch (e) {
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
        setIsWakingUp(false);
      }
    }
    prepare();
  }, []);

  return { appReady, isWakingUp, activeTrivia };
}
