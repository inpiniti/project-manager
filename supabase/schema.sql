-- Variables Table
CREATE TABLE IF NOT EXISTS variables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  default_value TEXT,
  description TEXT,
  is_imported BOOLEAN DEFAULT FALSE,
  is_return BOOLEAN DEFAULT FALSE,
  source_item_id UUID,
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Functions Table
CREATE TABLE IF NOT EXISTS functions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  return_type TEXT NOT NULL,
  parameters TEXT,
  description TEXT,
  is_imported BOOLEAN DEFAULT FALSE,
  is_return BOOLEAN DEFAULT FALSE,
  source_item_id UUID,
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Objects Table
CREATE TABLE IF NOT EXISTS objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  properties TEXT,
  description TEXT,
  is_imported BOOLEAN DEFAULT FALSE,
  is_return BOOLEAN DEFAULT FALSE,
  source_item_id UUID,
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Effects Table
CREATE TABLE IF NOT EXISTS effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  dependencies TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  is_imported BOOLEAN DEFAULT FALSE,
  source_item_id UUID,
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add is_return column if not exists (Migration)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'variables' AND column_name = 'is_return') THEN
        ALTER TABLE variables ADD COLUMN is_return BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'functions' AND column_name = 'is_return') THEN
        ALTER TABLE functions ADD COLUMN is_return BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'objects' AND column_name = 'is_return') THEN
        ALTER TABLE objects ADD COLUMN is_return BOOLEAN DEFAULT FALSE;
    END IF;
END $$;
