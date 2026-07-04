-- Seed data for development & testing
-- Run this AFTER 0000_init.sql

-- Insert store
INSERT INTO "stores" (id, owner_id, slug, name, description, address, whatsapp, is_published)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'seed-owner-1',
  'warung-bu-ana',
  'Warung Bu Ana',
  'Nasi kotak & catering rumahan untuk acara keluarga dan kantor.',
  'Jl. Merdeka No. 15, Jakarta Selatan',
  '6281234567890',
  true
);

-- Insert products
INSERT INTO "products" (store_id, name, price, description, category, images, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Nasi Goreng Spesial', 25000, 'Nasi goreng dengan telur, ayam suwir, dan kerupuk. Cocok untuk sarapan atau makan siang.', 'Makanan Berat', '{}', 1),
  ('00000000-0000-0000-0000-000000000001', 'Mie Ayam Bakso', 20000, 'Mie ayam dengan bakso sapi homemade dan pangsit goreng.', 'Makanan Berat', '{}', 2),
  ('00000000-0000-0000-0000-000000000001', 'Nasi Kuning Komplit', 30000, 'Nasi kuning dengan lauk lengkap: ayam goreng, telur balado, tempe orek, sambal goreng kentang.', 'Makanan Berat', '{}', 3),
  ('00000000-0000-0000-0000-000000000001', 'Es Teh Manis', 5000, 'Teh manis segar dengan es batu.', 'Minuman', '{}', 4),
  ('00000000-0000-0000-0000-000000000001', 'Es Jeruk', 7000, 'Jeruk peras segar dengan es batu.', 'Minuman', '{}', 5),
  ('00000000-0000-0000-0000-000000000001', 'Nasi Kotak (Catering)', 35000, 'Nasi kotak untuk acara. Minimal order 10 porsi. Menu bisa request.', 'Catering', '{}', 6);

-- Insert sample analytics
INSERT INTO "analytics_events" (store_id, type, product_id) VALUES
  ('00000000-0000-0000-0000-000000000001', 'visit', NULL),
  ('00000000-0000-0000-0000-000000000001', 'visit', NULL),
  ('00000000-0000-0000-0000-000000000001', 'visit', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000001', 'whatsapp_click', '00000000-0000-0000-0000-000000000001');
