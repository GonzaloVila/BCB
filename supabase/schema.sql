-- ============================================================
--  BCB Multielectro - Supabase Schema
--  Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
--  TABLES
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  icon       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  description  TEXT,
  price        NUMERIC,
  brand        TEXT,
  condition    TEXT NOT NULL DEFAULT 'nuevo' CHECK (condition IN ('nuevo', 'usado')),
  category_id  UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  is_cover    BOOLEAN NOT NULL DEFAULT FALSE,
  "order"     INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
--  INDEXES
-- ─────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available) WHERE is_available = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_cover ON product_images(product_id, is_cover) WHERE is_cover = TRUE;

-- ─────────────────────────────────────────
--  UPDATED_AT TRIGGER
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────
--  ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────

ALTER TABLE categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images  ENABLE ROW LEVEL SECURITY;

-- Public read (anonymous & authenticated)
CREATE POLICY "categories_public_read"
  ON categories FOR SELECT USING (TRUE);

CREATE POLICY "products_public_read"
  ON products FOR SELECT USING (TRUE);

CREATE POLICY "product_images_public_read"
  ON product_images FOR SELECT USING (TRUE);

-- Write operations: only authenticated (admin) users
CREATE POLICY "categories_admin_write"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "products_admin_write"
  ON products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "product_images_admin_write"
  ON product_images FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
--  STORAGE BUCKET
--  Run this separately in Supabase Storage settings
--  or via the Dashboard:
--
--  1. Create bucket: product-images (public)
--  2. Add policy: allow public SELECT (anon read)
--  3. Add policy: allow authenticated INSERT/UPDATE/DELETE
-- ─────────────────────────────────────────

-- ─────────────────────────────────────────
--  SEED DATA (optional)
-- ─────────────────────────────────────────

INSERT INTO categories (name, slug, icon) VALUES
  ('Cocina',        'cocina',        '🍳'),
  ('Climatización', 'climatizacion', '❄️'),
  ('Lavado',        'lavado',        '🫧'),
  ('Refrigeración', 'refrigeracion', '🧊'),
  ('Audio',         'audio',         '🔊'),
  ('Televisión',    'television',    '📺'),
  ('Hogar',         'hogar',         '🏠')
ON CONFLICT (slug) DO NOTHING;
