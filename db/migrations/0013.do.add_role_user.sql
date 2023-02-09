CREATE TABLE IF NOT EXISTS modality_role
(
  id uuid primary key DEFAULT uuid_generate_v4(), 
  modality_id uuid references modalities(id),
  role_id uuid references roles(id),
  organization_id uuid references organizations(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);