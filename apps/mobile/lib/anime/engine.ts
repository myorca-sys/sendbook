import { AnimeSource } from "./types";
import { RuleEvaluator } from "../engine/evaluator";
import { getConfig, reportError } from "./helpers/configHelpers";
import { getBestSource } from "./helpers/sourceHelpers";
import { ClientResolver } from "./clientResolver";
import { HF_API_URL } from "../config";

export class AnimeEngine {
  static async getSourcesDynamic(
    providerId: string,
    episodeUrl: string,
  ): Promise<AnimeSource[]> {
    const config = await getConfig();
    const rules = config[providerId];
    if (!rules || !rules.pipeline)
      throw new Error(`No dynamic pipeline found for provider: ${providerId}`);

    const evaluator = new RuleEvaluator({ target_url: episodeUrl });

    try {
      const rawSources = await evaluator.execute(rules.pipeline);
      if (Array.isArray(rawSources)) {
        const resolvedSources = await ClientResolver.resolve(
          providerId,
          rawSources,
        );
        const sortOrder: Record<string, number> = {
          "1080p": 4,
          "720p": 3,
          "480p": 2,
          "360p": 1,
          Auto: 0,
        };
        resolvedSources.sort(
          (a, b) => (sortOrder[b.quality] || 0) - (sortOrder[a.quality] || 0),
        );
        return resolvedSources;
      }
      return [];
    } catch (error) {
      console.warn(`[${providerId}] Dynamic Pipeline Error:`, error);
      reportError(providerId, episodeUrl, error);
      return [];
    }
  }

  static async getKuronimeSources(episodeUrl: string): Promise<AnimeSource[]> {
    return this.getSourcesDynamic("kuronime", episodeUrl);
  }

  static async getSamehadakuSources(
    episodeUrl: string,
  ): Promise<AnimeSource[]> {
    return this.getSourcesDynamic("samehadaku", episodeUrl);
  }

  /**
   * IDLIX: Authentication chain (gate→claim→redeem) is fully handled by the Rust
   * backend. No JS rule evaluator needed — just call the streams endpoint.
   * Note: response takes ~15s due to IDLIX gate unlock delay.
   */
  static async getIdlixSources(episodeUrl: string): Promise<AnimeSource[]> {
    try {
      console.log("[IDLIX Client] Memulai scraping direct client-side untuk:", episodeUrl);
      
      const urlObj = new URL(episodeUrl);
      const segments = urlObj.pathname.split('/').filter(Boolean);
      if (segments.length < 6) throw new Error("Invalid IDLIX episode URL structure");
      
      const slug = segments[1];
      const seasonNum = segments[3];
      const epNum = segments[5];
      
      const baseUrl = "https://z2.idlixku.com";
      const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36";

      // 0. Cloudflare Warmup: Fetch the HTML episode page first to obtain cookies
      console.log("[IDLIX Client] Running Cloudflare Warmup...");
      try {
        await fetch(episodeUrl, {
          headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "User-Agent": userAgent,
            "Referer": baseUrl,
          }
        });
      } catch (e) {
        console.warn("[IDLIX Client] Warmup failed:", e);
      }

      // 1. Get episode details JSON to retrieve epId
      const detailsApi = `${baseUrl}/api/series/${slug}/season/${seasonNum}/episode/${epNum}`;
      console.log("[IDLIX Client] Fetching episode details...");
      const detailsRes = await fetch(detailsApi, {
        headers: {
          "Accept": "application/json, text/plain, */*",
          "User-Agent": userAgent,
          "Referer": episodeUrl,
        }
      });
      if (!detailsRes.ok) {
        const errText = await detailsRes.text().catch(() => "");
        throw new Error(`Details fetch failed (${detailsRes.status}): ${errText.substring(0, 150)}`);
      }
      const detailsData = await detailsRes.json();
      const epId = detailsData?.episode?.id;
      if (!epId) throw new Error("Missing episode ID in response");

      // 2. Fetch play info to get gateToken
      const playInfoApi = `${baseUrl}/api/watch/play-info/episode/${epId}`;
      console.log("[IDLIX Client] Fetching play-info...");
      const playInfoRes = await fetch(playInfoApi, {
        headers: {
          "Accept": "application/json, text/plain, */*",
          "User-Agent": userAgent,
          "Referer": episodeUrl,
        }
      });
      if (!playInfoRes.ok) {
        const errText = await playInfoRes.text().catch(() => "");
        throw new Error(`Play-info fetch failed (${playInfoRes.status}): ${errText.substring(0, 150)}`);
      }
      const playInfo = await playInfoRes.json();
      
      if (playInfo.kind !== "gate") {
        throw new Error("Play info kind is not gate");
      }
      
      const gateToken = playInfo.gateToken;
      if (!gateToken) throw new Error("Missing gateToken");

      // 3. Decode device ID from gate token
      const decodeBase64 = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let buffer = '';
        for (let i = 0; i < base64.length; i += 4) {
          if (base64[i] === '=') break;
          const idx0 = chars.indexOf(base64[i]);
          const idx1 = chars.indexOf(base64[i+1]);
          const idx2 = base64[i+2] === '=' ? 0 : chars.indexOf(base64[i+2]);
          const idx3 = base64[i+3] === '=' ? 0 : chars.indexOf(base64[i+3]);
          const chunk = (idx0 << 18) | (idx1 << 12) | (idx2 << 6) | idx3;
          buffer += String.fromCharCode((chunk >> 16) & 255);
          if (base64[i+2] !== '=') {
            buffer += String.fromCharCode((chunk >> 8) & 255);
          }
          if (base64[i+3] !== '=') {
            buffer += String.fromCharCode(chunk & 255);
          }
        }
        return buffer;
      };

