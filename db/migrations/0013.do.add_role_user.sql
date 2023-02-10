CREATE TABLE IF NOT EXISTS modality_role
(
  id uuid primary key DEFAULT uuid_generate_v4(), 
  modality_id uuid not null references modalities(id),
  role_id uuid not null references roles(id),
  organization_id uuid not null references organizations(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);