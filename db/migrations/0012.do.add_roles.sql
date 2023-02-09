CREATE TABLE IF NOT EXISTS roles
(
  id uuid primary key DEFAULT uuid_generate_v4(), 
  
  slug varchar(200),
  name varchar(200),
  limited_to_modality boolean,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);