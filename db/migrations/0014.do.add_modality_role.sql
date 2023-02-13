CREATE TABLE IF NOT EXISTS role_user
(
  user_id uuid not null references users(id),
  role_id uuid not null references roles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  CONSTRAINT role_user_pkey PRIMARY KEY (user_id, role_id)
);