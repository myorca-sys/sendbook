import { Hono } from "hono";
import { HistoryService } from "../services/history.service";
import { MediaService } from "../services/media.service";
import { CollectionService } from "../services/collection.service";
import { getDb } from "../db/db";
import { sql } from "drizzle-orm";

const socialRouter = new Hono<{ Bindings: { DATABASE_URL: string } }>();

socialRouter.get("/progress", async (c) => {
  const userId = c.req.query("user_id");
  if (!userId) return c.json({ error: "Missing user_id" }, 400);

  try {
    const rows = await HistoryService.getUserHistory(c.env, userId);
    return c.json(rows);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

socialRouter.post("/progress", async (c) => {
  try {
    const body = await c.req.json();
    await CollectionService.ensureUser(c.env, body.user_id);

    let targetMediaId = null;
    if (body.title && body.coverImage && !isNaN(Number(body.anilistId))) {
      targetMediaId = await MediaService.upsertMetadata(c.env, {
        type: body.mediaType === "manga" ? "MANGA" : "ANIME",
        title: body.title,
        img: body.coverImage,
        anilistId: Number(body.anilistId),
      });
    }

    if (!targetMediaId) {
      return c.json({ error: "Could not resolve media_id for progress" }, 400);
    }

    await HistoryService.syncWatchProgress(c.env, body.user_id, {
      mediaId: targetMediaId,
      episode: body.episodeNumber,
      timestampSec: body.progressSeconds,
      durationSec: body.durationSeconds,
      completed: body.isCompleted,
    });

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

socialRouter.post("/watch-session", async (c) => {
  try {
    const body = await c.req.json();
    let targetMediaId = await MediaService.resolveMediaId(c.env, Number(body.anilistId));

    if (!targetMediaId) {
      return c.json({ error: "Could not resolve media_id for watch session" }, 400);
    }

    await HistoryService.createWatchSession(c.env, {
      sessionId: body.session_id,
      userId: body.user_id,
      mediaId: targetMediaId,
      episodeNumber: body.episodeNumber,
      watchDurationSec: body.watchDurationSec,
      totalDurationSec: body.totalDurationSec,
      completionRate: body.completionRate,
      dropTimestampSec: body.dropTimestampSec,
      qualityWatched: body.qualityWatched,
      providerUsed: body.providerUsed,
    });

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

socialRouter.get("/episode/:id/:episode/stats", async (c) => {
  const anilistIdStr = c.req.param("id");
  const episodeStr = c.req.param("episode");
  const userId = c.req.query("user_id");

  const anilistId = Number(anilistIdStr);
  const episodeNumber = Math.floor(Number(episodeStr));

  if (isNaN(anilistId) || isNaN(episodeNumber)) {
    return c.json({ error: "Invalid anilistId or episodeNumber" }, 400);
  }

  try {
    const db = getDb(c.env);
    
    // Resolve internal media_id first for querying watch_sessions
    const mediaId = await MediaService.resolveMediaId(c.env, anilistId);

    // 1. Get likes count
    const likesRes = await db.execute(sql`
      SELECT COUNT(*) as count FROM episode_likes
      WHERE "anilistId" = ${anilistId} AND "episodeNumber" = ${episodeNumber}
    `);
    const likes = Number(likesRes[0]?.count || 0);

    // 2. Check if user liked
    let user_liked = false;
    if (userId) {
      const userLikedRes = await db.execute(sql`
        SELECT EXISTS(
          SELECT 1 FROM episode_likes
          WHERE user_id = ${userId} AND "anilistId" = ${anilistId} AND "episodeNumber" = ${episodeNumber}
        ) as liked
      `);
      user_liked = Boolean(userLikedRes[0]?.liked || false);
    }

    // 3. Count total episode views from real watch_sessions table
    let total_episode_views = 0;
    if (mediaId) {
      const viewsRes = await db.execute(sql`
        SELECT COUNT(*) as count FROM watch_sessions
        WHERE media_id = ${mediaId} AND episode_number = ${episodeNumber}
      `);
      total_episode_views = Number(viewsRes[0]?.count || 0);
    }

    return c.json({
      likes,
      user_liked,
      total_episode_views,
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

socialRouter.get("/anime/:id/stats", async (c) => {
  const anilistIdStr = c.req.param("id");
  const anilistId = Number(anilistIdStr);

  if (isNaN(anilistId)) {
    return c.json({ error: "Invalid anilistId" }, 400);
  }

  try {
    const db = getDb(c.env);
    const mediaId = await MediaService.resolveMediaId(c.env, anilistId);

    let total_episode_views = 0;
    if (mediaId) {
      const viewsRes = await db.execute(sql`
        SELECT COUNT(*) as count FROM watch_sessions
        WHERE media_id = ${mediaId}
      `);
      total_episode_views = Number(viewsRes[0]?.count || 0);
    }

    return c.json({
      total_episode_views,
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

socialRouter.post("/episode/like", async (c) => {
  try {
    const body = await c.req.json();
    const { user_id, anilistId, episodeNumber } = body;

    if (!user_id || !anilistId || episodeNumber === undefined) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const db = getDb(c.env);
    const parsedAnilistId = Number(anilistId);
    const parsedEpisodeNumber = Math.floor(Number(episodeNumber));

    // Toggle logic: check if exists, then delete, else insert
    const existRes = await db.execute(sql`
      SELECT 1 FROM episode_likes
      WHERE user_id = ${user_id} AND "anilistId" = ${parsedAnilistId} AND "episodeNumber" = ${parsedEpisodeNumber}
    `);

    if (existRes.length > 0) {
      await db.execute(sql`
        DELETE FROM episode_likes
        WHERE user_id = ${user_id} AND "anilistId" = ${parsedAnilistId} AND "episodeNumber" = ${parsedEpisodeNumber}
      `);
    } else {
      await db.execute(sql`
        INSERT INTO episode_likes (user_id, "anilistId", "episodeNumber", created_at)
        VALUES (${user_id}, ${parsedAnilistId}, ${parsedEpisodeNumber}, NOW())
      `);
    }

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

socialRouter.post("/report", async (c) => {
  try {
    const body = await c.req.json();
    const { user_id, anilist_id, episode_number, issue_type, video_url } = body;

    if (!user_id || !anilist_id || episode_number === undefined || !issue_type) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const db = getDb(c.env);
    const parsedAnilistId = Number(anilist_id);
    const parsedEpisodeNumber = Math.floor(Number(episode_number));

    await db.execute(sql`
      INSERT INTO user_reports (user_id, anilist_id, episode_number, issue_type, video_url, status, created_at)
      VALUES (${user_id}, ${parsedAnilistId}, ${parsedEpisodeNumber}, ${issue_type}, ${video_url || null}, 'pending', NOW())
    `);

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default socialRouter;
