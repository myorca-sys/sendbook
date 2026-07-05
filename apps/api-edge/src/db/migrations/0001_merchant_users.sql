-- Merchant users for dashboard authentication
CREATE TABLE IF NOT EXISTS "merchant_users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "name" text NOT NULL,
  "store_id" uuid REFERENCES "stores"("id") ON DELETE SET NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "merchant_users_email_idx" ON "merchant_users" ("email");

-- Seed admin user (password: admin123)
-- Format: base64(salt):base64(pbkdf2_hmac(salt, password))
INSERT INTO "merchant_users" (id, email, password_hash, name, store_id)
SELECT
  '00000000-0000-0000-0000-000000000002',
  'admin@sendbook.id',
  '1R51JQYPIUiUn4Rfc7GopQ==:pd/pSDN+xvD4QZmwHdE0o3/A0qTAikqxO48t6/qCq3w=',
  'Admin Sendbook',
  '00000000-0000-0000-0000-000000000001'
WHERE NOT EXISTS (SELECT 1 FROM merchant_users WHERE email = 'admin@sendbook.id');
