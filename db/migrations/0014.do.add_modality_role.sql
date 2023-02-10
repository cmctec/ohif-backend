CREATE TABLE IF NOT EXISTS role_user
(
  id uuid primary key DEFAULT uuid_generate_v4(), 
  user_id uuid not null references users(id),
  role_id uuid not null references roles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);