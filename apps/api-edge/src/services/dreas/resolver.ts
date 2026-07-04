// @ts-ignore
import * as CryptoJS from "crypto-js";
import { VideoExtractor } from "./extractor";

export async function resolveProviderData(
  provider: string,
  endpoint: string,
  data: any[],
  targetUrl: string,
) {
  if (
    provider === "samehadaku" &&
    endpoint === "video_sources" &&
    data.length > 0 &&
    data[0].data_post
  ) {
    console.log(`[Swarm Edge] Samehadaku Ajax Resolution Triggered for ${data.length} sources`);
    const resolvedData = [];
    const targetOrigin = new URL(targetUrl).origin;

    for (const source of data) {
      try {
        const formData = new URLSearchParams();
        formData.append("action", "player_ajax");
        formData.append("post", source.data_post);
        formData.append("nume", source.data_nume);
        formData.append("type", source.data_type);

        const res = await fetch(`${targetOrigin}/wp-admin/admin-ajax.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "X-Requested-With": "XMLHttpRequest",
            Referer: targetUrl,
          },
          body: formData.toString(),
        });

        if (res.ok) {
          const ajaxHtml = await res.text();
          const iframeMatch = ajaxHtml.match(/<iframe[^>]+src=["']([^"']+)["']/i);
          if (iframeMatch && iframeMatch[1]) {
            const embedUrl = iframeMatch[1];
            const directUrl = await VideoExtractor.extract(embedUrl);
            resolvedData.push({ label: source.label, src: directUrl });
          }
        }
      } catch (e) {
        console.error(`[Swarm Edge] Ajax Resolution Failed for ${source.label}`, e);
      }
    }
    if (resolvedData.length > 0) return resolvedData;
  }

  if (
    provider === "kuronime" &&
    endpoint === "video_sources" &&
    data.length > 0 &&
    data[0].req_id
  ) {
    console.log(
      `[Swarm Edge] Kuronime API Resolution Triggered for req_id: ${data[0].req_id.substring(0, 10)}...`,
    );
    try {
      const res = await fetch("https://animeku.org/api/v9/sources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Referer: "https://kuronime.sbs/",
        },
        body: JSON.stringify({ id: data[0].req_id }),
      });

      if (res.ok) {
        const json: any = await res.json();
        const resolvedData: any[] = [];

        const JsonFormatter = {
          stringify: function () {
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

        const decryptKuronime = (encryptedBase64: string, contextLabel: string) => {
          if (!encryptedBase64) return "";
          try {
            const decodedJsonStr = atob(encryptedBase64);
            const decrypted = CryptoJS.AES.decrypt(decodedJsonStr, "3&!Z0M,VIZ;dZW==", {
              format: JsonFormatter as any,
            });
            const result = decrypted.toString(CryptoJS.enc.Utf8);
            if (!result) {
              console.warn(
                `[Swarm Edge][Kuronime] Decryption returned empty string for ${contextLabel}. Possible key rotation or invalid padding.`,
              );
            }
            return result;
          } catch (e: any) {
            console.error(
              `[Swarm Edge][Kuronime] Critical Decryption Error on ${contextLabel}:`,
              e.message,
            );
            return "";
          }
        };

        const extractDecryptedUrl = (encryptedVal: string, labelPrefix: string) => {
          const decrypted = decryptKuronime(encryptedVal, labelPrefix);
          if (!decrypted) {
            console.warn(
              `[Swarm Edge][Kuronime] Missing or failed decryption for stream quality: ${labelPrefix}`,
            );
            return;
          }

          if (decrypted.startsWith("http")) {
            console.log(
              `[Swarm Edge][Kuronime] Successfully resolved Direct Stream for ${labelPrefix}`,
            );
            resolvedData.push({
              label: `${labelPrefix} Direct`,
              src: decrypted,
            });
          } else {
            try {
              const p = JSON.parse(decrypted);
              if (p.src) {
                console.log(
                  `[Swarm Edge][Kuronime] Successfully resolved JSON Encoded Stream for ${labelPrefix}`,
                );
                resolvedData.push({
                  label: `${labelPrefix} Direct`,
                  src: p.src,
                });
              } else {
                console.warn(
                  `[Swarm Edge][Kuronime] Decrypted JSON for ${labelPrefix} did not contain a 'src' key. Payload: ${decrypted.substring(0, 50)}`,
                );
              }
            } catch (e: any) {
              console.error(
                `[Swarm Edge][Kuronime] Failed to parse decrypted payload as JSON for ${labelPrefix}. Error: ${e.message}`,
              );
            }
          }
        };

        console.log(`[Swarm Edge][Kuronime] Starting decryption pipeline for HD/SD sources...`);
        extractDecryptedUrl(json.src, "HD");
        extractDecryptedUrl(json.src_sd, "SD");

        console.log(`[Swarm Edge][Kuronime] Attempting to resolve Mirror Links...`);
        const mirrorStr = decryptKuronime(json.mirror, "Mirrors");
        if (mirrorStr) {
          try {
            const mirrorJson = JSON.parse(mirrorStr);
            const embeds = mirrorJson.embed || {};
            let mirrorCount = 0;
            for (const resKey of Object.keys(embeds)) {
              const quality = resKey.replace("v", "");
              const providers = embeds[resKey] || {};
              for (const [providerName, providerUrl] of Object.entries(providers)) {
                if (providerUrl) {
                  resolvedData.push({
                    label: `${providerName} (${quality}p)`,
                    src: providerUrl,
                  });
                  mirrorCount++;
                }
              }
            }
            console.log(
              `[Swarm Edge][Kuronime] Successfully extracted ${mirrorCount} mirror link(s)`,
            );
          } catch (e: any) {
            console.error(
              `[Swarm Edge][Kuronime] Failed to parse Mirror JSON payload. Error: ${e.message}`,
            );
          }
        } else {
          console.warn(`[Swarm Edge][Kuronime] No mirror data found or decryption failed.`);
        }

        if (resolvedData.length > 0) {
          console.log(
            `[Swarm Edge][Kuronime] Resolution Complete. Yielding ${resolvedData.length} total source(s).`,
          );
          return resolvedData;
        } else {
          console.error(
            `[Swarm Edge][Kuronime] FATAL: Resolution pipeline completed but 0 sources were extracted.`,
          );
        }
      } else {
        console.error(
          `[Swarm Edge][Kuronime] API Resolution failed. Server returned HTTP ${res.status}: ${res.statusText}`,
        );
      }
    } catch (e: any) {
      console.error(
        `[Swarm Edge][Kuronime] Unhandled Exception during API Resolution:`,
        e.message,
        e.stack,
      );
    }
  }

  return data;
}
