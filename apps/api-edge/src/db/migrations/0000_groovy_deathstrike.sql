CREATE TYPE "public"."content_type" AS ENUM('EPISODE', 'CHAPTER', 'MOVIE_FILE');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('ANIME', 'MANGA', 'LIVE_ACTION', 'MOVIE');--> statement-breakpoint
CREATE TYPE "public"."relation_type" AS ENUM('ADAPTATION', 'PREQUEL', 'SEQUEL', 'SPIN_OFF');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_feed" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"event_type" text NOT NULL,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"media_id" text NOT NULL,
	"status" text DEFAULT 'plan_to_watch' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "collections_userId_media_id_unique" UNIQUE("userId","media_id")
);
--> statement-breakpoint
CREATE TABLE "comment_reactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"emoji" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "comment_reactions_comment_id_user_id_emoji_unique" UNIQUE("comment_id","user_id","emoji")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"media_id" text NOT NULL,
	"episodeNumber" integer NOT NULL,
	"parent_id" integer,
	"text" text NOT NULL,
	"timestamp_sec" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "episode_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"anilistId" integer NOT NULL,
	"episodeNumber" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "episode_likes_user_id_anilistId_episodeNumber_unique" UNIQUE("user_id","anilistId","episodeNumber")
);
--> statement-breakpoint
CREATE TABLE "search_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"query" text NOT NULL,
	"results_count" integer NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_progression" (
	"user_id" text PRIMARY KEY NOT NULL,
	"level" integer DEFAULT 1,
	"total_exp" integer DEFAULT 0,
	"total_episodes_watched" integer DEFAULT 0 NOT NULL,
	"current_title_id" integer,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"anilist_id" integer NOT NULL,
	"episode_number" integer NOT NULL,
	"issue_type" text NOT NULL,
	"player_error" text,
	"video_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_reputation" (
	"user_id" text PRIMARY KEY NOT NULL,
	"score" integer DEFAULT 0,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "watch_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"media_id" text NOT NULL,
	"episode" integer NOT NULL,
	"timestampSec" integer DEFAULT 0 NOT NULL,
	"durationSec" integer DEFAULT 0 NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "watch_history_userId_media_id_episode_unique" UNIQUE("userId","media_id","episode")
);
--> statement-breakpoint
CREATE TABLE "watch_sessions" (
	"session_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"media_id" text NOT NULL,
	"episode_number" integer NOT NULL,
	"started_at" timestamp NOT NULL,
	"ended_at" timestamp NOT NULL,
	"watch_duration_sec" integer DEFAULT 0,
	"total_duration_sec" integer DEFAULT 0,
	"completion_rate" integer DEFAULT 0,
	"drop_timestamp_sec" integer DEFAULT 0,
	"quality_watched" text DEFAULT 'Auto',
	"provider_used" text
);
--> statement-breakpoint
CREATE TABLE "media_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"media_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"content_type" "content_type" NOT NULL,
	"season_number" integer,
	"number" integer NOT NULL,
	"title" text,
	"description" text,
	"thumbnail" text,
	"url" text,
	"release_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "media_content_unq_provider" UNIQUE("media_id","provider_id","content_type","number")
);
--> statement-breakpoint
CREATE TABLE "media_external_ids" (
	"id" serial PRIMARY KEY NOT NULL,
	"media_id" text NOT NULL,
	"anilist_id" integer,
	"mal_id" integer,
	"tmdb_id" integer,
	"imdb_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_mappings" (
	"id" serial PRIMARY KEY NOT NULL,
	"media_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"provider_content_id" text NOT NULL,
	"url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "media_mappings_media_id_provider_id_provider_content_id_unique" UNIQUE("media_id","provider_id","provider_content_id")
);
--> statement-breakpoint
CREATE TABLE "media_metadata" (
	"id" text PRIMARY KEY NOT NULL,
	"media_type" "media_type" NOT NULL,
	"title_main" text NOT NULL,
	"title_english" text,
	"title_native" text,
	"description" text,
	"genres" text[],
	"runtime_minutes" integer,
	"trailer_url" text,
	"cover_image" text,
	"banner_image" text,
	"status" text,
	"release_year" integer,
	"rating" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_relations" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" text NOT NULL,
	"target_id" text NOT NULL,
	"relation_type" "relation_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "media_relations_source_id_target_id_relation_type_unique" UNIQUE("source_id","target_id","relation_type")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_feed" ADD CONSTRAINT "activity_feed_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_media_id_media_metadata_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_media_id_media_metadata_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "episode_likes" ADD CONSTRAINT "episode_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progression" ADD CONSTRAINT "user_progression_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_reports" ADD CONSTRAINT "user_reports_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_reputation" ADD CONSTRAINT "user_reputation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_media_id_media_metadata_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_sessions" ADD CONSTRAINT "watch_sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_sessions" ADD CONSTRAINT "watch_sessions_media_id_media_metadata_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_content" ADD CONSTRAINT "media_content_media_id_media_metadata_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_external_ids" ADD CONSTRAINT "media_external_ids_media_id_media_metadata_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_mappings" ADD CONSTRAINT "media_mappings_media_id_media_metadata_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_relations" ADD CONSTRAINT "media_relations_source_id_media_metadata_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."media_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_relations" ADD CONSTRAINT "media_relations_target_id_media_metadata_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."media_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "af_user_time_idx" ON "activity_feed" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "af_time_idx" ON "activity_feed" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "up_total_exp_idx" ON "user_progression" USING btree ("total_exp");--> statement-breakpoint
CREATE INDEX "up_total_episodes_idx" ON "user_progression" USING btree ("total_episodes_watched");--> statement-breakpoint
CREATE INDEX "wh_user_updated_at_idx" ON "watch_history" USING btree ("userId","updatedAt");--> statement-breakpoint
CREATE INDEX "wh_user_media_ep_idx" ON "watch_history" USING btree ("userId","media_id","episode");--> statement-breakpoint
CREATE INDEX "wh_user_completed_idx" ON "watch_history" USING btree ("userId","completed","updatedAt");--> statement-breakpoint
CREATE INDEX "mei_media_id_idx" ON "media_external_ids" USING btree ("media_id");--> statement-breakpoint
CREATE INDEX "mei_anilist_id_idx" ON "media_external_ids" USING btree ("anilist_id");--> statement-breakpoint
CREATE INDEX "mei_tmdb_id_idx" ON "media_external_ids" USING btree ("tmdb_id");