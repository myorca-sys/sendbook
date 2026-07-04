import { Hono } from "hono";
import { getDb } from "../db/db";
import { sql } from "drizzle-orm";

const app = new Hono<{
  Bindings: { AI: any; HYPERDRIVE: any; DATABASE_URL: string };
}>();

// Middleware to verify admin key
app.use("*", async (c, next) => {
  const key = c.req.header("x-admin-key");
  // Simple validation for now, adjust based on actual logic
  if (!key || key.length < 5) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }
  await next();
});

app.post("/resolve-mapping/:anilistId", async (c) => {
  try {
    const anilistId = parseInt(c.req.param("anilistId"));
    const body = await c.req.json();
    const targetProvider = body.provider || "kuronime";
    const db = getDb(c.env);

    // 1. Dapatkan judul asli dari database
    const metaRes = await db.execute(
      sql`SELECT m.title_romaji as "cleanTitle", m.title_native as "nativeTitle" FROM media_metadata m JOIN media_external_ids e ON m.id = e.media_id WHERE e.anilist_id = ${anilistId}`,
    );
    if (!metaRes || metaRes.length === 0) {
      return c.json({ success: false, error: "Anime tidak ditemukan di database" }, 404);
    }
    const cleanTitle = metaRes[0].cleanTitle || metaRes[0].nativeTitle;

    // 2. Tanya Cloudflare AI (LLaMA) untuk meramal slug
    const prompt = `You are a database reconciliation bot for an Indonesian anime streaming site called '${targetProvider}'.
The official AniList English/Romaji title of the anime is: "${cleanTitle}".
Your task is to guess the exact URL slug used by this website. 
Rules:
1. Slugs usually strip punctuation, lowercased, and replace spaces with hyphens.
2. Indonesian sites often append "-sub-indo" or seasons like "-s2" or "-season-2".
3. ONLY RETURN A JSON OBJECT WITH ONE KEY "slug" containing your best guess. No markdown formatting, no explanations. Example: {"slug": "shingeki-no-kyojin-s4"}`;

    const aiRes = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Guess the slug for: ${cleanTitle}` },
      ],
    });

    // 3. Parsing output LLM (menangani kemungkinan formatting markdown kotor dari LLaMA)
    let predictedSlug = "";
    try {
      const responseText = aiRes.response.trim();
      const jsonStr = responseText
        .replace(/^```json/g, "")
        .replace(/^```/g, "")
        .replace(/```$/g, "")
        .trim();
      const parsed = JSON.parse(jsonStr);
      predictedSlug = parsed.slug;
    } catch (parseError) {
      return c.json({
        success: false,
        error: "Gagal mem-parsing balasan AI",
        raw_ai_response: aiRes.response,
      });
    }

    if (!predictedSlug) {
      return c.json({ success: false, error: "AI mengembalikan slug kosong" });
    }

    // 4. Update tabel mapping dengan slug tebakan AI
    await db.execute(sql`
      INSERT INTO media_mappings (media_id, provider_id, provider_content_id, created_at)
      SELECT e.media_id, ${targetProvider}, ${predictedSlug}, NOW()
      FROM media_external_ids e WHERE e.anilist_id = ${anilistId}
      ON CONFLICT (media_id, provider_id, provider_content_id) DO NOTHING
    `);

    return c.json({
      success: true,
      message: `AI berhasil memetakan judul "${cleanTitle}" ke slug "${predictedSlug}" untuk provider ${targetProvider}`,
      slug: predictedSlug,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

app.get("/analytics", async (c) => {
  try {
    const db = getDb(c.env);

    const [viewsRes, likesRes, commentsRes, usersRes] = await Promise.all([
      db.execute(sql`SELECT COUNT(*) as count FROM watch_sessions`),
      db.execute(sql`SELECT COUNT(*) as count FROM episode_likes`),
      db.execute(sql`SELECT COUNT(*) as count FROM comments`),
      db.execute(sql`SELECT COUNT(DISTINCT user_id) as count FROM watch_sessions`),
    ]);

    const real_views = Number(viewsRes[0]?.count || 0);
    const real_likes = Number(likesRes[0]?.count || 0);
    const real_comments = Number(commentsRes[0]?.count || 0);
    const real_users = Number(usersRes[0]?.count || 0);

    const topAnimeRes = await db.execute(sql`
      SELECT a.title_romaji as title, e.anilist_id as "anilistId", COUNT(w.session_id) as real_views
      FROM watch_sessions w
      JOIN media_metadata a ON w.media_id = a.id
      JOIN media_external_ids e ON a.id = e.media_id
      GROUP BY e.anilist_id, a.title_romaji
      ORDER BY real_views DESC
      LIMIT 5
    `);

    const top_real_anime = topAnimeRes.map((r: any) => ({
      title: String(r.title),
      anilistId: Number(r.anilistId),
      real_views: Number(r.real_views),
    }));

    const trendRes = await db.execute(sql`
      SELECT TO_CHAR(started_at, 'YYYY-MM-DD') as date_str, COUNT(*) as view_count
      FROM watch_sessions
      WHERE started_at >= NOW() - INTERVAL '7 days'
      GROUP BY TO_CHAR(started_at, 'YYYY-MM-DD')
      ORDER BY date_str ASC
    `);

    const views_trend = trendRes.map((r: any) => ({
      date: String(r.date_str),
      count: Number(r.view_count),
    }));

    return c.json({
      success: true,
      real_views,
      real_likes,
      real_comments,
      real_users,
      top_real_anime,
      views_trend,
    });
  } catch (error: any) {
    console.error("Analytics Error:", error);
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
        sql`SELECT 0 as count`, // Removed 'episodes' table dependency
      ),
    ]);

    const total_anime = Number(animeRes[0]?.count || 0);
    const total_episodes = Number(epRes[0]?.count || 0);
    const ingested_episodes = Number(ingestedRes[0]?.count || 0);
    const pending_episodes = Number(pendingRes[0]?.count || 0);

    const recentRes = await db.execute(sql`
      SELECT e.anilist_id as "anilistId", m.title_romaji as title, m.cover_image as cover
      FROM media_metadata m
      JOIN media_external_ids e ON m.id = e.media_id
      WHERE m.media_type = 'ANIME'
      ORDER BY m.updated_at DESC
      LIMIT 10
    `);

    const recent_anime = recentRes.map((r: any) => ({
      anilistId: Number(r.anilistId),
      title: String(r.title),
      cover: String(r.cover),
    }));

    // QStash stats logic ported from Python
    const [activeJobsRes, deliveredRes, failedRes] = await Promise.all([
      db.execute(
        sql`SELECT COUNT(*) as count FROM media_content WHERE content_type = 'EPISODE' AND created_at >= NOW() - INTERVAL '1 hour'`,
      ),
      db.execute(sql`SELECT 0 as count`),
      db.execute(sql`SELECT 0 as count`),
    ]);

    const activeListRes = await db.execute(sql`
      SELECT ex.anilist_id as "anilistId", m.title_romaji as title, c.number as "episodeNumber", c.created_at as "updatedAt"
      FROM media_content c
      JOIN media_metadata m ON c.media_id = m.id
      JOIN media_external_ids ex ON m.id = ex.media_id
      WHERE c.content_type = 'EPISODE' AND c.created_at >= NOW() - INTERVAL '1 hour'
      ORDER BY c.created_at DESC LIMIT 20
    `);

    const failedListRes = await db.execute(sql`
      SELECT e."anilistId", a.title_romaji as title, e."episodeNumber", e.health_status, e.url as source_url
      FROM episode_sources e
      JOIN media_external_ids ex ON e."anilistId" = ex.anilist_id
      JOIN media_metadata a ON ex.media_id = a.id
      WHERE e.health_status = 'DEAD'
      ORDER BY e."createdAt" DESC LIMIT 20
    `);

    // Provider Health Data (Using episode_sources aggregated data as a live health check)
    // This is much faster and more accurate than doing an HTTP HEAD request inside the edge worker
    const providerHealthRes = await db.execute(sql`
      SELECT source as "providerId", 
             COUNT(id) as total_links,
             SUM(CASE WHEN health_status = 'ALIVE' THEN 1 ELSE 0 END) as alive_links,
             SUM(CASE WHEN health_status = 'DEAD' THEN 1 ELSE 0 END) as dead_links
      FROM (
        SELECT id, health_status, 
               CASE 
                 WHEN url LIKE '%kuronime%' THEN 'Kuronime'
                 WHEN url LIKE '%samehadaku%' THEN 'Samehadaku'
                 WHEN url LIKE '%otakudesu%' THEN 'Otakudesu'
                 WHEN url LIKE '%oploverz%' THEN 'Oploverz'
                 WHEN url LIKE '%doronime%' THEN 'Doronime'
                 ELSE 'Other Scrapers'
               END as source
        FROM episode_sources
      ) subq
      GROUP BY source
      ORDER BY total_links DESC
    `);

    const providers = providerHealthRes.map((r: any) => {
      const total = Number(r.total_links) || 1;
      const alive = Number(r.alive_links) || 0;
      const dead = Number(r.dead_links) || 0;
      const healthPercentage = (alive / total) * 100;
      return {
        name: String(r.providerId),
        status: healthPercentage > 50 ? "healthy" : "degraded",
        success_rate: healthPercentage.toFixed(1),
        url: `https://${r.providerId}.com`, // Placeholder, you'd ideally have this mapped in a config
        total_links: total,
        alive_links: alive,
        dead_links: dead,
      };
    });

    return c.json({
      success: true,
      total_anime,
      total_episodes,
      ingested_episodes,
      pending_episodes,
      recent_anime,
      providers: providers,
      queue_stats: {
        active: Number(activeJobsRes[0]?.count || 0),
        delivered: Number(deliveredRes[0]?.count || 0),
        failed: Number(failedRes[0]?.count || 0),
        active_list: activeListRes.map((r: any) => ({
          ...r,
          anilistId: Number(r.anilistId),
        })),
        failed_list: failedListRes,
      },
    });
  } catch (error: any) {
    console.error("Stats Error:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/triage", async (c) => {
  try {
    const db = getDb(c.env);

    const orphanRes = await db.execute(sql`
      SELECT ex.anilist_id as "anilistId", m.title_romaji as title, m.cover_image as cover
      FROM media_metadata m
      JOIN media_external_ids ex ON m.id = ex.media_id
      LEFT JOIN media_content c ON m.id = c.media_id AND c.content_type = 'EPISODE'
      WHERE m.media_type = 'ANIME'
      GROUP BY ex.anilist_id, m.title_romaji, m.cover_image
      HAVING COUNT(c.id) = 0
      LIMIT 50
    `);

    const deadRes = await db.execute(sql`
      SELECT s."anilistId", m.title_romaji as title, s."episodeNumber", COUNT(s.id) as total_sources,
             SUM(CASE WHEN s.health_status = 'DEAD' THEN 1 ELSE 0 END) as dead_sources
      FROM episode_sources s
      JOIN media_external_ids ex ON s."anilistId" = ex.anilist_id
      JOIN media_metadata m ON ex.media_id = m.id
      GROUP BY s."anilistId", m.title_romaji, s."episodeNumber"
      HAVING COUNT(s.id) > 0 AND COUNT(s.id) = SUM(CASE WHEN s.health_status = 'DEAD' THEN 1 ELSE 0 END)
      LIMIT 50
    `);

    return c.json({
      success: true,
      orphans: orphanRes.map((r: any) => ({
        ...r,
        anilistId: Number(r.anilistId),
      })),
      dead_episodes: deadRes.map((r: any) => ({
        ...r,
        anilistId: Number(r.anilistId),
        episodeNumber: Number(r.episodeNumber),
      })),
    });
  } catch (error: any) {
    console.error("Triage Error:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/database", async (c) => {
  try {
    const db = getDb(c.env);
    const page = Number(c.req.query("page") || 1);
    const limit = Number(c.req.query("limit") || 100);
    const offset = (page - 1) * limit;

    const dbRes = await db.execute(sql`
      SELECT ex.anilist_id as "anilistId", m.title_romaji as title, m.cover_image as cover, m.release_year as year, m.status,
             (SELECT COUNT(DISTINCT c.number) FROM media_content c WHERE c.media_id = m.id AND c.content_type = 'EPISODE') as episode_count,
             (SELECT MAX(provider_id) FROM media_mappings map WHERE map.media_id = m.id) as "providerId"
      FROM media_metadata m
      JOIN media_external_ids ex ON m.id = ex.media_id
      WHERE m.media_type = 'ANIME'
      ORDER BY m.updated_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    return c.json({
      success: true,
      data: dbRes.map((r: any) => ({
        ...r,
        anilistId: Number(r.anilistId),
        episode_count: Number(r.episode_count),
      })),
    });
  } catch (error: any) {
    console.error("Database Error:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default app;