      const parts = gateToken.split('.');
      const decoded = decodeBase64(parts[0]);
      const payload = JSON.parse(decoded);
      const owner = payload.owner;
      if (!owner || !owner.startsWith("d:")) throw new Error("Invalid owner in gate token");
      const deviceId = owner.substring(2);
      const cookieHeader = `did=${deviceId}`;

      // 4. Wait for gate unlock
      const serverNow = playInfo.serverNow || 0;
      const unlockAt = playInfo.unlockAt || 0;
      if (unlockAt > serverNow) {
        const waitMs = Math.min(unlockAt - serverNow, 20_000);
        console.log(`[IDLIX Client] Waiting ${waitMs}ms for gate to unlock...`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
      }

      // 5. Claim session
      const claimApi = `${baseUrl}/api/watch/session/claim`;
      console.log("[IDLIX Client] Claiming session...");
      const claimRes = await fetch(claimApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": userAgent,
          "Referer": episodeUrl,
          "Cookie": cookieHeader,
        },
        body: JSON.stringify({ gateToken })
      });
      if (!claimRes.ok) {
        const errText = await claimRes.text().catch(() => "");
        throw new Error(`Claim failed (${claimRes.status}): ${errText.substring(0, 150)}`);
      }
      const claimData = await claimRes.json();
      const claimToken = claimData.claim;
      const redeemUrl = claimData.redeemUrl;
      if (!claimToken || !redeemUrl) throw new Error("Missing claim token or redeemUrl");

      // 6. Redeem token to get final stream JSON config URL
      console.log("[IDLIX Client] Redeeming token...");
      const redeemRes = await fetch(redeemUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          "User-Agent": userAgent,
          "Referer": episodeUrl,
          "Cookie": cookieHeader,
        },
        body: JSON.stringify({ claim: claimToken })
      });
      if (!redeemRes.ok) {
        const errText = await redeemRes.text().catch(() => "");
        throw new Error(`Redeem failed (${redeemRes.status}): ${errText.substring(0, 150)}`);
      }
      const redeemData = await redeemRes.json();
      const streamUrl = redeemData.url;
      if (!streamUrl) throw new Error("Missing url in streaming redeem response");

      console.log("[IDLIX Client] Scraping success, streamUrl:", streamUrl);
      return [{
        url: streamUrl,
        quality: "Auto",
        provider: "idlix",
        type: "hls",
      }];
    } catch (e) {
      console.warn("[IDLIX Client] getIdlixSources failed:", e);
      return [];
    }
  }

  static getBestSource(
    sources: AnimeSource[],
    preferredRes: string = "720p",
  ): AnimeSource | null {
    return getBestSource(sources, preferredRes);
  }
}
