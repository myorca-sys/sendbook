-- Sendbook initial schema
-- Run this in Supabase SQL Editor after creating the project

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Stores table
CREATE TABLE IF NOT EXISTS "stores" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "owner_id" text NOT NULL UNIQUE,
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text,
  "logo_url" text,
  "address" text,
  "whatsapp" text NOT NULL,
  "maps_url" text,
  "theme" jsonb DEFAULT '{"primary":"#6366f1","accent":"#f59e0b"}'::jsonb,
  "social_links" jsonb DEFAULT '[]'::jsonb,
  "payment_methods" jsonb DEFAULT '[]'::jsonb,
  "is_published" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "stores_slug_idx" ON "stores" ("slug");
CREATE INDEX IF NOT EXISTS "stores_owner_idx" ON "stores" ("owner_id");

-- Products table
CREATE TABLE IF NOT EXISTS "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "store_id" uuid NOT NULL REFERENCES "stores"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "price" integer NOT NULL,
  "description" text,
  "images" text[] DEFAULT '{}',
  "category" text,
  "is_available" boolean DEFAULT true,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "products_store_idx" ON "products" ("store_id");

-- Analytics events table
CREATE TABLE IF NOT EXISTS "analytics_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "store_id" uuid NOT NULL REFERENCES "stores"("id") ON DELETE CASCADE,
  "type" text NOT NULL CHECK (type IN ('visit', 'whatsapp_click')),
  "product_id" uuid,
  "ip_hash" text,
  "user_agent" text,
  "created_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "analytics_store_created_idx" ON "analytics_events" ("store_id", "created_at");
