import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  serial,
  unique,
  index,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

// Define ENUMs for Polymorphic design
export const mediaTypeEnum = pgEnum("media_type", ["ANIME", "MANGA", "LIVE_ACTION", "MOVIE"]);
export const contentTypeEnum = pgEnum("content_type", ["EPISODE", "CHAPTER", "MOVIE_FILE"]);
export const relationTypeEnum = pgEnum("relation_type", [
  "ADAPTATION",
  "PREQUEL",
  "SEQUEL",
  "SPIN_OFF",
]);

// 1. Universal Media Metadata
export const mediaMetadata = pgTable("media_metadata", {
  id: text("id").primaryKey(), // New UUID (orca_id)
  mediaType: mediaTypeEnum("media_type").notNull(),
  titleMain: text("title_main").notNull(),
  titleEnglish: text("title_english"),
  titleNative: text("title_native"),
  description: text("description"),
  genres: text("genres").array(),
  runtimeMinutes: integer("runtime_minutes"),
  trailerUrl: text("trailer_url"),
  coverImage: text("cover_image"),
  bannerImage: text("banner_image"),
  status: text("status"),
  releaseYear: integer("release_year"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// External Identifiers for mapping
export const mediaExternalIds = pgTable(
  "media_external_ids",
  {
    id: serial("id").primaryKey(),
    mediaId: text("media_id")
      .notNull()
      .references(() => mediaMetadata.id, { onDelete: "cascade" }),
    anilistId: integer("anilist_id"),
    malId: integer("mal_id"),
    tmdbId: integer("tmdb_id"),
    imdbId: text("imdb_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    mediaIdIdx: index("mei_media_id_idx").on(table.mediaId),
    anilistIdIdx: index("mei_anilist_id_idx").on(table.anilistId),
    tmdbIdIdx: index("mei_tmdb_id_idx").on(table.tmdbId),
  }),
);

// 2. Mappings to Providers (Scrapers)
export const mediaMappings = pgTable(
  "media_mappings",
  {
    id: serial("id").primaryKey(),
    mediaId: text("media_id")
      .notNull()
      .references(() => mediaMetadata.id, { onDelete: "cascade" }),
    providerId: text("provider_id").notNull(), // e.g., 'gogoanime', 'mangadex'
    providerContentId: text("provider_content_id").notNull(), // The ID on the provider's site
    url: text("url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    unq: unique().on(table.mediaId, table.providerId, table.providerContentId),
  }),
);

// 3. The Content (Episodes, Chapters, Movies)
export const mediaContent = pgTable(
  "media_content",
  {
    id: serial("id").primaryKey(),
    mediaId: text("media_id")
      .notNull()
      .references(() => mediaMetadata.id, { onDelete: "cascade" }),
    providerId: text("provider_id").notNull(),
    contentType: contentTypeEnum("content_type").notNull(),
    seasonNumber: integer("season_number"),
    number: integer("number").notNull(), // Episode 1, Chapter 50
    title: text("title"),
    description: text("description"),
    thumbnail: text("thumbnail"),
    url: text("url"),
    metadata: jsonb("metadata"),
    releaseDate: timestamp("release_date"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    unq: unique("media_content_unq_provider").on(table.mediaId, table.providerId, table.contentType, table.number),
    mediaIdIdx: index("idx_media_content_media_id").on(table.mediaId),
  }),
);

// 4. Cross-Media Relations
export const mediaRelations = pgTable(
  "media_relations",
  {
    id: serial("id").primaryKey(),
    sourceId: text("source_id")
      .notNull()
      .references(() => mediaMetadata.id, { onDelete: "cascade" }),
    targetId: text("target_id")
      .notNull()
      .references(() => mediaMetadata.id, { onDelete: "cascade" }),
    relationType: relationTypeEnum("relation_type").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    unq: unique().on(table.sourceId, table.targetId, table.relationType),
  }),
);
