import CryptoJS from "crypto-js";
import { API_URL } from "../../config";

export async function resolveKuronime(data: any[]): Promise<any[]> {
  const reqIdUrl =
    data[0].url && data[0].url.startsWith("req_id://")
      ? data[0].url.replace("req_id://", "").replace("//", "")
      : null;
  const reqId = data[0].req_id || reqIdUrl;
  const prefetchedJson = data[0].__kuronime_prefetched;

  if (!reqId && !prefetchedJson) return data;

  console.log(`[ClientResolver] Resolving Kuronime...`);
  try {
    let json = prefetchedJson;

    const fetchWithTimeout = (url: string, options: any, timeoutMs: number): Promise<Response> => {
      return Promise.race([
        fetch(url, options),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeoutMs)
        )
      ]);
    };

    if (!json && reqId) {
      // Primary: Direct Fetch to animeku.org (React Native handles headers without CORS limits)
      try {
        const res = await fetchWithTimeout("https://animeku.org/api/v9/sources", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://kuronime.sbs/"
          },
          body: JSON.stringify({ id: reqId }),
        }, 6000);

        if (res.ok) {
          const directData = await res.json();
          if (directData) {
            json = directData;
            console.log(`[ClientResolver] Kuronime resolved via Direct Fetch successfully.`);
          }
        } else {
          console.log(`[ClientResolver] Kuronime direct fetch returned status ${res.status}`);
        }
      } catch (directErr) {
        console.log(`[ClientResolver] Kuronime direct fetch failed or timed out, trying Edge proxy fallback...`);
      }

      // Secondary Fallback: Use Edge proxy via HF Space if direct fetch fails
      if (!json) {
        const targetApi = `${API_URL}/api/edge-scrape/kuronime-sources`;
        try {
          const res = await fetchWithTimeout(targetApi, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reqId }),
          }, 8000);

          if (res.ok) {
            const wrapper = await res.json();
            if (wrapper && wrapper.success) {
              json = wrapper.data;
              console.log(`[ClientResolver] Kuronime resolved via Edge proxy successfully.`);
            }
          } else {
            console.warn(`[ClientResolver] Kuronime proxy returned status ${res.status}`);
          }
        } catch (fetchErr: any) {
          console.warn(`[ClientResolver] Kuronime proxy fetch failed or timed out:`, fetchErr.message);
        }
      }
    }

    if (json) {
      const resolvedData: any[] = [];

      const JsonFormatter = {
        stringify: function (cipherParams: any) {
          return "";
        },
        parse: function (jsonStr: string) {
          const jsonObj = JSON.parse(jsonStr);
          const cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct),
          });
          if (jsonObj.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
          if (jsonObj.s) cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
          return cipherParams;
        },
      };

      const decryptKuronime = (encryptedBase64: string) => {
        if (!encryptedBase64) return "";
        try {
          const decodedJsonStr =
            typeof atob !== "undefined"
              ? atob(encryptedBase64)
              : Buffer.from(encryptedBase64, "base64").toString("binary");
          const decrypted = CryptoJS.AES.decrypt(decodedJsonStr, "3&!Z0M,VIZ;dZW==", {
            format: JsonFormatter as any,
          });
          return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (e) {
          return "";
        }
      };

      const parseUrl = (key: string, label: string) => {
        const str = decryptKuronime(json[key]);
        if (!str) return;
        if (str.startsWith("http")) {
          resolvedData.push({ label, src: str });
        } else {
          try {
            const p = JSON.parse(str);
            if (p.src) resolvedData.push({ label, src: p.src });
          } catch (e) {}
        }
      };

      parseUrl("src", "HD Direct");
      parseUrl("src_sd", "SD Direct");

      const mirrorStr = decryptKuronime(json.mirror);
      if (mirrorStr) {
        try {
          const mirrorJson = JSON.parse(mirrorStr);
          const embeds = mirrorJson.embed || {};
          const promises: Promise<void>[] = [];

          for (const resKey of Object.keys(embeds)) {
            const quality = resKey.replace("v", "");
            const providers = embeds[resKey] || {};

            for (const [providerName, providerUrl] of Object.entries(providers)) {
              if (providerUrl && typeof providerUrl === "string") {
                promises.push(
                  (async () => {
                    let finalUrl = providerUrl;
                    let type = "iframe";

                    if (finalUrl.includes("mp4upload.com/embed-")) {
                      try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 5000);
                        const mp4Res = await fetch(finalUrl, {
                          headers: {
                            "User-Agent":
                              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                            Referer: "https://www.mp4upload.com/",
                          },
                          signal: controller.signal,
                        });
                        clearTimeout(timeoutId);

                        if (mp4Res.ok) {
                          const html = await mp4Res.text();
                          if (html.includes("File was deleted") || mp4Res.url.includes("/login"))
                            return;
                          const match = html.match(
                            /src:\s*["'](https?:\/\/[^"']+\.mp4(?:\?[^"']*)?)["']/i,
                          );
                          if (match && match[1]) {
                            finalUrl = match[1];
                            type = "mp4 (direct)";
                            resolvedData.push({
                              label: `${providerName} (${quality}p)`,
                              src: finalUrl,
                              quality: `${quality}p`,
                              type,
                            });
                          }
                        }
                      } catch (e) {}
                    } else {
                      resolvedData.push({
                        label: `${providerName} (${quality}p)`,
                        src: finalUrl,
                        quality: `${quality}p`,
                        type,
                      });
                    }
                  })(),
                );
              }
            }
          }
          await Promise.all(promises);
        } catch (e) {
          console.error("Kuronime Mirror Parse Error", e);
        }
      }
      return resolvedData.length > 0 ? resolvedData : data;
    }
  } catch (e) {
    console.error(`[ClientResolver] Kuronime API Resolution Failed`, e);
  }
  return data;
}
