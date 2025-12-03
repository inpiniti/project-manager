-- Variables Table
CREATE TABLE IF NOT EXISTS variables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES project_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  default_value TEXT,
  description TEXT,
  is_imported BOOLEAN DEFAULT FALSE,
  source_item_id UUID,
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Functions Table
CREATE TABLE IF NOT EXISTS functions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES project_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  return_type TEXT NOT NULL,
  parameters TEXT,
  description TEXT,
  is_imported BOOLEAN DEFAULT FALSE,
  source_item_id UUID,
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Objects Table
CREATE TABLE IF NOT EXISTS objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES project_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  properties TEXT,
  description TEXT,
  is_imported BOOLEAN DEFAULT FALSE,
  source_item_id UUID,
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Effects Table
CREATE TABLE IF NOT EXISTS effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES project_items(id) ON DELETE CASCADE,
  dependencies TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  is_imported BOOLEAN DEFAULT FALSE,
  source_item_id UUID,
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
