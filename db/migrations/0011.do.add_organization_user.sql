
CREATE TABLE IF NOT EXISTS organization_user
(
  id uuid primary key DEFAULT uuid_generate_v4(), 
  user_id uuid not null references users(id),
  organization_id uuid not null references organizations(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
