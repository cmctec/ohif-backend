CREATE TABLE IF NOT EXISTS users
(
  id uuid primary key DEFAULT uuid_generate_v4(),
  user_name varchar(200),
  full_name varchar(200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
