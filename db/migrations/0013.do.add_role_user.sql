CREATE TABLE IF NOT EXISTS modality_role (
  modality_id uuid not null references modalities(id),
  role_id uuid not null references roles(id),
  organization_id uuid not null references organizations(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  CONSTRAINT modality_role_pkey PRIMARY KEY (role_id, modality_id, organization_id)
);