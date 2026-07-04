import { Hono } from "hono";
import { Redis } from "@upstash/redis/cloudflare";
import adminRouter from "./admin";
import collectionRouter from "./collection";
import socialRouter from "./social";
import { MediaService } from "../services/media.service";
import { getDb } from "../db/db";
import { sql } from "drizzle-orm";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    RUST_API_URL: string;
    SCRAPER_RULES_KV: any;
  };
}>();

app.route("/admin", adminRouter);
app.route("/collection", collectionRouter);
app.route("/social", socialRouter);

app.get("/config/app", async (c) => {
  try {
    if (!c.env.SCRAPER_RULES_KV) {
      return c.json({ success: false, error: "KV not bound" }, 500);
    }
    const [samehadaku, kuronime] = await Promise.all([
      c.env.SCRAPER_RULES_KV.get("rule_samehadaku"),
      c.env.SCRAPER_RULES_KV.get("rule_kuronime"),
    ]);

    const rules: Record<string, any> = {};
    if (samehadaku) {
      const parsed = JSON.parse(samehadaku);
      parsed.pipeline = [
        {
          step: "fetch_html",
          url: "{{target_url}}",
          output: "html"
        },
        {
          step: "dom_iterate",
          input: "{{html}}",
          selector: ".east_player_option",
          limit: 10,
          extract: {
            label: "span",
            data_post: "@data-post",
            data_nume: "@data-nume",
            data_type: "@data-type"
          },
          output: "sources"
        }
      ];
      rules.samehadaku = parsed;
    }
    if (kuronime) {
      const parsed = JSON.parse(kuronime);
      parsed.pipeline = [
        {
          step: "fetch_html",
          url: "{{target_url}}",
          output: "html"
        },
        {
          step: "extract_regex",
          input: "{{html}}",
          pattern: "var\\s+_0x[a-zA-Z0-9]+\\s*=\\s*[\"']([A-Za-z0-9+/=]{20,})[\"']",
          output: "req_id"
        },
        {
          step: "map_sources",
          input: "req_id://{{req_id}}//"
        }
      ];
      rules.kuronime = parsed;
    }

    return c.json({
      success: true,
      scraper_rules: rules,
    });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

app.get("/anime/:id", async (c) => {
  const id = c.req.param("id");
  const redis = new Redis({
    url: c.env.UPSTASH_REDIS_REST_URL,
    token: c.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const cacheKey = `anime:v2:${id}`;
  const cached = await redis.get(cacheKey);
  if (cached) return c.json({ success: true, data: cached, source: "cache" });

  try {
    const anime = await MediaService.getMediaByAnilistId(c.env, parseInt(id), "ANIME");
    if (!anime) return c.json({ success: false, error: "Anime not found" }, 404);

    const episodes = await MediaService.getMediaContent(c.env, anime.id as string, "EPISODE");

    // Hitung max episode number sebagai totalEpisodes (resilient terhadap episode bolong)
    const maxEpNum = episodes.reduce((max: number, ep: any) => {
      const num = parseFloat(ep.episodeNumber);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    (anime as any).totalEpisodes = maxEpNum || null;

    // Virtual Self-Healing Gaps
    if (maxEpNum > 0) {
      const db = getDb(c.env);
      const mappings = await db.execute(sql`
        SELECT provider_id as "providerId", provider_content_id as "providerSlug"
        FROM media_mappings
        WHERE media_id = ${anime.id as string}
      `);
      
      const samehadakuSlug = mappings.find((m: any) => m.providerId === "samehadaku")?.providerSlug;
      const kuronimeSlug = mappings.find((m: any) => m.providerId === "kuronime")?.providerSlug;

      const existingNumbers = new Set(episodes.map((ep: any) => Math.floor(parseFloat(ep.episodeNumber))));
      const virtualEpisodes: any[] = [];

      for (let i = 1; i <= maxEpNum; i++) {
        if (!existingNumbers.has(i)) {
          let episodeUrl = "";
          if (samehadakuSlug) {
            episodeUrl = `https://v2.samehadaku.how/${samehadakuSlug}-episode-${i}/`;
          } else if (kuronimeSlug) {
            episodeUrl = `https://kuronime.sbs/${kuronimeSlug}-episode-${i}-sub-indo/`;
          } else {
            episodeUrl = `virtual://sync/${id}/${i}`;
          }

          virtualEpisodes.push({
            episodeNumber: String(i),
            episodeTitle: `Episode ${i}`,
            episodeUrl: episodeUrl,
            thumbnailUrl: null,
            isVirtual: true
          });
        }
      }

      if (virtualEpisodes.length > 0) {
        episodes.push(...virtualEpisodes);
        episodes.sort((a: any, b: any) => parseFloat(b.episodeNumber) - parseFloat(a.episodeNumber));
      }
    }

    (anime as any).episodes = episodes;

    await redis.set(cacheKey, JSON.stringify(anime), { ex: 3600 });
    return c.json({ success: true, data: anime, source: "db" });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/manga/:id", async (c) => {
  const id = c.req.param("id");
  const redis = new Redis({
    url: c.env.UPSTASH_REDIS_REST_URL,
    token: c.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const cacheKey = `manga:v2:${id}`;
  const cached = await redis.get(cacheKey);
  if (cached) return c.json({ success: true, data: cached, source: "cache" });

  try {
    const manga = await MediaService.getMediaByAnilistId(c.env, parseInt(id), "MANGA");
    if (!manga) return c.json({ success: false, error: "Manga not found" }, 404);

    const chapters = await MediaService.getMediaContent(c.env, manga.id as string, "CHAPTER");
    (manga as any).episodes = chapters;

    // Hitung max chapter number sebagai totalEpisodes (resilient terhadap chapter bolong)
    const maxChNum = chapters.reduce((max: number, ch: any) => {
      const num = parseFloat(ch.chapterNumber);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    (manga as any).totalEpisodes = maxChNum || null;

    await redis.set(cacheKey, JSON.stringify(manga), { ex: 3600 });
    return c.json({ success: true, data: manga, source: "db" });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/internal/sync/:id", async (c) => {
  const id = c.req.param("id");
  const rustApiUrl = c.env.RUST_API_URL || "https://orcanime-orcanime-api-rust.hf.space";
  try {
    const res = await fetch(`${rustApiUrl}/api/v1/internal/sync/${id}`, {
      method: "POST"
    });
    const data: any = await res.json();

    if (data && data.success) {
      try {
        const redis = new Redis({
          url: c.env.UPSTASH_REDIS_REST_URL,
          token: c.env.UPSTASH_REDIS_REST_TOKEN,
        });
        const cacheKey = `anime:v2:${id}`;
        await redis.del(cacheKey);
        console.log(`[Redis Sweeper] Cache cleared for key: ${cacheKey}`);
      } catch (redisErr) {
        console.error("[Redis Sweeper] Failed to invalidate cache:", redisErr);
      }
    }

    return c.json(data);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/stats", async (c) => {
  try {
    const db = getDb(c.env);

    const [animeRes, epRes, ingestedRes, pendingRes] = await Promise.all([
      db.execute(sql`SELECT COUNT(*) as count FROM media_metadata WHERE media_type = 'ANIME'`),
      db.execute(sql`SELECT COUNT(*) as count FROM media_content WHERE content_type = 'EPISODE'`),
      db.execute(
        sql`SELECT COUNT(DISTINCT media_id) as count FROM media_content`,
      ),
      db.execute(
        sql`SELECT 0 as count`,
      ),
    ]);

    const total_anime = Number(animeRes[0]?.count || 0);
    const total_episodes = Number(epRes[0]?.count || 0);
    const ingested_episodes = Number(ingestedRes[0]?.count || 0);
    const pending_episodes = Number(pendingRes[0]?.count || 0);

    const recentRes = await db.execute(sql`
      SELECT e.anilist_id as "anilistId", m.title_main as title, m.cover_image as cover
      FROM media_metadata m
      JOIN media_external_ids e ON m.id = e.media_id
      WHERE m.media_type = 'ANIME'
      ORDER BY m.updated_at DESC
      LIMIT 10
    `);

    const recent = recentRes.map((r: any) => ({
      anilistId: r.anilistId,
      title: r.title,
      cover: r.cover,
    }));

    return c.json({
      success: true,
      stats: {
        total_anime,
        total_episodes,
        ingested_episodes,
        pending_episodes,
      },
      recent,
    });
  } catch (error: any) {
    console.error("Stats Error:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.all("/*", async (c) => {
  try {
    const rustApiUrl = c.env.RUST_API_URL || "https://orcanime-orcanime-api-rust.hf.space";
    const url = new URL(c.req.url);
    const path = c.req.path.replace("/api/v2", "");
    
    let targetPath = `/api/v1${path}`;
    if (path.startsWith("/home")) {
      targetPath = "/api/v1/home";
    } else if (path.startsWith("/schedule")) {
      targetPath = "/api/v1/schedule";
    } else if (path.startsWith("/browse")) {
      targetPath = "/api/v1/browse";
    } else if (path.startsWith("/manga/home")) {
      targetPath = "/api/v1/manga/home";
    } else if (path.startsWith("/manga/browse")) {
      targetPath = "/api/v1/manga/browse";
    }

    const targetUrl = new URL(`${rustApiUrl}${targetPath}${url.search}`);
    const headers = new Headers(c.req.raw.headers);
    headers.set("host", targetUrl.host);

    const init: RequestInit = {
      method: c.req.method,
      headers,
      redirect: "manual",
    };

    if (c.req.method !== "GET" && c.req.method !== "HEAD") {
      init.body = await c.req.raw.arrayBuffer();
    }

    const response = await fetch(targetUrl.toString(), init);
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("[API Proxy Error]", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default app;
