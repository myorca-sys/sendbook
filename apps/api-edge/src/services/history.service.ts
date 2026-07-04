import { getDb } from "../db/db";
import { watchHistory, watchSessions, user, mediaMetadata } from "../db/schema";
import { mediaExternalIds } from "../db/polymorphic_schema";
import { sql, eq, desc } from "drizzle-orm";

export class HistoryService {
  static async getUserHistory(env: any, userId: string) {
    const db = getDb(env);
    return await db.execute(sql`
        SELECT w.*,
               ex.anilist_id as "anilistId",
               ex.anilist_id::text as "id",
               ex.anilist_id::text as "animeSlug",
               md.title_main as "cleanTitle",
               md.title_main as "title_romaji",
               md.title_native as "nativeTitle",
               md.cover_image as "coverImage"
        FROM ${watchHistory} w
        LEFT JOIN ${mediaMetadata} md ON w.media_id = md.id
        LEFT JOIN ${mediaExternalIds} ex ON md.id = ex.media_id
        WHERE w."userId" = ${userId}
        ORDER BY w."updatedAt" DESC
    `);
  }

  static async syncWatchProgress(
    env: any,
    userId: string,
    data: {
      mediaId: string;
      episode: number;
      timestampSec?: number;
      durationSec?: number;
      completed?: boolean;
    },
  ) {
    const db = getDb(env);
    return await db
      .insert(watchHistory)
      .values({
        userId,
        mediaId: data.mediaId,
        episode: data.episode,
        timestampSec: data.timestampSec || 0,
        durationSec: data.durationSec || 0,
        completed: data.completed || false,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [watchHistory.userId, watchHistory.mediaId, watchHistory.episode],
        set: {
          timestampSec: data.timestampSec || 0,
          durationSec: data.durationSec || 0,
          completed: data.completed || false,
          updatedAt: new Date(),
        },
      });
  }

  static async createWatchSession(
    env: any,
    data: {
      sessionId: string;
      userId: string;
      mediaId: string;
      episodeNumber: number;
      watchDurationSec?: number;
      totalDurationSec?: number;
      completionRate?: number;
      dropTimestampSec?: number;
      qualityWatched?: string;
      providerUsed?: string;
    },
  ) {
    const db = getDb(env);
    return await db.execute(sql`
      INSERT INTO ${watchSessions} (session_id, user_id, media_id, episode_number, started_at, ended_at, watch_duration_sec, total_duration_sec, completion_rate, drop_timestamp_sec, quality_watched, provider_used)
      VALUES (${data.sessionId}, ${data.userId}, ${data.mediaId}, ${data.episodeNumber}, NOW(), NOW(), ${data.watchDurationSec || 0}, ${data.totalDurationSec || 0}, ${data.completionRate || 0}, ${data.dropTimestampSec || 0}, ${data.qualityWatched || "Auto"}, ${data.providerUsed || ""})
      ON CONFLICT (session_id) 
      DO UPDATE SET ended_at = NOW(), watch_duration_sec = EXCLUDED.watch_duration_sec, completion_rate = EXCLUDED.completion_rate, drop_timestamp_sec = EXCLUDED.drop_timestamp_sec
    `);
  }
}
