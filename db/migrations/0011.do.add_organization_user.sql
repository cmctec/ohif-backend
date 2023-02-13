CREATE TABLE IF NOT EXISTS organization_user (
  user_id uuid references users(id),
  organization_id uuid references organizations(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  CONSTRAINT organization_user_pkey PRIMARY KEY (organization_id, user_id)
);