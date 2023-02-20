CREATE TABLE IF NOT EXISTS conclusion_image (
  id uuid primary key DEFAULT uuid_generate_v4(),
  image_url varchar(2000),
  conclusion_id uuid not null references conclusion(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);