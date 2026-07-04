import { Hono } from "hono";
import { getDb } from "../db/db";
import { sql } from "drizzle-orm";
import { MediaService } from "../services/media.service";

type Bindings = {
  SCRAPER_RULES_KV: any;
  PROXY_WORKER_URL?: string;
  PROXY_SECRET?: string;
  PROXY_WORKER?: any;
  DATABASE_URL: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
};

const scheduleRouter = new Hono<{ Bindings: Bindings }>();

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"] as const;
const CACHE_KEY = "kuronime_schedule_v2"; // cache key v2 untuk data mapping baru
const CACHE_TTL = 60 * 60; // 1 jam

async function searchAnilist(title: string): Promise<any> {
  const query = `
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        id
        title {
          romaji
          english
          userPreferred
          native
        }
        coverImage {
          extraLarge
          large
        }
        averageScore
      }
    }
  `;
  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ query, variables: { search: title } }),
    });
    if (res.ok) {
      const json: any = await res.json();
      return json?.data?.Media || null;
    }
  } catch (err) {
    console.error(`[Anilist Search] Failed for ${title}:`, err);
  }
  return null;
}

scheduleRouter.get("/", async (c) => {
  const bypassCache = c.req.query("bypass_cache") === "true";
  
  // 1. Cek KV cache dulu
  if (!bypassCache) {
    try {
      const cached = await c.env.SCRAPER_RULES_KV.get(CACHE_KEY);
      if (cached) {
        return c.json({ success: true, source: "cache", data: JSON.parse(cached) });
      }
    } catch (_) {}
  }

  const proxyUrl =
    c.env.PROXY_WORKER_URL ||
    "https://scraper-proxy-swarm.moehamadhkl.workers.dev";
  const proxySecret = c.env.PROXY_SECRET || "anime-pro-secure-2026";
  const targetUrl = "https://kuronime.sbs/jadwal-rilis/";

  // 2. Fetch HTML via scraper proxy
  let html = "";
  let fetchError = "";
  let fetchStatus = 0;
  try {
    let res: Response;
    if (c.env.PROXY_WORKER) {
      res = await c.env.PROXY_WORKER.fetch(
        `http://localhost/?url=${encodeURIComponent(targetUrl)}`,
        {
          headers: {
            "x-proxy-key": proxySecret,
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        }
      );
    } else {
      res = await fetch(
        `${proxyUrl.replace(/\/$/, "")}/?url=${encodeURIComponent(targetUrl)}`,
        {
          headers: {
            "x-proxy-key": proxySecret,
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        }
      );
    }
    fetchStatus = res.status;
    if (res.ok) {
      html = await res.text();
    } else {
      fetchError = `Status: ${res.status} ${res.statusText}`;
    }
  } catch (err: any) {
    fetchError = err.message;
    console.error("[Schedule] Proxy fetch failed:", err.message);
  }

  const schedule: Record<string, any[]> = {};
  for (const d of DAYS) schedule[d] = [];

  let parsedAny = false;

  // 3. Database lookup helpers
  let db: any = null;
  let dbError = "";
  const mappingLookup = new Map<string, { mediaId: string; anilistId: number; score: number; coverImage: string }>();
  const titleLookup = new Map<string, { mediaId: string; anilistId: number; score: number; coverImage: string }>();

  if (html && !html.includes("Just a moment")) {
    try {
      db = getDb(c.env as any);
      
      // Load mappings
      const mappingsResult = await db.execute(sql`
        SELECT map.provider_content_id as slug, map.media_id as media_id, ex.anilist_id as anilist_id, m.rating as score, m.cover_image as cover_image
        FROM media_mappings map
        JOIN media_external_ids ex ON map.media_id = ex.media_id
        JOIN media_metadata m ON map.media_id = m.id
        WHERE map.provider_id = 'kuronime'
      `);
      if (Array.isArray(mappingsResult)) {
        for (const row of mappingsResult) {
          const slug = String(row.slug || "");
          if (slug) {
            mappingLookup.set(slug, {
              mediaId: String(row.media_id || ""),
              anilistId: Number(row.anilist_id || 0),
              score: Number(row.score || 0),
              coverImage: String(row.cover_image || ""),
            });
          }
        }
      }

      // Load releasing titles fallback
      const releasingResult = await db.execute(sql`
        SELECT ex.anilist_id as anilist_id, m.id as media_id, m.title_main as clean_title, m.title_native as native_title, m.rating as score, m.cover_image as cover_image
        FROM media_metadata m
        JOIN media_external_ids ex ON m.id = ex.media_id
        WHERE m.media_type = 'ANIME' AND m.status = 'RELEASING'
      `);
      if (Array.isArray(releasingResult)) {
        for (const row of releasingResult) {
          const payload = {
            mediaId: String(row.media_id || ""),
            anilistId: Number(row.anilist_id || 0),
            score: Number(row.score || 0),
            coverImage: String(row.cover_image || ""),
          };
          const cleanTitle = String(row.clean_title || "").toLowerCase();
          if (cleanTitle) titleLookup.set(cleanTitle, payload);
          const nativeTitle = String(row.native_title || "").toLowerCase();
          if (nativeTitle) titleLookup.set(nativeTitle, payload);
        }
      }
    } catch (dbErr: any) {
      dbError = dbErr.message;
      console.error("[Schedule] DB initialization/lookup failed:", dbErr.message);
    }

    // 4. Parse HTML dengan regex
    const bixboxBlocks = html.split(/<div[^>]+class="bixbox[^"]*"/).slice(1);

    for (const block of bixboxBlocks) {
      const dayMatch = block.match(/<span[^>]*>(Senin|Selasa|Rabu|Kamis|Jum\S*|Sabtu|Minggu)<\/span>/i);
      if (!dayMatch) continue;

      let dayName = dayMatch[1].trim();
      if (/jum/i.test(dayName)) dayName = "Jumat";

      if (!(DAYS as readonly string[]).includes(dayName)) continue;

      const bsBlocks = block.split('<div class="bs"').slice(1);
      const items: any[] = [];

      for (const bs of bsBlocks) {
        // href / slug
        const hrefMatch = bs.match(/href="[^"]*\/anime\/([^/"]+)/);
        const slug = hrefMatch ? hrefMatch[1].replace(/\/$/, "") : "";

        // title
        const ttMatch = bs.match(/<h2 class="tt"[^>]*>([^<]+)<\/h2>/) ||
          bs.match(/<h3 class="tt"[^>]*>([^<]+)<\/h3>/) ||
          bs.match(/<[^>]+ class="tt"[^>]*>([^<]+)<\//);
        const title = ttMatch ? ttMatch[1].trim() : slug.replace(/-/g, " ");

        // image
        const imgMatch = bs.match(/(?:data-src|src)="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
        const img = imgMatch ? imgMatch[1] : "";

        // airing time
        const timeMatch = bs.match(/class="[^"]*epx[^"]*cndwn[^"]*"[^>]*>([^<]+)<\//);
        const airingTime = timeMatch ? timeMatch[1].trim() : "TBA";

        // episode number
        const epMatch = bs.match(/class="[^"]*sb[^"]*Sub[^"]*"[^>]*>([^<]+)<\//);
        const latestEpisode = epMatch ? parseFloat(epMatch[1]) : null;

        let matchedId: string = slug;
        let matchedScore = 0;
        let matchedImg = img;
        let dbMediaId: string | null = null;

        // 4.1. Match by slug
        if (slug && mappingLookup.has(slug)) {
          const m = mappingLookup.get(slug)!;
          matchedId = String(m.anilistId);
          matchedScore = m.score;
          matchedImg = m.coverImage || img;
          dbMediaId = m.mediaId;
        } 
        // 4.2. Match by title fallback
        else if (title && titleLookup.has(title.toLowerCase())) {
          const t = titleLookup.get(title.toLowerCase())!;
          matchedId = String(t.anilistId);
          matchedScore = t.score;
          matchedImg = t.coverImage || img;
          dbMediaId = t.mediaId;
        }
        // 4.3. Auto-Map & Import from Anilist
        else if (db && slug) {
          console.log(`[Auto Map] Unmapped slug: ${slug}, title: ${title}. Searching Anilist...`);
          const media = await searchAnilist(title);
          if (media) {
            try {
              const anilistId = Number(media.id);
              const formattedTitle = media.title.romaji || media.title.english || title;
              const coverImg = media.coverImage.extraLarge || media.coverImage.large || img;

              // Insert to DB
              const mediaId = await MediaService.upsertMetadata(c.env, {
                type: "ANIME",
                title: formattedTitle,
                img: coverImg,
                anilistId,
              });

              if (mediaId) {
                // Insert mapping
                await db.execute(sql`
                  INSERT INTO media_mappings (media_id, provider_id, provider_content_id)
                  VALUES (${mediaId}, 'kuronime', ${slug})
                  ON CONFLICT DO NOTHING
                `);

                dbMediaId = mediaId;
                matchedId = String(anilistId);
                matchedScore = Number(media.averageScore || 0);
                matchedImg = coverImg;

                // Cache it locally so subsequent items in current request can use it
                const payload = { mediaId, anilistId, score: matchedScore, coverImage: matchedImg };
                mappingLookup.set(slug, payload);
                titleLookup.set(title.toLowerCase(), payload);
                titleLookup.set(formattedTitle.toLowerCase(), payload);

                console.log(`[Auto Map] Imported & mapped successfully: ${title} -> Anilist ${anilistId}`);
              }
            } catch (importErr: any) {
              console.error(`[Auto Map] Failed importing metadata for ${title}:`, importErr.message);
            }
          }
        }

        // 4.4. Auto Ingest Episode to media_content
        if (db && dbMediaId && latestEpisode) {
          const formattedEpTitle = `${title} Episode ${latestEpisode}`;
          const epUrl = `https://kuronime.sbs/${slug}-episode-${latestEpisode}-sub-indo/`;
          try {
            await db.execute(sql`
              INSERT INTO media_content (media_id, provider_id, content_type, number, title, url, created_at)
              VALUES (${dbMediaId}, 'kuronime', 'EPISODE', ${latestEpisode}, ${formattedEpTitle}, ${epUrl}, NOW())
              ON CONFLICT (media_id, provider_id, content_type, number)
              DO UPDATE SET url = EXCLUDED.url, title = EXCLUDED.title, created_at = NOW()
            `);
          } catch (epErr: any) {
            console.error(`[Auto Ingest Episode] Failed for ${slug} Ep ${latestEpisode}:`, epErr.message);
          }
        }

        const idHash = matchedId.split("-").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const finalViews = (idHash % 900 + 100) * 12 * 7 / 10;

        if (slug || title) {
          items.push({
            id: matchedId,
            title,
            img: matchedImg,
            airingTime,
            latestEpisode,
            score: matchedScore,
            views: finalViews,
          });
        }
      }

      if (items.length > 0) {
        schedule[dayName].push(...items);
        parsedAny = true;
      }
    }
  }

  // 5. Simpan ke KV Cache jika sukses
  if (parsedAny) {
    try {
      await c.env.SCRAPER_RULES_KV.put(CACHE_KEY, JSON.stringify(schedule), {
        expirationTtl: CACHE_TTL,
      });
    } catch (_) {}
  }

  const isDebug = c.req.query("debug") === "true";

  return c.json({
    success: true,
    source: parsedAny ? "live" : "empty",
    ...(isDebug ? {
      debug: {
        proxyUrl,
        fetchStatus,
        fetchError,
        dbError,
        htmlLength: html.length,
        htmlPreview: html ? html.slice(0, 500) : "",
      }
    } : {}),
    data: schedule,
  });
});

export default scheduleRouter;
